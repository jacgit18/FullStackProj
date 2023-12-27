import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"

import DtRowTitle from "../../components/DtRowTitle"
import Link from "../../components/Link"

export default function SettingsInvites(props = {}) {
  const { handleResend, handleDelete } = props
  return [
    {
      align: "left",
      headerAlign: "left",
      field: "name", // variable id
      headerName: "Name", // name that will appear on colummn
      minWidth: 180,
      sortable: false,
      renderCell: (params) => <DtRowTitle>{params.value}</DtRowTitle>,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "type", // variable id
      headerName: "Type", // name that will appear on colummn
      width: 120,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "phone",
      headerName: "Phone",
      width: 130,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "invited",
      headerName: "Invited",
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      align: "right",
      headerAlign: "right",
      field: " ",
      headerName: " ",
      width: 80,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Link
          onClick={() => {
            if (handleResend) {
              handleResend(params.index)
            }
          }}
          to="."
        >
          Resend
        </Link>
      ),
    },
    {
      align: "right",
      headerAlign: "right",
      field: " ",
      headerName: " ",
      width: 50,
      editable: false,
      sortable: false,
      // renderCell: () => <Link to=".">Cancel</Link>,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => {
            if (handleDelete) {
              handleDelete(params.index)
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]
}
