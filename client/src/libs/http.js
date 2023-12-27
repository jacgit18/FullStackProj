import axios from "axios"

const axiosSettings = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
}

const http = axios.create(axiosSettings)

export default http
