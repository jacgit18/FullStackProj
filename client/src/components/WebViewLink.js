import React from "react"
import { Link } from "react-router-dom"

export default function WebViewLink({ children, to, viewUrl, ...restOfattrs }) {
  return (
    <Link
      to={{
        pathname: to,
        state: {
          viewUrl,
        },
      }}
      {...restOfattrs}
      style={{ textOverflow: "ellipsis", textDecoration: "none", overflow: "hidden" }}
    >
      {children}
    </Link>
  )
}
