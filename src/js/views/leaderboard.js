'use strict';

var AmpersandView = require('ampersand-view');
var template = require('../../templates/views/leaderboard.jade');
var utils = require('../utils');
var d3 = require('d3')
var _ = require('lodash');

var LeaderboardView = AmpersandView.extend({
    
    utils: utils,
    _: _,
    template: template,
    autoRender: true,

    events: {
        'click .subtable': 'toggleRowDetails',
        'click .thumbnail': 'imageZoom',
        'mouseover .number': 'hoverDataset',
        'mouseout .number': 'hoverDatasetRemove'
    },

    imageZoom: function (e) {
        console.log(e)
        console.log('got click')
        var src = $(e.target).attr('src')
        var width = 500
        var height = 500
        
        $("#large").html("<img class='thumbnail-large-inset' src=" + src + " width=" + width + "px + height=" + height + "px />")
           .css("top", ( $(window).height() - height ) / 2+$(window).scrollTop() + "px")
           .css("left", ( $(window).width() - width ) / 2+$(window).scrollLeft() + "px")
           .fadeIn('fast');

        $("#background").css({"opacity" : "0.7"})
              .fadeIn('fast');  

        $("#background").click(function(){
            $("#background").fadeOut('fast');
            $("#large").fadeOut('fast');
        });

        $("#large").click(function(){
            $("#background").fadeOut();
            $("#large").fadeOut();
        });
    },

    toggleRowDetails: function(e) {

        var $target = $(e.target).find('tr.overview');

        if ($target.length == 0) {
            $target = $(e.target).closest('tr.overview');
        }

        if ($(e.target).hasClass('pull-request')) {
            return;
        }
        
        var $label = $target.find('.metric-label');//.toggle();
        var opacity = $label.css('opacity');
        if(opacity === '0') {
            $label.css({opacity: 1});
        } else {
            $label.css({opacity: 0});
        }
        $('tr.details[data-identifier="' + $target.data('identifier') + '"]').toggle();
    },

    hoverDatasetRemove: function(e) {
        this.timeoutInfo = setTimeout( function() {
            $('.dataset-name').replaceWith("<p class='dataset-name'>" + "(dataset info)" + "</p>")
        }, 100);
        
        this.timeoutOpacity = setTimeout( function() {
            d3.selectAll(".number").filter("*:not(.number-full)").style('opacity', function(d) {
                return 0.7
            })
        }, 50);
    },

    hoverDataset: function(e) {
        
        // find the current number
        var $target = $(e.target).closest('.number');

        // get the data set name (from the number) and submission identifier (from table body)
        var dataset = $target.attr('data-data')
        var datainfo = $target.attr('data-info')
        var identifier = $target.attr('data-identifier')

        // if both are defined
        if (identifier) {
            if (dataset) {
                // update image
                var newimg = "https://s3.amazonaws.com/code.neuro/neurofinder/images/" + identifier + "/" + dataset + "/sources.png"
                if (dataset != "overall") {
                    var image = $(e.target).parents('tbody').find('.submission-image').find('img')
                    image.attr("src", newimg)
                }

                // update style on column
                clearTimeout(this.timeoutOpacity)
                d3.selectAll(".number").filter("*:not(.number-full)").style('opacity', function(d) {
                    return 0.7
                })
                d3.selectAll("[data-data='" + dataset + "']")
                  .filter("[data-identifier='" + identifier + "']")
                  .filter("*:not(.number-full)")
                  .style('opacity', function(d) {
                    if (identifier) {
                        return 1.0
                    } else {
                        return 0.7
                    }
                })
            }
        } 
        if (dataset) {
            // get description
            var ind = _.indexOf(this.collection.models[0].getDatasets(), dataset)
            console.log(ind)
            clearTimeout(this.timeoutInfo)
            $('.dataset-name').replaceWith("<p class='dataset-name'>" + datainfo + "</p>")
        }

    }


});



module.exports = LeaderboardView;

