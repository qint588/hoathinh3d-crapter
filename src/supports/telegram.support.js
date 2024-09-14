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

const renderReplyMarkupFilm = (film, chatId = null, messageId = null) => {
  return {
    inline_keyboard: [
      [
        renderButtonWebapp(
          "↗️ Xem ngay",
          "https://ophim17.cc/phim/" + film.slug
        ),
      ],
      [
        renderButtonCallback("◀️ Tập trước đó", `prev_episode_${film.id}`),
        renderButtonCallback("➖", "unknown"),
        renderButtonCallback("Tập tiếp theo ▶️", `next_episode_${film.id}`),
      ],
      [
        renderButtonCallback("🔢 Tập phim", `episodes_${film.id}`),
        renderButtonCallback(`🔄 Server (SV1)`, `server_${film.id}`),
      ],
      [
        renderButtonCallback(
          "⭐ Thêm vào yêu thích",
          `add_favourite_${film.id}`
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

module.exports = {
  renderButtonInlineQuery,
  renderButtonCallback,
  renderAnswerInlineItem,
  renderButtonWebapp,
  renderReplyMarkupFilm,
};
