import React from "react"
//import { makeStyles } from "@mui/material/styles"

import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Grid from "@mui/material/Grid"

export default function TableRow(props) {
  return (
    <ListItem>
      <Grid container justifyContent="space-between" spacing={0}>
        <Grid item>
          <ListItemText primary={props.name} />
        </Grid>
        <Grid item>
          <ListItemText secondary={props.stat} />
        </Grid>
      </Grid>
    </ListItem>
  )
}
