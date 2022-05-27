let axios = require("axios");


// async function getRewards(address) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/contracts/${address}/storage`
//     let data = await axios.get(url).then((d)=>{
//         console.log(d.data)
//         return d.data})
//     // }).then((d)=>{
//     //     data.push(d)})
//     // let rewards = []
//     // for(i=0;i<data.length; i++){
//     //     reward = data[i].amount / 1000000
//     //     epoch = data[i].epoch
//     //     rewardObject = {
//     //         "reward": reward,
//     //         "epoch": epoch
//     //     }
//     //     rewards.push(rewardObject)
//     // }

//     // return rewards
	
// }







// async function getRewards(hash) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/operations/${hash}`
//     let data = await axios.get(url).then((d)=>{
//         console.log(d.data)
//         return d.data})
//     // }).then((d)=>{
//     // //     data.push(d)})
//     // let rewards = []
//     // for(i=0;i<data.length; i++){
//     //     reward = data[i].amount / 1000000
//     //     epoch = data[i].epoch
//     //     rewardObject = {
//     //         "reward": reward,
//     //         "epoch": epoch
//     //     }
//     //     rewards.push(rewardObject)
//     // }

//     // return rewards
	
// }

// async function getRewards(address) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/contracts/${address}/bigmaps`
//     let data = await axios.get(url).then((d)=>{
//         console.log(d.data)
//         return d.data})
//     // }).then((d)=>{
//     // //     data.push(d)})
//     // let rewards = []
//     // for(i=0;i<data.length; i++){
//     //     reward = data[i].amount / 1000000
//     //     epoch = data[i].epoch
//     //     rewardObject = {
//     //         "reward": reward,
//     //         "epoch": epoch
//     //     }
//     //     rewards.push(rewardObject)
//     // }

//     // return rewards
	
// }



