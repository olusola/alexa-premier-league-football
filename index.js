// Olusola Ak 😀
// twitter @oludotcom
// November 2016
// Alexa - Premier League Football
 // version - 0.0.1
 // status  -   Under development

'use strict';

// configurations
var express = require('express'),
    alexa = require('alexa-app'),
    bodyParser = require('body-parser'),
    _ = require('lodash'),
    express_app = express(),
    fetch = require('node-fetch'),
    port = process.env.PORT || 8081;

var app = new alexa.app('EPL');


var myGlobal = {};
var clubLookup = [{
    club: "manchester united",
    clubName: "Manchester United FC"
}, {
    club: "everton",
    clubName: "Everton FC"
}];

app.launch(function(request, response) {
    response.say("Hello, how may I help you today");
});

// Intents
app.intent('getInfo', function(request, response) {
    var hello = _.filter(club_uid, ['club', myTeam.toLowerCase()]);
    console.log(hello[0].uid);
    response.say('get info here about ' + myTeam + hello[0].uid);
});

app.intent('whatClubIntent', function(request, response) {

    checkClubName(request.slot('club'));

    fetch('http://api.football-data.org/v1/competitions/426/leagueTable').then(function(res) {
        // Convert to JSON
        return res.json();
    }).then(function(data) {
        //`data` is a JavaScript object
        // searches through and return an object matching a specific team
        var tableStats = _.filter(data.standing, ['teamName', myGlobal.selectedTeam]);
        // grab the leagueTable header type to determine a response
        var table_column = request.slot('table_header')
        switch (table_column) {
            case 'position':
                response.say('is' + tableStats[0].position);
                response.send();
                break;
            case 'points':
                response.say('is' + tableStats[0].points);
                response.send();
                break;
            case 'goals':
                    response.say(myGlobal.selectedTeam+' have now scored' + tableStats[0].goals + 'goals');
                    response.send();
                    break;
            case 'wins':
            case 'draws':
            case 'losses':
            default:
                response.say('is' + table_column);
                response.send();
        }
    });
    return false;
});

function checkClubName(myTeam) {
    var thisTeam = myTeam.toLowerCase();
    var clubLookupResult = _.filter(clubLookup, ['club', thisTeam])
    myGlobal.selectedTeam = clubLookupResult[0].clubName;
    return myGlobal.selectedTeam;
}
//connect the alexa-app to aws lambda
exports.handler = app.lambda();
express_app.listen(port);
console.log('works');
