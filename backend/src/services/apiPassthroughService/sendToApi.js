import axios from "axios"

import config from "../../../config/config.js"

// This is just taking an endpoint from the php api and passing it through.
export default function sendToApi(company_id, token, request) {
  console.log("companyid", company_id)
  return new Promise(async (resolve, reject) => {
    // console.log("request.body", request.body)
    // console.log("request.method", request.method)
    // console.log("request.originalUrl", request.originalUrl)
    // console.log("request.params", request.params)
    // console.log("request.query", request.query)
    // console.log("request.token", request.token)
    // console.log("request.user", request.user)
    console.log("companyid", company_id)
    if (
      [
        "changeorder",
        "client",
        "company",
        "contact",
        "equipment",
        "labor",
        "material",
        "project",
        "ticket",
        "user",
      ].includes(company_id)
    ) {
      reject({ message: "Missing company id" })
    }

    const originalPath = request.originalUrl.replace(`/${company_id}`, "")
    const url = `https://${company_id}.${config.url.domain}${config.url.apiBase}${originalPath}`
    console.log("url", url)
    const axiosConfig = {
      data: request.body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: request.method.toLowerCase(),
      url: url,
      // params: request.query,
    }

    try {
      const response = await axios(axiosConfig).catch((error) => {
        if (error.response.status === 404) {
          throw new Error(`${error.config.url} not found`)
        }
        throw error
      })
      const { data } = response
      resolve(data)
    } catch (error) {
      reject(error.message)
    }
  })
}
