import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import {
  DataGrid,
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid"
import Pagination from "@mui/material/Pagination"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& .subject": {
      fontWeight: 900,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: 200,
    },
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
  },
}))

const EmptyContent = ({ children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    p={2}
    position="absolute"
    left={0}
    right={0}
    top={0}
    bottom={0}
  >
    {children}
  </Box>
)

const CustomToolbar = () => {
  return (
    <GridToolbarContainer style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Grid container>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
      </Grid>
    </GridToolbarContainer>
  )
}

const CustomPagination = () => {
  // const { state, apiRef } = useGridSlotComponentProps()
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)

  return pageCount > 1 ? (
    <Pagination
      count={pageCount}
      size="large"
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  ) : (
    ""
  )
}

export default function DataTable({
  columns,
  noRowsContent,
  noResultsContent,
  pageSize,
  rows,
  rowsSelected,
  setRowsSelected,
  showCheckboxes,
  ...props
}) {
  const classes = useStyles()

  return (
    <Paper>
      <DataGrid
        autoHeight
        checkboxSelection={showCheckboxes ?? true}
        className={classes.root}
        columns={columns}
        components={{
          NoRowsOverlay: () => (
            <EmptyContent>
              <Typography variant="h3">{noRowsContent || "No items to show"}</Typography>
            </EmptyContent>
          ),
          NoResultsOverlay: () => (
            <EmptyContent>
              <Typography variant="h3">{noResultsContent || "No items to show"}</Typography>
            </EmptyContent>
          ),
          Pagination: CustomPagination,
          Toolbar: CustomToolbar,
        }}
        disableSelectionOnClick
        editMode="row"
        headerHeight={32}
        // isCellEditable={false}
        // isRowSelectable={false}
        pageSize={pageSize || 20}
        rowHeight={56}
        rows={Array.isArray(rows) ? rows.filter((column) => column && column.id) : []}
        onSelectionModelChange={(ids) => {
          if (rowsSelected) {
            const selectedIDs = new Set(ids)
            setRowsSelected(rows.filter((row) => selectedIDs.has(row.id.toString())))
          }
        }}
        {...props}
      />
    </Paper>
  )
}
