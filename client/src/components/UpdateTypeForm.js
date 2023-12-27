import React from "react"
import { InputLabel } from "@mui/material"
import { Grid, Typography } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import Button from "./Button"
import Container from "./Container"
import FormWideContainer from "./FormWideContainer"
import TextField from "./Fields/Text"
import Switch from "./Fields/Switch"

export default function UpdateTypeForm({ editType, handleCloseEditType }) {
  return (
    <>
      <Dialog
        open={editType}
        onClose={handleCloseEditType}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <Container>
          <DialogTitle disableTypography>
            <Typography variant="h1">Update [ ] Type </Typography>
          </DialogTitle>
          <DialogContent>
            <FormWideContainer>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField autoFocus margin="normal" id="name" label="Name " type="email" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField margin="normal" id="name" label="Cost Code" type="email" />
                </Grid>

                <Grid
                  item
                  container
                  xs={12}
                  md={6}
                  direction="column"
                  justifyContent="center"
                  style={{ paddingLeft: 20 }}
                >
                  <InputLabel>Active</InputLabel>
                  <Switch />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField margin="normal" id="name" label="Rate" type="email" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField margin="normal" id="name" label="Unit of Measure" type="email" />
                </Grid>
                <Grid item xs={12}>
                  <TextField margin="normal" id="name" label="Notes" type="email" />
                </Grid>
              </Grid>
            </FormWideContainer>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Button onClick={handleCloseEditType} color="secondary" variant="text">
                Cancel
              </Button>
              <Button onClick={handleCloseEditType} color="primary">
                Update
              </Button>
            </Grid>
          </DialogActions>
        </Container>
      </Dialog>
    </>
  )
}
