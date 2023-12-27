import axios from "axios"
import store from "../store"
import config from "./config"

const axiosSettings = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000,
}

const api = axios.create(axiosSettings)

let state

const handleChange = () => {
  state = store.getState()
}

store.subscribe(handleChange)

api.interceptors.request.use(
  function (axiosConfig) {
    // update with api base url
    axiosConfig.url = `${config.api.url}${axiosConfig.url}`
    // add user token if we have it
    if (state.user?.token) {
      axiosConfig.headers.Authorization = `Bearer ${state.user.token}`
    }
    // add company id if we have it
    if (state.company?.id) {
      axiosConfig.headers.company_id = state.company.id
    }
    return axiosConfig
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default api
