import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import React from "react"

// @ts-ignore
import FilesRow from "../FilesRow"

interface InvoiceTopAttachedFilesProps {
  files: string[]
}

export default function InvoiceTopAttachedFiles(props: InvoiceTopAttachedFilesProps): any {
  if (props.files?.length > 0) {
    return (
      <Grid container item xs={12}>
        <Typography variant="h2">Attachments</Typography>
        <FilesRow files={props.files} />
      </Grid>
    )
  }
  return (<></>)
}
