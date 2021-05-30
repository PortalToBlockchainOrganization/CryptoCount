  
 function writeInputs(){
 //write inputs to storage
 var quantityRealized = document.getElementById("quantityRealized")
 localStorage.setItem("quantityRealized", quantityRealized.value); 
 var address = document.getElementById("address")
 localStorage.setItem("address", address.value);
 var fiat = document.getElementById("fiat1")
 localStorage.setItem("fiat", fiat.value);  
 var basisdate = document.getElementById("basisdate")
 localStorage.setItem("basisdate", basisdate.value);
}

function getInputs(){
    //get data from page storage 
    var address =  localStorage.getItem('address');
    var basisdate =  localStorage.getItem('basisdate');
    var blockchain =  localStorage.getItem('blockchain');
    var fiat =  localStorage.getItem('fiat');
    var quantityRealized =  localStorage.getItem('quantityRealized');
    return {address, basisdate, fiat, quantityRealized};
 }

 function socket(socketFrame, address, basisdate, fiat, quantityRealized){
            //data dialogue req
        socketFrame.emit('analysisReq', {
        address: address,
        basis: basisdate,
        fiat: fiat,
        quantityRealized: quantityRealized
        //account: account? - some account dialogue here
        })

        console.log('sent emit')

            //on analysis res error
        socketFrame.on('analysisResErr', (data)=>{
        console.log(data)
        var data = JSON.stringify(data)
        alert(data)
        window.location.href = "./index.html"
        })


        //on analysis res data receipt
        socketFrame.on('analysisRes', (data) => {
        console.log('got analysis response');
        //iterate through socket object json payload and push elements into the vectors
            $.each(data, function(i, result){
                date.push(result.date.toString().slice(0,10))
                cashValue.push(result.cashMethod) //whatever the stuff is called in the json
                rewDepl.push(result.depMethod)
                rewDil.push(result.MVDMethod)
                rewardQuantity.push(result.reward)
                })
                        //init the vectors we'll store from the query
            var date = []
            var cashValue = []
            var rewDepl = []
            var rewDil = []
            var rewardQuantity = []
            var displaya = Document.getElementById('a')
            displaya.textContent += result.cashMethod
            var displayb = Document.getElementById('b')
            displayb.textContent += result.depMethod
            var displayc = Document.getElementById('c')
            displayc.textContent += result.MVDMethod
            var displayd = Document.getElementById('d')
            displayd.textContent += result.reward
                console.log(result)
            })

        //construct date dictionary with the 4 vectors below it
};

window.onload = function(){

    var socketFrame = io('http://localhost:3000');

    var click = document.getElementById('button');

    click.onclick = function(){
        writeInputs();
        let {address, basisdate, fiat, quantityRealized} = getInputs();
        console.log(address)
            //turns on the socket frame
        socketFrame.on('connect', function () {
                console.log('socket connection');
            })
        socket(socketFrame, address, basisdate, fiat, quantityRealized);

    }

}

     

    
    
    
    