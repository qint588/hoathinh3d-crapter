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
  const data = await fetchMovie(req.path, req?.query?.page || 1);
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/phim-hoat-hinh-3d-le", async (req, res) => {
  const data = await fetchMovie(
    req.path,
    req?.query?.page || 1,
    "phim-hoat-hinh-3d-le"
  );
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/phim-dang-chieu", async (req, res) => {
  const data = await fetchMovie(
    req.path,
    req?.query?.page || 1,
    "phim-dang-chieu"
  );
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/phim-hoan-thanh", async (req, res) => {
  const data = await fetchMovie(
    req.path,
    req?.query?.page || 1,
    "phim-hoan-thanh"
  );
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/hh3d-dang-xem", async (req, res) => {
  const data = await fetchMovie(
    req.path,
    req?.query?.page || 1,
    "hh3d-dang-xem"
  );
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/tim-kiem/:search", async (req, res) => {
  const data = await fetchMovie(
    req.path,
    req?.query?.page || 1,
    req?.query?.search ? `search/${req?.params?.search}` : null
  );
  res.json({
    ...data,
    statusCode: 200,
  });
});

router.get("/the-loai/:slug", async (req, res) => {
  const data = await fetchMovie(
    req.path,
    req?.query?.page || 1,
    req?.params?.slug
  );
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
