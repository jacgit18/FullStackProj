import * as React from "react"
import Link from "@mui/material/Link"

// import Button from "./Button"
import Invoice from "./Invoice"
import Modal from "./Modal"

export default function InvoiceModal({ children, data }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Link onClick={handleOpen} style={{ cursor: "pointer", textDecoration: "none" }}>
        {children}
      </Link>
      <Modal handleClose={handleClose} open={open}>
        <Invoice data={data} />
      </Modal>
    </>
  )
}
