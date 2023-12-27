import React from "react"
import { useSelector } from "react-redux"
import makeStyles from "@mui/styles/makeStyles"

import Invoice from "./Invoice"
import api from "../libs/api"

const useStyles = makeStyles((theme) => ({
  page: {
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    paddingTop: theme.spacing(6),
    pageBreakAfter: "always",
  },
  root: {
    margin: "auto",
    "@media print": {
      body: {
        minWidth: 1200,
      },
    },
  },
}))

const SetOrientation = () => (
  <style type="text/css">{"@media print{@page {size: letter portrait}}"}</style>
)

const Page = ({ children }) => {
  const classes = useStyles()
  return <div className={classes.page}>{children}</div>
}

export default function PrintTickets({ tickets }) {
  const project = useSelector((state) => state.project)
  const classes = useStyles()
  const [loadedTickets, setLoadedTickets] = React.useState([])
  const ticketsEndpoint = `/project/${project.id}/ticket`

  React.useEffect(() => {
    //pulling the tickets on load
    const loadItems = async (tickets) => {
      const { data } = await api.get(`${ticketsEndpoint}?include=${tickets.join(",")}`)
      return data
    }
    const ticketIds = []
    if (tickets) {
      tickets.forEach((ticket) => {
        if (ticket) {
          ticketIds.push(ticket)
        }
      })
    }

    if (ticketIds.length) {
      loadItems(ticketIds)
        .then((response) => {
          setLoadedTickets(response)
        })
        .catch((error) => console.log(error))
    }
  }, [tickets, ticketsEndpoint])

  return tickets ? (
    <div className={classes.container}>
      <div className={classes.root}>
        <SetOrientation />
        <div>{/* This just needs to load the actual tickets */}</div>
        {tickets && loadedTickets
          ? loadedTickets.map((ticketInfo) => (
              <>
                <Page key={ticketInfo.id}>
                  <Invoice data={ticketInfo} elevation={0} />
                </Page>

                {/* Prints out the images in the tickets. */}
                {ticketInfo.files
                  ? ticketInfo.files.map((file, index) => (
                      <Page key={index}>
                        {file.is_image ? (
                          <img alt="attachment" src={file.file} style={{ maxWidth: "100%" }} />
                        ) : (
                          // ) : (
                          //   <iframe
                          //     src={file.file}
                          //     style={{ width: "100%", height: "100%" }}
                          //     frameborder="0"
                          //     title="attachment"
                          //   />
                          ""
                        )}
                      </Page>
                    ))
                  : ""}
              </>
            ))
          : ""}
      </div>
    </div>
  ) : (
    ""
  )
}
