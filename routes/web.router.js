const express = require("express");
const router = express.Router();

const {
  fetchMovie,
  getFullUrl,
  fetchImageStream,
  fetchCategories,
  fetchDetail,
  fetchVideoStream,
  renderEmbed,
} = require("../services/main.service");

router.use((req, res, next) => {
  global.fullUrl = getFullUrl(req);
  next();
});

router.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    statusCode: 200,
  });
});

router.get("/chi-tiet/:slug", async (req, res) => {
  const data = await fetchDetail(req?.params?.slug);
  res.json({
    data,
    statusCode: 200,
  });
});

router.get("/moi-cap-nhat", async (req, res) => {
  const data = await fetchMovie(req?.query?.page || 1);
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/tim-kiem", async (req, res) => {
  const data = await fetchMovie(
    req?.query?.page || 1,
    req?.query?.search ? `search/${req?.query?.search}` : null
  );
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/the-loai/:slug", async (req, res) => {
  const data = await fetchMovie(req?.query?.page || 1, req?.params?.slug);
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/the-loai", async (req, res) => {
  const data = await fetchCategories();
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get(
  "/shared/:episodeId/:episodeName/:episodeSlug-sv:serverId.m3u8",
  async (req, res) => {
    return await fetchVideoStream(
      res,
      req?.params?.episodeId,
      req?.params?.episodeName,
      req?.params?.serverId
    );
  }
);

router.get("/:year/:month/:slug.:extention", async (req, res) => {
  return await fetchImageStream(req.path, res);
});

router.get(
  "/embed/:episodeId/:episodeName/:episodeSlug-sv:serverId",
  async (req, res) => {
    return await renderEmbed(
      res,
      req?.params?.episodeId,
      req?.params?.episodeName,
      req?.params?.episodeSlug,
      req?.params?.serverId
    );
  }
);

router.use((req, res, next) => {
  res.status(404).json({
    message: `Sorry can't find that!`,
    statusCode: 404,
  });
});

module.exports = router;
