import React from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { makeStyles } from "@mui/styles"
import Divider from "@mui/material/Divider"
import MuiAvatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

import Dialog from "../components/Dialog"
import CreateCompanyForm from "../forms/CreateCompany"
import { resetStore } from "../store/resetStoreService"

const useStyles = makeStyles((theme) => ({
  info: {
    background: theme.palette.text.disabled,
    color: theme.palette.background.paper,
    fontSize: "0.85rem",
    marginBottom: theme.spacing(1),
    marginTop: -theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}))

export default function Avatar() {
  const { t } = useTranslation("common")
  const classes = useStyles()
  const history = useHistory()
  const [profileOpen, setProfileOpen] = React.useState(null)
  const [dialog, setDialog] = React.useState(null)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const handleLogout = () => {
    resetStore(dispatch)
  }

  const handleClick = (event) => {
    setProfileOpen(event.currentTarget)
  }

  const handleClose = () => {
    setProfileOpen(null)
  }

  return (
    <>
      {user.isLoggedIn ? (
        <div>
          <IconButton
            aria-label="open"
            aria-controls="simple-menu"
            aria-haspopup="true"
            edge="end"
            onClick={handleClick}
            size="large"
          >
            <MuiAvatar src="/broken-image.jpg" />
          </IconButton>
          <Menu
            anchorEl={profileOpen}
            keepMounted
            open={Boolean(profileOpen)}
            onClose={handleClose}
          >
            <Typography className={classes.info} component="li">
              <strong>{user.name}</strong>
              <br />
              <strong>{user.email}</strong>
            </Typography>
            {user.is_admin ? (
              <>
                <MenuItem
                  onClick={() => {
                    setDialog("newcustomer")
                    handleClose()
                  }}
                >
                  {t("Create Company")}
                </MenuItem>
                <Divider />
              </>
            ) : (
              <></>
            )}
            {/* <MenuItem
            onClick={() => {
              history.push("/0/profile")
              handleClose()
            }}
          >
            {t("Profile")}
          </MenuItem> */}
            <MenuItem
              onClick={() => {
                history.push("/0/accounts")
                handleClose()
              }}
            >
              {t("Change Account")}
            </MenuItem>
            <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
          </Menu>
          <Dialog
            hideactions="true"
            open={dialog === "newcustomer"}
            onClose={() => {
              setDialog(null)
            }}
            title={"Add a Company"}
          >
            <CreateCompanyForm
              onCancel={() => {
                setDialog(null)
              }}
            />
          </Dialog>
        </div>
      ) : (
        ""
      )}
    </>
  )
}
