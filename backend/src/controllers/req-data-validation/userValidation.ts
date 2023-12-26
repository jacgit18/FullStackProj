import { companyAccess, projectAccess } from "../../auth/util.js";
import { db } from "../../data/db.js";
import { HttpError } from "../../utils/error.js";

export async function validateUserRoleForCompany(company_id: string, company_user_role_id: number): Promise<void> {
  const company = await db('company').where('id', company_id).select()

  const company_user_role = await db('company_user_role').where('id', company_user_role_id).select()
  
  if(company.length === 0 || company_user_role.length === 0){
    throw new HttpError(400, 'Invalid company or user role id.')
  }

  if(company[0].company_type === "cm" && company_user_role[0].code === "crew"){
    throw new HttpError(400, 'GCs are not allowed to create crew members')
  }
}


export async function validateUserExistsInCompany(user_id: string, company_id: string, project_id: string): Promise<void> {
  // Check if the user already exists in the company
  const companyPermission = await companyAccess(user_id, company_id)
  if ((companyPermission.length === 0)){
    throw new HttpError(400, 'Cannot add user not in company to project')
  }

  const existsInProject = await projectAccess(user_id, company_id, project_id)
  if (existsInProject.length > 0){
    throw new HttpError(400, 'User already in project')
  }
}