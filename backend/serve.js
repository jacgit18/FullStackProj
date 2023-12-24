import chalk from "chalk";

import app from './app.js';

const port = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });
  

app.listen(port, () => {
  console.log(chalk.green.bold.underline(`Server is up & listening at port: ${port}...`))
})
