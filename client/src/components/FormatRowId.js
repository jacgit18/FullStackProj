import React from "react"
import Typography from "@mui/material/Typography"

export default function FormatRowId({ children }) {
  return (
    <Typography color="primary" style={{ fontSize: 20, fontWeight: 700 }}>
      {children}
    </Typography>
  )
}
