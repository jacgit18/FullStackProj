import React from "react"
import { makeStyles } from "@mui/styles"
import { Typography } from "@mui/material"

const useStyles = makeStyles((theme: any) => {
  return {
    root: {
      maxHeight: theme.mixins.toolbar.minHeight,
      maxWidth: "100%",
    },
    name: {
      maxHeight: theme.mixins.toolbar.minHeight,
    },
  }
})

interface LogoProps {
  imgUrl?: string,
  companyName: string,
}

export default function Logo(props: LogoProps) {
  const classes = useStyles()
  return props.imgUrl && props.imgUrl !== "null" ? (
    <img alt={props.companyName} className={classes.root} src={props.imgUrl} />
  ) : (
    <Typography className={classes.root} color="primary" variant="h2">
      {props.companyName}
    </Typography>
  )
}
