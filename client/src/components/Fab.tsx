import React from "react"
import MuiFab from "@mui/material/Fab"

interface Props {
  children: React.ReactNode,
  color: string,
  props?: any,
}

export default function Fab({ children, color, ...props }: Props) {
  const isTransparent = color === "transparent"

  return (
    <MuiFab
      // @ts-ignore
      color={color || "secondary"}
      sx={{
        background: isTransparent ? "transparent" : null,
        boxShadow: isTransparent ? "none" : null,
        m: 1,
        "&.MuiFab-extended .MuiSvgIcon-root": {
          marginRight: 1,
        },
        "&:hover": isTransparent ? {
          color: "secondary.contrastText",
        } : null,
      }}
      {...props}
    >
      {children}
    </MuiFab>
  )
}
