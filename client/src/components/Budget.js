import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import Typography from "@mui/material/Typography"
import BudgetProgress from "./BudgetProgress"

const useStyles = makeStyles({
  root: {
    marginTop: -10,
    borderRadius: "30px",
    padding: 30,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },

  list: {
    display: "flex",
    justifyContent: "space-between",
  },

  budget: {
    fontSize: "45px",
    color: "#383874",
  },
})

export default function Budget() {
  const classes = useStyles()
  const { t } = useTranslation("private")

  return (
    <>
      <Typography variant="h2" color="textPrimary">
        {t("component.Budget.contingency")}
      </Typography>
      <Typography className={classes.budget} variant="h1">
        $12,875
      </Typography>
      <Typography variant="h3" color="textSecondary">
        {`${t("component.Budget.compared")} $21,490 ${t("component.Budget.last_year")}`}
      </Typography>

      <BudgetProgress month="January" stat={613} color="#8676FF" />
      <BudgetProgress month="February" stat={809} color="#FF708B" />
      <BudgetProgress month="March" stat={200} color="#FFBA69" />
    </>
  )
}
