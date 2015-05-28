'use strict';

var $ = require('jquery');

module.exports = function($scope, $http, filterFilter) {

    var $loader = $('.app__loader');

    // Pagination
    $scope.currentPage = 1;
    $scope.entryLimit = 12;
    $scope.search = {};
    $scope.entries = [];
    $scope.levels = [];
    $scope.departments = [];

    $http.get('data.json').success(function(data) {

        $loader.hide();

        data.forEach(function(item) {
            // Format item
            item.departments = item.department ? item.department.split(', ') : [];
            delete item.department;

            var tags = item.tags ? item.tags.split(', ') : [];

            item.tags = [];

            tags.forEach(function(tag) {
                if (item.tags.indexOf(tag) === -1) {
                    item.tags.push(tag);
                }
            });

            // Add level 
            if ($scope.levels.indexOf(item.level) === -1) {
                $scope.levels.push(item.level);
            }

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
        $scope.$watch('search', function (newVal, oldVal) {
            $scope.filtered = filterFilter($scope.entries, newVal);
            $scope.totalItems = $scope.filtered.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 1;
        }, true);

    });

    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.search = {};
    };

};
