import React from "react"
import parse from "html-react-parser"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import EditIcon from "@mui/icons-material/Edit"
import PublishIcon from "@mui/icons-material/Publish"

import MaterialEquipmentView from "./MaterialsEquipment"
import UsersView from "./Users"
import Button from "../../components/Button"
import Container from "../../components/Container"
import DetailsTable from "../../components/DetailsTable.js"
import Dialog from "../../components/Dialog"
import Fab from "../../components/Fab"
import Logo from "../../components/Logo"
import Tabs from "../../components/Tabs"
import EditCompany from "../../forms/EditCompany"

export default function Settings() {
  const { t } = useTranslation("private")
  const [dialog, setDialog] = React.useState(null)

  const company = useSelector((state) => state.company)

  const summary = [
    {
      title: t("view.Settings.phone"),
      content: company.phone ? company.phone : "N/A",
    },
    {
      title: t("view.Settings.address"),
      content: company.address ? parse(company.address) : "N/A",
    },
  ]

  return (
    <>
      <Container>
        <Grid container alignItems="center">
          <Grid container justifyContent="flex-start" item xs={6} md={8}>
            <Typography variant="h1">{t("view.Settings.account_settings")}</Typography>
          </Grid>
          {company.company_user_role === "admin" ? (
            <Grid container justifyContent="flex-end" item xs={6} md={4}>
              <Fab edge="end" variant="extended" onClick={() => setDialog("settingsform")}>
                <EditIcon />
                {t("view.Tickets.edit")}
              </Fab>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h2">{parse(company.name)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsTable details={summary} />
          </Grid>
          <Grid container justifyContent="flex-end" item xs={12} md={6}>
            {company.logo_url ? (
              <>
                {
                  // TODO DEV-198 - Edit Company Image
                  /* <Fab onClick={() => setDialog("uploadform")} size="medium">
                  <EditIcon />
                </Fab> */
                }
                <Logo />
              </>
            ) : (
              <></>
              // <Fab
              //   edge="end"
              //   onClick={() => setDialog("uploadForm")}
              //   variant="extended"
              //   size="medium"
              // >
              //   <PublishIcon /> Upload Logo
              // </Fab>
            )}
          </Grid>
        </Grid>
      </Container>

      <Tabs
        tabs={[
          {
            navigationText: "Users",
            content: <UsersView />,
          },
          // TODO to be included in a future release
          // {
          //   navigationText: "Clients",
          //   content: <ClientsView />,
          // },
          {
            navigationText: "Materials / Equipment",
            content: <MaterialEquipmentView />,
          },
          // TODO to be included in a future release
          // {
          //   navigationText: "Billing",
          //   content: <BillingView />,
          // },
        ]}
      ></Tabs>

      <Dialog
        open={dialog === "settingsform"}
        onClose={() => setDialog(null)}
        title="Company Settings"
      >
        <EditCompany setDialog={setDialog} />
      </Dialog>

      <Dialog open={dialog === "uploadform"} onClose={() => setDialog(null)} title="Upload Logo">
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Button fullWidth startIcon={<PublishIcon />}>
              Upload Logo
            </Button>
          </Grid>
          <Grid container justifyContent="flex-start" item xs={6}>
            <Button onClick={() => setDialog(null)} color="secondary" variant="text">
              Cancel
            </Button>
          </Grid>
          <Grid container justifyContent="flex-end" item xs={6}>
            <Button onClick={() => setDialog(null)} type="submit" endIcon={<EditIcon />}>
              Create
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}
