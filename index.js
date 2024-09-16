const express = require("express");
const telegramRouter = require("./src/routes/telegram.router");
const bodyParser = require("body-parser");

require("./src/services/telegram.service");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static("public"));

app.use("/telegram", telegramRouter);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
