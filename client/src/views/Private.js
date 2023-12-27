import React from "react"
import { useSelector } from "react-redux"
import { Route, Switch } from "react-router-dom"

import Layout from "../components/LayoutAuthenticated"
import SettingsView from "./Settings"
import Clients from "./Settings/Clients"

export default function Private() {
  const company = useSelector((state) => state.company)

  return (
    <Layout>
      <Switch>
        {company.role !== "crew" ? (
          <Switch>
            <Route path="/0/settings/clients">
              <Clients />
            </Route>
            <Route path="/0/settings">
              <SettingsView />
            </Route>
     
          </Switch>
        ) : (
          ""
        )}
      </Switch>
    </Layout>
  )
}
