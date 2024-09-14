const express = require("express");
const webRouter = require("./routes/web.router");
const swaggerDocs = require("./swagger");

const app = express();
const port = 3000;

require("./services/superbase.service");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.static("public"));

app.use("/", webRouter);
swaggerDocs(app, port);

app.use((req, res, next) => {
  res.status(404).json({
    message: `Sorry can't find that!`,
    statusCode: 404,
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

module.exports = app;
