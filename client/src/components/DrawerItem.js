import React from "react"
import { useDispatch } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import clsx from "clsx"
import { useTheme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import useMediaQuery from "@mui/material/useMediaQuery"
import MuiListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

import { showDrawer } from "../store/features/userSlice"

const useStyles = makeStyles((theme) => {
  return {
    root: {
      paddingBottom: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
      "&:hover": {
        backgroundColor: "#2B4775",
      },
    },
    icon: {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
    },
    open: {
      paddingLeft: theme.spacing(3),
      transition: theme.transitions.create("padding-left", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    close: {
      paddingLeft: theme.spacing(2),
      transition: theme.transitions.create("padding-left", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    text: {
      fontWeight: 400,
      opacity: 0.5,
      "&:hover": {
        opacity: 1,
      },
    },
    selected: {
      "& .MuiListItemIcon-root > img": {},
      "& .MuiListItemText-root > .MuiTypography-root": {
        fontWeight: "800 !important",
        opacity: 1,
      },
    },
  }
})

export default function ListItem({ icon, open, route, text }) {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useDispatch()

  const checkPath = (to) => {
    return location.pathname === to
  }

  return (
    <MuiListItem
      button
      className={clsx(classes.root, {
        [classes.open]: open,
        [classes.close]: !open,
        [classes.selected]: checkPath(route),
      })}
      onClick={() => {
        if (isMobile) {
          dispatch(showDrawer(false))
        }
        history.push(route)
      }}
    >
      <ListItemIcon>
        {icon ? <img alt="" role="presentation" src={icon} className={classes.icon} /> : ""}
      </ListItemIcon>
      <ListItemText
        // className={{ [classes.selected]: checkPath(route), [classes.text]: !checkPath(route) }}
        primary={text}
      />
    </MuiListItem>
  )
}
