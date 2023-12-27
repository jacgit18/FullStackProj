import React from "react"
import { useTranslation } from "react-i18next"
import withStyles from "@mui/styles/withStyles"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

import Button from "./Button"
import DeleteItem from "./DeleteItem"

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    // getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem)

export default function UpdateAction({
  isLoading = false,
  disabled = false,
  startIcon,
  endIcon,
  color,
  children,
  next = true,
  data,
  type,
  ...props
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const { t } = useTranslation("private")

  const menuArray = [
    t("view.ChangeOrder.Summary.allowance"),
    t("view.ChangeOrder.Summary.payment"),
    t("view.ChangeOrder.Summary.void"),
    t("view.ChangeOrder.Summary.sent"),
    t("view.ChangeOrder.Summary.delete"),
  ]

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ width: 150 }}
      >
        Update Action
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuArray.map((item, index) => {
          return (
            <StyledMenuItem key={index}>
              <ListItemText
                primary={item}
                onClick={() => {
                  if (item === "Delete") {
                    // history.push(`/0/project/${project.id}/tickets`)
                    setOpen(true)
                  }
                }}
              />
            </StyledMenuItem>
          )
        })}
      </StyledMenu>

      <DeleteItem open={open} setOpen={setOpen} data={data} type={type} />
    </div>
  )
}
