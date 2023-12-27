import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import { formatMoney } from "../libs/format"

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

export default function BreakdownTable({ columns, editable, rows, totals }) {
  const classes = useStyles()
  const [idRows, setIdRows] = React.useState([])

  React.useEffect(() => {
    if (rows && rows.length) {
      const newRows = rows.map((row, index) => {
        return { ...row, index: index + 1 }
      })
      setIdRows(newRows)
    }
  }, [rows])

  return rows && rows.length ? (
    <TableContainer className={classes.container}>
      <Table size="small" className={classes.table}>
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
          {idRows.map((row, index) => (
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
          ))}
          {totals && Object.keys(totals).length ? (
            <TableRow key="totalRow">
              <TableCell
                align="right"
                colSpan={
                  columns.filter((column) => !column.hide).length -
                  Object.keys(totals).length -
                  (totals.hours && totals.total ? 2 : 0) -
                  (totals.hours && !totals.total ? 1 : 0) -
                  (editable ? 1 : 0)
                }
                key="subtotal"
                style={{ border: "none", fontWeight: 700 }}
              >
                Subtotal:
              </TableCell>
              {Object.keys(totals).map((key, index) => (
                <TableCell
                  align="right"
                  colSpan={totals.hours && ["hours", "total"].includes(key) ? 2 : 1}
                  key={index}
                  style={{ background: "#f1f1f1", border: "none", fontWeight: 700 }}
                >
                  {key === "total" ? formatMoney(totals[key]) : totals[key]}
                </TableCell>
              ))}
            </TableRow>
          ) : (
            ""
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    ""
  )
}
