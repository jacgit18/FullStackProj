import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import DocumentIcon from "@mui/icons-material/Description"
import PdfIcon from "@mui/icons-material/PictureAsPdf"

import Modal from "./Modal"

const useStyles = makeStyles((theme) => ({
  button: {
    background: "transparent",
    border: "none",
    color: theme.palette.primary.main,
    cursor: "pointer",
    padding: 0,
    textAlign: "center",
    width: "100%",
    "&:hover": {
      color: theme.palette.secondary.main,
      "& img": {
        outline: `3px solid ${theme.palette.secondary.main}`,
      },
    },
  },
  delete: {
    color: "#0E2348",
    cursor: "pointer",
    float: "left",
    "&:hover": {
      color: theme.palette.secondary.main,
      "& img": {
        outline: `3px solid ${theme.palette.secondary.main}`,
      },
    },
  },
  frame: {
    height: "100%",
    width: "100%",
  },
  icon: {
    height: 100,
    width: 100,
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
  thumbnail: {
    height: 100,
    width: 100,
  },
}))

export default function FilesRow({ files, editable }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState("")
  const handleOpen = (selected) => {
    setOpen(true)
    if (files[selected]) {
      setSelectedFile(files[selected])
    }
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Grid style={{ paddingTop: 30 }} container>
        {files
          ? files.map((file, index) => {
              const filename = file.file.substring(
                file.file.lastIndexOf("/") + 1,
                file.file.lastIndexOf(".")
              )
              const thumbnail = file.is_image ? (
                <img
                  alt="thumbnail"
                  className={classes.thumbnail}
                  src={file.sizes && file.sizes.thumbnail ? file.sizes.thumbnail.file : file.file}
                />
              ) : file["mime-type"] && file["mime-type"].includes("pdf") ? (
                <PdfIcon className={classes.icon} />
              ) : (
                <DocumentIcon className={classes.icon} />
              )
              return (
                <Grid key={index} item xs={2}>
                  {/* {editable === true ? (
                    <DeleteButton
                      className={classes.delete}
                      onClick={() => {
                        //Need to delete files on edit
                        //Work to be done here.

                        console.log(files[index])
                      }}
                    />
                  ) : (
                    <></>
                  )} */}
                  <button
                    className={classes.button}
                    type="button"
                    onClick={() => handleOpen(index)}
                  >
                    {thumbnail}
                    <Typography style={{ overflowWrap: "anywhere" }}>{filename}</Typography>
                  </button>
                </Grid>
              )
            })
          : ""}
      </Grid>
      <Modal handleClose={handleClose} open={open}>
        {selectedFile.is_image ? (
          <img alt="attachment" className={classes.image} src={selectedFile.file} />
        ) : (
          <iframe
            className={classes.frame}
            frameBorder="0"
            src={selectedFile.file}
            title="attachment"
          />
        )}
      </Modal>
    </>
  )
}
