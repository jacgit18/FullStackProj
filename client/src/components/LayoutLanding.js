import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import logo from "../assets/tracflo_horizontal_light.svg"
import LandingFooter from "./LandingFooter"
import { Typography } from "@mui/material"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  content: {
    padding: `${theme.spacing(6)}px 0 ${theme.spacing(10)}px`,
  },
  rightContainer: {
    backgroundColor: theme.palette.grey[200],
  },
}))

export default function Layout({ left, right, title }) {
  const classes = useStyles()

  return (
    <Grid container sx={{ flexGrow: 1, height: "100vh" }}>
      <Grid item xs={12} md={6} sx={{ boxShadow: 20, zIndex: 10 }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ boxShadow: 6, height: 100, pl: 2, pr: 2 }}
        >
          <Grid item xs={4}>
            <Box
              component="img"
              alt="TracFlo"
              src={logo}
              sx={{
                width: 120,
              }}
            />
          </Grid>
          <Grid container justifyContent="flex-end" item xs={4}>
            <Typography variant="h2" m={0} sx={{ textAlign: "right" }}>
              {title}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} p={4}>
          {left}
        </Grid>
      </Grid>
      <Grid container item xs={12} md={6} className={classes.rightContainer}>
        <Grid container alignItems="flex-end" item xs={12}>
          <Grid container item xs={12}>
            <Box sx={{ m: "auto", maxWidth: 500, p: 4, width: "100%" }}>{right}</Box>
          </Grid>
          <LandingFooter />
        </Grid>
      </Grid>
    </Grid>
  )
}
