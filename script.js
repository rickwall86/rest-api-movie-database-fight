// Get data from API
const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    // Dev tools > network tab > XHR - we can see the below object added the params onto the end of the URL, with api key and search. Without axios we would have had to manually add the string
    params: {
      apikey: "1f936bd1",
      s: searchTerm,
    },
  });
  return response.data.Search;
};

// Insert HTML for autocomplete dropdown
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

// DOM selectors
const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

// Functionality for the search input
const onInput = async (e) => {
  const movies = await fetchData(e.target.value);

  if (movies === undefined) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src="${imgSrc}"/>
      ${movie.Title}
    `;

    // Click event for when movie title is clicked within the dropdown
    option.addEventListener("click", () => {
      // Close the dropdown
      dropdown.classList.remove("is-active");
      // Update the value of the input
      input.value = movie.Title;
      // Get data from API
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
};

// input event on input field with debounce
input.addEventListener("input", debounce(onInput, 500));

// Listens for a click anywhere on the page. All children elements 'bubble' up until the event is found
document.addEventListener("click", (e) => {
  // Check if root contains any child elements from the click event. If it doesnt, then close the dropdown
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "1f936bd1",
      i: movie.imdbID,
    },
  });

  document.getElementById("summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
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
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
