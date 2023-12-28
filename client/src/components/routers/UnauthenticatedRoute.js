import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&")
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i")
  const results = regex.exec(url)

  if (!results) {
    return null
  }
  if (!results[2]) {
    return ""
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

export default function UnauthenticatedRoute({ children, ...rest }) {
  const user = useSelector((state) => state.user)
  const redirect = querystring("redirect")

  return (
    <Route {...rest}>
      {!user.isLoggedIn ? (
        children
      ) : (
        <Redirect to={redirect === "" || redirect == null ? "/0" : redirect} />
      )}
    </Route>
  )
}
