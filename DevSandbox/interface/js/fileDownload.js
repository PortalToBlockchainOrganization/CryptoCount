$(function(){
    //write all this stuff to a txt file
    document.getElementById("downloadButton").addEventListener("click",function(){
      //get content componenets from the DOM
      cvi = document.getElementById('cashValueMethodRewardIncome1').innerHTML
      dmi = document.getElementById('depletionMethodRewardIncome').innerHTML
      mvdmi = document.getElementById('dilutionMethodRewardIncome').innerHTML
      cvidmi= document.getElementById('depletionToCashValueMargin').innerHTML
      cvimvdmi = document.getElementById('dilutionToCashValueMargin').innerHTML
      dmimvdmi = document.getElementById('depletionToMVDilution').innerHTML
      blockchain = localStorage.getItem('blockchain')
      address = localStorage.getItem('account')
      startdate = localStorage.getItem('startdate')
      enddate = localStorage.getItem('enddate')

      content = `PoS Taxation Complete Reward Income Statement:
    Inputted Metrics:
    Blockchain: ${blockchain}     Address: ${address}      StartDate: ${startdate}   EndDate: ${enddate}

    Outputted Metrics:
    ${cvi}
    ${dmi}
    ${mvdmi}

    Income Margins:
    ${cvidmi}
    ${cvimvdmi}
    ${dmimvdmi}`

      filename = 'Your Reward Income Statement'
      //create a blob with the content
      var blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
      })
      //call the library's main function to generate as download
      saveAs(blob, filename)
    }, false)



})
