import { Grid, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
// import makeStyles from "@mui/styles/makeStyles"
import React from "react"
import { useTranslation } from "react-i18next"
import landingImage from "../../assets/landing-illustration.svg"

// const useStyles = makeStyles((theme) => ({
//   img: {
//     paddingTop: 80,
//     width: theme.spacing(35),
//   },
//   message: {
//     paddingBottom: 40,
//   },
//   content: {
//     fontWeight: 900,
//     paddingBottom: 30,
//     paddingLeft: 80,
//   },
//   subTitle: {
//     color: "grey",
//     fontWeight: "700",
//   },
//   title: {
//     color: theme.palette.primary.main,
//     marginTop: "30px",
//     fontWeight: "500",
//     fontSize: "36px",
//   },
// }))

export default function NewPasswordContent() {
  const { t } = useTranslation("public")
  // const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const centerIfMobile = isMobile ? "center" : "flex-start"
  const centerTextMobile = isMobile ? "center" : "left"

  return (
    // <Grid container>
    //   <Grid item xs={12} container justifyContent={centerIfMobile} className={classes.message}>
    //     <Typography className={classes.title} align={centerTextMobile}>
    //       {t("view.newPassword.title")}
    //     </Typography>
    //   </Grid>

    //   <Grid item xs={12} container className={classes.content} justifyContent={centerIfMobile}>
    //     <Typography align={centerTextMobile} variant="body2">
    //       {t("view.newPassword.content")}
    //     </Typography>
    //   </Grid>
    //   <Grid item xs={12} container className={classes.content} justifyContent={centerIfMobile}>
    //     <Typography align={centerTextMobile} variant="body2">
    //       {t("view.newPassword.hint")}
    //     </Typography>
    //   </Grid>

    //   <Grid item xs={12} container justifyContent={centerIfMobile}>
    //     <img alt="" className={classes.img} role="presentation" src={landingImage} />
    //   </Grid>
    // </Grid>

    <Grid container>
    <Grid item xs={12} container justifyContent={centerIfMobile} >
      <Typography  align={centerTextMobile}>
        {t("view.newPassword.title")}
      </Typography>
    </Grid>

    <Grid item xs={12} container justifyContent={centerIfMobile}>
      <Typography align={centerTextMobile} variant="body2">
        {t("view.newPassword.content")}
      </Typography>
    </Grid>
    <Grid item xs={12} container justifyContent={centerIfMobile}>
      <Typography align={centerTextMobile} variant="body2">
        {t("view.newPassword.hint")}
      </Typography>
    </Grid>

    <Grid item xs={12} container justifyContent={centerIfMobile}>
      <img alt=""  role="presentation" src={landingImage} />
    </Grid>
  </Grid>
  )
}
