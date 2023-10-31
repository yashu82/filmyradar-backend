//NPM packages
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');

//js files
const auth = require('./auth');
const searchBox = require('./searchBox');
const getMediaList = require('./getMediaList');
const { default: axios } = require('axios');

//Code.
const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://filmyradar.netlify.app', 'https://main--filmyradar.netlify.app', 'https://64f3919cf563cd00085f8d59--filmyradar.netlify.app'] // Replace with your frontend's origin
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
let port = process.env.PORT
app.listen(8000 || port);

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
client.connect();

auth(app);
searchBox(app);
getMediaList(app);

function pingLink() {
  const linkToPing = 'https://filmyradar-backend-v8kc.onrender.com/movie/top_rated'; // Replace with the link you want to ping
  let data = axios.get(linkToPing)
  data.then(res => { })
}

// Ping the link every 15 minutes (10 minutes = 600,000 milliseconds)
const pingInterval = 12 * 60 * 1000;
setInterval(pingLink, pingInterval);