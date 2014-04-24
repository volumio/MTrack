var appModule = angular.module('AppControllers');
appModule.controller('AppSettingsController', function($scope, $routeParams, $http,$location) {
    $scope.app_id=$routeParams.appId;
    
    $http.get('/admin/app/'+$routeParams.appId, {headers: {'Content-Type': 'application/json'}}).success(function (app){
       if(app!=null)
       {
           $scope.app_details=app;
       }
    });
    
    $scope.delete_app=function() {
        var r=confirm("Delete application? Action is not reversible.");
        if (r==true)
        {
          $http.delete('/admin/app/' + $routeParams.appId , {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    console.log("Successo nella cancellazione. Hash="+$location.path());
                    $location.path("admin/private/index.html#/");
                }).error(function(data, status, headers, config) {
           about("An error occurred deleting this app");
        });
          
        }
    }
}); 