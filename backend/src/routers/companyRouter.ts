import { companyController } from "../controllers/index.js"
import { RouterEntry, routerFactory } from "./util.js"

const projectRoutes: RouterEntry[] = [
  {
    method: 'post',
    route: '/company',
    controllerFn: companyController.createCompany,
  }
]

export default routerFactory(projectRoutes)
