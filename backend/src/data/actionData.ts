import {db} from "./db.js"

async function getAction(): Promise<any[]> {
  return db('action').select()
}

async function getByIdAction(actionId: string): Promise<any | null> {
  const action = await db('action').select().where('id', actionId)
  if (action.length === 0) return null
  return action[0]
}

async function getByCodeAction(actionCode: string): Promise<any | null> {
  const action = await db('action').select().where('code', actionCode)
  if (action.length === 0) return null
  return action[0]
}

export default {
  getAction,
  getByIdAction,
  getByCodeAction,
}
