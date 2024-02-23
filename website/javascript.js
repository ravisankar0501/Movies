let currentPage = 1;
let moviesList = [];
const movieListElement = document.getElementById('movieList');

async function fetchMovies(url, params) {
    try {
        const response = await axios.get(url, { params });
        return response.data.results;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchAndDisplayMovies(url, params = {}) {
    const newMovies = await fetchMovies(url, params);
    moviesList = moviesList.concat(newMovies);

    newMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieListElement.appendChild(movieCard);
    });
}

function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
}

function createMovieCard(movie) {
    const movieCardLink = document.createElement('a'); 
    movieCardLink.href = `movie-details.html?id=${movie.id}`; 
    movieCardLink.classList.add('movie-card-link'); 

    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImage.alt = movie.title;

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieTitle);

    movieCardLink.appendChild(movieCard);

    return movieCardLink;
}
// ... (other code below)


function createDetailsLink(text, movieId) {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = `movie-details.html?id=${movieId}`; // Link to the movie details page with query parameter
    return link;
}

async function fetchAndDisplayActors(movieId, movieCard) {
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        params: {
            api_key: 'f16be0a860c732a007c43688a0ce0e28'
        }
    };

    try {
        const response = await axios.request(options);
        const cast = response.data.cast;

        const actorsList = document.createElement('ul');
        actorsList.classList.add('actors-list');
        cast.slice(0, 5).forEach(actor => {
            const actorItem = document.createElement('li');
            actorItem.classList.add('actor-item');

            const actorImage = document.createElement('img');
            actorImage.classList.add('actor-image');
            if (actor.profile_path) {
                actorImage.src = `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
                actorImage.alt = actor.name;
            } else {
                actorImage.src = 'no-image.png'; // Replace with a placeholder image URL
                actorImage.alt = 'No Image';
            }

            const actorName = document.createElement('span');
            actorName.textContent = actor.name;

            actorItem.appendChild(actorImage);
            actorItem.appendChild(actorName);

            actorsList.appendChild(actorItem);
        });

        const existingActorsList = movieCard.querySelector('.actors-list');
        if (existingActorsList) {
            existingActorsList.remove();
        }

        movieCard.appendChild(actorsList);
    } catch (error) {
        console.error(error);
    }
}

async function fetchAndDisplayTrailer(movieId) {
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        params: {
            api_key: 'f16be0a860c732a007c43688a0ce0e28'
        }
    };

    try {
        const response = await axios.request(options);
        const trailers = response.data.results.filter(video => video.type === 'Trailer');

        if (trailers.length > 0) {
            const trailerKey = trailers[0].key;
            const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
            window.open(trailerUrl, '_blank');
        } else {
            alert('No trailer available for this movie.');
        }
    } catch (error) {
        console.error(error);
    }
}

function toggleMovieDetails(movieCard, movie) {
    const detailsContainer = movieCard.querySelector('.movie-details');
    if (detailsContainer) {
        detailsContainer.remove();
    } else {
        const newDetailsContainer = document.createElement('div');
        newDetailsContainer.classList.add('movie-details');

        const movieRating = document.createElement('p');
        movieRating.textContent = `Rating: ${movie.vote_average}`;

        const movieDescription = document.createElement('p');
        movieDescription.textContent = movie.overview;

        newDetailsContainer.appendChild(movieRating);
        newDetailsContainer.appendChild(movieDescription);

        movieCard.appendChild(newDetailsContainer);
    }
}

async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (query !== '') {
        clearMovieList();
        moviesList = [];

        const options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie',
            params: {
                api_key: 'f16be0a860c732a007c43688a0ce0e28',
                query: query
            }
        };

        await fetchAndDisplayMovies(options.url, options.params);
    } else {
        fetchPopularMovies();
    }
}

document.getElementById('loadMoreBtn').addEventListener('click', () => {
    currentPage++;
    fetchAndDisplayMovies('https://api.themoviedb.org/3/discover/movie', {
        api_key: 'f16be0a860c732a007c43688a0ce0e28',
        page: currentPage
    });
});
function handleSearchkeypress(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
}


document.getElementById('searchInput').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

document.getElementById('popularBtn').addEventListener('click', () => {
    clearMovieList();
    fetchAndDisplayMovies('https://api.themoviedb.org/3/movie/popular', {
        api_key: 'f16be0a860c732a007c43688a0ce0e28',
        page: 1
    });
});

document.getElementById('trendingBtn').addEventListener('click', () => {
    clearMovieList();
    fetchAndDisplayMovies('https://api.themoviedb.org/3/trending/movie/week', {
        api_key: 'f16be0a860c732a007c43688a0ce0e28',
        page: 1
    });
});

function clearMovieList() {
    movieListElement.innerHTML = '';
}

fetchAndDisplayMovies('https://api.themoviedb.org/3/movie/popular', {
    api_key: 'f16be0a860c732a007c43688a0ce0e28',
    page: 1
});

async function fetchMovies(url, params = {}) {
    const response = await axios.get(url, { params });
    if (response.status === 200) {
      return response.data.results;
    } else {
      throw new Error(`API call failed. Status code: ${response.status}`);
    }
  }
  
  async function applyFilters() {
    // Get the filter options.
    const showOptions = document.getElementById("showOptions");
    const genreOptions = document.getElementById("genreOptions");
    const certificationOptions = document.getElementById("certificationOptions");
    const languageInput = document.getElementById("languageInput");
    const userScoreInput = document.getElementById("userScoreInput");
    const userVotesInput = document.getElementById("userVotesInput");
    const runtimeInput = document.getElementById("runtimeInput");
    const keywordsInput = document.getElementById("keywordsInput");
  
    // Get the apply filters button.
    const applyFiltersButton = document.getElementById("applyFilters");
  
    // Create a function to apply the filters.
    function applyFilters() {
      // Get the selected show option.
      const selectedShowOption = showOptions.value;
  
      // Get the selected genre options.
      const selectedGenreOptions = [];
      for (const option of genreOptions.options) {
        if (option.selected) {
          selectedGenreOptions.push(option.value);
        }
      }
  
      // Get the selected certification option.
      const selectedCertificationOption = certificationOptions.value;
  
      // Get the language.
      const language = languageInput.value;
  
      // Get the user score.
      const userScore = userScoreInput.value;
  
      // Get the minimum user votes.
      const minimumUserVotes = userVotesInput.value;
  
      // Get the runtime.
      const runtime = runtimeInput.value;
  
      // Get the keywords.
      const keywords = keywordsInput.value;
  
      // Send the filter criteria to the server.
      // The server will then return the filtered movie list.
      async function fetchMovies(url, params = {}) {
        const filteredMovies = await axios.fetchMovies(
        'https://api.themoviedb.org/3/discover/movie',
        {
          api_key: 'f16be0a860c732a007c43688a0ce0e28',
          page: 1,
          show_option: selectedShowOption,
          genres: selectedGenreOptions,
          certification: selectedCertificationOption,
          language: language,
          user_score: userScore,
          minimum_user_votes: minimumUserVotes,
          runtime: runtime,
          keywords: keywords
        }
      );
  
      movieListElement.innerHTML = '';
      filteredMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieListElement.appendChild(movieCard);
      });
    }
  
    // Attach the apply filters event listener to the apply filters button.
    applyFiltersButton.addEventListener("click", applyFilters);
  }
  
  }