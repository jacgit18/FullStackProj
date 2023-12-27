const axios = require("axios")

export async function getResponseData(page) {
  try {
    let response = await axios.get(page) //"https://ar7qnmiycq.us-east-1.awsapprunner.com/project" + page)
    return response.data
  } catch (error) {
    console.log("error", error)
  }
}
