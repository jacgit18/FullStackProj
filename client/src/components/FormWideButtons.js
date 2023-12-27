import React from "react"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import AddIcon from "@mui/icons-material/Add"

import Button from "./Button"
import Container from "./Container"
import FormWideContainer from "./FormWideContainer"

export default function FormWideButtons({ cancel, submit }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Container removeTop>
      <FormWideContainer>
        <Grid container spacing={3}>
          {cancel ? (
            <Grid item md={6} container justifyContent="flex-start">
              <Button onClick={cancel.action} color="secondary" variant="text">
                {cancel.text}
              </Button>
            </Grid>
          ) : (
            ""
          )}

          {submit ? (
            <Grid item md={6} container justifyContent={isMobile ? "flex-start" : "flex-end"}>
              <Button
                disabled={submit.disabled}
                isLoading={submit.isSubmitting}
                size="large"
                type="submit"
                endIcon={submit.icon || <AddIcon />}
              >
                {submit.text}
              </Button>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </FormWideContainer>
    </Container>
  )
}
