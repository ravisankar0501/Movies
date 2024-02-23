const apiKey = 'f16be0a860c732a007c43688a0ce0e28'; // Replace with your API key
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const movieDetailsElement = document.getElementById('movieDetails');

function createActorListItem(actor) {
    const actorItem = document.createElement('li');
    actorItem.classList.add('actor-item');

    const actorImage = document.createElement('img');
    actorImage.classList.add('actor-image');
    actorImage.src = `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
    actorImage.alt = actor.name;
    actorItem.appendChild(actorImage);

    const actorName = document.createElement('span');
    actorName.textContent = actor.name;
    actorItem.appendChild(actorName);

    return actorItem;
}


async function fetchMovieDetails() {
    try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        const movie = movieResponse.data;

        const actorsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        const actors = actorsResponse.data.cast.slice(0, 5);

        // Add code to fetch OTT platform information (if available)
        const ottResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`);
        const ottProviders = ottResponse.data.results.US; // Assuming you want information for the US region

        const movieDetailsHtml = `
            <div class="movie-header">
                <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-header-content">
                    <h1>${movie.title}</h1>
                    <p class="rating">Rating: ${movie.vote_average}</p>
                    <p class="year">Year: ${new Date(movie.release_date).getFullYear()}</p>
                    <p class="release-date">Release Date: ${movie.release_date}</p>
                    
                    <!-- Display OTT platforms if available -->
                    <p class="ott-platforms">Available on: ${getOTTPlatforms(ottProviders)}</p>
                </div>
            </div>
            <div class="movie-description">
                <p>${movie.overview}</p>
            </div>
            <div class="actors">
                <h2>Actors</h2>
                <ul id="actorsList"></ul>
            </div>
            <div class="trailer">
                <h2>Trailer</h2>
                <button id="trailerButton">Watch Trailer</button>
            </div>
            <div id="trailerContainer"></div>
        `;

        movieDetailsElement.innerHTML = movieDetailsHtml;

        const actorsListElement = document.getElementById('actorsList');
        actors.forEach(actor => {
            const actorItem = createActorListItem(actor);
            actorsListElement.appendChild(actorItem);
        });

        const trailerButton = document.getElementById('trailerButton');
        const trailerContainer = document.getElementById('trailerContainer');
        trailerButton.addEventListener('click', async () => {
            const videosResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
            const trailers = videosResponse.data.results.filter(video => video.type === 'Trailer');
            if (trailers.length > 0) {
                const trailerKey = trailers[0].key;
                playTrailer(trailerKey);
            } else {
                alert('No trailer available for this movie.');
            }
        });

        function playTrailer(trailerKey) {
            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/embed/${trailerKey}`;
            iframe.allowFullscreen = true;

            trailerContainer.innerHTML = ''; // Clear any previous content
            trailerContainer.appendChild(iframe);
        }

        function getOTTPlatforms(ottProviders) {
            if (ottProviders && ottProviders.flatrate) {
                return ottProviders.flatrate.map(provider => provider.provider_name).join(', ');
            } else {
                return 'Not available on major OTT platforms';
            }
        }

    } catch (error) {
        console.error(error);
        movieDetailsElement.textContent = 'An error occurred while fetching movie details.';
    }
}

fetchMovieDetails();
