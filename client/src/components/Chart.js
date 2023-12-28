import React from "react"
import makeStyles from "@mui/styles/makeStyles"

//import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles({
  title: {
    margin: 10,
  },
  root: {
    padding: 20,
    borderRadius: "8px",
  },
})

function getDate() {
  let currentDate = new Date()
  let cDay = currentDate.getDate()
  let cMonth = currentDate.toLocaleString("default", { month: "long" })
  let cYear = currentDate.getFullYear()
  return cDay + " " + cMonth + " " + cYear
}

export default function TrendChart(props) {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <Typography className={classes.title} variant="h2" color="textPrimary" gutterBottom>
        {props.title}
      </Typography>
      <Typography className={classes.title} variant="h3" color="textSecondary" gutterBottom>
        As of {getDate()}
      </Typography>
      <ResponsiveContainer height={props.height}>
        <ComposedChart
          data={props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={props.xName} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" align="right" variant="h3" iconType="plainline" />
          <defs>
            <linearGradient id="chart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#3751FF" stopOpacity={0.3} />
              <stop offset="90%" stopColor="#3751FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={props.yName}
            stroke="#3751FF"
            fillOpacity={1}
            fill="url(#chart)"
            activeDot={{ r: 6 }}
          />
          {/* <Line type="monotone" dataKey="Yesterday" stroke="#d3d3d3" dot={false} />*/}
        </ComposedChart>
      </ResponsiveContainer>
    </Container>
  )
}
