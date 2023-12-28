import React from "react"
// import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"

import BreakdownTable from "../BreakdownTable"
import MarkupColumns from "../../libs/tableColumns/markup"

export default function Markup({ name, rows, total }) {
  // const { t } = useTranslation("private")
  const [markups, setMarkups] = React.useState(rows)
  const [totals, setTotals] = React.useState(0)
  const columns = MarkupColumns()

  React.useEffect(() => {
    if (rows && rows.length) {
      let markupSubtotal = 0
      setMarkups(
        rows.map((row) => {
          const rowTotal = (row.amount / 100) * total
          markupSubtotal += rowTotal
          return {
            ...row,
            total: rowTotal,
          }
        })
      )
      setTotals({ total: markupSubtotal })
    }
  }, [total, rows])

  return (
    <Grid item xs={12} container justifyContent="flex-end">
      <Grid item xs={12} md={6}></Grid>
      <Grid item xs={12} md={6} container justifyContent="flex-end">
        <Grid item xs={12}>
          <BreakdownTable columns={columns} rows={markups} totals={totals} />
        </Grid>
      </Grid>
    </Grid>
  )
}
