import * as React from "react"
import PropTypes from "prop-types"
// import SwipeableViews from 'react-swipeable-views';
import { useTheme } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import MuiTabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"

import Container from "./Container"

function TabPanel({ children, value, index, ...props }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  }
}

export default function Tabs({ tabs }) {
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // const handleChangeIndex = (index) => {
  //   setValue(index);
  // };

  return tabs.length ? (
    <Box sx={{ width: "100%" }}>
      <Container removeBottom removeTop>
        <AppBar position="static">
          <MuiTabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            aria-label="tabs navigation"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.navigationText} {...a11yProps(index)} />
            ))}
          </MuiTabs>
        </AppBar>
      </Container>
      <Box
        sx={{
          bgcolor: "grey.200",
          boxShadow: "1px 0 8px 8px rgba(0, 0, 0, .125) inset",
          pt: 3,
          width: "100%",
        }}
      >
        <Container removeTop>
          {/* <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          > */}
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={value} index={index} dir={theme.direction}>
              {tab.content}
            </TabPanel>
          ))}
          {/* </SwipeableViews> */}
        </Container>
      </Box>
    </Box>
  ) : (
    <></>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.array,
}
