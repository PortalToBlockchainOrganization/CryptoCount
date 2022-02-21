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

(async () => {
  // Connect to cluster
  var connection = new web3.Connection(
    web3.clusterApiUrl('http://192.168.1.88:8899'),
    'confirmed',
  );

  console.log(connection)

//   // Generate a new random public key
//   var from = web3.Keypair.generate();
//   var airdropSignature = await connection.requestAirdrop(
//     from.publicKey,
//     web3.LAMPORTS_PER_SOL,
//   );
//   await connection.confirmTransaction(airdropSignature);

//   // Generate a new random public key
//   var to = web3.Keypair.generate();

//   // Add transfer instruction to transaction
//   var transaction = new web3.Transaction().add(
//     web3.SystemProgram.transfer({
//       fromPubkey: from.publicKey,
//       toPubkey: to.publicKey,
//       lamports: web3.LAMPORTS_PER_SOL / 100,
//     }),
//   );

//   // Sign transaction, broadcast, and confirm
//   var signature = await web3.sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [from],
//   );
//   console.log('SIGNATURE', signature);
})();

async function getVelas(){
  

    //works

//     //top 10 coins on velas?
//  axios({
//     url: 'https://graphql.bitquery.io/',
//     method: 'post',
//     headers: {
//         "Content-Type": "application/json",
//       "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
//     },
//     data: {
//       query: `
//       {
//         ethereum(network: velas) {
//           transfers(options: {desc: "count" limit: 10}) {
//             currency {
//               symbol
//               address
//             }
//             count
//             senders: count(uniq: senders)
//             receivers: count(uniq: receivers)
//             days: count(uniq: dates)
//             from_date: minimum(of: date)
//             till_date: maximum(of: date)
//             amount
//           }
//         }
//       }
//         `
//     }
//   }).then((result) => {
//     console.log(result.data)
//   });
  
 










  //get transactions - currencies sent and received thru address 
//   vals 
//   {
//     "limit": 10,
//     "offset": 0,
//     "network": "velas",
//     "address": "BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M",
//     "from": null,
//     "till": null,
//     "dateFormat": "%Y-%m"
//   }


//   axios({
//     url: 'https://graphql.bitquery.io/',
//     method: 'post',
//     headers: {
//         "Content-Type": "application/json",
//       "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
//     },
//     data: {
//       query: `
//       query ($network: "velas", $address: "BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M", $from: "2021-02-09T18:11:18+0000", $till: null, $limit: 5, $offset: 0) {
//         ethereum(network: $network) {
//           transfers(
//             date: {since: $from, till: $till}
//             amount: {gt: 0}
//             options: {limit: $limit, offset: $offset, desc: ["count_in", "count_out"], asc: "currency.symbol"}
//           ) {
//             sum_in: amount(calculate: sum, receiver: {is: $address})
//             sum_out: amount(calculate: sum, sender: {is: $address})
//             count_in: count(receiver: {is: $address})
//             count_out: count(sender: {is: $address})
//             currency {
//               address
//               symbol
//               tokenType
//             }
//           }
//         }
//       }
//       {
//                 ethereum(network: velas, address: BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M, from: 2021-02-09T18:11:18+0000, till: null, limit: 5, offset: 0) {
//                     transfers(
//                         date: {since: $from, till: $till}
//                         amount: {gt: 0}
//                         options: {limit: $limit, offset: $offset, desc: ["count_in", "count_out"], asc: "currency.symbol"}
//                       ) {
//                         sum_in: amount(calculate: sum, receiver: {is: $address})
//                         sum_out: amount(calculate: sum, sender: {is: $address})
//                         count_in: count(receiver: {is: $address})
//                         count_out: count(sender: {is: $address})
//                         currency {
//                           address
//                           symbol
//                           tokenType
//                         }
//                       }
//                     }
//                   }
      
//         `
//     }
//   }).then((result) => {
//     console.log(result.data)
//   });




  

//get balance for velas address 


  axios({
        url: 'https://graphql.bitquery.io/',
        method: 'post',
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
        },
        data: {
          query: `
          query ($network: velas, $address: 0x88wpWNCVqS9xFkV7CYGNUWKLjgcAMbUoJ4oty5qzEwMH) {
            ethereum(network: $network) {
              address(address: {is: $address}) {
                
                balances {
                  value
                  
                  currency {
                    symbol
                  }
                }
              }
            }
          }
            `
        }
      }).then((result) => {
        console.log(result.data)
      });




  //my staking account
  //BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M

  //look for delegation here in liquidy-wagu?
//   query ($addr: String) {
//     ethereum(network: velas) {
//       smartContractCalls(txHash: {is: $addr}) {
//         smartContractMethod {
//           name
//           signature
//         }
//         arguments {
//           argument
//           value
//         }
//         block {
//           timestamp {
//             unixtime
//           }
//           height
//         }
//         smartContract {
//           address {
//             address
//             annotation
//           }
//           protocolType
//           contractType
//           currency {
//             symbol
//           }
//         }
//         caller {
//           address
//         }
//       }
//       smartContractEvents(txHash: {is: $addr}) {
//         eventIndex
//         smartContract {
//           address {
//             address
//           }
//         }
//         smartContractEvent {
//           name
//           signature
//         }
//         arguments {
//           argument
//           value
//         }
//       }
//     }
//   }

}

  getVelas().then((value) => {
    console.log(value);
    return value
  });