var mtrackApp=angular.module('mtrackApp', ['ngRoute','AppControllers']);

mtrackApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/app_details', {
        templateUrl: '../partials/no-app-selected.html',
        controller: 'PhoneListCtrl'
      }).
      when('/app_details/:appId', {
        templateUrl: '../partials/app-main.html',
        controller: 'AppController'
      }).
      otherwise({
        redirectTo: '../partials/app_details'
      });
  }]);


  mtrackApp.controller('HeaderCtrl', function($scope) {
    $scope.mtrack_version="0.0.1";
    $scope.apps=[{'name':'AutoBluetooth','id':'1'},{'name':'myKilos','id':'2'}];
    $scope.selected_app=null;
      
    $scope.select_app = function(app) {
        $scope.selected_app=app;        
    }; 
  });


