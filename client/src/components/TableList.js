import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import {
  DataGrid,
  useGridSlotComponentProps,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import Pagination from "@mui/material/Pagination"

const useStyles = makeStyles((theme) => ({
  root: {
    // "& .text": {
    //   //Text for the Balance
    //   fontSize: 15,
    //   fontWeight: 700,
    //   overflow: "hidden",
    //   textOverflow: "ellipsis",
    // },
    "& .subject": {
      fontWeight: 900,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: 200,
    },
    // "& .regular": {
    //   //Text for the Balance
    //   fontSize: 15,
    // },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .Mui-even": {
      backgroundColor: theme.palette.grey[50],
    },
    "& .MuiDataGrid-row:hover": {
      background: theme.palette.grey[200],
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none !important",
    },
    "& .MuiDataGrid-footerContainer": {
      justifyContent: "center",
    },
    // "& #text": {
    //   textIndent: "9999px",
    //   width: "100%",
    //   display: "block",
    //   overflow: "hidden",
    // },
  },
}))

const CustomToolbar = () => {
  return (
    <GridToolbarContainer style={{ paddingTop: 10, paddingBottom: 10 }}>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  )
}

const CustomPagination = () => {
  const { state, apiRef } = useGridSlotComponentProps()

  return state.pagination.pageCount > 1 ? (
    <Pagination
      count={state.pagination.pageCount}
      size="large"
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  ) : (
    ""
  )
}

export default function TableList({ columns, rows, pageSize, ...props }) {
  const classes = useStyles()

  return (
    <Paper>
      <DataGrid
        autoHeight
        checkboxSelection
        className={classes.root}
        columns={columns}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No rows in DataGrid
            </Stack>
          ),
          NoResultsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              Local filter returns no result
            </Stack>
          ),
          Pagination: CustomPagination,
          Toolbar: CustomToolbar,
        }}
        // disableSelectionOnClick
        // disableColumnMenu
        editMode="row"
        headerHeight={32}
        // isCellEditable={false}
        // isRowSelectable={false}
        pageSize={pageSize || 20}
        rowHeight={56}
        rows={rows}
        {...props}
      />
    </Paper>
  )
}
