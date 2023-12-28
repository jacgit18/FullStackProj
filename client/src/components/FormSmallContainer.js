import React from "react"
import Box from "@mui/material/Box"

export default function FormSmallContainer({ children, ...props }) {
  return (
    <Box m="auto" maxWidth={640} pt={1} width="100%" {...props}>
      {children}
    </Box>
  )
}
