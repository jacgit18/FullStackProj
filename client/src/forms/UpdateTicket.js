import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Prompt, useHistory, useParams } from "react-router-dom"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import Typography from "@mui/material/Typography"

import FormBreakdowns from "./FormBreakdowns"
import FormMarkup from "./FormMarkup"
import Container from "../components/Container"
import FilesRow from "../components/FilesRow"
import { formatDateLong } from "../libs/format"
import FormWideButtons from "../components/FormWideButtons"
import FormWideContainer from "../components/FormWideContainer"
import Switch from "../components/Fields/Switch"
import TextAreaField from "../components/Fields/TextArea"
import TextField from "../components/Fields/Text"
import UploadMultipleField from "../components/Fields/UploadMultiple"
import api from "../libs/api"
import { loadEquipment } from "../store/features/equipmentSlice"
import { loadLabor } from "../store/features/laborSlice"
import { loadMaterial } from "../store/features/materialSlice"
import { getTicket, refreshTicket, updateTicket } from "../store/features/ticketsSlice"

export default function UpdateTicket() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { ticketId: itemId } = useParams()
  const project = useSelector((state) => state.project)
  const itemInfo = useSelector(getTicket(itemId))
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("private")
  const [updated, setUpdated] = React.useState(false)

  React.useEffect(() => {
    dispatch(refreshTicket({ ticketId: itemId }))
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
      if (history.location.pathname.includes("/edit")) {
        return ""
      } else {
        return null
      }
    }
  }, [history.location.pathname])

  return itemInfo && itemInfo.subject ? (
    <Formik
      validateOnChange={false}
      initialValues={{
        date_end: null,
        date_start: formatDateLong(itemInfo.date_start),
        equipmentBreakdown: itemInfo.equipment.breakdown,
        equipmentMarkup: itemInfo.equipment.markup,
        files: [
          {
            name: "",
          },
        ],
        formMarkup: itemInfo.markup,
        invoice_number: itemInfo.invoice_number,
        isAddCosts: itemInfo.type !== "tm" ? true : false,
        isLumpSum: itemInfo.type === "sum_total" ? true : false,
        is_signed: itemInfo.is_signed ? true : false,
        laborBreakdown: itemInfo.labor.breakdown,
        laborMarkup: itemInfo.labor.markup,
        lumpSumTotal: "",
        manual_total: itemInfo.manual_total,
        materialBreakdown: itemInfo.material.breakdown,
        materialMarkup: itemInfo.material.markup,
        notes: itemInfo.notes,
        number: itemInfo.number,
        pco_number: itemInfo.pco_number,
        description: itemInfo.description,
        subject: itemInfo.subject,
        type: itemInfo.type,
      }}
      validationSchema={Yup.object().shape({
        description: Yup.string().required(t("form.message.descriptionRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        // Set up the values for submission
        const submitValues = Object.keys(values)
          .filter(
            (key) =>
              !(
                key.includes("Breakdown") ||
                key.includes("Markup") ||
                key.includes("files") ||
                key === "isAddCosts" ||
                key === "isLumpSum"
              ) && values[key] !== itemInfo[key]
          )
          .reduce((current, key) => {
            return Object.assign(current, { [key]: values[key] })
          }, {})

        // Format dates
        const startDate = new Date(values.date_start)
        if (startDate.toISOString() !== values.date_start) {
          submitValues.date_start = startDate.toISOString()
        }
        if (values.date_end) {
          const endDate = new Date(values.date_end)
          submitValues.date_end = endDate.toISOString()
        } else {
          delete submitValues.date_end
        }

        if (values.formMarkup.length) {
          submitValues.markup = values.formMarkup.map((markup) => {
            return {
              amount: markup.amount,
              title: markup.title,
            }
          })
        }

        // Set up breakdowns & markups
        if (values.equipmentBreakdown.length) {
          submitValues.equipment = {
            breakdown: values.equipmentBreakdown.map((row) => {
              const output = {
                quantity: row.quantity,
                type_id: row.type_id,
              }
              if (row.rate) {
                output.rate = row.rate
              }
              return output
            }),
          }
          if (values.type === "sum_rates") {
            submitValues.equipment.markup = values.equipmentMarkup.map((row) => ({
              amount: row.amount,
              title: row.title,
            }))
          }
        } else {
          submitValues.equipment = {
            breakdown: [],
            markup: [],
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
        } else {
          submitValues.labor = {
            breakdown: [],
            markup: [],
          }
        }
        if (values.materialBreakdown.length) {
          submitValues.material = {
            breakdown: values.materialBreakdown.map((row) => {
              const output = {
                quantity: row.quantity,
                type_id: row.type_id,
              }
              if (row.rate) {
                output.rate = row.rate
              }
              return output
            }),
          }
          if (values.type === "sum_rates") {
            submitValues.material.markup = values.materialMarkup.map((row) => ({
              amount: row.amount,
              title: row.title,
            }))
          }
        } else {
          submitValues.material = {
            breakdown: [],
            markup: [],
          }
        }

        if (values.formMarkup.length) {
          submitValues.markup = values.formMarkup.map((row) => ({
            amount: row.amount,
            title: row.title,
          }))
        } else {
          submitValues.markup = []
        }

        api({
          method: "patch",
          url: `/project/${project.id}/ticket/${itemId}`,
          data: submitValues,
        })
          .then((response) => {
            //   const itemInfo = response.data
            // if (itemInfo.id) {
            // Doesn't fully reset currently
            // Some of the deeper values aren't fully tied to the form values
            // This might be good to review and cleanup at some point
            resetForm()
            dispatch(updateTicket(response.data))

            if (values.files.length) {
              for (let i = 0, l = values.files.length; i < l; i++) {
                if (values.files[i] && values.files[i].name) {
                  const data = new FormData()
                  data.append(`file${i}`, values.files[i])
                  api({
                    method: "post",
                    url: `/project/${project.id}/ticket/${itemInfo.id}/file`,
                    data: data,
                  }).then((fileResponse) => {
                    dispatch(updateTicket(fileResponse.data))
                  })
                }
              }
            }

            enqueueSnackbar("Ticket Updated", {
              variant: "success",
            })
            setUpdated(true)
            window.scrollTo(0, 0)
            history.push(`/0/project/${project.id}/ticket/${itemId}`)
          })
          .catch((error) => {
            console.log("error", error)
            enqueueSnackbar("There was a problem updating the ticket", {
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
                      placeholder={itemInfo ? itemInfo.number : ""}
                      value={values.number}
                      label={t("form.label.ticketNumber")}
                      name="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      error={Boolean(touched.pco_number && errors.pco_number)}
                      helperText={touched.pco_number && errors.pco_number}
                      label={`${t("form.label.pco")} ${t("form.label.number")}`}
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
                    <TextAreaField
                      autoFocus
                      error={Boolean(touched.description && errors.description)}
                      helperText={touched.description && errors.description}
                      label={t("form.label.workDescription")}
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
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
                    <TextField
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
                    <TextField
                      error={Boolean(touched.invoice_number && errors.invoice_number)}
                      helperText={touched.invoice_number && errors.invoice_number}
                      label={t("form.label.invoice_number")}
                      name="invoice_number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.invoice_number}
                    />
                  </Grid>

                  {itemInfo.files.length !== 0 ? (
                    <Grid container item xs={12}>
                      <Typography variant="h2">Attachments</Typography>
                      <FilesRow files={itemInfo.files} editable={true} />
                    </Grid>
                  ) : (
                    ""
                  )}

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
                    <InputLabel>{t("form.label.signedTicket")}</InputLabel>
                    <Switch />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <InputLabel>{t("form.label.addCosts")}</InputLabel>
                    <Switch
                      checked={values.isAddCosts}
                      name="isAddCosts"
                      onBlur={handleBlur}
                      onChange={(value) => {
                        const newValue = !values.isAddCosts
                        const newType =
                          newValue && values.isLumpSum ? "sum_total" : newValue ? "sum_rates" : "tm"
                        setFieldValue("isAddCosts", newValue)
                        setFieldValue("type", newType)
                      }}
                    />
                  </Grid>

                  {values.isAddCosts ? (
                    <Grid item xs={12} md={3}>
                      <InputLabel>{t("form.label.switchLumpSum")}</InputLabel>
                      <Switch
                        checked={values.isLumpSum}
                        name="isLumpSum"
                        onBlur={handleBlur}
                        onChange={(value) => {
                          const newValue = !values.isLumpSum
                          const newType = newValue
                            ? "sum_total"
                            : values.isAddCosts
                            ? "sum_rates"
                            : "tm"
                          setFieldValue("isLumpSum", newValue)
                          setFieldValue("type", newType)
                        }}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {values.isAddCosts && values.isLumpSum ? (
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.manual_total && errors.manual_total)}
                        helperText={touched.manual_total && errors.manual_total}
                        label={t("form.label.total")}
                        name="manual_total"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.manual_total}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Grid>
              </FormWideContainer>
            </Container>

            <FormBreakdowns values={values} setFieldValue={setFieldValue} />
            {values.type !== "tm" ? (
              <FormMarkup values={values} setFieldValue={setFieldValue} />
            ) : (
              <></>
            )}
            <Prompt
              when={!updated}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormWideButtons
              cancel={{
                action: () => {
                  window.scrollTo(0, 0)
                  history.push(`/0/project/${project.id}/ticket/${itemId}`)
                },
                text: t("view.Tickets.go_back"),
              }}
              submit={{
                disabled: !isValid,
                isSubmitting: isSubmitting,
                text: t("view.Tickets.update"),
              }}
            />
          </Form>
        )
      }}
    </Formik>
  ) : (
    <></>
  )
}
