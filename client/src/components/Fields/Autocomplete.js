import * as React from "react"
import MuiAutocomplete from "@mui/material/Autocomplete"

import TextField from "./Text"
import { Field } from "formik"

export default function Autocomplete({ label, error, helperText, options, value, ...props }) {
  return (
    <MuiAutocomplete
      disablePortal
      options={options}
      renderInput={(params) => (
        <TextField error={error} helperText={helperText} label={label} value={value} {...params} />
      )}
      {...props}
    />
  )
}

// To replace a select field, this example should work:
// import AutocompleteField from "../components/Fields/Autocomplete"
//
// <AutocompleteField
//   error={Boolean(touched.type_id && errors.type_id)}
//   helperText={touched.type_id && errors.type_id}
//   label="Type"
//   name="type_id"
//   onBlur={handleBlur}
//   onChange={(event, newValue) => {
//     const selectedItem = dropdownItems.find(({ id }) => id === newValue.value)
//     setFieldValue("type_id", newValue.value)
//     setFieldValue("unit", selectedItem.unit)
//     setFieldValue("rate", selectedItem.rate)
//     setSelectedType(selectedItem)
//   }}
//   options={typeOptions}
//   isOptionEqualToValue={(option, value) => option.value === value.value}
// />
