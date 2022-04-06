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



// async function getRewards(address) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/contracts/${address}`
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



// async function getRewards(address) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/contracts/${address}/storage/raw/history`
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

async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION
    let level = 2256111
    let url = `https://api.tzkt.io/v1/tokens/historical_balances/${level}?account=${address}`
    let data = await axios.get(url).then((d)=>{
        console.log(d.data)
        return d.data})
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
	
}




//address = "KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF"
address ="tz1VPZyh4ZHjDDpgvznqQQXUCLcV7g91WGMz"
getRewards(address).then((value) => {
    console.log(value);
    return value
  });