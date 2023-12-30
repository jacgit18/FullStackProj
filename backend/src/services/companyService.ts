import { companyData } from "../data/index.js";
import { columnsReturnedFromDbQuery } from "../model/Model.js";
import { Company } from '../model/index.js';

async function getByIdCompany(company_id: string): Promise<any> {
  // TODO DEV-77 need to get user ID from auth and add it as the created_by
  return await companyData.getByIdCompany(
    company_id,
    columnsReturnedFromDbQuery(Company.fieldDefinitions)
  )
}

async function createCompany(company: any, user_id: string): Promise<any> {
  company.date_created = new Date()
  company.created_by = user_id

  const createdCompany = await companyData.createCompany(
    company,
    columnsReturnedFromDbQuery(Company.fieldDefinitions)
  )

  createdCompany.company_user_role = "admin"

  return createdCompany
}




export default {
  createCompany,
  getByIdCompany
}
