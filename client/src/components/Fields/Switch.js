import React from "react"
import { makeStyles } from "@mui/styles"
import MuiSwitch from "@mui/material/Switch"

const useStyles = makeStyles((theme) => ({
  root: {
    height: 48,
    marginLeft: -8,
    padding: 8,
    width: 80,
  },
  switchBase: {
    padding: 11,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.grey[400] + "1A",
    },
  },
  thumb: {
    width: 26,
    height: 26,
    backgroundColor: theme.palette.primary.contrastText,
  },
  track: {
    background: theme.palette.grey[400],
    opacity: "1 !important",
    borderRadius: 20,
    position: "relative",
    "&:before, &:after": {
      display: "inline-block",
      position: "absolute",
      top: "50%",
      width: "50%",
      transform: "translateY(-50%)",
      color: theme.palette.primary.contrastText,
      textAlign: "center",
    },
    "&:before": {
      content: '"Yes"',
      left: 4,
      opacity: 0,
    },
    "&:after": {
      content: '"No"',
      right: 4,
    },
  },
  checked: {
    "&$switchBase": {
      color: theme.palette.primary.contrastText,
      transform: "translateX(32px)",
      "&:hover": {
        backgroundColor: theme.palette.primary.main + "1A",
      },
    },
    "& $thumb": {
      backgroundColor: theme.palette.primary.contrastText,
    },
    "& + $track": {
      background: theme.palette.primary.main + " !important",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
  },
}))

export default function Switch(props) {
  const classes = useStyles()

  return (
    <div>
      <MuiSwitch classes={classes} color="primary" {...props} />
    </div>
  )
}
