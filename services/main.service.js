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

const fetchDetail = async (slug) => {
  const htmlResponse = await axios.get(`${pathDec}/${slug}`);
  const html = htmlResponse.data ?? "";
  const $ = cheerio.load(html);

  const title = $(".movie_name")?.text().trim();
  const originalTitle = $(".org_title")?.text().trim();
  const thumbResponseUrl = $(".info-movie .first img")?.attr("src");
  const thumbUrl = thumbResponseUrl.replace(/-\d+x\d+(?=\.\w+$)/, "");

  const categories = [];
  $(".list_cate div a")?.each((index, categoryElement) => {
    categories.push({
      title: $(categoryElement)?.text().trim(),
      slug: $(categoryElement)?.attr("href").split("/").reverse()[0],
    });
  });

  const episodeCurrent = $(".new-ep")?.text().trim();
  const [year, episodeTotal] = $(".hh3d-info div:nth-child(2)")
    ?.text()
    .trim()
    .split("  ");

  const score = $(".hh3d-rate .score")?.text().trim();
  const content = $(".item-content")?.html().trim();

  let episodeList = [];
  $(".halim-list-eps li")?.each((index, episodeElement) => {
    const episodeSlug = $(episodeElement)
      .find("span")
      ?.attr("data-episode-slug");
    const server = $(episodeElement).find("span")?.attr("data-server");
    const episodeSlugConcat = `${slug}-sv${server}`;
    const episodeId = $(episodeElement).find("span")?.attr("data-post-id");
    episodeList.push({
      title: $(episodeElement).find("span")?.text().trim(),
      slug,
      embed:
        global.fullUrl +
        "/embed/" +
        episodeId +
        "/" +
        episodeSlug +
        "/" +
        episodeSlugConcat,
      link:
        global.fullUrl +
        "/shared/" +
        episodeId +
        "/" +
        episodeSlug +
        "/" +
        episodeSlugConcat +
        ".m3u8",
    });
  });

  return {
    title,
    originalTitle,
    slug,
    thumbResponseUrl: formatImageThumb(thumbResponseUrl),
    thumbUrl: formatImageThumb(thumbUrl),
    categories,
    year,
    range: `${score}/5`,
    content,
    episode: {
      current: episodeCurrent,
      total: episodeTotal,
      data: episodeList,
    },
  };
};

const fetchVideoStream = async (res, episodeId, episodeName, serverId) => {
  try {
    const playerResponse = await axios.get(
      `https://hoathinh3d.run/wp-content/themes/halimmovies/player.php?`,
      {
        params: {
          episode_slug: episodeName,
          server_id: serverId,
          subsv_id: "",
          post_id: episodeId,
        },
        headers: {
          accept: "text/html, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9,vi;q=0.8",
          cookie:
            "PHPSESSID=88tgk72kctqai8bouc78gmcbfh; viewed_post_133=1; halim_recent_posts=%5B1527%2C599%5D; viewed_post_20224=1; cf_clearance=amsxmmcpS8hdJESmhFac5xTM7_licdDI1wsQxdUVN3A-1725330069-1.2.1.1-BBwhU.flzbMobzwTfYtKy3Vn_AXhwoRyug0d060cenCQozvNlySA59JHJbwgGNgNZSSBjxgBTvGQE5185NmBdw3IuMtS.YQGMpAlpsweLT7.MyIB9uFJb8aqoug7FAKNw1NJbSVEoKhCgmjADWi4KUF9yg4Thl9IXefNsAY4C0fZzDKFcpkRS8w4bVXq.DbYXdky8r3gqEpHvhGshorS.x3gyCk1sfkq.jYDR61b0J_79iKXDI5iNfsATnAJ03pd0wpTqajfuhJik2dlh9TT0td5lxpNL1kCw3Wgp9BNVLCEcUGiphywA3yiLvNEcQf1slW42fSIOoVfd3fVgQLZnBVP3DjxI6u7QKrDwWTlcBSVuYFIdefW9TRATGMhq6DRlRduVuy4qASx5_qwtFLttA",
          "if-modified-since": "Tue, 03 Sep 2024 00:38:12 GMT",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );
    const playerJavascript = playerResponse?.data?.data?.sources;

    const regex = /"file":\s*"([^"]+\.m3u8)"/;
    const match = playerJavascript.match(regex);
    if (!match[1]) {
      throw new Error("File detech not found");
    }
    const videoResponse = await axios({
      method: "GET",
      url: match[1],
      responseType: "stream",
    });

    res.writeHead(200, {
      "Content-Type": "application/vnd.apple.mpegurl", // MIME type for m3u8
      "Content-Disposition": 'inline; filename="stream.m3u8"',
    });

    // // Stream the m3u8 content to the client
    videoResponse?.data?.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving video");
  }
};

const renderEmbed = (res, episodeId, episodeName, episodeSlug, serverId) => {
  const linkVideoStream =
    global.fullUrl +
    "/shared/" +
    episodeId +
    "/" +
    episodeName +
    "/" +
    episodeSlug +
    "-sv" +
    serverId +
    ".m3u8";

  res.render("embed", {
    data: {
      episodeId,
      episodeName,
      serverId,
      linkVideoStream,
    },
  });
};

module.exports = {
  fetchNewest,
  fetchImageStream,
  fetchCategories,
  getFullUrl,
  fetchVideoStream,
  fetchDetail,
  renderEmbed,
};
