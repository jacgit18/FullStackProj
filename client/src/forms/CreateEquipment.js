import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Prompt } from "react-router-dom"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment" // possibe cause of cancel issue

import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import TextField from "../components/Fields/Text"
import api from "../libs/api"
import { addEquipment } from "../store/features/equipmentSlice"

export default function CreateEquipment({ onCancel }) {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("private")

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        cost_code: "",
        name: "",
        rate: "",
        unit: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(t("form.message.nameRequired")),
        rate: Yup.string().required(t("form.message.rateRequired")),
        unit: Yup.string().min(1).required(t("form.message.unitRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        api({
          method: "post",
          url: "/equipment",
          data: values,
        })
          .then(async (response) => {
            if (response.data.id) {
              const newEquipment = response.data
              dispatch(addEquipment(newEquipment))

              resetForm()
              enqueueSnackbar("Equipment Created", {
                variant: "success",
              })
              onCancel(false)
            } else {
              enqueueSnackbar("There was a problem creating the equipment, code: 104", {
                variant: "error",
              })
            }
          })
          .catch((error) => {
            console.log("error", error)
            enqueueSnackbar("There was a problem creating the equipment, code: 102", {
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
              when={Object.keys(touched).length > 0}
              message="You have unsaved changes, are you sure you want to leave?"
            />
            <FormSmallContainer>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    id="name"
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    label={t("form.label.description")}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="cost_code"
                    error={Boolean(touched.cost_code && errors.cost_code)}
                    helperText={touched.cost_code && errors.cost_code}
                    label={t("form.label.cost_code")}
                    name="cost_code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cost_code}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="rate"
                    type="number"
                    error={Boolean(touched.rate && errors.rate)}
                    helperText={touched.rate && errors.rate}
                    label={t("form.label.rate")}
                    name="rate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.rate}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="unit"
                    error={Boolean(touched.unit && errors.unit)}
                    helperText={touched.unit && errors.unit}
                    label={t("form.label.unit")}
                    name="unit"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.unit}
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-start" item xs={6}>
                <Button
                  onClick={() => {
                    onCancel(false)
                  }}
                  color="secondary"
                  variant="text"
                >
                  {t("form.label.cancel")}
                </Button>
              </Grid>
              <Grid container justifyContent="flex-end" item xs={6}>
                <Button
                  disabled={!Object.keys(touched).length || !isValid}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {t("form.label.add")}
                </Button>
              </Grid>
            </FormSmallContainer>
          </Form>
        )
      }}
    </Formik>
  )
}
