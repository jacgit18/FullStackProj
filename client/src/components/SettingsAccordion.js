import React from "react"
import Box from "@mui/material/Box"

import SettingsAccordionRow from "./SettingsAccordionRow.js"

export default function Accordion({ items, ...options }) {
  const [expanded, setExpanded] = React.useState(items.length === 1 ? 0 : false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Box {...options}>
      {items.map((item, index) => (
        <SettingsAccordionRow
          expanded={expanded}
          handleChange={handleChange}
          index={index}
          item={item}
          key={index}
        />
      ))}
    </Box>
  )
}
