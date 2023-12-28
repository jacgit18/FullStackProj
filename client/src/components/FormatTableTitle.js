import React from "react"
import Typography from "@mui/material/Typography"

export default function FormatTableTitle({ children }) {
  return (
    <Typography
      className="subject"
      style={{
        color: "#143366",
        fontWeight: 700,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: 200,
      }}
    >
      {children}
    </Typography>
  )
}
