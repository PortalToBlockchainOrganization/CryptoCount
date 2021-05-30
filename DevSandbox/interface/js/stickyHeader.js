var x = window.matchMedia("(min-width: 700px)")
console.log(x)
if(x.matches == false){
  throw new Error("On mobile");
}

window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  }
  else {
    header.classList.remove("sticky");
  }

}
