import React, { useRef } from "react"
import FormData from "form-data"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import SignaturePad from "react-signature-pad-wrapper"
import { useTheme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
// import NextIcon from "@mui/icons-material/ArrowForwardIos"

import Button from "../components/Button"
import TextAreaField from "../components/Fields/TextArea"
import UploadMultipleField from "../components/Fields/UploadMultiple"
import api from "../libs/api"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  signaturePad: {
    background: theme.palette.background.paper,
    width: 300,
    height: "100%",
  },
  text: {
    "& .MuiListItemText-primary": {
      fontSize: "13px",
      fontWeight: "normal",
    },
  },
  textBlock: {
    width: "100%",
  },
  attach: {
    height: 40,
    borderRadius: 0,
    textTransform: "capitalize",
  },
  cancelButton: {
    color: "#0092D6",
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    border: "none",
    cursor: "pointer",
    overFlow: "hidden",
    outline: "0",
    height: 40,
  },
  clear: {
    color: "#143366",
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    border: "none",
    cursor: "pointer",
    overFlow: "hidden",
    outline: "0",
    height: 40,
  },
  send: {
    height: 40,
    borderRadius: "5",
  },
}))

export default function Approve({ requestUrl, setter, toggle }) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t } = useTranslation("private")

  //Signature Pad Data
  const signaturePad = useRef({})
  function clear() {
    signaturePad.current.clear()
  }

  const notificationSuccesful = () => {
    enqueueSnackbar("Approval sent", {
      variant: "success",
    })
  }
  const notificationError = () => {
    enqueueSnackbar("Could Not Be Approved", {
      variant: "error",
    })
  }

  return (
    <Formik
      initialValues={{
        toggle: false,
        message: "",
        files: [
          {
            name: "",
          },
        ],
      }}
      // validationSchema={Yup.object().shape({
      //   message: Yup.string().required(t("form.message.notesRequired")),
      // })}
      onSubmit={(values, { resetForm }) => {
        const data = new FormData()
        // Temporary fix for ticket approval, doesn't work for cost
        data.append("action", "approve") // required, choices: approve, reject, revise
        data.append("signature", signaturePad.current.toDataURL())
        data.append("message", values.message)

        if (values.files) {
          for (let i = 0, l = values.files.length; i < l; i++) {
            if (values.files[i]) {
              data.append(`files${i}`, values.files[i])
            }
          }
        }

        api
          .post(requestUrl, data)
          .then(function (response) {
            if (setter && response.data) {
              setter(response.data)
            }
            notificationSuccesful()
            clear()
            resetForm()
          })
          .catch(function (error) {
            console.log("error", error)
            notificationError()
          })
          .finally(() => resetForm())
        toggle()
      }}
    >
      {({
        errors,
        handleBlur,
        isSubmitting,
        isValid,
        touched,
        values,
        setFieldValue,
        resetForm,
        submitForm,
      }) => {
        const handleChange = (event) => {
          setFieldValue(event.target.name, event.target.value)
        }
        return (
          <Form>
            <Grid item container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  align={isMobile ? "center" : "left"}
                  style={{ fontSize: 20 }}
                >
                  {t("view.ChangeOrder.Approve.approve")}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" align={isMobile ? "center" : "left"}>
                  Signature
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box
                  style={{
                    background: "white",
                    width: 320,
                    marginBottom: 10,
                    padding: 10,
                    border: "2px solid #ddd",
                    borderRadius: 5,
                  }}
                >
                  <SignaturePad
                    canvasProps={{ className: classes.signaturePad }}
                    style={{ width: "100%" }}
                    ref={signaturePad}
                  />
                </Box>
                <Button color="secondary" type="reset" size="small" variant="text" onClick={clear}>
                  {t("view.ChangeOrder.Approve.clear")}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextAreaField
                  label={t("form.label.notes")}
                  value={values.message}
                  name="message"
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
                <Button type="submit" next>
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
