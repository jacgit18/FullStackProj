#!/user/bin/env node
import cors from "cors"
import express from "express"

// import config from "../config/config.js"
// import { initPerformanceMonitoring } from "../libs/monitoring.js"

const app = express()
// NOTE: must be first
// app.use(initPerformanceMonitoring)

// Middle Wares
// if (!config.TESTING) {
  // dont need logging if we are in testing environment
//   app.use(morgan("tiny"))
// }
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(convertQueryOperators)
// app.use(companyIdFromHeaders)



// Unauthenticated user log in routes
// app.use( "/v2", routes.authRouter)

// Authenticated everything else
// app.all("/v1", authenticateToken, routes.apiPassthroughRouter)
// app.use("/v2", authenticateToken, routes.letterRouter)
// app.use("/v2", authenticateToken, routes.projectRouter)
// app.use("/v2", authenticateToken, routes.ticketRouter)
// app.use("/v2", authenticateToken, routes.companyRouter)
// app.use("/v2", authenticateToken, routes.userRouter)
// app.use("/v2", authenticateToken, routes.materialRouter)
// app.use("/v2", authenticateToken, routes.equipmentRouter)
// app.use("/v2", authenticateToken, routes.laborRouter)
// app.use("/v2", authenticateToken, routes.fileRouter)
// app.use("/v2", authenticateToken, routes.actionRouter)
// app.use("/v2", authenticateToken, routes.ticketReviewProcessRouter)


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


    // "start": "node ./build/src/serve.js",


export default app
