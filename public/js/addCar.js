angular
  .module("carApp")
  .controller("AddCarController", function ($scope, $http) {
    $scope.car = {};

    $scope.addCar = function () {
      console.log("Form verisi:", $scope.car);

      $http
        .post("/api/cars/createCar", $scope.car)
        .then(function (response) {
          console.log("Kayıt başarılı:", response);
          $scope.success = "Araç başarıyla eklendi!";
          $scope.error = "";
          $scope.car = {}; 
        })
        .catch(function (error) {
          console.error("Kayıt başarısız:", error);
          $scope.error = error.data.message || "Bir hata oluştu.";
          $scope.success = "";
        });
    };
  });
