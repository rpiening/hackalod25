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
    $("#sidebar-naam").text("");
    $("#sidebar-geboorte").text("");
    $("#sidebar-overlijden").text("");
    $("#sidebar-beroep").text("");
    $("#sidebar-text-1").text("");
    $("#sidebar-japon").empty();
    $("#sidebar-stola").empty();
    $("#sidebar-hoed").empty();
    $("#sidebar-ketting").empty();
    $("#sidebar-kinderjurk").empty();
    isFrozen = false;
    activeShape = null;
  }

  function updateSidebarInfo(shape) {
    const IRI = $(shape).data("text");
    $("#sidebar-naam, #sidebar-geboorte, #sidebar-overlijden, #sidebar-beroep, #sidebar-text-1").empty();
    $("#sidebar-japon, #sidebar-stola, #sidebar-hoed, #sidebar-ketting, #sidebar-kinderjurk").empty();

    //  als je Aleida aanklikt
    if (IRI === "https://data.rkd.nl/sitters/17744") {
      $("#sidebar-japon").html('Aleida draagt een japon. <a href="japon.html">Vergelijkbare japonnen in het V&A museum</a>');
      $("#sidebar-stola").html('Aleida draagt een stola. <a href="stola.html">Vergelijkbare stola\'s in het V&A museum</a>');
      $("#sidebar-hoed").html('Aleida draagt een hoed met veren. <a href="hoed.html">Vergelijkbare hoeden in het V&A museum</a>');
      $("#sidebar-ketting").html('Aleida draagt een parelketting. <a href="parelketting.html">Vergelijkbare kettingen in het V&A museum</a>');
    }
    if (IRI !== "https://data.rkd.nl/sitters/17744" && IRI !== "https://data.rkd.nl/sitters/17774") {
      $("#sidebar-kinderjurk").html('Deze dochter draagt een jurk. <a href="kinderjurk.html">Vergelijkbare kinderjurken in Europeana</a>');
    }
    const NAME_API = 'https://api.rkd.triply.cc/queries/HackaLOD25/this-person/run?id=';
    const BIRTH_API = 'https://api.rkd.triply.cc/queries/HackaLOD25/birth/run?id=';
     const DEATH_API = 'https://api.rkd.triply.cc/queries/HackaLOD25/death/run?id=';
    const OCCUPATION_API = 'https://api.rkd.triply.cc/queries/HackaLOD25/beroep/run?id=';

    // naam
    fetch(NAME_API + IRI)
      .then(response => response.json())
      .then(data => { data.forEach(item => $("#sidebar-naam").text(item.nameRKD)); });

    // geboortedatum
    fetch(BIRTH_API + IRI)
      .then(response => response.json())
      .then(data => { data.forEach(item => $("#sidebar-geboorte").text("Geboortedatum in de RKDdatabases: " + item.birth_date + " te " + item.birth_place)); });

    //  overlijdensdatum
      fetch(DEATH_API+IRI)
      .then(response => response.json())
      .then(responseJson => { responseJson.forEach(item => {  
        $("#sidebar-overlijden").text("Overlijdensdatum in de RKDdatabases: "+item.death_date+" te "+item.death_place );
      })})
      .then(responseJson => { responseJson.forEach(item => { 
          $("#sidebar-overlijden-2").text(item.source);
      })});

    //  beroep
     fetch(OCCUPATION_API+IRI)
      .then(response => response.json())
      .then(data => {
        data.forEach((item, index) => $("#sidebar-text-" + (index + 1)).text(item.beroep));
      })
      .catch(error => console.error('Error fetching data:', error));

    $("#sidebar-text").text(IRI);
    showSidebar();
  }

  $(".shape").on("mouseenter", function () {
    if (isFrozen) return;
    clearTimeout(hideTimeout);
    updateSidebarInfo(this);
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
      if (!$(".shape:hover").length) hideSidebar();
    }, 200);
  });

  $(".shape").on("click", function (e) {
    e.stopPropagation();

    if (activeShape !== this) {
      activeShape = this;
      updateSidebarInfo(this);
    }

    isFrozen = true;
    showSidebar();
  });

  $(document).on("click", function (e) {
    if (isFrozen) {
      const isShape = $(e.target).closest(".shape").length > 0;
      const isSidebar = $(e.target).closest("#sidebar").length > 0;
      if (!isShape && !isSidebar) hideSidebar();
    }
  });

  $(document).on("contextmenu", function (e) {
    if (isFrozen) hideSidebar();
  });
});
