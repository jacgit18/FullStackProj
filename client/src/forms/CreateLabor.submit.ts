
export function processFormValues(values: any): any {
  const submitValues: any = {}
  submitValues.date_start = (new Date(values.date_start)).toISOString()
  if (submitValues.date_end == null) {
    delete submitValues.date_end
  } else {
    submitValues.date_end = (new Date(values.date_end)).toISOString()
  }
  submitValues.name = values.name
  submitValues.subcontractor_id = values.subcontractor_id
  const addTheseFieldsIfLengthGtZero: string[] = [
    'rate_rt', 'rate_ot', 'rate_pot', 'rate_dt', 'rate_pdt',
    'cost_code', 'notes'
  ]
  for (let field of addTheseFieldsIfLengthGtZero) {
    if (typeof values[field] === 'number' || values[field].length > 0) {
      submitValues[field] = values[field]
    }
  }
  return submitValues
}
