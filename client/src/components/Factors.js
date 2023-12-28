import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import MuiCard from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"

import { PieChart, Pie, Tooltip, Cell } from "recharts"

const useStyles = makeStyles({
  root: {
    //marginTop: -10,
    borderRadius: "30px",
    // padding: "20px 0px 0px 0px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    textAlign: "center",
    //maxWidth: "400px",
  },

  list: {
    display: "flex",
    justifyContent: "space-between",
  },

  chart: {
    marginLeft: "auto",
    marginRight: "auto",
  },
})

export default function Budget(props) {
  const classes = useStyles()
  const { t } = useTranslation("private")

  return (
    <MuiCard className={classes.root}>
      <CardContent>
        <Typography variant="h2" color="textPrimary" gutterBottom>
          {t("view.Dashboard.major")}
        </Typography>

        <PieChart width={380} height={270} className={classes.chart}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={props.data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            fill="#8884d8"
            label
          >
            <Cell fill="#143366" /> {/*dark blue*/}
            <Cell fill="#40c4ff" /> {/*teal blue*/}
            <Cell fill="#ed8456" /> {/*burnt Sienna*/}
          </Pie>
          <Tooltip />
        </PieChart>

        {/*
            <FactorsBar type="Labor Types" stat={800} color="#8676FF" />
            <FactorsBar type="Material" stat={456} color="#FF708B" />
            <FactorsBar type="Equipment" stat={710} color="#FFBA69" />
            */}
      </CardContent>
    </MuiCard>
  )
}
