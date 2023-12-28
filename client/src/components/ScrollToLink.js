import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "underline",
    fontWeight: 700,
    "&:hover": {
      color: theme.palette.secondary.dark,
      cursor: "pointer",
    },
  },
}))

export default function ScrollToLink({ children, targetRef }) {
  const classes = useStyles()

  const scrollToHistory = () => {
    targetRef.current.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <Typography className={classes.link} onClick={scrollToHistory}>
      {children}
    </Typography>
  )
}
