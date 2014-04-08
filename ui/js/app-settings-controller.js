var appModule = angular.module('AppControllers');
appModule.controller('AppSettingsController', function($scope, $routeParams, $http) {
    $scope.hbeat_today = 0;
    $scope.app_id=$routeParams.appId;
    
    $http.get('/admin/app/'+$routeParams.appId, {headers: {'Content-Type': 'application/json'}}).success(function (app){
       if(app!=null)
       {
           $scope.app_details=app;
       }
    });
}); 