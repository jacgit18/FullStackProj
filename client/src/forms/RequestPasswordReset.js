import React from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useSnackbar } from "notistack"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import Button from "../components/Button"
import Link from "../components/Link"
import TextField from "../components/Fields/Text"
import { resetPassword } from "../store/features/userSlice" //loadUserCompanies,

export default function RequestPasswordReset() {
  const { t } = useTranslation("public")
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(t("form.message.emailRequired")),
      })}
      validateOnMount={true}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        resetForm()
        dispatch(resetPassword(values))
          .then(() => {
            enqueueSnackbar("A reset password link has been sent to your email.", {
              variant: "success",
            })
            history.push("/login")
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
                    components={[<Link style={{ fontWeight: 700 }} to="/login" />]}
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
              <Grid container justifyContent={isMobile ? "center" : "flex-end"} item xs={12}>
                <Button disabled={!isValid} isLoading={isSubmitting} type="submit">
                  {t("view.requestPasswordReset.Password")}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
