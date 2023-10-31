require('dotenv').config();
const axios = require('axios');
const mediaArray = require('./mediaArr');

async function getMediaList(app) {

    app.get('/movie/now_playing', async (req, res) => {
        try {
            res.json(await mediaArray((await axios.get("https://api.themoviedb.org/3/movie/now_playing?api_key=" + process.env.TMDB_KEY)).data, 'movie', 'query'))
        }
        catch (err) {
            console.log('err');
        }
    })
    app.get('/movie/top_rated', async (req, res) => {
        try {
            res.json(await mediaArray((await axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + process.env.TMDB_KEY)).data, 'movie', 'query'))
        }
        catch (err) {
            console.log(err);
        }
    })
    app.get('/movie/popular', async (req, res) => {
        try {
            res.json(await mediaArray((await axios.get("https://api.themoviedb.org/3/movie/popular?api_key=" + process.env.TMDB_KEY)).data, 'movie', 'query'))
        }
        catch (err) {
            console.log('err');
        }
    })
    app.get('/tv/popular', async (req, res) => {
        try {
            res.json(await mediaArray((await axios.get("https://api.themoviedb.org/3/tv/popular?api_key=" + process.env.TMDB_KEY)).data, 'tv', 'query'))
        }
        catch (err) {
            console.log('err');
        }
    })
    app.get('/tv/top_rated', async (req, res) => {
        try {
            res.json(await mediaArray((await axios.get("https://api.themoviedb.org/3/tv/top_rated?api_key=" + process.env.TMDB_KEY)).data, 'tv', 'query'))
        }
        catch (err) {
            console.log('err');
        }
    })

}
module.exports = getMediaList