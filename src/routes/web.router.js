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

/**
 * @openapi
 * '/moi-cap-nhat':
 *  get:
 *     tags:
 *     - Default
 *     summary: Phim mới nhất
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       required: false
 *       description: The page number to retrieve, default is 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
router.get("/moi-cap-nhat", async (req, res) => {
  const data = await fetchMovie(req.path, req?.query?.page || 1);
  res.json({
    ...data,
    statusCode: 200,
  });
});

/**
 * @openapi
 * '/phim-hoat-hinh-3d-le':
 *  get:
 *     tags:
 *     - Default
 *     summary: Phim lẻ
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       required: false
 *       description: The page number to retrieve, default is 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
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

/**
 * @openapi
 * '/phim-dang-chieu':
 *  get:
 *     tags:
 *     - Default
 *     summary: Phim đang chiếu
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       required: false
 *       description: The page number to retrieve, default is 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
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

/**
 * @openapi
 * '/phim-hoan-thanh':
 *  get:
 *     tags:
 *     - Default
 *     summary: Phim hoàn thành
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       required: false
 *       description: The page number to retrieve, default is 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
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

/**
 * @openapi
 * '/dang-xem':
 *  get:
 *     tags:
 *     - Default
 *     summary: Phim đáng xem
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       required: false
 *       description: The page number to retrieve, default is 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
router.get("/dang-xem", async (req, res) => {
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

/**
 * @openapi
 * '/tim-kiem/{search}':
 *  get:
 *     tags:
 *     - Default
 *     summary: Tìm kiếm phim
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       required: false
 *       description: The page number to retrieve, default is 1
 *     - name: search
 *       in: path
 *       description: The unique id of the hero
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
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

/**
 * @openapi
 * '/chi-tiet/{slug}':
 *  get:
 *     tags:
 *     - Default
 *     summary: Chi tiết phim
 *     parameters:
 *     - name: slug
 *       in: path
 *       description: The unique id of the hero
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
router.get("/chi-tiet/:slug", async (req, res) => {
  const data = await fetchDetail(req?.params?.slug);
  res.json({
    data,
    statusCode: 200,
  });
});

/**
 * @openapi
 * '/the-loai/{slug}':
 *  get:
 *     tags:
 *     - Default
 *     summary: Chi tiết thể loại phim
 *     parameters:
 *     - name: slug
 *       in: path
 *       description: The unique id of the hero
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
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

/**
 * @openapi
 * '/the-loai':
 *  get:
 *     tags:
 *     - Default
 *     summary: Danh sách thể loại phim
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *       400:
 *         description: Bad request
 */
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

module.exports = router;
