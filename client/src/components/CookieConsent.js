import React from "react"
import { useTranslation } from "react-i18next"
import makeStyles from "@mui/styles/makeStyles"
import ReactCookieConsent from "react-cookie-consent"

const useStyles = makeStyles((theme) => ({
  button: {
    background: `${theme.palette.secondary.main} !important`,
    borderRadius: "10px !important",
    color: "white !important",
    fontSize: "14px !important",
    fontWeight: "700 !important",
    padding: "12px !important",
    textTransform: "uppercase !important",
  },
  container: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    zIndex: "1300 !important",
  },
  content: {},
}))

export default function CookieConsent({ left, right, title }) {
  const { t } = useTranslation("common")
  const classes = useStyles()

  return (
    <ReactCookieConsent
      hideOnAccept={true}
      acceptOnScroll={true}
      buttonText={t("cookie.buttonText")}
      declineButtonText={t("cookie.declineButtonText")}
      buttonClasses={classes.button}
      containerClasses={classes.container}
      contentClasses={classes.content}
    >
      {t("cookie.content")}
    </ReactCookieConsent>
  )
}
