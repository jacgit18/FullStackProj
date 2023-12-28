import React from "react"
import clsx from "clsx"
import makeStyles from "@mui/styles/makeStyles"
import MuiButton from "@mui/material/Button"
// import NextIcon from "@mui/icons-material/NavigateNext"
import NextIcon from "@mui/icons-material/ArrowForwardIos"
import RefreshIcon from "@mui/icons-material/Refresh"

const useStyles = makeStyles((theme) => ({
  icon: {
    // color: theme.palette.secondary.main,
    fill: "currentColor",
  },
  root: {
    justifyContent: "center",
  },
  large: {
    minWidth: 250,
    textAlign: "left",
    fontSize: "1rem",
    fontWeight: 700,
    justifyContent: "space-between",
    height: 70,
    borderRadius: 10,
    "&:not(.Mui-disabled) .MuiSvgIcon-root": {
      color: theme.palette.secondary.main,
    },
  },
  color_error: {
    "&:not(.Mui-disabled)": {
      backgroundColor: theme.palette.error.main,
      color: "white",
    },
  },
  color_info: {
    "&:not(.Mui-disabled)": {
      backgroundColor: theme.palette.info.main,
      color: "white",
    },
  },
  color_success: {
    "&:not(.Mui-disabled)": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  color_warning: {
    "&:not(.Mui-disabled)": {
      backgroundColor: theme.palette.warning.main,
      color: "white",
    },
  },
  spinner: {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(1),
    top: 2,
    animation: `$spin 1500ms infinite linear`,
  },
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
}))

export default function Button({
  isLoading = false,
  disabled = false,
  startIcon,
  endIcon,
  color,
  children,
  next = true,
  ...props
}) {
  const classes = useStyles()

  if (!endIcon && next && props.size === "large") {
    endIcon = <NextIcon />
  }

  const newEndIcon =
    endIcon && !startIcon
      ? React.cloneElement(endIcon, {
          className: classes.icon,
        })
      : undefined
  const newStartIcon = startIcon
    ? React.cloneElement(startIcon, {
        className: classes.icon,
      })
    : undefined

  return (
    <MuiButton
      className={clsx(classes.root, {
        [classes.large]: props.size === "large",
        [classes.color_error]: color === "error",
        [classes.color_info]: color === "info",
        [classes.color_success]: color === "success",
        [classes.color_warning]: color === "warning",
      })}
      disabled={disabled || isLoading}
      startIcon={
        isLoading && (newStartIcon || (!endIcon && !startIcon)) ? (
          <RefreshIcon className={classes.spinner} />
        ) : (
          newStartIcon
        )
      }
      endIcon={isLoading && newEndIcon ? <RefreshIcon className={classes.spinner} /> : newEndIcon}
      variant="contained"
      color={color || "primary"}
      {...props}
    >
      {children}
    </MuiButton>
  )
}
