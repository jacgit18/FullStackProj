import express from 'express'
export const testHeaderProperty = 'test_id'

export const testIdFromHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const testHeader = req.headers[testHeaderProperty]
  //@ts-ignore
  req.test_id = testHeader
  next()
}