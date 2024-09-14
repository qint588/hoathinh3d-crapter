const { createClient } = require("@supabase/supabase-js");
const { fetchMovie } = require("./main.service");
const { default: axios } = require("axios");
// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://ksxouurguemhhcuybuxq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzeG91dXJndWVtaGhjdXlidXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyMzU2MDEsImV4cCI6MjA0MTgxMTYwMX0.dPxMdMogaciHF7-zLxX7YHyIRuOj51O4VTl2gJrPvX8"
);

const fetchFilms = async (page = 1) => {
  const response = await axios.get(
    "https://ophim1.com/danh-sach/phim-moi-cap-nhat",
    {
      params: {
        page,
      },
    }
  );

  const films = response?.data?.items || [];
  const promiseFilms = films.map((el) => fetchDetailFilm(el.slug));
  const responsePromise = await Promise.allSettled(promiseFilms);
  const result = responsePromise
    .filter((el) => el.status == "fulfilled")
    .map((el) => el.value)
    .map((el) => {
      return {
        name: el.movie.name,
        slug: el.movie.slug,
        origin_name: el.movie.origin_name,
        content: el.movie.content,
        type: el.movie.type,
        status: el.movie.status,
        thumb_url: el.movie.thumb_url,
        poster_url: el.movie.poster_url,
        is_copyright: el.movie.is_copyright,
        sub_docquyen: el.movie.sub_docquyen,
        chieurap: el.movie.chieurap,
        trailer_url: el.movie.trailer_url,
        time: el.movie.time,
        episode_current: el.movie.episode_current,
        episode_total: el.movie.episode_total,
        quality: el.movie.quality,
        lang: el.movie.lang,
        year: el.movie.year,
        actor: el.movie.actor,
        director: el.movie.director,
        category: el.movie.category,
        country: el.movie.country,
        tmdb_id: el.movie.tmdb.id,
        tmdb_type: el.movie.tmdb.type,
        episodes: el.episodes,
      };
    });

  return result;
};

const fetchDetailFilm = async (slug) => {
  const response = await axios.get(`https://ophim1.com/phim/${slug}`);
  if (response?.data) {
    return response.data;
  }
  return {
    movie: null,
    episodes: [],
  };
};

const main = async () => {
  for (let index = 1; index <= 1136; index++) {
    const data = await fetchFilms(index);
    const response = await supabase.from("films").insert(data).select();
    console.log(response, index);
  }
};

const categories = async () => {
  const response = await axios.get("https://ophim1.com/the-loai");
  const resultCat = response.data.map((el) => {
    const { _id, ...newItem } = el;
    return newItem;
  });
  const responseSupaBase = await supabase
    .from("categories")
    .insert(resultCat)
    .select();
  console.log(responseSupaBase);
};

const countries = async () => {
  const response = await axios.get("https://ophim1.com/quoc-gia");
  const resultCat = response.data.map((el) => {
    const { _id, ...newItem } = el;
    return newItem;
  });
  const responseSupaBase = await supabase
    .from("countries")
    .insert(resultCat)
    .select();
  console.log(responseSupaBase);
};

// countries();
// categories();
// main();

const test = async () => {
  console.log("test");
  const response = await supabase
    .from("films")
    .select()
    // .textSearch("name", "conan", {
    //   type: "websearch",
    // })
    // .ilike("name", "%Tình Yêu%")
    // .containedBy("category", {
    //   slug: "hanh-dong",
    // })

    // .cs("actor", ["Joey King"]) // Filter for 'Joey King' in the actor array
    // .cs("category", [{ slug: "chinh-kich" }]) // Filter for the category slug
    .filter("category", "cs", `[{ "slug": "hanh-dong" }]`)
    .filter("actor", "cs", `["Joey King"]`)
    // .like("category->slug", "%%")
    .order("id", {
      ascending: false,
    })
    // .range(2, 2);
    .limit(2);
  //   console.log(response.data);

  console.log(
    response.data.map((el) => {
      return { category: el.category, actor: el.actor };
    })
  );
};

// test();
