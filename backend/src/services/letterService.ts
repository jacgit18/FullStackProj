import { letterData } from "../data/index.js";
import { Letter } from '../model/index.js';
// import {HttpError} from "../utils/error.js";
import { QueryParams } from "../controllers/req-data-validation/index.js";
import { UpdateLetterFilter } from "../data/letterData.js";
import { columnsReturnedFromDbQuery, filterForModifiableFields } from "../model/Model.js";

async function createLetter(letter: any): Promise<any> {
  // TODO 
  // add generated fields
  letter.date_created = new Date()
  letter.date_modified = new Date()
  return await letterData.createLetter(letter, columnsReturnedFromDbQuery(Letter.fieldDefinitions))
}


async function getByIdLetter(letterFilter: any): Promise<any> {
  // TODO 
  return await letterData.getByIdLetter(
    letterFilter,
    columnsReturnedFromDbQuery(Letter.fieldDefinitions)
  )
}


async function updateLetter(letter: any): Promise<any> {
  // TODO 
  // filter out fields they dont have access to
  const modifiableLetterFields: any = filterForModifiableFields(letter, Letter.fieldDefinitions)
  // update when letter has been modified
  modifiableLetterFields.date_modified = new Date()
  // Create the filter for which letter we want to update
  const updateLetterFilter: UpdateLetterFilter = {
    project_id: letter.project_id,
    id: letter.id
  }
  return await letterData.updateLetter(
    modifiableLetterFields,
    updateLetterFilter,
    columnsReturnedFromDbQuery(Letter.fieldDefinitions)
  )
}

async function getLetters(filter: any, queryParams: QueryParams): Promise<any[]> {
  return await letterData.getLetters(
    filter,
    queryParams,
    columnsReturnedFromDbQuery(Letter.fieldDefinitions)
  )
}

export default {
  createLetter,
  getByIdLetter,
  updateLetter,
  getLetters,
}
