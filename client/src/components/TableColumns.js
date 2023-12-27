import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import Link from "@mui/material/Link"
import OutlinedInput from "@mui/material/OutlinedInput"
import Typography from "@mui/material/Typography"
import DeleteIcon from "@mui/icons-material/Delete"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"

import Action from "./Action"
import PaidProgress from "./PaidProgress"
import WebViewLink from "./WebViewLink"

const DeleteButton = () => {
  return (
    <IconButton color="secondary" size="large">
      <DeleteIcon />
    </IconButton>
  )
}

const renderRateType = (key) => {
  switch (key) {
    case "ot":
      return "Overtime"
    case "dt":
      return "Double Time"
    case "pot":
      return "Premium Time"
    case "pdt":
      return "Premium Double Time"
    case "rt":
    default:
      return "Regular Time"
  }
}

const FormatRowId = ({ children }) => (
  <Typography color="primary" style={{ fontSize: 20, fontWeight: 700 }}>
    {children}
  </Typography>
)

const FormatTitle = ({ children }) => (
  <Typography
    className="subject"
    style={{
      fontWeight: 700,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: 200,
    }}
  >
    {children}
  </Typography>
)

export default function TableColumns() {
  const project = useSelector((state) => state.project)
  const { t } = useTranslation("private")

  // Form Columns
  const sumRatesFormLabor = [
    {
      align: "left",
      headerAlign: "left",
      field: "id",
      headerName: " ",
      width: 40,
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.value}</FormatRowId>,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "type",
      headerName: "Labor Type",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          {params.getValue(params.id, "type")}
          {/* ({params.getValue(params.id, "date")}) */}
        </Typography>
      ),
    },
    {
      align: "right",
      headerAlign: "right",
      field: "rate_type",
      headerName: "Rate Type",
      width: 120,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{renderRateType(params.value)}</Typography>,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "hours",
      headerName: "Hours",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "rate",
      headerName: "Rate / Hr.",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>${params.value}</Typography>,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "quantity",
      headerName: "Headcount",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const sumRatesFormMaterial = [
    {
      align: "left",
      headerAlign: "left",
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "type",
      headerName: "Material Type",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "unit",
      headerName: "Unit",
      width: 150,
      editable: false,
      sortable: false,
    },

    {
      align: "right",
      headerAlign: "right",
      field: "rate",
      headerName: "Rate / unit",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>${params.value}</Typography>,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const sumRatesFormEquipment = [
    {
      align: "left",
      headerAlign: "left",
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "type",
      headerName: "Equipment Type",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "unit",
      headerName: "Unit",
      width: 150,
      editable: false,
      sortable: false,
    },

    {
      align: "right",
      headerAlign: "right",
      field: "rate",
      headerName: "Rate / unit",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>${params.value}</Typography>,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const sumTotalFormLabor = [
    {
      align: "left",
      headerAlign: "left",
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "type",
      headerName: "Labor Type",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          {params.getValue(params.id, "type")}
          {/* ({params.getValue(params.id, "date")}) */}
        </Typography>
      ),
    },
    {
      align: "right",
      headerAlign: "right",
      field: "rate_type",
      headerName: "Rate Type",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{renderRateType(params.value)}</Typography>,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "hours",
      headerName: "Hours",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "quantity",
      headerName: "Headcount",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const sumTotalFormMaterial = [
    {
      align: "left",
      headerAlign: "left",
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "type",
      headerName: "Material Type",
      flex: 1,
      minWidth: 300,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "unit",
      headerName: "Unit",
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const sumTotalFormEquipment = [
    {
      align: "left",
      headerAlign: "left",
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "type",
      headerName: "Equipment Type",
      flex: 1,
      minWidth: 300,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "unit",
      headerName: "Unit",
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const ticketsForm = [
    {
      align: "left",
      headerAlign: "left",
      field: "id",
      headerName: "#",
      width: 70,
    },
    {
      align: "left",
      headerAlign: "left",
      field: "subject",
      headerName: t("view.Tickets.subject"),
      width: 200,
      editable: false,
      // renderCell: (params) => <Typography color="secondary">{params.value.title}</Typography>,
      renderCell: (params) => (
        <FormatTitle>
          <Link to={`/0/project/${project.id}/ticket/${params.value.id}`}>
            {params.value.title}
          </Link>
        </FormatTitle>
      ),
    },
    {
      align: "center",
      headerAlign: "center",
      field: "pco_number",
      headerName: t("view.Tickets.pco"),
      width: 160,
      editable: false,
    },
    // {
    //   field: "invoice_number",
    //   headerName: t("view.Tickets.inv"),
    //   width: 115,
    //   editable: false,
    //   hide: true,
    // },
    {
      align: "center",
      headerAlign: "center",
      field: "action",
      headerName: t("view.Tickets.action"),
      width: 200,
      editable: false,
      hide: true,
      renderCell: (params) => <Action id={params.value.id} name={params.value.name || "Draft"} />,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "inbox", //Full Name
      headerName: t("view.Tickets.inbox"),
      width: 122,
      editable: false,
      hide: true,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "work", //Dates
      headerName: t("view.Tickets.work"),
      width: 122,
      editable: false,
      hide: true,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "created", //Dates
      headerName: t("view.Tickets.created"),
      width: 143,
      editable: false,
      hide: true,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "paid", //How much amount paid, need bar filling up and a small circle icon
      headerName: (
        <div>
          <FiberManualRecordIcon color={"secondary"} viewBox={"-5 -7.3 35 20"} />
          {t("view.Tickets.paid")}
        </div>
      ),
      hide: true,
      filterable: false,
      renderCell: (params) => (
        <>
          {/*TODO THIS IS BROKEN*/}
          {/*<PaidProgress balance={params.value.balance} total={params.value.total} />*/}
          <Typography>${params.value.total - params.value.balance}</Typography>
        </>
      ),
      width: 133,
      editable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "balanceTotal",
      headerName: t("view.Tickets.balance"),
      width: 190,
      editable: false,

      renderCell: (params) => {
        // const ticket = params.row
        // const output = values[ticket.id]
        //   ? values[ticket.id]
        //   : ticket.co_total
        //   ? ticket.co_total
        //   : ticket.balanceTotal.total
        return (
          <>
            <Typography color="secondary" className="text">
              ${params.value.balance}
            </Typography>
            {/* <Typography align="left">{`$${output}`}</Typography> */}
            <Typography align="left">${params.value.total}</Typography>
          </>
        )
      },
    },
    {
      align: "center",
      headerAlign: "center",
      field: "adjust_cost",
      width: 180,
      headerName: t("view.Tickets.adjust_cost"),
      editable: false,
      renderCell: (params) => {
        const ticket = params.row
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              type="number"
              name={ticket.id}
              // value={values[ticket.id]}
              // onChange={handleChange}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              labelWidth={60}
            />
          </FormControl>
        )
      },
    },
    {
      field: "company",
      width: 190,
      headerName: t("view.Tickets.company"),
      editable: false,
      hide: true,
    },
    {
      field: "client",
      width: 190,
      headerName: t("view.Tickets.client"),
      editable: false,
      hide: true,
    },
    {
      field: "crewSize",
      headerName: t("view.Tickets.crew_size"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "totalHours",
      headerName: t("view.Tickets.total_hours"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "laborSubtotal",
      headerName: t("view.Tickets.labor_subtotal"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "labormarkup",
      headerName: t("view.Tickets.labor_markup"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "laborTotal",
      headerName: t("view.Tickets.labor_total"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "materialSubtotal",
      headerName: t("view.Tickets.material_subtotal"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "materialMarkup",
      headerName: t("view.Tickets.material_markup"),
      width: 200,
      editable: false,
      hide: true,
    },

    {
      field: "materialTotal",
      headerName: t("view.Tickets.material_total"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "equipmentSubotal",
      headerName: t("view.Tickets.equipment_subtotal"),
      width: 200,
      editable: false,
      hide: true,
    },
    {
      field: "equipmentMarkup",
      headerName: t("view.Tickets.equipment_markup"),
      width: 235,
      editable: false,
      hide: true,
    },
    {
      field: "equipmentTotal",
      headerName: t("view.Tickets.equipment_total"),
      width: 235,
      editable: false,
      hide: true,
    },
    {
      field: "description",
      headerName: t("view.Tickets.desc"),
      width: 200,
      editable: false,
      hide: true,
    },
  ]

  // Invoice Columns
  const sumRatesInvoiceLabor = [
    {
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.value}</FormatRowId>,
    },
    {
      field: "labortype",
      headerName: "Labor Type",
      width: 200,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          {params.getValue(params.id, "type")}
          {/* ({params.getValue(params.id, "date")}) */}
        </Typography>
      ),
    },
    {
      align: "right",
      field: "cost_code",
      headerName: "Cost Code",
      headerAlign: "right",
      flex: 1,
      minWidth: 130,
      editable: false,
      sortable: false,
    },

    {
      align: "right",
      field: "rate_type",
      headerName: "Rate Type",
      width: 140,
      headerAlign: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{renderRateType(params.value)}</Typography>,
    },
    {
      align: "right",
      field: "crew_size",
      headerAlign: "right",
      headerName: "Crew Size",
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <Typography>
          {params.getValue(params.id, "quantity")} x {params.getValue(params.id, "hours")} hours
        </Typography>
      ),
    },
    {
      align: "right",
      field: "rate",
      headerAlign: "right",
      headerName: "Rate / Hr.",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{`$${params.value}`}</Typography>,
    },
    {
      align: "right",
      field: "hours_total",
      headerAlign: "right",
      headerName: "Time",
      width: 100,
      editable: false,
      sortable: false,

      renderCell: (params) => (
        <Typography>
          {parseFloat(params.getValue(params.id, "quantity") * params.getValue(params.id, "hours"))}
        </Typography>
      ),
    },
    {
      align: "right",
      field: "total",
      headerName: "Total",
      headerAlign: "right",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          $
          {parseFloat(
            params.getValue(params.id, "quantity") *
              params.getValue(params.id, "hours") *
              params.getValue(params.id, "rate")
          )}
        </Typography>
      ),
    },
  ]
  const sumRatesInvoiceMaterial = [
    {
      field: "id",
      headerName: " ",
      width: 40,
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.value}</FormatRowId>,
    },
    {
      field: "type",
      headerName: "Material Type",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "cost_code",
      headerName: "Cost Code",
      headerAlign: "right",
      width: 180,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "quantity",
      headerName: "QTY",
      flex: 1,
      minWidth: 300,
      headerAlign: "right",
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "unit",
      headerName: "Unit",
      width: 120,
      headerAlign: "right",
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "rate",
      headerName: "Rate / Item",
      width: 120,
      headerAlign: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{`$${params.value}`}</Typography>,
    },
    {
      align: "right",
      field: "total",
      headerName: "Total",
      width: 150,
      headerAlign: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          $
          {parseFloat(
            params.getValue(params.id, "rate") * params.getValue(params.id, "quantity")
          ).toFixed(2)}
        </Typography>
      ),
    },
  ]
  const sumRatesInvoiceEquipment = [
    {
      field: "id",
      headerName: " ",
      width: 40,
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.value}</FormatRowId>,
    },
    {
      field: "type",
      headerName: "Equipment Type",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "cost_code",
      headerName: "Cost Code",
      headerAlign: "right",
      width: 180,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "quantity",
      headerName: "QTY",
      flex: 1,
      minWidth: 300,
      headerAlign: "right",
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "unit",
      headerName: "Unit",
      width: 120,
      headerAlign: "right",
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "rate",
      headerName: "Rate / Item",
      width: 120,
      headerAlign: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{`$${params.value}`}</Typography>,
    },
    {
      align: "right",
      field: "total",
      headerName: "Total",
      width: 150,
      headerAlign: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          ${parseFloat(params.getValue(params.id, "rate") * params.getValue(params.id, "quantity"))}
        </Typography>
      ),
    },
  ]
  const sumTotalInvoiceLabor = [
    {
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      field: "type",
      headerName: "Labor Type",
      flex: 2,
      minWidth: 200,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          {params.getValue(params.id, "type")}
          {/* ({params.getValue(params.id, "date")}) */}
        </Typography>
      ),
    },
    {
      field: "rate_type",
      headerName: "Rate Type",
      width: 200,
      headerAlign: "center",
      align: "center",
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>{renderRateType(params.value)}</Typography>,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 200,
      editable: false,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity",
      headerName: "Headcount",
      width: 200,
      editable: false,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
  ]
  const sumTotalInvoiceMaterial = [
    {
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      field: "type",
      headerName: "Material Type",
      flex: 4,
      minWidth: 300,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "unit",
      headerName: "Unit",
      width: 320,
      editable: false,
      sortable: false,
      headerAlign: "right",
    },

    {
      field: "quantity",
      headerName: "Quantity",
      flex: 2,
      minWidth: 250,
      editable: false,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
  ]
  const sumTotalInvoiceEquipment = [
    {
      field: "id", // variable id
      headerName: " ", // name that will appear on colummn
      width: 40, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      field: "type",
      headerName: "Equipment Type",
      flex: 4,
      minWidth: 300,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "unit",
      headerName: "Unit",
      width: 320,
      editable: false,
      sortable: false,
      headerAlign: "right",
    },

    {
      field: "quantity",
      headerName: "Quantity",
      flex: 2,
      width: 250,
      editable: false,
      sortable: false,
      headerAlign: "right",
      align: "right",
    },
  ]
  const ticketsInvoice = [
    {
      field: "id", // variable id
      headerName: "#", // name that will appear on colummn
      width: 60, //manual
      sortable: false,
      renderCell: (params) => <FormatRowId>{params.id}</FormatRowId>,
    },
    {
      field: "subject",
      headerName: "Ticket Subject",
      flex: 1,
      minWidth: 250,
      editable: false,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <FormatTitle>
          <WebViewLink
            to={`/0/project/${project.id}${params.getValue(params.id, "url")}?pid=${project.id}`}
            viewUrl={`${params.getValue(params.id, "url")}?pid=${project.id}`}
          >
            {params.value}
          </WebViewLink>
        </FormatTitle>
      ),
    },
    {
      align: "center",
      field: "date_start",
      headerAlign: "center",
      headerName: "Work Date",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "center",
      field: "date_created",
      headerAlign: "center",
      headerName: "Submitted",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      field: "total",
      headerAlign: "right",
      headerName: "Total",
      width: 200,
      editable: false,
      sortable: false,
      renderCell: (params) => <Typography>${params.value}</Typography>,
    },
  ]

  const markup = [
    // {
    //   field: "id", // variable id
    //   headerName: "#", // name that will appear on colummn
    //   width: 40, //manual
    //   sortable: false,
    //   renderCell: (
    //     params // data that is rendered on each cell
    //   ) => (
    //     <div style={{ width: "100%" }}>
    //       <Typography
    //         color="primary"
    //         style={{ fontSize: "20px", textAlign: "right", fontWeight: 700 }}
    //       >
    //         {params.id /* This is where and how you call the data */}
    //       </Typography>
    //     </div>
    //   ),
    // },
    {
      align: "left",
      headerAlign: "left",
      field: "title",
      headerName: "Title",
      flex: 2,
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "amount",
      headerName: "Amount",
      flex: 2,
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "",
      headerName: "",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => <DeleteButton />,
    },
  ]
  const markupCo = [
    // {
    //   field: "id", // variable id
    //   headerName: "#", // name that will appear on colummn
    //   width: 40, //manual
    //   sortable: false,
    //   renderCell: (
    //     params // data that is rendered on each cell
    //   ) => (
    //     <div style={{ width: "100%" }}>
    //       <Typography
    //         color="primary"
    //         style={{ fontSize: "20px", textAlign: "right", fontWeight: 700 }}
    //       >
    //         {params.id /* This is where and how you call the data */}
    //       </Typography>
    //     </div>
    //   ),
    // },
    {
      align: "left",
      headerAlign: "left",
      field: "title",
      headerName: "Title",
      flex: 2,
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "amount",
      headerName: "Amount",
      flex: 2,
      width: 250,
      editable: false,
      sortable: false,
    },
  ]

  return {
    sumRatesFormLabor,
    sumRatesFormMaterial,
    sumRatesFormEquipment,
    sumTotalFormLabor,
    sumTotalFormMaterial,
    sumTotalFormEquipment,
    ticketsForm,
    sumRatesInvoiceLabor,
    sumRatesInvoiceMaterial,
    sumRatesInvoiceEquipment,
    sumTotalInvoiceLabor,
    sumTotalInvoiceMaterial,
    sumTotalInvoiceEquipment,
    ticketsInvoice,
    markup,
    markupCo,
  }
}
