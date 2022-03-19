const mongoose = require("mongoose");
let CycleModel = require("../../model/cycle");
let axios = require("axios");
const { resolve } = require("bluebird");
var http = require('http')
//var url = require('url')
const httpService = require('./httpService'); // the above wrapper
//var request = require("request");
const https = require('https')
var fetch = require("fetch").fetchUrl;
const  { query, mutation, subscription } = require('gql-query-builder')
const web3 = require('@solana/web3.js');

// (async () => {
//   // Connect to cluster
//   var connection = new web3.Connection(
//     web3.clusterApiUrl('http://192.168.1.88:8899'),
//     'confirmed',
//   );

//   console.log(connection)

// //   // Generate a new random public key
// //   var from = web3.Keypair.generate();
// //   var airdropSignature = await connection.requestAirdrop(
// //     from.publicKey,
// //     web3.LAMPORTS_PER_SOL,
// //   );
// //   await connection.confirmTransaction(airdropSignature);

// //   // Generate a new random public key
// //   var to = web3.Keypair.generate();

// //   // Add transfer instruction to transaction
// //   var transaction = new web3.Transaction().add(
// //     web3.SystemProgram.transfer({
// //       fromPubkey: from.publicKey,
// //       toPubkey: to.publicKey,
// //       lamports: web3.LAMPORTS_PER_SOL / 100,
// //     }),
// //   );

// //   // Sign transaction, broadcast, and confirm
// //   var signature = await web3.sendAndConfirmTransaction(
// //     connection,
// //     transaction,
// //     [from],
// //   );
// //   console.log('SIGNATURE', signature);
// })();

// async function getVelas(){
  

//     //works

// //     //top 10 coins on velas?
// //  axios({
// //     url: 'https://graphql.bitquery.io/',
// //     method: 'post',
// //     headers: {
// //         "Content-Type": "application/json",
// //       "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
// //     },
// //     data: {
// //       query: `
// //       {
// //         ethereum(network: velas) {
// //           transfers(options: {desc: "count" limit: 10}) {
// //             currency {
// //               symbol
// //               address
// //             }
// //             count
// //             senders: count(uniq: senders)
// //             receivers: count(uniq: receivers)
// //             days: count(uniq: dates)
// //             from_date: minimum(of: date)
// //             till_date: maximum(of: date)
// //             amount
// //           }
// //         }
// //       }
// //         `
// //     }
// //   }).then((result) => {
// //     console.log(result.data)
// //   });
  
 










//   //get transactions - currencies sent and received thru address 
// //   vals 
// //   {
// //     "limit": 10,
// //     "offset": 0,
// //     "network": "velas",
// //     "address": "BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M",
// //     "from": null,
// //     "till": null,
// //     "dateFormat": "%Y-%m"
// //   }


// //   axios({
// //     url: 'https://graphql.bitquery.io/',
// //     method: 'post',
// //     headers: {
// //         "Content-Type": "application/json",
// //       "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
// //     },
// //     data: {
// //       query: `
// //       query ($network: "velas", $address: "BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M", $from: "2021-02-09T18:11:18+0000", $till: null, $limit: 5, $offset: 0) {
// //         ethereum(network: $network) {
// //           transfers(
// //             date: {since: $from, till: $till}
// //             amount: {gt: 0}
// //             options: {limit: $limit, offset: $offset, desc: ["count_in", "count_out"], asc: "currency.symbol"}
// //           ) {
// //             sum_in: amount(calculate: sum, receiver: {is: $address})
// //             sum_out: amount(calculate: sum, sender: {is: $address})
// //             count_in: count(receiver: {is: $address})
// //             count_out: count(sender: {is: $address})
// //             currency {
// //               address
// //               symbol
// //               tokenType
// //             }
// //           }
// //         }
// //       }
// //       {
// //                 ethereum(network: velas, address: BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M, from: 2021-02-09T18:11:18+0000, till: null, limit: 5, offset: 0) {
// //                     transfers(
// //                         date: {since: $from, till: $till}
// //                         amount: {gt: 0}
// //                         options: {limit: $limit, offset: $offset, desc: ["count_in", "count_out"], asc: "currency.symbol"}
// //                       ) {
// //                         sum_in: amount(calculate: sum, receiver: {is: $address})
// //                         sum_out: amount(calculate: sum, sender: {is: $address})
// //                         count_in: count(receiver: {is: $address})
// //                         count_out: count(sender: {is: $address})
// //                         currency {
// //                           address
// //                           symbol
// //                           tokenType
// //                         }
// //                       }
// //                     }
// //                   }
      
// //         `
// //     }
// //   }).then((result) => {
// //     console.log(result.data)
// //   });




  

// //get balance for velas address 


//   axios({
//         url: 'https://graphql.bitquery.io/',
//         method: 'post',
//         headers: {
//             "Content-Type": "application/json",
//           "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
//         },
//         data: {
//           query: `
//           query ($network: velas, $address: 0x88wpWNCVqS9xFkV7CYGNUWKLjgcAMbUoJ4oty5qzEwMH) {
//             ethereum(network: $network) {
//               address(address: {is: $address}) {
                
