import React from "react"
import FormData from "form-data"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import { MenuItem } from "@mui/material"
import Typography from "@mui/material/Typography"
import NextIcon from "@mui/icons-material/ArrowForwardIos"

import Button from "../components/Button"
import SelectField from "../components/Fields/Select"
import TextAreaField from "../components/Fields/TextArea"
import UploadMultipleField from "../components/Fields/UploadMultiple"
import TextField from "../components/Fields/Text"
import api from "../libs/api"

const isEmpty = (array) => {
  return !array || !array.length || (Array.isArray(array) && array.every(isEmpty))
}

export default function Send({ clientUsers, internalUsers, requestUrl, setter, toggle }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t } = useTranslation("private")
  const { enqueueSnackbar } = useSnackbar()
  const isTicket = requestUrl.includes("ticket")
  const translateRoles = {
    clients: "Contacts",
    crew: "Crew",
    pm: "Manager",
    super: "Superintendent",
  }
  const groupByRole = (users) =>
    users.reduce(
      (current, obj) => ({ ...current, [obj["role"]]: (current[obj["role"]] || []).concat(obj) }),
      {}
    )

  const groupedInternalUsers = groupByRole(internalUsers)
  const groupedClientUsers =
    clientUsers.length && clientUsers[0].role ? groupByRole(clientUsers) : { clients: clientUsers }

  const notificationSuccesful = () => {
    enqueueSnackbar("Sent successfully", {
      variant: "success",
    })
  }

  const notificationError = () => {
    enqueueSnackbar("Unable to send", {
      variant: "error",
    })
  }

  const review_type = isTicket
    ? [
        { label: "Time and Materials", name: "tm" },
        { label: "Cost", name: "cost" },
      ].map((item, index) => {
        item.value = index + 1
        return item
      })
    : []

  return (
    <Formik
      initialValues={{
        contacts: [],
        files: [
          {
            name: "",
          },
        ],
        internal: [],
        notes: "",
        review: false,
        review_type: "tm", //cost, tm
        toggle: false,
      }}
      validationSchema={Yup.object().shape({
        toggle: Yup.bool().when(["contacts", "internal"], {
          is: (contacts, internal) => contacts.length === 0 && internal.length === 0, //you can return a function
          then: Yup.bool().oneOf([true], "There must be a recipent"),
          otherwise: Yup.bool(),
        }),
      })}
      onSubmit={(values, { resetForm }) => {
        const data = new FormData()

        if (values.contacts) {
          values.contacts.forEach((row) => {
            if (row) {
              if (!Array.isArray(row)) {
                data.append(`contacts[]`, row)
              } else {
                row.forEach((contact) => {
                  data.append(`contacts[]`, contact)
                })
              }
            }
          })
        }

        if (values.internal) {
          values.internal.forEach((row) => {
            if (row) {
              if (!Array.isArray(row)) {
                data.append(`internal[]`, row)
              } else {
                row.forEach((contact) => {
                  data.append(`internal[]`, contact)
                })
              }
            }
          })
        }

        if (values.files.length && values.files[0].name !== "") {
          for (let i = 0, l = values.files.length; i < l; i++) {
            if (values.files[i]) {
              data.append(`files${i}`, values.files[i])
            }
          }
        }

        data.append("copyme", values.toggle)
        data.append("message", values.notes)
        // data.append("file", values.file)
        if (isTicket === true) {
          data.append("review", values.review)
          if (values.review === true) {
            data.append("review_type", values.review_type)
          }
        }

        // for (var pair of data.entries()) {
        //   console.log(pair[0] + ", " + pair[1])
        // }

        api
          .post(requestUrl, data)
          .then(function (response) {
            if (setter && response.data.id) {
              setter(response.data)
            }
            notificationSuccesful(isTicket)
            toggle()
            resetForm()
          })
          .catch(function (error) {
            console.log("error", error)
            notificationError(isTicket)
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
        resetForm,
        submitForm,
      }) => {
        // const handleChange = (event) => {
        //   setFieldValue(event.target.name, event.target.value)
        // }

        return (
          <Form>
            <Grid item container xs={12} spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h2" align={isMobile ? "center" : "left"}>
                  {t("view.ChangeOrder.Send.recipients")}
                </Typography>
              </Grid>

              {clientUsers.length ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4">Client</Typography>
                  </Grid>
                  {Object.keys(groupedClientUsers).map((role, index) => {
                    return groupedClientUsers[role] ? (
                      <Grid item key={index} xs={12}>
                        <SelectField
                          label={translateRoles[role]}
                          multiple={true}
                          name={`contacts[${index}]`}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          options={groupedClientUsers[role].map((user) => ({
                            label: `${user.name} (${user.email})`,
                            value: user.id,
                          }))}
                          value={values.contacts[index] || []}
                        />
                      </Grid>
                    ) : (
                      ""
                    )
                  })}
                </>
              ) : (
                <></>
              )}

              {isTicket && !isEmpty(values.contacts) ? (
                <>
                  <Grid item xs={12} md={5}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.review}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name="review"
                        />
                      }
                      label={t("view.Tickets.request_review")}
                    />
                  </Grid>

                  {values.review === true ? (
                    <Grid item xs={12} md={7}>
                      <TextField
                        label={t("view.Tickets.review_type")}
                        name="review_type"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        multiline
                        minRows={1}
                        defaultValue="tm"
                      >
                        {review_type.map((option) => (
                          <MenuItem key={option.value} value={option.name}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {internalUsers.length ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4">Internal</Typography>
                  </Grid>
                  {Object.keys(groupedInternalUsers).map((role, index) => {
                    return groupedClientUsers[role] ? (
                      <Grid item key={index} xs={12}>
                        <SelectField
                          label={translateRoles[role]}
                          multiple={true}
                          name={`internal[${index}]`}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          options={groupedInternalUsers[role].map((user) => ({
                            label: `${user.name} (${user.email})`,
                            value: user.id,
                          }))}
                          value={values.internal[index] || []}
                        />
                      </Grid>
                    ) : (
                      ""
                    )
                  })}
                </>
              ) : (
                <></>
              )}

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.toggle}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="toggle"
                    />
                  }
                  label={t("view.ChangeOrder.Send.send_copy")}
                />
                <FormHelperText style={{ color: "red" }}>
                  {errors.toggle && touched.toggle ? errors.toggle : ""}
                </FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <TextAreaField
                  label={t("form.label.notes")}
                  value={values.notes}
                  name="notes"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <UploadMultipleField
                  errors={errors}
                  label="Upload Attachments"
                  setFieldValue={setFieldValue}
                  touched={touched}
                  values={values}
                />
              </Grid>
              <Grid container item xs={6} alignItems="center">
                <Button color="secondary" variant="text" onClick={toggle}>
                  {t("view.ChangeOrder.cancel")}
                </Button>
              </Grid>
              <Grid
                container
                item
                xs={6}
                alignItems="center"
                justifyContent={isMobile ? "flex-start" : "flex-end"}
              >
                <Button type="submit" endIcon={<NextIcon />}>
                  {t("view.ChangeOrder.Summary.send")}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
