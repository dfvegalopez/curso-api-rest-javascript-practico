let page = 1;
let maxPage;
let infiniteScroll;

window.addEventListener('hashchange', navigatior, false);
window.addEventListener('DOMContentLoaded', navigatior, false);
window.addEventListener('scroll', infiniteScroll, false);

searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends='
    headerCategoryTitle.innerHTML = 'Tendencias';
})

arrowBtn.addEventListener('click', () => {
    window.history.back();
    //location.hash = '#home='
})

function navigatior() {
   console.log({location});
   page = 1;
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, false);
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

function homePage() {
    console.log('HOME');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreviewAxios();
    getCategoriesMoviesPreviewAxios();
}

function categoriesPage() {
    console.log('CATEGORIES', page);
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    headerCategoryTitle.innerHTML = categoryName;
    getMoviesByCategoryAxios(categoryId);
    infiniteScroll = () => { getPaginatedCategories(categoryId)};
}

function movieDetailsPage() {
    console.log('MOVIE');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, id] = location.hash.split('=');
    getMovieByIdAxios(id);

}

function searchPage() {
    console.log('SEARCH', page);
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearchAxios(query);
    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
    console.log('TRENDS', page);
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesAxios();
    infiniteScroll = getPaginatedTrendingMovies;
}



