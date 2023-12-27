import React from "react"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import Container from "./Container"

export default function OverviewListLayout({ actions, children, title, ...props }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <>
      <Container fullWidth>
        <Grid container spacing={2}>
          <Grid container item alignItems="center" justifyContent="flex-start" md={6}>
            <Typography variant="h1">{title}</Typography>
          </Grid>
          <Grid
            container
            item
            alignItems="center"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            md={6}
          >
            {actions}
          </Grid>
        </Grid>
      </Container>

      <Container fullWidth removeTop>
        {children}
      </Container>
    </>
  )
}
