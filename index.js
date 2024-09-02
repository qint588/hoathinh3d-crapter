const express = require("express");
const {
  fetchNewest,
  getFullUrl,
  fetchImageStream,
  fetchCategories,
} = require("./services/hh3d.service");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  global.fullUrl = getFullUrl(req);
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    statusCode: 200,
  });
});

app.get("/moi-cap-nhat", async (req, res) => {
  const data = await fetchNewest(req?.query?.page || 1);
  res.json({
    ...data,
    statusCode: 200,
  });
});

app.get("/the-loai", async (req, res) => {
  const data = await fetchCategories();
  res.json({
    ...data,
    statusCode: 200,
  });
});

app;

app.get("/:year/:month/:slug.:extention", async (req, res) => {
  return await fetchImageStream(req.path, res);
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Sorry can't find that!`,
    statusCode: 404,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
