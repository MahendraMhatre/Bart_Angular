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


    });

    app.controller('detailsCtrl', function($scope, $http, $interval) {

        this.source = "ASHB";
        this.dest = "CIVC";

        this.isTrue = function() {
            return false;
        };


        $interval(this.getDetails = function(org , dest) {

            if(!(org === undefined) && !(dest === undefined)) {
                $http.get("http://bart.mahendramhatre.com/trains?source=" + org.abbr + "&dest=" + dest.abbr).success(function (result) {
                    console.log("Success", result);
                    $scope.resultTrip = result;
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
        this.tab = 1;
        
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


        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        this.createMarker = function (){
            mapOptions.center = new google.maps.LatLng(this.lat1, this.long1);
            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(this.lat1, this.long1),
                title: cities[0].city
            });
            marker.content = '<div class="infoWindowContent">' + cities[0].desc + '</div>';

        }
        this.createMarker();

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

            var directionsService = new google.maps.DirectionsService();
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
                avoidHighways: false,
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

