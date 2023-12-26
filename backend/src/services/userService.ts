import { v4 as createUuid } from "uuid"
import { userData } from "../data/index.js"
import authService from "./authService.js"
// import { sendInviteNewUserEmail } from "../utils/email.js"
import companyData from "../data/companyData.js"
import { db } from "../data/db.js"

// async function sendNewUserEmail(createdUser: any, inviter: any, company_id: string){
//     const userName = `${createdUser.first_name} ${createdUser.last_name}`
//     const inviterName = `${inviter.first_name} ${inviter.last_name}`
//     const currCompany = await companyService.getByIdCompany(company_id)
//     // give them 7 days to sign-in
//     const jwt: string = generateJwt(createdUser, '7d')
//     sendInviteNewUserEmail(createdUser.email, jwt, currCompany.name, inviterName, userName)
// }

async function createUser(user: any, companyUser: any, inviter: any): Promise<any> {
  // add generated fields
  user.date_created = new Date()
  user.date_modified = new Date()
  user.password = createUuid() // fake password

  const createdUser = await userData.createUser(user)
  companyUser.tfuser_id = createdUser.id
  await userData.createUserCompanyConnection(companyUser)

  // TODO  If an email to create a user fails we need to delete the user and company connection
  // await sendNewUserEmail(createdUser, inviter, companyUser.company_id)

  const company_user_role = await db('company_user_role').where('id', companyUser.company_user_role_id).select()
  createdUser.company_user_role_code = company_user_role[0].code
  return createdUser
}


async function getCompanyUsers(company_id: string): Promise<any[]> {
  return userData.getCompanyUsers(company_id)
}
async function updatePasswordAndLogin(email: string, newPassword: string): Promise<any[]> {
  // update password then generate new credentials
  await userData.updatePassword(email, newPassword)
  return await authService.createJwtForAuthenticatedUser({ email, password: newPassword })
}

async function getProjectUsers(project_id: string, company_id: string): Promise<any[]> {
  return userData.getProjectUsers(project_id, company_id)
}

async function getCompanyUsersNotInProject(company_id: string, project_id: string): Promise<any[]> {
  return await userData.getCompanyUsersNotInProject(company_id, project_id)
}

async function getProjectClients(project_id: string): Promise<any[]> {
  // Get client for this project
  const clientCompany = await companyData.getProjectClientCompany(project_id)
  return userData.getProjectUsers(project_id, clientCompany.id)
}

export default {
  createUser,
  getCompanyUsers,
  updatePasswordAndLogin,
  getProjectUsers,
  getCompanyUsersNotInProject,
  getProjectClients
}
