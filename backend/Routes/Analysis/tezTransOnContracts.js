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



async function getRewards(hash) {
	//URL SET OBJECT CONSTRUCTION
 
    let url = `https://api.tzkt.io/v1/operations/${hash}`
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



// async function getRewards(hash) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/operations/transactions/${hash}`
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






//address = "KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF"
address ="opTn2gDWbmWtjdJbevW9DujNopP4Qppzffu6zwRK9CHQe1htZPW"
getRewards(address).then((value) => {
    console.log(value);
    return value
  });