import React from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useSnackbar } from "notistack"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import Button from "../components/Button"
import Link from "../components/Link"
import PasswordField from "../components/Fields/Password"
import { newPassword } from "../store/features/userSlice"

export default function NewPassword() {
  const { t } = useTranslation("public")
  const dispatch = useDispatch()
  const { token } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Formik
      initialValues={{
        password: "",
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .required(t("form.message.passRequired"))
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
            t("form.message.passFormula")
          ),
      })}
      validateOnMount={true}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        dispatch(
          newPassword({
            ...values,
            token,
          })
        )
          .then((data) => {
            if (data.meta.requestStatus === "rejected") {
              enqueueSnackbar("The link has expired. Please resubmit your email.", {
                variant: "error",
              })
              history.push("/request-password-reset")
            } else {
              enqueueSnackbar("Password successfully updated.", {
                variant: "success",
              })
            }
            resetForm()
          })
          .catch((error) => {
            console.log(error, "error")
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
    >
      {({ errors, handleBlur, handleChange, isSubmitting, isValid, touched, values }) => {
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
                    i18nKey="view.requestPasswordReset.login"
                    t={t}
                    components={[<Link to="/login" style={{ fontWeight: 700 }} />]}
                  />
                </Typography>
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
              </Grid>
              <Grid item xs={12}>
                <Button isLoading={isSubmitting} type="submit">
                  {t("form.label.signup")}
                </Button>
              </Grid>

              <Grid container justifyContent={isMobile ? "center" : "flex-end"} item xs={12}>
                <Button disabled={!isValid} isLoading={isSubmitting} type="submit">
                  {t("view.newPassword.resetPassword")}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
