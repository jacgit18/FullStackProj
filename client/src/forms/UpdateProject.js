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
import { updateProject } from "../store/features/userSlice"
import { setProject } from "../store/features/projectSlice"

export default function UpdateProject({ onCancel }) {
  const dispatch = useDispatch()
  const company = useSelector((state) => state.company)
  const project = useSelector((state) => state.project)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("private")

  const formValuesSameAsOriginal = (values) => {
    const formFields = ['address', 'name', 'number', 'disclaimer', 'date_start']
    for (let formField of formFields) {
      if (values[formField] !== project[formField]) {
        return false
      }
    }
    return true
  }

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        address: project.address ? project.address : "N/A",
        date_start: project.date_start,
        name: project.name ? project.name : "N/A",
        number: project.number ? project.number : "N/A",
        disclaimer: project.disclaimer ? project.disclaimer : "N/A"
      }}
      validationSchema={Yup.object().shape({
        date_start: Yup.string().required(t("form.message.dateStartRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        // Set up the values for submission
        const submitValues = values

        // Format dates
        const startDate = new Date(values.date_start)
        submitValues.date_start = startDate.toISOString()

        api({
          method: "patch",
          url: `/project/${project.id}`,
          headers: { company_id: company.id },
          data: submitValues,
        })
          .then(async (response) => {
            if (response.data.id) {
              dispatch(updateProject(response.data))
              // eslint-disable-next-line react-hooks/rules-of-hooks
              resetForm()
              enqueueSnackbar("Project Updated", {
                variant: "success",
              })
              dispatch(setProject(response.data))
              onCancel(false)
            } else {
              enqueueSnackbar("There was a problem updating the project, code: 104", {
                variant: "error",
              })
            }
          })
          .catch((error) => {
            console.log("error", error)
            enqueueSnackbar("There was a problem updating the project, code: 102", {
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
        setFieldValue
      }) => {
        return (
          <Form>
            <Prompt
              // when={Object.values(initialValues) === Object.values(submitValues)}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormSmallContainer>
              <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus name="name"
                      label="Project Name"
                      defaultValue={project.name ? project.name : "N/A"}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus name="number"
                      label="Project Number"
                      defaultValue={project.number ? project.number : "N/A"}
                      error={Boolean(touched.number && errors.number)}
                      helperText={touched.number && errors.number}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.number}
                    />
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid item xs={12}>
                        <DatePicker
                        autoOk={true}
                        error={Boolean(touched.date_start && errors.date_start)}
                        helperText={touched.date_start && errors.date_start}
                        defaultValue={project.date_start}
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
                  <Grid item xs={12}>
                    <TextAreaField
                      name="address"
                      label="Project Address"
                      defaultValue={project.address  ? project.address : "N/A"}
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextAreaField
                      name="disclaimer"
                      label="Time &amp; Materials Disclaimer"
                      defaultValue={project.disclaimer ? project.disclaimer : "N/A"}
                      error={Boolean(touched.disclaimer && errors.disclaimer)}
                      helperText={touched.disclaimer && errors.disclaimer}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.disclaimer}
                    />
                  </Grid>
                  <Grid container justifyContent="flex-start" item xs={6}>
                    <Button onClick={onCancel} color="secondary" variant="text">
                        Cancel
                    </Button>
                  </Grid>
                  <Grid container justifyContent="flex-end" item xs={6}>
                    <Button
                      disabled={! isValid || formValuesSameAsOriginal(values)}
                      isLoading={isSubmitting}
                      type="submit"
                      endIcon={<AddIcon />}
                      >
                      Update
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
