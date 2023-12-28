import React from "react"
import { Trans, useTranslation } from "react-i18next"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import Link from "./Link"

export default function LandingForm() {
  const { t } = useTranslation("public")

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "primary.main",
        textAlign: "center",
        zIndex: 20,
        width: "100%",
      }}
    >
      <Typography style={{ fontSize: 10 }}>
        <Trans
          i18nKey="disclaimer"
          t={t}
          components={[
            <Link
              to={{
                pathname: "https://tracfloapp.com/terms",
              }}
              target="_blank"
            />,
            <Link
              to={{
                pathname: "https://tracfloapp.com/privacy-policy",
              }}
              target="_blank"
            />,
          ]}
        />
      </Typography>
    </Box>
  )
}
