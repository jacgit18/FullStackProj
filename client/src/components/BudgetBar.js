import React from "react"
import makeStyles from "@mui/styles/makeStyles"

import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles({
  root: {
    paddingTop: 25,
  },

  bar: (props) => ({
    backgroundColor: props.color,
    padding: 4,
    width: ((props.stat / 1000) * 100).toString() + "%",
    borderRadius: "5px",
    position: "relative",
    //display: "block",
    marginTop: -7,
  }),

  backbar: {
    backgroundColor: "#DBDFF1",
    padding: 3,
    width: "100%",
    borderRadius: "10px",
    position: "relative",
    //display: "block",
  },
})

export default function BudgetBar(props) {
  const classes = useStyles(props)

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography>{props.month}</Typography>
          </Grid>
          <Grid item>
            <Typography>{props.stat}</Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item className={classes.backbar}></Grid>
          <Grid item className={classes.bar}></Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
