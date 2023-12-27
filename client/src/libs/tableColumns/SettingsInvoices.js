import IconButton from "@mui/material/IconButton"
import DownloadIcon from "@mui/icons-material/GetApp"

import DtRowTitle from "../../components/DtRowTitle"
import Link from "../../components/Link"

export default function SettingsInvoices(props = {}) {
  const { handleDownload } = props
  return [
    {
      align: "left",
      headerAlign: "left",
      field: "date",
      headerName: "Date",
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <Link to=".">
          <DtRowTitle>{params.value}</DtRowTitle>
        </Link>
      ),
    },
    {
      align: "right",
      headerAlign: "right",
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 150,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "plan",
      headerName: "Plan",
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: " ",
      headerName: " ",
      width: 50,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => {
            if (handleDownload) {
              handleDownload(params.index)
            }
          }}
        >
          <DownloadIcon />
        </IconButton>
      ),
    },
  ]
}
