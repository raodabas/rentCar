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
      $scope.rentedCars = []; 
    });

  // Kiralamayı iptal et
  $scope.cancelRental = function (rentalId) {
    alert("Silinecek kiralama ID'si: " + rentalId);

    if (!confirm("Bu kiralama işlemini iptal etmek istediğinize emin misiniz?"))
      return;

    $http
      .delete(`http://localhost:8000/api/rentcar/delete/${rentalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
      
        $scope.rentedCars = $scope.rentedCars.filter(function (rental) {
          return rental._id !== rentalId;
        });
        alert("Kiralama iptal edildi.");
      })
      .catch(function (error) {
        console.error("Kiralama iptal edilemedi:", error);
        alert("Kiralama iptal edilirken bir hata oluştu.");
      });
  };
});
