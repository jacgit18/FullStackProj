import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Prompt, useHistory, useParams } from "react-router-dom"
import * as Yup from "yup"
import makeStyles from "@mui/styles/makeStyles"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import Typography from "@mui/material/Typography"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

import FormBreakdowns from "./FormBreakdowns"
import FormMarkup from "./FormMarkup"
import Container from "../components/Container"
import FilesRow from "../components/FilesRow"
import FormSmallContainer from "../components/FormSmallContainer"
import FormWideButtons from "../components/FormWideButtons"
import FormWideContainer from "../components/FormWideContainer"
import SelectTicketsField from "../components/Fields/SelectTickets"
import TextAreaField from "../components/Fields/TextArea"
import TextField from "../components/Fields/Text"
import UploadMultipleField from "../components/Fields/UploadMultiple"
import api from "../libs/api"
import { formatDateLong, formatMoney } from "../libs/format"
import {
  getChangeOrder,
  refreshChangeOrder,
  updateChangeOrder,
} from "../store/features/changeOrdersSlice"
import { loadEquipment } from "../store/features/equipmentSlice"
import { loadLabor } from "../store/features/laborSlice"
import { loadMaterial } from "../store/features/materialSlice"
import { listTickets, loadTickets } from "../store/features/ticketsSlice"

const useStyles = makeStyles((theme) => ({
  totals: {
    paddingTop: 10,
  },
}))

