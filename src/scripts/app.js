'use strict';

// Fire up angular
var angular = require('angular');
var app = angular.module('accessibilityApp', []);

// Load controllers
app.controller('EntriesCtrl', ['$scope', '$http', '$window', 'filterFilter', require('./controllers/entries')]);

// Load filters
app.filter('highlight', ['$sce', require('./filters/highlight')]);
app.filter('startFrom', require('./filters/startForm'));
