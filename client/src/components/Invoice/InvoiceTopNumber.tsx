import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import React from "react"

interface InvoiceTopNumberProps {
  number: string,
  isMobile: boolean,
}

export default function InvoiceTopNumber(props: InvoiceTopNumberProps): any {
  return (
    <Grid
      container
      item
      xs={props.isMobile ? 12 : 8}
      md={8}
      justifyContent={props.isMobile ? "center" : "flex-start"}
    >
      <Typography
        variant="h1"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontWeight: 900,
        }}
      >
        #{props.number}
      </Typography>
    </Grid>
  )
}