export default function UpdateChangeOrder() {
  // const type = "changeorder"
  const dispatch = useDispatch()
  const history = useHistory()
  const { changeorderId: itemId } = useParams()
  const project = useSelector((state) => state.project)
  const itemInfo = useSelector(getChangeOrder(itemId))
  const ticketList = useSelector(listTickets)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const { t } = useTranslation("private")
  const [updated, setUpdated] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    dispatch(refreshChangeOrder({ changeOrderId: itemId }))
    dispatch(loadTickets())
    dispatch(loadLabor())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  React.useEffect(() => {
    dispatch(loadEquipment())
    dispatch(loadMaterial())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ticket data

  return itemInfo ? (
    <Formik
      validateOnChange={false}
      initialValues={{
        date_end: null,
        date_start: formatDateLong(itemInfo.date_start),
        equipmentBreakdown: itemInfo.equipment.breakdown,
        equipmentMarkup: itemInfo.equipment.markup,
        exclusion: itemInfo.exclusion,
        files: [
          {
            name: "",
          },
        ],
        invoice_number: "",
        laborBreakdown: itemInfo.labor.breakdown,
        laborMarkup: itemInfo.labor.markup,
        manual_total: itemInfo.manual_total ? parseFloat(itemInfo.manual_total) : 0,
        materialBreakdown: itemInfo.material.breakdown,
        materialMarkup: itemInfo.material.markup,
        formMarkup: itemInfo.markup,
        notes: itemInfo.notes,
        number: itemInfo.number,
        pco_number: itemInfo.pco_number,
        scope: itemInfo.scope,
        subject: itemInfo.subject,
        tickets: ticketList
          .filter((ticket) => itemInfo.tickets.includes(ticket.id))
          .reduce((current, row) => ({ ...current, [row.id]: row.co_total }), {}),
        type: itemInfo.type,
      }}
      validationSchema={Yup.object().shape({
        subject: Yup.string().required(t("form.message.subjectRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        // Submit

        // Set up the values for submission
        const submitValues = Object.keys(values)
          .filter(
            (key) =>
              !(
                key.includes("Breakdown") ||
                key.includes("Markup") ||
                key.includes("tickets") ||
                key.includes("files")
              )
          )
          .reduce((current, key) => {
            return Object.assign(current, { [key]: values[key] })
          }, {})
        // Co number
        submitValues.number = values.number ? values.number : null

        // Format dates
        const startDate = new Date(values.date_start)
        submitValues.date_start = startDate.toISOString()
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

        // Set up breakdowns / tickets
        if (values.type === "tickets") {
          submitValues.tickets = Object.keys(values.tickets).map((ticket) => {
            if (values.tickets[ticket]) {
              return {
                id: ticket,
                total: values.tickets[ticket],
              }
            } else {
              return {
                id: ticket,
              }
            }
          })
        }

        if (values.type === "sum_total") {
          if (values.equipmentBreakdown.length) {
            submitValues.equipment = {
              breakdown: values.equipmentBreakdown.map((equipment) => {
                return {
                  quantity: equipment.quantity,
                  type_id: equipment.type_id,
                }
              }),
            }
          }
          if (values.laborBreakdown.length) {
            submitValues.labor = {
              breakdown: values.laborBreakdown.map((labor) => {
                return {
                  date: new Date(labor.date).toISOString(),
                  hours: labor.hours,
                  quantity: labor.quantity,
                  rate_type: labor.rate_type,
                  type_id: labor.type_id,
                }
              }),
            }
          }
          if (values.materialBreakdown.length) {
            submitValues.material = {
              breakdown: values.materialBreakdown.map((material) => {
                return {
                  quantity: material.quantity,
                  type_id: material.type_id,
                }
              }),
            }
          }
        }
        if (values.type === "sum_rates") {
          delete submitValues.manual_total
          if (values.equipmentBreakdown.length) {
            submitValues.equipment = {
              breakdown: values.equipmentBreakdown.map((equipment) => {
                return {
                  quantity: equipment.quantity,
                  rate: equipment.rate,
                  type_id: equipment.type_id,
                }
              }),
              markup: values.laborMarkup.map((markup) => {
                return {
                  amount: markup.amount,
                  title: markup.title,
                }
              }),
            }
          }
          if (values.laborBreakdown.length) {
            submitValues.labor = {
              breakdown: values.laborBreakdown.map((labor) => {
                return {
                  date: new Date(labor.date).toISOString(),
                  hours: labor.hours,
                  quantity: labor.quantity,
                  rate_type: labor.rate_type,
                  type_id: labor.type_id,
                }
              }),

              markup: values.laborMarkup.map((markup) => {
                return {
                  amount: markup.amount,
                  title: markup.title,
                }
              }),
            }
          }
          if (values.materialBreakdown.length) {
            submitValues.material = {
              breakdown: values.materialBreakdown.map((material) => {
                return {
                  quantity: material.quantity,
                  rate: material.rate,
                  type_id: material.type_id,
                }
              }),
              markup: values.materialMarkup.map((markup) => {
                return {
                  amount: markup.amount,
                  title: markup.title,
                }
              }),
            }
          }
        }

        api({
          method: "patch",
          url: `/project/${project.id}/changeorder/${itemInfo.id}`,
          data: submitValues,
        })
          .then((response) => {
            // Doesn't fully reset currently
            // Some of the deeper values aren't fully tied to the form values
            // This might be good to review and cleanup at some point
            resetForm()
            dispatch(updateChangeOrder(response.data))

            if (values.files.length) {
              for (let i = 0, l = values.files.length; i < l; i++) {
                if (values.files[i] && values.files[i].name) {
                  const data = new FormData()
                  data.append(`file${i}`, values.files[i])
                  api({
                    method: "post",
                    url: `/project/${project.id}/changeorder/${itemInfo.id}/file`,
                    data: data,
                  }).then((fileResponse) => {
                    dispatch(updateChangeOrder(fileResponse.data))
                  })
                }
              }
            }

            enqueueSnackbar("Change Order Updated", {
              variant: "success",
            })
            setUpdated(true)
            window.scrollTo(0, 0)
            history.push(`/0/project/${project.id}/changeorder/${response.data.id}`)
          })
          .catch((error) => {
            console.log("error", error)
            enqueueSnackbar("There was a problem updating the change order", {
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
                  <Grid></Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={values.number}
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

                  {itemInfo.files ? (
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
                    {itemInfo.co_total ? (
                      <Grid item container xs={12} justifyContent="flex-end">
                        <Grid item container justifyContent={"flex-end"} className={classes.totals}>
                          <Grid item xs={12} md={12} container justifyContent={"flex-end"}>
                            <Typography variant="body2">
                              {`${t(`view.ChangeOrder.Summary.co_total`)}: ${formatMoney(
                                itemInfo.co_total
                              )}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : (
                      <></>
                    )}
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
              when={!updated}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormWideButtons
              cancel={{
                action: () => {
                  history.push(`/0/project/${project.id}/changeorder/${itemId}`)
                  window.scrollTo(0, 0)
                },
                text: t("view.ChangeOrder.back"),
              }}
              submit={{
                disabled: !isValid,
                isSubmitting: isSubmitting,
                text: t("view.ChangeOrder.update"),
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
