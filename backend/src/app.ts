#!/user/bin/env node
import cors from "cors"
import express from "express"
import morgan from "morgan"

import config from "../config/config.js"
import { companyIdFromHeaders, convertQueryOperators } from "./middlewares/index.js"





const app = express()
// NOTE: must be first
// app.use(initPerformanceMonitoring)

// Middle Wares
if (!config.TESTING) {
// dont need logging if we are in testing environment
  app.use(morgan("tiny"))
}


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(convertQueryOperators)
app.use(companyIdFromHeaders)


// app.use("/", routes.companyRouter)

// app.get("/", (req, res) => {

//   res.send(`${req.body}`)


// })


// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.log(`Request URL: http://${req.headers.host}${req.originalUrl}`);
//   next();
// });


export default app
