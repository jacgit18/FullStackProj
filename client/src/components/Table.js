import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import MuiCard from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import List from "@mui/material/List"

import TableRow from "./TableRow"

const useStyles = makeStyles({
  root: {
    margin: "0 auto",
    borderRadius: "12px",
    padding: 20,
  },

  list: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
  },
})

export default function Table(props) {
  const classes = useStyles(props)

  return (
    <MuiCard className={classes.root}>
      <CardContent>
        <Typography variant="h2" color="textPrimary" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="h3" color="textSecondary" gutterBottom>
          {props.subtitle}
        </Typography>
        <List>
          {props.data
            ? Object.keys(props.data).map((key, index) => {
                if (index !== 0)
                  return (
                    <div key={index}>
                      <Divider />
                      <TableRow name={key} stat={props.data[key]} />
                    </div>
                  )
                return <TableRow name={key} key={index} stat={props.data[key]} />
              })
            : ""}
        </List>
      </CardContent>
    </MuiCard>
  )
}
