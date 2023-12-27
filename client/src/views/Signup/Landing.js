import React from "react"
import { useTranslation } from "react-i18next"

import Content from "./LandingContent"
import Layout from "../../components/LayoutLanding"
import Form from "../../forms/UserInfo"

export default function Landing() {
  const { t } = useTranslation("public")
  return <Layout title={t("view.signup.title")} left={<Content />} right={<Form />} />
}
