var app = angular.module('starterApp', ['ngMaterial','ngRoute','ngMessages']);

app.factory('socket',function(){
    var socket = io.connect('http://localhost:3000');
    return socket;
});

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'home.html'
        })
        .when('/create',{
            templateUrl: 'create.html'
        })
        .when('/view',{
            templateUrl: 'view.html'
        })
        .when('/delete',{ //Open delete.html
            templateUrl: 'delete.html'
        })
    ;
});

app.controller('HotelController',function($scope,$mdDialog,$http,socket) {

    $scope.hotelData = [];
    $scope.formData = {};
    $scope.voteData = {};
    $scope.hiddenrows = [];
    getHotelData();
    function getHotelData() {
        $http.get("/hotel").success(function(response){
            $scope.hotelData = response.data;
        });
    }
    $scope.submitHotel = function(ev) {
        var data = {
            "question" : $scope.formData.hotelQuestion,
            "hotels" : [{
                "option" : $scope.formData.hotelApartman1, "vote" : 0
            },{
                "option" : $scope.formData.hotelApartman2, "vote" : 0
            },{
                "option" : $scope.formData.hotelApartman3, "vote" : 0
            }]
        };
        var message = {"title" : "", "message" : ""};
        $http.post('/hotel',data).success(function(response) {
            if(response.responseCode === 0) {
                message.title = "Uspeh !";
                message.message = "Ponuda je uspešno napravljena.";
                data["id"] = response.data.generated_keys[0];
                $scope.hotelData.push(data);
            } else {
                message.title = "Greška !";
                message.message = "Greška u toku pravljenja ponude.";
            }
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(message.title)
                    .textContent(message.message)
                    .ok('U redu.')
                    .targetEvent(ev)
            );
        });
    }

    $scope.updateVote = function(index) {
        var data = {
            "id" : $scope.hotelData[index].id,
            "option" : $scope.hotelData[index].selected
        };
        $http.put("/hotel",data).success(function(response) {
            if(response.responseCode === 0) {
                console.log("Success");
                $scope.hiddenrows.push(index);
            } else {
                console.log("error");
            }
        });
    }

    $scope.delete = function(index) {
        $http({
            method: 'DELETE',
            url: '/hotel/',
            data: {
                "id" : $scope.hotelData[index],
                "option" : $scope.hotelData[index]
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        })
            .then(function(response) {
                console.log(response.data);
            }, function(rejection) {
                console.log(rejection.data);
            });

        alert = $mdDialog.alert({
            title: 'Uspeh',
            textContent: 'Podaci uspešno izbrisani.',
            ok: 'U redu.'
        });

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
                location.reload();
            });


    };

    socket.on('changeFeed',function(data) {
        for(var hotelCounter = 0 ;hotelCounter < $scope.hotelData.length; hotelCounter++) {
            if($scope.hotelData[hotelCounter].id === data.id) {
                $scope.hotelData[hotelCounter].hotels = data.hotels;
                $scope.$apply();
            }
        }
    });
});
