import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import MuiAccordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(5),
  },
  heading: {
    color: theme.palette.primary.main,
    flexBasis: "300px",
    flexGrow: 0,
    flexShrink: 0,
    fontSize: "1rem",
    fontWeight: theme.typography.fontWeightMedium,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
    flexBasis: "200px",
    flexGrow: 0,
    flexShrink: 1,
    fontSize: theme.typography.pxToRem(15),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  summaryContent: {
    maxWidth: "100%",
  },
  content: {
    display: "block",
  },
}))

export default function Accordion({ items, ...options }) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div className={classes.root} {...options}>
      {items.map((item, index) => (
        <MuiAccordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
          sx={{ mb: 2, mt: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            classes={{
              content: classes.summaryContent,
            }}
          >
            {item.header ? (
              item.header
            ) : (
              <Typography variant="h2" sx={{ m: 0 }}>
                {item.title || ""}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails id={`panel${index}-content`} className={classes.content}>
            {item.content}
          </AccordionDetails>
        </MuiAccordion>
      ))}
    </div>
  )
}
