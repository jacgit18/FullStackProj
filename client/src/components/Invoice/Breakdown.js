import React from "react"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import InvoiceMarkup from "./Markup"
import BreakdownTable from "../BreakdownTable"
import laborColumns from "../../libs/tableColumns/labor"
import MaterialEquipmentColumns from "../../libs/tableColumns/materialEquipment"

export default function Breakdown({ addRates, markupRows, name, rows, title }) {
  const [columns, setColumns] = React.useState([])
  const [totals, setTotals] = React.useState({})

  React.useEffect(() => {
    const valueArray = Object.values(rows)
    switch (name) {
      case "labor":
        setColumns(laborColumns({ addRates }))
        let laborTotals = {
          quantity: valueArray.reduce(
            (total, { quantity: current }) => total + parseFloat(current),
            0
          ),
          hours: valueArray.reduce(
            (total, { hours_total: current }) => total + parseFloat(current),
            0
          ),
        }
        if (addRates) {
          laborTotals.total = valueArray.reduce(
            (total, { total: current }) => total + parseFloat(current),
            0
          )
        }
        setTotals(laborTotals)
        break
      case "equipment":
      case "material":
        setColumns(MaterialEquipmentColumns({ addRates }))
        setTotals(
          addRates
            ? {
                total: valueArray.reduce(
                  (total, { total: current }) => total + parseFloat(current),
                  0
                ),
              }
            : {}
        )
        break
      default:
        break
    }
  }, [addRates, name, rows])

  return rows.length ? (
    <>
      <Grid item xs={12}>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <BreakdownTable columns={columns} rows={rows} totals={totals} />
      </Grid>
      {addRates ? <InvoiceMarkup name={name} rows={markupRows} total={totals.total} /> : <></>}
    </>
  ) : (
    ""
  )
}
