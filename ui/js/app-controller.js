var appModule = angular.module('AppControllers', []);
appModule.controller('AppController', function($scope, $routeParams, $http) {
    $scope.hbeat_today = 0;
    $scope.hbeat_graph_data = {
        labels: ["Loading data..."],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: [0]
            }
        ]
    }
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

    $scope.refresh_hbeat_graph = function()
    {
        $http.get('/api/1/hbeat/' + $routeParams.appId + '/month', {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    var graph_data = {labels: [],
                        datasets: [
                            {
                                fillColor: "rgba(151,187,205,0.5)",
                                strokeColor: "rgba(151,187,205,1)",
                                pointColor: "rgba(151,187,205,1)",
                                pointStrokeColor: "#fff",
                                data: []
                            }
                        ]}

                    var hbeats=data.hbeats;
                    for(var i in hbeats)
                    {
                        
                        var time=new moment();
                        graph_data.labels.push(time.format("DD/MM"));
                        
                        graph_data.datasets[0].data.push(hbeats[i].beat_count);
                    }
                    $scope.hbeat_graph_data = graph_data;
                    $scope.refresh_graph();
                }).error(function(data, status, headers, config) {
            $scope.hbeat_graph_data = 0;
        });
    }

    $scope.onViewLoad = function() {
    };



    $scope.refresh_graph=function(){
    var ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.width = window.innerWidth - 400;
    ctx.canvas.height = 200;
    var myNewChart = new Chart(ctx).Line($scope.hbeat_graph_data);
}
    
    $scope.refresh_hbeat();
    $scope.refresh_hbeat_graph();
    $scope.refresh_graph();
}); 