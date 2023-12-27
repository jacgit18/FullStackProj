import React from "react"
import { decode } from "html-entities"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { makeStyles, useTheme } from "@mui/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppBar from "@mui/material/AppBar"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import MenuIcon from "@mui/icons-material/Menu"

import Avatar from "./Avatar"
import Logo from "./Logo"
import { showDrawer } from "../store/features/userSlice"

const padding = 24
const useStyles = makeStyles((theme) => {
  return {
    currentProject: {
      color: "#999999",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      opacity: "1",
      fontSize: "12px",
    },
    drawerAligned: {
      [theme.breakpoints.up("md")]: {
        maxWidth: theme.drawerWidth - padding,
        width: theme.drawerWidth - padding,
      },
    },
    hide: {
      display: "none",
    },
    logoContainer: {
      zIndex: 0,
      [theme.breakpoints.up("md")]: {
        maxWidth: theme.drawerWidth - padding - 47,
        width: theme.drawerWidth - padding - 47,
      },
    },
    navContainer: {
      maxWidth: 47,
      width: 47,
      zIndex: 10,
    },
    projectName: {
      color: "#143366",
      fontSize: "15px",
      fontWeight: "700",
    },
    root: {
      background: theme.palette.background.paper,
      color: theme.palette.primary.dark,
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    shift: {
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbar: {
      //   alignItems: "center",
      //   display: "flex",
      //   justifyContent: "space-between",
      //   padding: 0,
      position: "relative",
      // necessary for content to be below app bar
      //   ...theme.mixins.toolbar,
    },
  }
})

export default function SiteHeader({ logo, fullWidth, simple = null, title, global }) {
  const { t } = useTranslation("private")
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useDispatch()
  const { drawerOpen } = useSelector((state) => state.user)
  const project = useSelector((state) => state.project)

  const handleDrawerOpen = () => {
    dispatch(showDrawer(!drawerOpen))
  }

  return (
    <AppBar
      background={theme.palette.background.paper}
      className={classes.root}
      elevation={5}
      // position={isMobile ? "absolute" : "fixed"}
      position="fixed"
    >
      <Toolbar className={classes.toolbar}>
        <Grid container justifyContent="space-between">
          <Grid className={classes.drawerAligned} item xs container justifyContent="flex-start">
            {!simple ? (
              <Grid
                className={classes.navContainer}
                item
                xs
                container
                alignItems="center"
                justifyContent="flex-start"
                style={{ width: 47 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  size="large"
                >
                  {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
              </Grid>
            ) : (
              ""
            )}
            <Grid
              className={classes.logoContainer}
              item
              xs
              container
              alignItems="center"
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
              <Logo />
            </Grid>
          </Grid>
          <Grid item xs container alignItems="center" justifyContent="space-between">
            {!isMobile && project.id ? (
              <Grid
                item
                xs={9}
                md={6}
                justifyContent="center"
                container
                direction="column"
                style={{ paddingLeft: isMobile ? 0 : 40 }}
              >
                <div>
                  <Typography className={classes.currentProject}>
                    {t("component.siteheader")}
                  </Typography>

                  <Typography className={classes.projectName}>{decode(project.name)}</Typography>
                </div>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs container alignItems="center" justifyContent="flex-end">
              {isMobile ? (
                <></>
              ) : (
                <IconButton>
                  <HelpOutlineIcon />
                </IconButton>
              )}
              <Avatar />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>

      <Divider />
    </AppBar>
  )
}
