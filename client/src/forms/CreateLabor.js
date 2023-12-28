import React, {useEffect, useState} from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useDispatch, useSelector } from "react-redux"
import { Prompt } from "react-router-dom"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import {useTranslation} from "react-i18next"

import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import SelectField from "../components/Fields/Select"
import TextField from "../components/Fields/Text"
import TextAreaField from "../components/Fields/TextArea"
import api from "../libs/api"
import { addLabor } from "../store/features/laborSlice"
import {convertToNumber} from "../util/number"
import {processFormValues} from "./CreateLabor.submit"


function hasNoRates({rate_rt, rate_ot, rate_pot, rate_dt, rate_pdt}) {
  return convertToNumber(rate_rt) == null && convertToNumber(rate_ot) == null && convertToNumber(rate_pot) == null
    && convertToNumber(rate_dt) == null && convertToNumber(rate_pdt) == null
}

export default function AddLaborForm({ onCancel }) {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const company = useSelector((state) => state.company)
  const project = useSelector((state) => state.project)
  const [subOptions, setSubOptions] = useState([])
  const { t } = useTranslation("private")

  useEffect(() => {
    if (company.company_type === 'cm') {
      api({
        method: "get",
        url: `/project/${project.id}/trade_company_list`,
      }).then(
        (res) => {
          if (Array.isArray(res.data)) {
            setSubOptions(res.data.map((sub) => ({
              label: sub.name,
              value: sub.id,
            })))
          }
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.id, project.id])

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        name: "",
        cost_code: "",
        date_start: (new Date()).toDateString(),
        date_end: null,
        notes: "",
        rate_rt: "",
        rate_ot: "",
        rate_dt: "",
        rate_pot: "",
        rate_pdt: "",
        subcontractor_id: company.company_type === 'trade' ? company.id : "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(t("form.message.nameRequired")),
        subcontractor_id: Yup.string().required(t("form.message.subcontractorRequired")),
        date_start: Yup.string().required(t("form.message.dateStartRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        api({
          method: "post",
          url: `/project/${project.id}/labor`,
          data: processFormValues(values),
        })
        .then(async (response) => {
          if (response.data.id) {
            dispatch(addLabor(response.data))
            resetForm()
            enqueueSnackbar("Project Created", {
              variant: "success",
            })
            onCancel(false)
          } else {
            enqueueSnackbar("There was a problem creating the project, code: 104", {
              variant: "error",
            })
          }
        })
        .catch(() => {
            enqueueSnackbar("There was a problem creating the project, code: 102", {
              variant: "error",
            })
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
    >
    {({
      errors,
      handleBlur,
      handleChange,
      isSubmitting,
      isValid,
      touched,
      values,
      setFieldValue,
    }) => {
      return (
      <Form>
      <Prompt
          // The select company form is only for GCs. For subs using this form, they are the selected company.
          when={Object.keys(touched).length > 0}
          message="You have unsaved changes, are you sure you want to leave?"
      />
      <FormSmallContainer>
        <Grid container spacing={2}>
          {company.company_type === 'cm'
            ? <Grid item xs={12}>
              <SelectField
                autoFocus
                error={Boolean(touched.subcontractor_id && errors.subcontractor_id)}
                helperText={touched.subcontractor_id && errors.subcontractor_id}
                label="Subcontractor"
                name="subcontractor_id"
                options={subOptions}
                onChange={handleChange}
                renderInput={(props) => <TextField {...props} />}
                value={values.subcontractor_id}
              />
            </Grid>
            : <></>
          }
          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              autoFocus id="name"
              label="Name"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.cost_code && errors.cost_code)}
              helperText={touched.cost_code && errors.cost_code}
              id="cost_code"
              label="Cost Code"
              name="cost_code"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.cost_code}
            />
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} md={6}>
              <DatePicker
                autoOk={true}
                error={Boolean(touched.date_start && errors.date_start)}
                helperText={touched.date_start && errors.date_start}
                format="MM/dd/yyyy"
                inputVariant="outlined"
                label="Start Date"
                mask="__/__/____"
                name="date_start"
                onChange={(date) => {
                  setFieldValue("date_start", date ? date.toString() : "")
                }}
                renderInput={(props) => <TextField {...props} />}
                showTodayButton={true}
                style={{ backgroundColor: "white", width: "100%" }}
                value={values.date_start}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                autoOk={true}
                error={Boolean(touched.date_end && errors.date_end)}
                helperText={touched.date_end && errors.date_end}
                format="MM/dd/yyyy"
                inputVariant="outlined"
                label="End Date"
                mask="__/__/____"
                name="date_end"
                onChange={(date) => {
                  setFieldValue("date_end", date ? date.toString() : "")
                }}
                renderInput={(props) => <TextField {...props} />}
                showTodayButton={true}
                style={{ backgroundColor: "white", width: "100%" }}
                value={values.date_end}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </LocalizationProvider>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={7} md>
              <TextField
                error={Boolean(touched.rate_rt && errors.rate_rt)}
                helperText={touched.rate_rt && errors.rate_rt}
                id="rate_rt"
                label="Regular Time"
                type="number"
                name="rate_rt"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rate_rt}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={7} md>
              <TextField
                error={Boolean(touched.rate_ot && errors.rate_ot)}
                helperText={touched.rate_ot && errors.rate_ot}
                id="rate_ot"
                label="Overtime"
                type="number"
                name="rate_ot"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rate_ot}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={7} md>
              <TextField
                error={Boolean(touched.rate_dt && errors.rate_dt)}
                helperText={touched.rate_dt && errors.rate_dt}
                id="rate_dt"
                label="Double Time"
                type="number"
                name="rate_dt"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rate_dt}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={7} md>
              <TextField
                error={Boolean(touched.rate_pot && errors.rate_pot)}
                helperText={touched.rate_pot && errors.rate_pot}
                id="rate_pot"
                label="Premium Time"
                type="number"
                name="rate_pot"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rate_pot}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={7} md>
              <TextField
                error={Boolean(touched.rate_pdt && errors.rate_pdt)}
                helperText={touched.rate_pdt && errors.rate_pdt}
                id="rate_pdt"
                label="Premium Double"
                type="number"
                name="rate_pdt"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rate_pdt}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextAreaField
              error={Boolean(touched.notes && errors.notes)}
              helperText={touched.notes && errors.notes}
              id="notes"
              label="Notes"
              name="notes"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.notes}
            />
          </Grid>
          <Grid container justifyContent="flex-start" item xs={6}>
            <Button onClick={() => onCancel(false)} color="secondary" variant="text">
              Cancel
            </Button>
          </Grid>
          <Grid container justifyContent="flex-end" item xs={6}>
            <Button
              disabled={!Object.keys(touched).length || !isValid || hasNoRates(values)}
              isLoading={isSubmitting}
              type="submit"
            >
              Add
            </Button>
          </Grid>
        </Grid>
        </FormSmallContainer>
        </Form>
      )}
    }
    </Formik>
  )
}
