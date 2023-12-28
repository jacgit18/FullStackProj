import React from "react"
import { Formik, Form } from "formik"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import Button from "../components/Button"
import Link from "../components/Link"
import PasswordField from "../components/Fields/Password"
import TextField from "../components/Fields/Text"
import { login } from "../store/features/userSlice" //loadUserCompanies,

export default function Signin() {
  const { t } = useTranslation("public")
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(t("form.message.emailRequired")),
        password: Yup.string().required(t("form.message.passRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        resetForm()
        dispatch(login(values))
          .then(() => {
            // Load the user's companies
            // Logged in users are redirected, before this can run
            // dispatch(loadUserCompanies())
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Trans
                    i18nKey="view.signin.switch"
                    t={t}
                    components={[<Link style={{ fontWeight: 700 }} to="/" />]}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  label={t("form.label.email")}
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordField
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  label={t("form.label.password")}
                  name="password"
                />
                <Typography sx={{ mt: 3, textAlign: "center" }}>
                  <Trans
                    i18nKey="view.signin.passwordReset"
                    t={t}
                    components={[<Link style={{ fontWeight: 700 }} to="/request-password-reset" />]}
                  />
                </Typography>
              </Grid>
              <Grid container item xs={12} justifyContent={isMobile ? "center" : "flex-end"}>
                <Button disabled={!isValid} isLoading={isSubmitting} type="submit">
                  {t("form.label.login")}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
