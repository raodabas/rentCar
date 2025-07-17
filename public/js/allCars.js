angular
  .module("carApp")
  .controller("AllCarController", function ($scope, $http) {
    $scope.cars = [];

    $http
      .get("/api/cars/all")
      .then(function (response) {
        $scope.cars = response.data;
      })
      .catch(function (error) {
        console.error("Araçlar yüklenemedi:", error);
      });
  });
