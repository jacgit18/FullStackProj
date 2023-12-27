import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import makeStyles from "@mui/styles/makeStyles"
import React from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import Card from "../components/Card"
import Layout from "../components/LayoutSimple"

import { resetChangeOrders } from "../store/features/changeOrdersSlice"
import { resetCompany, setCompany } from "../store/features/companySlice"
import { resetEquipment } from "../store/features/equipmentSlice"
import { resetLabor } from "../store/features/laborSlice"
import { resetMaterial } from "../store/features/materialSlice"
import { resetProject } from "../store/features/projectSlice"
import { resetTickets } from "../store/features/ticketsSlice"
import {
  listUserCompanies,
  loadUserCompanies,
  loadUserProjects,
  resetUserProjects,
} from "../store/features/userSlice"

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: "auto",
  },
  container: {
    padding: theme.spacing(3),
  },
  logo: {
    margin: "0 auto",
    maxHeight: 100,
    maxWidth: 100,
    width: "90%",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    paddingTop: 10,
  },
}))

export default function Authenticated() {
  const dispatch = useDispatch()
  const history = useHistory()
  // const classes = useStyles()
  const companies = useSelector(listUserCompanies)
  const { t } = useTranslation("common")

  React.useEffect(() => {
    dispatch(loadUserCompanies())
    dispatch(resetEquipment())
    dispatch(resetLabor())
    dispatch(resetMaterial())
    dispatch(resetTickets())
    dispatch(resetChangeOrders())
    dispatch(resetProject())
    dispatch(resetUserProjects())
    dispatch(resetCompany())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (newCompany) => {
    dispatch(setCompany(newCompany))
    dispatch(loadUserProjects())
    history.push("/0")
  }

//   return (
//     <Layout>
//       <Grid className={classes.container} container spacing={3}>
//         {companies ? (
//           companies.map((company, index) => (
//             <Grid
//               key={`${company.name} ${index}`}
//               item
//               container
//               alignContent="stretch"
//               alignItems="stretch"
//               xs={12}
//               sm={6}
//               md={3}
//             >
//               <Card
//                 button={
//                   <Button
//                     className={classes.button}
//                     size="small"
//                     onClick={() => {
//                       handleClick(company)
//                     }}
//                   >
//                     {t("Visit")}
//                   </Button>
//                 }
//                 action={() => {
//                   handleClick(company)
//                 }}
//                 title={company.name}
//                 className={classes.card}
//               >
//                 {company.logo_url ? (
//                   <img alt={t("Logo")} className={classes.logo} src={`${company.logo_url}`} />
//                 ) : (
//                   ""
//                 )}
//               </Card>
//             </Grid>
//           ))
//         ) : (
//           <></>
//         )}
//       </Grid>
//     </Layout>
//   )
// }


return (
  <Layout>
    <Grid >
      {companies ? (
        companies.map((company, index) => (
          <Grid
            key={`${company.name} ${index}`}
            item
            container
            alignContent="stretch"
            alignItems="stretch"
            xs={12}
            sm={6}
            md={3}
          >
            <Card
              button={
                <Button
                  size="small"
                  onClick={() => {
                    handleClick(company)
                  }}
                >
                  {t("Visit")}
                </Button>
              }
              action={() => {
                handleClick(company)
              }}
              title={company.name}
            >
              {company.logo_url ? (
                <img alt={t("Logo")} />
              ) : (
                ""
              )}
            </Card>
          </Grid>
        ))
      ) : (
        <></>
      )}
    </Grid>
  </Layout>
)
}
