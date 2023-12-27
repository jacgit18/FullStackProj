import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"

import DtRowTitle from "../../components/DtRowTitle"

export default function ProjectUsers(props = {}) {
  const { handleDelete } = props
  return [
    {
      align: "left",
      headerAlign: "left",
      field: "name", // variable id
      headerName: "Name", // name that will appear on colummn
      minWidth: 180, //manual
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
      field: "phone",
      headerName: "Phone",
      width: 130,
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
      renderCell: (params) =>
        params.deletable ? (
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
        ) : (
          <></>
        ),
    },
  ]
}
