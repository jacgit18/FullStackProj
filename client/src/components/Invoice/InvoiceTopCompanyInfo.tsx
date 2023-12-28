import Typography from "@mui/material/Typography"
import parse from "html-react-parser"
import React from "react"
import {useTranslation} from "react-i18next"

// @ts-ignore
import DetailsTable from "../DetailsTable"


export interface CompanyAddressInfo {
  name: string,
  address?: string,
  phone?: string,
}

interface InvoiceTopCompanyInfoProps {
  sender?: CompanyAddressInfo,
  receiver?: CompanyAddressInfo,
}

export default function InvoiceTopCompanyInfo(props: InvoiceTopCompanyInfoProps): any {
  const { t } = useTranslation("private")

  return (
    <>
      {props.sender ?
        <DetailsTable
          detail={{
            title: t("view.ChangeOrder.Summary.from"),
            content: {
              address: props.sender.address,
              name: props.sender.name,
              phone: props.sender.phone,
            },
          }}
          formatter={(content: any) => (
            <>
              {/*@ts-ignore*/}
              <Typography stlye={{ fontWeight: 900 }}>{content.name}</Typography>
              {content.address ? <Typography>{parse(`${content.address}`)}</Typography> : <></>}
              {content.phone ? <Typography>{content.phone}</Typography> : <></>}
            </>
          )}
        />
        : <></>
      }

      {props.receiver ?
        <DetailsTable
          detail={{
            title: t("view.ChangeOrder.Summary.to"),
            content: {
              address: props.receiver.address,
              name: props.receiver.name,
            },
          }}
          formatter={(content: any) => (
            <>
              {/*@ts-ignore*/}
              <Typography stlye={{ fontWeight: 900 }}>{content.name}</Typography>
              {content.address ? <Typography>{parse(content.address)}</Typography> : <></>}
            </>
          )}
        />
        : <></>
      }
    </>
  )
}
