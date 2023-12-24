import chalk from "chalk"
import app from "./app.js"

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(chalk.green.bold.underline(`Server is up & listening at http://127.0.0.1:${port}`))
})
