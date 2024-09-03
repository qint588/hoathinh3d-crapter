const express = require("express");
const webRouter = require("./routes/web.router");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", webRouter);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
