import React from "react"
import { useLocation } from "react-router-dom"
import Typography from "@mui/material/Typography"

export default function Error({ location }) {
  const path = useLocation().pathname
  return (
    <Typography>
      <Typography variant="h1">
        404 Error: No match for <code>{path}</code>
      </Typography>
    </Typography>
  )
}
