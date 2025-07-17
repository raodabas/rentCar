app.controller("RentedCarsController", function ($scope, $http) {
  $scope.rentedCars = [];

  const token = localStorage.getItem("token");

  $http
    .get("http://localhost:8000/api/rentcar/getrent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      console.log("Kiralanan araçlar:", response.data);
      $scope.rentedCars = response.data;
    })
    .catch(function (error) {
      console.error("Araçlar alınamadı:", error);
      $scope.rentedCars = []; // hata durumunda boş bırak
    });
});
