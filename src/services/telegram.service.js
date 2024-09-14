require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const {
  renderButtonInlineQuery,
  renderButtonCallback,
} = require("../supports/telegram.support");
const { getFilms, getFilm } = require("./superbase.service");
const { renderAnswerInlineItem } = require("../supports/telegram.support");
const _ = require("lodash");
const { renderReplyMarkupFilm } = require("../supports/telegram.support");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🍿 Xin chào các bạn yêu thích phim!\n\n🔍 Để tìm kiếm, sử dụng các nút bên dưới hoặc gửi tên phim qua tin nhắn`,
    {
      reply_markup: {
        inline_keyboard: [[renderButtonInlineQuery("🔍 Bắt đầu tìm kiếm")]],
      },
    }
  );
});

bot.onText(/\/search/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Để tìm bộ phim bạn cần, hãy nhấp vào nút "Tìm kiếm" và nhập yêu cầu của bạn hoặc chỉ cần gửi yêu cầu của bạn qua tin nhắn\n\nNếu nó không hoạt động, hãy đọc hướng dẫn',
    {
      reply_markup: {
        inline_keyboard: [
          [renderButtonInlineQuery("🔍 Tìm kiếm")],
          [
            renderButtonInlineQuery("🗂 Thể loại", "#categories"),
            renderButtonCallback("🈁 Bộ lọc", "create_filter"),
          ],
          [
            renderButtonInlineQuery("🕐 Lịch sử", "#history"),
            renderButtonInlineQuery("⭐ Yêu thích", "#favourite"),
          ],
        ],
      },
    }
  );
});

bot.addListener("message", async (msg) => {
  const isCommand = msg.text.startsWith("/");
  if (isCommand) return;
  bot.sendMessage(
    msg.chat.id,
    `🔍 Bạn có thể xem kết quả của truy vấn "${msg.text}" bằng cách nhấp vào nút "Kết quả tìm kiếm"\n\nNếu nó không hoạt động, hãy đọc hướng dẫn`,
    {
      reply_markup: {
        inline_keyboard: [
          [renderButtonInlineQuery("🔍 Tìm kiếm", msg.text)],
          [
            renderButtonInlineQuery("🗂 Thể loại", "#categories"),
            renderButtonCallback("🈁 Bộ lọc", "create_filter"),
          ],
          [
            renderButtonInlineQuery("🕐 Lịch sử", "#history"),
            renderButtonInlineQuery("⭐ Yêu thích", "#favourite"),
          ],
        ],
      },
    }
  );
});

bot.on("inline_query", async (query) => {
  const pageSize = 20;
  const offset = query?.offset || 0;
  const page = offset / pageSize + 1;
  const keyword = query?.query || "";

  console.table({ offset, pageSize, page, keyword });
  const films = await getFilms(page, pageSize, { keyword });

  const inlineQueryResponse =
    films.length == 0
      ? [renderAnswerInlineItem()]
      : films.map((el) => renderAnswerInlineItem(el));
  console.table(inlineQueryResponse);

  bot.answerInlineQuery(query.id, inlineQueryResponse, {
    cache_time: 1,
    next_offset: `${pageSize * page}`,
  });
});

bot.onText(/\/watch (.+)/, async (msg, match) => {
  const filmId = match[1];
  const film = await getFilm(filmId);

  const labelCategory = "Thể loại: " + _.map(film.category, "name").join(", ");
  const labelCountry = "Quốc gia: " + _.map(film.country, "name").join(", ");

  const caption = `${film.name} (${film.origin_name})\n\n${
    film.content
      ? film.content.replace(/<[^>]*>?/gm, "").slice(0, 162) + "..."
      : "..."
  }\n\n---------------------\n${labelCategory}\n${labelCountry}\n${
    film.lang
  } | ${film.quality} | ${film.year}\n\nvia ${
    process.env.TELEGRAM_BOT_USERNAME
  }`;

  await bot.sendPhoto(msg.chat.id, film.thumb_url, {
    caption,
    reply_markup: renderReplyMarkupFilm(film, msg.chat.id, msg.message_id),
  });
});

bot.on("polling_error", (error) => {
  console.log("Error", error.message);
});
