const app = angular.module("carApp", ["ngMaterial"]);

app.controller("NavController", function ($scope, $http, carService) {
  $scope.activeTabNav = "home";
  $scope.currentView = "/views/home.html";
  $scope.showSidebar = false;

  $scope.setActiveNav = function (tab) {
    $scope.activeTabNav = tab;
    $scope.showSidebar = false;

    switch (tab) {
      case "home":
        $scope.currentView = "views/home.html";
        break;
      case "allCars":
        $scope.currentView = "/views/allCars.html";
        break;
      case "dashboard":
        $scope.currentView = "views/dashboard.html";
        $scope.showSidebar = true;
        break;
      case "login":
        $scope.currentView = "/components/auth/auth.html";
        break;
    }
  };

  $scope.isActiveNav = function (tab) {
    return $scope.activeTabNav === tab;
  };

  $scope.setActive = function (tab) {
    $scope.activeTab = tab;
    $scope.showSidebar = true;
    switch (tab) {
      case "addCar":
        $scope.currentView = "/views/addCar.html";
        break;
      case "manageCars":
        $scope.currentView = "views/manageCars.html";
        break;
    }
  };

  $scope.isActive = function (tab) {
    return $scope.activeTab === tab;
  };

  $scope.popupType = "login";
  $scope.loginData = {};
  $scope.customer = {};

  $scope.switchPopup = function (type, $event) {
    $event.preventDefault();
    $scope.popupType = type;
  };

  $scope.login = function () {
    $http.post("/api/customer/login", $scope.loginData).then(
      function (response) {
        alert("Giriş başarılı!");
        console.log("YANIT:", response.data); // ekle
        console.log("TOKEN:", response.data.token);
        $scope.isLoggedIn = true;
        localStorage.setItem("token", response.data.token);
        $scope.loginData = {};
        $scope.setActiveNav("home");
      },
      function (error) {
        alert("Giriş başarısız: " + error.data.message);
      }
    );
  };

  $scope.register = function () {
    $http.post("/api/customer/signup", $scope.customer).then(
      function (response) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        $scope.switchPopup("login", { preventDefault: function () {} }); // Kayıt sonrası login formu göster
      },
      function (error) {
        alert("Kayıt başarısız: " + error.data.message);
      }
    );
  };

  $scope.logout = function () {
    $scope.isLoggedIn = false;
    localStorage.removeItem("token");
    alert("Çıkış yapıldı");
    $scope.setActiveNav("home");
  };

  const token = localStorage.getItem("token");
  if (token) {
    $scope.isLoggedIn = true;
  }
  $scope.selectedCar = null;
  $scope.viewCar = function (car) {
    console.log("Seçilen araç:", car);
    carService.setCarId(car._id);
    $scope.selectedCar = car;
    $scope.currentView = "/views/carDetail.html";
  };
});
