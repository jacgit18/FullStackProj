import React from "react"
import { useTranslation } from "react-i18next"
import PublishIcon from "@mui/icons-material/Publish"
import makeStyles from "@mui/styles/makeStyles"

import Button from "../Button"

const useStyles = makeStyles((theme) => ({
  upload: {
    background: theme.palette.background.paper,
    borderColor: theme.palette.grey[400],
    color: theme.palette.text.secondary,
    fontSize: 14,
    fontWeight: 300,
    padding: "14px 18.5px",
    textTransform: "capitalize",
    width: "100%",
  },
  input: {
    display: "none",
  },
}))

export default function UploadFileButton({ onChangePicture }) {
  const classes = useStyles()
  const { t } = useTranslation("public")

  return (
    <div>
      {/* <Button className={classes.upload} variant="outlined" startIcon={<PublishIcon />}>
        {t("form.label.uploadAttachments")}
        <input type="file" hidden />
      </Button> */}
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={(e) => onChangePicture(e)}
      />
      <label htmlFor="contained-button-file">
        <Button
          color="primary"
          component="span"
          className={classes.upload}
          variant="outlined"
          startIcon={<PublishIcon />}
        >
          {t("form.label.uploadAttachments")}
        </Button>
      </label>
    </div>
  )
}
