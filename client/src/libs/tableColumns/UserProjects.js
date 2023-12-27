import parse from "html-react-parser"
import { decode } from "html-entities"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import SettingsIcon from "@mui/icons-material/Settings"

import DtRowTitle from "../../components/DtRowTitle"
import Link from "../../components/Link"
import { formatDate } from "../../libs/format"
import { setProject } from "../../store/features/projectSlice"

export default function SettingsUsers(props = {}, userIsCrew) {
  const { t } = useTranslation("private")
  const dispatch = useDispatch()
  const history = useHistory()

  const columns = [
    {
      field: "number",
      headerName: "#", //TIX
      headerAlign: "left",
      align: "left",
      width: 80,
      editable: false,
    },
    {
      field: "name",
      flex: 1,
      headerName: t("view.Projects.name").toUpperCase(), //Name and Client
      minWidth: 130,
      headerAlign: "left",
      align: "left",
      editable: false,
      renderCell: (params) => {
        return (
          <Grid container>
            <Grid item xs={12}>
              <Link
                onClick={() => dispatch(setProject(params.row))}
                to={`/0/project/${params.row.id}/tickets`}
              >
                <DtRowTitle>{decode(params.value)}</DtRowTitle>
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: "grey.700",
                  display: "block",
                  fontSize: "13px",
                  overflow: "hidden",
                  // paddingLeft: "6px",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {params.row.client_name}
              </Typography>
            </Grid>
          </Grid>
        )
      },
    },
    {
      field: "tix",
      headerName: t("view.Projects.tix").toUpperCase(),
      headerAlign: "center",
      align: "center",
      width: 90,
      editable: false,
      filterable: false,
      hideable: false,
      sortable: false,
      renderCell: (params) => (
        <Link
          onClick={() => dispatch(setProject(params.row))}
          to={{
            pathname: `/0/project/${params.row.id}/tickets`,
            projectId: `${params.row.id}`,
          }}
        >
          <DtRowTitle>View</DtRowTitle>
        </Link>
      ),
    },
    {
      field: "date_start",
      width: 120,
      headerName: t("view.Projects.start").toUpperCase(), //Start
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "address",
      flex: 1,
      headerName: t("view.Projects.address").toUpperCase(),
      minWidth: 180,
      headerAlign: "left",
      align: "left",
      editable: false,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {parse(decode(params.value))}
          </Box>
        )
      },
    },
  ]

  if (!userIsCrew) {
    columns.push(
      {
        field: "settings",
        width: 120,
        headerName: t("view.Projects.settings").toUpperCase(), //Settings
        headerAlign: "center",
        align: "center",
        editable: false,
        hideable: false,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton
            color="secondary"
            onClick={() => {
              dispatch(setProject(params.row))
              history.push(`/0/project/${params.row.id}/settings`)
            }}
          >
            <SettingsIcon />
          </IconButton>
        ),
      },
    )
  }

  return columns
}
