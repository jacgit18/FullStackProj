import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Collapse from "@mui/material/Collapse"
import Container from "./Container"

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[200],
    borderBottomWidth: 4,
    borderBottomStyle: "solid",
    borderColor: theme.palette.grey[400],
  },
}))

export default function Pocket({ children, show }) {
  const classes = useStyles()
  // const theme = useTheme()

  return (
    <Collapse in={show} className={classes.root}>
      <Container>{children}</Container>
    </Collapse>
  )
}
