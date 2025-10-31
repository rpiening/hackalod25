$(document).ready(function () {
  let hideTimeout;
  let isFrozen = false;
  let activeShape = null;

  function showSidebar() {
    clearTimeout(hideTimeout);
    $("#sidebar").addClass("visible");
  }

  function hideSidebar() {
    $("#sidebar").removeClass("visible");
    $("#sidebar-text").text("");
    isFrozen = false;
    activeShape = null;
  }

  $(".shape").on("mouseenter", function() {
     clearTimeout(hideTimeout);
     const OCCUPATION_API = 'https://api.rkd.triply.cc/queries/HackaLOD25/beroep/1/run?id=';
     const IRI = $(this).data("text");
     fetch(OCCUPATION_API+IRI)
      .then(response => response.json())
      .then(responseJson => {
        responseJson.forEach((item, index) => {
          const textField = $("#sidebar-text-" + (index + 1));
          textField.text(item.beroep);
        });
      })
      .catch(error => {
         console.error('Error fetching data:', error);
      });
     $("#sidebar-text").text(IRI);
     showSidebar();
  });

  $(".shape").on("mouseleave", function () {
    if (isFrozen) return;
    hideTimeout = setTimeout(() => {
      if (!$(".shape:hover").length && !$("#sidebar").is(":hover")) {
        hideSidebar();
      }
    }, 200);
  });

  $("#sidebar").on("mouseenter", function () {
    if (isFrozen) return;
    clearTimeout(hideTimeout);
    showSidebar();
  });

  $("#sidebar").on("mouseleave", function () {
    if (isFrozen) return;
    hideTimeout = setTimeout(() => {
      if (!$(".shape:hover").length) {
        hideSidebar();
      }
    }, 200);
  });

  $(".shape").on("click", function (e) {
    e.stopPropagation();
    const text = $(this).data("text");
    $("#sidebar-text").text(text);
    showSidebar();
    isFrozen = true;
    activeShape = this;
  });

  $(document).on("click", function (e) {
    if (isFrozen) {
      const isShape = $(e.target).closest(".shape").length > 0;
      const isSidebar = $(e.target).closest("#sidebar").length > 0;
      if (!isShape && !isSidebar) {
        hideSidebar();
      }
    }
  });

  $(document).on("contextmenu", function (e) {
    if (isFrozen) {
      hideSidebar();
    }
  });
});
