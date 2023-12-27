import { Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import { formatDateLongWithTime } from "../../libs/format"

const Signatures = ({ historyItems }) => {
  return historyItems && historyItems.length ? (
    <Grid container spacing={2} sx={{ justifyContent: "flex-end", mt: 3 }}>
      {historyItems
        .map((item, index) => {
          return typeof item.signature === "string" ? (
            <Grid item key={index} xs={12} md={4}>
              <Box
                component="img"
                alt="signature"
                src={item.signature}
                sx={{
                  borderBottom: "1px solid #666",
                  maxWidth: "100%",
                }}
              />
              <Typography>{item.content ? item.content : "Approved"}</Typography>
              <Typography paragraph={true} variant="caption" sx={{ lineHeight: 1.2 }}>
                {`${item.user && item.user.name ? item.user.name : ""}
                        ${item.date ? ` on ${formatDateLongWithTime(item.date)}` : ""}`}
              </Typography>
            </Grid>
          ) : (
            ""
          )
        })
        .reverse()}
    </Grid>
  ) : (
    ""
  )
}

export default Signatures
