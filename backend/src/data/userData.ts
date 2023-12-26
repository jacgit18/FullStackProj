import { db } from "./db.js"

// We're not using filters and query params - no reason for it at the moment.
async function getCompanyUsers(company_id: string): Promise<any[]> {
  return db('tfuser AS u')
      .select('u.id', 'u.first_name', 'u.last_name', 'u.email', 'u.phone', 'cur.code AS company_user_role_code')
      .innerJoin('company_user AS cu', 'u.id', '=', 'cu.tfuser_id')
      .innerJoin('company_user_role AS cur', 'cu.company_user_role_id', '=', 'cur.id')
      .where('cu.company_id', company_id)
      .orderBy('cu.company_user_role_id')
}

async function createUser(userObject: any): Promise<any> {
  const createdUsers = await db.raw(`
      INSERT INTO tfuser (email, password, first_name, last_name, phone, avatar_url, date_created, date_modified)
      VALUES (
        :email,
        crypt(:password, gen_salt('md5')),
        :first_name,
        :last_name,
        :phone,
        :avatar_url,
        :date_created,
        :date_modified
      )
      RETURNING *
      ;
    `,
    userObject
  )
  return createdUsers.rows[0]
}

async function createUserCompanyConnection(companyUser: any): Promise<any> {
  const createdUserCompanyConnection = await db('company_user').insert(companyUser)
  return createdUserCompanyConnection[0]
}

async function getUserByEmail(email: string): Promise<any> {
  const users = await db('tfuser').select('*').where('email', email)
  return users[0]
}

async function updatePassword(email: string, newPassword: string): Promise<void> {
  await db.raw(`
      UPDATE tfuser
      SET password = crypt(:newPassword, gen_salt('md5'))
      WHERE email = :email
      ;
    `,
    { email, newPassword }
  )
}

// NOTE: this was encapsulated in order to allow composability across multiple data methods
function getProjectUsersQuery(project_id: string, company_id: string): any {
  return db('tfuser AS u')
    .select("u.first_name", "u.last_name", "u.email", "u.phone", "pur.code AS project_user_role_code", "u.id")
    .innerJoin("project_user AS pu", "u.id", "=", "pu.tfuser_id")
    .innerJoin("project_user_role AS pur", "pu.project_user_role_id", "=", "pur.id")
    .where("pu.company_id", company_id)
    .where("pu.project_id", project_id)
    .orderBy('pu.project_user_role_id')
}

async function getProjectUsers(project_id: string, company_id: string): Promise<any[]> {
  return getProjectUsersQuery(project_id, company_id)
}

async function getProjectUserByID(project_id: string, company_id: string, user_id: string): Promise<any> {
  //@ts-ignore
  const user = await getProjectUsersQuery(project_id, company_id).where("u.id", user_id)
  return user[0]
}

async function getCompanyUsersNotInProject(company_id: string, project_id: string): Promise<any> {
  const {rows: usersNotInProject} = await db.raw(`
      SELECT
        u.email,
        u.first_name,
        u.last_name,
        u.id
      FROM tfuser u
      INNER JOIN company_user cu ON cu.tfuser_id = u.id
      LEFT JOIN (
	      SELECT *
	      FROM project_user
	      WHERE project_user.project_id = ?
      ) pu ON pu.tfuser_id = u.id AND pu.company_id = cu.company_id
      WHERE cu.company_id = ?
	      AND pu.project_id IS NULL
      ;
    `,
    [project_id, company_id]
  )
  return usersNotInProject
}


export default {
  createUser,
  getUserByEmail,
  updatePassword,
  getProjectUsers,
  getProjectUserByID,
  getCompanyUsers,
  createUserCompanyConnection,
  getCompanyUsersNotInProject
}
