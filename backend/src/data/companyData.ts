import { db } from "./db.js"


async function createCompany(company: any, returnFields: string[]){
  const createdCompany = await db('company').insert(company, returnFields)
  // only creating one company heres
  return createdCompany[0]
}



export default {
  createCompany,

}

