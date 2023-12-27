import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"

import DtRowTitle from "../../components/DtRowTitle"

export default function SettingsUsers(props = {}) {
  const { handleEdit } = props
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
        params.editable ? (
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
        ) : (
          <></>
        ),
    },
    // { // TODO DEV-177
    //   align: "right",
    //   headerAlign: "right",
    //   field: " ",
    //   headerName: " ",
    //   width: 80,
    //   editable: false,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Link
    //       onClick={() => {
    //         if (handleDeactivate) {
    //           handleDeactivate(params.index)
    //         }
    //       }}
    //       to="."
    //     >
    //       Deactivate
    //     </Link>
    //   ),
    // },
  ]
}
