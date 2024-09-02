const { default: axios } = require("axios");
const cheerio = require("cheerio");

const pathDec = "https://hoathinh3d.run";

const getFullUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

const fetchNewest = async (page = 1) => {
  const htmlResponse = await axios.get(`${pathDec}/page/${page}`);
  const html = htmlResponse.data ?? "";
  const $ = cheerio.load(html);

  const articles = [];

  $("article.grid-item").each((index, article) => {
    const title = $(article).find(".entry-title")
      ? $(article).find(".entry-title").text()
      : "";

    const originalTitle = $(article).find(".original_title")
      ? $(article).find(".original_title").text()
      : "";

    const episode = $(article).find(".episode")
      ? $(article).find(".episode").text()
      : "";

    const status = $(article).find(".status")
      ? $(article).find(".status").text()
      : "";

    let thumbResponseUrl = $(article).find(".img-responsive")
      ? $(article).find(".img-responsive").attr("src")
      : "";

    const slug = $(article).find("a.halim-thumb")
      ? $(article).find("a.halim-thumb").attr("href").split("/").reverse()[0]
      : "";

    const thumbUrl = thumbResponseUrl.replace(/-\d+x\d+(?=\.\w+$)/, "");

    articles.push({
      title,
      originalTitle,
      slug,
      episode,
      status,
      thumbResponseUrl: formatImageThumb(thumbResponseUrl),
      thumbUrl: formatImageThumb(thumbUrl),
    });
  });

  const totalPage = $(".page-numbers a.page-numbers:not(.next)")
    ? $(".page-numbers a.page-numbers:not(.next)").last().text()
    : 0;

  return {
    data: articles,
    paginate: {
      currentPage: page,
      totalPage: parseInt(totalPage),
    },
  };
};

const fetchImageStream = async (path, res) => {
  const imageUrl = `${pathDec}/wp-content/uploads/${path}`;
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Type", "image/jpeg"); // Đặt Content-Type phù hợp với loại hình ảnh
    response.data.pipe(res); // Stream hình ảnh từ URL tới client
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving image");
  }
};

const formatImageThumb = (thumb) => {
  const formatedToArray = thumb.split("/").reverse();

  return global.fullUrl + "/" + formatedToArray.slice(0, 3).reverse().join("/");
};

const fetchCategories = async () => {
  const htmlResponse = await axios.get(pathDec);
  const html = htmlResponse.data ?? "";
  const $ = cheerio.load(html);

  const categories = [];

  if ((categoryElement = $('a[title="Thể Loại"]'))) {
    categoryElement
      .parent()
      .find("ul a")
      .each((index, el) => {
        const slug = $(el).attr("href").split("/").reverse()[0];
        categories.push({
          title: $(el).text().trim(),
          slug,
        });
      });
  }

  return { data: categories };
};

module.exports = {
  fetchNewest,
  fetchImageStream,
  fetchCategories,
  getFullUrl,
};
