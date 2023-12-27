import React from "react"
import Grid from "@mui/material/Grid"
import * as Yup from "yup"
import { Form, Formik } from "formik"
import { useSelector } from "react-redux"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"

import api from "../libs/api"
import Button from "../components/Button"
import FormSmallContainer from "../components/FormSmallContainer"
import SelectField from "../components/Fields/Select"

export default function AddUserForm({ onCancel, props }) {
  const project = useSelector((state) => state.project)
  const company = useSelector((state) => state.company)
  const [optionsUsers, setOptionsUsers] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("private")

  React.useEffect(() => {
    const projectUsersURL = `/project/${project.id}/users_not_in_project`
    api({
      method: "get",
      url: projectUsersURL,
    })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOptionsUsers(
            response.data.map((item) => {
              return {
                label: `${item.first_name} ${item.last_name} (${item.email})`,
                value: item.id,
              }
            })
          )
        }
      })
      .catch(() => {
        enqueueSnackbar("There was a problem loading the users.", {
          variant: "error",
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  return (
    <>
      <Formik
        validateOnChange={false}
        initialValues={{
          id: "",
          project_user_role_code: props.project_user_role_code,
        }}
        validationSchema={Yup.object().shape({
          id: Yup.string().required(t("form.message.selectUserRequired")),
        })}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          const addProjectUserURL = `/project/${project.id}/users`
          api({
            method: "post",
            headers: { company_id: company.id },
            data: values,
            url: addProjectUserURL,
          })
            .then((response) => {
              if (response.status === 200) {
                props.updateProjectUsers(response.data)
                resetForm()
                onCancel(false)
                enqueueSnackbar("User Added to Project", {
                  variant: "success",
                })
              }
            })
            .catch(() => {
              enqueueSnackbar("There was a problem connecting a user with this project.", {
                variant: "error",
              })
            })
        }}
      >
        {({ errors, handleBlur, handleChange, isSubmitting, isValid, touched, values }) => {
          return (
            <Form>
              <FormSmallContainer>
                <Grid container spacing={2} mt={1} mb={4}>
                  <Grid item xs={12}>
                    <SelectField
                      autoFocus
                      error={Boolean(touched.id && errors.id)}
                      helperText={touched.id && errors.id}
                      name="id"
                      label="Select User"
                      options={optionsUsers}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.id}
                    />
                  </Grid>
                  <Grid container justifyContent="flex-start" item xs={6}>
                    <Button onClick={() => onCancel(false)} color="secondary" variant="text">
                      Cancel
                    </Button>
                  </Grid>
                  <Grid container justifyContent="flex-end" item xs={6}>
                    <Button type="submit">Add</Button>
                  </Grid>
                </Grid>
              </FormSmallContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
