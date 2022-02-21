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




async function getAlgorand(){
  

   //graphql

  await axios({
        url: 'https://graphql.bitquery.io/',
        method: 'post',
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYeZAN1vMyjkjff5AZlVMmzjeS7yfOC"
        },
        data: {
          query: `
          {
            algorand(network: algorand) {
              address(address: {is: "2RJCZ73A46W4FTNL53VOPVYE3K5ERDZPM5GJLJO4HV2PZKB5KM34YWYEDM"}) {
                balance
                rewards
                pendingRewards
              }
            }
          }
          
            `
        }
      }).then((result) => {
        console.log(result.data)
        return result
      });





}

  getAlgorand().then((value) => {
    console.log(value);
  });