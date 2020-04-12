const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}"/>
      ${movie.Title}
    `;
  },
  // Update input value with item title after click item within dropdown
  inputValue(movie) {
    return movie.Title;
  },
  // Get data from API
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      // Dev tools > network tab > XHR - we can see the below object added the params onto the end of the URL, with api key and search. Without axios we would have had to manually add the string
      params: {
        apikey: "1f936bd1",
        s: searchTerm,
      },
    });
    return response.data.Search;
  },
};

// Create new autocomplete by updating the below object
createAutoComplete({
  // Add in below object if more than 1 autocomplete is required. Otherwise, add object ontents directly here
  ...autoCompleteConfig,
  // Define root Element to insert new autocomplete dropdown
  root: document.getElementById("left-autocomplete"),
  // Do something on option select from dropdown
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.getElementById("left-summary"), "left");
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.getElementById("right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.getElementById("right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;

// Get more data from API and inject data on the DOM
const onMovieSelect = async (movie, summaryEl, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "1f936bd1",
      i: movie.imdbID,
    },
  });

  summaryEl.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  rightSideStats.forEach((rightStat, index) => {
    const leftStat = leftSideStats[index];

    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);
    console.log(leftSideValue, rightSideValue);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

// HTML template to inject onto DOM
const movieTemplate = (movieDetail) => {
  // Extract values and parse as integers for comparison in runComparison()
  const boxOffice =
    movieDetail.BoxOffice === "N/A"
      ? 0
      : parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((count, el) => {
    let value = parseInt(el);
    if (isNaN(value)) {
      return count;
    } else {
      return count + value;
    }
  }, 0);

  // HTML to inject onto the DOM
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${boxOffice}" class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
