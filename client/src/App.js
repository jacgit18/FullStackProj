import React from "react"
// import { Switch } from "react-router-dom"
import { Route, Switch } from "react-router-dom"
// import { Route } from "react-router-dom"

import CssBaseline from "@mui/material/CssBaseline"

// import CookieConsent from "./components/CookieConsent"
import UnauthenticatedRoute from "./components/routers/UnauthenticatedRoute"
// import ErrorView from "./views/Error"
// import PrivateView from "./views/Private"
import SigninView from "./views/Signin"
import SignupView from "./views/Signup"
// import RequestPasswordResetView from "./views/RequestPasswordReset"
// import NewPasswordView from "./views/NewPassword"

export default function App() {
  return (
    <div id="App" className="App">
      <CssBaseline />
      <Switch>
      <UnauthenticatedRoute path="/login">
          <SigninView />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute path="/signup">
          <SignupView />
        </UnauthenticatedRoute>
        <Route exact path="/">
          <SignupView />
        </Route>

         {/*
        <AuthenticatedRoute path="/0">
          <PrivateView />
        </AuthenticatedRoute>

  
        <UnauthenticatedRoute exact path="/request-password-reset">
          <RequestPasswordResetView />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/reset-password/:token">
          <NewPasswordView />
        </UnauthenticatedRoute>

        <Route path="*">
          <ErrorView />
        </Route> */}
      </Switch>
      {/* <CookieConsent /> */}
    </div>
  )
}
