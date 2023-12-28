import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 12,
    textAlign: "center",
  },
}))

export default function TrendCard(props) {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Typography color="textSecondary" gutterBottom>
        {props.title}
      </Typography>
      <Typography color="textPrimary" variant="h1" gutterBottom>
        {props.value}
      </Typography>
    </Box>
  )
}
