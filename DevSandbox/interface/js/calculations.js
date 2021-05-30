
//WORKS
//DELETE ARRAY CHARACTER PATCH AFTER THE MERC IS IMPLEMENTED IN AJAX.JS

//cash method
var cashValueVector = localStorage.getItem('cashValue')
var floatCashValueVector = cashValueVector.split(',').map(function(item){
  return parseFloat(item)
})
var summedCashValueVector = 0;
for(i = 0; i < floatCashValueVector.length; i++){
  summedCashValueVector += parseFloat(floatCashValueVector[i])
}

//depleiton method

var depletionVector = localStorage.getItem('rewDepl')
var floatDepletionVector = depletionVector.split(',').map(function(item){
  return parseFloat(item)
})
var summedDepletionVector = 0
for(i = 0; i < floatDepletionVector.length; i++){
  summedDepletionVector += parseFloat(floatDepletionVector[i])
}

//mv dilution method
var dilutionVector = localStorage.getItem('rewDil')
var floatDilutionVector = dilutionVector.split(',').map(function(item){
  return parseFloat(item)
})
var summedDilutionVector = 0
for(i = 0; i < floatDilutionVector.length; i++){
  summedDilutionVector += parseFloat(floatDilutionVector[i])
}


//calaculate the margin between them
var marginOfDepletionToCashValue = summedCashValueVector - summedDepletionVector
var marginOfDilutionToCashValue = summedCashValueVector - summedDilutionVector
var marginOfDepletionToDilution = summedDepletionVector - summedDilutionVector


//round the sum
var roundedSummedCashValueVector = Number((summedCashValueVector).toFixed(2))
var roundedSummedDepletionVector = Number((summedDepletionVector).toFixed(2))
var roundedSummedDilutionVector =  Number((summedDilutionVector).toFixed(2))

//round the margins
var roundedMarginOfDepletionToCashValue = Number((marginOfDepletionToCashValue).toFixed(2))
var roundedMarginOfDilutionToCashValue = Number((marginOfDilutionToCashValue).toFixed(2))
var roundedMarginOfDepletionToDilution =  Number((marginOfDepletionToDilution).toFixed(2))

//checks for positive value and appends a + to the variable   -- this is important for the roundMargin of depletion to diluton
/*
if (Math.sign(difference) == 1) {
  difference = '+' + difference
}
*/

$(function(){

//output cash Value method onto the DOM
var cashValueMethodRewardIncomeDOMElement = document.getElementById('cashValueMethodRewardIncome1');
cashValueMethodRewardIncomeDOMElement.textContent += "$" + roundedSummedCashValueVector + " USD";

//output depletion method onto the DOM
var depletionMethodRewardIncomeDOMElement = document.getElementById('depletionMethodRewardIncome');
depletionMethodRewardIncomeDOMElement.textContent += "$" + roundedSummedDepletionVector + " USD"

//output dilution method reward income onto the DOM
var dilutionMethodRewardIncomeDOMElment = document.getElementById('dilutionMethodRewardIncome')
dilutionMethodRewardIncomeDOMElment.textContent += "$" + roundedSummedDilutionVector + " USD"

//output depletion to cash value margin onto the dom
var marginDepletionToCashValueDOMElement = document.getElementById('depletionToCashValueMargin')
marginDepletionToCashValueDOMElement.textContent += "$" + roundedMarginOfDepletionToCashValue + " USD"

//output dilutoin to cash value margin onto the DOM
var marginDilutionToCashValueDOMElement = document.getElementById('dilutionToCashValueMargin')
marginDilutionToCashValueDOMElement.textContent += "$" + roundedMarginOfDilutionToCashValue + " USD"

//output to method difference box in DOM
var marginDepletionToMVDilution = document.getElementById('depletionToMVDilution')
marginDepletionToMVDilution.textContent += "$" + roundedMarginOfDepletionToDilution + " USD"


})
