$(function(){
    //write all this stuff to a txt file
    document.getElementById("downloadButton").addEventListener("click",function(){

      var oReq = new XMLHttpRequest();
      // The Endpoint of your server
      var URLToPDF = "https://postaxation.com:3000/api/postaxv1deck";

      // Configure XMLHttpRequest
      oReq.open("GET", URLToPDF, true);

      // Important to use the blob response type
      oReq.responseType = "blob";

      // When the file request finishes
      // Is up to you, the configuration for error events etc.
      oReq.onload = function() {
          // Once the file is downloaded, open a new window with the PDF
          // Remember to allow the POP-UPS in your browser
          var file = new Blob([oReq.response], {
              type: 'application/pdf'
          });

          // Generate file download directly in the browser !
          saveAs(file, "PoSTaxV1Deck.pdf");
      };

      oReq.send();


})
