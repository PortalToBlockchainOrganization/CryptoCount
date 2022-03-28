let axios = require("axios");

// async function getAssets(address) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/tokens/balances?account=${address}`
//     let data = await axios.get(url).then((d)=>{
//         console.log(d.data)
//         return d.data})
//     // }).then((d)=>{
//     //     data.push(d)})
//     // let assets = []
//     // for(i=0;i<data.length; i++){
//     //     reward = data[i].amount / 1000000
//     //     epoch = data[i].epoch
//     //     rewardObject = {
//     //         "reward": reward,
//     //         "epoch": epoch
//     //     }
//     //     assets.push(rewardObject)
//     // }


//     return data
// }


async function getAssets(address) {
	//URL SET OBJECT CONSTRUCTION
    let level = 1697146
    let url = `https://api.tzkt.io/v1/tokens?sender=${address}`
    let data = await axios.get(url).then((d)=>{
        console.log(d.data)
        return d.data})
    // }).then((d)=>{
    //     data.push(d)})
    // let assets = []
    // for(i=0;i<data.length; i++){
    //     reward = data[i].amount / 1000000
    //     epoch = data[i].epoch
    //     rewardObject = {
    //         "reward": reward,
    //         "epoch": epoch
    //     }
    //     assets.push(rewardObject)
    // }


    return data
}


//let address = "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH"
let address = "tz1Rscy11rcnD6eQzFns4KnKprg8j6Lk6cro"

getAssets(address).then((value) => {
    //console.log(value);
    return value
  });