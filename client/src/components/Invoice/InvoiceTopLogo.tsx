import Grid from "@mui/material/Grid"
import Logo from "../LogoPortable"
import React from "react"

interface InvoiceTopLogoProps {
  isMobile: boolean,
  senderLogoUrl?: string,
  senderName?: string
}

export default function InvoiceTopLogo(props: InvoiceTopLogoProps): any {

  if (!props.senderLogoUrl && !props.senderName) {
    return (<></>)
  }

  return (
    <Grid
      item
      xs={props.isMobile ? 12 : 4}
      md={4}
      container
      justifyContent={props.isMobile ? "center" : "flex-end"}
    >
      {!props.isMobile ? <Grid style={{ width: 100 }}></Grid> : <></>}
      <Grid
        item
        container
        justifyContent={props.isMobile ? "center" : "flex-start"}
        style={{ width: props.isMobile ? "100%" : "calc(100% - 100px)" }}
      >
        <Logo imgUrl={props.senderLogoUrl} companyName={props.senderName as string} />
      </Grid>
    </Grid>
  )
}
