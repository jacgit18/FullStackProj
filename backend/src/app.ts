#!/user/bin/env node
import cors from "cors"
import express from "express"
import morgan from "morgan"

import config from "../config/config.js"
import { initPerformanceMonitoring } from "../libs/monitoring.js"
import { convertQueryOperators, testIdFromHeaders } from "./middlewares/index.js"


const app = express()
// NOTE: must be first
app.use(initPerformanceMonitoring)

// Middle Wares
if (!config.TESTING) {
// dont need logging if we are in testing environment
  app.use(morgan("tiny"))
}
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(convertQueryOperators)
app.use(testIdFromHeaders) // to update for whatever need
// The next() defined in testIdFromHeaders middleware function allowing
// other app.use() to be used after


// Unauthenticated user log in routes
// app.use( "/v2", routes.authRouter)


// Authenticated everything else
// app.all("/v1", authenticateToken, routes.apiPassthroughRouter)
// app.use("/v2", authenticateToken, routes.letterRouter)
// app.use("/", routes.letterRouter)




// app.get("/", (req, res) => {
//   res.send("Hello from the backend!")
// })

// "start": "node ./build/src/serve.js",

// "nodemonConfig": {
//   "watch": ["src"],
//   "ext": "ts",
//   "ignore": ["src/**/*.test.ts"],
//   "exec": "npm run prettier-format && npm run lint && node src/app.ts"
// }

export default app
