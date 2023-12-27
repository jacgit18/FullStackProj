import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"

const useStyles = makeStyles({
  root: {},
})

export default function Header(props) {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <Grid container justifyContent="space-between" spacing={0}>
        <Grid item>
          <Typography color="textPrimary" variant="h1" gutterBottom>
            {props.title}
          </Typography>
        </Grid>
        {/*
        <Grid item>
          <Typography color="textPrimary" variant="h3" gutterBottom>
            Julian Yocum
          </Typography>
        </Grid>
        */}
      </Grid>
    </Container>
  )
}
