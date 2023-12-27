import Grid from "@mui/material/Grid"
import parse from "html-react-parser"
import {decode} from "html-entities"
import React from "react"

// @ts-ignore
import DetailsTable from "../DetailsTable"
// @ts-ignore
import Logo from "../LogoPortable"
import InvoiceTopCompanyInfo, {CompanyAddressInfo} from "./InvoiceTopCompanyInfo"
import {useTranslation} from "react-i18next";
import InvoiceTopNumber from "./InvoiceTopNumber";
import InvoiceTopLogo from "./InvoiceTopLogo";
import InvoiceTopAttachedFiles from "./InvoiceTopAttachedFiles";

interface InvoiceInformation {
  number: string,
  notes: string,
}

interface InvoiceTopSectionProps {
  isMobile: boolean,
  info: InvoiceInformation,
  sender?: CompanyAddressInfo,
  senderLogoUrl?: string,
  receiver?: CompanyAddressInfo,
  files: string[],
  // Inner component displayed as-is
  invoiceDetails: any,
}

export default function InvoiceTopSection(props: InvoiceTopSectionProps): any {
  const { t } = useTranslation("private")

  return (
    <Grid container spacing={3}>

      <InvoiceTopNumber number={props.info.number} isMobile={props.isMobile}/>

      <InvoiceTopLogo
        isMobile={props.isMobile}
        senderLogoUrl={props.senderLogoUrl}
        senderName={props.sender?.name}
      />

      <Grid container item xs={props.isMobile ? 12 : 8}>
        {props.invoiceDetails}
      </Grid>

      <Grid container item xs={props.isMobile ? 12 : 4}>

        <InvoiceTopCompanyInfo sender={props.sender} receiver={props.receiver}/>

        {props.info.notes ? (
          <DetailsTable
            detail={{
              title: t("view.ChangeOrder.Summary.notes"),
              content: parse(decode(props.info.notes)),
            }}
          />
        ) : (
          <></>
        )}
      </Grid>

      <InvoiceTopAttachedFiles files={props.files}/>
    </Grid>
  )
}
