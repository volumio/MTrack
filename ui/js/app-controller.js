var appModule = angular.module('AppControllers', []);
appModule.controller('AppController', function($scope, $routeParams, $http) {
    $scope.hbeat_today = 0;

    $scope.refresh_hbeat = function()
    {
        $http.get('/api/1/hbeat/' + $routeParams.appId + '/today', {headers: {'Authorization': '0GqtOtD4SSrJ1MUXj0ffkXLTt0a9ujYCZF6hMLtqfX7W0LA2SVQ3jPouAwgGnSa0'}})
                .success(function(data) {
                    $scope.hbeat_today = data['beat_count'];
                }).error(function(data, status, headers, config) {
            $scope.hbeat_today = 0;
            alert("Error " + status + " " + data);
        });
    }
    
     $scope.onViewLoad = function(){
    };

    var data = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : [28,48,40,19,96,27,100]
		}
	]
}
          
         
          var ctx = document.getElementById("myChart").getContext("2d");
         ctx.canvas.width=window.innerWidth-200;
        ctx.canvas.height=200;
var myNewChart = new Chart(ctx).Line(data);
    $scope.refresh_hbeat();
    
    
}); 