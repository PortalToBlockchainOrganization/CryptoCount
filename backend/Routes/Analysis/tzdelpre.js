const mongoose = require("mongoose");

let StatisticModel = require("../../model/statistic.js");
let CycleModel = require("../../model/cycle");
let axios = require("axios");
const { resolve } = require("bluebird");

//the higher the level of the function the deeper into our program's logic

//HENRIK ** CAN YOU HOOK UP ALL THE MODELS TO THE RIGHT ROUTE AND CONNECT THIS PROGRAM TO THE DB *********
const BlockchainModel = require("../../model/blockchain.js");
const RealizeSet = require("../../model/realize.js");

//level 1
async function getCyclesDays() {
	//CYCLES TO DAYS OBJECT CONSTRUCTION
	const cycleDocs = await CycleModel.find();
	//call from db is already paired // unneccsary?
	let cycles = {};
	for (let i = 0; i < cycleDocs.length; i++) {
		c = cycleDocs[i].cycleNumber;
		cycles[c] = cycleDocs[i].dateString;
	}
	//field cycles a cycle and it returns a date

	/*
    let dates = {}
    for (let i = 0; i < cycleDocs.length; i++) {
        d = cycleDocs[i].dateString
        dates[d] = cycleDocs[i].cycleNumber
    }
    //field dates a date and it returns a cycle
    */

	return cycles;
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

//let [ad1, ad2, ad3, ad4] = ['tz1Kp1bzqn6Tg2kxefkRM329Y4nGLHFaveD8','tz1LXMcTazxYMqAJidpvvFUkyXq1th9rBHiK','tz1MGBDU9xWdZuSs47wMRc5iShF7ZDaymk9z','KT1UvEb6CWiMD6bg5CJBZCceS1NkMA2mnXUS']

//level 1
async function getBalances(address) {
	//BALANCE OBJECT CONSTRUCTION
	let balances = {};
	let offset = 0;
	while (true) {
		try {
			let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
			const response = await axios.get(url);
			offset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
			for (let i = 0; i < response.data.length; i++) {
				const element = response.data[i];
				const d = element.timestamp.substring(0, 10);
				balances[d] = element.balance;
			}
			if (response.data.length < 10000) {
				// if is the last page
				break;
			}
		} catch (error) {
			console.error(error);
		}
	}
	return balances;
}

//level 1
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

//level 2
async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION

	//call cycle doc object
	const cycleDocs = await CycleModel.find();

	//call baker history object
	const rewardFetch = await getBakerHistory(address);

	//call cycles days object
	const cycles = await getCyclesDays();

	let length = cycleDocs.length - 1;
	let cycleEnd = cycleDocs[length].cycleNumber;

	//url object construction
	let urls = rewardFetch.length;
	let urlSet = [];
	let urlObj = {};

	for (let j = 0; j < urls; j++) {
		let bakerAddress = rewardFetch[j].baker;
		//if before irl cycle end
		for (
			let i = rewardFetch[j].cycleStart;
			i <= cycleEnd || i < rewardFetch[j].cycleEnd + 1;
			i++
		) {
			urlObj = {
				url: `https://api.baking-bad.org/v2/rewards/${bakerAddress}?cycle=${i}`,
			};
			urlSet.push(urlObj);
		}
	}

	//URL OBJECT USING
	//define the query promise contructor here
	function promiseGet(url) {
		return new Promise((resolve, reject) => {
			try {
				payload = axios.get(url);
				resolve(payload);
			} catch (err) {
				console.log(`Could not get data from url: ${url}`);
				reject(new Error(err));
			}
			//add ids by cycle or something here
		});
	}

	var promises = [];
	urlSet.forEach((url) => {
		promises.push(
			promiseGet(url.url)
				.then((data) => {
					urlObj = data;
					let payoutArray = urlObj.data.payouts;
					// console.log(payoutArray);
					let addressProperty = "address";
					let amountProperty = "amount";
					for (let i = 0; i < payoutArray.length; i++) {
						if (address === payoutArray[i][addressProperty]) {
							amount = payoutArray[i][amountProperty];
							if (amount < 0.0001 && amount > 0) {
								amount = amount * 10000;
							}
							rewardObject = {
								quantity: amount,
								cycle: urlObj.data.cycle,
							};
							return rewardObject;
						}
					}
				})
				.catch((err) => {
					console.log(err);
				})
		);
	});

	//finish all promise models push all returned data up to the base level of the method execution
	let rewards = [];
	await Promise.all(promises)
		.then((values) => {
			values.forEach((element) => {
				if (typeof element === "object") {
					var reward = element;
					rewards.push(reward);
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});

	let rewardsByDay = [];
	let rewardByDayObj = {};
	for (i = 0; i < rewards.length; i++) {
		let c = rewards[i].cycle;
		let date = cycles[c];
		rewardByDayObj = {
			date: date,
			rewardQuantity: rewards[i].quantity,
			cycle: c,
		};
		rewardsByDay.push(rewardByDayObj);
	}

	return rewardsByDay;
}

//level 2
//function get tranasactions
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

//REALIZE ROUTE
async function realizeRew() {
	//take realize post api
	realizedQuantity = 20;

	realizedQ = realizedQuantity;
	realizedQ3 = realizedQuantity; //get the realizehistoryobject from the db

	foundRealizeHistory = await realizeSets.find();

	//     console.log(foundRealizeHistory)

	basisPrice = foundRealizeHistory.data.basisPrice;
}

//level 3

async function analysis(address, basisDate, fiat) {
	//label objects by blocks, delete repeats, remove clutter

	//DATA DEPENDCEIES
	let rewards = await getRewards(address);
	let basisBalances = await getBalances(address);
	let pricesForUser = await getPricesAndMarketCap(fiat);
	let tranArray = await getTransactions(address);

	//BASIS REWARD OBJECT
	let basisPrice = 0;
	for (let i = 0; i < pricesForUser.length; i++) {
		const a = Date.parse(pricesForUser[i].date) - 1000 * 60 * 60 * 8;
		const b = Date.parse(basisDate);
		const c = Date.parse(pricesForUser[i].date) - 1000 * 60 * 60 * 7;
		if (a == b || b == c) {
			basisPrice = pricesForUser[i].price;
		}
	}

	let basisRewards = [];
	for (let i = 0; i < rewards.length; i++) {
		reward = rewards[i].rewardQuantity;
		basisRewardsObj = {
			date: rewards[i].date,
			basisReward: reward * basisPrice,
		};
		basisRewards.push(basisRewardsObj);
	}

	//book value for basis rewards is unnessarry, it is calculeted for depletion
	let basisValue = basisBalances[basisDate];
	let bookVal = basisPrice * (basisValue / 1000000);
	let bookValsBasis = [];
	let bvBasObj = {
		date: basisRewards[0].date,
		bvBas: bookVal,
	};
	bookValsBasis.push(bvBasObj);

	for (i = 1; i < basisRewards.length - 1; i++) {
		bookVal = bookValsBasis[i - 1].bvBas + basisRewards[i].basisReward;
		bvBasObj = {
			date: basisRewards[i].date,
			bvBas: bookVal,
		};
		bookValsBasis.push(bvBasObj);
	}

	//SUPPLY DEPLETION REWARDS OBJECT
	//Dependency Object
	const supplyDocs = await StatisticModel.find();
	let totalSupplys = [];
	for (let i = 0; i < supplyDocs.length; i++) {
		const d = supplyDocs[i].dateString;
		totalSupply = supplyDocs[i].totalSupply;
		totalSupplyObj = {
			date: d,
			supply: totalSupply,
		};
		totalSupplys.push(totalSupplyObj);
	}
	let supply = [];
	for (let i = 0; i < basisRewards.length; i++) {
		let date = basisRewards[i].date;
		for (j = 0; j < totalSupplys.length; j++) {
			if (date == totalSupplys[j].date) {
				supplyObj = {
					date: date,
					supply: totalSupplys[j].supply,
				};
				supply.push(supplyObj);
			}
		}
	}
	//main object construction
	let bookValsDepletion = [];
	let bvDepObj = {
		date: basisRewards[0].date,
		bvDep: bookVal,
	};
	bookValsDepletion.push(bvDepObj);
	let basisRewardDepletion = [];
	for (i = 1; i < basisRewards.length - 1; i++) {
		let tranVal = 0;
		let date = basisRewards[i].date;
		let nextDate = basisRewards[i + 1].date;
		for (j = 0; j < tranArray.length; j++) {
			if (
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 7 ==
					Date.parse(date) ||
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 8 ==
					Date.parse(date)
			) {
				tranVal = tranArray[j].amounnt;
			} else if (
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 7 >
					Date.parse(date) ||
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 8 >
					Date.parse(date)
			) {
				if (
					Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 7 <
						Date.parse(nextDate) ||
					Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 8 <
						Date.parse(nextDate)
				) {
					tranVal = tranArray[j].amounnt;
				}
			}
		}
		let depletion =
			bookValsDepletion[i - 1].bvDep *
			(1 - supply[i - 1].supply / supply[i].supply);
		let bookVal =
			bookValsDepletion[i - 1].bvDep +
			basisRewards[i].basisReward -
			depletion +
			tranVal * basisPrice;
		let bvDepObj = {
			date: basisRewards[i].date,
			bvDep: bookVal,
		};
		let percentage = basisRewards[i].basisReward / bookVal;
		let rewardDepletionObj = {
			date: basisRewards[i].date,
			rewBasisDepletion:
				basisRewards[i].basisReward - depletion * percentage, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
		};
		bookValsDepletion.push(bvDepObj);
		basisRewardDepletion.push(rewardDepletionObj);
	}

	//MARKET VALUE DEPLETION REWARDS OBJECT
	//Dependency Object
	let mvdAnal = [];
	for (let i = 0; i < basisRewards.length; i++) {
		for (let j = 0; j < pricesForUser.length; j++) {
			let date1 = Date.parse(basisRewards[i].date);
			let date2 = Date.parse(pricesForUser[j].date) - 1000 * 60 * 60 * 7;
			let date3 = Date.parse(pricesForUser[j].date) - 1000 * 60 * 60 * 8;
			if (date1 == date2) {
				let date = pricesForUser[j].date;
				let marketCap = pricesForUser[j].marketCap;
				let price = pricesForUser[j].price;
				mvdObj = {
					date: date,
					marketCap: marketCap,
					price: price,
				};
				mvdAnal.push(mvdObj);
			} else if (date1 == date3) {
				let date = pricesForUser[j].date;
				let marketCap = pricesForUser[j].marketCap;
				let price = pricesForUser[j].price;
				mvdObj = {
					date: date,
					marketCap: marketCap,
					price: price,
				};
				mvdAnal.push(mvdObj);
			}
		}
	}
	//main object construction
	let bookValsMVDepletion = [];
	let bvMvDepObj = {
		date: basisRewards[0].date,
		bvMvDep: bookVal,
	};
	bookValsMVDepletion.push(bvMvDepObj);
	let basisRewardMVDepletion = [];
	for (i = 1; i < basisRewards.length - 1; i++) {
		let tranVal = 0;
		date = basisRewards[i].date;
		nextDate = basisRewards[i + 1].date;
		for (j = 0; j < tranArray.length; j++) {
			if (
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 7 ==
					Date.parse(date) ||
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 8 ==
					Date.parse(date)
			) {
				tranVal = tranArray[j].amounnt;
			} else if (
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 7 >
					Date.parse(date) ||
				Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 8 >
					Date.parse(date)
			) {
				if (
					Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 7 <
						Date.parse(nextDate) ||
					Date.parse(tranArray[j].date) - 1000 * 60 * 60 * 8 <
						Date.parse(nextDate)
				) {
					tranVal = tranArray[j].amounnt;
				}
			}
		}
		let MVdepletion =
			bookValsMVDepletion[i - 1].bvMvDep *
			(mvdAnal[i].marketCap / mvdAnal[i - 1].marketCap -
				mvdAnal[i].price / mvdAnal[i - 1].price);
		bookVal =
			bookValsMVDepletion[i - 1].bvMvDep +
			basisRewards[i].basisReward -
			MVdepletion +
			tranVal * basisPrice;
		let bvMVDepObj = {
			date: basisRewards[i].date,
			bvMvDep: bookVal,
		};
		let percentage = basisRewards[i].basisReward / bookVal;
		let rewardMVDepletionObj = {
			date: basisRewards[i].date,
			rewBasisMVDepletion:
				basisRewards[i].basisReward - MVdepletion * percentage,
		};
		bookValsMVDepletion.push(bvMVDepObj);
		basisRewardMVDepletion.push(rewardMVDepletionObj);
	}

	//RETURN OBJECT
	analysisResObj = {
		//need basis rewards, mvd rewards, dep rewards
		rewards: rewards,
		basisRewards: basisRewards,
		basisRewardsDep: basisRewardDepletion,
		basisRewardsMVDep: basisRewardMVDepletion,
		address: address,
		fiat: fiat,
		basisDate: basisDate,
		basisPrice: basisPrice,
	};

	return analysisResObj;
}

let address = "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH";

//users can only select a absis date that has a balance value
/*
analysis(address, '2021-02-28', 'USD').then((value) => {
    console.log(value)
})
*/

//REALIZE OBJECTS

//convert analysis object into realize history object

async function realizeHistoryObjectConstructor() {
	//analysis object call
	let analysisObject = await analysis(address, "2021-02-28", "USD");

	//aggregate each set
	let totalBasisReward = 0;
	for (i = 0; i < analysisObject[0].basisRewards.length; i++) {
		totalBasisReward += analysisObject[0].basisRewards[i].basisReward;
	}
	let totalBasisRewardDep = 0;
	for (i = 0; i < analysisObject[0].basisRewardsDep.length; i++) {
		totalBasisRewardDep +=
			analysisObject[0].basisRewardsDep[i].rewBasisDepletion;
	}
	let totalBasisRewardMVdep = 0;
	for (i = 0; i < analysisObject[0].basisRewardsMVdep.length; i++) {
		totalBasisRewardMVdep +=
			analysisObject[0].basisRewardsMVdep[i].rewBasisMVDepletion;
	}

	let realizeHistoryObject = {
		//parse the analysis object
		unrealizedBasisRewards: analysisObject[0].basisRewards, // list of pair of dates and values
		unrealizedBasisRewardsDep: analysisObject[0].basisRewardsDep, // list of pair of dates and values
		unrealizedBasisRewardsMVdep: analysisObject[0].basisRewardsMVdep, // list of pair of dates and values

		//empty realized sets
		realizedBasisRewards: [], // list of pair of dates and values
		realizedBasisRewardsDep: [], // list of pair of dates and values
		realizedBasisRewardsMVdep: [], // list of pair of dates and values

		//the descriptors
		fiat: analysisObject[0].fiat, // desc
		address: analysisObject[0].address, // desc
		basisDate: analysisObject[0].basisDate, // desc
		basisPrice: analysisObject[0].basisPrice, // desc

		unrealizedBasisAgg: totalBasisReward, // single vals
		unrealizedDepAgg: totalBasisRewardDep, // single vals
		unrealizedMVdAgg: totalBasisRewardMVdep, // single vals
		realizedBasisAgg: 0, // single vals
		realizedDepAgg: 0, // single vals
		realizedMVdAgg: 0, // single vals

		id: 1,
	};

	return realizeHistoryObject;
}

// realizeHistoryObjectConstructor().then((value) => {
//     console.log(value)
// })

module.exports = { analysis };

/*

//REALIZE ROUTE

realizeRew(frontendRealize){
    //take realize post api

    //get the realizehistoryobject from the db

    //fifo logic
    unrealizedSetObject x3 = unrealizedSetObject / basisPrice  - realized quantity  
    realizedSetObject x3 =  realizedSetObject / basisPrice + realized quantity 


    unrealizedSetObject x3 = unrealizedSetObject * basisPrice  
    realizedSetObject x3 =  realizedSetObject * basisPrice

    //repopulate the realize history object

    //post the history object

}


saveRealize(){

    //save the realize history object append to previous realize history object

}


realizeAll(){

}
*/
