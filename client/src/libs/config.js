const apiUrl = `${process.env.REACT_APP_API_BASE_URL}`
const authenticationUrl = `${apiUrl}/login`
// REACT_APP_URL=https://tracfloapp.local
// REACT_APP_URL=https://tracfloapp.com
// REACT_APP_BASE_URL=tracfloapp.com
// API_BASE_URL=http://localhost:8080/v2
const config = {
  env: process.env.NODE_ENV,
  api: {
    // path: apiPath,
    node: process.env.REACT_APP_NODE_API,
    url: `${apiUrl}`,
  },
  auth: {
    newPassword: `${apiUrl}/password`,
    resetPassword: `${apiUrl}/reset-password`,
    login: `${authenticationUrl}/auth`, //login using v2.
    refresh: `${authenticationUrl}/auth/refresh`,
    revoke: `${authenticationUrl}/auth/revoke`,
    validate: `${authenticationUrl}/auth/validate`,
    url: authenticationUrl,
  },
  app: {
    domain: process.env.REACT_APP_BASE_URL,
    url: process.env.REACT_APP_URL,
  },
}

export default config
