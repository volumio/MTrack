var appModule = angular.module('AppControllers', []);
appModule.controller('AppController', function($scope, $routeParams, $http) {
    $scope.hbeat_today = 0;
    $scope.app_id=$routeParams.appId;
    
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
                        
                        var time=new moment(hbeats[i].day);
                        graph_data.labels.push(time.format("DD/MM"));
                        
                        graph_data.datasets[0].data.push(hbeats[i].beat_count);
                    }
                    $scope.hbeat_graph_data = graph_data;
                    $scope.refresh_graph();
                }).error(function(data, status, headers, config) {
            $scope.hbeat_graph_data = 0;
        });
    }
    
    $scope.get_feedbacks = function()
    {
        $http.get('/api/1/feedback/' + $routeParams.appId , {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    
                    for(var i in data.feedbacks)
                    {
                        var feedback=data.feedbacks[i];
                        var time=new moment(parseInt(feedback.id));
                        feedback.timestamp_str=time.format("DD/MM HH:mm:ss");
                    }
                    $scope.feedbacks = data.feedbacks;
                }).error(function(data, status, headers, config) {
            $scope.feedbacks = null;
            alert("Error " + status + " " + data);
        });
    }
    
    $scope.delete_feedback=function(id)
    {
        var r=confirm("Delete feedback?");
        if (r==true)
        {
          $scope.delete_feedbacks(id);  
          
        }
        
    }
    
    $scope.delete_feedbacks = function(id)
    {
        $http.delete('/api/1/feedback/' + $routeParams.appId +'/'+id, {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    $scope.get_feedbacks();
                }).error(function(data, status, headers, config) {
           
        });
    }
 
    $scope.get_exceptions = function()
    {
        $http.get('/api/1/exception/' + $routeParams.appId , {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    
                    for(var i in data.exceptions)
                    {
                        var exception=data.exceptions[i];
                        var time=new moment(parseInt(exception.id));
                        exception.timestamp_str=time.format("DD/MM HH:mm:ss");
                    }
                    $scope.exceptions = data.exceptions;
                }).error(function(data, status, headers, config) {
            $scope.exceptions = null;
            alert("Error " + status + " " + data);
        });
    }
    
    $scope.delete_exception=function(app_id,id)
    {
        var r=confirm("Delete exception trace?");
        if (r==true)
        {
          $scope.delete_exception_by_id(app_id,id);  
          
        }
        
    }
    
    $scope.delete_exception_by_id = function(app_id,id)
    {
        $http.delete('/api/1/exception/' + app_id +'/'+id, {headers: {'Content-Type': 'application/json'}})
                .success(function(data) {
                    $scope.get_exceptions();
                }).error(function(data, status, headers, config) {
           alert(status+"\n"+data);
        });
    }



    $scope.refresh_graph=function(){
    var ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.width = window.innerWidth - 400;
    ctx.canvas.height = 200;
    var myNewChart = new Chart(ctx).Line($scope.hbeat_graph_data);
}
    
    $scope.refresh_hbeat();
    $scope.refresh_hbeat_graph();
    $scope.refresh_graph();
    $scope.get_feedbacks();
    $scope.get_exceptions();
}); 