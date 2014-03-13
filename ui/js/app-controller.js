var appModule=angular.module('AppControllers', []);
appModule.controller('AppController', function($scope,$routeParams,$http) {
    $scope.hbeat_today=0;
   
    $http.get('/api/1/hbeat/'+$routeParams.appId+'/today',{headers:{ 'Authorization' : '0GqtOtD4SSrJ1MUXj0ffkXLTt0a9ujYCZF6hMLtqfX7W0LA2SVQ3jPouAwgGnSa0'}})
    .success(function(data) {
      $scope.hbeat_today=data['beat_count'];
    }).error(function(data, status, headers, config) {
      $scope.hbeat_today=0;
      alert("Error "+status+" "+data);
    });
}); 