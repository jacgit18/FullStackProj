import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import logo from "../assets/tracflo_horizontal_dark.svg"

export default function DrawerFooter({ open }) {
  const { t } = useTranslation("common")

  const privacyUrl = "https://tracfloapp.com/privacy-policy"
  const termsUrl = "https://tracfloapp.com/terms"

  return (
    <Box sx={{ display: open ? "block" : "none", mt: 3, pl: 3, pr: 2, width: "239px" }}>
      <Grid container alignItems="center" justifyContent="flex-start">
        <Grid item>
          <Typography sx={{ fontSize: 12, pr: 1 }}>{t("Powered By")}</Typography>
        </Grid>
        <Grid item>
          <Box
            component="img"
            alt="TracFlo"
            src={logo}
            sx={{
              width: "80px",
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          color: "grey.500",
          fontSize: 10,
          textAlign: "left",
          "& a": {
            color: "grey.500",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          },
        }}
      >
        <a href={termsUrl} target="_blank" rel="noreferrer">
          {t("Terms of Service")}
        </a>
        <span> | </span>
        <a href={privacyUrl} target="_blank" rel="noreferrer">
          {t("Privacy Policy")}
        </a>
      </Box>
    </Box>
  )
}
