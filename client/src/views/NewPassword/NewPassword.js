import React from "react"
import { useTranslation } from "react-i18next"

import Layout from "../../components/LayoutLanding"
import Content from "./NewPasswordContent"
import Form from "../../forms/NewPassword"

export default function NewPassword() {
  const { t } = useTranslation("public")
  return (
    <Layout
      title={t("view.requestPasswordReset.passwordRecovery")}
      left={<Content />}
      right={<Form />}
    />
  )
}
