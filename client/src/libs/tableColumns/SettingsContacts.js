import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import DtRowTitle from "../../components/DtRowTitle"

export default function SettingsContacts(props = {}) {
  const { handleEdit, handleDelete } = props
  return [
    {
      align: "left",
      headerAlign: "left",
      field: "contact",
      headerName: "Contact",
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
      renderCell: (params) => params.email,
    },
    {
      align: "right",
      headerAlign: "right",
      field: "phone",
      headerName: "Phone",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: (params) => params.value,
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
            if (handleEdit) {
              handleEdit(params.index)
            }
          }}
        >
          <EditIcon />
        </IconButton>
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
