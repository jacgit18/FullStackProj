import {JwtUserInfo} from "./jwtUtil.js"
import {adminAccess, AccessInfo, companyAccess, userIsTfAdmin, projectAccess, ProjectAccess} from "./util.js"
import companyData from "../data/companyData.js"

async function getCompanies(userInfo: JwtUserInfo): Promise<AccessInfo> {
  // check for admin access
  if (await userIsTfAdmin(userInfo.id)) {
    return {
      isAdmin: true,
      accessIds: [],
    }
  }
  // otherwise we ensure they have access to project
  const companyPermission = await companyAccess(userInfo.id)
  return {
    isAdmin: false,
    accessIds: companyPermission.map((c) => c.company_id)
  }
}

async function isAllowedToUpdateCompany(userInfo: JwtUserInfo, company_id: string): Promise<boolean> {
  const adminStatus = await adminAccess(userInfo.id)
  if (adminStatus[0]?.is_admin === true) {
    return true
  }
  // otherwise we ensure they are a company admin
  const companyPermission = await companyAccess(userInfo.id, company_id)
  return ((companyPermission.length > 0) && (companyPermission[0].company_user_role === 'admin'))
}

async function getTicketSenderReceiverCompanyInfo(
  user_id: string,
  company_id: string,
  project_id: string,
  ticket_id: string,
): Promise<boolean> {
  // superadmins are allowed
  if (await userIsTfAdmin(user_id)) return true
  const userProjectAccess = (await projectAccess(user_id, company_id, project_id))[0]
  if (!!userProjectAccess) {
    // GCs can see this information
    if (userProjectAccess.project_company_role === 'cm') {
      return true
    }
    // The only trade companies that can see this are ones that submitted it
    const companyThatCreated: any = await companyData.getCompanyCreatedTicket(ticket_id)
    return companyThatCreated?.id && companyThatCreated.id === company_id
  }
  return false
}

async function canGetSubcontractorsForProject(
  user_id: string,
  company_id: string,
  project_id: string
): Promise<ProjectAccess | null> {
  const projectPermission = await projectAccess(user_id, company_id, project_id)
  if(
    projectPermission.length > 0
    && projectPermission[0].project_company_role === 'cm'
    && projectPermission[0].project_user_role === 'pm'
  ) {
    return projectPermission[0]
  }
  return null
}


export default {
  getCompanies,
  isAllowedToUpdateCompany,
  getTicketSenderReceiverCompanyInfo,
  canGetSubcontractorsForProject,
}
