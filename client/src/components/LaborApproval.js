import React from "react"
import IconButton from "@mui/material/IconButton"
import Popover from "@mui/material/Popover"
import Typography from "@mui/material/Typography"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom"

import Link from "./Link"
import SwitchField from "./Fields/Switch"

export default function LaborApproval({ handleApprove, params }) {
  const [showRemoveApproval, setShowRemoveApproval] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  // const UpdateApproval = () => (
  //   <SwitchField
  //     checked={params.value}
  //     edge="end"
  //     onChange={() => {
  //       if (handleApprove) {
  //         handleApprove(params.id)
  //       }
  //     }}
  //   />
  // )

  if (params.value === true) {
    const id = `approved-${params.id}`
    return showRemoveApproval === id ? (
      // <UpdateApproval />
      <Link>Reject</Link>
    ) : (
      <>
        <IconButton
          aria-owns={open ? `mouse-over-${params.id}` : undefined}
          aria-haspopup="true"
          id={id}
          onClick={() => setShowRemoveApproval(id)}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <DoneAllIcon sx={{ color: "success.light" }} />
        </IconButton>
        <Popover
          id={`mouse-over-${params.id}`}
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>Click to remove approval</Typography>
        </Popover>
      </>
    )
  } else if (params.created_by === "them") {
    return <Link>Approve</Link> //<UpdateApproval />
  } else {
    return <HourglassBottomIcon sx={{ color: "error.main" }} />
  }
}
