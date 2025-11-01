$(document).ready(function () {
$(".info").on("load", function(){
    const OCCUPATION_API = 'https://api.rkd.triply.cc/queries/HackaLOD25/beroep/run?id=';
    const IRI = $(this).data("text");

    //  beroep
     fetch(OCCUPATION_API+IRI)
      .then(response => response.json())
      .then(responseJson => {
        responseJson.forEach((item, index) => {
          const textField = $("beroep");
          textField.text(item.beroep);
        });
      })
      .catch(error => {
         console.error('Error fetching data:', error);
      });


     $("#sidebar-text").text(IRI);
     showSidebar();
    });
});