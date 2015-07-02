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
        'mouseover .number': 'hoverDataset',
        'mouseout .number': 'hoverDatasetRemove'
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
        this.timeout = setTimeout( function() {
            $('.dataset-name').replaceWith("<p class='dataset-name'>" + "(hover for dataset info)" + "</p>")
        }, 100);
        
        d3.selectAll(".number").filter("*:not(.number-full)").style('opacity', function(d) {
            return 0.75
        })
    },

    hoverDataset: function(e) {
        
        // find the current number
        var $target = $(e.target).closest('.number');

        // get the data set name (from the number) and submission identifier (from table body)
        var dataset = $target.attr('data-data')
        var identifier = $target.attr('data-identifier')

        // if both are defined
        if (identifier) {
            if (dataset) {
                // update image
                var newimg = "https://s3.amazonaws.com/code.neuro/neurofinder/images/" + identifier + "/" + dataset + "/sources.png"
                var image = $(e.target).parents('tbody').find('.submission-image').find('img')
                image.attr("src", newimg)

                // update style on column
                d3.selectAll("[data-data='" + dataset + "']")
                  .filter("[data-identifier='" + identifier + "']")
                  .filter("*:not(.number-full)")
                  .style('opacity', function(d) {
                    if (identifier) {
                        return 1.0
                    } else {
                        return 0.75
                    }
                })
            }
        } 
        if (dataset) {
            // get description
            var ind = _.indexOf(this.collection.models[0].getDatasets(), dataset)
            console.log(ind)
            clearTimeout(this.timeout)
            $('.dataset-name').replaceWith("<p class='dataset-name'>" + dataset + "</p>")
            $('.dataset-contributors').replaceWith("<p class='dataset-contributors'>" + dataset + "</p>")
        }

    }


});



module.exports = LeaderboardView;

