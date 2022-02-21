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

async function getTransactionHistory(address) {
	//URL SET OBJECT CONSTRUCTION
 
    let config = {'project_id': 'mainnet8F3T49uYJPcVDRAHBYizLCnZbpRQf9Zb'};
    let url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/transactions`
    let data = await axios.get(url,{headers: config}).then((d)=>{
        console.log(d.data)
        return d.data
    })

 
    let hashes = []
    for(i=0;i<data.length; i++){
        hash = data[i].tx_hash 
        hashes.push(hash)
    }

    
    for(i=0;i<hashes.length; i++){
        let url = `https://cardano-mainnet.blockfrost.io/api/v0/txs/${hashes[i]}`
        let data = await axios.get(url,{headers: config}).then((d)=>{
            console.log(d.data)
            return d.data
        })

    }
    let url = `https://cardano-mainnet.blockfrost.io/api/v0/txs/${hash}`
    let data = await axios.get(url,{headers: config}).then((d)=>{
        console.log(d.data)
        return d.data
    })
    return data
	
}


//external cardano address
//address = "addr1q9v9yduhhlnywrpzatt6q7rnfxqyxa36cu78azpk3cmvlwyvtevj284hvlj339sk3sgevndqem8xn3f5map6hwple3lswxp0nk"
//internal cardano address
//address = "addr1q9rh95kyhs4t8z35ku0fr7p2afd83gzahkc74yc62h4ss8vvtevj284hvlj339sk3sgevndqem8xn3f5map6hwple3lsm0e259"
//"used" cardano address
address = "addr1qxj649xw80nhek559w5xygtdhd9ep028cqwrrxlsurl47g5vtevj284hvlj339sk3sgevndqem8xn3f5map6hwple3lsfqq0q7"
//address = "tz1PBLXtgPX2cdFkiFcifzKDDWUyQuXdXjbp"
 //address = "KT1Aou1nSui5HNdNFc8bNYT6AtyRhYwhUKTe"
//var address = "tz1fKe1LmdrU16BVquHuxZKEAQvwckseceSq"
//var address = "tz1fJLvQktqiyHuf4wR23jgbZuKVzAQSMoku"
// var address = "tz1Y7UUgQ8hZ4kddaEdiUJ5o46HKtv3hNkx9"
getTransactionHistory(address).then((value) => {
    console.log(value);
    return value
  });


  async function getTransactions(address) {
	//TRANSACTION OBJECT CONSTRUCTION

    //may need to vet reward transactions
	//baker history object call
	const rewardFetch = await getBakerHistory(address);

	//transaction tzkt url - https://api.tzkt.io/v1/operations/transactions?anyof.sender.target={$address} will return operations where sender OR target is equal to the specified value. This parameter is useful when you need to retrieve all transactions associated with a specified account.
	let url2 = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${address}`;
	const response2 = await axios.get(url2);

	let objectArray = [];
	let object = {};
	for (i = 0; i < response2.data.length; i++) {
		//each baker address in the object
		if (response2.data[i].target.address == address) {
			date = new Date(response2.data[i].timestamp);
			amount = response2.data[i].amount / 1000000;
			object = {
				date: date,
				amounnt: amount,
			};
			objectArray.push(object);
		} else if (response2.data[i].sender.address == address) {
			date = new Date(response2.data[i].timestamp);
			amount = (response2.data[i].amount / 1000000) * -1;
			object = {
				date: date,
				amounnt: amount,
			};
			objectArray.push(object);
		}
		for (j = 0; j < rewardFetch.length; j++) {
			//check for baker transactions
			let baker = rewardFetch[j].baker;
			let sender = response2.data[i].sender.address;
			let target = response2.data[i].target.address;
			if (sender == baker || target == baker) {
				objectArray.pop();
			}
		}
	}
	return objectArray;
}

let basisBalances = await getBalances(address);

	//VET SAME DAY ~NULL~ NET POSITIVE TRANSACTIONS - looking for real increases to the basis
	let netPositives = [];
	for (i = 0; i < positiveTrans.length; i++) {
		let date = await formatDate(positiveTrans[i].date);
		//let prevDayUnformatted = await addDays(date, 0) // 2 into this funciton moves date up by 1
		//let prevDay = await formatDate(prevDayUnformatted)
		let value = positiveTrans[i].amount;

		//balance object
        //checks for same day transaction by checking EOD balance array by the transaction array.
		let bal1 = basisBalances[date];
		//let index = Object.keys(balanceObject).indexOf(date)
		//let bal2 = balanceObject[prevDay]
		//if postive trans value  - balance - positive trans value < 0
		if (bal1 - value < 0) {
		} else {
			object = {
				date: positiveTrans[i].date,
				amount: positiveTrans[i].amount,
			};
			netPositives.push(object);
		}
	}


    

let pricesForUser = await getPricesAndMarketCap(fiat);
	console.log('done w price and market')

	//let tranArray = await getTransactions(address);
	// console.log('done w trans')

	//POSTIVE TRANSACTIONS OBJECT
	let positiveTrans = [];
	for (i = 0; i < tranArray.length; i++) {
		if (tranArray[i].amounnt > 0) {
			object = {
				date: tranArray[i].date,
				amount: tranArray[i].amounnt,
			};
			positiveTrans.push(object);
		}
	}


    // rn - if it stayed in longer than a day than its going to be part of the average
	let netPositiveTotal = 0
	let priceByincreaseTotal = 0
	let significantPrices = [];
	for (i = 0; i < netPositives.length; i++) {
		let date = await formatDate(netPositives[i].date);
		for (j = 0; j < pricesForUser.length; j++) {
			let priceDate = await formatDate(pricesForUser[j].date);
			if (priceDate == date) {
				significantPrices.push(pricesForUser[j].price);
			}
		}
		netPositiveTotal += netPositives[i].amount
		priceByincreaseTotal += netPositives[i].amount * significantPrices[i]
	}

	let basisPrice = priceByincreaseTotal / netPositiveTotal;
	console.log('done w price')

// delegatorhistory:

//   https://cardano-mainnet.blockfrost.io/api/v0/accounts/{stake_address}/delegations


// transactionhistory

//   https://cardano-mainnet.blockfrost.io/api/v0/addresses/{address}/transactions


//balance history

//https://cardano-mainnet.blockfrost.io/api/v0/accounts/{stake_address}/history


//cardano pool information simialr to baking bad https://adapools.org/delegations



epochs to days
block time to days