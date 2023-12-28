import * as React from "react"
import makeStyles from "@mui/styles/makeStyles"
import MuiBackdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

const useStyles = makeStyles((theme) => ({
  backdrop: {
    color: "#fff",
    opacity: 0.25,
    zIndex: theme.zIndex.drawer + 1,
  },
}))

export default function Backdrop({ children, ...props }) {
  const classes = useStyles()

  return (
    <MuiBackdrop className={classes.backdrop} {...props}>
      <CircularProgress color="inherit" />
      {children}
    </MuiBackdrop>
  )
}
