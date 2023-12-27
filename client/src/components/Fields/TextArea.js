import React from "react"
import TextField from "./Text"

export default function TextArea({ rows, initialValue, ...props }) {
  const [value, setValue] = React.useState(initialValue)
  return (
    <TextField
      multiline
      maxRows={10}
      minRows={rows || 3}
      onChange={(event) => setValue(event.target.value)}
      value={value}
      {...props}
    />
  )
}
