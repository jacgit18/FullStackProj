import * as React from "react"
import makeStyles from "@mui/styles/makeStyles"
// import Backdrop from "@mui/material/Backdrop"
import Fade from "@mui/material/Fade"
import IconButton from "@mui/material/IconButton"
import MuiModal from "@mui/material/Modal"
import CloseIcon from "@mui/icons-material/Close"

import Backdrop from "./Backdrop"

const useStyles = makeStyles((theme) => ({
  modal: {
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    minHeight: 100,
    minWidth: 100,
    width: "auto",
    zIndex: theme.zIndex.drawer + 10,
  },
  modalClose: {
    color: theme.palette.common.white,
    position: "absolute",
    right: 0,
    top: 0,
  },
  modalContainer: {
    backgroundColor: theme.palette.common.black,
    boxShadow: theme.shadows[5],
    height: "100%",
    width: "100%",
    zIndex: theme.zIndex.drawer + 10,
  },
  modalContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100% - 48px)",
    maxWidth: "100%",
    overflowY: "auto",
    width: "100%",
    zIndex: theme.zIndex.drawer + 10,
  },
  modalHeader: {
    backgroundColor: theme.palette.common.black,
    height: 48,
    zIndex: theme.zIndex.drawer + 10,
  },
}))

export default function Modal({ children, handleClose, open }) {
  const classes = useStyles()

  return (
    <MuiModal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        open: !open,
        timeout: 300,
      }}
      className={classes.modal}
      closeAfterTransition
      onClose={handleClose}
      open={open}
    >
      <Fade in={open}>
        <div className={classes.modalContainer}>
          <div className={classes.modalHeader}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className={classes.modalClose}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.modalContent}>{children}</div>
        </div>
      </Fade>
    </MuiModal>
  )
}
