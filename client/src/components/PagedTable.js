import React from "react"
import PropTypes from "prop-types"
import makeStyles from "@mui/styles/makeStyles"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableFooter from "@mui/material/TableFooter"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "block",
    marginBottom: theme.spacing(1),
    maxWidth: "100%",
    overflowX: "auto",
    width: "100%",
  },
  table: {
    border: "none",
    "& .MuiTableCell-head": {
      color: theme.palette.grey[600],
      fontSize: 12,
      paddingLeft: 5,
      paddingRight: 5,
      "&:first-child": {
        lineHeight: 1,
        paddingBottom: 0,
        paddingTop: 0,
      },
      "&:last-child": {
        lineHeight: 1,
        paddingBottom: 0,
        paddingTop: 0,
      },
    },
    "& .MuiTableCell-body": {
      paddingLeft: 5,
      paddingRight: 5,
      "&:first-child": {},
      "&:last-child": {},
    },
  },
}))

const getColumnStyles = (column) => {
  let styles = column.styles ? column.styles : {}
  if (column.width) {
    styles.maxWidth = column.width
    styles.minWidth = column.width
    styles.width = column.width
  }
  if (column.maxWidth) {
    styles.maxWidth = column.maxWidth
  }
  if (column.minWidth) {
    styles.minWidth = column.minWidth
  }
  return styles
}

function TablePaginationActions({ count, onPageChange, page, rowsPerPage }) {
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, mr: 0.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

function TablePaginationNoActions({ count, onPageChange, page, rowsPerPage }) {
  return <Box sx={{ mr: 2 }}></Box>
}

TablePaginationNoActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

export default function BreakdownTable({ columns, rows }) {
  const classes = useStyles()
  const [idRows, setIdRows] = React.useState([])
  const [page, setPage] = React.useState(0)
  const showPagination = rows.length > 30
  const [rowsPerPage, setRowsPerPage] = React.useState(25)

  React.useEffect(() => {
    // Add indexes to use as row identifiers to each row
    if (rows && rows.length) {
      const newRows = rows.map((row, index) => {
        return { ...row, index: index + 1 }
      })
      setIdRows(newRows)
    }
  }, [rows])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <TableContainer className={classes.container}>
      <Table size="small" stickyHeader className={classes.table}>
        <TableHead>
          <TableRow>
            {columns
              .filter((column) => !column.hide)
              .map((column, index) => (
                <TableCell
                  align={column.headerAlign ? column.headerAlign : null}
                  key={index}
                  style={getColumnStyles(column)}
                >
                  {column.headerName ? column.headerName : ""}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {idRows.length > 0 ? (
            (showPagination
              ? idRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : idRows
            ).map((row, index) => (
              <TableRow key={index}>
                {columns
                  .filter((column) => !column.hide)
                  .map((column, index) => {
                    const value = column.field && row[column.field] ? row[column.field] : null
                    const params = {
                      ...row,
                      value,
                      getValue: (id, key) => {
                        const valueRow = rows.find((findRow) => findRow.id === id)
                        return valueRow && valueRow[key] ? valueRow[key] : null
                      },
                    }
                    return (
                      <TableCell
                        align={column.align ? column.align : null}
                        key={index}
                        style={getColumnStyles(column)}
                      >
                        {column.renderCell ? column.renderCell(params) : value}
                      </TableCell>
                    )
                  })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center" }}>
                <Typography variant="h3">
                  {rows.length ? "No items match your search" : "No items to show"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={columns.length} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            {showPagination ? (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100, { label: "All", value: -1 }]}
                colSpan={columns.length}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                sx={{ border: "none" }}
              />
            ) : (
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={columns.length}
                count={rows.length}
                rowsPerPage={rows.length}
                page={0}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationNoActions}
                sx={{ border: "none" }}
              />
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

BreakdownTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
}