async function getRewards(val) {
	//URL SET OBJECT CONSTRUCTION
    address = val.contractAddress
    var end = []
    let url = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${address}&limit=10000&amount.gte=0`
    await axios.get(url).then((d)=>{
        //console.log(d.data)
        // var obj = {
        //     date: formatDate(d.data[0].timestamp),
        //     amount: d.data[0].amount /1000000,
        //     sender: d.data[0].sender,
        //     initiator: d.data[0].initiator
        // }
        // end.push(obj);
        for(i=0;i<d.data.length ;i++){
            //console.log(d.data[i].type)
            try{
                // if(formatDate(d.data[i-1].timestamp)== formatDate(d.data[i].timestamp)){
                //     end[end.length].amount += d.data[i].amount
                // }
                // else{
                    var amountHighlevel = d.data[i].amount / 1000000
                    var parameterAmount = d.data[i].parameter.value.amount / 1000000
                    var paramterAmountFrommutez = d.data[i].parameter.value.mutez / 1000000
                    var amount = parameterAmount + paramterAmountFrommutez + amountHighlevel
                    var entrypoint = d.data[i].parameter.entrypoint
                    var obj = {
                        date: formatDate(d.data[i].timestamp),
                        amount: amount,
                        entrypoint: entrypoint,
                        sender: d.data[i].sender.address,
                        initiator: d.data[i].initiator.address,
                        target: d.data[i].target.address
                    }
                    end.push(obj)
                // }    
            }catch(e){
                console.log(e)
            }
            
        
    }
})
console.log(end)

//     proce = []
//     for(i=0;i<end.length;i++){
//         if(end[i].target == address){
//             obj = {
//                 date: end[i].date,
//                 amount: end[i].amount
//             }
//             proce.push(obj)
//         }
//         else{
//             obj = {
//                 date: end[i].date,
//                 amount: -1 * end[i].amount
//             }
//             proce.push(obj)
//         }
//     }

//     yea = []
//     obj = {
//         kind: val.kind,
//         alias: val.alias,
//         address: val.contractAddress
//     }
//     yea.push(obj)
//     obj = {
//         date: end[0].date,
//         netamount: end[0].amount
//     }
//     yea.push(obj)


//     for(i=0;i<proce.length;i++){
//         if(proce[i].date !== proce[i-1].date){
//             obj = {
//                 date: proce[i].date,
//                 netAmount: proce[i].amount
//             }
//             yea.push(obj)
//         }
//         else{
//             obj = yea.pop()
//             obj.netAmount += proce[i].amount
//             yea.push(obj)
//         }
//     }

//     return yea

// }

    var final = []
    
    obj = {
        kind: val.kind,
        alias: val.alias,
        address: val.contractAddress
    }
    final.push(obj)
    obj = {
        date: end[0].date,
        netamount: end[0].amount
    }
    final.push(obj)
  

    for(j=0;j<end.length;j++){

        try{
            if(end[j].date !== end[j-1].date) {
                if(end[j].target === address){
                    var obj = {
                        date: end[j].date,
                        netamount: end[j].amount
                    }
                    final.push(obj)
                }
                else {
                    var obj = {
                        date: end[j].date,
                        netamount: -1 * end[j].amount
                    }
                    final.push(obj)
                }
                 
            }
            else{
                if(end[j].target === address){
                    final[final.length - 1].netamount += 
                    end[j].amount
                }
                else {
                    final[final.length - 1].netamount -= 
                    end[j].amount 
                }
                
            }
        }catch(e){console.log(e)}
        
    }




    return final
}

        
function formatDate(date) {
	var d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-");
}


    // }).then((d)=>{
    // //     data.push(d)})
    // let rewards = []
    // for(i=0;i<data.length; i++){
    //     reward = data[i].amount / 1000000
    //     epoch = data[i].epoch
    //     rewardObject = {
    //         "reward": reward,
    //         "epoch": epoch
    //     }
    //     rewards.push(rewardObject)
    // }

    // return rewards
	






//call url and bundle the results amount divide by a mil
//use format date for timestamp
//operations hash
//sender
//initiator
//sift thru and compare with a balance query

//aggragate same day trans


//address = "KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF"
//address ="opTn2gDWbmWtjdJbevW9DujNopP4Qppzffu6zwRK9CHQe1htZPW"


Date.prototype.addDays = function(days) {
    this.setDate( this.getDate()  + days);
    return this;
  };

async function getBalances(address) {
    let balances = {};
    //offset from index
    let offset = 0;
    let resp_lens = 10000;
    while (resp_lens === 10000) {
        let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
        const response = await axios.get(url);
        resp_lens = response.data.length;
        offset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
        // api returns only changes
        // for each date, check date ahead and fill all dates upto that date
        for (let i = 0; i < response.data.length - 1; i++) {
            const element = response.data[i];
            //make this into normal date
            var d1 = element.timestamp.substring(0, 10);
            var d2 = response.data[i + 1].timestamp.substring(0, 10);

            if (d1 === d2) {
                balances[d1] = element.balance;
            } else {
                d1 = new Date(d1);
                d2 = new Date(d2);
                date_itr = d1;
                while (date_itr < d2) {
                    date_key = date_itr.toISOString().slice(0, 10);
                    balances[date_key] = response.data[i].balance / 1000000;
                    date_itr = date_itr.addDays(1);
                }
            }
        }
    }
    return balances;
}


address="KT1BJmsK1zhLy5PZNgC7YDfdjciAVTw1A5gq"
var defiRewards = []


// getRewards(address).then((value) => {
//     console.log(value);
//     console.log(bal)
//   });


  //make the trans on contracts program for all contracts
  //try to look for those exit and enterance points after that

  async function end(){
    contractAddresses = []
    var address = "tz1VPZyh4ZHjDDpgvznqQQXUCLcV7g91WGMz"  
    var urldude= `https://api.tzkt.io/v1/accounts/${address}/contracts?limit=10000`
      await axios.get(urldude).then((d)=>{
        for(i=0;i<d.data.length;i++){
            obj = {
                contractAddress : d.data[i].address,
                date: formatDate(d.data[i].creationTime),
                alias: d.data[i].alias,
                kind: d.data[i].kind
              }
             contractAddresses.push(obj) 
        }
    })
  
    Date.prototype.addDays = function(days) {
        this.setDate( this.getDate()  + days);
        return this;
      };
    
  
        let balances = {};
        //offset from index
        let offset = 0;
        let resp_lens = 10000;
        while (resp_lens === 10000) {
            let url = `https://api.tzkt.io/v1/accounts/tz1VPZyh4ZHjDDpgvznqQQXUCLcV7g91WGMz/balance_history?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            resp_lens = response.data.length;
            offset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
            // api returns only changes
            // for each date, check date ahead and fill all dates upto that date
            for (let i = 0; i < response.data.length - 1; i++) {
                const element = response.data[i];
                //make this into normal date
                var d1 = element.timestamp.substring(0, 10);
                var d2 = response.data[i + 1].timestamp.substring(0, 10);
    
                if (d1 === d2) {
                    balances[d1] = element.balance;
                } else {
                    d1 = new Date(d1);
                    d2 = new Date(d2);
                    date_itr = d1;
                    while (date_itr < d2) {
                        date_key = date_itr.toISOString().slice(0, 10);
                        balances[date_key] = response.data[i].balance / 1000000;
                        date_itr = date_itr.addDays(1);
                    }
                }
            }
        }

        let balances2 = {}
       var onset = 0 
       var thething = 10000;
        while (thething === 10000) {
            let url = `https://api.tzkt.io/v1/accounts/KT1Mf7EoMgsLRofXowqrqMBwVec6JU6s2DAk/balance_history?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            thething = response.data.length;
            onset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
            // api returns only changes
            // for each date, check date ahead and fill all dates upto that date
            for (let i = 0; i < response.data.length - 1; i++) {
                const element = response.data[i];
                //make this into normal date
                var d1 = element.timestamp.substring(0, 10);
                var d2 = response.data[i + 1].timestamp.substring(0, 10);
    
                if (d1 === d2) {
                    balances2[d1] = element.balance;
                } else {
                    d1 = new Date(d1);
                    d2 = new Date(d2);
                    date_itr = d1;
                    while (date_itr < d2) {
                        date_key = date_itr.toISOString().slice(0, 10);
                        balances2[date_key] = response.data[i].balance / 1000000;
                        date_itr = date_itr.addDays(1);
                    }
                }
            }
        }
    
//     console.log(contractAddresses)
//     var all = []
//     for(i=0; i<contractAddresses.length;i++){
//         var ad = contractAddresses[i].contractAddress
//         var dat = contractAddresses[i].date
//         getRewards(contractAddresses[i].contractAddress).then((value)=>{
//           obj={
//               contract: ad,
//               dateInitiated: dat,
//               value: value
//           }
//           all.push(obj)
//         })
//     }
//     return all
  
//   }

    


  function promiseGet(url) {
    return new Promise((resolve, reject) => {
        try {
            payload = getRewards(url);
            resolve(payload);
        } catch (err) {
            console.log(`Could not get data from url: ${url}`);
            reject(new Error(err));
        }
        //add ids by cycle or something here
    });
}

var promises = [];
contractAddresses.forEach((val) => {
    promises.push(
        promiseGet(val)
            .then((it) => {
            try{
                if(it !== undefined){
                    return it 
                }
                resolve(it)
            }catch(e){
                reject(new Error(err))
            }
                
            })
            .catch((err) => {
                console.log(err);
            })
    );
});

// //finish all promise models push all returned data up to the base level of the method execution
let contractVals = [];
await Promise.all(promises)
    .then((values) => {
        values.forEach((element) => {
            if (typeof element === "object") {
                var reward = element;
                contractVals.push(reward);
            }
        });
    })
    .catch((err) => {
        console.log(err);
    });

    contractVals.push(contractAddresses)
    contractVals.push(balances)
    contractVals.push(balances2)

    return contractVals

}


  end().then((value)=>{
    
    console.log("end")
    console.log(value)  
  })

  //KT1VHTK75N2FnxJ72Cs9ZQy32v8sXoenMFSF