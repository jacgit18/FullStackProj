import React from "react"
import FormData from "form-data"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Prompt, useHistory } from "react-router-dom"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputAdornment from "@mui/material/InputAdornment"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

import FormBreakdowns from "./FormBreakdowns"
import FormMarkup from "./FormMarkup"
import Container from "../components/Container"
import FormSmallContainer from "../components/FormSmallContainer"
import FormWideButtons from "../components/FormWideButtons"
import FormWideContainer from "../components/FormWideContainer"
import SelectTicketsField from "../components/Fields/SelectTickets"
import TextAreaField from "../components/Fields/TextArea"
import TextField from "../components/Fields/Text"
import UploadMultipleField from "../components/Fields/UploadMultiple"
import api from "../libs/api"
import { loadEquipment } from "../store/features/equipmentSlice"
import { loadLabor } from "../store/features/laborSlice"
import { loadMaterial } from "../store/features/materialSlice"
import { listTickets, loadTickets } from "../store/features/ticketsSlice"

const today = new Date()

export default function CreateChangeOrder() {
  const dispatch = useDispatch()
  const history = useHistory()
  const project = useSelector((state) => state.project)
  const ticketList = useSelector(listTickets)
  const { enqueueSnackbar } = useSnackbar()
  const [itemNumber, setItemNumber] = React.useState()
  const [submitted, setSubmitted] = React.useState(false)
  const { t } = useTranslation("private")

  React.useEffect(() => {
    const loadNumber = async () => {
      const { data: number } = await api.get(`/project/${project.id}/number/changeorder`)
      return { number }
    }
    loadNumber()
      .then((response) => {
        setItemNumber(response.number.toString())
      })
      .catch((error) => console.log("error", error))

    dispatch(loadTickets())
    dispatch(loadLabor())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  React.useEffect(() => {
    dispatch(loadEquipment())
    dispatch(loadMaterial())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    window.onbeforeunload = function (e) {
      if (history.location.pathname.includes("changeorders/add")) {
        return ""
      } else {
        return null
      }
    }
  }, [history.location.pathname])

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        date_end: null,
        date_start: today.toDateString(),
        equipmentBreakdown: [],
        equipmentMarkup: [],
        exclusion: "",
        files: [
          {
            name: "",
          },
        ],
        invoice_number: "",
        laborBreakdown: [],
        laborMarkup: [],
        manual_total: "",
        materialBreakdown: [],
        materialMarkup: [],
        formMarkup: [],
        notes: "",
        number: "",
        pco_number: "",
        scope: "",
        subject: "",
        tickets: {},
        type: "tickets",
      }}
      validationSchema={Yup.object().shape({
        subject: Yup.string().required(t("form.message.subjectRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        // Set up the values for submission
        const submitValues = Object.keys(values)
          .filter(
            (key) =>
              !(
                key.includes("Breakdown") ||
                key.includes("Markup") ||
                key.includes("tickets") ||
                key.includes("files")
              ) && values[key]
          )
          .reduce((current, key) => {
            return Object.assign(current, { [key]: values[key] })
          }, {})

        // Co number
        submitValues.number = values.number ? values.number.toString() : itemNumber

        // Format dates
        const startDate = new Date(values.date_start)
        submitValues.date_start = startDate.toISOString()
        if (values.date_end) {
          const endDate = new Date(values.date_end)
          submitValues.date_end = endDate.toISOString()
        } else {
          delete submitValues.date_end
        }

        // Set up breakdowns & markups / tickets
        if (values.type === "tickets") {
          if (values.tickets) {
            submitValues.tickets = []
            Object.keys(values.tickets).forEach((id, index) => {
              const row = { id }
              if (values.tickets[id]) {
                row.total = values.tickets[id]
              }
              submitValues.tickets.push(row)
            })
          }
        } else if (values.type === "sum_total") {
          if (values.equipmentBreakdown.length) {
            submitValues.equipment = {
              breakdown: values.equipmentBreakdown.map((row) => {
                return {
                  quantity: row.quantity,
                  rate: row.rate,
                  type_id: row.type_id,
                }
              }),
            }
            if (values.type === "sum_rates") {
              submitValues.equipment.markup = values.equipmentMarkup.map((row) => ({
                amount: row.amount,
                title: row.title,
              }))
            }
          }
          if (values.laborBreakdown.length) {
            submitValues.labor = {
              breakdown: values.laborBreakdown.map((row) => {
                return {
                  date: new Date(row.date).toISOString(),
                  hours: row.hours,
                  quantity: row.quantity,
                  rate_type: row.rate_type,
                  type_id: row.type_id,
                }
              }),
            }
            if (values.type === "sum_rates") {
              submitValues.labor.markup = values.laborMarkup.map((row) => ({
                amount: row.amount,
                title: row.title,
              }))
            }
          }
          if (values.materialBreakdown.length) {
            submitValues.material = {
              breakdown: values.materialBreakdown.map((row) => {
                return {
                  quantity: row.quantity,
                  rate: row.rate,
                  type_id: row.type_id,
                }
              }),
            }
            if (values.type === "sum_rates") {
              submitValues.material.markup = values.materialMarkup.map((row) => ({
                amount: row.amount,
                title: row.title,
              }))
            }
          }
        }

        if (values.formMarkup.length) {
          submitValues.markup = values.formMarkup.map((row) => ({
            amount: row.amount,
            title: row.title,
          }))
        }

        api({
          method: "post",
          url: `/project/${project.id}/changeorder`,
          data: submitValues,
        })
          .then(async (response) => {
            if (response.data.id) {
              const itemInfo = response.data
              if (itemInfo.id) {
                // Doesn't fully reset currently
                // Some of the deeper values aren't fully tied to the form values
                // This might be good to review and cleanup at some point
                resetForm()
                enqueueSnackbar("Change Order Created", {
                  variant: "success",
                })
                // dispatch(addTicket(itemInfo))

                try {
                  if (values.files.length) {
                    for (let i = 0, l = values.files.length; i < l; i++) {
                      if (values.files[i] && values.files[i].name) {
                        const data = new FormData()
                        data.append(`file${i}`, values.files[i])
                        // const fileResponse =
                        await api({
                          method: "post",
                          url: `/project/${project.id}/ticket/${itemInfo.id}/file`,
                          data: data,
                        })
                        // dispatch(updateTicket(fileResponse.data))
                      }
                    }
                  }
                } catch (error) {
                  console.log("file error", error)
                }
                setSubmitted(true)
                history.push(`/0/project/${project.id}/changeorder/${itemInfo.id}`)
              } else {
                enqueueSnackbar(
                  "There were problems adding the change order. Attachments were not uploaded.",
                  {
                    variant: "error",
                  }
                )
                // history.push(`/0/project/${project.id}/changeorders`)
              }
            } else {
              enqueueSnackbar("There was a problem creating the ticket, code: 104", {
                variant: "error",
              })
            }
          })
          .catch((error) => {
            console.log("error", error)
            enqueueSnackbar("There was a problem creating the change order, code: 102", {
              variant: "error",
            })
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        isSubmitting,
        isValid,
        touched,
        values,
        setFieldValue,
        handleSubmit,
      }) => {
        return (
          <Form>
            <Container removeTop>
              <FormWideContainer>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={itemNumber ?? ""}
                      value={values.number}
                      label={t("form.label.coNumber")}
                      name="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      error={Boolean(touched.pco_number && errors.pco_number)}
                      helperText={touched.pco_number && errors.pco_number}
                      label={`${t("form.label.client")} ${t("form.label.coNumber")}`}
                      name="pco_number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pco_number}
                    />
                  </Grid>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        autoOk={true}
                        error={Boolean(touched.date_start && errors.date_start)}
                        helperText={touched.date_start && errors.date_start}
                        format="MM/dd/yyyy"
                        inputVariant="outlined"
                        label="Start Date"
                        mask="__/__/____"
                        maxDate={values.date_end ? new Date(values.date_end) : null}
                        name="date_start"
                        onChange={(date) => {
                          setFieldValue("date_start", date ? date.toString() : "")
                        }}
                        renderInput={(props) => <TextField {...props} />}
                        showTodayButton={true}
                        style={{ backgroundColor: "white", width: "100%" }}
                        value={values.date_start}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        autoOk={true}
                        error={Boolean(touched.date_end && errors.date_end)}
                        helperText={touched.date_end && errors.date_end}
                        format="MM/dd/yyyy"
                        inputVariant="outlined"
                        label="End Date"
                        mask="__/__/____"
                        minDate={values.date_start ? new Date(values.date_start) : null}
                        name="date_end"
                        onChange={(date) => {
                          setFieldValue("date_end", date ? date.toString() : "")
                        }}
                        renderInput={(props) => <TextField {...props} />}
                        showTodayButton={true}
                        style={{ backgroundColor: "white", width: "100%" }}
                        value={values.date_end}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </LocalizationProvider>

                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      error={Boolean(touched.subject && errors.subject)}
                      helperText={touched.subject && errors.subject}
                      label={t("form.label.subject")}
                      name="subject"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.subject}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextAreaField
                      error={Boolean(touched.scope && errors.scope)}
                      helperText={touched.scope && errors.scope}
                      label={t("form.label.scopeOfWork")}
                      name="scope"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.scope}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextAreaField
                      error={Boolean(touched.exclusion && errors.exclusion)}
                      helperText={touched.exclusion && errors.exclusion}
                      label={t("form.label.exclusion")}
                      name="exclusion"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.exclusion}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextAreaField
                      error={Boolean(touched.notes && errors.notes)}
                      helperText={touched.notes && errors.notes}
                      label={t("form.label.notes")}
                      name="notes"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.notes}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <UploadMultipleField
                      errors={errors}
                      label="Upload Files"
                      setFieldValue={setFieldValue}
                      touched={touched}
                      values={values}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={values.type}
                        // onChange={(e) => handleChange(e.target.value)}
                        onChange={(event) => {
                          setFieldValue("type", event.target.value)
                        }}
                      >
                        <FormControlLabel
                          value="tickets"
                          control={<Radio color="primary" />}
                          label={t("view.ChangeOrder.Switch.tm")}
                        />
                        <FormControlLabel
                          value="sum_rates"
                          control={<Radio color="primary" />}
                          label={t("view.ChangeOrder.Switch.rates")}
                        />
                        <FormControlLabel
                          value="sum_total"
                          control={<Radio color="primary" />}
                          label={t("view.ChangeOrder.Switch.totals")}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </FormWideContainer>
            </Container>

            {/* {values.type === "tickets" ? (
              <SelectTicketsField
                projectId={project.id}
                tickets={ticketList}
                setFieldValue={setFieldValue}
                value={values.tickets}
              />
            ) : (
              ""
            )} */}

            {(() => {
              switch (values.type) {
                case "tickets":
                  return (
                    <SelectTicketsField
                      projectId={project.id}
                      tickets={ticketList}
                      setFieldValue={setFieldValue}
                      value={values.tickets}
                    />
                  )
                case "sum_total":
                case "sum_rates":
                  return (
                    <>
                      {values.type === "sum_total" ? (
                        <Container removeTop>
                          <FormSmallContainer>
                            <Grid container spacing={3} justifyContent="center">
                              <Grid item xs={12}>
                                <TextField
                                  error={Boolean(touched.manual_total && errors.manual_total)}
                                  helperText={touched.manual_total && errors.manual_total}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">$</InputAdornment>
                                    ),
                                  }}
                                  label={t("view.ChangeOrder.Switch.total_cost")}
                                  name="manual_total"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.manual_total}
                                />
                              </Grid>
                            </Grid>
                          </FormSmallContainer>
                        </Container>
                      ) : (
                        ""
                      )}
                      <FormBreakdowns values={values} setFieldValue={setFieldValue} />
                    </>
                  )
                // case "sum_rates":
                //   return <FormBreakdowns values={values} setFieldValue={setFieldValue} />
                default:
                  return ""
              }
            })()}

            <FormMarkup values={values} setFieldValue={setFieldValue} tickets={ticketList} />
            <Prompt
              when={!submitted}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormWideButtons
              cancel={{
                action: () => {
                  history.push(`/0/project/${project.id}/changeorders`)
                },
                text: t("view.ChangeOrder.cancel"),
              }}
              submit={{
                disabled: !isValid,
                isSubmitting: isSubmitting,
                text: t("view.ChangeOrder.add"),
              }}
            />
          </Form>
        )
      }}
    </Formik>
  )
}
