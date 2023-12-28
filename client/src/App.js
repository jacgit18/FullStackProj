import React from "react"
import { Switch } from "react-router-dom"
// import { Switch, Route } from "react-router-dom"
// import { Route } from "react-router-dom"

import CssBaseline from "@mui/material/CssBaseline"

import CookieConsent from "./components/CookieConsent"
// import AuthenticatedRoute from "./components/routers/AuthenticatedRoute"
// import UnauthenticatedRoute from "./components/routers/UnauthenticatedRoute"
// import AccountsView from "./views/Accounts"
// import ErrorView from "./views/Error"
// import PrivateView from "./views/Private"
// import SigninView from "./views/Signin"
// import SignupView from "./views/Signup"
// import RequestPasswordResetView from "./views/RequestPasswordReset"
// import NewPasswordView from "./views/NewPassword"

export default function App() {
  return (
    <div id="App" className="App">
      <CssBaseline />
      <Switch>
        {/* <AuthenticatedRoute exact path="/0/accounts">
          <AccountsView />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/0">
          <PrivateView />
        </AuthenticatedRoute>

        <UnauthenticatedRoute path="/login">
          <SigninView />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute path="/signup">
          <SignupView />
        </UnauthenticatedRoute>
        <Route exact path="/">
          <SignupView />
        </Route>
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
      <CookieConsent />
    </div>
  )
}
