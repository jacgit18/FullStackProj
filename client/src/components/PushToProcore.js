import React, { useEffect } from "react"
import { useAgaveLink } from "@agave-api/react-agave-link"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"

import api from "../libs/api"
import config from "../libs/config"
import Button from "./Button"
import Fab from "./Fab"
import { formatMoney } from "../libs/format"

export default function PushToProcore({ itemInfo }) {
  const { enqueueSnackbar } = useSnackbar()
  const tickets = useSelector((state) => state.tickets.items)
  const [projects, setProjects] = React.useState([])
  const [value, setValue] = React.useState({})
  const [selectedId, setSelectedId] = React.useState("")
  const [selectedPco, setSelectePco] = React.useState("")
  const [selectionModel, setSelectionModel] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [pcoOpen, setPcoOpen] = React.useState(false)
  const [pcos, setPcos] = React.useState([])
  const [token, setToken] = React.useState(null)
  //Used in case of pushing CO
  const pushedTickets = []
  const lineItems = []
  let adjustedCost = 0

  if (itemInfo.tickets) {
    // const itemInfo = useSelector(getTicket(itemId))
    itemInfo.tickets.forEach((item) => {
      const filteredTicket = tickets.filter((ticket) => ticket.id === item)[0]
      adjustedCost += filteredTicket.co_total ? filteredTicket.co_total - filteredTicket.balance : 0
      pushedTickets.push(filteredTicket)
    })
    console.log(adjustedCost)
    console.log(pushedTickets)
  }

  const procoreProjectsURL = `${config.agave.root}/construction/projects`
  const getProjects = () => {
    // Send publicToken to your server
    api
      .get(procoreProjectsURL, {})
      .then((response) => {
        console.log(response)
        setProjects(response.data.data)
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  useEffect(() => {
    const publicTokenURL = `${config.agave.root}/user`
    const loadChangeOrders = async () => {
      api
        .post(publicTokenURL, {
          reference_id: "user_id_in_your_app",
        })
        .then(
          (response) => {
            let result = response.data
            setToken(result)
          },
          (error) => {
            console.log(error)
          }
        )
    }
    loadChangeOrders().catch((err) => console.log(err))
  }, [])

  // Notification Banners for pushing Ticket Line Items
  const notificationSuccessful = () => {
    enqueueSnackbar("Ticket pushed to Procore", {
      variant: "success",
    })
  }
  const notificationError = () => {
    enqueueSnackbar(`Line Item not Pushed to Procore`, {
      variant: "error",
    })
  }

  const notificationLoading = () => {
    enqueueSnackbar(`Your ticket is being pushed to Procore`, {
      variant: "info",
    })
  }

  //Connect To Procore
  const onSuccess = React.useCallback((publicToken) => {
    const pushPublicToken = `${config.agave.root}/connect`
    const notificationLoggedIn = () => {
      enqueueSnackbar("Succesfully Logged Into Procore", {
        variant: "success",
      })
    }
    const notificationErrorLoggingIn = () => {
      enqueueSnackbar(`Error Logging Into Procore. Try Again`, {
        variant: "error",
      })
    }

    api
      .post(pushPublicToken, {
        token: publicToken,
      })
      .then((response) => {
        notificationLoggedIn()
        console.log(response)
        getProjects()
        handleClickOpen()
      })
      .catch((error) => {
        notificationErrorLoggingIn()
        console.log("error", error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onExit = React.useCallback((error) => {
    console.log(error ? "Error: " + error : "User closed Agave Link")
  }, [])

  const { openLink } = useAgaveLink({
    //isReady
    referenceId: "user-123",
    linkToken: token ? token.link_token : {},
    showSandboxSourceSystems: true, // Only for local development
    showProductionSourceSystems: true,
    sourceSystem: "procore", // If you need to open a specific source system
    sourceSystemEnvironment: "sandbox",
    // category: 'accounting', // If you need to limit source systems to a specific category
    onSuccess,
    onExit,
  })

  //Function for looping through line items in Tickets and uploading them into an array.
  const insertlineItems = (item) => {
    //Add Breakdowns to lineItems array
    if (item.equipment.breakdown) {
      item.equipment.breakdown.forEach((equipment) => {
        lineItems.push({
          amount: equipment.total,
          change_order_id: selectedPco[0],
          description: equipment.type,
          quantity: equipment.quantity,
          type: "Equipment",
          unit_cost: equipment.rate,
          unit_of_measure: equipment.unit,
        })
      })

      if (item.equipment.markup) {
        item.equipment.markup.forEach((markup) => {
          lineItems.push({
            amount: markup.total,
            change_order_id: selectedPco[0],
            description: `${markup.title} (Equipment)`,
            quantity: markup.amount,
            type: "Other",
            unit_of_measure: "%",
          })
        })
      }
    }

    if (item.labor.breakdown) {
      item.labor.breakdown.forEach((labor) => {
        lineItems.push({
          amount: labor.total,
          change_order_id: selectedPco[0],
          description: labor.type,
          quantity: labor.quantity,
          type: "Labor",
          unit_cost: labor.rate,
          unit_of_measure: labor.unit,
        })
      })
      if (item.labor.markup) {
        item.labor.markup.forEach((markup) => {
          lineItems.push({
            amount: markup.total,
            change_order_id: selectedPco[0],
            description: `${markup.title} (Labor)`,
            quantity: markup.amount,
            type: "Other",
            unit_of_measure: "%",
          })
        })
      }
    }

    if (item.material.breakdown) {
      item.material.breakdown.forEach((material) => {
        lineItems.push({
          amount: material.total,
          change_order_id: selectedPco[0],
          description: material.type,
          quantity: material.quantity,
          type: "Materials",
          unit_cost: material.rate,
          unit_of_measure: material.unit,
        })
      })

      if (item.material.markup) {
        item.material.markup.forEach((markup) => {
          lineItems.push({
            amount: markup.total,
            change_order_id: selectedPco[0],
            description: `${markup.title} (Material)`,
            quantity: markup.amount,
            type: "Other",
            unit_of_measure: "%",
          })
        })
      }
    }

    if (item.markup) {
      item.markup.forEach((markup) => {
        lineItems.push({
          amount: markup.total,
          change_order_id: selectedPco[0],
          description: markup.title,
          quantity: markup.amount,
          type: "Other",
          unit_of_measure: "%",
        })
      })
    }

    return lineItems
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickPcoOpen = () => {
    setPcoOpen(true)
  }

  const handleClosePco = () => {
    setOpen(false)
    setPcoOpen(false)
  }

  const getPCOS = () => {
    const projectPCOsURL = `${config.agave.root}/pcos/${selectedId}`
    api
      .get(projectPCOsURL, {})
      .then((response) => {
        console.log(response)
        setPcos(response.data.data)
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  async function handlePushLineItem() {
    const pushLineItemURL = `${config.agave.root}/push_pco_line_item/${selectedId}`

    if (itemInfo.tickets) {
      pushedTickets.forEach((ticket) => {
        insertlineItems(ticket)
      })
      if (adjustedCost) {
        lineItems.push({
          amount: adjustedCost,
          change_order_id: selectedPco[0],
          description: "Change Order Cost Adjusted",
          type: "Other",
          unit_of_measure: "$",
        })
      }
    }
    const ticketLineItems = !itemInfo.tickets ? insertlineItems(itemInfo) : lineItems

    notificationLoading()

    for (const [i, lineItem] of ticketLineItems.entries()) {
      await api
        .post(pushLineItemURL, lineItem)
        .then((response) => {
          console.log(response)
          if (i === ticketLineItems.length - 1) {
            notificationSuccessful()
          }
        })
        .catch((error) => {
          console.log("error", error)
          notificationError()
        })
    }
  }

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 300,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      sortable: false,
      width: 160,
      valueGetter: (params) => `${params.row.start_date}`,
    },
    {
      field: "amount",
      headerName: "Amount",
      sortable: false,
      width: 160,
      valueGetter: (params) => `${formatMoney(params.row.amount)}`,
    },
  ]

  return (
    <>
      <Fab
        style={{ backgroundColor: "#ed8456" }}
        edge="end"
        size="medium"
        variant="extended"
        onClick={() => {
          openLink()
        }}
      >
        Push To Procore
      </Fab>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
        <DialogTitle>Projects in Procore</DialogTitle>
        <DialogContent style={{ height: "70vh" }}>
          {projects ? (
            <DataGrid
              rows={projects}
              columns={columns}
              checkboxSelection
              selectionModel={selectionModel}
              onSelectionModelChange={(newSelection) => {
                /* make sure only one click box is clicked */
                setSelectionModel(newSelection)

                if (newSelection) {
                  if (newSelection.length > 1) {
                    const selectionSet = new Set(selectionModel)
                    const result = newSelection.filter((s) => !selectionSet.has(s))
                    /* up date the state of selection model  */
                    setSelectionModel(result)
                  } else {
                    /* up date the state of selection model  */
                    setSelectionModel(newSelection)
                  }

                  const ticketIds = newSelection
                  console.log("t id", ticketIds)
                  setSelectedId(ticketIds)
                  let newTickets = {}
                  for (let ticketId of ticketIds) {
                    if (ticketId in value) {
                      console.log("ticketID", ticketId)
                      newTickets[ticketId] = value[ticketId]
                    } else {
                      newTickets[ticketId] = null
                    }
                  }
                } else {
                  setValue({})
                }
              }}
            />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {selectedId ? (
            <Button
              onClick={() => {
                getPCOS()
                handleClickPcoOpen()
              }}
            >
              Next
            </Button>
          ) : (
            <></>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={pcoOpen} onClose={handleClosePco} fullWidth maxWidth={"md"}>
        <DialogTitle>PCOs in Project</DialogTitle>
        <DialogContent style={{ height: "70vh" }}>
          {pcos ? (
            <DataGrid
              rows={pcos}
              columns={[
                {
                  field: "number",
                  headerName: "#",
                  sortable: false,
                  width: 80,
                  valueGetter: (params) => `${params.row.number}`,
                },
                {
                  field: "name",
                  headerName: "Name",
                  width: 350,
                },
                {
                  field: "source_update_time",
                  headerName: "Last Updated On",
                  sortable: false,
                  width: 200,
                  valueGetter: (params) => {
                    const sdf = new Date(params.row.source_update_time).toDateString()
                    return `${sdf}`
                  },
                },
                {
                  field: "amount",
                  headerName: "Amount",
                  sortable: false,
                  width: 200,
                  valueGetter: (params) => {
                    return formatMoney(params.row.amount)
                  },
                },
              ]}
              checkboxSelection
              selectionModel={selectionModel}
              onSelectionModelChange={(newSelection) => {
                if (newSelection) {
                  if (newSelection.length > 1) {
                    const selectionSet = new Set(selectionModel)
                    const result = newSelection.filter((s) => !selectionSet.has(s))
                    /* up date the state of selection model  */
                    setSelectionModel(result)
                  } else {
                    /* up date the state of selection model  */
                    setSelectionModel(newSelection)
                  }

                  const pcoIds = newSelection
                  setSelectePco(pcoIds)
                  let newPcos = {}
                  for (let pcoId of pcoIds) {
                    if (pcoId in value) {
                      newPcos[pcoId] = value[pcoId]
                    } else {
                      newPcos[pcoId] = null
                    }
                  }
                } else {
                  setValue({})
                }
              }}
            />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePco}>Cancel</Button>
          <Button
            onClick={() => {
              handlePushLineItem()
              handleClosePco()
            }}
            style={{ backgroundColor: "#ed8456" }}
            disabled={selectedPco ? false : true}
          >
            Push To This PCO
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
