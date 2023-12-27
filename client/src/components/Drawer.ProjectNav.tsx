import {ProjectUserRoleCode} from "../util/permissionTypes"
import {CompanyType} from "../types/company"
// @ts-ignore
import ticketsIcon from "../assets/icon-tickets.svg"
// @ts-ignore
import manageIcon from "../assets/icon-manage.svg"

const crewProjectNavItems = (projectId: string, t: any): any[] => {
  return [
    {
      icon: ticketsIcon,
      route: `/0/project/${projectId}/tickets`,
      text: t("Tickets"),
    }
  ]
}

const allProjectNavItems = (projectId: string, t: any): any[] => {
  return crewProjectNavItems(projectId, t).concat(
    [
      {
        icon: manageIcon,
        route: `/0/project/${projectId}/settings`,
        text: t("Manage_Project"),
      }
    ]
  )
}

export const projectNavItems = (
  companyType: CompanyType,
  projectUserRole: ProjectUserRoleCode,
  projectId: string,
  t: any
): any[] => {
  if (projectUserRole === 'crew') return crewProjectNavItems(projectId, t)
  if (companyType === 'cm' || companyType === 'trade') return allProjectNavItems(projectId, t)
  return []
}
