import React from "react"
import makeStyles from "@mui/styles/makeStyles"

import SiteHeader from "./SiteHeader"
import SiteHeaderSpacer from "./SiteHeaderSpacer"

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
    },
    contentWrap: {
      flexGrow: 1,
    },
    content: {
      flexGrow: 1,
      overflow: "hidden",
    },
  }
})

export default function Layout({ title, children }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <SiteHeader simple title={title} />
      <div className={classes.contentWrap}>
        <SiteHeaderSpacer />
        <main className={classes.content}>{children}</main>
      </div>
    </div>
  )
}
