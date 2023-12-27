// @ts-ignore
import api from "../libs/api"
import {convertToNumber} from "../util/number"

function generateMarkupData(markup: any[], markup_type: string): any[] {
  return markup.map((row: any) => ({
    percent: row.amount,
    description: row.title,
    markup_type,
  }))
}

export function submitTicket(values: any, nextTicketNumber: string, projectId: string): Promise<any> {
  // Set up most of our values
  const submitValues: any = Object.keys(values)
    .filter(
      (key) =>
        !(
          key.includes("Breakdown") ||
          key.includes("Markup") ||
          key.includes("files") ||
          key === "isAddCosts" ||
          key === "isLumpSum"
        ) && values[key]
    )
    .reduce((current, key) => {
      return Object.assign(current, { [key]: values[key] })
    }, {})
  // Next number
  submitValues.number = values.number ? values.number.toString() : nextTicketNumber
  // initialize markup
  submitValues.markup = []
  // Set up the cost related stuff
  submitValues.includes_costs = values.isAddCosts
  submitValues.is_lump_sum = values.isLumpSum
  if (submitValues.is_lump_sum) {
    const lumpSumTotal = convertToNumber(values.manual_total)
    submitValues.lump_sum_total = lumpSumTotal == null ? 0 : lumpSumTotal
  }

  // Start and end dates
  const startDate = new Date(values.date_start)
  submitValues.date_start = startDate.toISOString()
  if (values.date_end) {
    const endDate = new Date(values.date_end)
    submitValues.date_end = endDate.toISOString()
  } else {
    delete submitValues.date_end
  }

  // Equipment breakdown and markups
  if (values.equipmentBreakdown.length) {
    submitValues.equipment = values.equipmentBreakdown.map((row: any) => {
      return {
        unit: row.unit,
        quantity: row.quantity,
        rate: row.rate,
        equipment_type_id: row.type_id,
      }
    })
    if (values.type === "sum_rates") {
      submitValues.markup = submitValues.markup.concat(
        generateMarkupData(values.equipmentMarkup, 'equipment')
      )
    }
  }
  // Labor breakdown and markups
  if (values.laborBreakdown.length) {
    submitValues.labor = values.laborBreakdown.map((row: any) => {
      return {
        hours_per_person: row.hours,
        crew_size: row.quantity,
        rate_type: row.rate_type,
        labor_type_id: row.type_id,
        date: row.date,
      }
    })
    if (values.type === "sum_rates") {
      submitValues.markup = submitValues.markup.concat(
        generateMarkupData(values.laborMarkup, 'labor')
      )
    }
  }
  // Material breakdown and markups
  if (values.materialBreakdown.length) {
    submitValues.material = values.materialBreakdown.map((row: any) => {
      return {
        quantity: row.quantity,
        rate: row.rate,
        material_type_id: row.type_id,
        unit: row.unit,
      }
    })
    if (values.type === "sum_rates") {
      submitValues.markup = submitValues.markup.concat(
        generateMarkupData(values.materialMarkup, 'material')
      )
    }
  }
  // Ticket markups
  if (values.formMarkup.length) {
    submitValues.markup = submitValues.markup.concat(
      generateMarkupData(values.formMarkup, 'ticket')
    )
  }

  return api({
    method: "post",
    url: `/project/${projectId}/ticket`,
    data: submitValues,
  })
}
