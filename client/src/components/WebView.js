import React from "react"
import { useSelector } from "react-redux"
import makeStyles from "@mui/styles/makeStyles"
import CircularProgress from "@mui/material/CircularProgress"
import { useHistory } from "react-router-dom"

import config from "../libs/config"

const useStyles = makeStyles((theme) => ({
  frame: {
    border: "none",
    height: "100%",
    overflow: "none",
    width: "100%",
  },
  root: {
    border: "none",
    display: "flex",
    height: "calc(100vh - 65px)",
    overflow: "none",
    width: "100%",
  },
  spinner: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 100,
  },
}))

export default function WebView({ path }) {
  const classes = useStyles()
  const company = useSelector((state) => state.company)
  const { token } = useSelector((state) => state.user)
  const [loading, setLoading] = React.useState(true)
  const history = useHistory()

  let url = ""

  if (company.id) {
    // const newUrl = path.indexOf("http") !== 0 ? `${company.url ? company.url : ""}${path}` : path
    const companyUrl = `https://${company.id}.${config.app.domain}`
    const newUrl = path.indexOf("http") !== 0 ? `${companyUrl}${path}` : path

    const redirectUrl = new URL(newUrl)
    redirectUrl.searchParams.set("loadedAsChild", 1)
    url = `${companyUrl}/?rest_route=/api/v1/login/autologin&JWT=${token}&redirectUrl=${encodeURIComponent(
      redirectUrl
    )}`
  } else {
    history.push("/0")
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.spinner}>
          <CircularProgress style={{ height: 75, width: 75 }} />
        </div>
      ) : (
        ""
      )}
      <iframe
        className={classes.frame}
        onLoad={() => {
          setLoading(false)
        }}
        src={url}
        title="Legacy Application"
        style={{ visibility: loading ? "hidden" : "visible" }}
        frameBorder="0"
        seamless="seamless"
        scrollable="no"
      ></iframe>
    </div>
  )
}
