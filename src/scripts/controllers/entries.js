'use strict';

var angular = require('angular');

module.exports = function($scope, $http, $window, filterFilter) {

    var loader = document.querySelector('.app__loader');

    // Pagination
    $scope.currentPage = 1;
    $scope.entryLimit = 12;
    $scope.search = {};
    $scope.entries = [];
    $scope.levels = [];
    $scope.departments = [];

    $http.get('data.json').success(function(data) {

        loader.style.display = 'none';

        data.forEach(function(item) {
            // Format item

            var tags = item.tags ? item.tags.split(', ') : [];

            item.tags = [];

            tags.forEach(function(tag) {
                if (item.tags.indexOf(tag) === -1) {
                    item.tags.push(tag);
                }
            });

            // Add level 
            item.levels.forEach(function(level) {
                if ($scope.levels.indexOf(level) === -1) {
                    $scope.levels.push(level);
                }
            });
            

            // Add departments
            item.departments.forEach(function(department) {
                if ($scope.departments.indexOf(department) === -1) {
                    $scope.departments.push(department);
                }
            });

            // Add item
            $scope.entries.push(item);
        });

        // Sort
        $scope.levels = $scope.levels.sort();
        $scope.departments = $scope.departments.sort();

        $scope.totalItems = $scope.entries.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

        // $watch search to update pagination
        $scope.$watch('search', function (newVal) {
            $scope.filtered = filterFilter($scope.filteredEntries, newVal);
            $scope.totalItems = $scope.filtered.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 1;
        }, true);

    });

    $scope.visit = function ($event, path) {
        $event.preventDefault();
        $window.open(path, '_blank');
    };

    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.search = {};
    };

    $scope.exactOrEmpty = function (actual, expected) {
        if (!expected) {
           return true;
        }
        return angular.equals(expected, actual);
    };

};
