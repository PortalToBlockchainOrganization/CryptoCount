//depletion table
  //createTable.js
function addRow(value1, value2, value3, value4, table){
  //insert row
  var newRow = table.insertRow(-1);
  //insert a cell in row
  var newCell1 = newRow.insertCell(0);
  var newCell2 = newRow.insertCell(1);
  var newCell3 = newRow.insertCell(2);
  var newCell4 = newRow.insertCell(3);
  // Append a text node to the cell
  var date = document.createTextNode(value1);
  var rewardQuantity = document.createTextNode(value2);
  var cashmethod = document.createTextNode(value3);
  var rewardDepletion = document.createTextNode(value4);
  newCell1.appendChild(date);
  newCell2.appendChild(rewardQuantity);
  newCell3.appendChild(cashmethod);
  newCell4.appendChild(rewardDepletion);
}

//depletion table
$(function(){
    var dateb4 = localStorage.getItem('date')
    var rewardQuantity = localStorage.getItem('rewardQuantity')
    var cashmethod = localStorage.getItem('cashValue')
    var rewardDepletion = localStorage.getItem('rewDepl')
    var rewardDilution = localStorage.getItem('rewDil')


    var date = dateb4.split(',')
    //parse float
    var rewardQuantity = rewardQuantity.split(',').map(function(item){
      return parseFloat(item)
    })
    //round float vector
    var roundedRewardQuantity = []
    for(i = 0; i < rewardQuantity.length; i++){
      roundedRewardQuantity[i] = Number((rewardQuantity[i]).toFixed(2))
    }

    var cashmethod = cashmethod.split(',').map(function(item){
      return parseFloat(item)
    })
    var roundedCashMethod = []
    for(i = 0; i < cashmethod.length; i++){
      roundedCashMethod[i] = Number((cashmethod[i]).toFixed(2))
    }

    var rewardDepletion = rewardDepletion.split(',').map(function(item){
      return parseFloat(item)
    })
    var roundedDepletionMethod = []
    for(i = 0; i < rewardDepletion.length; i++){
      roundedDepletionMethod[i] = Number((rewardDepletion[i]).toFixed(2))
    }

    var rewardDilution = rewardDilution.split(',').map(function(item){
      return parseFloat(item)
    })
    var roundedDilutionMethod = []
    for(i = 0; i < rewardDilution.length; i++){
      roundedDilutionMethod[i] = Number((rewardDilution[i]).toFixed(2))
    }



    //get div
    var table = document.getElementById('table1')
    //call add row to populate the table
    for (i = 0; i < date.length; i++){
        addRow(date[i],roundedRewardQuantity[i],roundedCashMethod[i],roundedDepletionMethod[i], table)
      }

    //get div
    var table = document.getElementById('table2')
    for (i = 0; i < date.length; i++){
        addRow(date[i],roundedRewardQuantity[i],roundedCashMethod[i],roundedDilutionMethod[i], table)
      }


  })
