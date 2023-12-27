import React from "react"
import { makeStyles } from "@mui/styles"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"

import logo from "../assets/tracflo_horizontal_light.svg"
import { Typography } from "@mui/material"

const useStyles = makeStyles((theme) => {
  return {
    root: {
      maxHeight: theme.mixins.toolbar.minHeight,
      maxWidth: "100%",
    },
    name: {
      maxHeight: theme.mixins.toolbar.minHeight,
    },
  }
})

// TODO DEV-204 THIS IS DEPRECATED, USE LogoPortable INSTEAD
export default function Logo() {
  const company = useSelector((state) => state.company)
  const classes = useStyles()
  let img = `${company.logo_url}`
  let location = useLocation().pathname

  // if (!company.logo_url || location === "/0/accounts") {
  if (location === "/0/accounts") {
    img = logo
  }
  return img && img !== "null" ? (
    <img alt="TracFlo" className={classes.root} src={img} />
  ) : (
    <Typography className={classes.root} color="primary" variant="h2">
      {company.name}
    </Typography>
  )
}
