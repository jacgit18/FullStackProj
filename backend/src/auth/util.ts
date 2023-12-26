import {db} from "../data/db.js"
export interface AccessInfo {
  isAdmin: boolean,
  accessIds: string[]
}
export interface AdminAccess {
  id: string,
  is_admin: boolean,
}

export function adminAccess(userId: string): Promise<AdminAccess[]> {
  return db('tf_admin')
    .select(db.raw('tf_admin.tfuser_id AS id, TRUE AS is_admin'))
    .where('tf_admin.tfuser_id', userId)
    .andWhere(db.raw('tf_admin.deleted_at IS NULL'))
}

export async function userIsTfAdmin(user_id: string): Promise<boolean> {
  const adminStatus = await adminAccess(user_id)
  return !! adminStatus[0]?.is_admin
}

type CompanyUserRole = 'admin' | 'super' | 'crew'

type CompanyType = 'cm' | 'trade' | 'owner'

export interface CompanyAccess {
  id: string,
  company_id: string,
  company_type: CompanyType,
  company_user_role: CompanyUserRole,
}

export async function companyAccess(userId: string, companyId?: string): Promise<CompanyAccess[]> {
  const queryOutput: any = await db.raw(`
      SELECT
        u.id,
        cu.company_id,
        c.company_type,
        cur.code AS company_user_role
      FROM tfuser u
      INNER JOIN company_user cu ON cu.tfuser_id = u.id
      INNER JOIN company_user_role cur ON cur.id = cu.company_user_role_id
      INNER JOIN company c ON c.id = cu.company_id
      WHERE u.id = ?
        AND cu.deleted_at IS NULL
        ${companyId === undefined? '' : `AND cu.company_id = ?`}
      ;
    `,
    companyId === undefined? [userId] : [userId, companyId]
  )
  return queryOutput.rows
}

type ProjectCompanyRole = 'owner' | 'cm' | 'trade'

type ProjectUserRole = 'pm' | 'super' | 'crew'

export interface ProjectAccess {
  id: string,
  company_id: string,
  company_type: CompanyType,
  project_id: string,
  project_user_id: string,
  project_company_role: ProjectCompanyRole,
  project_user_role: ProjectUserRole,
}

export async function projectAccess(userId: string, companyId: string, projectId?: string): Promise<ProjectAccess[]> {
  const queryOutput: any = await db.raw(`
      SELECT
        u.id,
        cu.company_id,
        c.company_type,
        pc.project_id,
        pu.id AS project_user_id,
        pcr.code AS project_company_role,
        pur.code AS project_user_role
      FROM tfuser u
      INNER JOIN company_user cu ON cu.tfuser_id = u.id
      INNER JOIN project_company pc ON pc.company_id = cu.company_id
      INNER JOIN project_company_role pcr ON pcr.id = pc.project_company_role_id
      INNER JOIN project_user pu ON
        pu.project_id = pc.project_id
        AND pu.company_id = pc.company_id
        AND pu.tfuser_id = cu.tfuser_id
      INNER JOIN project_user_role pur ON pur.id = pu.project_user_role_id
      INNER JOIN company c ON c.id = cu.company_id
      WHERE u.id = ?
        AND cu.company_id = ?
        AND cu.deleted_at IS NULL
        AND pc.deleted_at IS NULL
        AND pu.deleted_at IS NULL
        ${projectId === undefined? '' : `AND pc.project_id = ?`}
      ;
    `,
    projectId === undefined? [userId, companyId] : [userId, companyId, projectId]
  )
  return queryOutput.rows
}

export async function createTfAdminProjectAccess(
  userId: string,
  companyId: string,
  projectId: string
): Promise<ProjectAccess | null> {
  const {rows} = await db.raw(`
      SELECT
        pc.company_id,
        c.company_type,
        pc.project_id,
        pcr.code AS project_company_role
      FROM  project_company pc
      INNER JOIN project_company_role pcr ON pcr.id = pc.project_company_role_id
      INNER JOIN company c ON c.id = pc.company_id
      WHERE pc.company_id = ? AND pc.project_id = ?
        AND pc.deleted_at IS NULL
      ;
    `,
    [companyId, projectId]
  )
  if (rows.length === 0) {
    return null
  }
  const data = rows[0]
  return {
    id: userId,
    company_id: data.company_id,
    company_type: data.company_type,
    project_id: data.project_id,
    project_user_id: '',
    project_company_role: data.project_company_role,
    project_user_role: 'pm',
  }
}

export interface CreatedTicketInfo {
  project_id: string,
  company_id: string,
  user_id: string,
}

export async function createdTicketInfo(ticket_id: string): Promise<CreatedTicketInfo | null> {
  const {rows} = await db.raw(`
    SELECT
      pu.company_id AS company_id,
      pu.project_id AS project_id,
      pu.tfuser_id AS user_id
    FROM ticket t
    INNER JOIN project_user pu ON pu.id = t.created_by_project_user
    WHERE t.id = ?
    ;
  `, [ticket_id])
  if (rows.length === 0) {
    return null
  }
  return rows[0]
}

// This creates a "fake" ProjectAccess object for superadmins, to simplify how we treat users
export async function projectAccessForSuperadmins(
  userId: string, companyId: string, projectId: string
): Promise<ProjectAccess | null> {
  if (await userIsTfAdmin(userId)) {
    return createTfAdminProjectAccess(userId, companyId, projectId)
  }
  return (await projectAccess(userId, companyId, projectId))[0]
}
