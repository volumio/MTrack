var mtrackApp = angular.module('mtrackApp', ['ngRoute', 'AppControllers']);

mtrackApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/app_details', {
                    templateUrl: '../partials/no-app-selected.html'
                }).
                when('/app_details/:appId', {
                    templateUrl: '../partials/app-main.html',
                    controller: 'AppController'
                }).
                when('/app_settings/:appId', {
                    templateUrl: '../partials/app-settings.html',
                    controller: 'AppSettingsController'
                }).
                when('/create_app', {
                    templateUrl: '../partials/create-new-app.html'
                }).
                when('/settings', {
                    templateUrl: '../partials/settings.html'
                }).
                when('/', {
                    templateUrl: '../partials/no-app-selected.html'}).
                otherwise({
                    redirectTo: '/'
                });
    }]);


mtrackApp.controller('HeaderCtrl', function($scope,$http) {
    $scope.mtrack_version = "0.0.1";
    $scope.apps = []; //[{'name': 'AutoBluetooth', 'id': '1'}, {'name': 'myKilos', 'id': '2'}];
    $scope.selected_app = null;

    $scope.select_app = function(app) {
        $scope.selected_app = app;
    };

    $scope.refresh_app_list = function()
    {
        $http.get('/admin/user', {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    if (typeof data.apps != 'undefined')
                    {
                        for (var i in data.apps)
                        {
                            $http.get('/admin/app/'+data.apps[i], {headers: {'Content-Type': 'application/json'}}).success(function (app){
                               if(app!=null)
                               {
                                   $scope.apps.push({'name':app.name,'id':app.app_id});
                               }
                            });
                        }
                    }
                }).error(function(data, status, headers, config) {
            alert("Error " + status + " " + data);
        });
    };
    
    $scope.refresh_app_list();
});


