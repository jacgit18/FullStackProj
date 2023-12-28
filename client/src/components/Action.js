import React from "react"
import { decode } from "html-entities"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"

// This is an action component that recieves the status of each ticket as an input. --Alfredo
// Can easily add the other ticket status' when it comes to it.

// Figured the best way to go around this would be with if statements
// And just change the class (color) depending on the status.

const submittedBackground = "#cd9534"
const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[900],
    border: "none",
    borderRadius: 5,
    color: "white",
    fontWeight: 900,
    fontSize: 13,
    padding: theme.spacing(1),
    textAlign: "center",
    width: "100%",
  },
  draft: {
    background: theme.palette.grey[600],
  },
  tm_submitted: {
    background: "#f2c746",
  },
  tm_approve: {
    background: "#6aacba",
  },
  submitted: {
    background: submittedBackground,
  },
  approve: {
    background: "#45bf55",
  },
  reject: {
    background: "#d92929",
  },
  revise: {
    background: "#b96aba",
  },
  reviewing: {
    background: submittedBackground,
    position: "relative",
    "& span": {
      display: "block",
      position: "absolute",
      right: 7,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 1,
    },
    "&:before": {
      background: theme.palette.common.black,
      content: "",
      display: "block",
      height: "100%",
      left: 0,
      opacity: 0.1,
      position: "absolute",
      top: 0,
      width: 0,
    },
  },
  reviewed: {
    "&:before": {
      width: "50%",
    },
  },
  owner: {
    "&:before": {
      width: "75%",
    },
  },
}))

export default function Action({ id, name }) {
  const classes = useStyles()
  const className =
    id !== "tm_submitted" && id !== "tm_approve" ? id.replace("tm_", "").replace("cost_", "") : id

  return (
    <Box
      className={`${classes.root} ${
        ["reviewed", "owner"].includes(className) ? classes.reviewing : ""
      } ${classes[className]}`}
    >
      <Typography>{decode(name)}</Typography>
    </Box>
  )
}
