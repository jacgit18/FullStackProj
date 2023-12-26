import express from "express"
import { Letter } from '../model/index.js'
import { letterService } from "../services/index.js"
import { TfRequest } from "../types/express.js"
import { addErrorHandlingToController } from "../utils/error.js"
import { FieldSpecForValidation, validateFields, validateQueryParams } from "./req-data-validation/index.js"

// TODO DEV-147 incorporate authorization approach
async function createLetter(req: TfRequest, res: express.Response): Promise<void> {
  const fieldSpecsForValidation: FieldSpecForValidation[] = Letter.fieldDefinitions.map((fs) => {
    return {
      ...fs,
      cannotBeNull: fs.requiredForCreateRequest
    }
  })
  console.log("TEST")
  // validate inputs
  const validatedLetter = validateFields(
    {
      ...req.body,
      ...req.params
    },
    fieldSpecsForValidation
  )
  const createdLetter = await letterService.createLetter(validatedLetter)
  res.send(createdLetter)
}

// TODO DEV-147 incorporate authorization approach
 async function getByIdLetter(req: TfRequest, res: express.Response): Promise<void> {
  const fieldsForFilter: string[] = [
    'project_id',
    'id'
  ]
  const fieldSpecsForValidation: FieldSpecForValidation[] = Letter.fieldDefinitions.map((fs) => {
    return {
      ...fs,
      cannotBeNull: fieldsForFilter.includes(fs.name)
    }
  })

  // validate inputs
  const validatedFilter = validateFields(
    {
      ...req.params
    },
    fieldSpecsForValidation
  )
  const returnedLetter = await letterService.getByIdLetter(validatedFilter)
  res.send(returnedLetter)
}

// TODO DEV-147 incorporate authorization approach
async function updateLetter(req: TfRequest, res: express.Response): Promise<void> {
  const requiredFields: string[] = ['id', 'project_id']
  const fieldSpecsForValidation: FieldSpecForValidation[] = Letter.fieldDefinitions.map((fs) => {
    return {
      ...fs,
      cannotBeNull: requiredFields.includes(fs.name)
    }
  })
  // validate inputs
  const validatedInputs = validateFields(
    {
      ...req.body,
      ...req.params
    },
    fieldSpecsForValidation
  )
  const createdLetter = await letterService.updateLetter(validatedInputs)
  res.send(createdLetter)
}

// TODO DEV-147 incorporate authorization approach
async function getLetters(req: TfRequest, res: express.Response): Promise<void> {
  const requiredFields: string[] = ['project_id']
  const fieldSpecsForValidation: FieldSpecForValidation[] = Letter.fieldDefinitions
    .filter((fs) => requiredFields.includes(fs.name))
    .map((fs) => {
      return {
        ...fs,
        cannotBeNull: true
      }
    })
  const validatedInputs = validateFields(
    {project_id: req.params.project_id},
    fieldSpecsForValidation
  )
  const validatedQueryParams = validateQueryParams(req.query, Letter.fieldDefinitions)
  const letters = await letterService.getLetters(validatedInputs, validatedQueryParams)
  res.send(letters)
}

const exportDefault = {
  createLetter,
  getByIdLetter,
  updateLetter,
  getLetters,
}

export default addErrorHandlingToController(exportDefault)
