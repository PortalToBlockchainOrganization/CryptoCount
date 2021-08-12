let StatisticModel = require("../../model/statistic.js");
let CycleModel = require("../../model/cycle");
let axios = require("axios");
const { resolve } = require("bluebird");

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
// hen version
// async function getBalances(address) {

//     //BALANCE OBJECT CONSTRUCTION
//     let balances = {};
//     let offset = 0;
//     while (true) {
//         try {
//             let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
//             const response = await axios.get(url);
//             offset += response.data.length  // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
//             for (let i = 0; i < response.data.length; i++) {
//                 const element = response.data[i];
//                 const d = element.timestamp.substring(0,10)
//                 balances[d] = element.balance;
//             }
//             if (response.data.length < 10000) {  // if is the last page
//                 break;
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     return balances;
// }

// updated version with date gap filling
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
				.then((urlObj) => {
					let payoutArray = urlObj.data.payouts;
					// console.log(payoutArray)
					let addressProperty = "address";
					let amountProperty = "amount";
					if (payoutArray === undefined) {
						console.log(urlObj);
					}

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
//REALIZE ROUTE
async function realizeRew(realizedQuantity, setId) {
	//take realize post api
	// let realizedQuantity = 900

	//get the realizehistoryobject from the db
	console.log(setId);
    let foundRealizeHistory = await RealizeSet.findOne({ _id: setId });

	//CANNOT ACCESS UNREALIZED REWARD SET // WORKAROUND HERE
	//y no access unrealized? walkaround
	//let realizingRewardQ = foundRealizeHistory[0].unrealizedBasisRewards[2].basisReward
	//let realizingRewardQ = foundRealizeHistory[0].unrealizedRewards[0].rewardQuantity
	// for(i = 0; i < foundRealizeHistory.unrealizedBasisRewards.length; i++){
	//     rewardQ = foundRealizeHistory.unrealizedBasisRewards[i].basisReward / basisPrice
	//     date = foundRealizeHistory.unrealizedBasisRewards[i].date
	//     reward = {
	//         "date": date,
	//         "q": rewardQ
	//     }
	//     unrealrewards.push(reward)
	// }
	//end patch

	//other unrealized sets

	let basisPrice = foundRealizeHistory.basisPrice;
	console.log("basisPrice");
	console.log(basisPrice);
	let unrealrewards = foundRealizeHistory.unrealizedRewards;
	unrealizedBasisRewards = foundRealizeHistory.unrealizedBasisRewards;
	unrealizedBasisRewardsDep = foundRealizeHistory.unrealizedBasisRewardsDep;
	unrealizedBasisRewardsMVDep =
		foundRealizeHistory.unrealizedBasisRewardsMVDep;
	// console.log(unrealizedBasisRewardsMVDep.length)

	//making realizing set
	realizingRewardQ = [];
	realzingRewardBasis = [];
	realzingRewardBasisDep = [];
	realzingRewardBasisMVDep = [];
	
	console.log("unreal rewards")
	console.log(unrealrewards)
	console.log("unreal length")
	console.log(unrealrewards.length)

	let iter1length = unrealrewards.length

	//REWARDS BUCKET 
	for (i = 0; i < iter1length; i++) {
		//quantity of unrealized rewward
		let currentQuantity = unrealrewards[i].rewardQuantity;

		console.log("realizedQuant")
		console.log(realizedQuantity)
		console.log("current quantity")
		console.log(currentQuantity)

		//CONDITION 1, if the rewards is less than the realizing q
		if (currentQuantity < realizedQuantity) {
			let realizingObj = unrealrewards.shift();
			realizingRewardQ.push(realizingObj);
			let realizingObj2 = unrealizedBasisRewards.shift();
			realzingRewardBasis.push(realizingObj2);
			let realizingObj3 = unrealizedBasisRewardsDep.shift();
			realzingRewardBasisDep.push(realizingObj3);
			let realizingObj4 = unrealizedBasisRewardsMVDep.shift();
			realzingRewardBasisMVDep.push(realizingObj4);
			realizedQuantity = realizedQuantity - currentQuantity;
		}
	}

	let iter2length = unrealrewards.length

	for (i = 0; i < iter2length; i++) {
		//CONDITION 2, if realizng q is greater than realized q and thats not zero
		//unreal rewards has been shifted back so all index must be lowered 1
		//technically i would need to recalculate the depletion to make this perfect using bv? or by scaling with proportions of proportions
		let q = unrealrewards[i].rewardQuantity;

		if (q > realizedQuantity && realizedQuantity != 0) {
			//ADD TO REALIZING
			newrealizngObj = {
				date: unrealrewards[0].date,
				rewardQuantity: realizedQuantity,
			};
			realizingRewardQ.push(newrealizngObj);

			newrealizngObj = {
				date: unrealizedBasisRewards[0].date,
				basisReward: realizedQuantity * basisPrice,
			};
			realzingRewardBasis.push(newrealizngObj);

			//dep = unrealizedBasisRewardsDep[0].rewBasisDepletion - (unrealrewards[0].rewardQuantity * basisPrice)
			newrealizngObj = {
				date: unrealizedBasisRewardsDep[0].date,
				rewBasisDepletion: realizedQuantity * basisPrice, //+ dep
			};
			realzingRewardBasisDep.push(newrealizngObj);

			//dep = unrealizedBasisRewardsMVDep[0].rewBasisMVDepletion - (unrealrewards[0].rewardQuantity * basisPrice)
			newrealizngObj = {
				date: unrealizedBasisRewardsMVDep[0].date,
				rewBasisMVDepletion: realizedQuantity * basisPrice, //+ dep
			};
			realzingRewardBasisMVDep.push(newrealizngObj);

			//MOD UNREAL
			unrealObj = {
				date: unrealrewards[0].date,
				rewardQuantity:
					unrealrewards[0].rewardQuantity - realizedQuantity,
			};
			unrealrewards.shift();
			unrealrewards.unshift(unrealObj);

			unrealObj = {
				date: unrealizedBasisRewards[0].date,
				basisReward:
					unrealizedBasisRewards[0].basisReward -
					realizedQuantity * basisPrice,
			};
			unrealizedBasisRewards.shift();
			unrealizedBasisRewards.unshift(unrealObj);

			//dep = unrealrewards[i-1].q * basisPrice - unrealizedBasisRewardsDep[i-1].rewBasisDepletion
			unrealObj = {
				date: unrealizedBasisRewardsDep[0].date,
				rewBasisDepletion:
					unrealizedBasisRewardsDep[0].rewBasisDepletion -
					realizedQuantity * basisPrice, // + dep
			};
			unrealizedBasisRewardsDep.shift();
			unrealizedBasisRewardsDep.unshift(unrealObj);
			//dep = unrealizedBasisRewardsMVDep[i-1].rewBasisMVDepletion - (unrealrewards[i-1].q * basisPrice)
			unrealObj = {
				date: unrealizedBasisRewardsMVDep[0].date,
				rewBasisMVDepletion:
					unrealizedBasisRewardsMVDep[0].rewBasisMVDepletion -
					realizedQuantity * basisPrice, // + dep
			};
			unrealizedBasisRewardsMVDep.shift();
			unrealizedBasisRewardsMVDep.unshift(unrealObj);

			//end reward realzing
			break;

		}
	}



    //BASIS BUCKET 

    

	let percentOfBasisRealizing = realizedQuantity / foundRealizeHistory.unrealXTZBasis 

    let realizingXTZbasis = realizedQuantity
  
    let realizingBasisP = foundRealizeHistory.unrealBasisP * percentOfBasisRealizing

    // throw 'stop execution';
	let realizingBasisDep = foundRealizeHistory.unrealBasisDep * percentOfBasisRealizing
    let realizingBasisMVdep = foundRealizeHistory.unrealBasisMVDep * percentOfBasisRealizing
    console.log(foundRealizeHistory.unrealBasisMVDep)

	let unrealizedXTZBasis = foundRealizeHistory.unrealXTZBasis - realizingXTZbasis
	let unrealizedBasisP = foundRealizeHistory.unrealBasisP - realizingBasisP
	let unrealizedBasisDep = foundRealizeHistory.unrealBasisDep - realizingBasisDep
    let unrealizedBasisMVdep = foundRealizeHistory.unrealBasisMVDep - realizingBasisMVdep
    

	//re aggregate
	let unrealizedRewardAgg = 0;
	let unrealizedBasisAgg = 0;
	let unrealizedDepAgg = 0;
	let unrealizedMVDAgg = 0;
	for (i = 0; i < unrealrewards.length; i++) {
		unrealizedRewardAgg += unrealrewards[i].rewardQuantity;
		unrealizedBasisAgg += unrealizedBasisRewards[i].basisReward;
		unrealizedDepAgg += unrealizedBasisRewardsDep[i].rewBasisDepletion;
		unrealizedMVDAgg += unrealizedBasisRewardsMVDep[i].rewBasisMVDepletion;
	}

	//re aggregate
	let realizingRewardAgg = 0;
	let realizingBasisAgg = 0;
	let realizingDepAgg = 0;
	let realizingMVdAgg = 0;
	for (i = 0; i < realizingRewardQ.length; i++) {
		realizingRewardAgg += realizingRewardQ[i].rewardQuantity;
		realizingBasisAgg += realzingRewardBasis[i].basisReward;
		realizingDepAgg += realzingRewardBasisDep[i].rewBasisDepletion;
		realizingMVdAgg += realzingRewardBasisMVDep[i].rewBasisMVDepletion;
	}

	//realize out of bookvalue - rewards = basis
	/*
    unrealizedBasis = foundRealizeHistory[0].unrealizedBasis - quantityRealized - realizedRewardAgg - realizingAgg
    realizingBasisQ = quantityRealized    
    realizingBasisBV = quantityRealized * basisPrice
	basis aggr
    */

	realizedObj = {
		realizingRewards: realizingRewardQ,
		unrealizedRewards: unrealrewards,
		realizingRewardBasis: realzingRewardBasis,
		unrealizedBasisRewards: unrealizedBasisRewards,
		realizingRewardBasisDep: realzingRewardBasisDep,
		unrealizedBasisRewardsDep : unrealizedBasisRewardsDep,
		realizingRewardBasisMVDep: realzingRewardBasisMVDep,
		unrealizedBasisRewardsMVDep : unrealizedBasisRewardsMVDep,
		unrealizedRewardAgg: unrealizedRewardAgg,
		unrealizedBasisAgg: unrealizedBasisAgg,
		unrealizedDepAgg: unrealizedDepAgg,
		unrealizedMVDAgg: unrealizedMVDAgg,
		realizingRewardAgg: realizingRewardAgg,
		realizingBasisAgg: realizingBasisAgg,
		realizingDepAgg: realizingDepAgg,
		realizingMVDAgg: realizingMVdAgg,
		//BASIS UPDATE SECTION
		realizingXTZbasis: realizingXTZbasis,
		realizingBasisP: realizingBasisP,
		realizingBasisDep: realizingBasisDep,
		realizingBasisMVDep: realizingBasisMVdep,
		unrealizedXTZBasis: unrealizedXTZBasis,
		unrealizedBasisP: unrealizedBasisP,
		unrealizedBasisDep: unrealizedBasisDep,
		unrealizedBasisMVDep: unrealizedBasisMVdep,
		address: foundRealizeHistory.address,
		basisDate: foundRealizeHistory.basisDate,
		basisPrice: foundRealizeHistory.basisPrice,
		fiat: foundRealizeHistory.fiat,
		realizedRewards: foundRealizeHistory.realizedRewards, //again not working ~ unrealized rewards and realized rewards from .find()
		realizedBasisRewards: foundRealizeHistory.realizedBasisRewards,
		realizedBasisRewardsDep: foundRealizeHistory.realizedBasisRewardsDep,
        realizedBasisRewardsMVDep: foundRealizeHistory.realizedBasisRewardsMVDep,
        _id: foundRealizeHistory._id

	};

	return realizedObj;
}

/**
 * @Sheen this ish is broken
 */
/**
 * 
    //re aggregate
    let unrealizedRewardAgg = 0 
    let unrealizedBasisAgg = 0
    let unrealizedDepAgg = 0 
    let unrealizedMVdAgg = 0
    for (i = 0; i < unrealrewards.length; i++){
        unrealizedRewardAgg += unrealrewards[i].rewardQuantity
        unrealizedBasisAgg += unrealizedBasisRewards[i].basisReward
        unrealizedDepAgg += unrealizedBasisRewardsDep[i].rewBasisDepletion
        unrealizedMVdAgg += unrealizedBasisRewardsMVDep[i].rewBasisMVDepletion
    }
     //re aggregate
     let realizingRewardAgg = 0 
     let realizingBasisAgg = 0
     let realizingDepAgg = 0 
     let realizingMVdAgg = 0
     for (i = 0; i < realizingRewardQ.length; i++){
        realizingRewardAgg += realizingRewardQ[i].rewardQuantity
        realizingBasisAgg += realzingRewardBasis[i].basisReward
        realizingDepAgg += realzingRewardBasisDep[i].rewBasisDepletion
        realizingMVdAgg += realzingRewardBasisMVDep[i].rewBasisMVDepletion
     }
    
    //realize out of bookvalue - rewards = basis 
    /*
    unrealizedBasis = foundRealizeHistory[0].unrealizedBasis - quantityRealized - realizedRewardAgg - realizingAgg
    realizingBasisQ = quantityRealized    
    realizingBasisBV = quantityRealized * basisPrice 
	realizedObj = {
        "realizingRewards": realizingRewardQ,
        // "unrealizedRewards": unrealrewards,
        "realzingRewardBasis": realzingRewardBasis,
        // "unrealizedBasisRewards": unrealizedBasisRewards,
        "realzingRewardBasisDep": realzingRewardBasisDep,
        // "unrealizedBasisRewardsDep" : unrealizedBasisRewardsDep,
        "realzingRewardBasisMVDep": realzingRewardBasisMVDep,
        // "unrealizedBasisRewardsMVDep" : unrealizedBasisRewardsMVDep,
        // "unrealizedRewardAgg": unrealizedRewardAgg,
        // "unrealizedBasisAgg": unrealizedBasisAgg,
        // "unrealizedDepAgg": unrealizedDepAgg,
        // "unrealizedMVdAgg": unrealizedMVdAgg,
        "realizingRewardAgg": realizingRewardAgg,
        "realizingBasisAgg": realizingBasisAgg,
        "realizingDepAgg": realizingDepAgg,
        "realizingMVdAgg": realizingMVdAgg,
        // "address": foundRealizeHistory.address,
        // "basisDate": foundRealizeHistory.basisDate,
        // "basisPrice": foundRealizeHistory.basisPrice,
        // "fiat": foundRealizeHistory.fiat,
        // "realizedRewards" : foundRealizeHistory.realizedRewards, //again not working ~ unrealized rewards and realized rewards from .find()
        // "realizedBasisRewards" : foundRealizeHistory.realizedBasisRewards,
        // "realizedBasisRewardsDep" : foundRealizeHistory.realizedBasisRewardsDep,
        // "realizedBasisRewardsMVdep" : foundRealizeHistory.realizedBasisRewardsMVDep,
        //"realizingBasisBV": realizingBasisBV,
        //"realizingBasisQ": realizingBasisQ,
        //"unrealizedBasis": unrealizedBasis
    }
    
    return realizedObj
}
    */

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
		const a = formatDate(pricesForUser[i].date);
		const b = formatDate(basisDate);
		if (a == b) {
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

	// fill in dates missing in gaps with previous value
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

	//
	//main object construction
	let bookValsDepletion = [];
	let bvDepObj = {
		date: basisRewards[0].date,
		bvDep: bookVal,
	};
	bookValsDepletion.push(bvDepObj);
	let basisRewardDepletion = [];
	let rewardDepletionObj = {
		date: basisRewards[0].date,
		rewBasisDepletion: basisRewards[0].basisReward, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
	};
	basisRewardDepletion.push(rewardDepletionObj);
	for (i = 1; i < basisRewards.length - 1; i++) {
		let tranVal = 0;
		let date = basisRewards[i].date;
		let nextDate = basisRewards[i + 1].date;
		for (j = 0; j < tranArray.length; j++) {
			if (
				formatDate(tranArray[j].date) ==
				formatDate(date) 
			) {
				tranVal = tranArray[j].amounnt;
			} else if (
				formatDate(tranArray[j].date) >
				formatDate(date) 
			) {
				if (
					formatDate(tranArray[j].date) <
					formatDate(nextDate) 
				) {
					tranVal = tranArray[j].amounnt;
				}
			}
		}
		console.log("bookValsDepletion[i-1].bvDep");
		console.log(bookValsDepletion[i - 1].bvDep);
		console.log("");
		let depletion =
			bookValsDepletion[i - 1].bvDep *
			(1 - supply[i - 1].supply / supply[i].supply);
		console.log("depletion");
		console.log(depletion);
		console.log("");
		let bookVal =
			bookValsDepletion[i - 1].bvDep +
			basisRewards[i].basisReward -
			depletion +
			tranVal * basisPrice;
		console.log("bookVal");
		console.log(bookVal);
		console.log("");
		let bvDepObj = {
			date: basisRewards[i].date,
			bvDep: bookVal,
		};
		let percentage = basisRewards[i].basisReward / bookVal;
		console.log("Percentage");
		console.log(percentage);
		console.log("");
		rewardDepletionObj = {
			date: basisRewards[i].date,
			rewBasisDepletion:
				basisRewards[i].basisReward - depletion * percentage, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
		};
		bookValsDepletion.push(bvDepObj);
		basisRewardDepletion.push(rewardDepletionObj);
	}
	console.log(basisRewards);
	rewardDepletionObj = {
		date: basisRewards[basisRewards.length - 1].date,
		rewBasisDepletion: basisRewards[basisRewards.length - 1].basisReward, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
	};
	basisRewardDepletion.push(rewardDepletionObj);

	//MARKET VALUE DEPLETION REWARDS OBJECT
	//Dependency Object
	let mvdAnal = [];
	for (let i = 0; i < basisRewards.length; i++) {
		for (let j = 0; j < pricesForUser.length; j++) {
			let date1 = formatDate(basisRewards[i].date);
			let date2 = formatDate(pricesForUser[j].date);
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
	let rewardMVDepletionObj = {
		date: basisRewards[0].date,
		rewBasisMVDepletion: basisRewards[0].basisReward,
	};
	basisRewardMVDepletion.push(rewardMVDepletionObj);
	for (i = 1; i < basisRewards.length - 1; i++) {
		let tranVal = 0;
		date = basisRewards[i].date;
		nextDate = basisRewards[i + 1].date;
		for (j = 0; j < tranArray.length; j++) {
			if (
				formatDate(tranArray[j].date) ==
				formatDate(date) 
			) {
				tranVal = tranArray[j].amounnt;
			} else if (
				formatDate(tranArray[j].date)  >
				formatDate(date) 
			) {
				if (
					formatDate(tranArray[j].date)  <
					formatDate(nextDate) 
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
		rewardMVDepletionObj = {
			date: basisRewards[i].date,
			rewBasisMVDepletion:
				basisRewards[i].basisReward - MVdepletion * percentage,
		};
		bookValsMVDepletion.push(bvMVDepObj);
		basisRewardMVDepletion.push(rewardMVDepletionObj);
	}
	rewardMVDepletionObj = {
		date: basisRewards[basisRewards.length - 1].date,
		rewBasisMVDepletion: basisRewards[basisRewards.length - 1].basisReward,
	};
	basisRewardMVDepletion.push(rewardMVDepletionObj);

	//use book vals mvdepletion object to find correspoiindg bvs with the correct basis bal'
	let totalRewards = 0
	for(i = 0; i < rewards.length; i++){
		totalRewards += rewards[i].rewardQuantity
	}
	



	let xtzBasis = basisBalances[Object.keys(basisBalances)[Object.keys(basisBalances).length - 1]] / 1000000 - totalRewards

	let percentOfRew = totalRewards / xtzBasis


	let basisP = bookValsBasis[bookValsBasis.length - 1].bvBas * (1 - percentOfRew)
	let basisDep = bookValsDepletion[bookValsDepletion.length - 1].bvDep * (1 - percentOfRew)
	let basisMVdep = bookValsMVDepletion[bookValsMVDepletion.length - 1].bvMvDep * (1 - percentOfRew)

	//aggregate
	let unrealizedRewardAgg = 0;
	let unrealizedBasisAgg = 0;
	let unrealizedDepAgg = 0;
	let unrealizedMVDAgg = 0;
	for (i = 0; i < unrealrewards.length; i++) {
		unrealizedRewardAgg += rewards[i].rewardQuantity;
		unrealizedBasisAgg += basisRewards[i].basisReward;
		unrealizedDepAgg += basisRewardDepletion[i].rewBasisDepletion;
		unrealizedMVDAgg += basisRewardMVDepletion[i].rewBasisMVDepletion;
	}


	//RETURN OBJECT
	let analysisResObj = {
		//need basis rewards, mvd rewards, dep rewards
		unrealizedRewards: rewards,
		unrealizedBasisRewards: basisRewards,
		unrealizedBasisRewardsDep: basisRewardDepletion,
		unrealizedBasisRewardsMVDep: basisRewardMVDepletion,
		unrealizedRewardAgg: unrealizedRewardAgg,
		unrealizedBasisAgg: unrealizedBasisAgg,
		unrealizedDepAgg: unrealizedDepAgg,
		unrealizedMVDAgg: unrealizedMVDAgg,
		address: address,
		fiat: fiat,
		basisDate: basisDate,
		basisPrice: basisPrice,
		xtzBasis: xtzBasis,
		basisP: basisP,
		basisDep: basisDep,
		basisMVdep: basisMVdep
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

async function saveRealize(realizing_obj) {
	//api post save with rebuilt object from realize
	let savedObject = {
        realizedBasisRewards : [],
        realizedBasisRewardsDep : [],
        realizedBasisRewardsMVDep : [],
        realxtzBasis:NaN,
        realBasisP:NaN,
        realBasisDep:NaN,
        realBasisMVDep:NaN
    }
    console.log(realizing_obj)
	//iterate over the realizing object and push onto realized, and rm from realizing
	for (i = 0; i < realizing_obj.realizingRewards.length; i++) {
		//savedObject.realizedRewards.push(savedObject.realizingRewards[i])    //raw rewards still not working
		savedObject.realizedBasisRewards.push(
			realizing_obj.realizingBasisRewards[i]
		);
		savedObject.realizedBasisRewardsDep.push(
			realizing_obj.realizingBasisRewardsDep[i]
		);
		savedObject.realizedBasisRewardsMVDep.push(
			realizing_obj.realizingBasisRewardsMVDep[i]
		);
	}

    console.log(realizing_obj)
    console.log(realizing_obj.realizingXTZBasis)
    console.log(realizing_obj.realizingBasisMVdep)

	savedObject.realxtzBasis = realizing_obj.realizingXTZBasis
	savedObject.realBasisP = realizing_obj.realizingBasisP
	savedObject.realBasisDep = realizing_obj.realizingBasisDep
    savedObject.realBasisMVDep = realizing_obj.realizingBasisMVDep

    // clear session in route end point instead
	// savedObject.realizingRewards = [];
	// savedObject.realzingRewardBasis = [];
	// savedObject.realzingRewardBasisDep = [];
	// savedObject.realzingRewardBasisMVDep = [];


	//adjust aggs

	return savedObject;

	//save the realize history object append to previous realize history object in db
}

async function autoAnalysis(address, fiat) {
	//label objects by blocks, delete repeats, remove clutter

	//DATA DEPENDCEIES
	let rewards = await getRewards(address);
	let basisBalances = await getBalances(address);
	let pricesForUser = await getPricesAndMarketCap(fiat);
	let tranArray = await getTransactions(address);
	let basisPrice = await avgBasisPrice(address, fiat);

	//BASIS REWARD OBJECT
	let basisRewards = [];
	for (i = 0; i < rewards.length; i++) {
		let basisRewardObj = {
			date: rewards[i].date,
			basisReward: rewards[i].rewardQuantity * basisPrice,
		};
		basisRewards.push(basisRewardObj);
	}
	//book value for basis rewards is unnessarry, it is calculeted for depletion
	let basisValue = Object.values(basisBalances)[0];

	let bookVal = basisPrice * (basisValue / 1000000);
	let bookValsBasis = []
	let bvBasObj = {
	    "date": rewards[0].date,
	    "bvBas": bookVal
	}
	bookValsBasis.push(bvBasObj)

	for(i = 1; i < rewards.length - 1; i++){
	    bookVal = bookValsBasis[i-1].bvBas + rewards[i].rewardQuantity * basisPrice
	    bvBasObj = {
	        "date": rewards[i].date,
	        "bvBas": bookVal
	    }
	    bookValsBasis.push(bvBasObj)
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

	let basisRewardDepletion = [];

	for (i = 0; i < basisRewards.length; i++) {
		let tranVal = 0;
		let date = basisRewards[i].date;
		if (i == 0) {
			let bvDepObj = {
				date: date,
				bvDep: bookVal,
			};
			bookValsDepletion.push(bvDepObj);
			let rewardDepletionObj = {
				date: date,
				rewBasisDepletion: basisRewards[i].basisReward, // - (depletion * percentage)  //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
			};
			basisRewardDepletion.push(rewardDepletionObj);
		} else if (i > 0 && i < basisRewards.length - 1) {
			let nextDate = basisRewards[i + 1].date;
			// for positive values obtain price at date of tranasaction
			for (j = 0; j < tranArray.length; j++) {
				if (
					formatDate(tranArray[j].date) ==
					formatDate(date) 
				) {
					tranVal = tranArray[j].amounnt;
				} else if (
					formatDate(tranArray[j].date) >
					formatDate(date) 
				) {
					if (
						formatDate(tranArray[j].date)  <
						formatDate(nextDate) 
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
				date: date,
				bvDep: bookVal,
			};
			let percentage = basisRewards[i].basisReward / bookVal;
			let rewardDepletionObj = {
				date: date,
				rewBasisDepletion:
					basisRewards[i].basisReward - depletion * percentage, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
			};
			bookValsDepletion.push(bvDepObj);
			basisRewardDepletion.push(rewardDepletionObj);
		} else {
			//let depletion = bookValsDepletion[i-1].bvDep * (1 - supply[i-1].supply / supply[i].supply)
			let bookVal =
				bookValsDepletion[i - 1].bvDep +
				basisRewards[i].basisReward +
				tranVal * basisPrice; //subtract depletion from this once db updated and supply works
			let bvDepObj = {
				date: date,
				bvDep: bookVal,
			};
			//let percentage = basisRewards[i].basisReward / bookVal
			rewardDepletionObj = {
				date: date,
				rewBasisDepletion: basisRewards[i].basisReward, // - (depletion * percentage)  //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
			};
			bookValsDepletion.push(bvDepObj);
			basisRewardDepletion.push(rewardDepletionObj);
		}
	}

	//MARKET VALUE DEPLETION REWARDS OBJECT
	//Dependency Object
	let mvdAnal = [];
	for (let i = 0; i < basisRewards.length; i++) {
		for (let j = 0; j < pricesForUser.length; j++) {
			let date1 = formatDate(basisRewards[i].date);
			let date2 = formatDate(pricesForUser[j].date)
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

	for (i = 0; i < basisRewards.length; i++) {
		let tranVal = 0;
		date = basisRewards[i].date;
		if (i == 0) {
			let bvDepObj = {
				date: date,
				bvDep: bookVal,
			};
			bookValsDepletion.push(bvDepObj);
			let rewardDepletionObj = {
				date: date,
				rewBasisDepletion: basisRewards[i].basisReward, // - (depletion * percentage)  //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
			};
			basisRewardMVDepletion.push(rewardDepletionObj);
		} else if (i > 0 && i < basisRewards.length - 1) {
			nextDate = basisRewards[i + 1].date;
			for (j = 0; j < tranArray.length; j++) {
				if (
					formatDate(tranArray[j].date) == formatDate(date)
				) {
					tranVal = tranArray[j].amounnt;
				} else if (
					formatDate(tranArray[j].date) >
					formatDate(date) 
				) {
					if (
						formatDate(tranArray[j].date) <
						formatDate(nextDate)
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
		} else {
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
	}

	/*
    if(balances[today] < balances [today -1]){
       let basisQ = balances[today -1]
    }
    */
   //use book vals mvdepletion object to find correspoiindg bvs with the correct basis bal'
	let totalRewards = 0
	for(i = 0; i < rewards.length; i++){
		totalRewards += rewards[i].rewardQuantity
	}
	



	let xtzBasis = basisBalances[Object.keys(basisBalances)[Object.keys(basisBalances).length - 1]] / 1000000 - totalRewards

	let percentOfRew = totalRewards / xtzBasis


	let basisP = bookValsBasis[bookValsBasis.length - 1].bvBas * (1 - percentOfRew)
	let basisDep = bookValsDepletion[bookValsDepletion.length - 1].bvDep * (1 - percentOfRew)
	let basisMVdep = bookValsMVDepletion[bookValsMVDepletion.length - 1].bvMvDep * (1 - percentOfRew)


	//aggregate
	let unrealizedRewardAgg = 0;
	let unrealizedBasisAgg = 0;
	let unrealizedDepAgg = 0;
	let unrealizedMVDAgg = 0;
	for (i = 0; i < rewards.length; i++) {
		unrealizedRewardAgg += rewards[i].rewardQuantity;
		unrealizedBasisAgg += basisRewards[i].basisReward;
		unrealizedDepAgg += basisRewardDepletion[i].rewBasisDepletion;
		unrealizedMVDAgg += basisRewardMVDepletion[i].rewBasisMVDepletion;
	}


	//RETURN OBJECT
	analysisResObj = {
		//need basis rewards, mvd rewards, dep rewards
		//"basisQ": basisQ,
		unrealizedRewards: rewards,
		unrealizedBasisRewards: basisRewards,
		unrealizedBasisRewardsDep: basisRewardDepletion,
		unrealizedBasisRewardsMVDep: basisRewardMVDepletion,
		unrealizedRewardAgg: unrealizedRewardAgg,
		unrealizedBasisAgg: unrealizedBasisAgg,
		unrealizedDepAgg: unrealizedDepAgg,
		unrealizedMVDAgg: unrealizedMVDAgg,
		address: address,
		fiat: fiat,
		basisPrice: basisPrice,
		xtzBasis: xtzBasis,
		basisP: basisP,
		basisDep: basisDep,
		basisMVdep: basisMVdep
	};

	return analysisResObj;
}

async function avgBasisPrice(address, fiat) {
	let transObject = await getTransactions(address);

	let balanceObject = await getBalances(address); //balances are EOD

	let priceObject = await getPricesAndMarketCap(fiat);

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

function formatDate(date) {
	var d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-");
}

// realizeHistoryObjectConstructor().then((value) => {
//     console.log(value)
// })

module.exports = { analysis, realizeRew, saveRealize, autoAnalysis };

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
