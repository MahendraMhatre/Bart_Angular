/**
 * Created by mahendramhatre on 3/2/17.
 */
(function() {
    var app = angular.module('gemStore', []);


    app.controller('customersCtrl', function($scope, $http) {

        this.source ="";
        this.destination = "";
        this.stationInfo = "";

        this.setSource = function(newValue){
            this.source = newValue;
        };

        this.setDestination = function(newValue){
            this.destination = newValue;
        };

        $http.get("http://bart.mahendramhatre.com/stations").success(function(result) {
                console.log("Success", result);
                $scope.resultGet = result;
            }).error(function() {
                console.log("error");
            });

        this.getTrips = function() {
            
            $http.get("http://bart.mahendramhatre.com/stations").success(function(result) {
                console.log("Success", result);
                $scope.resultGet = result;
            }).error(function() {
                console.log("error");
            });
        };


        this.getStation = function(station) {

            $http.get("http://bart.mahendramhatre.com/station?source="+station).success(function(result) {
                console.log("Success", result);
                $scope.resultS = result;

            }).error(function() {
                console.log("error");
            });
        };


        $scope.lat1 =  37.765062;
        $scope.long1 = -122.419694;

        var cities = [
            {
                city : 'SFO',
                desc : 'This city is live!',
                lat :  this.lat1,
                long : this.long1
            }
        ];
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng( $scope.lat1, $scope.long1),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }


        var marker = "";
        $scope.map ="";
        $scope.createMarker = function (){
            mapOptions.center = new google.maps.LatLng($scope.lat1, $scope.long1);
            $scope.map = new google.maps.Map(document.getElementById('mapElement'), mapOptions);
            marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng($scope.lat1, $scope.long1)

            });

        };

        $scope.change = function(sLat, sLong) {
            $scope.lat1 = sLat;
            $scope.long1 = sLong;
        };

        $scope.createMarker();


    });

    app.filter('formatTimer', function () {
        return function (input) {
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var seconds = input % 60;
            var minutes = Math.floor(input / 60);
            var hours = Math.floor(minutes / 60);
            return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
        };
    });


    app.controller('detailsCtrl', function($scope, $http, $interval, $timeout) {


        this.isTrue = function() {
            return false;
        };


        $scope.timeFound = false;
        $scope.noTrainFound = false;
        $scope.countTime = 0;
        var mytimeout;
        $scope.getTimer = function (ans) {
            var currentTime = new Date().getTime();
            var loopRun = true;
            var realDate = currentTime;
            angular.forEach(ans.schedule.request.trip, function (trip) {
                if(loopRun){
                    var dateString = trip["@attributes"].origTimeDate + trip["@attributes"].origTimeMin;
                    realDate = new Date(dateString);
                    realDate = realDate.getTime();
                    if(realDate > currentTime) {
                        loopRun = false;
                    }
                }

            });

            var tempCounter = 60 + Math.floor((realDate - currentTime) / 1000);
            if( tempCounter < 0) {
                $scope.countTime = 0;
                $scope.noTrainFound = true;
                $scope.timeFound = false;
            } else {
                $scope.noTrainFound = false;
                $scope.countTime = tempCounter;
                $scope.timeFound = true;

            }
            if (!(mytimeout === undefined)) {
                $timeout.cancel(mytimeout);

            }
            $scope.onTimeout = function () {
                if($scope.countTime <= 0) {
                    $scope.countTime = 0;
                    $scope.getRoutes();
                    $scope.noTrainFound = true;
                    $scope.timeFound = false;

                }
                else {
                    $scope.countTime--;
                    $scope.noTrainFound = false;
                    $scope.timeFound = true;

                }
                mytimeout = $timeout($scope.onTimeout, 1000);
            };
            mytimeout = $timeout($scope.onTimeout, 1000);
        };


        $interval($scope.getDetails = function(org , dest) {

            if(!(org === undefined) && !(dest === undefined)) {

                $http.get("http://bart.mahendramhatre.com/trains?source=" + org.abbr + "&dest=" + dest.abbr).success(function (result) {
                    console.log("Success", result);
                    $scope.resultTrip = result;

                    if(!($scope.resultTrip.schedule === undefined) ){
                        $scope.getTimer($scope.resultTrip);
                    }
                    else {
                        $scope.countTime= 0;
                        $timeout.cancel(mytimeout);
                    }

                }).error(function () {
                    console.log("error");
                });


            };

        },30000);
        

    });


    app.controller('stationCtrl', function(){
        this.tab = 0;
         this.setValue = function(value) {
             this.tab = value;
         },
        this.getValue = function() {
            return false;
        }
    });


    app.controller('TabController', function(){
        this.tab = 2;

        this.setTab = function(newValue){
            this.tab = newValue;
        };

        this.isSet = function(tabName){
            return this.tab === tabName;
        };
    });




    app.directive("stationInfo", function() {
        return {
          restrict: 'E',
            templateUrl: 'station_info.html'
        };
    });

    app.controller('MapCtrl', function ($scope) {

        this.lat1 =  37.765062;
        this.long1 = -122.419694;

        var cities = [
            {
                city : 'SFO',
                desc : 'This city is live!',
                lat :  this.lat1,
                long : this.long1
            }
        ];
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng( this.lat1, this.long1),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }


        var marker = "";
        $scope.map ="";
        this.createMarker = function (){
            mapOptions.center = new google.maps.LatLng(this.lat1, this.long1);
            $scope.map = new google.maps.Map(document.getElementById('mapElement'), mapOptions);
            marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(this.lat1, this.long1)

            });

        }


    });

    app.controller("tripsCtrl" , function() {

        this.lat2 = "";
        this.lat3 = "";
        this.long2 = "";
        this.long3 = "";

        this.initMap = function(org, dest) {

            if(!(org === undefined)){
                this.lat2 = org.gtfs_latitude;
                this.long2 = org.gtfs_longitude;
            }
            if(!(dest === undefined)) {
                this.lat3 = dest.gtfs_latitude;
                this.long3 = dest.gtfs_longitude;
            }
            var pointA = new google.maps.LatLng(this.lat2, this.long2);
            var pointB = new google.maps.LatLng(this.lat3, this.long3);
            var myOptions = {
                    zoom: 8,
                    center: pointA,
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };
            var map1 = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

            var markerA = new google.maps.Marker({
                    map: map1,
                    position: pointA,
                    title: "point A",
                    label: "A"

                });
            var markerB = new google.maps.Marker({
                    map: map1,
                    position: pointB,
                    title: "point B",
                    label: "B"

                });

            // get route from A to B

            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map1
            });

            this.calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);


        };

        this.calculateAndDisplayRoute = function(directionsService, directionsDisplay, pointA, pointB) {
            var request = {
                origin: pointA,
                destination: pointB,
                avoidTolls: true,
                travelMode: google.maps.TravelMode.TRANSIT
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
                else {
                    console.log('Directions request failed due to ' + status);
                }
            });
        };

        this.initMap();
    });


})();

