// const web3 = require('@solana/web3.js');
let axios = require("axios");

// //console.log(solanaWeb3);

// (async () => {
//     // Connect to cluster
//     var connection = new web3.Connection(
//       web3.clusterApiUrl('devnet'),
//       'confirmed',
//     );
  
//     // Generate a new wallet keypair and airdrop SOL
//     var wallet = web3.Keypair.generate();
//     var airdropSignature = await connection.requestAirdrop(
//       wallet.publicKey,
//       web3.LAMPORTS_PER_SOL,
//     );
  
//     //wait for airdrop confirmation
//     await connection.confirmTransaction(airdropSignature);
  
//     // get account info
//     // account data is bytecode that needs to be deserialized
//     // serialization and deserialization is program specific
//     let account = await connection.getAccountInfo(wallet.publicKey);
//     console.log(account);
//   })();


// uri = https://api.mainnet-beta.solana.com/

//   {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getInflationReward",
//     "params": [
//       ["6Mom2TdpaFMRnCSQQu96PyP1HADxx5Xvt2aLSyJGGn83"], {"epoch": 281}
//     ]
//   }

//   {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getSignaturesForAddress",
//     "params": [
//       "6Mom2TdpaFMRnCSQQu96PyP1HADxx5Xvt2aLSyJGGn83"
//     ]
//   }

//   {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getTransaction",
//     "params": [
//       "3DsGoAo7t2hDLoGtoMtishzW33ba2tMEHQPmK8emy1KiLneGt3X26LxMdx3naADndX57goNiLBfa4r4RYtuRTDJg",
//       "json"
//     ]
//   }

//   {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getEpochInfo"
   
//   }


//   {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getBalance",
//     "params": [
//       "6Mom2TdpaFMRnCSQQu96PyP1HADxx5Xvt2aLSyJGGn83"
//     ]
//   }

//stake address
var address = "F4MWUnFqGLxMgezXcqcCUojLqGhERU9syvuQVPeJBJaC"
async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION
 


    //for each epoch 
    let config = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getInflationReward",
      "params": [
        ["F4MWUnFqGLxMgezXcqcCUojLqGhERU9syvuQVPeJBJaC"], {"epoch": 281}
      ]
    };
    let url = `https://api.mainnet-beta.solana.com/`
    let data = await axios.post(url, config).then((d)=>{
        console.log(d.data)
        return d.data})
    // }).then((d)=>{
    //     data.push(d)})
    let rewards = []
    for(i=0;i<data.length; i++){
        reward = data[i].amount / 1000000
        epoch = data[i].epoch
        rewardObject = {
            "reward": reward,
            "epoch": epoch
        }
        rewards.push(rewardObject)
    }

    return rewards
	
}

getRewards(address).then((value) => {
  console.log(value);
  return value
});