import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"

import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import SelectField from "../components/Fields/Select"
import SendIcon from "@mui/icons-material/Send"
import TextField from "../components/Fields/Text"
import api from "../libs/api"

export default function CreateInviteNewUser({ onClose, updateCompanyUsers }) {
  const company = useSelector((state) => state.company)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("private")
  // TODO - DEV-189 - Turn the create user -> user role dropdown options into an endpoint with more flexible logic
  const companyRoles = [
    {
      label: "Administrator",
      value: 1,
    },
    {
      label: "Superintendent",
      value: 2,
    },
  ]

  if (company.company_type === "trade") {
    companyRoles.push({
      label: "Crew",
      value: 3,
    })
  }

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        avatar_url: "",
        first_name: "",
        last_name: "",
        company_user_role_id: 1,
        phone: "",
        email: "",
      }}
      validationSchema={Yup.object().shape({
        first_name: Yup.string().required(t("form.message.first_nameRequired")),
        last_name: Yup.string().required(t("form.message.last_nameRequired")),
        email: Yup.string().required(t("form.message.emailRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        api({
          method: "post",
          url: `/companies/${company.id}/user`,
          data: values,
        })
          .then(async (response) => {
            onClose()
            if (response.data.id) {
              updateCompanyUsers(response.data)
              resetForm()
              enqueueSnackbar("User Invited!", {
                variant: "success",
              })
            } else {
              enqueueSnackbar("There was a problem inviting a user.", {
                variant: "error",
              })
            }
          })
          .catch((error) => {
            enqueueSnackbar("There was a problem inviting a user.", {
              variant: "error",
            })
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
    >
      {({ errors, handleBlur, handleChange, isSubmitting, isValid, touched, values }) => {
        return (
          <Form>
            <FormSmallContainer>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    autoFocus
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                    label="First Name"
                    name="first_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.first_name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                    label="Last Name"
                    name="last_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.last_name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SelectField
                    name="company_user_role_id"
                    label="Role"
                    options={companyRoles}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.company_user_role_id}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    label="Phone Number"
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="tel"
                    value={values.phone}
                  />
                </Grid>
                <Grid container justifyContent="flex-start" item xs={6}>
                  <Button onClick={onClose} color="secondary" variant="text">
                    Cancel
                  </Button>
                </Grid>
                <Grid container justifyContent="flex-end" item xs={6}>
                  <Button
                    disabled={!Object.keys(touched).length || !isValid}
                    isLoading={isSubmitting}
                    type="submit"
                    endIcon={<SendIcon />}
                  >
                    Send Invite
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
