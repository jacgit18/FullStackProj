import React from "react"
import { useTheme } from "@mui/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import SearchIcon from "@mui/icons-material/Search"

import PagedTable from "./PagedTable"
import Button from "./Button"
import DetailsTable from "./DetailsTable"
import FormSmallContainer from "./FormSmallContainer"
import TextField from "./Fields/Text"

export default function AccordionRow({ expanded, handleChange, index, item, ...options }) {
  const [rows, setRows] = React.useState(item.rows)
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleClearSearch = () => {
    setSearchValue("")
  }

  const handleSearch = (event) => {
    setSearchValue(event.target.value)
  }

  React.useEffect(() => {
    setRows(
      item.rows.filter((row) =>
        searchValue && searchValue.length > 1
          ? Object.keys(row).some((column) =>
              row[column]?.toString()?.toLowerCase()?.includes(searchValue.toLowerCase())
            )
          : true
      )
    )
  }, [item.rows, searchValue])

  React.useEffect(() => {
    setRows(item.rows)
  }, [item])

  return (
    <Accordion
      expanded={expanded === index}
      onChange={handleChange(index)}
      sx={{ mb: 2, mt: 2 }}
      {...options}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${index}-content`}
        id={`panel${index}-header`}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={5}>
            <Typography variant="h2" sx={{ m: 0 }}>
              {item.title}
            </Typography>
          </Grid>
          {item.rows.length ? (
            expanded === index ? (
              <Grid item xs={12} md={3}>
                <Box>
                  <TextField
                    sx={{ maxWidth: 250 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="secondary"
                            sx={{
                              visibility: searchValue ? "visible" : "hidden",
                            }}
                            onClick={handleClearSearch}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                    onClick={(event) => event.stopPropagation()}
                    onChange={handleSearch}
                    value={searchValue}
                  />
                </Box>
              </Grid>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}

          {expanded === index ? (
            <Grid
              container
              justifyContent={isMobile ? "flex-start" : "flex-end"}
              item
              xs={12}
              md={item.rows.length ? 4 : 7}
            >
              <Box>
                {item.headerRight || <></>}
                {item.addForm ? (
                  <Button
                    color="secondary"
                    startIcon={<AddIcon />}
                    variant="text"
                    onClick={(event) => {
                      event.stopPropagation()
                      setShowAddForm(!showAddForm)
                    }}
                  >
                    {item.addForm.openButtonText || "Add"}
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails id={`panel${index}-content`}>
        {item.details ? (
          <>
            <DetailsTable details={item.details} />
          </>
        ) : (
          <></>
        )}
        <PagedTable columns={item.columns} rows={rows} />
        {item.addForm ? (
          <Collapse in={showAddForm} timeout="auto" unmountOnExit>
            <FormSmallContainer pt={1}>
              <Typography variant="h2">{item.addForm.title}</Typography>
              <item.addForm.form onCancel={setShowAddForm} props={item.addForm.props || {}} />
            </FormSmallContainer>
          </Collapse>
        ) : (
          <></>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
