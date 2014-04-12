var appModule = angular.module('AppControllers', []);
appModule.controller('AppController', function($scope, $routeParams, $http, $interval) {
    $scope.hbeat_today = 0;
    $scope.app_id=$routeParams.appId;
    
    $scope.hbeat_locale_data=[{
		value : 50,
		color : "#E2EAE9"
	}];
    $scope.hbeat_locale_data_strings=[{key:"Not set",value:0}];
    $scope.hbeat_osversion_data=[{
		value : 50,
		color : "#E2EAE9"
	}];
    $scope.hbeat_osversion_data_strings=[{key:"Not set",value:0}];
    $scope.hbeat_appversion_data=[{
		value : 50,
		color : "#E2EAE9"
	}];
    $scope.hbeat_appversion_data_strings=[{key:"Not set",value:0}];
    
    
    $http.get('/admin/app/'+$routeParams.appId, {headers: {'Content-Type': 'application/json'}}).success(function (app){
       if(app!=null)
       {
           $scope.app_details=app;
       }
    });
    
    $scope.getRandomColor=function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }
    
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
        $http.get('/api/1/hbeat/' + $routeParams.appId + '/today', {headers: {'Content-Type': 'application/json'}})
                                                                    //{'Authorization': '0GqtOtD4SSrJ1MUXj0ffkXLTt0a9ujYCZF6hMLtqfX7W0LA2SVQ3jPouAwgGnSa0'}})
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
                        
                        if(typeof hbeats[i].locale !='undefined')
                        {
                            $scope.hbeat_locale_data=[];
                            $scope.hbeat_locale_data_strings=[];
                            
                            for(var j in hbeats[i].locale)
                            {
                                var color=$scope.getRandomColor();
                                $scope.hbeat_locale_data.push({value:hbeats[i].locale[j],color : color});
                                $scope.hbeat_locale_data_strings.push({key:j,value:hbeats[i].locale[j]});
                            }
                        }
                        
                        if(typeof hbeats[i].osversion !='undefined')
                        {
                            $scope.hbeat_osversion_data=[];
                            $scope.hbeat_osversion_data_strings=[];
                            
                            for(var j in hbeats[i].osversion)
                            {
                                var color=$scope.getRandomColor();
                                $scope.hbeat_osversion_data.push({value:hbeats[i].osversion[j],color : color});
                                $scope.hbeat_osversion_data_strings.push({key:j,value:hbeats[i].osversion[j]});
                            }
                        }
                        
                        if(typeof hbeats[i].appversion !='undefined')
                        {
                            $scope.hbeat_appversion_data=[];
                            $scope.hbeat_appversion_data_strings=[];
                            
                            for(var j in hbeats[i].appversion)
                            {
                                var color=$scope.getRandomColor();
                                $scope.hbeat_appversion_data.push({value:hbeats[i].appversion[j],color : color});
                                $scope.hbeat_appversion_data_strings.push({key:j,value:hbeats[i].appversion[j]});
                            }
                        }
                    }
                    $scope.hbeat_graph_data = graph_data;
                    $scope.refresh_graph();
                    $scope.refresh_locale_graph();
                    $scope.refresh_osversion_graph();
                    $scope.refresh_appversion_graph();
        
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
    
    $scope.refresh_locale_graph=function(){
        var ctx = document.getElementById("localeChart").getContext("2d");
        var myNewChart = new Chart(ctx).Doughnut($scope.hbeat_locale_data);
    }
    
    $scope.refresh_osversion_graph=function(){
        var ctx = document.getElementById("osversionChart").getContext("2d");
        var myNewChart = new Chart(ctx).Doughnut($scope.hbeat_osversion_data);
    }
    
    $scope.refresh_appversion_graph=function(){
        var ctx = document.getElementById("appversionChart").getContext("2d");
        var myNewChart = new Chart(ctx).Doughnut($scope.hbeat_appversion_data);
    }
    
    $scope.refresh_page_data=function()
    {
        $scope.refresh_hbeat();
        $scope.refresh_hbeat_graph();
        $scope.refresh_locale_graph();
        $scope.refresh_osversion_graph();
        $scope.refresh_appversion_graph();
        $scope.get_feedbacks();
        $scope.get_exceptions();
    }
    
    var stopTime = $interval($scope.refresh_page_data, 60000);
 
    $scope.$on("$destroy", function(){
       $interval.cancel(stopTime);
    });    
    
    $scope.refresh_page_data();
}); 