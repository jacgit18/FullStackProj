import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import withStyles from "@mui/styles/withStyles"
import LinearProgress from "@mui/material/LinearProgress"
import { convertToNumber } from "../util/number"

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 13,
    borderRadius: 10,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 0,
    backgroundColor: "#143366",
  },
}))(LinearProgress)

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
})

const PaidProgress = ({ total, completed }) => {
  const classes = useStyles()
  const totalNum = convertToNumber(total)
  const completedNum = convertToNumber(completed)
  let value =
    totalNum === null || completedNum === null || totalNum === 0
      ? null
      : (completedNum / totalNum) * 100

  return (
    <div className={classes.root} style={{ paddingBottom: 8 }}>
      <BorderLinearProgress variant="determinate" value={value} />
    </div>
  )
}

export default PaidProgress
