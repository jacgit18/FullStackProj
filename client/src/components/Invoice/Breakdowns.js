import React from "react"
// import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"

import InvoiceBreakdown from "./Breakdown"

export default function Breakdowns({ data }) {
  // const { t } = useTranslation("private")
  const addRates = data.type === "sum_rates"

  return (
    <Grid container style={{ marginTop: 50 }}>
      {data.labor && data.labor.breakdown ? (
        <Grid item container xs={12} justifyContent="flex-start">
          <InvoiceBreakdown
            addRates={addRates}
            markupRows={data.labor.markup}
            name="labor"
            rows={data.labor.breakdown}
            title="Labor"
          />
        </Grid>
      ) : (
        <></>
      )}

      {data.material && data.material.breakdown ? (
        <Grid item container xs={12} justifyContent="flex-start">
          <InvoiceBreakdown
            addRates={addRates}
            markupRows={data.material.markup}
            name="material"
            rows={data.material.breakdown}
            title="Material"
          />
        </Grid>
      ) : (
        <></>
      )}

      {data.equipment && data.equipment.breakdown ? (
        <Grid item container xs={12} justifyContent="flex-start">
          <InvoiceBreakdown
            addRates={addRates}
            markupRows={data.equipment.markup}
            name="equipment"
            rows={data.equipment.breakdown}
            title="Equipment"
          />
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  )
}
