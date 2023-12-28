import React from "react"
import makeStyles from "@mui/styles/makeStyles"
// import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles((theme) => ({
  content: {
    fontSize: 12,
    "& *": {
      fontSize: 12,
    },
  },
  contentContainer: {
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    paddingLeft: 8,
    width: "calc(100% - 92px)",
  },
  root: {
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.grey[600],
    fontSize: 12,
  },
  titleContainer: {
    width: 92,
  },
}))

const Detail = ({ content, formatter, title }) => {
  const classes = useStyles()
  return (
    <>
      <Grid className={classes.titleContainer} container item alignItems="flex-start">
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid container className={classes.contentContainer} item alignItems="flex-start">
        <div className={classes.content}>{formatter ? formatter(content) : content}</div>
      </Grid>
    </>
  )
}

export default function DetailsTable({ details, detail, formatter }) {
  return (
    <Grid
      container
      item
      xs={12}
      alignContent="flex-start"
      justifyContent="flex-start"
      spacing={0}
      style={{ marginBottom: 16 }}
    >
      {details ? (
        details
          .filter((detail) => detail.content !== null)
          .map((detail) => <Detail key={detail.title} {...detail} formatter={formatter} />)
      ) : detail ? (
        <Detail {...detail} formatter={formatter} />
      ) : (
        ""
      )}
    </Grid>
  )
}
