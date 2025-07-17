$(" .sidebar-side a").on("click", function () {
  $(" .sidebar-side").find("li.active").removeClass("active");
  $(this).parent("li").addClass("active");
});
