import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import Typography from "@mui/material/Typography"

import TextField from "./Text"
import Action from "../Action"
import Container from "../Container"
import DataTable from "../DataTable"
import FormatTitle from "../FormatTableTitle"
import InvoiceModal from "../InvoiceModal"
import { formatMoney } from "../../libs/format"

export default function SelectTickets({ projectId, setFieldValue, tickets, value }) {
  const { t } = useTranslation("private")
  const [showAdjustCostColumn, setShowAdjustCostColumn] = React.useState([])
  const loadingStatus = useSelector((state) => state.user.status.tickets)

  // Makes sure the cost columns are shown if there is an update value
  React.useEffect(() => {
    setShowAdjustCostColumn(Object.keys(value))
  }, [value])

  return (
    <Container fullWidth removeTop>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <DataTable
            columns={[
              // {
              //   field: "id",
              //   headerName: " ",
              //   width: 70,
              //   editable: false,
              // },
              {
                editable: false,
                field: "number",
                headerName: "CO #",
                minWidth: 70,
              },
              {
                field: "subject",
                headerName: t("view.Tickets.subject"),
                width: 200,
                editable: false,
                // renderCell: (params) => <Typography color="secondary">{params.value.title}</Typography>,
                renderCell: (params) => {
                  return (
                    <FormatTitle>
                      <InvoiceModal data={params.row}>{params.row.subject}</InvoiceModal>
                    </FormatTitle>
                  )
                },
                // renderCell: (params) => (
                //   <Link to={`/0/project/${projectId}/ticket/${params.value.id}`}>
                //     <Typography color="secondary" className="subject">
                //       {params.value.title}
                //     </Typography>
                //   </Link>
                // ),
              },
              {
                field: "pco_number",
                headerName: t("view.Tickets.pco"),
                width: 160,
                editable: false,
              },
              {
                field: "action",
                headerName: t("view.Tickets.action"),
                width: 200,
                editable: false,
                hide: true,
                renderCell: (params) => (
                  <Action id={params.value.id} name={params.value.name || "Draft"} />
                ),
              },
              {
                field: "balanceTotal",
                headerName: t("view.Tickets.balance"),
                width: 190,
                editable: false,
                renderCell: (params) => {
                  return (
                    <div>
                      <Typography color="secondary" className="text">
                        {formatMoney(params.row.balance)}
                      </Typography>
                      <Typography align="left">
                        {params.row.co_total !== 0
                          ? formatMoney(params.row.co_total)
                          : formatMoney(params.row.total)}
                      </Typography>
                    </div>
                  )
                },
              },
              {
                field: "adjust_cost",
                width: 180,
                headerName: " ",
                editable: false,
                renderCell: (params) => {
                  // const ticket = params.row
                  const ticketId = params.row.id
                  return (
                    <>
                      {showAdjustCostColumn.includes(ticketId) ? (
                        <TextField
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          label={t("view.Tickets.adjust_cost")}
                          onChange={(event) => {
                            setFieldValue("tickets", {
                              ...value,
                              [ticketId]: event.target.value,
                            })
                          }}
                          style={{ height: 37 }}
                          value={value[ticketId] || ""}
                        />
                      ) : (
                        ""
                      )}
                    </>
                  )
                },
              },
            ]}
            loading={loadingStatus === "loading"}
            // Set the initial state if there are update values
            selectionModel={Object.keys(value)}
            onSelectionModelChange={(newSelection) => {
              if (newSelection) {
                const ticketIds = newSelection
                setShowAdjustCostColumn(ticketIds)
                let newTickets = {}
                for (let ticketId of ticketIds) {
                  if (ticketId in value) {
                    newTickets[ticketId] = value[ticketId]
                  } else {
                    newTickets[ticketId] = null
                  }
                }
                setFieldValue("tickets", newTickets)
              } else {
                setFieldValue("tickets", {})
              }
            }}
            rows={tickets.filter((column) => column.action)}
            // .map((column) => {
            //   return {
            //     id: column.id,
            //     number: column.number,
            //     subject: {
            //       id: column.id,
            //       title: column.subject,
            //       url: column.url + "?pid=" + projectId,
            //     },
            //     co_total: column.co_total,
            //     pco_number: column.pco_number,
            //     action: column.action.name,
            //     balanceTotal: {
            //       balance: column.balance,
            //       total: column.total,
            //     },
            //     adjust_cost: column.id,
            //   }
            // })}
          />
        </Grid>
      </Grid>
    </Container>
  )
}
