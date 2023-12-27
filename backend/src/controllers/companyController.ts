import express from "express"
import auth from "../auth/companyAuth.js"
import { userIsTfAdmin } from "../auth/util.js"
import { Company } from '../model/index.js'
import { companyService } from "../services/index.js"
import { TfRequest } from "../types/express.js"
import { addErrorHandlingToController } from "../utils/error.js"
import {
  FieldSpecForValidation,
  validateCompanyId,
  validateFields,
  validateQueryParams
} from "./req-data-validation/index.js"

async function getByIdCompany(req: TfRequest, res: express.Response): Promise<void> {
  const accessInfo = await auth.getCompanies(req.user)
  if(accessInfo.isAdmin || accessInfo.accessIds.filter( id => id === req.params.id).length > 0){
    const fieldsForFilter: string[] = [
      'id',
    ]
    const fieldSpecsForValidation: FieldSpecForValidation[] = Company.fieldDefinitions.map((fs) => {
      return {
        ...fs,
        cannotBeNull: fieldsForFilter.includes(fs.name)
      }
    })

    // validate inputs
    const validatedFilter = validateFields(
      req.params,
      fieldSpecsForValidation
    )
    const returnedCompany = await companyService.getByIdCompany(validatedFilter.id as string)
    res.send(returnedCompany)
  }
  else {
    // otherwise not authorized
    res.status(401).send("Not authorized to access company.")
  }



}

async function getCompanies(req: TfRequest, res: express.Response): Promise<void> {
  const accessInfo = await auth.getCompanies(req.user)
  // TF admins have their own data query
  if (accessInfo.isAdmin) {
    const companies = await companyService.getCompaniesForTfAdmin({}, validateQueryParams(req.query, Company.fieldDefinitions))
    res.send(companies)
    return
  }
  if (accessInfo.accessIds.length > 0) {
    const filter: any = {id: accessInfo.accessIds}
    const companies = await companyService.getCompanies(
      req.user.id,
      filter,
      validateQueryParams(req.query, Company.fieldDefinitions)
    )
    res.send(companies)
    return
  }
  // otherwise returns an empty list
  res.send([])
}

async function updateCompany(req: TfRequest, res: express.Response): Promise<void> {
  const {company_id} = validateCompanyId(req.params.id)
  const isAllowedToUpdateCompany = await auth.isAllowedToUpdateCompany(req.user, company_id)

  if(isAllowedToUpdateCompany){
    const fieldSpecsForValidation: FieldSpecForValidation[] = Company.fieldDefinitions.filter((fs) =>
      fs.canBeModifiedByUser
    ).map((fs) => {
      return {
        ...fs,
        cannotBeNull: false
      }
    })

    // validate inputs
    const validatedCompany = validateFields(
      req.body,
      fieldSpecsForValidation
    )

    const updatedCompany = await companyService.updateCompany(validatedCompany, company_id)
    res.send(updatedCompany)
  }
  else {
    // otherwise not authorized
    res.status(401).send("Not authorized to perform this action.")
  }
}
async function createCompany(req: TfRequest, res: express.Response): Promise<void> {
  const isSuperAdmin = await userIsTfAdmin(req.user.id)
  
  if(isSuperAdmin){
    const fieldSpecsForValidation: FieldSpecForValidation[] = Company.fieldDefinitions.map((fs) => {
      return {
        ...fs,
        cannotBeNull: fs.requiredForCreateRequest
      }
    })
     
    // validate inputs
    const validatedCompany = validateFields(
      req.body,
      fieldSpecsForValidation
    )
    
    const newCompany = await companyService.createCompany(validatedCompany, req.user.id)
    res.send(newCompany)
  }
  else {
    // otherwise not authorized
    res.status(401).send("Not authorized to perform this action.")
  }

}



const exportDefault = {
  getCompanies,
  getByIdCompany,
  updateCompany,
  createCompany,

}

export default addErrorHandlingToController(exportDefault)
