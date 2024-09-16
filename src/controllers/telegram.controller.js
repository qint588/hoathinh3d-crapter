const {
  getFilm,
  getWatchHistoryByFilmId,
} = require("../services/supabase.service");
const _ = require("lodash");

const listener = async (req, res) => {
  console.table(req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
};

const detailView = async (req, res) => {
  const filmId = req?.params?.id;
  const film = await getFilm(filmId);

  const query = req.query;

  const episode = _.get(
    film,
    `episodes.${query?.server_index || 0}.server_data.${
      query?.episode_index || 0
    }`
  );
  const lastIndexEpisode =
    _.get(film, `episodes.${query?.server_index || 0}.server_data`).length - 1;
  console.table(episode);
  console.table({ lastIndexEpisode });

  await res.render("detail-film", {
    episodes: film.episodes,
    title: film.name,
    currentUrl: `/telegram/detail/${filmId}`,
    episode,
    query: {
      server_index: query?.server_index || 0,
      episode_index: query?.episode_index || 0,
      episode_index_last: lastIndexEpisode,
    },
  });
};

module.exports = {
  listener,
  detailView,
};
