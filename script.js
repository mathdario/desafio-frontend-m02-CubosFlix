const movies = document.querySelector(".movies");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const searchBar = document.querySelector("input");
const divHighlight = document.querySelector(".highlight");

let movieToModal = {};
let allMovies = [];
let page = 0;

const loadMovies = async () => {
  const response = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  );

  const movie = await response.json();
  allMovies = movie.results;
  showMovies();
};

const showMovies = () => {
  movies.innerHTML = "";

  for (let i = page; i < page + 5; i++) {
    const movie = document.createElement("div");
    movie.classList.add("movie");
    movie.style.backgroundImage = `url(${allMovies[i].poster_path})`;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie__info");

    const movieTitle = document.createElement("span");
    movieTitle.classList.add("movie__title");
    movieTitle.textContent = allMovies[i].title;

    const movieRating = document.createElement("span");
    movieRating.classList.add("movie__rating");
    movieRating.textContent = allMovies[i].vote_average;

    const imgRating = document.createElement("img");
    imgRating.src = "./assets/estrela.svg";
    imgRating.alt = "estrela";

    movies.appendChild(movie);
    movie.appendChild(movieInfo);
    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieRating);
    movieRating.appendChild(imgRating);

    movie.addEventListener("click", async () => {
      await fetchMovieById(allMovies[i].id);
      createModal();
    });
  }
};

btnPrev.addEventListener("click", () => {
  if (page === 0) {
    page = 20;
  }

  page -= 5;

  showMovies();
});

btnNext.addEventListener("click", () => {
  page += 5;

  if (page === 20) {
    page = 0;
  }

  showMovies();
});

const search = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((body) => {
      allMovies = body.results;
      showMovies();
    });
};

searchBar.addEventListener("keydown", function (event) {
  if (event.key !== "Enter") {
    return;
  }

  if (searchBar.value === "") {
    page = 0;
    search(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
    );
    return;
  }

  search(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=${searchBar.value}`
  );

  searchBar.value = "";
});

const highlight = () => {
  const general = fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
  )
    .then((response) => response.json())
    .then((body) => {
      const highlight__video = document.querySelector(".highlight__video");
      highlight__video.style.backgroundImage = `url(${body.backdrop_path})`;
      highlight__video.classList.add("highlight__video");

      const highlight__title = document.querySelector(".highlight__title");
      highlight__title.textContent = body.title;
      highlight__title.classList.add("highlight__title");

      const highlight__rating = document.querySelector(".highlight__rating");
      highlight__rating.textContent = body.vote_average;
      highlight__rating.classList.add("highlight__rating");

      const highlight__genres = document.querySelector(".highlight__genres");
      highlight__genres.textContent = body.genres
        .map((genre) => genre.name)
        .join(", ");
      highlight__genres.classList.add("highlight__genres");

      const highlight__launch = document.querySelector(".highlight__launch");
      highlight__launch.textContent = body.release_date;
      highlight__launch.classList.add("highlight__launch");

      const highlight__description = document.querySelector(
        ".highlight__description"
      );
      highlight__description.textContent = body.overview;
      highlight__description.classList.add("highlight__description");
    });

  const videos = fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
  )
    .then((response) => response.json())
    .then((body) => {
      const highlight__videoLink = document.querySelector(
        ".highlight__video-link"
      );
      highlight__videoLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    });
};

const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".modal__close");
const modalTitle = document.querySelector(".modal__title");
const modalImage = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalAverage = document.querySelector(".modal__average");
const modalGenres = document.querySelector(".modal__genres");

async function fetchMovieById(id) {
  const movie = await fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
  )
    .then((result) => result.json())
    .then((result) => result);

  movieToModal = movie;
}

function createModal() {
  modalTitle.textContent = movieToModal.title;

  modalImage.src = movieToModal.backdrop_path;

  modalDescription.textContent = movieToModal.overview;

  modalAverage.textContent = movieToModal.vote_average.toFixed(1);

  closeModalBtn.addEventListener("click", () => closeModal());
  modal.addEventListener("click", () => closeModal());

  openModal();
}

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

highlight();
loadMovies();
