import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useSnackbar } from "notistack"
import { useTheme } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import api from "../../libs/api"
import Accordion from "../../components/SettingsAccordion"
import Dialog from "../../components/Dialog"
import UsersColumns from "../../libs/tableColumns/SettingsUsers"
import { UsersTopButtons } from "./Users.TopButtons"
import CreateInviteNewUser from "../../forms/CreateInviteNewUser"

export default function Users() {
  const theme = useTheme()
  const { t } = useTranslation("private")
  const { enqueueSnackbar } = useSnackbar()
  const [dialog, setDialog] = React.useState(null)
  const [companyUsers, setCompanyUsers] = React.useState([])
  const company = useSelector((state) => state.company)
  const user = useSelector((state) => state.user)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const companyUsersURL = `/companies/${company.id}/users`
    api
      .get(companyUsersURL, {})
      .then((response) => {
        setCompanyUsers(response.data)
      })
      .catch((error) => {
        enqueueSnackbar("There was a problem getting the users associated with this company.", {
          variant: "error",
        })
      })
  }, [company, enqueueSnackbar])

  const updateCompanyUsers = (newCompanyUser) => {
    setCompanyUsers([newCompanyUser].concat(companyUsers))
  }

  const userCanEditRow = (companyUserRole, userId, rowUserId) => {
    // admins can edit any row
    if (company.company_user_role === "admin") return true
    // users can edit their own row
    if (userId === rowUserId) return true
    return false
  }

  const userRow = (code) => {
    return companyUsers
      .filter((item) => item.company_user_role_code === code)
      .map((rowUser) => {
        return {
          name: `${rowUser.first_name} ${rowUser.last_name}`,
          email: rowUser.email,
          phone: rowUser.phone,
          editable: userCanEditRow(company.company_user_role, user.id, rowUser.id),
        }
      })
  }

  const userTopButtons = UsersTopButtons(setDialog, company.company_user_role, theme, t)

  const userItems = [
    {
      title: t("view.Settings.administrator"),
      columns: UsersColumns(),
      rows: userRow("admin"),
    },
    {
      title: t("view.Settings.super_intendent"),
      columns: UsersColumns(),
      rows: userRow("super"),
    },
  ]

  if (company.company_type === "trade") {
    userItems.push({
      title: t("view.Settings.Crew"),
      columns: UsersColumns(),
      rows: userRow("crew"),
    })
  }

  return (
    <>
      {company.company_user_role !== "crew" ? (
        <Box sx={{ mb: 3 }}>
          <Grid container alignItems="center" justifyContent="flex-end">
            {userTopButtons}
          </Grid>
        </Box>
      ) : (
        <></>
      )}
      <Accordion items={userItems}></Accordion>

      <Dialog
        open={dialog === "inviteuserform"}
        onClose={() => setDialog(null)}
        title="Invite New User"
      >
        <CreateInviteNewUser
          onClose={() => setDialog(null)}
          updateCompanyUsers={updateCompanyUsers}
        />
      </Dialog>
    </>
  )
}
