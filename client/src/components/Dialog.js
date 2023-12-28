import React from "react"
import PropTypes from "prop-types"
import MuiDialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import Container from "./Container"

export default function Dialog({ children, onClose, open, title, ...props }) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog"
      fullWidth
      maxWidth="sm"
      {...props}
    >
      <Container>
        {title ? <DialogTitle sx={{ mt: 0, pb: 0, pt: 0 }}>{title}</DialogTitle> : <></>}
        <DialogContent>{children}</DialogContent>
      </Container>
    </MuiDialog>
  )
}

Dialog.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
}
