//page 2

// Check browser support
if (typeof(Storage) !== "undefined") {

  // Retrieve
  //ids are for elements in side nav user home base
  document.getElementById("account").transformation_landing_page = localStorage.account;
  document.getElementById("startdate").transformation_landing_page = localStorage.startdate;
  document.getElementById("enddate").transformation_landing_page = localStorage.enddate;


} else {
  document.getElementById("account").innerHTML = "Sorry, your browser does not support Web Storage...";
}
