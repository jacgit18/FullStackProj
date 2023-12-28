import React from "react"
import { Route, Switch } from "react-router-dom"
import { makeStyles } from "@mui/styles"

import SideMenu from "../components/SideMenu"
import Header from "../components/Header"

// import Header from "../components/Header"
import DashboardView from "./Dashboard"
import ProjectsView from "./Projects"
import TicketsView from "./Tickets"
import SettingsView from "./Settings"
import TicketApiTestView from "./TicketApiTest"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  pageContainer: {
    display: "flex",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
}))

export default function Home() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.pageContainer}>
        <SideMenu />
        <div className={classes.contentContainer}>
          <Switch>
            <Route exact path="/projects1">
              <ProjectsView />
            </Route>
            <Route exact path="/dashboard/projects/4/tickets">
              <TicketsView />
            </Route>
            <Route path="/settings">
              <SettingsView />
            </Route>
            <Route exact path="/">
              <DashboardView />
            </Route>
            <Route exact path="/api-test">
              <TicketApiTestView />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}
