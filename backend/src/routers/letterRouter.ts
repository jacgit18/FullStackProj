import { letterController } from "../controllers/index.js";
import { RouterEntry, routerFactory } from "./util.js";

const letterRoutes: RouterEntry[] = [
  {
    method: 'post',
    route: '/project/:project_id/letter',
    controllerFn: letterController.createLetter
  },

  // {
  //   method: 'get',
  //   route: '/project/:project_id/letter/:id',
  //   controllerFn: letterController.getByIdLetter
  // },

  // {
  //   method: 'patch',
  //   route: '/project/:project_id/letter/:id',
  //   controllerFn: letterController.updateLetter
  // },
  // {
  //   method: 'get',
  //   route: '/project/:project_id/letter/',
  //   controllerFn: letterController.getLetters
  // },
]

export default routerFactory(letterRoutes)
