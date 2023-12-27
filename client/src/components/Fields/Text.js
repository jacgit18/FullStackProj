import React from "react"
// import makeStyles from "@mui/styles/makeStyles"
import MuiTextField from "@mui/material/TextField"

// const useStyles = makeStyles((theme) => ({
//   root: {
//     background: theme.palette.background.paper,
//     "& .MuiOutlinedInput-input": {
//       background: theme.palette.background.paper,
//     },
//   },
// }))

export default function Text(props) {
  // const classes = useStyles()
  // return <MuiTextField className={classes.root} variant="outlined" fullWidth {...props} />
  return <MuiTextField variant="outlined" fullWidth {...props} />

}
