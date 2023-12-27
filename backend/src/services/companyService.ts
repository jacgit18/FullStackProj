import { QueryParams } from "../controllers/req-data-validation/index.js";
import { companyData } from "../data/index.js";
import { columnsReturnedFromDbQuery } from "../model/Model.js";
import { Company } from '../model/index.js';

async function getByIdCompany(company_id: string): Promise<any> {
  // TODO need to get user ID from auth and add it as the created_by
  return await companyData.getByIdCompany(
    company_id,
    columnsReturnedFromDbQuery(Company.fieldDefinitions)
  )
}

async function getCompaniesForTfAdmin(filter: any, queryParams: QueryParams): Promise<any[]> {
  return await companyData.getCompaniesForTfAdmin(
    filter,
    queryParams,
    columnsReturnedFromDbQuery(Company.fieldDefinitions)
  )
}

async function getCompanies(userId: string, filter: any, queryParams: QueryParams): Promise<any[]> {
  return await companyData.getCompanies(
    userId,
    filter,
    queryParams,
    columnsReturnedFromDbQuery(Company.fieldDefinitions)
  )
}

async function updateCompany(updatedValues: any, company_id: string): Promise<any> {
  return companyData.updateCompany(
    updatedValues,
    {id: company_id},
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

async function getTicketSenderReceiverCompanyInfo(
  ticket_id: string,
  project_id: string
): Promise<any> {
  const sender = await companyData.getCompanyCreatedTicket(ticket_id)
  // NOTE: this just picks the first GC in the list of GCs on this project
  const receiver = await companyData.getProjectClientCompany(project_id)
  return {sender, receiver}
}



export default {
  getCompanies,
  getByIdCompany,
  getCompaniesForTfAdmin,
  updateCompany,
  createCompany,
  getTicketSenderReceiverCompanyInfo,
}
