import {db, whereBuilder} from "./db.js"
import {QueryParams} from "../controllers/req-data-validation/index.js"
import {paginationForQuery, updateFilterForQueryParams} from "./util.js"

async function createLetter(letter: any, returnFields: string[]): Promise<any> {
  const createdLetters = await db('letter').insert(letter, returnFields)
  // only creating one letter here
  return createdLetters[0]
}


export interface GetByIdLetterFilter {
  project_id: string,
  id: string
 }

async function getByIdLetter(filter: GetByIdLetterFilter, returnFields: string[]): Promise<any> {
  // @ts-ignore
  const letters: any[] = await db('letter')
    .where(filter)
    .select(returnFields)
  // only updated one letter here
  return letters[0]
  }

export interface UpdateLetterFilter {
  project_id: string,
  id: string
}

async function updateLetter(letter: any, filter: UpdateLetterFilter, returnFields: string[]): Promise<any> {
  // TODO DEV-167 need to check that this letter's id exists before attempting to patch, throw if not
  // @ts-ignore
  const updatedLetters: any[] = await db('letter').where(filter).update(letter, returnFields)
  // only updated one letter here
  return updatedLetters[0]
}

async function getLetters(filter: any, queryParams: QueryParams, returnFields: string[]): Promise<any[]> {
  // need to update filter for query params
  const updatedFilter: any = updateFilterForQueryParams(filter, queryParams)
  const letters: any[] = await paginationForQuery(queryParams.limit, queryParams.page,
    db('letter')
      .where(whereBuilder(updatedFilter))
      .select(returnFields)
      .orderBy('letter.id')
  )
  return letters
}

export default {
  createLetter,
  getByIdLetter,
  updateLetter,
  getLetters,
}
