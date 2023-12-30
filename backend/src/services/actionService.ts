import actionData from "../data/actionData.js"


async function getAction(): Promise<any[]> {
  return actionData.getAction()
}


export default {
  getAction
}
