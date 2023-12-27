import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import HistoryListItem from "../../components/History/HistoryListItem"

export default function HistoryList({ historyItems }) {
  return historyItems && historyItems.length ? (
    <Box>
      <Typography variant="h2" sx={{ mb: 3 }}>
        History
      </Typography>
      <Box>
        {historyItems.map((item, index) => (
          <HistoryListItem key={index} item={item} />
        ))}
      </Box>
    </Box>
  ) : (
    ""
  )
}
