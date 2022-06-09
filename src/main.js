const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        'api_key': API_KEY
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();

    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies);
}

async function getTrendingMoviesPreviewAxios() {
    const { data } = await api('/trending/movie/day');
    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies);
}

async function getCategoriesMoviesPreviewAxios() {

    const { data } = await api('/genre/movie/list');
    const categories = data.genres;
    createCategories(categoriesPreviewList, categories);
}

async function getCategoriesMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    const data = await res.json();
    const categories = data.genres;
    createCategories(categoriesPreviewList, categories);
}

async function getMoviesByCategoryAxios(id) {
    const { data } = await api('/discover/movie' , {
                                params: {
                                    with_genres: id
                                }});
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getMoviesBySearchAxios(query) {
    const { data } = await api('/search/movie' , {
                                params: {
                                    query: query
                                }});
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getTrendingMoviesAxios() {
    const { data } = await api('/trending/movie/day');
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getMovieByIdAxios(id) {
    const { data: movie } = await api(`/movie/${id}`);

    const imgPath = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${MOVIE_URL_BASE_W500}${movie.poster_path})`;
    headerSection.style.background = imgPath;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movieDetailCategoriesList, movie.genres);

    getRelatedMovieByIdAxios(id);
}

async function getRelatedMovieByIdAxios(id) {
    const { data } = await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;
    createMovies(relatedMoviesContainer,relatedMovies);
}

//Utils o Helpers
function createMovies(element, items) {
    element.innerHTML = '';
    items.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('movie-container');
        itemContainer.addEventListener('click', () => {
            location.hash = `#movie=${item.id}`;
        });
    
        const itemImg = document.createElement('img');
        itemImg.classList.add('movie-img');
        itemImg.setAttribute('alt', item.title);
        itemImg.setAttribute('src', `${MOVIE_URL_BASE_W500}${item.poster_path}`);
        itemContainer.classList.add('movie-img');
    
        itemContainer.appendChild(itemImg);
        element.appendChild(itemContainer);
    });
}

function createCategories(element, items) {
    element.innerHTML = '';
    items.forEach(item => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');


        const movieCategory = document.createElement('h3');
        movieCategory.classList.add('category-title');
        movieCategory.setAttribute('id', `id${item.id}`);
        movieCategory.addEventListener('click', () => {
            location.hash = `#category=${item.id}-${item.name}`;
        });
        const movieCategoryText = document.createTextNode(item.name);

        movieCategory.appendChild(movieCategoryText);
        categoryContainer.appendChild(movieCategory);
        element.appendChild(categoryContainer);
    });
}
