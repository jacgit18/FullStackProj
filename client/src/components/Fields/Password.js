import React from "react"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"

import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

import TextField from "./Text"

export default function Password(props) {
  const [showPassword, setShowPassword] = React.useState(false)
  const handleClick = () => setShowPassword(!showPassword)
  const handleMouseDown = (event) => event.preventDefault()

  return (
    <TextField
      label="Password"
      name="password"
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              edge="end"
              size="large"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
}
