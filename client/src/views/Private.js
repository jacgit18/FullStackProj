import React from "react"
import { useSelector } from "react-redux"
import { Route, Switch } from "react-router-dom"

import ChangeOrdersListView from "./ChangeOrders/ChangeOrdersList"
import ChangeOrderView from "./ChangeOrders/ChangeOrder"
import CreateChangeOrderView from "./ChangeOrders/CreateChangeOrder"
import CreateTicketView from "./Tickets/CreateTicket"
import ProjectsDashboardView from "./Projects/Dashboard"
import ProjectsListView from "./Projects/ProjectsList"
import ProjectSettingsView from "./Projects/Settings"
import SettingsView from "./Settings"
import TicketsListView from "./Tickets/TicketsList"
import TicketView from "./Tickets/SingleTicket"
import UpdateTicket from "./Tickets/UpdateTicket"
import UpdateChangeOrderView from "./ChangeOrders/UpdateChangeOrder"
import UserProjectsListView from "./Projects/UserProjectsList"
import Layout from "../components/LayoutAuthenticated"
import Clients from "./Settings/Clients"
import SubGuardedRoute from "../components/routers/route-guards/SubGuardedRoute"

export default function Private() {
  const company = useSelector((state) => state.company)

  return (
    <Layout>
      <Switch>
        <Route exact path="/0">
          <UserProjectsListView />
        </Route>
        <Route exact path="/0/home">
          <UserProjectsListView />
        </Route>
        <Route exact path="/0/project/:projectId/tickets">
          <TicketsListView />
        </Route>
        <SubGuardedRoute
          exact
          path={"/0/project/:projectId/tickets/add"}
          component={CreateTicketView}
          redirectLink={"/0/project/:projectId/tickets"}
        />
        <Route exact path="/0/project/:projectId/ticket/:ticketId">
          <TicketView />
        </Route>
        <Route exact path="/0/project/:projectId/ticket/:ticketId/edit">
          <UpdateTicket />
        </Route>

        {company.role !== "crew" ? (
          <Switch>
            <Route path="/0/settings/clients">
              <Clients />
            </Route>
            <Route path="/0/settings">
              <SettingsView />
            </Route>
            <Route exact path="/0/projects">
              <ProjectsListView />
            </Route>
            <Route exact path="/0/project/:projectId/settings">
              <ProjectSettingsView />
            </Route>
            <Route exact path="/0/project/:projectId/dashboard">
              <ProjectsDashboardView />
            </Route>
            <Route exact path="/0/project/:projectId/changeorders">
              <ChangeOrdersListView />
            </Route>
            <Route exact path="/0/project/:projectId/changeorders/add">
              <CreateChangeOrderView />
            </Route>
            <Route exact path="/0/project/:projectId/changeorders/:changeorderId">
              <ChangeOrderView />
            </Route>
            <Route exact path="/0/project/:projectId/changeorder/:changeorderId">
              <ChangeOrderView />
            </Route>
            <Route exact path="/0/project/:projectId/changeorder/:changeorderId/edit">
              <UpdateChangeOrderView />
            </Route>
          </Switch>
        ) : (
          ""
        )}
      </Switch>
    </Layout>
  )
}
