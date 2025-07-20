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
        $scope.currentView = "/views/home.html";
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

  $scope.goBack = function () {
    
    if ($scope.previousTab) {
      $scope.setActiveNav($scope.previousTab);
      $scope.previousTab = null; 
    } else {
      $scope.setActiveNav("home"); 
    }
  };

  $scope.login = function () {
    $http.post("/api/customer/login", $scope.loginData).then(
      function (response) {
        alert("Giriş başarılı!");
        console.log("YANIT:", response.data);
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
  $scope.viewCar = function (car,fromTab) {
    console.log("Seçilen araç:", car);
    carService.setCarId(car._id);
    $scope.selectedCar = car;
    $scope.previousTab = fromTab;
    $scope.currentView = "/views/carDetail.html";
  };
});

app.controller("RentController", function ($http, $scope, carService) {
  const ctrl = this;

  ctrl.startDate = null;
  ctrl.endDate = null;
  ctrl.filteredCars = [];
  

  ctrl.getAvailableCars = function () {
    if (!ctrl.startDate || !ctrl.endDate) {
      alert("Lütfen tarihleri seçiniz.");
      return;
    }

    const startISO = new Date(ctrl.startDate).toISOString();
    const endISO = new Date(ctrl.endDate).toISOString();

    const url = `http://localhost:8000/api/rentcar/available?start=${startISO}&end=${endISO}`;

    $http
      .get(url)
      .then(function (response) {
        ctrl.filteredCars = response.data;
      })
      .catch(function (error) {
        console.error("API hatası:", error);
        alert("Araçlar getirilemedi.");
      });
  };

  ctrl.rentCar = function (car) {
    $scope.viewCar(car);
  };
});
