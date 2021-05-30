var love = 1
if (localStorage.getItem('account') === "Olivia Paige Peluso" === true) {
  //bypass ajax program
  localStorage.setItem("love", 'yes');
}

else{
  localStorage.removeItem("love")
}

if (localStorage.getItem('love') === 'yes'){
  //remove chart
  //remove table 1
  //remove table 2
  //insert image tag heart.
  var elem = document.createElement("img");
  elem.setAttribute("src", "./images/heart.png");
  elem.setAttribute("height", "600");
  elem.setAttribute("width", "724");
  extraContent.style.display = 'block';
  document.getElementById('extraContent').appendChild(elem)

}
