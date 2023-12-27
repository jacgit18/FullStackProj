import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Prompt, useHistory } from "react-router-dom"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

import FormBreakdowns from "./FormBreakdowns"
import FormMarkup from "./FormMarkup"
import Container from "../components/Container"
import FormWideButtons from "../components/FormWideButtons"
import FormWideContainer from "../components/FormWideContainer"
import Switch from "../components/Fields/Switch"
import TextAreaField from "../components/Fields/TextArea"
import TextField from "../components/Fields/Text"
import UploadMultipleField from "../components/Fields/UploadMultiple"
import { addTicket } from "../store/features/ticketsSlice"
import {getNextTicketNumber, uploadTicketFiles} from "../api/ticket"
import {submitTicket} from "./CreateTicket.submit"

const today = new Date()

export default function CreateTicket() {
  const dispatch = useDispatch()
  const history = useHistory()
  const project = useSelector((state) => state.project)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [nextTicketNumber, setNextTicketNumber] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const { t } = useTranslation("private")

  const allowedToAddCosts = project?.project_user_role && project.project_user_role !== 'crew'

  React.useEffect(() => {
    if (project.id) {
      getNextTicketNumber(project.id)
        .then((nextNumber) => {
          setNextTicketNumber(nextNumber)
        })
        .catch((error) => console.log("error", error))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  React.useEffect(() => {
    window.onbeforeunload = function (e) {
      if (history.location.pathname.includes("tickets/add")) {
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
        description: "",
        equipmentBreakdown: [],
        equipmentMarkup: [],
        files: [
          {
            name: "",
          },
        ],
        formMarkup: [],
        invoice_number: "",
        isAddCosts: false,
        isLumpSum: false,
        is_signed: "",
        laborBreakdown: [],
        laborMarkup: [],
        lumpSumTotal: "",
        manual_total: "",
        materialBreakdown: [],
        materialMarkup: [],
        notes: "",
        number: "",
        pco_number: "",
        subject: "",
        type: "tm",
      }}
      validationSchema={Yup.object().shape({
        description: Yup.string().required(t("form.message.descriptionRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
          submitTicket(values, nextTicketNumber, project.id)
          .then(async (response) => {
            if (response.data.id) {
              const newTicket = response.data
              // TODO Doesn't fully reset currently
              //  Some of the deeper values aren't fully tied to the form values
              //  This might be good to review and cleanup at some point
              resetForm()
              enqueueSnackbar("Ticket Created", {
                variant: "success",
              })
              dispatch(addTicket(newTicket))
              // need to check that files actually exist
              if (values.files.length > 0 && !!values.files[0].name) {
                const uploadingKey = enqueueSnackbar('Uploading files...', {variant: 'info'})
                const fileUploadMessage = await uploadTicketFiles(values.files, project.id, newTicket.id)
                closeSnackbar(uploadingKey)
                enqueueSnackbar(
                  fileUploadMessage.message,
                  {
                    variant: fileUploadMessage.error ? 'error' : 'success',
                    style: {whiteSpace: 'pre-wrap'}
                  }
                )
              }
              setSubmitted(true)
              // TODO DEV-187 once we have the individual ticket page, we should be routed there after creation
              history.push(`/0/project/${project.id}/tickets`)
            } else {
              enqueueSnackbar("There was a problem creating the ticket, code: 104", {
                variant: "error",
              })
            }
          })
          .catch(() => {
            enqueueSnackbar("There was a problem creating the ticket, code: 102", {
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
                      placeholder={nextTicketNumber ?? ""}
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

                  <Grid item xs={12}>
                    <UploadMultipleField
                      errors={errors}
                      label="Upload Files"
                      setFieldValue={setFieldValue}
                      touched={touched}
                      values={values}
                    />
                  </Grid>

                  {/* TODO DEV-182 add is signed back into form <Grid item xs={12}>*/}
                  {/*  <InputLabel>{t("form.label.signedTicket")}</InputLabel>*/}
                  {/*  <Switch*/}
                  {/*    checked={values.is_signed ? true : false}*/}
                  {/*    name="is_signed"*/}
                  {/*    onBlur={handleBlur}*/}
                  {/*    onChange={handleChange}*/}
                  {/*  />*/}
                  {/*</Grid>*/}

                  {allowedToAddCosts ?
                    <Grid item xs={12} md={3}>
                      <InputLabel>{t("form.label.addCosts")}</InputLabel>
                      <Switch
                        checked={values.isAddCosts ? true : false}
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
                    : <></>
                  }

                  {values.isAddCosts ? (
                    <Grid item xs={12} md={3}>
                      <InputLabel>{t("form.label.switchLumpSum")}</InputLabel>
                      <Switch
                        checked={values.isLumpSum ? true : false}
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
              when={!submitted}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormWideButtons
              cancel={{
                action: () => {
                  history.push(`/0/project/${project.id}/tickets`)
                },
                text: t("view.ChangeOrder.cancel"),
              }}
              submit={{
                disabled: !isValid,
                isSubmitting: isSubmitting,
                text: t("view.Tickets.createTicket"),
              }}
            />
          </Form>
        )
      }}
    </Formik>
  )
}
