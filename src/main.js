const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        'api_key': API_KEY
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting === true) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
});

async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();

    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies, {lazyLoad: true, cleanResult: true});
}

async function getTrendingMoviesPreviewAxios() {
    const { data } = await api('/trending/movie/day');
    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies, {lazyLoad: true, cleanResult: true});
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
    maxPage = data.total_pages;
    createMovies(genericSection, movies, {lazyLoad: true, cleanResult: true});
}

async function getPaginatedCategories(id) {
    const {scrollTop, 
           scrollHeight,
           clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);    
    if (!scrollIsBottom || page > maxPage) return;
    page++;
    const { data } = await api('/discover/movie' , {
        params: {
            with_genres: id,
            page: page
        },
    });

    const movies = data.results;
    createMovies(genericSection, movies, {lazyLoad: true, cleanResult: false});
}


async function getMoviesBySearchAxios(query) {
    const { data } = await api('/search/movie' , {
                                params: {
                                    query: query
                                }});
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(genericSection, movies, {lazyLoad: true, cleanResult: true});
}

function getPaginatedMoviesBySearch(query) {
    console.log(query);
    return async function() {
        const {scrollTop,  
               scrollHeight, 
               clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        if (!scrollIsBottom || page > maxPage) return;
        page++;
        
        const { data } = await api('/search/movie' , {
            params: {
                query: query,
                page: page
            }});

        const movies = data.results;
        createMovies(genericSection, movies, {lazyLoad: true, cleanResult: false});
    }
}

async function getTrendingMoviesAxios() {
    const { data } = await api('/trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(genericSection, movies, {lazyLoad: true, cleanResult: true});
}

async function getPaginatedTrendingMovies() {
    const {scrollTop, 
           scrollHeight,
           clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    if (!scrollIsBottom || page > maxPage) return;
    page++;

    const { data } = await api('/trending/movie/day' , {
        params: {
            page: page
        },
    });


    const movies = data.results;
    createMovies(genericSection, movies, {lazyLoad: true, cleanResult: false});
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
    createMovies(relatedMoviesContainer,relatedMovies, {lazyLoad: true, cleanResult: true});
}

//Utils o Helpers
function createMovies(element, 
    items, 
    {
        lazyLoad = false, 
        cleanResult = true
    } = {}) {
    if (cleanResult) element.innerHTML = '';
    items.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('movie-container');
        itemContainer.addEventListener('click', () => {
            location.hash = `#movie=${item.id}`;
        });
    
        const itemImg = document.createElement('img');
        itemImg.classList.add('movie-img');
        itemImg.setAttribute('alt', item.title);
        if (lazyLoad) itemImg.setAttribute('data-img', `${MOVIE_URL_BASE_W500}${item.poster_path}`);
        else itemImg.setAttribute('src', `${MOVIE_URL_BASE_W500}${item.poster_path}`);

        itemImg.addEventListener('error', (event) => {
            itemImg.setAttribute('src','https://static.platzi.com/static/images/error/img404.png');
        });

        itemContainer.classList.add('movie-img');
    
        itemContainer.appendChild(itemImg);
        element.appendChild(itemContainer);



        if (lazyLoad)  lazyLoader.observe(itemImg);
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


