var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = process.env.IMAGE_BASE_URL;

router.use((req,res,next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  /* request.get takes 2 args:
    1. url
    2. callback - 

    -takes 3 arguments
    1. error if any
    2. http reponse
    3. json/data the server sent back
    */
   request.get(nowPlayingUrl, (error, response, movieData) => {

    const parsedData = JSON.parse(movieData);
    // endering the index.html page, passing the array of results
    res.render('index',{
      parsedData: parsedData.results
    });
  });

});

// detail movie end point, receives the id
router.get('/movie/:id', (req,res,next) => {

// res.json(req.params.id)
const movieId = req.params.id;
const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;


request.get(thisMovieUrl, (error, response, movieData) => {
  const parsedData = JSON.parse(movieData);

  // renders single movie detail html page
  res.render('single-movie', {
    parsedData
  })
});
});

// renders the search results page
router.post('/search', (req,res,next) => {
  const userSearchTerm = encodeURIComponent(req.body.movieSearch);
  const cat = req.body.cat;

  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;

  request.get(movieUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData);
    if(cat == "person"){
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results
    })
  });
});

module.exports = router;
