import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import MuiCard from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import MuiCardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles({
  root: {
    borderRadius: 10,
    border: "1px solid transparent",
    "&:hover": {
      color: "#3751FF",
      border: "1px solid #3751FF",
    },
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
  },
  actionArea: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
  },
  content: {
    width: "100%",
  },
  // content: {
  //   height: "80%",
  //   display: "flex",
  //   textAlign: "center",
  //   //min-height: 100vh;
  //   flexDirection: "column",
  //   justifyContent: "space-between",
  //   //padding: "24px 16px 0px 16px",
  // },
  stat: {
    fontSize: 40,
    // position: "absolute",
    // bottom: 0,
    //display: "block",
  },
  title: {},
})

const CardContent = ({ children, title, value }) => {
  const classes = useStyles()

  return (
    <MuiCardContent className={classes.content}>
      {title ? (
        <Typography className={classes.title} gutterBottom>
          {title}
        </Typography>
      ) : (
        <></>
      )}
      {value ? (
        <Typography className={classes.stat} variant="h1">
          {value}
        </Typography>
      ) : (
        <></>
      )}
      {children}
    </MuiCardContent>
  )
}

export default function Card({ action, button, children, title, value }) {
  const classes = useStyles()
  return (
    <MuiCard className={classes.root}>
      {action ? (
        <CardActionArea className={classes.actionArea} onClick={action}>
          <CardContent title={title} value={value}>
            {children}
          </CardContent>
        </CardActionArea>
      ) : (
        <CardContent title={title} value={value}>
          {children}
        </CardContent>
      )}
      {button ? <CardActions>{button}</CardActions> : ""}
    </MuiCard>
  )
}
