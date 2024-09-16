const _ = require("lodash");
const {
  getWatchHistoryByFilmId,
  firstOrCreateMember,
} = require("../services/supabase.service");

const renderButtonInlineQuery = (text, query = "") => {
  return {
    text,
    switch_inline_query_current_chat: query,
  };
};

const renderButtonCallback = (text, callback_data) => {
  return {
    text,
    callback_data,
  };
};

const renderAnswerInlineItem = (item = null) => {
  if (!item)
    return {
      id: 1,
      type: "article",
      title: "Không tìm thấy kết quả 😓",
      input_message_content: {
        message_text: "/search",
      },
      description: "Nếu nó không hoạt động, hãy đọc hướng dẫn",
    };

  return {
    id: item.id,
    type: "article",
    title: `${item.name} ${item.origin_name ? `(${item.origin_name})` : ""}`,
    input_message_content: {
      message_text: `/watch ${item.id}`,
    },
    thumb_url: item.thumb_url,
    thumb_height: 100,
    thumb_width: 100,
    description: `${item.country
      .map((el) => el.name)
      .join(", ")} | Trạng thái: ${item.episode_current} | ${
      item.year ?? ""
    } \n${item.category.map((el) => el.name).join(", ")}`,
  };
};

const renderReplyMarkupFilm = async (
  film,
  from,
  chatId = null,
  messageId = null
) => {
  const member = await firstOrCreateMember(from);
  const watchHistoryFilm = await getWatchHistoryByFilmId(film, member.id);
  console.table(watchHistoryFilm);
  const labelContinuteWatch =
    _.lowerCase(watchHistoryFilm.episode) == "full"
      ? watchHistoryFilm.episode
      : "Tập " + watchHistoryFilm.episode;
  return {
    inline_keyboard: [
      [
        renderButtonWebapp(
          "↗️ Xem ngay",
          "https://ophim17.cc/phim/" + film.slug
        ),
      ],
      !film.is_first
        ? [
            renderButtonWebapp(
              `🔘 Xem tiếp tục (${labelContinuteWatch})`,
              "https://ophim17.cc/phim/" + film.slug
            ),
          ]
        : [],
      [
        renderButtonCallback(
          "⭐ Thêm vào yêu thích",
          `addFavourite:${film.id}`
        ),
      ],
      [
        renderButtonInlineQuery("🕐 Lịch sử", "#history"),
        renderButtonInlineQuery("🔍 Tìm kiếm"),
      ],
    ],
  };
};

const renderButtonWebapp = (text, url) => {
  return {
    text: text,
    web_app: {
      url,
    },
  };
};

const renderButtonBackToFilmMarkup = (filmId) => {
  return renderButtonCallback("🔙 Trở về", `backFilm:${filmId}`);
};

module.exports = {
  renderButtonInlineQuery,
  renderButtonCallback,
  renderAnswerInlineItem,
  renderButtonWebapp,
  renderReplyMarkupFilm,
  renderButtonBackToFilmMarkup,
};
