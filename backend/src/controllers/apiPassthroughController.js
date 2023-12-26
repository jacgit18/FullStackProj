import { apiPassthroughService } from "../services/index.js"

const sendToApi = (request, response, next) => {
  console.log("apiPassthroughController")
  apiPassthroughService
    .sendToApi(request.params.company_id, request.token, request)
    .then((result) => {
      return response.json(result)
    })
    .catch(next)
}

const apiPassthroughController = {
  sendToApi,
}

export default apiPassthroughController
