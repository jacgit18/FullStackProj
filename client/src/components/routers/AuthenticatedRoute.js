import React from "react"
import { Route, Redirect, useHistory, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { getCompany, setCompany } from "../../store/features/companySlice"
import { getUser } from "../../store/features/userSlice"
import { loadActions } from "../../store/features/actionSlice"
import {resetStore} from "../../store/resetStoreService";

export default function AuthenticatedRoute({ children, ...rest }) {
  const dispatch = useDispatch()
  const company = useSelector(getCompany)
  const user = useSelector(getUser)
  const action = useSelector(state => state.action)
  const history = useHistory()
  const { pathname, search } = useLocation()

  React.useEffect(() => {
    const expiration = user.exp.user
    const now = Math.floor(Date.now() / 1000)
    if (expiration < now) {
      resetStore(dispatch)
      return history.push(`/login?redirect=${pathname}${search}`)
    }
    // get current company if we dont already have it
    if (!company.id) {
      if (user && user.companies && user.companies.length === 1) {
        dispatch(setCompany(user.companies[0]))
      } else if (!pathname.startsWith("/0/accounts")) {
        return history.push("/0/accounts")
      }
    }
    // Check if we need to grab action items
    if (!action?.items?.length || action?.items?.length === 0) {
      dispatch(loadActions())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, user])

  return (
    <Route {...rest}>
      {user.isLoggedIn ? children : <Redirect to={`/login?redirect=${pathname}${search}`} />}
    </Route>
  )
}
