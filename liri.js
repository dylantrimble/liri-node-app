require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var userCommand = process.argv[2];
var artName = process.argv.slice(3).join(" ");

let grabOMDB = function (movieName) {
    if (!movieName) {
        movieName = 'Mr Nobody'
    }
    let urlHit = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy'

    axios.get(urlHit).then(function (response) {

        var movieInfo = `
    ------ Liri found this for you -----
Title:        ${response.data.Title}
Year:         ${response.data.year}
Rated:        ${response.data.Rated}
IMDB Raiting: ${response.data.imdbRating}
Country:      ${response.data.Country}
Language:     ${response.data.Language}
Plot:         
${response.data.Plot}

Actors:       ${response.data.Actors}
IMDb Raiting: ${response.data.imdbRating}
    -------------------------------------`;
        console.log(movieInfo)

        fs.appendFile('log.txt', movieInfo, function (err) {
            if (err) throw err
            console.log('Saved!')
        });

    });
};


function grabSpotify(artName) {
    var songName = artName;

    spotify.search({
        type: 'track',
        query: songName
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err)
            return
        } else {
            var spotInfo = `
    ---------LIRI found this for you---------
Song Name:   ${songName.toUpperCase()}
Album Name:  ${data.tracks.items[0].album.name}
Artist Name: ${data.tracks.items[0].album.artists[0].name}
URL:         ${data.tracks.items[0].album.external_urls.spotify}
    -----------------------------------------`
                ;
            console.log(spotInfo)

            fs.appendFile('log.txt', spotInfo, function (err) {
                if (err) throw err
                console.log('This information is Saved! in log.txt ')
            });
        };
    });
};


function grabBands(artName){
    var artName = artName;

    let urlTarget = "https://rest.bandsintown.com/artists/" + artName + "/events?app_id=codingbootcamp";
    axios.get(urlTarget).then(function(response){
        var date = moment(response.data[0].datetime).format('MM/DD/YYYY')
        var infoArtist = `
    ---------LIRI found this for you---------
Venue:     ${response.data[0].venue.name}
Location:  ${response.data[0].venue.city}, ${response.data[0].venue.country}
Date:      ${date}
    -----------------------------------------`;

        console.log(infoArtist);

        fs.appendFile('log.txt', infoArtist, function (err) {
            if (err) throw err
            console.log('This information is Saved! in log.txt ')
        });
        
    });
};
function doTheThing(){
    fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			logOutput.error(err);
		} else {

			var randomArray = data.split(",");

            action = randomArray[0];
            
            argument = randomArray[1];
            
			doNext(action, argument);
		};
	});
};
   
   


doNext(userCommand, artName);


function doNext(uC, aN) {
    switch (uC) {
        case "spotify-this-song":
            grabSpotify(aN);
            break;

        case "movie-this":
            grabOMDB(aN);
            break;

        case "bands-in-town":
            grabBands(aN);
            break;

        case "do-what-it-says": 
            doTheThing();
            break;

        default:
            break;
    };
};