import React from "react"
import { useTranslation } from "react-i18next"

import Content from "./SigninContent"
import Layout from "../../components/LayoutLanding"
import Form from "../../forms/Signin"

export default function Signin() {
  const { t } = useTranslation("public")
  return <Layout title={t("view.signin.title")} left={<Content />} right={<Form />} />
}
