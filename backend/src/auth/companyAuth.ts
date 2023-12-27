import { JwtUserInfo } from "./jwtUtil.js"
import { AccessInfo, adminAccess, companyAccess, userIsTfAdmin } from "./util.js"

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




export default {
  getCompanies,
  isAllowedToUpdateCompany,
}
