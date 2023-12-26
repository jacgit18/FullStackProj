import { db } from "./db.js"

export interface LoginCreds {
  email: string,
  password: string,
}

async function validateUserCredentials(userCreds: LoginCreds): Promise<any> {
  return db("tfuser")
    .select()
    .where(db.raw(`password=crypt(?, password)`, [userCreds.password]))
    .where("email", userCreds.email)
}

export default {validateUserCredentials}
