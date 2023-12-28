import React from "react"
import { Formik, Form } from "formik"
import { useSnackbar } from "notistack"
import { useDispatch, useSelector } from "react-redux"
import Grid from "@mui/material/Grid"
import AddIcon from "@mui/icons-material/Add"

import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import TextAreaField from "../components/Fields/TextArea"
import TextField from "../components/Fields/Text"
import api from "../libs/api"
import { setCompany } from "../store/features/companySlice"
import { updateCompany } from "../store/features/userSlice"

export default function EditCompany({ setDialog }) {
  const dispatch = useDispatch()
  const company = useSelector((state) => state.company)
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        address: company.address ?? "",
        name: company.name ?? "",
        phone: company.phone ?? "",
      }}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        api({
          method: "patch",
          url: `/user/companies/${company.id}`,
          data: values,
        })
          .then(async (response) => {
            setDialog(null)
            if (response.data.id) {
              dispatch(updateCompany(response.data))
              dispatch(setCompany(response.data))

              enqueueSnackbar("Company Information Updated!", {
                variant: "success",
              })
            } else {
              enqueueSnackbar(
                "There was a problem with updating your company's information, 201.",
                {
                  variant: "error",
                }
              )
            }
          })
          .catch(() => {
            enqueueSnackbar("There was a problem with updating your company's information, 202.", {
              variant: "error",
            })
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
    >
      {({ errors, handleBlur, handleChange, isSubmitting, isValid, touched, values }) => {
        return (
          <Form>
            <FormSmallContainer>
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    label="Company Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextAreaField
                    label="Company Address"
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                  />
                </Grid>
                <Grid container justifyContent="flex-start" item xs={6}>
                  <Button onClick={() => setDialog(null)} color="secondary" variant="text">
                    Cancel
                  </Button>
                </Grid>
                <Grid container justifyContent="flex-end" item xs={6}>
                  <Button onClick={() => setDialog(null)} type="submit" endIcon={<AddIcon />}>
                    Update
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
