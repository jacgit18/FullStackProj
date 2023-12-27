import React from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import Grid from "@mui/material/Grid"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import SendIcon from "@mui/icons-material/Send"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { useTheme } from "@mui/material"
import Typography from "@mui/material/Typography"

import Button from "./Button"
import Container from "./Container"
import FormSmallContainer from "./FormSmallContainer"
import Pocket from "./Pocket"
import UpdateAction from "./Menus"
import ReviewForm from "../forms/Review"
import ApproveForm from "../forms/ReviewApprove"
import SendForm from "../forms/Send"
import { getCompany } from "../store/features/companySlice"
import {
  getProject,
  listContacts,
  loadContacts,
  listUsers,
  loadUsers,
} from "../store/features/projectSlice"


/***********************************************
 * TODO DEPRECATED, DO NOT USE
* *********************************************/
export default function SendAndReview({ data, setter, type, isTicket }) {
  const company = useSelector(getCompany)
  const dispatch = useDispatch()
  const isTrade = company.type === "cm" ? false : true
  const theme = useTheme()
  const project = useSelector(getProject)
  const internalUsers = useSelector(listUsers)
  const clientContacts = useSelector(listContacts)
  const [approve, setApprove] = React.useState(false)
  const [reject, setReject] = React.useState(false)
  const [revise, setRevise] = React.useState(false)
  const [send, setSend] = React.useState(false)
  const { t } = useTranslation("private")

  const baseUrl = `/project/${project.id}/${type}/${data.id}`
  const sendUrl = `${baseUrl}/send`
  const reviewUrl = `${baseUrl}/review`

  const toggleShow = (formName) => {
    setApprove(formName === "approve" ? !approve : false)
    setReject(formName === "reject" ? !reject : false)
    setRevise(formName === "revise" ? !revise : false)
    setSend(formName === "send" ? !send : false)
  }

  React.useEffect(() => {
    dispatch(loadContacts())
    dispatch(loadUsers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container removeTop>
        <Grid container item xs={12} spacing={2}>
          <Grid item>
            <Button
              // className={classes.button}
              endIcon={<SendIcon />}
              style={{ minWidth: 125 }}
              onClick={() => toggleShow("send")}
              disabled={send}
            >
              {t("view.ChangeOrder.Summary.send")}
            </Button>
          </Grid>
          {isTrade ? (
            <Grid item>
              <UpdateAction data={data} type={type} />
            </Grid>
          ) : (
            ""
          )}

          {data &&
          data.action &&
          ["submitted", "tm_submitted", "cost_submitted"].includes(data.action.id) &&
          !isTrade ? (
            <>
              <Grid item>
                <Button
                  color="success"
                  endIcon={<CheckBoxIcon />}
                  style={{ minWidth: 125 }}
                  onClick={() => toggleShow("approve")}
                  disabled={approve}
                >
                  {t("view.ChangeOrder.Summary.approve")}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="error"
                  endIcon={<ThumbDownIcon />}
                  style={{ minWidth: 125 }}
                  onClick={() => toggleShow("reject")}
                  disabled={reject}
                >
                  {t("view.ChangeOrder.Summary.reject")}
                </Button>
              </Grid>
              <Grid item>
                <Button color="warning" onClick={() => toggleShow("revise")} disabled={revise}>
                  {t("view.ChangeOrder.Summary.revise")}
                </Button>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
      </Container>

      <Pocket show={send}>
        <FormSmallContainer>
          <SendForm
            internalUsers={internalUsers}
            isTicket={isTicket}
            clientUsers={clientContacts}
            requestUrl={sendUrl}
            setter={setter}
            toggle={() => toggleShow("send")}
          />
        </FormSmallContainer>
      </Pocket>
      {!isTrade ? (
        <>
          <Pocket show={approve}>
            <FormSmallContainer>
              {data.action.id === "tm_submitted" ? (
                <Container
                  style={{
                    background: theme.palette.grey[600],
                    marginBottom: theme.spacing(6),
                    marginTop: -theme.spacing(6),
                    padding: theme.spacing(4),
                  }}
                >
                  <Typography variant="h3" align={"center"} style={{ color: "white" }}>
                    {project.disclaimer
                      ? project.disclaimer
                      : "SIGNATURE ACKNOWLEDGES TIME AND MATERIAL USED, BUT DOES NOT CHANGE CONTRACTUAL OBLIGATIONS OF EITHER PARTY"}
                  </Typography>
                </Container>
              ) : (
                <></>
              )}
              <ApproveForm
                requestUrl={reviewUrl}
                setter={setter}
                toggle={() => toggleShow("approve")}
                actionData={data.action}
              />
            </FormSmallContainer>
          </Pocket>
          <Pocket show={reject}>
            <FormSmallContainer>
              <ReviewForm
                requestUrl={reviewUrl}
                setter={setter}
                toggle={() => toggleShow("reject")}
              />
            </FormSmallContainer>
          </Pocket>
          <Pocket show={revise}>
            <FormSmallContainer>
              <ReviewForm
                requestUrl={reviewUrl}
                revise
                setter={setter}
                toggle={() => toggleShow("revise")}
              />
            </FormSmallContainer>
          </Pocket>
        </>
      ) : (
        ""
      )}
    </>
  )
}
