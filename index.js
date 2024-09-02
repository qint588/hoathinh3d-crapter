const express = require("express");
const webRouter = require("./routes/web.router");

const app = express();
const port = 3000;

app.use("/", webRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