//                 balances {
//                   value
                  
//                   currency {
//                     symbol
//                   }
//                 }
//               }
//             }
//           }
//             `
//         }
//       }).then((result) => {
//         console.log(result.data)
//       });




//   //my staking account
//   //BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M

//   //look for delegation here in liquidy-wagu?
// //   query ($addr: String) {
// //     ethereum(network: velas) {
// //       smartContractCalls(txHash: {is: $addr}) {
// //         smartContractMethod {
// //           name
// //           signature
// //         }
// //         arguments {
// //           argument
// //           value
// //         }
// //         block {
// //           timestamp {
// //             unixtime
// //           }
// //           height
// //         }
// //         smartContract {
// //           address {
// //             address
// //             annotation
// //           }
// //           protocolType
// //           contractType
// //           currency {
// //             symbol
// //           }
// //         }
// //         caller {
// //           address
// //         }
// //       }
// //       smartContractEvents(txHash: {is: $addr}) {
// //         eventIndex
// //         smartContract {
// //           address {
// //             address
// //           }
// //         }
// //         smartContractEvent {
// //           name
// //           signature
// //         }
// //         arguments {
// //           argument
// //           value
// //         }
// //       }
// //     }
// //   }

// }

async function getVelas(){


var buildWeb3t = require('web3t');

function mainnet(err, web3t) {
   
}

var config = {
 mode: "mainnet"
 plugins: {},
 providers: {}
}

console.log(buildWeb3t(config, mainnet));



web3t.velas.getBalance({ "88wpWNCVqS9xFkV7CYGNUWKLjgcAMbUoJ4oty5qzEwMH" }, cb);




  var moment, ref$, map, pairsToObj, foldl, any, each, find, sum, filter, head, values, join, reverse, uniqueBy, sortBy, get, post, plus, minus, div, times, BitcoinLib, bip39, jsonParse, deadline, decode, guid, BN, bs58, Buffer, tweetnacl, solanaWeb3, lo, assert, bip32, findMax, calcFee, makeQuery, toBase58, toBuffer, getAccountInfo, getKeys, extend, getDec, addAmount, parseRateString, extractVal, parseResult, getDepositAddressInfo, getError, getRecentBlockhash, getAccount, freeOwnership, swapNativeToEvmData, swapNativeToEvm, createTransaction, pushTx, getTotalReceived, getUnconfirmedBalance, getBalance, getApiUrl, checkTxStatus, getTransactions, prepareRawTxs, getIndexOfObj, cache, getTxData, prepareTxs, getSentAmount, getAction, isValidAddress, getTransactionInfo, getMarketHistoryPrices, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, toString$ = {}.toString;
  moment = require('moment');
  ref$ = require('prelude-ls'), map = ref$.map, pairsToObj = ref$.pairsToObj, foldl = ref$.foldl, any = ref$.any, each = ref$.each, find = ref$.find, sum = ref$.sum, filter = ref$.filter, head = ref$.head, values = ref$.values, join = ref$.join, reverse = ref$.reverse, uniqueBy = ref$.uniqueBy, sortBy = ref$.sortBy;
  ref$ = require('./superagent.js'), get = ref$.get, post = ref$.post;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, div = ref$.div, times = ref$.times;
  ref$ = require('./deps.js'), BitcoinLib = ref$.BitcoinLib, bip39 = ref$.bip39;
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  decode = require('bs58').decode;
  guid = require('../guid');
  BN = require('bn.js').BN;
  bs58 = require('bs58');
  Buffer = require('buffer').Buffer;
  tweetnacl = require('tweetnacl');
  bip39 = require('bip39');
  solanaWeb3 = require('./solana/index.cjs.js');
  lo = require('buffer-layout');
  assert = require('assert');
  bip32 = require('bip32');
  findMax = function(first, current){
    if (current.rank < first.rank) {
      return current;
    } else {
      return first;
    }
  };


  out$.getAccount = getAccount = function(mnemonic, index, cb){
    var seed, hexSeed, derivedSeed, privateKeyBuff, publicKey, privateKey;
    seed = bip39.mnemonicToSeed(mnemonic);
    hexSeed = seed.toString('hex');
    derivedSeed = bip32.fromSeed(seed).derivePath("m/44'/5655640'/" + index + "'/0").privateKey;
    privateKeyBuff = tweetnacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    publicKey = tweetnacl.sign.keyPair.fromSeed(derivedSeed).publicKey;
    privateKey = toBase58(privateKeyBuff);
    publicKey = toBase58(publicKey);
    return cb(null, {
      address: publicKey,
      privateKey: privateKey,
      publicKey: publicKey,
      secretKey: privateKeyBuff
    });
  };
}

  getVelas().then((value) => {
    console.log(value);
    return value
  });