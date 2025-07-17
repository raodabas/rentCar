angular
  .module("carApp")
  .controller("rentController", function ($http, carService, $scope) {
    const ctrl = this;
    ctrl.startDate = null;
    ctrl.endDate = null;
    ctrl.filteredCars = [];

    ctrl.getAvailableCars = function () {
      alert("🚗 ARAÇ BUL butonuna tıklandı");

      if (!ctrl.startDate || !ctrl.endDate) {
        alert("Tarihleri seçiniz.");
        return;
      }

      const start = new Date(ctrl.startDate).toISOString();
      const end = new Date(ctrl.endDate).toISOString();

      console.log(
        "İstek URL:",
        `http://localhost:8000/api/rentcar/available?start=${start}&end=${end}`
      );

      $http
        .get(
          `http://localhost:8000/api/rentcar/available?start=${start}&end=${end}`
        )
        .then(function (response) {
          console.log("Gelen araçlar:", response.data);
          ctrl.filteredCars = response.data;
        })
        .catch(function (error) {
          console.error("Hata oluştu:", error);
          alert("Araçlar yüklenemedi.");
        });
    };

    ctrl.viewCar = function (car) {
      console.log("Seçilen araç:", car);
      carService.setCarId(car._id);
      $scope.selectedCar = car;
      $scope.currentView = "/views/carDetail.html";
    };

    ctrl.getDayCount = function () {
      if (ctrl.startDate && ctrl.endDate) {
        const diff = new Date(ctrl.endDate) - new Date(ctrl.startDate);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
      return 0;
    };
  });
