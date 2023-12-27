import FilterListIcon from "@mui/icons-material/FilterList"
import GetAppIcon from "@mui/icons-material/GetApp"
import { useTheme } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import makeStyles from "@mui/styles/makeStyles"
import PrintIcon from "@mui/icons-material/Print"
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha"
import Grid from "@mui/material/Grid"
import SearchIcon from "@mui/icons-material/Search"
import useMediaQuery from "@mui/material/useMediaQuery"

//Made a whole row for certain buttons as a component --Alfredo
//Includes search, filter, a-z, download and print buttons
//They are only mock buttons in the meantime and were only meant to replicate the design.

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
    backgroundColor: "white",
    borderRadius: 30,
    border: "1px solid",
    borderColor: "#c9c8c5",
    padding: 8,
  },
  icons: {
    color: "#2196f3",
  },
}))

export default function ButtonRow() {
  const classes = useStyles()
  const theme = useTheme()
  const small = useMediaQuery(theme.breakpoints.down("lg"))

  return (
    <Grid container direction="row" justifyContent="space-between" style={{ paddingBottom: 5 }}>
      <Grid container item xs={12} sm={3} justifyContent={small ? "center" : "flex-start"}>
        <IconButton variant="contained" className={classes.button} size="large">
          <SearchIcon className={classes.icons} />
        </IconButton>
        <IconButton variant="contained" className={classes.button} size="large">
          <FilterListIcon className={classes.icons} />
        </IconButton>
        <IconButton variant="contained" className={classes.button} size="large">
          <SortByAlphaIcon className={classes.icons} />
        </IconButton>
      </Grid>
      <Grid container item xs={12} sm={3} justifyContent={small ? "center" : "flex-end"}>
        <IconButton variant="contained" className={classes.button} size="large">
          <GetAppIcon className={classes.icons} />
        </IconButton>
        <IconButton variant="contained" className={classes.button} size="large">
          <PrintIcon className={classes.icons} />
        </IconButton>
      </Grid>
    </Grid>
  )
}
