import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import clsx from "clsx"
import Divider from "@mui/material/Divider"
import MuiDrawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { decode } from "html-entities"

import homeIcon from "../assets/icon-home.svg"
import DrawerFooter from "../components/DrawerFooter"
import DrawerItem from "../components/DrawerItem"
import SiteHeaderSpacer from "../components/SiteHeaderSpacer"
import { showDrawer } from "../store/features/userSlice"
import ListItemText from "@mui/material/ListItemText"
import { projectNavItems } from "./Drawer.ProjectNav"
import { companyNavItems } from "./Drawer.CompanyNav"

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexShrink: 0,
      whiteSpace: "nowrap",
      width: theme.drawerWidth,
    },
    divider: {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    paper: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    open: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: theme.drawerWidth,
    },
    close: {
      overflow: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(7),
      },
    },
    toolbar: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      padding: 0,
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(4),
      position: "relative",
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
  }
})

export default function Drawer({ title, children, ...props }) {
  const { t } = useTranslation("common")
  const theme = useTheme()
  const classes = useStyles()
  const matches = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useDispatch()
  const { drawerOpen } = useSelector((state) => state.user)
  const project = useSelector((state) => state.project)
  const company = useSelector((state) => state.company)

  React.useEffect(() => {
    if (matches) {
      dispatch(showDrawer(false))
    }
  }, [dispatch, matches])

  React.useEffect(() => {
    if (project) {
    }
  }, [project])

  const navHome = {
    icon: homeIcon,
    route: "/0/home",
    text: t("Home"),
  }

  const projectSideNavItems =
    project.id?.length > 0
      ? projectNavItems(company.company_type, project.project_user_role, project.id, t)
      : []

  const companySideNavItems = company.id != null
    ? companyNavItems(t, company.company_user_role === 'crew')
    : []

  return (
    <MuiDrawer
      variant="permanent"
      className={clsx(classes.root, {
        [classes.open]: drawerOpen,
        [classes.close]: !drawerOpen,
      })}
      classes={{
        paper: clsx(classes.paper, {
          [classes.open]: drawerOpen,
          [classes.close]: !drawerOpen,
        }),
      }}
    >
      <SiteHeaderSpacer />

      <div className={classes.toolbar}>
        <DrawerItem
          icon={navHome.icon}
          open={drawerOpen}
          route={navHome.route}
          text={navHome.text}
        />
      </div>

      {projectSideNavItems.length > 0 ? (
        <div>
          <Divider className={classes.divider} />
          <List>
            <ListItemText
              primary={decode(project.name)}
              style={{
                textAlign: "center",
                padding: "10px",
                display: drawerOpen ? "block" : "none",
              }}
            />
            {projectSideNavItems.map((item) => (
              <DrawerItem
                icon={item.icon}
                key={item.text}
                open={drawerOpen}
                route={item.route}
                text={item.text}
              />
            ))}
          </List>
        </div>
      ) : null}

      {companySideNavItems.length > 0 ? (
        <>
          <Divider className={classes.divider} />
          <List>
            {companySideNavItems.map((item) => (
              <DrawerItem
                icon={item.icon}
                key={item.text}
                open={drawerOpen}
                route={item.route}
                text={item.text}
              />
            ))}
          </List>
        </>
      ) : null}
      <DrawerFooter open={drawerOpen} />
    </MuiDrawer>
  )
}
