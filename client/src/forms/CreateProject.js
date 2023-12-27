import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Prompt } from "react-router-dom"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AddIcon from "@mui/icons-material/Add"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import TextField from "../components/Fields/Text"
import TextAreaField from "../components/Fields/TextArea"
import api from "../libs/api"
import { addProject } from "../store/features/userSlice"

const today = new Date()

export default function CreateProject({ onCancel }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const company = useSelector((state) => state.company)
  const { enqueueSnackbar } = useSnackbar()
  // const [submitted, setSubmitted] = React.useState(false)
  const { t } = useTranslation("private")

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        address: "",
        date_start: today.toDateString(),
        name: "",
        number: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(t("form.message.nameRequired")),
        address: Yup.string().required(t("form.message.addressRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        // Set up the values for submission
        const submitValues = values

        // Format dates
        const startDate = new Date(values.date_start)
        submitValues.date_start = startDate.toISOString()

        // Add author
        submitValues.created_by = user.id

        api({
          method: "post",
          url: `/project`,
          headers: { company_id: company.id },
          data: submitValues,
        })
          .then(async (response) => {
            if (response.data.id) {
              dispatch(addProject(response.data))
              resetForm()
              enqueueSnackbar("Project Created", {
                variant: "success",
              })
              // setSubmitted(true)
              onCancel(false)
            } else {
              enqueueSnackbar("There was a problem creating the project, code: 104", {
                variant: "error",
              })
            }
          })
          .catch((error) => {
            console.log("error", error)
            enqueueSnackbar("There was a problem creating the project, code: 102", {
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
      }) => {
        return (
          <Form>
            <Prompt
              when={Object.keys(touched).length > 0}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormSmallContainer>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    label={t("form.label.projectName")}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.number && errors.number)}
                    helperText={touched.number && errors.number}
                    label={t("form.label.projectNumber")}
                    name="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.number}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextAreaField
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                    label={t("form.label.projectAddress")}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                  />
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={12}>
                    <DatePicker
                      autoOk={true}
                      error={Boolean(touched.date_start && errors.date_start)}
                      helperText={touched.date_start && errors.date_start}
                      format="MM/dd/yyyy"
                      inputVariant="outlined"
                      label="Start Date"
                      mask="__/__/____"
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
                </LocalizationProvider>
                <Grid container justifyContent="flex-start" item xs={6}>
                  <Button onClick={onCancel} color="secondary" variant="text">
                    Cancel
                  </Button>
                </Grid>
                <Grid container justifyContent="flex-end" item xs={6}>
                  <Button
                    disabled={!Object.keys(touched).length || !isValid}
                    isLoading={isSubmitting}
                    type="submit"
                    endIcon={<AddIcon />}
                  >
                    {t("view.Projects.createProject")}
                  </Button>
                </Grid>
              </Grid>
            </FormSmallContainer>
          </Form>
        )
      }}
    </Formik>
  )
}
