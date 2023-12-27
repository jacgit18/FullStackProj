import React from "react"
// import { useTranslation } from "react-i18next"
import parse from "html-react-parser"
import { useTheme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import useMediaQuery from "@mui/material/useMediaQuery"
import MuiAvatar from "@mui/material/Avatar"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"

import { formatDateLongWithTime } from "../../libs/format"

const useStyles = makeStyles((theme) => ({
  aTag: {
    color: "#40C4FF",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "underline",
  },
  button: {
    borderRadius: 0,
  },
  description: {
    borderLeft: "2px solid #CCCCCC",
    opacity: 1,
    paddingLeft: 10,
  },
  descriptionTitles: { color: "#757575", fontSize: "12px" },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    maxWidth: 800,
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  title: {
    textTransform: "uppercase",
    fontSize: "16px",
    fontWeight: 700,
    paddingBottom: 15,
  },
  total: {
    fontSize: "18px",
  },
  totals: {
    paddingBottom: 40,
  },
}))

export default function HistoryListItem({ item }) {
  const classes = useStyles()
  const { user } = item
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const mobileCenter = isMobile ? "center" : "right"
  const [open, setOpen] = React.useState(false)

  return (
    <Box sx={{ borderTop: 1, borderColor: "grey.400", p: 2 }}>
      <Grid container justifyContent="flex-start" spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid item xs={12} style={{ justifyContent: "flex-end", paddingLeft: 90 }}>
            {item.signature ? (
              <img
                alt="signature"
                src={item.signature}
                style={{ height: "100px", maxWidth: 300 }}
              />
            ) : (
              ""
            )}
          </Grid>

          {parse(item.content) === "Item updated." ? (
            <Typography
              color="primary"
              style={{ fontWeight: 700, paddingBottom: 5, paddingLeft: 90 }}
            >
              {parse(item.content)}
            </Typography>
          ) : (
            <Typography color="primary" style={{ fontWeight: 700, paddingBottom: 5 }}>
              {parse(item.content)}
            </Typography>
          )}

          {item.message ? (
            <div>
              <Link to="." onClick={() => setOpen(true)}>
                View Message
              </Link>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={open}>
                  <div className={classes.paper}>
                    <p id="transition-modal-description">{`Notes: ${item.message}`}</p>
                    {item.file && item.file.length !== 0 ? (
                      <img
                        src={item.file}
                        alt={item.id}
                        style={{ width: "100%", maxHeight: 310 }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </Fade>
              </Modal>
            </div>
          ) : (
            ""
          )}
        </Grid>
        {item.amount && item.amount !== 0 && item.amount !== "0" ? (
          <Grid item xs={12} md={3}>
            <Typography align={mobileCenter}>${item.amount}</Typography>
            <Typography align={mobileCenter} className={classes.aTag}>
              Delete Payment
            </Typography>
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      <Grid container alignItems="flex-end" justifyContent="flex-start" spacing={2}>
        <Grid item sx={{ width: 70 }}>
          {user && user.avatar ? (
            <IconButton>
              <MuiAvatar src={user.avatar} />
            </IconButton>
          ) : (
            ""
          )}
        </Grid>
        <Grid item sx={{ width: { xs: "calc(100% - 70px)", md: 250 } }}>
          {user && user.name ? (
            <Typography sx={{ fontWeight: 700, color: "grey.700" }}>{user.name}</Typography>
          ) : (
            ""
          )}
        </Grid>
        <Grid item sx={{ width: { xs: "calc(100% - 70px)", md: 300 } }}>
          <Typography sx={{ color: "grey.700" }}>{`${formatDateLongWithTime(
            item.date
          )}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
