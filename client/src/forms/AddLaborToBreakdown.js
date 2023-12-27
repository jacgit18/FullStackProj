import React, {useState, useEffect} from "react"
import { Formik, Form } from "formik"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import AddIcon from "@mui/icons-material/Add"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

import Button from "../components/Button"
import SelectField from "../components/Fields/Select"
import TextField from "../components/Fields/Text"
import {getRateTypeName, getRateTypesFromLaborType} from "../libs/rateTypes"
import {convertToNumber} from "../util/number";


export default function AddLaborToBreakdown({
  addRates,
  data,
  dropdownItems,
  setData,
  setFormActive,
  ticketDates,
}) {
  const date_start = ticketDates.date_start ? new Date(ticketDates.date_start) : undefined
  const date_end = ticketDates.date_end ? new Date(ticketDates.date_end) : undefined
  const quantityRef = React.useRef(null)
  const { t } = useTranslation("private")
  const typeOptions = dropdownItems.map((item) => ({
    label: item.name,
    value: item.id,
  }))
  const [rateTypeOptions, setRateTypeOptions] = useState([])
  const [selectedType, setSelectedType] = useState(null)

  // When we update the selected type, we need to make some changes to rate type
  useEffect(() => {
    setRateTypeOptions(getRateTypesFromLaborType(selectedType))
  }, [selectedType])

  return (
    <div>
      <Formik
        initialValues={{
          // needed by API
          date: new Date(),
          hours: 8,
          quantity: "",
          rate_type: "",
          type_id: "",
          // needed to display row data
          rate: "",
          type_name: "",
          cost_code: "",
          rate_type_name: "",
          total_hours: "",
          total_cost: "",
        }}
        validationSchema={
          Yup.object().shape({
            type_id: Yup.string().required(t("form.message.type_idRequired")),
            quantity: Yup.number()
              .required(t("form.message.headcountRequired"))
              .moreThan(0, "Amount must be greater than 0"),
            hours: Yup.string().required(t("form.message.hoursRequired")),
            rate_type: Yup.string().required(t("form.message.rateRequired")),
          })
        }
        onSubmit={(values, { resetForm }) => {
          // set up a bunch of fields we need for displaying
          values.type_name = selectedType.name
          values.cost_code = selectedType.cost_code
          values.rate_type_name = getRateTypeName(values.rate_type)
          values.total_hours = convertToNumber(values.hours) * convertToNumber(values.quantity)
          values.total_cost = values.total_hours * convertToNumber(values.rate)
          // then send it to parent
          setData("laborBreakdown", [...data, { ...values }])
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={12}>
                    <DatePicker
                      autoOk={true}
                      error={Boolean(touched.date && errors.date)}
                      helperText={touched.date && errors.date}
                      format="MM/dd/yyyy"
                      inputVariant="outlined"
                      label="Date"
                      mask="__/__/____"
                      name="date"
                      onChange={(date) => {
                        setFieldValue("date", date ? date.toString() : "")
                      }}
                      renderInput={(props) => <TextField {...props} />}
                      showTodayButton={true}
                      style={{ backgroundColor: "white", width: "100%" }}
                      value={values.date}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      maxDate={date_end}
                      minDate={date_start}
                    />
                  </Grid>
                </LocalizationProvider>
                <Grid item xs={12}>
                  <SelectField
                    autoFocus
                    error={Boolean(touched.type_id && errors.type_id)}
                    helperText={touched.type_id && errors.type_id}
                    label={t("view.ChangeOrder.Labor.type")}
                    name="type_id"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e)
                      const selectedItem = dropdownItems.find(({ id }) => id === e.target.value)
                      if (selectedItem) {
                        setSelectedType(selectedItem)
                      }
                    }}
                    options={typeOptions}
                    renderInput={(props) => <TextField {...props} />}
                    value={values.type_id}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectField
                    error={Boolean(touched.rate_type && errors.rate_type)}
                    helperText={touched.rate_type && errors.rate_type}
                    label={t("view.ChangeOrder.Labor.rate")}
                    name="rate_type"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e)
                      // rate type determines the exact rate, so we need to get it off of the object
                      setFieldValue('rate', selectedType[e.target.value] ?? 1)
                    }}
                    options={rateTypeOptions}
                    renderInput={(props) => <TextField {...props} />}
                    value={values.rate_type}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    InputProps={{ inputProps: { min: 1, step: 1 } }}
                    label="Crew Size (Headcount)"
                    name="quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputRef={quantityRef}
                    type="number"
                    value={values.quantity}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.hours && errors.hours)}
                    helperText={touched.hours && errors.hours}
                    InputProps={{ inputProps: { min: 0, step: 0.25 } }}
                    label={t("view.ChangeOrder.Labor.hours_person")}
                    name="hours"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.hours}
                  />
                </Grid>

                {addRates ? (
                  <Grid item xs={12}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          border: "none",
                          outline: "none",
                        },
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={Boolean(touched.rate && errors.rate)}
                      disabled
                      helperText={touched.rate && errors.rate}
                      label={t("view.ChangeOrder.Labor.hours_rate")}
                      name="rate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      style={{
                        border: "none",
                        outline: "none",
                      }}
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
                    {t("view.ChangeOrder.Labor.add")}
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
