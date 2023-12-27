import React from "react"
import clsx from "clsx"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles((theme) => {
  return {
    content: {
      margin: "0 auto",
    },
    limit: {
      maxWidth: 1080,
    },
    root: {
      paddingBottom: theme.spacing(6),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(6),
      [theme.breakpoints.up("md")]: {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
      },
    },
    removeBottom: {
      paddingBottom: "0px !important",
    },
    removeTop: {
      paddingTop: "0px !important",
    },
  }
})

export default function Container({ children, fullWidth, removeBottom, removeTop, ...props }) {
  const classes = useStyles()

  return (
    <div
      className={clsx(classes.root, {
        [classes.removeBottom]: removeBottom,
        [classes.removeTop]: removeTop,
      })}
      {...props}
    >
      <div
        className={clsx(classes.content, {
          [classes.limit]: !fullWidth,
        })}
      >
        {children}
      </div>
    </div>
  )
}
