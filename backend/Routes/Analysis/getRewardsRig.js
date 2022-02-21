
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







const MONGOURI =
	"mongodb+srv://admin:lelloliar9876@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
	try {
		await mongoose.connect(MONGOURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			userFindAndModify: false,
		});
		console.log("Database connection successful");
	} catch (e) {
		console.log(`Database connection error ${e}`);
		throw e;
	}
};

  

async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION

	//call cycle doc object
    const cycleDocs = await CycleModel.find().sort({cycleNumber: 1});

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
    let prevObj = rewardFetch[rewardFetch.length - 1];
    prevObj.cycleEnd = cycleDocs[cycleDocs.length -1].cycleNumber;
    //let rewardFetch[lastElement].cycleEnd = cycleDocs[length].cycleNumber;

	console.log("rewards fetch")
	console.log(rewardFetch)
	//call baker history object
	

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
		    i <= rewardFetch[j].cycleEnd;
			i++
		) {
			urlObj = 
				`https://api.baking-bad.org/v2/rewards/${bakerAddress}?cycle=${i}`;
			
			urlSet.push(urlObj);
		}
	}
	console.log("url set")
	console.log(urlSet)
//URL OBJECT USING
	//define the query promise contructor here
	function promiseGet(url) {
		return new Promise((resolve, reject) => {
			try {
				payload = axios.get(url) //, {httpsAgent: new https.Agent({ keepAlive: true }),timeout: 20000});
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
			promiseGet(url)
				.then((urlObj) => {
					try{
						let payoutArray = urlObj.data.payouts;
						let addressProperty = "address";
						let amountProperty = "amount";
						if (payoutArray === undefined) {
							console.log(urlObj);
						}else{
							for (let i = 0; i < payoutArray.length; i++) {
								if (address == payoutArray[i][addressProperty]) {
									let amount = payoutArray[i][amountProperty];
									if (amount < 0.0001 && amount > 0) {
										amount = amount * 10000;
									}
									var rewardObject = {
										quantity: amount,
										cycle: urlObj.data.cycle,
									};
									return rewardObject;
								}
							}
						}
						resolve(payoutArray)
					}catch(e){
						console.log(`Could not get data from url: ${url}`);
						reject(new Error(err));
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

	//get trans
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



	//GET TRANSACTIONS HERE FOR ONE CALL OF REWARD FETCH


	//ADD TRANSACTIONS TO RETURN
	return [ rewardsByDay, objectArray ];
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


// async function getBakerHistory(address) {
// 	//BAKER HISTORY OBJECT CONSTRUCTION
// 	let url = `https://api.tzkt.io/v1/rewards/delegators/${address}?cycle.ge=0`;
// 	const response = await axios.get(url);
// 	let delegatorHistory = [];
// 	let delegatorHistObj = {};
// 	//delegator history object
// 	for (let i = 0; i < response.data.length; i++) {
// 		const element = response.data[i];

// 		delegatorHistObj = {
// 			baker: element.baker.address,
// 			cycle: element.cycle,
// 			balance: element.balance, //in mu tez
// 		};
// 		delegatorHistory.push(delegatorHistObj);
// 	}

// 	//reward fetch object
// 	let rewardFetch = [];
// 	let rewardFetchObj = {};

// 	let i = delegatorHistory.length - 1;
// 	rewardFetchObj = {
// 		baker: delegatorHistory[i].baker,
// 		cycleStart: delegatorHistory[i].cycle,
// 	};
// 	rewardFetch.push(rewardFetchObj);

// 	for (let j = delegatorHistory.length - 2; j > 0; j--) {
// 		const element = delegatorHistory[j];
// 		if (element.baker !== delegatorHistory[j + 1].baker) {
// 			rewardFetchObj = {
// 				baker: element.baker,
// 				cycleStart: element.cycle,
// 			};
// 			rewardFetch.push(rewardFetchObj);
// 			let cycleEnd = delegatorHistory[j + 1].cycle;
// 			let index = rewardFetch.length - 2;
// 			let prevObj = rewardFetch[index];
// 			prevObj.cycleEnd = cycleEnd;
// 		}
// 	}
//     const cycleDocs = await CycleModel.find().sort({cycleNumber: 1});
//     let prevObj = rewardFetch[rewardFetch.length - 1];
//     prevObj.cycleEnd = cycleDocs[cycleDocs.length -1].cycleNumber;
//     //let rewardFetch[lastElement].cycleEnd = cycleDocs[length].cycleNumber;

// 	return rewardFetch;
// }


//level 1
async function getCyclesDays() {
	//CYCLES TO DAYS OBJECT CONSTRUCTION
    const cycleDocs = await CycleModel.find().sort({cycleNumber: 1})
    console.log('cycleDocs', cycleDocs[cycleDocs.length - 1])
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
    console.log(cycles)
	return cycles;
}


InitiateMongoServer();

address = "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH"
//address = "tz1PBLXtgPX2cdFkiFcifzKDDWUyQuXdXjbp"
 //address = "KT1Aou1nSui5HNdNFc8bNYT6AtyRhYwhUKTe"
//var address = "tz1fKe1LmdrU16BVquHuxZKEAQvwckseceSq"
//var address = "tz1fJLvQktqiyHuf4wR23jgbZuKVzAQSMoku"
// var address = "tz1Y7UUgQ8hZ4kddaEdiUJ5o46HKtv3hNkx9"
getRewards(address).then((value) => {
    console.log(value);
    return value
  });
