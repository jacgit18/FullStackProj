import React from "react"
import { useSelector } from "react-redux"
import makeStyles from "@mui/styles/makeStyles"

import Invoice from "./Invoice"
import api from "../libs/api"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "none",
  },
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

const Printer = React.forwardRef(({ items, show }, ref) => {
  const project = useSelector((state) => state.project)
  // const [numPages, setNumPages] = React.useState(null)
  const classes = useStyles()
  const [tickets, setTickets] = React.useState([])
  const ticketsEndpoint = `/project/${project.id}/ticket`

  React.useEffect(() => {
    //pulling the tickets on load
    const loadItems = async (tickets) => {
      const { data } = await api.get(`${ticketsEndpoint}?include=${tickets.join(",")}`)
      return data
    }
    const ticketIds = []
    if (items) {
      items.forEach((itemInfo) => {
        if (itemInfo.tickets) {
          itemInfo.tickets.forEach((ticketId) => {
            ticketIds.push(ticketId)
          })
        }
      })
    }

    if (ticketIds.length) {
      loadItems(ticketIds)
        .then((response) => {
          setTickets(response)
        })
        .catch((error) => console.log(error))
    }
  }, [items, ticketsEndpoint])

  return items ? (
    <div className={classes.container}>
      <div className={classes.root} ref={ref}>
        <SetOrientation />
        <div>
          {items.map((itemInfo, index) => (
            <div key={itemInfo.id}>
              <Page key={itemInfo.id}>
                <Invoice data={itemInfo} elevation={0} />
              </Page>

              {itemInfo.files
                ? itemInfo.files.map((file, index) => (
                    <Page key={`${itemInfo.id}-${index}`}>
                      {file.is_image ? (
                        <img alt="attachment" src={file.file} style={{ maxWidth: "100%" }} />
                      ) : (
                        ""
                      )}
                    </Page>
                  ))
                : ""}

              {/* This just needs to load the actual tickets */}
              {itemInfo.tickets && tickets
                ? tickets.map((ticketInfo) => (
                    <div key={ticketInfo.id}>
                      <Page>
                        <Invoice data={ticketInfo} elevation={0} />
                      </Page>
                      {/* Prints out the images in the tickets. */}
                      {ticketInfo.files
                        ? ticketInfo.files.map((file, index) => (
                            <Page key={`${ticketInfo.id}-${index}`}>
                              {file.is_image ? (
                                <img
                                  alt="attachment"
                                  src={file.file}
                                  style={{ maxWidth: "100%" }}
                                />
                              ) : (
                                ""
                              )}
                            </Page>
                          ))
                        : ""}
                    </div>
                  ))
                : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    ""
  )
})

export default Printer
