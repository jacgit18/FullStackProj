import Grid from "@mui/material/Grid"
import Fab from "../../components/Fab"
import AddIcon from "@mui/icons-material/Add"
import React from "react"
import {CompanyUserRoleCode} from "../../util/permissionTypes"


export const UsersTopButtons = (
  setDialog: any,
  companyUserRole: CompanyUserRoleCode,
  theme: any,
  t: any,
): any[] => {
  return companyUserRole === 'admin' ? [
    (
      <Grid item>
        <Fab
          // @ts-ignore
          onClick={() => setDialog("inviteuserform")}
          size="medium"
          variant="extended"
          style={{ backgroundColor: "white", color: theme.palette.secondary.main }}
        >
          <AddIcon />
          {t("view.Settings.invite")}
        </Fab>
      </Grid>
    ),
    // ( // TODO DEV-177
    //   <Grid item>
    //     <Fab
    //       // @ts-ignore
    //       edge="end"
    //       size="medium"
    //       variant="extended"
    //       style={{ backgroundColor: "white", color: theme.palette.secondary.main }}
    //     >
    //       {t("view.Settings.archive")}
    //     </Fab>
    //   </Grid>
    // ),
  ] : []
}
