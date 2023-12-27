import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"

//This is the paid progress bar used from material UI package. --Alfredo
//It is currently receiving mock data but can be easily
//modified to show realtime data inputted from the DataTable component.

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  progressBar: {
    height: 13,
    borderRadius: 10,
  },
})

const BudgetProgress = (props) => {
  const classes = useStyles()

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
          <div className={classes.root} style={{ paddingBottom: 8 }}>
            <LinearProgress
              className={classes.progressBar}
              variant="determinate"
              value={(props.stat / 1000) * 100}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BudgetProgress
