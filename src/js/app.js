'use strict';

var LeaderboardView = require('./views/leaderboard');
var HeaderView = require('./views/header');
var Leaderboard = require('./models/leaderboard');
var AboutView = require('./views/about');
var SubmitView = require('./views/submit');
var leaderboard = new Leaderboard();
var ViewSwitcher = require('ampersand-view-switcher');

// turn on code highlighting

var hljs = require('highlight.js');
hljs.initHighlightingOnLoad();

// get s3 data

var switcher = new ViewSwitcher(document.getElementById('leaderboard-container'));
var leaderboardView;

var submitView = new SubmitView();
var aboutView = new AboutView();

var hash = window.location.hash;

leaderboard.fetch({
    success: function(collection) {

        leaderboardView = new LeaderboardView({
            collection: collection
        });

        switcher.set(leaderboardView);

        new HeaderView({
            el: document.getElementById('topbar'),
            collection: collection
        });

        if (hash == '#about') {
            switcher.set(aboutView);
            $('body').animate({scrollTop:0}, 0)
        } else if (hash == '#submit') {
            switcher.set(submitView)
            $('body').animate({scrollTop:0}, 0)
        }
        
    }

});


$('#about').click(function() {
    switcher.set(aboutView);
});
$('#submit').click(function() {
    switcher.set(submitView);
});
$('#current').click(function() {
    switcher.set(leaderboardView);
});