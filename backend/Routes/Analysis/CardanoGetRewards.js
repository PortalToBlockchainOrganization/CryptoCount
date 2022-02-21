
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

async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION
 
    let config = {'project_id': 'mainnet8F3T49uYJPcVDRAHBYizLCnZbpRQf9Zb'};
    let url = `https://cardano-mainnet.blockfrost.io/api/v0/accounts/${address}/rewards`
    let data = await axios.get(url,{headers: config}).then((d)=>{
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

//balance history

//https://cardano-mainnet.blockfrost.io/api/v0/accounts/{stake_address}/history



//staking pool operator

https://cardano-mainnet.blockfrost.io/api/v0/pools/{pool_id}/history


address = "stake1uxx9ukf9r6mk0egcjctgcyvkfksvannfc56d7sathqluclcjr4f76"
//address = "tz1PBLXtgPX2cdFkiFcifzKDDWUyQuXdXjbp"
 //address = "KT1Aou1nSui5HNdNFc8bNYT6AtyRhYwhUKTe"
//var address = "tz1fKe1LmdrU16BVquHuxZKEAQvwckseceSq"
//var address = "tz1fJLvQktqiyHuf4wR23jgbZuKVzAQSMoku"
// var address = "tz1Y7UUgQ8hZ4kddaEdiUJ5o46HKtv3hNkx9"
getRewards(address).then((value) => {
    console.log(value);
    return value
  });




  import * as gql from 'gql-query-builder'

const query = gql({
  operation: 'orders',
  fields: [
    'id',
    'amount',
    {
     user: [
        'id',
        'name',
        'email',
        {
          address: [
            'city',
            'country'
          ]
        }
      ]
    }
  ]
})

console.log(query)

// Output
query {
  orders  {
    id,
    amount,
    user {
      id,
      name,
      email,
      address {
        city,
        country
      }
    }
  }
}