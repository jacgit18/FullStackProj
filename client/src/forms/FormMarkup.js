import React from "react"
import Typography from "@mui/material/Typography"

import Container from "../components/Container"
import FormWideContainer from "../components/FormWideContainer"
import MarkupField from "../components/Fields/Markup"

export default function FormMarkup({ setFieldValue, tickets, values }) {
  const [total, setTotal] = React.useState(0)
  React.useEffect(() => {
    let formTotal = 0
    if (values.type === "tickets" && values.tickets) {
      for (const id in values.tickets) {
        if (values.tickets[id] !== null) {
          formTotal += parseFloat(values.tickets[id])
        } else if (tickets) {
          const ticket = tickets.find((row) => {
            return row.id === id
          })

          if (ticket.co_total || ticket.total) {
            formTotal += ticket.co_total !== 0 ? ticket.co_total : ticket.total
          }
        }
      }
    } else if (values.type === "sum_rates") {
      if (values.laborBreakdown) {
        const laborBreakdownTotal = values.laborBreakdown.reduce(
          (subtotal, { total_cost: current }) => subtotal + parseFloat(current),
          0
        )
        formTotal += laborBreakdownTotal
        if (values.laborMarkup) {
          const laborMarkupTotal = values.laborMarkup.reduce(
            (subtotal, { amount: current }) => subtotal + (current / 100) * laborBreakdownTotal,
            0
          )
          formTotal += laborMarkupTotal
        }
      }
      if (values.materialBreakdown) {
        const materialBreakdownTotal = values.materialBreakdown.reduce(
          (subtotal, { total_cost: current }) => subtotal + parseFloat(current),
          0
        )
        formTotal += materialBreakdownTotal
        if (values.materialMarkup) {
          const materialMarkupTotal = values.materialMarkup.reduce(
            (subtotal, { amount: current }) => subtotal + (current / 100) * materialBreakdownTotal,
            0
          )
          formTotal += materialMarkupTotal
        }
      }
      if (values.equipmentBreakdown) {
        const equipmentBreakdownTotal = values.equipmentBreakdown.reduce(
          (subtotal, { total_cost: current }) => subtotal + parseFloat(current),
          0
        )
        formTotal += equipmentBreakdownTotal
        if (values.equipmentMarkup) {
          const equipmentMarkupTotal = values.equipmentMarkup.reduce(
            (subtotal, { amount: current }) => subtotal + (current / 100) * equipmentBreakdownTotal,
            0
          )
          formTotal += equipmentMarkupTotal
        }
      }
    } else if (values.type === "sum_total" && values.manual_total.length) {
      formTotal = values.manual_total
    }
    setTotal(formTotal)
  }, [tickets, values])

  return (
    <Container removeTop>
      <FormWideContainer>
        <Typography variant="h2">Markups on Total</Typography>
        <MarkupField name="form" setData={setFieldValue} total={total} value={values.formMarkup} />
      </FormWideContainer>
    </Container>
  )
}
