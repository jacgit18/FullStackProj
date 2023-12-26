import {db, whereBuilder} from "./db.js"
import {QueryParams} from "../controllers/req-data-validation/index.js"
import {updateFilterForQueryParams, paginationForQuery, updateFilterForTableName} from "./util.js"

async function getByIdCompany(company_id: string, returnFields: string[]): Promise<any> {
  // @ts-ignore
  const companies: any[] = await db('company')
    .where("id", company_id)
    .select(returnFields)
  // only updated one company here
  return companies[0]
}

async function getCompaniesForTfAdmin(
  filter: any | null,
  queryParams: QueryParams,
  returnFields: string[]
): Promise<any[]> {
  // need to update filter for query params
  const updatedFilter: any = updateFilterForQueryParams(filter, queryParams)
  return paginationForQuery(queryParams.limit, queryParams.page,
    db('company')
      .where(whereBuilder(updatedFilter))
      .select(returnFields)
      .select(db.raw(`'admin' AS company_user_role`))
      .orderBy('company.name')
  )
}

async function getCompanies(
  userId: string,
  filter: any | null,
  queryParams: QueryParams,
  returnFields: string[]
): Promise<any[]> {
  // need to update filter for query params
  const updatedFilter: any = updateFilterForTableName('company', updateFilterForQueryParams(filter, queryParams))
  return paginationForQuery(queryParams.limit, queryParams.page,
    db('company')
      .leftJoin('company_user', 'company_user.company_id', 'company.id')
      .leftJoin('company_user_role', 'company_user_role.id', 'company_user.company_user_role_id')
      .where('company_user.tfuser_id', userId)
      .where(whereBuilder(updatedFilter))
      .select(returnFields.map((f: string) => 'company.' + f))
      .select(db.raw(`company_user_role.code AS company_user_role`))
      .orderBy('company.name')
  )
}

async function updateCompany(updatedValues: any, filter: any, returnFields: string[]): Promise<any> {
  const updatedCompany: any = await db('company').where(filter).update(updatedValues, returnFields)
  return updatedCompany[0]
}

async function createCompany(company: any, returnFields: string[]){
  const createdCompany = await db('company').insert(company, returnFields)
  // only creating one company heres
  return createdCompany[0]
}

async function getCompanyCreatedTicket(ticket_id: string): Promise<any> {
  const companyThatCreatedTicket: any[] = await db('ticket')
    .innerJoin('project_user', 'project_user.id', 'ticket.created_by_project_user')
    .innerJoin('company', 'company.id', 'project_user.company_id')
    .where('ticket.id', ticket_id)
    .select([
      'company.id',
      'company.name',
      'company.address',
      'company.logo_url',
      'company.phone',
    ])
  return companyThatCreatedTicket[0]
}

// NOTE: this just picks the first GC in the list of GCs on this project
async function getProjectClientCompany(project_id: string): Promise<any> {
  const companyThatReceivedTicket: any[] = await db('project_company')
    .innerJoin('company', 'company.id', 'project_company.company_id')
    .innerJoin(
      'project_company_role',
      'project_company_role.id',
      'project_company.project_company_role_id'
    )
    .where('project_company.project_id', project_id)
    .where('project_company_role.code', 'cm')
    .select([
      'company.id',
      'company.name',
      'company.address',
      'company.logo_url',
      'company.phone',
    ])
  return companyThatReceivedTicket[0]
}


async function getSubcontractorsForProject(project_id: string): Promise<any> {
  return db('project_company')
    .innerJoin('company', 'company.id', 'project_company.company_id')
    .innerJoin(
      'project_company_role',
      'project_company_role.id',
      'project_company.project_company_role_id'
    )
    .where('project_company.project_id', project_id)
    .where('project_company_role.code', 'trade')
    .select([
      'company.id',
      'company.name',
      'project_company_role.code AS project_company_role',
    ])
}


export default {
  getCompanies,
  getByIdCompany,
  getCompaniesForTfAdmin,
  updateCompany,
  createCompany,
  getCompanyCreatedTicket,
  getProjectClientCompany,
  getSubcontractorsForProject,
}

