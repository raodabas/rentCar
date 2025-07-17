app.config(function ($mdThemingProvider) {
  $mdThemingProvider
    .theme("default")
    .primaryPalette("blue")
    .accentPalette("pink");
});

app.service("carService", function () {
  let carId = null;

  return {
    setCarId: function (id) {
      carId = id;
    },
    getCarId: function () {
      return carId;
    },
  };
});

app.controller("carDetailController", function ($scope, $http, carService) {
  console.log("carDetailController yüklendi");

  const carId = carService.getCarId();

  if (carId) {
    $http.get("/api/cars/" + carId).then(
      function (response) {
        console.log("Araç verisi:", response.data);
        $scope.car = response.data;
      },
      function (error) {
        console.error("Araç alınamadı:", error);
        $scope.error = "Araç bilgisi getirilemedi.";
      }
    );
  } else {
    $scope.error = "Geçerli bir ID bulunamadı.";
  }
});

app.controller("rentController", function ($http, carService) {
  const vm = this;

  vm.startDate = null;
  vm.endDate = null;

  // Tarihler arası gün sayısını hesapla
  vm.getDayCount = function () {
    if (!vm.startDate || !vm.endDate) return 0;

    const start = new Date(vm.startDate);
    const end = new Date(vm.endDate);

    // Saat farkı → gün sayısına çevir
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };
  vm.rentCar = function () {
    const token = localStorage.getItem("token");
    let customerId;

    try {
      const decodedToken = jwt_decode(token); // JWT içeriğini çöz
      customerId = decodedToken.customerId;
    } catch (error) {
      alert("Lütfen giriş yapın.");
      return;
    }

    const data = {
      customerId: customerId,
      carId: carService.getCarId(),
      startDate: vm.startDate,
      endDate: vm.endDate,
    };
    console.log("Gönderilen data:", data);

    if (!data.carId) {
      alert("Araç ID bulunamadı!");
      return;
    }

    $http
      .post("/api/rentcar/rent", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (res) {
        alert("Araç başarıyla kiralandı!");
      })
      .catch(function (err) {
        alert("Hata: " + (err.data.message || "Bilinmeyen bir hata oluştu."));
      });
  };
});
