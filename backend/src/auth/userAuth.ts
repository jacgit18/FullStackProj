import { JwtUserInfo } from "./jwtUtil.js"
import {adminAccess, projectAccess, companyAccess, userIsTfAdmin} from "./util.js"

async function getProjectUsers(userInfo: JwtUserInfo, project_id: string, company_id: string): Promise<boolean> {
  if (await userIsTfAdmin(userInfo.id)) {
    return true
  }
  const projectPermission = await projectAccess(userInfo.id, company_id, project_id)
  return projectPermission.length > 0
}

//if you are part of this company and not crew == true
async function getCompanyUsers(userInfo: JwtUserInfo, company_id: string): Promise<boolean> {
  if (await userIsTfAdmin(userInfo.id)) {
    return true
  }
  // otherwise we ensure they have access to company
  const companyPermission = await companyAccess(userInfo.id, company_id)
  return companyPermission.length > 0
}

async function isAllowedToCreateUser(userInfo: JwtUserInfo, company_id: string): Promise<boolean> {
  if (await userIsTfAdmin(userInfo.id)) {
    return true
  }
  // otherwise we ensure they are a company admin
  const companyPermission = await companyAccess(userInfo.id, company_id)
  return ((companyPermission.length > 0) && (companyPermission[0].company_user_role === 'admin'))
}

async function addProjectUser(user_id: string, company_id: string, project_id: string): Promise<boolean> {
  if (await userIsTfAdmin(user_id)) {
    return true
  }
  // otherwise we ensure they are a project manager or super
  const projectPermission = await projectAccess(user_id, company_id, project_id)
  return ((projectPermission.length > 0) && (projectPermission[0].project_user_role !== 'crew'))
}

async function canAccessCompanyUsersNotInProject(userInfo: JwtUserInfo, company_id: string, project_id: string): Promise<boolean> {
  if (await userIsTfAdmin(userInfo.id)) {
    return true
  }
  // otherwise we ensure they have access to company and project
  const projectPermission = await projectAccess(userInfo.id, company_id, project_id)
  return ((projectPermission.length > 0) && (projectPermission[0].project_user_role !== "crew"))
}

async function getProjectClients(userId: string, companyId: string, projectId: string): Promise<boolean> {
  if (await userIsTfAdmin(userId)) {
    return true
  }
  // ensure that they have project access, and that they are a sub
  const projectPermission = (await projectAccess(userId, companyId, projectId))[0]
  return !!projectPermission && projectPermission.project_company_role === 'trade'
}

export default {
  getCompanyUsers,
  getProjectUsers,
  isAllowedToCreateUser,
  addProjectUser,
  canAccessCompanyUsersNotInProject,
  getProjectClients,
}
