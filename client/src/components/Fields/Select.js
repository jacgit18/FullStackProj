import React from "react"
import MenuItem from "@mui/material/MenuItem"

import TextField from "./Text"

export default function Select({ multiple, options, ...props }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <TextField
      select
      {...props}
      multiline
      minRows={1}
      SelectProps={{
        multiple,
        onClose: () => setIsOpen(false),
        onOpen: () => setIsOpen(true),
        open: isOpen,
        // multiple:
        //   groupedClientUsers[role] && groupedClientUsers[role].length > 1
        //     ? true
        //     : null,
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
