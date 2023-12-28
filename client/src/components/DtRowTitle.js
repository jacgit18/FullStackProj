import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 15,
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "& a": {
      color: theme.palette.secondary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}))

export default function DtRowTitle({ children, ...props }) {
  const classes = useStyles()
  return <Typography className={classes.root}>{children}</Typography>
}
