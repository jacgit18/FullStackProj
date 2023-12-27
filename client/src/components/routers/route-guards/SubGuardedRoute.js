import React from "react"
import { useSelector } from "react-redux"
import { Route, Redirect } from "react-router-dom"

//Checks if user is a Sub to render the corresponding component otherwise redirect them.
export default function SubGuardedRoute({ component: Component, redirectLink, path }) {
  const company = useSelector((state) => state.company)
  const authorizedToViewComponent = company?.company_type === "trade"

  return (
    <Route
      exact
      path={path}
      render={(props) =>
        authorizedToViewComponent ? <Component {...props} /> : <Redirect to={redirectLink} />
      }
    />
  )
}
