import React from "react"
import makeStyles from "@mui/styles/makeStyles"

import Drawer from "./Drawer"
import SiteHeader from "./SiteHeader"
import SiteHeaderSpacer from "./SiteHeaderSpacer"

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
    },
    contentWrap: {
      flexGrow: 1,
      height: "100vh",
      maxWidth: "100%",
      position: "relative",
      [theme.breakpoints.up("sm")]: {
        maxWidth: `calc(100% - calc(${theme.spacing(7)} + 1px))`,
      },
    },
  }
})

export default function Layout({ title, children }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <SiteHeader title={title} />
      <Drawer />
      <main className={classes.contentWrap}>
        <SiteHeaderSpacer />
        {children}
      </main>
    </div>
  )
}
