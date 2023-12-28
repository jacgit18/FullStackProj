import React from "react"
import { decode } from "html-entities"
import parse from "html-react-parser"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useTheme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import InvoiceBreakdowns from "./Breakdowns"
import InvoiceMarkup from "./Markup"
import InvoiceTickets from "./Tickets"
import DetailsTable from "../DetailsTable"
import FilesRow from "../FilesRow"
import Logo from "../Logo"
import { formatDate, formatMoney } from "../../libs/format"
import Signatures from "./Signatures"

const useStyles = makeStyles((theme) => ({
  description: {
    borderLeft: "2px solid #CCCCCC",
    opacity: 1,
    paddingLeft: 10,
  },

  descriptionTitles: { color: "#757575", fontSize: "12px" },
  root: {
    margin: "auto",
    maxWidth: 1080,
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(6),
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    "@media print": {
      maxWidth: 9999,
      padding: 0,
    },
    totals: {
      paddingTop: 20,
    },
  },
}))

export default function Invoice({ data, elevation, historyItems }) {
  const { t } = useTranslation("private")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const classes = useStyles()
  const project = useSelector((state) => state.project)

  const summary = [
    {
      title: "Client/PCO#",
      content: data.pco_number ? `#${data.pco_number}` : null,
    },
    {
      title: "Subject",
      content: data.subject ? decode(data.subject) : null,
    },
    {
      title: "Total",
      content: data.includes_costs ? formatMoney(data.total_amount) : null,
    },
    {
      title: "Project Number",
      content: project.number ? `#${project.number}` : null,
    },
    {
      title: "Project",
      content: project.name ? decode(project.name) : null,
    },
    {
      title: "Work Date",
      content: data.date_start || data.date_end ? formatDate(data.date_start, data.date_end) : null,
    },
    {
      title: "Created",
      content: data.date_created ? formatDate(data.date_created) : null,
    },
    {
      title: "Submitted By",
      content: data.author ?? null,
    },
    {
      title: "Invoice Number",
      content: data.invoice_number ?? null,
    },
  ]

  return (
    <Paper className={classes.root} elevation={elevation ?? 2}>
      <Grid container spacing={3}>
        <Grid
          container
          item
          xs={isMobile ? 12 : 8}
          md={8}
          justifyContent={isMobile ? "center" : "flex-start"}
        >
          <Typography
            variant="h1"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontWeight: 900,
            }}
          >
            #{data.number}
          </Typography>
        </Grid>
        <Grid
          item
          xs={isMobile ? 12 : 4}
          md={4}
          container
          justifyContent={isMobile ? "center" : "flex-end"}
        >
          {!isMobile ? <Grid style={{ width: 100 }}></Grid> : ""}
          <Grid
            item
            container
            justifyContent={isMobile ? "center" : "flex-start"}
            style={{ width: isMobile ? "100%" : "calc(100% - 100px)" }}
          >
            <Logo />
          </Grid>
        </Grid>
        <Grid container item xs={isMobile ? 12 : 8}>
          <DetailsTable details={summary} />
          {data.scope ? (
            <DetailsTable
              detail={{
                title: "Scope of Work",
                content: parse(decode(data.scope)),
              }}
            />
          ) : data.description ? (
            <DetailsTable
              detail={{
                title: "Work Description",
                content: parse(decode(data.description)),
              }}
            />
          ) : (
            <></>
          )}
          {data.exclusion ? (
            <DetailsTable
              detail={{
                title: "Exclusion",
                content: parse(decode(data.exclusion)),
              }}
            />
          ) : (
            <></>
          )}
        </Grid>
        {/*<Grid container item xs={isMobile ? 12 : 4}>*/}
        {/*  <DetailsTable*/}
        {/*    detail={{*/}
        {/*      title: t("view.ChangeOrder.Summary.from"),*/}
        {/*      content: {*/}
        {/*        address: companyData.address,*/}
        {/*        name: companyData.name,*/}
        {/*        phone: companyData.phone,*/}
        {/*      },*/}
        {/*    }}*/}
        {/*    formatter={(content) => (*/}
        {/*      <>*/}
        {/*        <Typography stlye={{ fontWeight: 900 }}>{content.name}</Typography>*/}
        {/*        {content.address ? <Typography>{parse(`${content.address}`)}</Typography> : ""}*/}
        {/*        {content.phone ? <Typography>{content.phone}</Typography> : ""}*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*  <DetailsTable*/}
        {/*    detail={{*/}
        {/*      title: t("view.ChangeOrder.Summary.to"),*/}
        {/*      content: {*/}
        {/*        address: clientData.address,*/}
        {/*        name: clientData.name,*/}
        {/*      },*/}
        {/*    }}*/}
        {/*    formatter={(content) => (*/}
        {/*      <>*/}
        {/*        <Typography stlye={{ fontWeight: 900 }}>{content.name}</Typography>*/}
        {/*        {content.address ? <Typography>{parse(content.address)}</Typography> : ""}*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*  {data.notes ? (*/}
        {/*    <DetailsTable*/}
        {/*      detail={{*/}
        {/*        title: t("view.ChangeOrder.Summary.notes"),*/}
        {/*        content: parse(decode(data.notes)),*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  ) : (*/}
        {/*    <></>*/}
        {/*  )}*/}
        {/*</Grid>*/}
        {data.files && data.files.length ? (
          <Grid container item xs={12}>
            <Typography variant="h2">Attachments</Typography>
            <FilesRow files={data.files} />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {data.type === "tickets" && data.tickets && data.tickets.length ? (
        <InvoiceTickets tickets={data.tickets} data={data} />
      ) : (
        <InvoiceBreakdowns data={data} />
      )}

      {data.type !== "tm" ? (
        <>
          {data.markup ? (
            <>
              <Grid item container xs={12} justifyContent="flex-end">
                <Typography
                  variant="body2"
                  style={{ fontWeight: 800, fontSize: 15, paddingBottom: 30, paddingTop: 20 }}
                >
                  Subtotal: {formatMoney(data.subtotal)}
                </Typography>
              </Grid>

              <InvoiceMarkup name={"Total Markup"} rows={data.markup} total={data.subtotal} />
            </>
          ) : (
            <></>
          )}

          <Grid item container xs={12} justifyContent="flex-end" style={{ paddingTop: 10 }}>
            <Typography variant="body2">
              {t("view.TicketBreakdowns.Subtotal")}: {formatMoney(data.balance)}
            </Typography>
          </Grid>
          <Grid item container xs={12} justifyContent="flex-end">
            <Typography variant="body2">
              {t("view.TicketBreakdowns.payments")}: {formatMoney(data.paid)}
            </Typography>
          </Grid>
          <Grid item container xs={12} justifyContent="flex-end">
            <Typography variant="body2" style={{ fontWeight: 800, fontSize: 20, paddingTop: 10 }}>
              {data.co_total
                ? `Change Order Adjusted Total: ${formatMoney(data.co_total)}`
                : `Total: ${formatMoney(data.total)}`}
            </Typography>
          </Grid>
          <Signatures data={data} historyItems={historyItems} />
        </>
      ) : (
        <></>
      )}
    </Paper>
  )
}
