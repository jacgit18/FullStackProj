import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useTheme } from "@mui/material"
import Grid from "@mui/material/Grid"
import Tooltip from "@mui/material/Tooltip"
import LeftIcon from "@mui/icons-material/ChevronLeft"
import RightIcon from "@mui/icons-material/ChevronRight"

import Fab from "../components/Fab"

export default function NextPreviousNavigation({ current, itemsList, type, end, start }) {
  const theme = useTheme()
  const project = useSelector((state) => state.project)
  const itemIndex = itemsList.findIndex((item) => current && item.id === current.id)
  const nextInfo = itemIndex !== null ? itemsList[[(itemIndex + 1) % itemsList.length]] : null
  const previousInfo =
    itemIndex !== null ? itemsList[(itemIndex + itemsList.length - 1) % itemsList.length] : null

  return itemsList.length ? (
    <Grid
      container
      spacing={0}
      style={{
        margin: "auto",
        marginBottom: end ? 0 : theme.spacing(3),
        marginTop: start ? 0 : theme.spacing(3),
        maxWidth: 1080,
      }}
    >
      {previousInfo ? (
        <Grid container justifyContent="flex-start" item xs={6}>
          <Tooltip
            placement={end ? "top" : "bottom"}
            title={previousInfo.subject}
            aria-label="Next"
          >
            <span>
              <Fab
                component={Link}
                onClick={() => {
                  window.scrollTo(0, 0)
                }}
                size="medium"
                to={`/0/project/${project.id}/${type}/${previousInfo.id}`}
                variant="extended"
              >
                <LeftIcon style={{ marginLeft: "-8px", marginRight: 0 }} />
                Next
              </Fab>
            </span>
          </Tooltip>
        </Grid>
      ) : (
        <></>
      )}

      {nextInfo ? (
        <Grid container justifyContent="flex-end" item xs={6}>
          <Tooltip
            placement={end ? "top" : "bottom"}
            title={nextInfo.subject}
            aria-label="Previous"
          >
            <span>
              <Fab
                component={Link}
                onClick={() => {
                  window.scrollTo(0, 0)
                }}
                size="medium"
                to={`/0/project/${project.id}/${type}/${nextInfo.id}`}
                variant="extended"
              >
                Previous
                <RightIcon style={{ marginRight: "-8px" }} />
              </Fab>
            </span>
          </Tooltip>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  ) : (
    <></>
  )
}
