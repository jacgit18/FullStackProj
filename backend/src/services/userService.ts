import { v4 as createUuid } from "uuid"
import { db } from "../data/db.js"
import { userData } from "../data/index.js"
import authService from "./authService.js"

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



export default {
  createUser,
  getCompanyUsers,
  updatePasswordAndLogin,

}
