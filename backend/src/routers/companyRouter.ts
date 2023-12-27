import { companyController } from "../controllers/index.js"
import { RouterEntry, routerFactory } from "./util.js"

const projectRoutes: RouterEntry[] = [
  {
    method: 'get',
    route: '/user/companies/:id',
    controllerFn: companyController.getByIdCompany
  },
  {
    method: 'get',
    route: '/user/companies',
    controllerFn: companyController.getCompanies
  },
  {
    method: 'patch',
    route: '/user/companies/:id',
    controllerFn: companyController.updateCompany
  },
  {
    method: 'post',
    route: '/company',
    controllerFn: companyController.createCompany,
  }
]

export default routerFactory(projectRoutes)
