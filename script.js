// Create new autocomplete by updating the below object
createAutoComplete({
  // Define root Element to insert new autocomplete dropdown
  root: document.querySelector(".autocomplete"),
  // Create innerHTML for inside the dropdown items
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}"/>
      ${movie.Title}
    `;
  },
  // Add new function to get additional data from API
  onOptionSelect(movie) {
    onMovieSelect(movie);
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
