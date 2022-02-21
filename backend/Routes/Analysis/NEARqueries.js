const mongoose = require("mongoose");
let CycleModel = require("../../model/cycle");
let axios = require("axios");
const { resolve } = require("bluebird");
var http = require('http')
var url = require('url')
const httpService = require('./httpService'); // the above wrapper
var request = require("request");
const https = require('https')
var fetch = require("fetch").fetchUrl;

const nearAPI = require("near-api-js");



//async function getNEAR(){
//const { connect } = nearAPI;

// // creates keyStore from a provided file
// // you will need to pass the location of the .json key pair

// const { KeyPair, keyStores } = require("near-api-js");
// const fs = require("fs");
// const homedir = require("os").homedir();

// const ACCOUNT_ID = "near-example.testnet";  // NEAR account tied to the keyPair
// const NETWORK_ID = "testnet";
// // path to your custom keyPair location (ex. function access key for example account)
// const KEY_PATH = '/.near-credentials/near-example-testnet/get_token_price.json';

// const credentials = JSON.parse(fs.readFileSync(homedir + KEY_PATH));
// const keyStore = new keyStores.InMemoryKeyStore();
// keyStore.setKey(NETWORK_ID, ACCOUNT_ID, KeyPair.fromString(credentials.private_key));


// const config = {
//   networkId: "mainnet",
//   keyStore, // optional if not signing transactions
//   nodeUrl: "https://rpc.mainnet.near.org",
//   walletUrl: "https://wallet.mainnet.near.org",
//   helperUrl: "https://helper.mainnet.near.org",
//   explorerUrl: "https://explorer.mainnet.near.org",
// };
// const near = await connect(config);

// const response = await near.connection.provider.query({
//   request_type: "view_account",
//   finality: "final",
//   account_id: "7eee5392d8c77b279a329f168ff336b22911f02e850ab518d199c946667de01c",
// });


// //gets account balance
// const account = await near.account("7eee5392d8c77b279a329f168ff336b22911f02e850ab518d199c946667de01c");
// await account.getAccountBalance().then((result) => {
//   console.log(result.data)
// })

//gets account details in terms of authorized apps and transactions
// await account.getAccountDetails();
//
//}


// // converts NEAR amount into yoctoNEAR (10^-24)

// const { utils } = nearAPI;
// const amountInYocto = utils.format.parseNearAmount("1");


// // converts yoctoNEAR (10^-24) amount into NEAR

// const { utils } = nearAPI;
// const amountInNEAR = utils.format.formatNearAmount("1000000000000000000000000");


// async function getNEAR(){
//   var APIKEY = "279f91972fcd4113ef439476800fb789"

//   //figment api


//  //var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/transactions`
  
//   //var id = 80159936

//   //var id = "relay.aurora"

//   //block id
//   //var id = 59683010

//   var id = "0017ace31ce55aca5620a707a47f13d9c83d5530b49f44b54ab963552c00187c"

// //gives staked amount/ account details
//   var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/accounts/${id}`


//   //var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/delegations/${id}`


//   //var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/validators`
  
//   //var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/validators/${id}/epochs`

//   //var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/block`
  
//   //var url = `https://near--indexer.datahub.figment.io/apikey/${APIKEY}/events/1453`


//   var data = await axios.get(url).then((d)=>{
//     console.log(d.data)
//     return d.data})
    
// }

axios({
      url: 'https://archival-rpc.mainnet.near.org',
      method: 'post',
      headers: {
          "Content-Type": "application/json",
        "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
      },
      data: {
       
      }
    }).then((result) => {
      console.log(result.data)
    });


  getNEAR().then((value) => {
    console.log(value);
    return value
  });


  //relay.aurora
  //x.paras.near
  //mag9992.near
  //shadznft.near
  //48a5408553101064ea4046ef394efb1e101d0a68ce6d3b94c531cf9d5a7341e3
  //7eee5392d8c77b279a329f168ff336b22911f02e850ab518d199c946667de01c
  //infiniteloop.poolv1.near
  //shardlabs.poolv1.near
  //doubletop.poolv1.near

  //personal
  //0017ace31ce55aca5620a707a47f13d9c83d5530b49f44b54ab963552c00187c
