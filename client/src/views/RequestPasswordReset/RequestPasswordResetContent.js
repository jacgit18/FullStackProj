import React from "react"
import { useTranslation } from "react-i18next"
import { useMediaQuery, useTheme } from "@mui/material"
import { Box, Grid, Typography } from "@mui/material"

import landingImage from "../../assets/landing-illustration.svg"

export default function RequestPasswordResetContent() {
  const { t } = useTranslation("public")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const centerIfMobile = isMobile ? "center" : "flex-start"
  const centerTextMobile = isMobile ? "center" : "left"

  return (
    <Grid container justifyContent={centerIfMobile} spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h1" align={centerTextMobile} m={0}>
          {t("view.requestPasswordReset.title")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography align={centerTextMobile} variant="body2">
          {t("view.requestPasswordReset.content")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography align={centerTextMobile} variant="body2">
          {t("view.requestPasswordReset.moreContent")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          component="img"
          alt="illustration"
          role="presentation"
          src={landingImage}
          sx={{
            width: 280,
          }}
        />
      </Grid>
    </Grid>
  )
}
