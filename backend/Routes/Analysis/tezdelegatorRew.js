let axios = require("axios");


// async function getRewards(address) {
// 	//URL SET OBJECT CONSTRUCTION
 
//     let url = `https://api.tzkt.io/v1/rewards/delegators/${address}/${cycle}`
//     let data = await axios.get(url,{headers: config}).then((d)=>{
//         console.log(d.data)
//         return d.data})
//     // }).then((d)=>{
//     //     data.push(d)})
//     let rewards = []
//     for(i=0;i<data.length; i++){
//         reward = data[i].amount / 1000000
//         epoch = data[i].epoch
//         rewardObject = {
//             "reward": reward,
//             "epoch": epoch
//         }
//         rewards.push(rewardObject)
//     }

//     return rewards
	
// }



async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION
 
    let url = `https://api.tzkt.io/v1/accounts/${address}/contracts`
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



//address = "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH"
address ="tz1VPZyh4ZHjDDpgvznqQQXUCLcV7g91WGMz"
getRewards(address).then((value) => {
    console.log(value);
    return value
  });