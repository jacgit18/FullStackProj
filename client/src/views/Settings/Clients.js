import React from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"

import Accordion from "../../components/SettingsAccordion"
import Button from "../../components/Button"
import Dialog from "../../components/Dialog"
import Fab from "../../components/Fab"
import FormSmallContainer from "../../components/FormSmallContainer"
import TextField from "../../components/Fields/Text"
import ContactsColumns from "../../libs/tableColumns/SettingsContacts"

const mockContactRows = [
  { contact: "Allison Reynolds", email: "areynolds@clientcompany.com", phone: "(917) 555-1212" },
  { contact: "Andrew Clark", email: "aclark@clientcompany.com", phone: "(917) 555-1212" },
  { contact: "Brian Johnson", email: "bjohnson@clientcompany.com", phone: "(917) 555-1212" },
  { contact: "Claire Standish", email: "cstandish@clientcompany.com", phone: "(917) 555-1212" },
  { contact: "John Bender", email: "jbender@clientcompany.com", phone: "(917) 555-1212" },
]

const AddClientForm = ({ onClose }) => {
  return (
    <FormSmallContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField autoFocus name="name" label="Company Name" />
        </Grid>
        <Grid item xs={12}>
          <TextField name="address" label="Address" />
        </Grid>
        <Grid item xs={12}>
          <TextField name="phone" label="Phone Number" type="tel" />
        </Grid>
        <Grid container justifyContent="flex-start" item xs={6}>
          <Button onClick={onClose} color="secondary" variant="text">
            Cancel
          </Button>
        </Grid>
        <Grid container justifyContent="flex-end" item xs={6}>
          <Button onClick={onClose} type="submit" endIcon={<EditIcon />}>
            Create
          </Button>
        </Grid>
      </Grid>
    </FormSmallContainer>
  )
}

const AddContactForm = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField autoFocus name="first_name" label="First Name" />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField name="last_name" label="Last Name" />
      </Grid>
      <Grid item xs={12}>
        <TextField name="email" label="Email Address" type="email" />
      </Grid>
      <Grid item xs={12}>
        <TextField name="phone" label="Phone Number" type="tel" />
      </Grid>
    </Grid>
  )
}

export default function ClientsTables() {
  const theme = useTheme()
  const { t } = useTranslation("private")
  const [dialog, setDialog] = React.useState(null)

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item>
            <Fab
              onClick={() => setDialog("addclientform")}
              size="medium"
              variant="extended"
              style={{ backgroundColor: "white", color: theme.palette.secondary.main }}
              // sx={{ bgColor: "background.paper", mb: 3, color: "secondary.dark" }}
            >
              <AddIcon />
              {t("view.Settings.client")}
            </Fab>
          </Grid>
          <Grid item>
            <Fab
              edge="end"
              size="medium"
              variant="extended"
              style={{ backgroundColor: "white", color: theme.palette.secondary.main }}
            >
              {t("view.Settings.archive")}
            </Fab>
          </Grid>
        </Grid>
      </Box>

      <Accordion
        items={[
          {
            title: "Turner Construction, Inc",
            details: [
              {
                title: t("view.Settings.phone"),
                content: "(212) 555-1212",
              },
              {
                title: t("view.Settings.address"),
                content: "4430 42nd St New York, NY 10006",
              },
            ],
            columns: ContactsColumns(),
            rows: mockContactRows,
            headerRight: (
              <>
                <Button
                  color="secondary"
                  startIcon={<EditIcon />}
                  variant="text"
                  onClick={(event) => {
                    event.stopPropagation()
                    setDialog("addclientform")
                  }}
                >
                  Edit
                </Button>
              </>
            ),
            addForm: {
              submitText: "Add Contact",
              openButtonText: "Contact",
              title: "Add Contact",
              form: <AddContactForm />,
              handler: () => {
                // Function to add material
              },
            },
          },
          {
            title: "Client Two",
            details: [
              {
                title: t("view.Settings.phone"),
                content: "(212) 555-1212",
              },
              {
                title: t("view.Settings.address"),
                content: "4430 42nd St New York, NY 10006",
              },
            ],
            columns: ContactsColumns(),
            rows: mockContactRows,
            headerRight: (
              <>
                <Button
                  color="secondary"
                  startIcon={<EditIcon />}
                  variant="text"
                  onClick={(event) => {
                    event.stopPropagation()
                    setDialog("addclientform")
                  }}
                >
                  Edit
                </Button>
              </>
            ),
            addForm: {
              submitText: "Add Contact",
              openButtonText: "Contact",
              title: "Add Contact",
              form: <AddContactForm />,
              handler: () => {
                // Function to add material
              },
            },
          },
          {
            title: "Skanska",
            details: [
              {
                title: t("view.Settings.phone"),
                content: "(212) 555-1212",
              },
              {
                title: t("view.Settings.address"),
                content: "4430 42nd St New York, NY 10006",
              },
            ],
            columns: ContactsColumns(),
            rows: mockContactRows,
            headerRight: (
              <>
                <Button
                  color="secondary"
                  startIcon={<EditIcon />}
                  variant="text"
                  onClick={(event) => {
                    event.stopPropagation()
                    setDialog("addclientform")
                  }}
                >
                  Edit
                </Button>
              </>
            ),
            addForm: {
              submitText: "Add Contact",
              openButtonText: "Contact",
              title: "Add Contact",
              form: <AddContactForm />,
              handler: () => {
                // Function to add material
              },
            },
          },
        ]}
      ></Accordion>

      <Dialog open={dialog === "addclientform"} onClose={() => setDialog(null)} title="Add Client">
        <AddClientForm onClose={() => setDialog(null)} />
      </Dialog>
    </>
  )
}
