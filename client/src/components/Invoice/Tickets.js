import React from "react"
// import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
// import { makeStyles } from "@mui/material/styles"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import BreakdownTable from "../BreakdownTable"
import api from "../../libs/api"
// import { formatMoney } from "../../libs/format"
import Columns from "../../libs/tableColumns/ticketsListInvoice"
// import InvoiceMarkup from "./Markup"

// const useStyles = makeStyles(() => ({
//   totals: {
//     paddingBottom: 40,
//   },
//   total: {
//     fontSize: 18,
//   },
// }))

export default function Tickets({ tickets, data }) {
  // const { t } = useTranslation("private")
  // const classes = useStyles()
  const columns = Columns()
  const project = useSelector((state) => state.project)
  // const [paidTotal, setPaidTotal] = React.useState(0)
  // const [subtotal, setSubtotal] = React.useState(0)
  const [storedTickets, setStoredTickets] = React.useState({})
  const ticketsEndpoint = `/project/${project.id}/ticket`

  React.useEffect(() => {
    //pulling the tickets on load
    const loadItems = async () => {
      const { data } = await api.get(`${ticketsEndpoint}?include=${tickets.join(",")}`)
      return data
    }
    loadItems()
      .then((response) => {
        console.log("response", response)
        setStoredTickets(response)
        // let subtotal = 0
        // let paidTotal = 0
        // response.forEach((ticket) => {
        //   subtotal += ticket.co_total ? parseFloat(ticket.co_total) : parseFloat(ticket.total)
        //   paidTotal += parseFloat(ticket.paid)
        // })
        // setPaidTotal(paidTotal)
        // setSubtotal(subtotal)
      })
      .catch((error) => console.log("error", error))
  }, [tickets, ticketsEndpoint])

  return (
    <>
      {storedTickets ? (
        <Grid container style={{ paddingTop: 50 }}>
          <Grid item container xs={12} justifyContent="flex-start">
            <Grid item xs={12}>
              <Typography variant="h2">Tickets</Typography>
            </Grid>
            <Grid item xs={12}>
              <BreakdownTable columns={columns} rows={storedTickets} />
            </Grid>
          </Grid>
          {/* <InvoiceMarkup name={"Total Markup"} rows={data.markup} total={data.total} /> */}

          {/* <Grid item container xs={12} justifyContent="flex-end" style={{ paddingTop: 10 }}>
            <Grid item container justifyContent={"flex-end"} className={classes.totals}>
              <Grid item xs={12} md={12} container justifyContent={"flex-end"}>
                <Typography variant="body2">
                  {t("view.ChangeOrder.Summary.subtotal")}: {formatMoney(subtotal)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} container justifyContent={"flex-end"}>
                <Typography variant="body2" style={{ paddingTop: 10 }}>
                  {t("view.ChangeOrder.Summary.payments")}: {formatMoney(paidTotal)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} container justifyContent={"flex-end"}>
                <Typography
                  variant="body2"
                  style={{ fontWeight: 800, fontSize: 15, paddingTop: 10 }}
                >
                  {t("view.ChangeOrder.Summary.total_due")}: {formatMoney(subtotal - paidTotal)}
                </Typography>
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      ) : (
        ""
      )}
    </>
  )
}
