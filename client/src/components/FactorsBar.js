import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles({
  root: {
    paddingBottom: 15,
  },

  bar: (props) => ({
    backgroundColor: props.color,
    padding: 4,
    width: ((props.stat / 40000) * 100).toString() + "%",
    borderRadius: "5px",
    position: "relative",
    marginTop: -18,
  }),

  backbar: {
    backgroundColor: "#DBDFF1",
    width: "100%",
    padding: 3,
    borderRadius: "10px",
    position: "relative",
  },
})

export default function BudgetBar(props) {
  const classes = useStyles(props)

  return (
    <Box className={classes.root}>
      <Typography align="right">{props.stat}</Typography>

      <Grid container spacing={0}>
        <Grid item md={3} sm={5} xs={5}>
          <Typography variant="h5">{props.type}</Typography>
        </Grid>

        <Grid container item md={9} sm={7} xs={7} alignItems="center">
          <Grid item className={classes.backbar}></Grid>

          <Grid item className={classes.bar}></Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
