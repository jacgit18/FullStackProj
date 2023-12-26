import express from "express"
import auth from "../auth/userAuth.js"
import { CompanyUser, User } from "../model/index.js"
import { userService } from "../services/index.js"
import { TfRequest } from "../types/express.js"
import { addErrorHandlingToController } from "../utils/error.js"
import { FieldSpecForValidation, validateCompanyId, validateFields } from "./req-data-validation/index.js"
import { validateUserRoleForCompany } from "./req-data-validation/userValidation.js"

async function createUser(req: TfRequest, res: express.Response): Promise<void> {
  const {company_id} = validateCompanyId(req.params.id)
  const isAllowedToCreateUser = await auth.isAllowedToCreateUser(req.user, company_id)

  if(isAllowedToCreateUser){
    const fieldSpecsForValidation: FieldSpecForValidation[] = User.fieldDefinitions.map((fs) => {
      return {
        ...fs,
        cannotBeNull: fs.requiredForCreateRequest
      }
    })

    const companyUserfieldSpecsForValidation: FieldSpecForValidation[] = CompanyUser.fieldDefinitions.map((fs) =>{
      return {
        ...fs,
        cannotBeNull: fs.requiredForCreateRequest
      }
    })
    // validate inputs
    const validatedUser = validateFields(
      req.body,
      fieldSpecsForValidation
    )

    // missing tfuser_id but this will be added in service
    const validatedCompanyUser = validateFields(
      req.body,
      companyUserfieldSpecsForValidation
    )

    await validateUserRoleForCompany(company_id, validatedCompanyUser.company_user_role_id as number)

    validatedCompanyUser.company_id = company_id

    const createdUser = await userService.createUser(validatedUser, validatedCompanyUser, req.user)
    res.send(createdUser)
  }
  else {
    // otherwise not authorized
    res.status(401).send("Not authorized to perform this action.")
  }
}

async function getCompanyUsers(req: TfRequest, res: express.Response): Promise<void> {
  const { company_id } = validateCompanyId(req.params.id)
  const canAccessCompanyUsers = await auth.getCompanyUsers(req.user, company_id)
  if (canAccessCompanyUsers) {
    const returnedCompanyUsers = await userService.getCompanyUsers(company_id)
    res.send(returnedCompanyUsers)
  }
  else {
    // otherwise not authorized
    res.status(401).send("Not authorized to access company.")
  }
}

async function updatePassword(req: TfRequest, res: express.Response): Promise<void> {
  const requiredFields: string[] = ["password"]
  const fieldSpecsForValidation: FieldSpecForValidation[] = User.fieldDefinitions
    .filter((fs) => requiredFields.includes(fs.name))
    .map((fs) => {
      return {
        ...fs,
        cannotBeNull: true
      }
    })
  const { password: validatedPassword } = validateFields(
    req.body, fieldSpecsForValidation
  )
  // generate new credentials and send back to frontend
  const newCreds = await userService.updatePasswordAndLogin(req.user.email, validatedPassword as string)
  res.send(newCreds)
}




const exportDefault = {
  createUser,
  getCompanyUsers,
  updatePassword,
}

export default addErrorHandlingToController(exportDefault)
