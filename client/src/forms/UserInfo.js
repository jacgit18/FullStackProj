import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Trans, useTranslation } from "react-i18next"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import Button from "../components/Button"
import Link from "../components/Link"
import PasswordField from "../components/Fields/Password"
import TextField from "../components/Fields/Text"
import { setUser } from "../store/features/signupSlice"

export default function UserInfo() {
  const { t } = useTranslation("public")
  const dispatch = useDispatch()
  const user = useSelector((state) => state.signup.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Formik
      initialValues={{
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.position,
        password: user.password,
        type: user.type,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(t("form.message.emailRequired")),
        firstName: Yup.string().required(t("form.message.firstRequired")),
        lastName: Yup.string().required(t("form.message.lastRequired")),
        password: Yup.string()
          .required(t("form.message.passRequired"))
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
            t("form.message.passFormula")
          ),
      })}
      onSubmit={async (values) => {
        dispatch(setUser(values))
      }}
    >
      {({ errors, handleBlur, isSubmitting, isValid, touched, values, setFieldValue }) => {
        const handleChange = (event) => {
          setFieldValue(event.target.name, event.target.value)
          dispatch(
            setUser({
              ...user,
              [event.target.name]: event.target.value,
            })
          )
        }
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
                    i18nKey="view.signup.switch"
                    t={t}
                    components={[<Link to="/login" style={{ fontWeight: 700 }} />]}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  label={t("form.label.firstName")}
                  name="firstName"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  label={t("form.label.lastName")}
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
                <TextField
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  label={t("form.label.phone")}
                  name="phone"
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
              </Grid>
              <Grid container item xs={12} justifyContent="flex-end">
                <FormControlLabel
                  label={t("form.label.type")}
                  labelPlacement={isMobile ? "top" : "start"}
                  control={
                    <ToggleButtonGroup
                      exclusive
                      name="type"
                      onChange={(event, value) => {
                        if (value) {
                          setFieldValue("type", value)
                          dispatch(
                            setUser({
                              ...user,
                              type: value,
                            })
                          )
                        }
                      }}
                      value={values.type}
                      sx={{
                        ml: "10px",
                        mr: "10px",
                        width: { xs: "100%", md: "auto" },
                      }}
                    >
                      <ToggleButton value="trade">{t("form.label.trade")}</ToggleButton>
                      <ToggleButton value="cm">{t("form.label.cm")}</ToggleButton>
                    </ToggleButtonGroup>
                  }
                />
              </Grid>
              <Grid container justifyContent={isMobile ? "center" : "flex-end"} item xs={12}>
                <Typography align={isMobile ? "center" : "right"} sx={{ mb: 1, width: "100%" }}>
                  {t("form.emailWillRequired")}
                </Typography>
                <Button disabled={!isValid} isLoading={isSubmitting} type="submit">
                  {t("form.label.signup")}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
