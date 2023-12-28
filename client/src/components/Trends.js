import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import MuiCard from "@mui/material/Card"
import TrendCard from "../components/TrendCard"
import Chart from "../components/Chart"
import Divider from "@mui/material/Divider"

const useStyles = makeStyles({
  root: {
    //margin: "0 auto",
    borderRadius: "12px",
  },
})

export default function Trends({ data }) {
  const classes = useStyles()
  const { t } = useTranslation("private")

  return (
    <MuiCard className={classes.root}>
      <Grid container spacing={0}>
        <Grid item md={8} sm={12} xs={12}>
          {data ? (
            <Chart
              title={t("view.Dashboard.Tickets.month")}
              data={data.ticket_history}
              xName="month"
              yName="tickets"
              height={345}
            />
          ) : (
            ""
          )}
        </Grid>
        <Divider orientation="vertical" flexItem style={{ marginRight: "-1px" }} />
        <Grid item md={4} sm={12} xs={12}>
          {data ? (
            <Container>
              <TrendCard
                title={t("view.Dashboard.Tickets.cost_resolved")}
                value={data.cost_resolved}
              />

              <Divider />
              <TrendCard title={t("view.Dashboard.Tickets.recieved")} value={data.received} />
              <Divider />
              <TrendCard
                title={t("view.Dashboard.Tickets.average_first")}
                value={data.response_time}
              />
              <Divider />
              <TrendCard
                title={t("view.Dashboard.Tickets.average_resolved")}
                value={data.resolve_time}
              />
              <Divider />
              <TrendCard
                title={t("view.Dashboard.Tickets.tickets_resolved")}
                value={data.percent_resolved}
              />
            </Container>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </MuiCard>
  )
}
