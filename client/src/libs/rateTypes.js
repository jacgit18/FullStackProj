
const rateTypes = [
  {
    value: "rate_rt",
    label: "Regular Time",
  },
  {
    value: "rate_ot",
    label: "Overtime",
  },
  {
    value: "rate_dt",
    label: "Double Time",
  },
  {
    value: "rate_pot",
    label: "Premium Time",
  },
  {
    value: "rate_pdt",
    label: "Premium Double Time",
  },
]

export function getRateTypeName(value) {
  let rateObject = rateTypes.find((element) => element.value === value)
  return rateObject ? rateObject.label : null
}

export function getRateTypesFromLaborType(laborType) {
  if (laborType == null) return []
  const rateTypeOptions = []
  for (let rateType of rateTypes) {
    if (laborType[rateType.value] != null) {
      rateTypeOptions.push(rateType)
    }
  }
  return rateTypeOptions
}

export default rateTypes
