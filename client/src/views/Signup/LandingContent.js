import React from "react"
import { Trans, useTranslation } from "react-i18next"
import { useTheme } from "@mui/material"
import { Box, Grid, Typography } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import landingImage from "../../assets/landing-illustration.svg"

export default function LandingContent() {
  const { t } = useTranslation("public")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Grid container justifyContent={isMobile ? "center" : "flex-start"} spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h1" m={0}>
          {t("view.signup.content.title")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">{t("view.signup.content.subtitle")}</Typography>
        <Trans i18nKey="view.signup.content.content" t={t}>
          <ul>
            <li>Helped companies cut the time to get paid in half</li>
          </ul>
        </Trans>
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
