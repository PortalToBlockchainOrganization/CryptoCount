//page 1
$(function(){

//get click
var click = document.getElementById('button');

//init websocket
const socket = io('https://localhost:3000');

//connect the socket get the socket id in console
socket.on('connect', () => {
  console.log(socket.id); // 'G5p5...'
});

//form submit is url maker
click.onclick = function(){
  //throw up the modal
  // Get the modal
  var modal = document.getElementById("myModal");
  var modalContent = document.getElementById('modalContent')
  var modalContent2 = document.getElementById('modalContent2')
  // When the user clicks on the button, open the modal
    modal.style.display = "block";
    modalContent.style.display = "block";
    modalContent2.style.display = "block";



  //write inputs to storage
  var account = document.getElementById("account")
  localStorage.setItem("account", account.value);
  var startdate = document.getElementById("startdate")
  localStorage.setItem("startdate", startdate.value);
  var enddate = document.getElementById("enddate")
  localStorage.setItem("enddate", enddate.value);
  var blockchain = document.getElementById("blockchain")
  localStorage.setItem("blockchain", blockchain.value);

  //url prepartion // REST CONNECTION
  var address = localStorage.getItem('account');
  var startdate = localStorage.getItem('startdate');
  var enddate = localStorage.getItem('enddate');
  ogURL = 'https://postaxation.com:3000/api/analysis/tz1gCx1V63bSaQnPZoQreqNgVLuFMzyMcqry?start=2018-06-30&end=2020-06-01'
  var a = ogURL.replace("tz1gCx1V63bSaQnPZoQreqNgVLuFMzyMcqry", address)
  var b = a.replace("2018-06-30", startdate)
  newURL = b.replace("2020-06-01", enddate)

  //liv easter egg
  var liv = localStorage.getItem('account')
  if (liv.localeCompare("Olivia Paige Peluso") == 0){
    modal.style.display = "block";
    modalContent.style.display = "block";
    modalContent2.style.display = "block";
    window.location = "./page2.html"
    return false;
  }


  console.log('in the socket');

  //if wei needs the inputs form a user
  socket.emit('analysisReq', {
    address: address,
    start: startdate,
    end: enddate});
  console.log('sent socket.emit')
}


  //init the vectors we'll store from the query
  var date = []
  var cashValue = []
  var rewDepl = []
  var rewDil = []
  var rewardQuantity = []

  //on analysis res error
  socket.on('analysisResErr', (data)=>{
    console.log(data)
    var data = JSON.stringify(data)
    alert(data)
    window.location.href = "./index.html"

  })


  //on analysis res data receipt
  socket.on('analysisRes', (data) => {
    console.log('got analysis response');
    //iterate through socket object json payload and push elements into the vectors
     $.each(data, function(i, result){
         date.push(result.date.toString().slice(0,10))
         cashValue.push(result.cashMethod) //whatever the stuff is called in the json
         rewDepl.push(result.depMethod)
         rewDil.push(result.MVDMethod)
         rewardQuantity.push(result.reward)
           })
           //write the resulting vectors to local storage
         localStorage.setItem('date', date)
         localStorage.setItem("cashValue", JSON.stringify(cashValue))
         localStorage.setItem("rewDepl", JSON.stringify(rewDepl))
         localStorage.setItem("rewDil", JSON.stringify(rewDil))
         localStorage.setItem("rewardQuantity", JSON.stringify(rewardQuantity))
         localStorage.setItem('demo', 'no')

         //get first value and get last value
         var rawCashValueVector = localStorage.getItem('cashValue')
         var splitCashValueVector = rawCashValueVector.split(',')
         splitCashValueVector[0] = splitCashValueVector[0].substring(1)
         last = splitCashValueVector.length
         splitCashValueVector[last-1] = splitCashValueVector[last-1].slice(0,-1)
         localStorage.setItem('cashValue', splitCashValueVector)

         //depleiton method
         var rawDepletionVector = localStorage.getItem('rewDepl')
         var splitDepletionVector = rawDepletionVector.split(',')
         splitDepletionVector[0] = splitDepletionVector[0].substring(1)
         last = splitDepletionVector.length
         splitDepletionVector[last-1] = splitDepletionVector[last-1].slice(0,-1)
         localStorage.setItem('rewDepl', splitDepletionVector)

         var rawDilutionVector = localStorage.getItem('rewDil')
         var splitDilutionVector = rawDilutionVector.split(',')
         splitDilutionVector[0] = splitDilutionVector[0].substring(1)
         last = splitDilutionVector.length
         splitDilutionVector[last-1] = splitDilutionVector[last-1].slice(0,-1)
         localStorage.setItem('rewDil', splitDilutionVector)

         var rawRewardQuantity = localStorage.getItem('rewardQuantity')
         var splitRewardQuantity = rawRewardQuantity.split(',')
         splitRewardQuantity[0] = splitRewardQuantity[0].substring(1)
         last = splitRewardQuantity.length
         splitRewardQuantity[last-1] = splitRewardQuantity[last-1].slice(0,-1)
         localStorage.setItem('rewardQuantity', splitRewardQuantity)

         //accumulating the rewards in an array and writing to storage for chart js
         var cashValueRewardAccumulated = []
         cashValueRewardAccumulated.push(parseFloat(splitCashValueVector[0]))
         for(i = 1; i < splitCashValueVector.length; i++){
           cashValueRewardAccumulated.push(cashValueRewardAccumulated[i-1] + parseFloat(splitCashValueVector[i]))
         }
         localStorage.setItem('cashValueRewardAccumulated', cashValueRewardAccumulated)

         var depletionRewardAccumulated = []
         depletionRewardAccumulated.push(parseFloat(splitDepletionVector[0]))
         for(i = 1; i < splitDepletionVector.length; i++){
           depletionRewardAccumulated.push(depletionRewardAccumulated[i-1] + parseFloat(splitDepletionVector[i]))
         }
         localStorage.setItem('depletionRewardAccumulated', depletionRewardAccumulated)

         var dilutionRewardAccumulated = []
         dilutionRewardAccumulated.push(parseFloat(splitDilutionVector[0]))
         for(i = 1; i < splitDilutionVector.length; i++){
           dilutionRewardAccumulated.push(dilutionRewardAccumulated[i-1] + parseFloat(splitDilutionVector[i]))
         }
         localStorage.setItem('dilutionRewardAccumulated', dilutionRewardAccumulated)


         window.location.href = "./page2.html"



         })


})

