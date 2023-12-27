import React from "react"
import { FieldArray } from "formik" //getIn
import DeleteIcon from "@mui/icons-material/Delete"
import Grid from "@mui/material/Grid"
import makeStyles from "@mui/styles/makeStyles"
import InputLabel from "@mui/material/InputLabel"
import Typography from "@mui/material/Typography"
import UploadIcon from "@mui/icons-material/CloudUpload"

import Button from "../Button"

const useStyles = makeStyles((theme) => ({
  label: {
    marginBottom: theme.spacing(1),
  },
}))

export default function UploadMultiple({
  errors,
  label,
  setFieldValue,
  touched,
  values,
  ...props
}) {
  const classes = useStyles()
  return (
    <div name="files" {...props}>
      <InputLabel className={classes.label}>{label || "Upload Files"}</InputLabel>
      <FieldArray>
        {({ remove, push }) => (
          <>
            {values.files.map((file, index) => {
              const fileInputRef = React.createRef()

              return file ? (
                <Grid container key={index} spacing={1} sx={{ paddingBottom: 2 }}>
                  <Grid item xs={3} container alignItems="center">
                    <Button
                      onClick={() => fileInputRef.current.click()}
                      size="small"
                      startIcon={<UploadIcon />}
                    >
                      Choose file
                    </Button>
                  </Grid>
                  <Grid item xs={7} container alignItems="center">
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const newFilesValue = [...values.files]
                        if (event.currentTarget.files.length > 0) {
                          newFilesValue[index] = event.currentTarget.files[0]
                          setFieldValue("files", newFilesValue)
                        }
                      }}
                      ref={fileInputRef}
                    />
                    <Typography>{file.name ? file.name : "No file chosen"}</Typography>
                  </Grid>
                  <Grid item xs={2} container alignItems="center" justifyContent="flex-end">
                    {values.files[0].name || values.files[1] ? (
                      <Button
                        color="secondary"
                        onClick={() => {
                          if (values.files.length < 2) {
                            values.files = [
                              {
                                name: "",
                              },
                            ]
                          } else {
                            const newFilesValue = [...values.files]
                            newFilesValue.splice(index, 1)
                            setFieldValue("files", newFilesValue)
                          }
                          remove(index)
                        }}
                        size="small"
                        variant="text"
                      >
                        <DeleteIcon />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <></>
              )
            })}
            <Grid container spacing={3}>
              <Grid container item xs={12} alignItems="center" justifyContent="flex-end">
                <Button
                  color="secondary"
                  onClick={() => {
                    const newFilesValue = [...values.files]
                    newFilesValue.push({
                      name: "",
                    })
                    setFieldValue("files", newFilesValue)
                    push({
                      name: "",
                    })
                  }}
                  size="small"
                  variant="text"
                >
                  Upload Another File
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </FieldArray>
    </div>
  )
}
