import { db } from "./db.js"


async function createCompany(company: any, returnFields: string[]){
  const createdCompany = await db('company').insert(company, returnFields)
  // only creating one company heres
  return createdCompany[0]
}

async function getByIdCompany(company_id: string, returnFields: string[]): Promise<any> {
  // @ts-ignore
  const companies: any[] = await db('company')
    .where("id", company_id)
    .select(returnFields)
  // only updated one company here
  return companies[0]
}




export default {
  createCompany,
  getByIdCompany

}

