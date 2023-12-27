import React from "react"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"

export default function DeleteButton(props) {
  return (
    <IconButton color="secondary" {...props} size="large">
      <DeleteIcon />
    </IconButton>
  )
}
