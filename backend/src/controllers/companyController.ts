import express from "express"
import { companyService } from "../services/index.js"
import { TfRequest } from "../types/express.js"
import { addErrorHandlingToController } from "../utils/error.js"


async function createCompany(req: TfRequest, res: express.Response): Promise<void> {
  console.log(req.body)
  const newCompany = await companyService.createCompany(req.body, req.user.id);
  res.send(newCompany);
}

export default addErrorHandlingToController({ createCompany });