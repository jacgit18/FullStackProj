#!/user/bin/env node
import cors from "cors"
import express from "express"
import morgan from "morgan"

import config from "../config/config.js"
// import { companyIdFromHeaders, convertQueryOperators } from "./middlewares/index.js"
import { authenticateToken, companyIdFromHeaders, convertQueryOperators } from "./middlewares/index.js"

import * as routes from "./routers/index.js"





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


// app.use( "/v2", routes.authRouter) // login check


// app.use("/v2", authenticateToken, routes.companyRouter)



// app.use("/v2", routes.companyRouter)
// app.use("/v2",  routes.materialRouter)
app.use("/v2", authenticateToken, routes.materialRouter)





// const company2 = {
//   created_by: { from: "tfuser", where: { email: "superadmin@email.com" } },
//   address: "155 Company Lane, Companytown, USA",
//   name: "Company2",
//   company_type: "cm",
//   date_created: new Date(),
// }

// app.get("/", (req, res) => {

//   res.send(`${req.body}`)


// })


// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.log(`Request URL: http://${req.headers.host}${req.originalUrl}`);
//   next();
// });


export default app
