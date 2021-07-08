let StatisticModel = require("../backend/model/statistic.js");
let CycleModel = require("../backend/model/cycle");
let axios = require("axios");
const { resolve } = require("bluebird");
const BlockchainModel = require("../backend/model/blockchain.js");

let db = require("../backend/config/db")

Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

//ip broken from starbucks
//db().then((value) => {console.log('connected to db')})

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//level 1
async function getBakerHistory(address) {
	//BAKER HISTORY OBJECT CONSTRUCTION
	let url = `https://api.tzkt.io/v1/rewards/delegators/${address}?cycle.ge=0`;
	const response = await axios.get(url);
	let delegatorHistory = [];
	let delegatorHistObj = {};
	//delegator history object
	for (let i = 0; i < response.data.length; i++) {
		const element = response.data[i];

		delegatorHistObj = {
			baker: element.baker.address,
			cycle: element.cycle,
			balance: element.balance, //in mu tez
		};
		delegatorHistory.push(delegatorHistObj);
	}

	//reward fetch object
	let rewardFetch = [];
	let rewardFetchObj = {};

	let i = delegatorHistory.length - 1;
	rewardFetchObj = {
		baker: delegatorHistory[i].baker,
		cycleStart: delegatorHistory[i].cycle,
	};
	rewardFetch.push(rewardFetchObj);

	for (let j = delegatorHistory.length - 2; j > 0; j--) {
		const element = delegatorHistory[j];
		if (element.baker !== delegatorHistory[j + 1].baker) {
			rewardFetchObj = {
				baker: element.baker,
				cycleStart: element.cycle,
			};
			rewardFetch.push(rewardFetchObj);
			let cycleEnd = delegatorHistory[j + 1].cycle;
			let index = rewardFetch.length - 2;
			let prevObj = rewardFetch[index];
			prevObj.cycleEnd = cycleEnd;
		}
	}
	return rewardFetch;
}


async function getBalances(address) {
	let balances = {};
	//offset from index
	let offset = 0;
	let resp_lens = 10000;
	while (resp_lens === 10000) {
		let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
		const response = await axios.get(url);
		resp_lens = response.data.length;
		offset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
		// api returns only changes
		// for each date, check date ahead and fill all dates upto that date
		for (let i = 0; i < response.data.length - 1; i++) {
			const element = response.data[i];
			//make this into normal date
			var d1 = element.timestamp.substring(0, 10);
			var d2 = response.data[i + 1].timestamp.substring(0, 10);

			if (d1 === d2) {
				balances[d1] = element.balance;
			} else {
				d1 = new Date(d1);
				d2 = new Date(d2);
				date_itr = d1;
				while (date_itr < d2) {
					date_key = date_itr.toISOString().slice(0, 10);
					balances[date_key] = response.data[i].balance;
					date_itr = date_itr.addDays(1);
				}
			}
		}
	}
	return balances;
}

async function getTransactions(address) {
	//TRANSACTION OBJECT CONSTRUCTION

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


async function getPricesAndMarketCap(fiat) {
	//PRICE AND MARKET CAPITAL OBJECT
	let price = `price${fiat}`;
	let marketCap = `marketCap${fiat}`;
	let priceAndMarketCapData = await BlockchainModel.find();
	let finalData = [];
	for (i = 0; i < priceAndMarketCapData.length; i++) {
		let date = priceAndMarketCapData[i].date;
		//why cant identifier at end be var?
		let priceN = priceAndMarketCapData[i][price];
		let marketCapN = priceAndMarketCapData[i][marketCap];
		finalObj = {
			date: date,
			price: priceN,
			marketCap: marketCapN,
		};
		finalData.push(finalObj);
	}
	return finalData;
}

async function avgBasisPrice(address, fiat) {
	let transObject = await getTransactions(address);

	let balanceObject = await getBalances(address); //balances are EOD

	//let priceObject = await getPricesAndMarketCap(fiat);

	//POSTIVE TRANSACTIONS OBJECT
	let positiveTrans = [];
	for (i = 0; i < transObject.length; i++) {
		if (transObject[i].amounnt > 0) {
			object = {
				date: transObject[i].date,
				amount: transObject[i].amounnt,
			};
			positiveTrans.push(object);
		}
	}

	//VET SAME DAY ~NULL~ NET POSITIVE TRANSACTIONS - looking for real increases to the basis
	let netPositives = [];
	for (i = 0; i < positiveTrans.length; i++) {
		let date = await formatDate(positiveTrans[i].date);
		//let prevDayUnformatted = await addDays(date, 0) // 2 into this funciton moves date up by 1
		//let prevDay = await formatDate(prevDayUnformatted)
		let value = positiveTrans[i].amount;

		//balance object
		let bal1 = balanceObject[date];
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
	// rn - if it stayed in longer than a day than its going to be part of the average

	let significantPrices = [];
	for (i = 0; i < netPositives.length; i++) {
		let date = await formatDate(netPositives[i].date);
		for (j = 0; j < priceObject.length; j++) {
			let priceDate = await formatDate(priceObject[j].date);
			if (priceDate == date) {
				significantPrices.push(priceObject[j].price);
			}
		}
	}

	let totalPrice = 0;
	let totalQuantity = 0;
	for (i = 0; i < significantPrices.length; i++) {
		totalPrice += significantPrices[i];
		totalQuantity += 1;
	}

	let avgBasisPriceVal = totalPrice / totalQuantity;

	return avgBasisPriceVal;
}



//THE BASIS CALCULATOR WILL SHOW YOUR ADDRESS'S GREATEST VALUE IN THE LAST 48 HOURS

async function basisCalc(address) {
    var transObject = await getTransactions(address)

    //Negative TRANSACTIONS OBJECT
	let negTrans = [];
	for (i = 0; i < transObject.length; i++) {
		if (transObject[i].amounnt < 0) {
			object = {
				date: transObject[i].date,
				amount: transObject[i].amounnt,
			};
			negTrans.push(object);
		}
	}    

    var basisPrice = await avgBasisPrice(address)
    
    var balanceAr = await getBalances(address)
    var size = Object.size(balanceAr);

    var lastkey = Object.keys(balanceAr)[size - 1]
    var lastValue = balanceAr[lastkey]

    var nextlastKey =  Object.keys(balanceAr)[size - 2]
    var nextlastValue = balanceAr[nextlastKey]

    var nextnextlastKey = Object.keys(balanceAr)[size - 3]
    var nextnextLastValue = balanceAr[nextnextlastKey]


    //if you sold in the last 2 days we got you calculated 
    //var date = negTrans[negTrans.length - 1].date 
    
    let lastBalHigh = 0
    if(nextlastValue > lastValue){
         lastBalHigh = nextlastValue
    }
    else if(nextnextLastValue > lastValue){
        lastBalHigh = nextnextLastValue
    }
    else{
         lastBalHigh = lastValue
    }

    let alreadySold = lastBalHigh - lastValue
    

    let basis = (lastValue + alreadySold) / 1000000 * basisPrice

    return basis

    add onto db object when analysis run 

}

var address = 'tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH'
basisCalc(address).then((value) => {
    console.log(value)
})


realizeRew continuing into basisBucket

realizedQuantity * basisPrice 

remainingBasis = basis - realizedQuantity