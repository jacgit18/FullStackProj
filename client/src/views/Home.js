// import { makeStyles } from "@mui/styles"
import React from "react"
import { Route, Switch } from "react-router-dom"

import Header from "../components/Header"
import SideMenu from "../components/SideMenu"

// import Header from "../components/Header"
// import DashboardView from "./Dashboard"
import SettingsView from "./Settings"

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
  // const classes = useStyles()

  return (
    // <div className={classes.root}>
    //   <Header />
    //   <div className={classes.pageContainer}>
    //     <SideMenu />
    //     <div className={classes.contentContainer}>
    //       <Switch>
    //         <Route path="/settings">
    //           <SettingsView />
    //         </Route>
    //         {/* <Route exact path="/">
    //           <DashboardView />
    //         </Route> */}
    //       </Switch>
    //     </div>
    //   </div>
    // </div>
    <div >
    <Header />
    <div >
      <SideMenu />
      <div>
        <Switch>
          <Route path="/settings">
            <SettingsView />
          </Route>
          {/* <Route exact path="/">
            <DashboardView />
          </Route> */}
        </Switch>
      </div>
    </div>
  </div>
  )
}
