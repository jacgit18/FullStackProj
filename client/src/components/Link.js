import React from "react"
import { Link as RouterLink } from "react-router-dom"
import MuiLink from "@mui/material/Link"

export default function Link({ children, ...props }) {
  return (
    <MuiLink
      component={RouterLink}
      sx={{
        color: "secondary.main",
        textDecoration: "none",
        "&:hover": {
          color: "secondary.dark",
          textDecoration: "underline",
        },
      }}
      {...props}
    >
      {children}
    </MuiLink>
  )
}