//check if the vectors are properly populated -> go to page 2
/*
for (i= 0; i < 5; i++){
  if(rewardQuantity[i] > 0){
    window.location.href = "./page2.html"
  }
  else(alert("The information you entered returned no Staking Reward in the first five days of the period. Please enter a different period."))
  //turn off modal
  modal.style.display = "none";
  modalContent.style.display = "none";
  break
}
*/

/*
  //async has this running all the time
  async function doAjax(){
    let result;

    try {
      //await writes the result when the attempt is completed
      console.log('trying')
      result = await $.ajax({
          url: newURL,
          type: 'GET',
          });
        }
      catch (error) {}

      return result
  }


  //function running all the time
  async function callAjaxAndWrite(){
    let result

    try{

      //await for do ajax to return result
         result = await doAjax()

         console.log(result)
         //iterate through json payload and push elements into the vectors
        $.each(result, function(i, result){
            date.push(result.date.toString().slice(0,10))
            cashValue.push(result.cashMethod) //whatever the stuff is called in the json
            rewDepl.push(result.depMethod)
            rewDil.push(result.MVDMethod)
            rewardQuantity.push(result.reward)
              })

          //write the resulting vectors to local storage
        localStorage.setItem('date', date)
        localStorage.setItem("cashValue", JSON.stringify(cashValue))
        localStorage.setItem("rewDepl", JSON.stringify(rewDepl))
        localStorage.setItem("rewDil", JSON.stringify(rewDil))
        localStorage.setItem("rewardQuantity", JSON.stringify(rewardQuantity))
        localStorage.setItem('demo', 'no')

        //get first value and get last value
        var rawCashValueVector = localStorage.getItem('cashValue')
        var splitCashValueVector = rawCashValueVector.split(',')
        splitCashValueVector[0] = splitCashValueVector[0].substring(1)
        last = splitCashValueVector.length
        splitCashValueVector[last-1] = splitCashValueVector[last-1].slice(0,-1)
        localStorage.setItem('cashValue', splitCashValueVector)

        //depleiton method
        var rawDepletionVector = localStorage.getItem('rewDepl')
        var splitDepletionVector = rawDepletionVector.split(',')
        splitDepletionVector[0] = splitDepletionVector[0].substring(1)
        last = splitDepletionVector.length
        splitDepletionVector[last-1] = splitDepletionVector[last-1].slice(0,-1)
        localStorage.setItem('rewDepl', splitDepletionVector)

        var rawDilutionVector = localStorage.getItem('rewDil')
        var splitDilutionVector = rawDilutionVector.split(',')
        splitDilutionVector[0] = splitDilutionVector[0].substring(1)
        last = splitDilutionVector.length
        splitDilutionVector[last-1] = splitDilutionVector[last-1].slice(0,-1)
        localStorage.setItem('rewDil', splitDilutionVector)

        var rawRewardQuantity = localStorage.getItem('rewardQuantity')
        var splitRewardQuantity = rawRewardQuantity.split(',')
        splitRewardQuantity[0] = splitRewardQuantity[0].substring(1)
        last = splitRewardQuantity.length
        splitRewardQuantity[last-1] = splitRewardQuantity[last-1].slice(0,-1)
        localStorage.setItem('rewardQuantity', splitRewardQuantity)

        //accumulating the rewards in an array and writing to storage for chart js
        var cashValueRewardAccumulated = []
        cashValueRewardAccumulated.push(parseFloat(splitCashValueVector[0]))
        for(i = 1; i < splitCashValueVector.length; i++){
          cashValueRewardAccumulated.push(cashValueRewardAccumulated[i-1] + parseFloat(splitCashValueVector[i]))
        }
        localStorage.setItem('cashValueRewardAccumulated', cashValueRewardAccumulated)

        var depletionRewardAccumulated = []
        depletionRewardAccumulated.push(parseFloat(splitDepletionVector[0]))
        for(i = 1; i < splitDepletionVector.length; i++){
          depletionRewardAccumulated.push(depletionRewardAccumulated[i-1] + parseFloat(splitDepletionVector[i]))
        }
        localStorage.setItem('depletionRewardAccumulated', depletionRewardAccumulated)

        var dilutionRewardAccumulated = []
        dilutionRewardAccumulated.push(parseFloat(splitDilutionVector[0]))
        for(i = 1; i < splitDilutionVector.length; i++){
          dilutionRewardAccumulated.push(dilutionRewardAccumulated[i-1] + parseFloat(splitDilutionVector[i]))
        }
        localStorage.setItem('dilutionRewardAccumulated', dilutionRewardAccumulated)

        //check if the vectors are properly populated -> go to page 2
        /*
        for (i= 0; i < 5; i++){
          if(rewardQuantity[i] > 0){
            window.location.href = "./page2.html"
          }
          else(alert("The information you entered returned no Staking Reward in the first five days of the period. Please enter a different period."))
          //turn off modal
          modal.style.display = "none";
          modalContent.style.display = "none";
          break
        }



        window.location.href = "./page2.html"


  }

    catch (error){
      console.log(error)
    }
  }

  callAjaxAndWrite()

  }
})
*/
