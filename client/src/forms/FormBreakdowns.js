import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

import Container from "../components/Container"
import FormWideContainer from "../components/FormWideContainer"
import BreakdownField from "../components/Fields/Breakdown"
import { getEquipmentTypes } from "../store/features/equipmentSlice"
import { getLaborTypes } from "../store/features/laborSlice"
import { getMaterialTypes } from "../store/features/materialSlice"

const getTicketDates = (values) => {
  return {
    date_start: values.date_start,
    date_end: values.date_end,
  }
}

const updateLaborDateForTicketDates = (strLaborDate, strTicketStart, strTicketEnd) => {
  // convert to dates so we can compare
  const laborDate = new Date(strLaborDate)
  const ticketStart = strTicketStart ? new Date(strTicketStart) : null
  const ticketEnd = strTicketEnd ? new Date(strTicketEnd) : null
  // no end date
  if (ticketEnd === null) {
    // labor date is ok, then return, otherwise start date
    return ticketStart === null || ticketStart <= laborDate ? strLaborDate : strTicketStart
  }
  // no start date
  if (ticketStart === null) {
    // labor date is ok, then return, otherwise end date
    return ticketEnd >= laborDate ? strLaborDate : strTicketEnd
  }
  // if labor date is between, then its good
  if (ticketStart <= laborDate && ticketEnd >= laborDate) return strLaborDate
  // labor date before start date
  if (ticketStart > laborDate) return strTicketStart
  // labor date after end date
  if (ticketEnd < laborDate) return strTicketEnd
  // weird case, just return laborDate
  return strLaborDate
}

export default function FormBreakdowns({
  setFieldValue,
  values
}) {
  const { t } = useTranslation("private")
  const [equipment, setEquipment] = React.useState([])
  const [labor, setLabor] = React.useState([])
  const [material, setMaterial] = React.useState([])
  const project = useSelector(state => state.project)

  // update the table rows whenever breakdown objects are updated
  React.useEffect(() => {
    if (Array.isArray(values.materialBreakdown)) {
      setMaterial(
        values.materialBreakdown.map((row) => {
          return {...row}
        })
      )
    }
    // }
  }, [values.materialBreakdown])

  React.useEffect(() => {
    if (Array.isArray(values.equipmentBreakdown)) {
      setEquipment(
        values.equipmentBreakdown.map((row) => {
          return {...row}
        })
      )
    }
  }, [values.equipmentBreakdown])

  React.useEffect(() => {
    if (Array.isArray(values.laborBreakdown)) {
      setLabor(
        values.laborBreakdown.map((row) => {
          return {...row}
        })
      )
    }
  }, [values.laborBreakdown])

  // When the start and end dates change, we need to update labor objects
  React.useEffect(() => {
    if (Array.isArray(values.laborBreakdown)) {
      setLabor(
        values.laborBreakdown.map((l) => {
          l.date = updateLaborDateForTicketDates(l.date, values.date_start, values.date_end)
          return l
        })
      )
    }
  }, [values.date_start, values.date_end])


  return (
    <>
      <Container removeTop>
        <FormWideContainer>
          <BreakdownField
            formType={values.type}
            label={t("view.ChangeOrder.Labor.title")}
            markupValue={values.laborMarkup}
            name="labor"
            setFieldValue={setFieldValue}
            value={labor}
            breakdownTypeUrl={`/project/${project.id}/labor_for_ticket`}
            noTypesToAddMessage={
              project.project_user_role === 'crew'
                ? t("view.ChangeOrder.Labor.noTypeItemsCrew")
                : t("view.ChangeOrder.Labor.noTypeItemsSuper")
            }
            ticketDates={getTicketDates(values)}
          />
        </FormWideContainer>
      </Container>
      <Container removeTop>
        <FormWideContainer>
          <BreakdownField
            formType={values.type}
            label={t("view.ChangeOrder.Material.title")}
            markupValue={values.materialMarkup}
            name="material"
            setFieldValue={setFieldValue}
            value={material}
            breakdownTypeUrl={'/material'}
            noTypesToAddMessage={
              project.project_user_role === 'crew'
                ? t("view.ChangeOrder.Material.noTypeItemsCrew")
                : t("view.ChangeOrder.Material.noTypeItemsSuper")
            }
          />
        </FormWideContainer>
      </Container>
      <Container removeTop>
        <FormWideContainer>
          <BreakdownField
            formType={values.type}
            label={t("view.ChangeOrder.Equipment.title")}
            markupValue={values.equipmentMarkup}
            name="equipment"
            setFieldValue={setFieldValue}
            value={equipment}
            breakdownTypeUrl={'/equipment'}
            noTypesToAddMessage={
              project.project_user_role === 'crew'
                ? t("view.ChangeOrder.Equipment.noTypeItemsCrew")
                : t("view.ChangeOrder.Equipment.noTypeItemsSuper")
            }
          />
        </FormWideContainer>
      </Container>
    </>
  )
}
