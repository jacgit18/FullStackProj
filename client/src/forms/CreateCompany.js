import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import Grid from "@mui/material/Grid"
import AddIcon from "@mui/icons-material/Add"

import api from "../libs/api"
import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import SelectField from "../components/Fields/Select"
import TextField from "../components/Fields/Text"
import TextAreaField from "../components/Fields/TextArea"
import { setCompany } from "../store/features/companySlice"
import { addCompany } from "../store/features/userSlice"

export default function CreateCompany({ onCancel }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("private")

  //TODO DEV-213 GET - company type from api
  const companyOptions = [
    { label: "Subcontractor", value: "trade" },
    { label: "General Contractor", value: "cm" },
  ]

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        address: "",
        name: "",
        phone: "",
        company_type: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(t("form.message.nameRequired")),
        company_type: Yup.string().required(t("form.message.companyTypeRequired")),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        api({
          method: "post",
          url: `/company`,
          data: values,
        })
          .then(async (response) => {
            if (response.data.id) {
              dispatch(addCompany(response.data))
              dispatch(setCompany(response.data))
              history.push("/0")
              resetForm()
              enqueueSnackbar("Company Created!", {
                variant: "success",
              })
            } else {
              enqueueSnackbar("There was a problem with creating a company.", {
                variant: "error",
              })
            }
          })
          .catch((error) => {
            enqueueSnackbar("There was a problem with creating a company.", {
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
            <FormSmallContainer>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    label={t("form.label.companyName")}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("form.label.companyNumber")}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextAreaField
                    label={t("form.label.companyAddress")}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SelectField
                    error={Boolean(touched.company_type && errors.company_type)}
                    helperText={touched.company_type && errors.company_type}
                    name="company_type"
                    label="Company Type"
                    options={companyOptions}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.company_type}
                  />
                </Grid>
                <Grid container justifyContent="flex-start" item xs={6}>
                  <Button onClick={onCancel} color="secondary" variant="text">
                    Cancel
                  </Button>
                </Grid>
                <Grid container justifyContent="flex-end" item xs={6}>
                  <Button
                    disabled={!Object.keys(touched).length || !isValid}
                    isLoading={isSubmitting}
                    type="submit"
                    endIcon={<AddIcon />}
                  >
                    {t("form.label.companyCreate")}
                  </Button>
                </Grid>
              </Grid>
            </FormSmallContainer>
          </Form>
        )
      }}
    </Formik>
  )
}
