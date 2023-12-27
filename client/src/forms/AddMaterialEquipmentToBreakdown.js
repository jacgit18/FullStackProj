import React, {useMemo, useState} from "react"
import { Formik, Form } from "formik"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import AddIcon from "@mui/icons-material/Add"

import Button from "../components/Button"
import SelectField from "../components/Fields/Select"
import TextField from "../components/Fields/Text"
import {convertToNumber} from "../util/number"

export default function AddMaterialEquipmentToBreakdown({
  addRates,
  data,
  dropdownItems,
  setData,
  setFormActive,
  type,
}) {
  const { t } = useTranslation("private")
  const typeOptions = useMemo(() => {
    return dropdownItems.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  }, [dropdownItems])
  const [selectedType, setSelectedType] = useState(null)

  return (
    <div>
      <Formik
        initialValues={{
          // Needed by API
          type_id: "",
          quantity: "",
          rate: "",
          unit: "",
          // For display
          cost_code: "",
          total_cost: "",
          type_name: "",
        }}
        validationSchema={
          addRates
            ? Yup.object().shape({
                type_id: Yup.string().required(t("form.message.materialRequired")),
                quantity: Yup.number()
                  .required(t("form.message.headcountRequired"))
                  .moreThan(0, "Amount must be greater than 0"),
                unit: Yup.string().required(t("form.message.unitRequired")),
                rate: Yup.string().required(t("form.message.rateRequired")),
              })
            : Yup.object().shape({
                type_id: Yup.string().required(t("form.message.materialRequired")),
                quantity: Yup.number()
                  .required(t("form.message.headcountRequired"))
                  .moreThan(0, "Amount must be greater than 0"),
                unit: Yup.string().required(t("form.message.unitRequired")),
              })
        }
        onSubmit={(values, { resetForm }) => {
          // Determine display values
          values.total_cost = convertToNumber(values.quantity) * convertToNumber(values.rate)
          values.cost_code = selectedType.cost_code
          values.type_name = selectedType.name
          // Pass up to parent
          setData(`${type}Breakdown`, [...data, { ...values }])
          resetForm()
          setFormActive(false)
        }}
      >
        {({
          errors,
          handleBlur,
          isSubmitting,
          isValid,
          touched,
          values,
          setFieldValue,
          resetForm,
          submitForm,
          handleChange,
        }) => {
          return (
            <Form>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12}>
                  <SelectField
                    error={Boolean(touched.type_id && errors.type_id)}
                    helperText={touched.type_id && errors.type_id}
                    label="Type"
                    name="type_id"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e)
                      const selectedItem = dropdownItems.find(({ id }) => id === e.target.value)
                      setFieldValue("unit", selectedItem.unit)
                      setFieldValue("rate", selectedItem.rate)
                      setSelectedType(selectedItem)
                    }}
                    options={typeOptions}
                    value={values.type_id}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    InputProps={{ inputProps: { min: 0 } }}
                    label={t("view.ChangeOrder.Material.quantity")}
                    name="quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.quantity}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.unit && errors.unit)}
                    helperText={touched.unit && errors.unit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label={t("view.ChangeOrder.Material.unit")}
                    name="unit"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.unit}
                  />
                </Grid>
                {addRates ? (
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.rate && errors.rate)}
                      helperText={touched.rate && errors.rate}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      label={t("view.ChangeOrder.Material.rate")}
                      name="rate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="number"
                      value={values.rate}
                    />
                  </Grid>
                ) : (
                  ""
                )}

                <Grid container item xs={6} alignContent="center" justifyContent="flex-start">
                  <Button
                    color="secondary"
                    onClick={() => {
                      resetForm()
                      setFormActive(false)
                    }}
                    size="small"
                    variant="text"
                  >
                    {t("view.ChangeOrder.cancel")}
                  </Button>
                </Grid>

                <Grid container item xs={6} alignContent="center" justifyContent="flex-end">
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      submitForm()
                    }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
