import React from "react"
import { useTranslation } from "react-i18next"

import Content from "./RequestPasswordResetContent"
import Layout from "../../components/LayoutLanding"
import Form from "../../forms/RequestPasswordReset"

export default function RequestPasswordReset() {
  const { t } = useTranslation("public")
  return (
    <Layout
      title={t("view.requestPasswordReset.passwordRecovery")}
      left={<Content />}
      right={<Form />}
    />
  )
}
