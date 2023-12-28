import React from "react"
import { useSelector } from "react-redux"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"

import MarkupField from "./Markup"
import BreakdownTable from "../BreakdownTable"
import Fab from "../Fab"
import FormSmallContainer from "../FormSmallContainer"
import AddLaborForm from "../../forms/AddLaborToBreakdown"
import AddMaterialEquipmentForm from "../../forms/AddMaterialEquipmentToBreakdown"
import api from "../../libs/api"
import LaborColumns from "../../libs/tableColumns/labor"
import MaterialEquipmentColumns from "../../libs/tableColumns/materialEquipment"

export default function Breakdown({
  formType,
  label,
  markupValue,
  name,
  buttonText,
  setFieldValue,
  value,
  breakdownTypeUrl,
  noTypesToAddMessage,
  ticketDates,
}) {
  const project = useSelector((state) => state.project)
  const [columns, setColumns] = React.useState([])
  const [dropdownItems, setDropdownItems] = React.useState([])
  const [formActive, setFormActive] = React.useState(false)
  const [totals, setTotals] = React.useState({})
  const addRates = formType === "sum_rates"

  const handleDeleteRow = (rowIndex) => {
    setFieldValue(
      `${name}Breakdown`,
      value.filter((row, index) => index !== (rowIndex - 1))
    )
  }

  React.useEffect(() => {
    api.get(breakdownTypeUrl)
      .then(({data}) => {
        setDropdownItems(data)
      })
  }, [name, project, breakdownTypeUrl])

  React.useEffect(() => {
    const valueArray = Object.values(value)
    switch (name) {
      case "labor":
        setColumns(LaborColumns({ addRates, handleDeleteRow, editable: true }))
        let laborTotals = {
          quantity: valueArray.reduce(
            (total, { quantity: current }) => total + parseInt(current),
            0
          ),
          hours: valueArray.reduce((total, { total_hours: current }) => total + current, 0),
        }
        if (addRates) {
          laborTotals.total = valueArray.reduce(
            (total, { total_cost: current }) => total + parseFloat(current),
            0
          )
        }
        setTotals(laborTotals)
        break
      case "equipment":
      case "material":
        setColumns(MaterialEquipmentColumns({ addRates, handleDeleteRow, editable: true }))
        setTotals(
          addRates
            ? {
                total: valueArray.reduce(
                  (total, { total_cost: current }) => total + parseFloat(current),
                  0
                ),
              }
            : {}
        )
        break
      default:
        break
    }
  }, [addRates, name, setFieldValue, value])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2">{label}</Typography>
      </Grid>
      <Grid item xs={12}>
        {dropdownItems.length === 0
          ? <Typography variant="body1">{noTypesToAddMessage}</Typography>
          : <BreakdownTable columns={columns} editable rows={value} totals={totals} />
        }
      </Grid>
      <Grid item xs={12} container justifyContent="center">
        {!formActive ? (
          <Fab
            variant="extended"
            disabled={dropdownItems.length === 0}
            onClick={() => setFormActive(!formActive)}
          >
            <AddIcon />
            {buttonText || "Add New"}
          </Fab>
        ) : (
          <FormSmallContainer>
            {(() => {
              switch (name) {
                case "labor":
                  return (
                    <AddLaborForm
                      addRates={addRates}
                      data={value}
                      dropdownItems={dropdownItems}
                      setData={setFieldValue}
                      setFormActive={setFormActive}
                      ticketDates={ticketDates}
                    />
                  )
                case "equipment":
                case "material":
                  return (
                    <AddMaterialEquipmentForm
                      addRates={addRates}
                      data={value}
                      dropdownItems={dropdownItems}
                      setData={setFieldValue}
                      setFormActive={setFormActive}
                      type={name}
                    />
                  )
                default:
                  return ""
              }
            })()}
          </FormSmallContainer>
        )}
      </Grid>
      {value.length && addRates ? (
        <MarkupField
          name={name}
          setData={setFieldValue}
          total={totals.total || 0}
          value={markupValue}
        />
      ) : (
        ""
      )}
    </Grid>
  )
}
