import React from "react"
import { Route, Switch } from "react-router-dom"

import LandingView from "./Landing"
// import OnboardingView from "./Onboarding"

export default function Signup() {
  return (
    <Switch>
      <Route exact path="/">
        <LandingView />
      </Route>
      {/* <Route path="/signup">
        <OnboardingView />
      </Route> */}
    </Switch>
  )
}
