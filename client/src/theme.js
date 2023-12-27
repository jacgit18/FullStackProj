// import { createTheme } from "@mui/material/styles"
import { unstable_createMuiStrictModeTheme as createTheme } from "@mui/material"

const primaryColor = {
  dark: "#0e2347",
  light: "#435b84",
  main: "#143366",
}
const secondaryColor = {
  dark: "#006695", //"#2c89b2",
  light: "#33a7dd", //"#66cfff",
  main: "#0192D5", //"#40c4ff",
}
const highlightColor = {
  dark: "#a55c3c",
  light: "#f09c77",
  main: "#ed8456",
}

const theme = createTheme({
  drawerWidth: 240,
  palette: {
    primary: {
      ...primaryColor,
      contrastText: "#fff",
    },
    secondary: {
      ...secondaryColor,
      contrastText: "#fff",
    },
    highlight: {
      ...highlightColor,
      contrastText: "#000",
    },
    info: {
      contrastText: "#fff",
      main: "#0093D6",
    },
    // text: {
    //   disabled: "rgba(0, 0, 0, 0.38)",
    //   heading: "#373A3C",
    //   hint: "rgba(0, 0, 0, 0.38)",
    //   primary: "rgba(0, 0, 0, 0.87)",
    //   secondary: "rgba(0, 0, 0, 0.65)",
    // },
    // action: {
    //   root: secondaryColor.dark,
    //   active: secondaryColor.dark,
    //   focus: secondaryColor.light,
    //   hover: secondaryColor.main,
    // },
  },
  typography: {
    h1: {
      color: primaryColor.main,
      fontSize: "1.75rem",
      fontWeight: 500,
      margin: "16px 0px",
    },
    h2: {
      color: primaryColor.main,
      fontSize: "1.125rem",
      fontWeight: 700,
      margin: "16px 0px",
      textTransform: "uppercase",
    },
    h3: {
      color: primaryColor.main,
      fontSize: "1.125rem",
      fontWeight: 700,
      margin: "16px 0px",
    },
    h4: {
      color: primaryColor.main,
      fontSize: "0.875rem",
      textTransform: "uppercase",
      margin: "16px 0px",
    },
    h5: {
      color: primaryColor.main,
      fontSize: "0.875rem",
      margin: "8px 0px",
    },
    h6: {
      color: primaryColor.main,
      fontSize: "0.75.rem",
      fontWeight: 700,
      margin: "8px 0px",
      textTransform: "uppercase",
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "currentColor",
        },
      },
    },
  },
})

export default theme
