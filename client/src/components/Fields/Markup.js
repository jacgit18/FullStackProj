import React from "react"
import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import BreakdownTable from "../BreakdownTable"
import AddMarkupForm from "../../forms/AddMarkup"
import MarkupColumns from "../../libs/tableColumns/markup"

export default function Markup({ name, setData, total, value }) {
  const { t } = useTranslation("private")
  const [markups, setMarkups] = React.useState(value)
  const [totals, setTotals] = React.useState(0)
  const [columns, setColumns] = React.useState([])

  React.useEffect(() => {
    const handleDeleteRow = (rowId) => {
      setData(
        `${name}Markup`,
        value.filter((row, index) => index !== rowId - 1)
      )
    }

    setColumns(
      MarkupColumns({
        handleDeleteRow,
        editable: true,
      })
    )

    let markupSubtotal = 0
    setMarkups(
      value.map((row) => {
        const rowTotal = (row.amount / 100) * total
        markupSubtotal += rowTotal
        return {
          ...row,
          total: rowTotal,
        }
      })
    )
    setTotals({ total: markupSubtotal })
  }, [total, value, name, setData])

  return (
    <Grid item xs={12} container justifyContent="flex-end">
      <Grid item xs={12} md={6}></Grid>
      <Grid item xs={12} md={6}>
        <Grid item xs={12}>
          <BreakdownTable columns={columns} editable rows={markups} totals={totals} />
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Typography variant="h4" style={{ margin: "20px 0 10px" }}>
            {t("view.ChangeOrder.markup")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AddMarkupForm data={value} setData={setData} type={name} />
        </Grid>
      </Grid>
    </Grid>
  )
}
