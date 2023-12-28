import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useTheme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

import Button from "../components/Button"
import TextAreaField from "../components/Fields/TextArea"
import api from "../libs/api"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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

export default function Reject({ requestUrl, revise, setter, toggle }) {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t } = useTranslation("private")
  const { enqueueSnackbar } = useSnackbar()

  const notificationSuccesful = () => {
    enqueueSnackbar(revise ? "Revision request sent" : "Rejection sent", {
      variant: "success",
    })
  }

  const notificationError = () => {
    enqueueSnackbar("There was a problem sending the review", {
      variant: "error",
    })
  }

  return (
    <Grid
      container
      style={{ paddingTop: 30, paddingBottom: 30 }}
      justifyContent={isMobile ? "center" : "flex-start"}
    >
      <Formik
        initialValues={{
          toggle: false,
          notes: "",
        }}
        onSubmit={(values, { resetForm }) => {
          const data = new FormData()

          // Temporary fix for ticket review, doesn't work for cost
          // data.append("action", )
          // if (requestUrl.includes("ticket")) {
          //   data.append("action", revise ? "revise" : "reject")
          // } else {
          //   data.append("action", revise ? "revise" : "reject")
          // }
          data.append("action", revise ? "revise" : "reject")
          data.append("message", values.notes)

          api
            .post(requestUrl, data)
            .then(function (response) {
              if (setter && response.data) {
                setter(response.data.data)
              }
              notificationSuccesful()
              resetForm()
            })
            .catch(function (error) {
              console.log("error", error)
              notificationError()
            })
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
              <Grid item container xs={12}>
                <Grid item xs={12} style={{ paddingBottom: 20 }}>
                  <Typography
                    variant="h6"
                    align={isMobile ? "center" : "left"}
                    style={{ fontSize: 20 }}
                  >
                    {revise ? "Revise and Resubmit" : "Reject"}
                  </Typography>
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

                <Grid item container xs={12} style={{ paddingTop: 20 }} alignItems="center"></Grid>
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="space-between"
                  style={{ paddingTop: 20 }}
                >
                  <Grid item style={{ paddingRight: 20 }}>
                    <Button
                      endIcon={<></>}
                      type="reset"
                      className={classes.cancelButton}
                      color="secondary"
                      variant={null}
                      onClick={toggle}
                    >
                      {t("view.ChangeOrder.cancel")}
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      type="submit"
                      endIcon={<ArrowForwardIosIcon style={{ color: "white" }} />}
                      className={classes.send}
                    >
                      {t("view.ChangeOrder.Summary.send")}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </Grid>
  )
}
