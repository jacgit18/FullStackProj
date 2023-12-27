import React from "react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import makeStyles from "@mui/styles/makeStyles"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import CheckIcon from "@mui/icons-material/Check"
import ClearIcon from "@mui/icons-material/Clear"
import UndoIcon from "@mui/icons-material/Undo"

import Button from "./Button"
import api from "../libs/api"
import { getProject } from "../store/features/projectSlice"

const useStyles = makeStyles(() => ({
  undo: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    cursor: "pointer",
    "&:hover": {
      color: "red",
    },
  },
}))

export default function DeleteItem({ open, setOpen, data, type }) {
  const classes = useStyles()
  const history = useHistory()
  const project = useSelector(getProject)
  const item = type === "ticket" ? "tickets" : "changeorders"
  const { enqueueSnackbar } = useSnackbar()
  const [invalidTicket, setInvalidTicket] = React.useState(false)

  const action = (key) => (
    <>
      <div
        className={classes.undo}
        onClick={() => {
          api({
            method: "get",
            url: `/project/${project.id}/trash/${type}/${data.id}`,
          })
            .then((response) => {
              history.push(`/0/project/${project.id}/${type}/${data.id}`)
              undoSuccesful()
            })
            .catch((error) => {
              console.log("error", error)
              undoError()
            })
        }}
      >
        <UndoIcon /> <Typography style={{ textDecoration: "underline" }}>Undo</Typography>
      </div>
    </>
  )

  const deletedSuccesful = () => {
    enqueueSnackbar("Deleted successfully", {
      variant: "success",
      action,
    })
  }

  const deletedError = () => {
    enqueueSnackbar("Unable to delete", {
      variant: "error",
    })
  }
  const undoSuccesful = () => {
    enqueueSnackbar("Successfully restored", {
      variant: "success",
    })
  }

  const undoError = () => {
    enqueueSnackbar("Unable to restore", {
      variant: "error",
    })
  }

  const handleClickDelete = () => {
    setOpen(false)
    if (data.co) {
      setInvalidTicket(true)
    } else {
      api({
        method: "delete",
        url: `/project/${project.id}/${type}/${data.id}`,
      })
        .then((response) => {
          history.push(`/0/project/${project.id}/${item}`)
          deletedSuccesful()
        })
        .catch((error) => {
          console.log("error", error)
          deletedError()
        })
    }
  }

  const handleClickClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onClose={handleClickClose} disableEnforceFocus>
        <DialogTitle style={{ textTransform: "capitalize" }}>
          {`Are you sure you want to delete this ${type === "ticket" ? "ticket" : "change order"}?`}
        </DialogTitle>
        <DialogContent>
          <Grid container justifyContent="space-around">
            <Button startIcon={<CheckIcon />} onClick={handleClickDelete}>
              Yes
            </Button>
            <Button startIcon={<ClearIcon />} onClick={handleClickClose}>
              No
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={invalidTicket}
        onClose={() => {
          setInvalidTicket(false)
        }}
        disableEnforceFocus
      >
        <DialogContent>
          Ticket cannot be deleted, because it is part of a change order. Remove from change order
          and try again.
        </DialogContent>
      </Dialog>
    </>
  )
}
