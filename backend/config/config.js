import dotenv from "dotenv"

dotenv.config()

const environment = process.env.NODE_ENV
const forTesting = process.env.FOR_TESTING === 'y'
const apiPath = `${process.env.API_BASE}${process.env.API_PATH}`
const authenticationUrl = `${process.env.URL}${apiPath}/login`
const dbName = forTesting ? process.env.TEST_DB_NAME : process.env.DB_NAME

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  AWS_FILE_BUCKET: process.env.AWS_FILE_BUCKET,
  DB_NAME_DYNAMO: process.env.DB_NAME_DYNAMO,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: dbName,
  TESTING: forTesting,
  env: environment,
  url: {
    apiBase: process.env.API_BASE,
    api: apiPath,
    app: process.env.REACT_APP_URL,
    auth: authenticationUrl,
    domain: process.env.BASE_URL,
  },
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  agave: {
    url: process.env.AGAVE_URL,
    client_id: process.env.AGAVE_CLIENT_ID,
    client_secret: process.env.AGAVE_CLIENT_SECRET,
  },
  standardDbConfig: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    },
  },
  forApiAlerts: 'forApiAlerts',
}

const checkConfigSetup = () => {
  const necessaryFields = [
    'JWT_SECRET',
    'SENDGRID_API_KEY',
  ]
  const errorFields = []
  for (let necessaryField of necessaryFields) {
    if (config[necessaryField] === undefined || config[necessaryField]?.length === 0) {
      errorFields.push(necessaryField)
    }
  }
  if (errorFields.length > 0) {
    throw new Error(`You are missing the following necessary .env file variables: ${
        errorFields.join(', ')
      }. Please check the readme to ensure you have all the correct environment variables in place.`
    )
  }
}

checkConfigSetup()

export default config
