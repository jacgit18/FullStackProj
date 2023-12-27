import express from 'express'
export const companyHeaderProperty = 'company_id'

export const companyIdFromHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const companyHeader = req.headers[companyHeaderProperty]
  //@ts-ignore
  req.company_id = companyHeader
  next()
}


// export const testHeaderProperty = 'test_id'

// export const testIdFromHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   const testHeader = req.headers[testHeaderProperty]
//   console.log(testHeader)
//   //@ts-ignore
//   req.test_id = testHeader
//   next()
// }