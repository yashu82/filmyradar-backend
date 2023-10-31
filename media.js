const axios = require("axios");

var genre_ids_list_movie = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "Tv-movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}
var genre_ids_list_tv = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37: "Western"
}

async function mediaRatings(name, date) {
    if (date !== undefined) {
        let year = (date.split('-'))[0];
        try {
            let TData = ((await axios.get('https://www.omdbapi.com/?s=' + name + '&y=' + year + '&apikey=' + process.env.OMDB_KEY)).data.Search)
            if (TData === undefined) {
                TData = ((await axios.get('https://www.omdbapi.com/?s=' + name + '&apikey=' + process.env.OMDB_KEY)).data.Search)
            }
            if (TData === undefined)
                return (null)
            else {
                const imdb_id = TData[0].imdbID
                const ratings = ((await axios.get('https://www.omdbapi.com/?i=' + imdb_id + '&apikey=' + process.env.OMDB_KEY)).data.Ratings)
                return (
                    ratings.map((item) => {
                        return (
                            {
                                [item.Source]: item.Value
                            }
                        )
                    })
                )
            }
        }
        catch (err) {
        }
    }
    else
    {
        try {
            let TData = ((await axios.get('https://www.omdbapi.com/?s=' + name + '&apikey=' + process.env.OMDB_KEY)).data.Search)
            if (TData === undefined)
                return (null)
            else {
                const imdb_id = TData[0].imdbID
                const ratings = ((await axios.get('https://www.omdbapi.com/?i=' + imdb_id + '&apikey=' + process.env.OMDB_KEY)).data.Ratings)
                return (
                    ratings.map((item) => {
                        return (
                            {
                                [item.Source]: item.Value
                            }
                        )
                    })
                )
            }
        }
        catch (err) {
        }
    }
}


async function mediaImgs(id, type) {
    let imgArr = await axios.get("https://api.themoviedb.org/3/" + type + "/" + id + "/images?api_key=" + process.env.TMDB_KEY)
    let backdrops = (imgArr.data.backdrops).map((item) => {
        return ({
            ...item,
            file_path: "https://image.tmdb.org/t/p/w500/" + item.file_path
        })
    })
    let logos = (imgArr.data.logos).map((item) => {
        return ({
            ...item,
            file_path: "https://image.tmdb.org/t/p/w500/" + item.file_path
        })
    })
    let posters = (imgArr.data.posters).map((item) => {
        return ({
            ...item,
            file_path: "https://image.tmdb.org/t/p/w500/" + item.file_path
        })
    })
    return (({ backdrops, logos, posters }));

}

async function mediaVideos(id, type) {
    let rawVidArr = (await axios.get('https://api.themoviedb.org/3/' + type + '/' + id + '/videos?api_key=' + process.env.TMDB_KEY)).data.results
    return (
        rawVidArr.map((item) => {
            return (
                {
                    type: item.type,
                    link: 'https://www.youtube.com/embed/' + item.key,
                    isOfficial: item.official
                }
            )
        })
    );
}

function genreFind(genreArr) {
    let genres = genreArr.map((genre) => {
        return (genre.name)
    })
    return genres;
}

function languageName(langCode) {
    const languageNames = new Intl.DisplayNames(['en'], {
        type: 'language'
    });
    return (languageNames.of(langCode))
}

async function media(element, type, category) {
    if (category === 'query') {
        if (type === "movie")
            return (
                {
                    type: 'movie',
                    id: element.id,
                    title: element.title,
                    poster_path: "https://image.tmdb.org/t/p/w500" + element.poster_path,
                    original_language: element.original_language,
                    ratings: (await mediaRatings(element.title, element.release_date))
                }
            )
        else if (type === "tv")
        return (
            {
                type: 'tv',
                id: element.id,
                title: element.name,
                original_language: element.original_language,
                poster_path: "https://image.tmdb.org/t/p/w500" + element.poster_path,
                ratings: (await mediaRatings(element.title, element.first_air_date))
            }
        )
    }
    else if (category === 'search') {

        if (type === "movie")
            return (
                {
                    adult: element.adult,
                    type: 'movie',
                    id: element.id,
                    title: element.title,
                    overview: element.overview,
                    poster_path: "https://image.tmdb.org/t/p/w500" + element.poster_path,
                    release_date: element.release_date,
                    genre: genreFind(element.genres),

                    original_language: languageName(element.original_language),
                    images: (await mediaImgs(element.id, type)),
                    videos: (await mediaVideos(element.id, type)),
                    ratings: (await mediaRatings(element.title, element.release_date))
                }
            )
        else if (type === "tv")
            return (
                {
                    adult: element.adult,
                    type: 'tv',
                    id: element.id,
                    title: element.name,
                    overview: element.overview,
                    original_language: languageName(element.original_language),
                    poster_path: "https://image.tmdb.org/t/p/w500" + element.poster_path,
                    release_date: element.first_air_date,
                    genre: genreFind(element.genres),
                    images: (await mediaImgs(element.id, type)),
                    videos: (await mediaVideos(element.id, type)),
                    ratings: (await mediaRatings(element.title, element.first_air_date))
                }
            )
    }

};


module.exports = media;