import React from "react"
import Box from "@mui/material/Box"

export default function FormWideContainer({ children }) {
  return (
    <Box m="auto" maxWidth={960} width="100%">
      {children}
    </Box>
  )
}
