import React from "react"
import { Formik, Form } from "formik"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import AddIcon from "@mui/icons-material/Add"

import Fab from "../components/Fab"
import TextField from "../components/Fields/Text"

export default function AddMarkup({ data, setData, type }) {
  const { t } = useTranslation("private")
  return (
    <div>
      <Formik
        initialValues={{
          amount: "",
          id: "",
          title: "",
        }}
        validationSchema={Yup.object().shape({
          amount: Yup.number().required("An amount is required"),
        })}
        onSubmit={(values, { resetForm }) => {
          values.id = (data?.length || 0) + 1
          setData(`${type}Markup`, [...data, { ...values }])
          resetForm()
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
              <Grid container spacing={1} alignItems="flex-start" justifyContent="flex-end">
                <Grid item xs={6}>
                  <TextField
                    label={t("view.ChangeOrder.description")}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={touched.amount && errors.amount}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      inputProps: { min: 1, step: 1 },
                    }}
                    label={t("view.ChangeOrder.amount")}
                    name="amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.amount}
                  />
                </Grid>
                <Grid container item xs={2} justifyContent="flex-end">
                  <Fab disabled={!values.title || !values.amount} onClick={submitForm}>
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
