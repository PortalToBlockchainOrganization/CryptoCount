let StatisticModel = require("../../model/statistic.js");
let CycleModel = require("../../model/cycle");
let axios = require("axios");
const { resolve } = require("bluebird");

const BlockchainModel = require("../../model/blockchain.js");
const RealizeSet = require("../../model/realize.js");

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
	const cycleDocs = await CycleModel.find().sort({cycleNumber: 1});
    	let prevObj = rewardFetch[rewardFetch.length - 1];
    	prevObj.cycleEnd = cycleDocs[cycleDocs.length -1].cycleNumber;
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
					balances[date_key] = response.data[i].balance / 1000000;
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
		// convert year month day to month day year
		var date_arr1 = date.toString().split("-");
		var date_arr2 = [date_arr1[1], date_arr1[2], date_arr1[0]];
		date = date_arr2.join("-");

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

async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION

	//call cycle doc object
   
//call cycle doc object
    const cycleDocs = await CycleModel.find().sort({cycleNumber: 1});

    //BAKER HISTORY OBJECT CONSTRUCTION
    let url = `https://api.tzkt.io/v1/rewards/delegators/${address}?cycle.ge=0&limit=10000`;
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
        for (let i = rewardFetch[j].cycleStart; i <= rewardFetch[j].cycleEnd; i++) {
            urlSet.push(`https://api.baking-bad.org/v2/rewards/${bakerAddress}?cycle=${i}`);
        }
    }

    var j, temporary, chunk = 16;
    var results = []
    console.log(urlSet.length)
    for (i = 0,j = urlSet.length; i < j; i += chunk) {
        temporary = urlSet.slice(i, i + chunk);
        result = await axios.all(temporary.map(url=> axios.get(url)));
        // do whatever
        results.push(...result)
    }

    console.log(results.length);

    var rewards = results.map(urlObj =>{
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
    })

	//finish all promise models push all returned data up to the base level of the method execution

	let rewardsByDay = [];
    let rewardByDayObj = {};
    console.log(rewards);
	for (i = 0; i < rewards.length; i++) {
        if (rewards[i] === undefined){
            continue;
        }
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
	let url2 = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${address}&limit=10000`;
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

//REALIZE ROUTE
//REALIZE ROUTE
async function realizeRew(realizedQuantity, setId) {
	//take realize post api
	// let realizedQuantity = 900
	var qSell = realizedQuantity

	//get the realizehistoryobject from the db
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

	let iter1length = unrealrewards.length;

	//REWARDS BUCKET
	for (i = 0; i < iter1length; i++) {
		//quantity of unrealized rewward
		let currentQuantity = unrealrewards[i].rewardQuantity;
		//CONDITION 1, if the rewards is less than the realizing q
		if (currentQuantity < realizedQuantity) {
			let realizingObj = unrealrewards[i];
			realizingRewardQ.push(realizingObj);
			let realizingObj2 = unrealizedBasisRewards[i];
			realzingRewardBasis.push(realizingObj2);
			let realizingObj3 = unrealizedBasisRewardsDep[i];
			realzingRewardBasisDep.push(realizingObj3);
			let realizingObj4 = unrealizedBasisRewardsMVDep[i];
			realzingRewardBasisMVDep.push(realizingObj4);
			realizedQuantity = realizedQuantity - currentQuantity;
		}
	}

	for (i = 0; i < realizingRewardQ.length; i++) {
		unrealrewards.shift();
		unrealizedBasisRewards.shift();
		unrealizedBasisRewardsDep.shift();
		unrealizedBasisRewardsMVDep.shift();
	}

	let iter2length = unrealrewards.length;

	for (i = 0; i < iter2length; i++) {
		try{
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
	 	} catch(e){
			break
			}
		
		}

	//BASIS BUCKET

	let percentOfBasisRealizing =
		realizedQuantity / foundRealizeHistory.unrealXTZBasis;

	let realizingXTZbasis = realizedQuantity;

	let realizingBasisP =
		foundRealizeHistory.unrealBasisP * percentOfBasisRealizing;

	// throw 'stop execution';
	let realizingBasisDep =
		foundRealizeHistory.unrealBasisDep * percentOfBasisRealizing;
	let realizingBasisMVdep =
		foundRealizeHistory.unrealBasisMVDep * percentOfBasisRealizing;

	let unrealizedXTZBasis =
		foundRealizeHistory.unrealXTZBasis - realizingXTZbasis;
	let unrealizedBasisP = foundRealizeHistory.unrealBasisP - realizingBasisP;
	let unrealizedBasisDep =
		foundRealizeHistory.unrealBasisDep - realizingBasisDep;
	let unrealizedBasisMVdep =
		foundRealizeHistory.unrealBasisMVDep - realizingBasisMVdep;

	//re aggregate
	let unrealizedRewardAgg = 0;
	let unrealizedBasisAgg = 0;
	let unrealizedDepAgg = 0;
	let unrealizedMVDAgg = 0;
	for (i = 0; i < unrealrewards.length; i++) {
		try{
			unrealizedRewardAgg += unrealrewards[i].rewardQuantity;
			unrealizedBasisAgg += unrealizedBasisRewards[i].basisReward;
			unrealizedDepAgg += unrealizedBasisRewardsDep[i].rewBasisDepletion;
			unrealizedMVDAgg += unrealizedBasisRewardsMVDep[i].rewBasisMVDepletion;
		}
	
		catch(e){
			break
		}
	}

	//re aggregate
	let realizingRewardAgg = 0;
	let realizingBasisAgg = 0;
	let realizingDepAgg = 0;
	let realizingMVdAgg = 0;
	for (i = 0; i < realizingRewardQ.length; i++) {
		try{
			realizingRewardAgg += realizingRewardQ[i].rewardQuantity;
			realizingBasisAgg += realzingRewardBasis[i].basisReward;
			realizingDepAgg += realzingRewardBasisDep[i].rewBasisDepletion;
			realizingMVdAgg += realzingRewardBasisMVDep[i].rewBasisMVDepletion;
		}
		catch(e){
			break
		}
	}

	//realize out of bookvalue - rewards = basis
	/*
    unrealizedBasis = foundRealizeHistory[0].unrealizedBasis - quantityRealized - realizedRewardAgg - realizingAgg
    realizingBasisQ = quantityRealized    
    realizingBasisBV = quantityRealized * basisPrice
	basis aggr
    */
   	//dummy objects for js pdf to work on node
	global.window = {document: {createElementNS: () => {return {}} }};
	global.navigator = {};
	global.btoa = () => {};

	const fs = require('fs')
	const {jsPDF} = require('jspdf/dist/jspdf.node.min')

	var doc = new jsPDF()

	var myImage = 'data:image/jpeg;base64,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' 
	doc.setFontSize(18);
	doc.addImage(myImage, 'JPEG', 20, 25, 23, 23, 'PTBO Logo');
	doc.text("PORTAL TO BLOCKCHAIN ORGANIZATION", 50, 35)
	doc.setFontSize(12);
	doc.text("STATEMENT OF TEZOS BLOCK REWARD INCOME", 50, 40)
	doc.setFontSize(10)
	doc.text("CALCULATED BY CRYPTOCOUNT", 25, 60)
	//doc.addImage(tezLogo, 'JPEG', 20, 25, 23, 23, 'Tezos Logo');

	doc.text("Name: Bob Smith", 25, 67)
	doc.text("Delegator Address: " + foundRealizeHistory.address, 25, 74)
	doc.text("FIAT:" + foundRealizeHistory.fiat, 25, 81)
	doc.text("QUANTITY OF REWARDS SOLD: " + qSell, 25, 88)
	doc.text("AVERAGE BASIS COST: " + foundRealizeHistory.basisPrice.toFixed(2), 25, 95)
	doc.text("REWARD INCOME: "+ realizingBasisAgg.toFixed(2), 25, 102)
	//var income = set["data"]["realizingRewardBasisAgg"]
	//doc.text(income, 10, 10)

	//fs.writeFileSync('./output.pdf', doc.output())
	delete global.window;
	delete global.navigator;
	delete global.btoa;


	realizedObj = {
		realizingRewards: realizingRewardQ,
		unrealizedRewards: unrealrewards,
		realizingRewardBasis: realzingRewardBasis,
		unrealizedBasisRewards: unrealizedBasisRewards,
		realizingRewardBasisDep: realzingRewardBasisDep,
		unrealizedBasisRewardsDep: unrealizedBasisRewardsDep,
		realizingRewardBasisMVDep: realzingRewardBasisMVDep,
		unrealizedBasisRewardsMVDep: unrealizedBasisRewardsMVDep,
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
		realizedBasisRewardsMVDep:
			foundRealizeHistory.realizedBasisRewardsMVDep,
		pdfDocument: doc,
		_id: foundRealizeHistory._id,
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
	let pricesForUser = await getPricesAndMarketCap(fiat);
	console.log('done w price and market')
	let basisPrice = 0;
	for (let i = 0; i < pricesForUser.length; i++) {
		const a = formatDate(pricesForUser[i].date);
		const b = formatDate(basisDate);
		if (a == b) {
			basisPrice = pricesForUser[i].price;
		}
	}
	
	//DATA DEPENDCEIES
	//ADD tran
	var values= await getRewards(address);
	var rewards = values[0] 
	var tranArray = values[1] 
	console.log('done w rewards')

	//let {basisBalances, pricesForUser, tranArray, basisPrice} = depencies(address, fiat)
	let basisBalances = await getBalances(address);
	console.log('done w balances')


	//let tranArray = await getTransactions(address);
	// console.log('done w trans'




//SUPPLY DEPLETION REWARDS OBJECT
	//Dependency Object
	let totalSupplys = [];
	let supply = [];
	let mvdAnal = [];

	const supplyDocs = await StatisticModel.find();    
	for (let i = 0; i < supplyDocs.length; i++) {
		const d = supplyDocs[i].dateString;
		totalSupply = supplyDocs[i].totalSupply;
		totalSupplyObj = {
			date: d,
			supply: totalSupply,
		};
		totalSupplys.push(totalSupplyObj);
	}
	for (let i = 0; i < rewards.length; i++) {
		let date = rewards[i].date;
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
//MARKET VALUE DEPLETION REWARDS OBJECT
	//Dependency Object
	for (let i = 0; i < rewards.length; i++) {
		for (let j = 0; j < pricesForUser.length; j++) {
			let date1 = formatDate(rewards[i].date);
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


	let basisValue = Object.values(basisBalances)[0];
	let bookVal = basisPrice * (basisValue / 1000000);


	let bookValsMVDepletion = [];
    let bookValsDepletion = [];
	let bookValsBasis = []

	let bvMvDepObj = {
		"date": rewards[0].date,
		"bvMvDep": bookVal,
	};
	let bvDepObj = {
		"date": rewards[0].date,
		"bvDep": bookVal,
	};
	let bvBasObj = {
	    "date": rewards[0].date,
	    "bvBas": bookVal
	}
	bookValsMVDepletion.push(bvMvDepObj)
	bookValsDepletion.push(bvDepObj);
	bookValsBasis.push(bvBasObj)


	for(i = 1; i < rewards.length - 1; i++){
	    bookVal = bookValsBasis[i-1].bvBas + rewards[i].rewardQuantity * basisPrice
	    bvBasObj = {
	        "date": rewards[i].date,
	        "bvBas": bookVal
	    }
	    bookValsBasis.push(bvBasObj)
	}

    let basisRewardDepletion = [];
    let basisRewards = [];
    let basisRewardMVDepletion = [];
	
	for (i = 0; i < rewards.length; i++) {
		let basisRewardObj = {
			"date": rewards[i].date,
			"basisReward": rewards[i].rewardQuantity * basisPrice,
		};
		basisRewards.push(basisRewardObj);

	}
	//book value for basis rewards is unnessarry, it is calculeted for depletion
	for (i = 0; i < rewards.length && i < mvdAnal.length; i++) {
		if (i > 0 && i < basisRewards.length - 1) {
			let tranVal = 0;
			let date = rewards[i].date;
			let nextDate = basisRewards[i + 1].date;
			// for positive values obtain price at date of tranasaction
			for (j = 0; j < tranArray.length; j++) {
				try{
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
				catch(e){break}
				
			}
			let depletion = bookValsDepletion[i - 1].bvDep * (1 - supply[i - 1].supply / supply[i].supply);
			let bookVal = bookValsDepletion[i - 1].bvDep + basisRewards[i].basisReward - depletion + tranVal * basisPrice;
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

			let MVdepletion = bookValsMVDepletion[i - 1].bvMvDep * (mvdAnal[i].marketCap / mvdAnal[i - 1].marketCap - mvdAnal[i].price / mvdAnal[i - 1].price);
			bookVal = bookValsMVDepletion[i - 1].bvMvDep +	basisRewards[i].basisReward - MVdepletion + tranVal * basisPrice;
			let bvMVDepObj = {
					date: basisRewards[i].date,
					bvMvDep: bookVal,
				};
			percentage = basisRewards[i].basisReward / bookVal;
			let rewardMVDepletionObj = {
					date: basisRewards[i].date,
					rewBasisMVDepletion:
						basisRewards[i].basisReward - MVdepletion * percentage,
				};
			bookValsMVDepletion.push(bvMVDepObj);
			basisRewardMVDepletion.push(rewardMVDepletionObj);
		}

	}

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
	for (i = 0; i < rewards.length && i < basisRewards.length && i < basisRewardDepletion.length && i < basisRewardMVDepletion.length; i++) {
		try{
			unrealizedRewardAgg += rewards[i].rewardQuantity;
			unrealizedBasisAgg += basisRewards[i].basisReward;
			unrealizedDepAgg += basisRewardDepletion[i].rewBasisDepletion;
			unrealizedMVDAgg += basisRewardMVDepletion[i].rewBasisMVDepletion;
		}
		catch(e){break}
		
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

let address = "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH";

//users can only select a absis date that has a balance value
/*
analysis(address, '2021-02-28', 'USD').then((value) => {
    console.log(value)
})
*/

//REALIZE OBJECTS


async function saveRealize(realizing_obj) {
	//api post save with rebuilt object from realize
	let savedObject = {
		realizedBasisRewards: [],
		realizedBasisRewardsDep: [],
		realizedBasisRewardsMVDep: [],
		realxtzBasis: NaN,
		realBasisP: NaN,
		realBasisDep: NaN,
		realBasisMVDep: NaN,
	};
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

	savedObject.realxtzBasis = realizing_obj.realizingXTZBasis;
	savedObject.realBasisP = realizing_obj.realizingBasisP;
	savedObject.realBasisDep = realizing_obj.realizingBasisDep;
	savedObject.realBasisMVDep = realizing_obj.realizingBasisMVDep;

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
	//ADD tran
    var values= await getRewards(address);
    console.log('values', values)
	var rewards = values[0] 
	var tranArray = values[1] 
	console.log('done w rewards')

	//let {basisBalances, pricesForUser, tranArray, basisPrice} = depencies(address, fiat)
	let basisBalances = await getBalances(address);
	console.log('done w balances')

	let pricesForUser = await getPricesAndMarketCap(fiat);
	console.log('done w price and market')
	let prices = {};
	// convert document to dictionary for better find performance (date -> int: price -> number; date -> int: marketCap -> number)
	for (let i = 0; i < pricesForUser.length; i++) {
		const d = formatDate(pricesForUser[i].date)
		prices[d] = pricesForUser[i].price;
	}

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

	//VET SAME DAY ~NULL~ NET POSITIVE TRANSACTIONS - looking for real increases to the basis
	let netPositives = [];
	for (i = 0; i < positiveTrans.length; i++) {
		let date = await formatDate(positiveTrans[i].date);
		//let prevDayUnformatted = await addDays(date, 0) // 2 into this funciton moves date up by 1
		//let prevDay = await formatDate(prevDayUnformatted)
		let value = positiveTrans[i].amount;

		//balance object
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




//SUPPLY DEPLETION REWARDS OBJECT
	//Dependency Object
	let totalSupplys = [];
	let supply = [];
	let mvdAnal = [];

	const supplyDocs = await StatisticModel.find();    
	for (let i = 0; i < supplyDocs.length; i++) {
		const d = supplyDocs[i].dateString;
		totalSupply = supplyDocs[i].totalSupply;
		totalSupplyObj = {
			date: d,
			supply: totalSupply,
		};
		totalSupplys.push(totalSupplyObj);
	}
	for (let i = 0; i < rewards.length; i++) {
		let date = rewards[i].date;
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
//MARKET VALUE DEPLETION REWARDS OBJECT
	//Dependency Object
	for (let i = 0; i < rewards.length; i++) {
		for (let j = 0; j < pricesForUser.length; j++) {
			let date1 = formatDate(rewards[i].date);
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


	let basisValue = Object.values(basisBalances)[0];
	let bookVal = prices[formatDate(Object.values(basisBalances)[0])] * (basisValue);


	let bookValsMVDepletion = [];
    let bookValsDepletion = [];
	let bookValsBasis = []

	let bvMvDepObj = {
		"date": rewards[0].date,
		"bvMvDep": bookVal,
	};
	let bvDepObj = {
		"date": rewards[0].date,
		"bvDep": bookVal,
	};
	let bvBasObj = {
	    "date": rewards[0].date,
	    "bvBas": bookVal
	}
	bookValsMVDepletion.push(bvMvDepObj)
	bookValsDepletion.push(bvDepObj);
	bookValsBasis.push(bvBasObj)


	for(i = 1; i < rewards.length - 1; i++){
	    bookVal = bookValsBasis[i-1].bvBas + rewards[i].rewardQuantity * prices[formatDate(rewards[i].date)]
	    bvBasObj = {
	        "date": rewards[i].date,
	        "bvBas": bookVal
	    }
	    bookValsBasis.push(bvBasObj)
	}

    let basisRewardDepletion = [];
    let basisRewards = [];
    let basisRewardMVDepletion = [];
	
	for (i = 0; i < rewards.length; i++) {
		let basisRewardObj = {
			"date": rewards[i].date,
			"basisReward": rewards[i].rewardQuantity * prices[formatDate(rewards[i].date)],
		};
		basisRewards.push(basisRewardObj);

	}
	//book value for basis rewards is unnessarry, it is calculeted for depletion
	for (i = 0; i < rewards.length && i < mvdAnal.length; i++) {
		if (i > 0 && i < basisRewards.length - 1) {
			let tranVal = 0;
			let date = rewards[i].date;
			let nextDate = basisRewards[i + 1].date;
			// for positive values obtain price at date of tranasaction
			for (j = 0; j < tranArray.length; j++) {
				try{
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
				catch(e){break}
				
			}
			let depletion = bookValsDepletion[i - 1].bvDep * (1 - supply[i - 1].supply / supply[i].supply);
			let bookVal = bookValsDepletion[i - 1].bvDep + basisRewards[i].basisReward - depletion + tranVal * prices[formatDate(rewards[i].date)];
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

			let MVdepletion = bookValsMVDepletion[i - 1].bvMvDep * (mvdAnal[i].marketCap / mvdAnal[i - 1].marketCap - mvdAnal[i].price / mvdAnal[i - 1].price);
			bookVal = bookValsMVDepletion[i - 1].bvMvDep +	basisRewards[i].basisReward - MVdepletion + tranVal * prices[formatDate(rewards[i].date)];
			let bvMVDepObj = {
					date: basisRewards[i].date,
					bvMvDep: bookVal,
				};
			percentage = basisRewards[i].basisReward / bookVal;
			let rewardMVDepletionObj = {
					date: basisRewards[i].date,
					rewBasisMVDepletion:
						basisRewards[i].basisReward - MVdepletion * percentage,
				};
			bookValsMVDepletion.push(bvMVDepObj);
			basisRewardMVDepletion.push(rewardMVDepletionObj);
		}

	}

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
	for (i = 0; i < rewards.length && i < basisRewards.length && i < basisRewardDepletion.length && i < basisRewardMVDepletion.length; i++) {
		try{
			unrealizedRewardAgg += rewards[i].rewardQuantity;
			unrealizedBasisAgg += basisRewards[i].basisReward;
			unrealizedDepAgg += basisRewardDepletion[i].rewBasisDepletion;
			unrealizedMVDAgg += basisRewardMVDepletion[i].rewBasisMVDepletion;
		}
		catch(e){break}
		
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
	let netPositiveTotal = 0
	let priceByincreaseTotal = 0
	let significantPrices = [];
	for (i = 0; i < netPositives.length; i++) {
		let date = await formatDate(netPositives[i].date);
		for (j = 0; j < priceObject.length; j++) {
			let priceDate = await formatDate(priceObject[j].date);
			if (priceDate == date) {
				significantPrices.push(priceObject[j].price);
			}
		}
		netPositiveTotal += netPositives[i].amount
		priceByincreaseTotal += netPositives[i].amount * significantPrices[i]
	}

	let avgBasisPriceVal = priceByincreaseTotal / netPositiveTotal;

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
