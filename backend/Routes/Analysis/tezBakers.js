// let BlockchainModel = require('../models/blockchain');
// let StatisticModel = require('../models/statistic');
// let CycleModel = require('../models/cycle');
let axios = require('axios');
let StatisticModel = require("../../model/statistic.js");
const BlockchainModel = require("../../model/blockchain.js");


async function getRewardsBakers(address) {
    let rewards = [];
        // let flowins = {};
        // let flowouts = {};
    let lastId = 0;
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/accounts/${address}/operations?type=endorsement,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&lastId=${lastId}&limit=1000&sort=0`;
            // let url = `https://api.tzkt.io/v1/accounts/${address}/operations?lastId=${lastId}&limit=1000&sort=0`;
            const response = await axios.get(url);
            lastId = response.data[response.data.length - 1].id;  // update lastId
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                if ('endorsement' === element.type) {
                    rewards.push({
                        type: 'endorsement',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.rewards / 1000000
                    });
                } else if ('baking' === element.type) {
                    rewards.push({
                        type: 'baking',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.reward + element.fees / 1000000
                    });
                } else if ('nonce_revelation' === element.type) {
                    rewards.push({
                        type: 'nonce_revelation',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.bakerRewards / 1000000
                    });
                } else if ('double_baking' === element.type) {
                    let isAccuser = element.accuser.address === address;
                    if (isAccuser) {
                        rewards.push({
                            type: 'double_baking',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: element.accuserRewards / 1000000
                        });
                    } else {
                        rewards.push({
                            type: 'double_baking',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -(element.offenderLostDeposits + element.offenderLostRewards + element.offenderLostFees) / 1000000
                        })
                    }
                } else if ('double_endorsing' === element.type) {
                    let isAccuser = element.accuser.address === address;
                    if (isAccuser) {
                        rewards.push({
                            type: 'double_endorsing',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: element.accuserRewards / 1000000
                        });
                    } else {  // is accused offender
                        rewards.push({
                            type: 'double_endorsing',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -(element.offenderLostDeposits + element.offenderLostRewards + element.offenderLostFees) / 1000000
                        });
                    }
                }
                // else if ('transaction' === element.type) {
                //     let isInTransaction = element.target.address === address;
                //     if ('applied' === element.status) {
                //         if (isInTransaction) {
                //             const d = Math.floor(Date.parse(element.timestamp) / (1000 * 60 * 60 * 24));
                //             if (d in flowins) {
                //                 flowins[d] += element.amount;
                //             } else {
                //                 flowins[d] = element.amount;
                //             }
                //         } else {
                //             const d = Math.floor(Date.parse(element.timestamp) / (1000 * 60 * 60 * 24));
                //             if (d in flowouts) {
                //                 flowouts[d] += element.amount + element.bakerFee + element.storageFee + element.allocationFee;
                //             } else {
                //                 flowouts[d] = element.amount + element.bakerFee + element.storageFee + element.allocationFee;
                //             }
                //         }
                //     }
                //     else if ('failed' === element.status && !isInTransaction) {
                //         rewards.push({
                //             type: 'transaction',
                //             timestamp: new Date(Date.parse(element.timestamp)),
                //             amount: -1 * (element.bakerFee + element.storageFee + element.allocationFee)
                //         })
                //     }
                //     else if ('backtracked' === element.type) {
                //     }
                //     else if ('skipped' === element.type) {
                //     }
                // }
                else if ('origination' === element.type) {
                    rewards.push({
                        type: 'origination',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -(element.bakerFee + element.storageFee + element.allocationFee) / 1000000
                    });
                }
                else if ('delegation' === element.type) {
                    let isSender = element.sender.address === address;
                    if (isSender) {
                        rewards.push({
                            type: 'delegation',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -1 * element.bakerFee / 1000000
                        })
                    }
                }
                else if ('reveal' === element.type) {
                    rewards.push({
                        type: 'reveal',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -1 * element.bakerFee / 1000000
                    })
                }
                else if ('revelation_penalty' === element.type) {
                    rewards.push({
                        type: 'revelation_penalty',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -1 * (element.lostReward + element.lostFees) / 1000000
                    })
                }
            }
            if (response.data.length < 1000) {  // if is the last page
                break;
            }
        } catch (error) {
            throw error;
        }
    }
    // create dictionary (key -> date: value -> sum of rewards on that day)
	let rewardsByDay = []
    let rewardsByDayObj = {};
    for (let i = 0; i < rewards.length; i++) {
        const d = formatDate(rewards[i].timestamp) 
        const amount = rewards[i].amount;
		rewardsByDayObj = {
			date: d,
			rewardQuantity: amount
		};
		rewardsByDay.push(rewardsByDayObj)

		for(j=0;j<rewardsByDay.length - 1; j++){
			if(d === rewardsByDay[j].date){
				rewardsByDay.pop()
				rewardsByDay[j].rewardQuantity += amount;
			}
		}
	
	}



		// if(d === rewardsByDay[j].date){
		// 	rewardsByDayObj[j].rewardQuantity += amount;
		// }
        // // if (!(d in rewardsByDay)) {
        // //     rewardsByDay[d] = 0;
        // // }
        // // rewardsByDay[d] += amount;
		// //if date in rewardsByDay
		// rewardsByDayObj = {
		// 	date: d,
		// 	rewardQuantity: amount
		// };
		// rewardsByDay.push(rewardsByDayObj)
		
	
   

	// for(j=0;j<rewardsByDay.length; j++){
	// 	d = rewardsByDay[j].date
	// 	if(d === rewardsByDay[j].date){
	// 		rewardsByDayObj[j].rewardQuantity += amount;
	// 	}
	// 	else{
	// 		rewardsByDayObj = {
	// 			date: d,
	// 			rewardQuantity: amount
	// 		};
	// 		rewardsByDay.push(rewardsByDayObj)
	// 	}
	// }





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
	}



    return [rewardsByDay, objectArray];
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

//format date into rewards
//what does cycle look like? i can look at a run on diff version for the cycle get rewards obj




// async function getBalances(address) {
//     let balances = {};
//     let offset = 0;
//     while (true) {
//         try {
//             let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
//             const response = await axios.get(url);
//             offset += response.data.length  // update lastId
//             for (let i = 0; i < response.data.length; i++) {
//                 const element = response.data[i];
//                 const d = Math.floor(new Date(Date.parse(element.timestamp)).getTime() / (1000 * 60 * 60 * 24));
//                 balances[d] = element.balance;
//             }
//             if (response.data.length < 10000) {  // if is the last page
//                 break;
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     if (Object.keys(balances).length > 0) {
//         const startD = Math.min(Object.keys(balances).map(Number)[0]);
//         const todayD = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
//         for (let i = startD; i <= todayD; i++) {
//             if (i in balances) {
//             } else {
//                 if (i > startD) {
//                     balances[i] = balances[i - 1];
//                 }
//             }
//         }
//     }
//     return balances;
// }

// async function analysis(socket, address, start, end) {
//     if (address && start && end) {
//         try {
//             const startDate = new Date(Date.parse(start));
//             const startDateD = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24));
//             const endDate = new Date(Date.parse(end));
//             const endDateD = Math.floor(endDate.getTime() / (1000 * 60 * 60 * 24));
//             const days = endDateD - startDateD;

//             let balances = await getBalances(address);
//             if (balances.length === 0) {
//                 socket.emit('analysisResErr', { error: 'The address does not has balance history.' });
//                 return;
//             }
//             let firstBalanceD = Number(Object.keys(balances)[0]);
//             if (startDateD < firstBalanceD) {
//                 socket.emit('analysisResErr', {
//                     error: 'The start date is earilier than the first balance day.',
//                     firstBalanceDay: new Date(firstBalanceD * 1000 * 60 * 60 * 24).toISOString().substring(0, 10)
//                 });
//                 return;
//             }

//             // calculate cash value column
//             // get XTZ prices
//             const priceDocs = await BlockchainModel.find();
//             let prices = {};
//             // convert document to dictionary for better find performance (date -> int: price -> number; date -> int: marketCap -> number)
//             for (let i = 0; i < priceDocs.length; i++) {
//                 const d = Math.floor(priceDocs[i].date.getTime() / (1000 * 60 * 60 * 24));
//                 prices[d] = priceDocs[i].price;
//             }
//             // get rewards for the address
//             let [rewards, flowins, flowouts] = await getRewards(address);
//             // get cash value of rewards in each day
//             let cashMethods = {};
//             for (let i = 0; i <= days; i++) {
//                 const d = startDateD + i;
//                 if (d in prices) {
//                     if (d in rewards) {
//                         cashMethods[d] = prices[d] * rewards[d];
//                     }
//                     else {
//                         cashMethods[d] = prices[d] * 0;  // days which don't have reward
//                     }
//                 }
//             }
//             // calculate 

//             // calculate dep method column
//             const supplyDocs = await StatisticModel.find();
//             let totalSupplys = {};
//             let marketCaps = {};
//             for (let i = 0; i < supplyDocs.length; i++) {
//                 const d = Math.floor(new Date(Date.parse(supplyDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
//                 totalSupplys[d] = supplyDocs[i].totalSupply;
//                 marketCaps[d] = (d in prices) ? totalSupplys[d] * prices[d] : 0;
//             }
//             let depletions = {};
//             let depBookValues = {};
//             for (let i = 0; i <= days; i++) {
//                 const d = startDateD + i;
//                 if (i === 0) {
//                     depletions[d] = 0;
//                     depBookValues[d] = prices[d] * balances[d]; // assume the user gets initial balance at the start date it inputs
//                 }
//                 else {
//                     let flowValue = 0; // it can be positibe; it can be negative too
//                     // let depBookValueChange = 0;

//                     if (d in flowins) {
//                         flowValue += flowins[d];
//                     }
//                     if (d in flowouts) {
//                         flowValue -= flowouts[d];
//                     }
//                     if (flowValue > 0) {
//                         const dayInitBookValue = depBookValues[d - 1] + Math.abs(flowValue) * prices[d - 1];  // assume the flow-in happened in the first second of the day
//                         depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
//                         depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
//                     } else {
//                         const dayInitBookValue = (1 - Math.abs(flowValue) / balances[d - 1]) * depBookValues[d - 1];  // assume the flow-out happened in the first second of the day
//                         depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
//                         depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
//                     }
//                     // depletions[d] = - depBookValues[d - 1] * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
//                     // depBookValues[d] = depBookValues[d - 1] + cashMethods[d] + depletions[d] - depBookValueLoss;
//                 }
//             }
//             let depMethods = {};
//             for (let i = 0; i <= days; i++) {
//                 const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
//                 if (d in depletions && d in cashMethods) {
//                     depMethods[d] = depletions[d] + cashMethods[d];
//                 } else { }
//             }

//             // caluclate MVD method column
//             let MVDils = {};
//             for (let i = 0; i <= days; i++) {
//                 const d = startDateD + i;
//                 if (i === 0) {
//                     MVDils[d] = 0;
//                 }
//                 else {
//                     MVDils[d] = -(marketCaps[d] / marketCaps[d - 1] - prices[d] / prices[d - 1]) * balances[d - 1] * prices[d - 1];
//                 }
//             }
//             let MVDMethods = {};
//             for (let i = 0; i <= days; i++) {
//                 const d = startDateD + i;
//                 if (d in MVDils && d in cashMethods) {
//                     MVDMethods[d] = MVDils[d] + cashMethods[d];
//                 } else { }
//             }

//             // calculate cycles
//             const cycleDocs = await CycleModel.find();
//             let cycles = {};
//             for (let i = 0; i < cycleDocs.length; i++) {
//                 const d = Math.floor(new Date(Date.parse(cycleDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
//                 cycles[d] = cycleDocs[i].cycleNumber;
//             }

//             // assemble array to return
//             let analysisResults = [];
//             for (let i = 0; i < days; i++) {
//                 const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
//                 const d_obj = new Date(d * 1000 * 60 * 60 * 24);
//                 let element = {
//                     date: d_obj.toISOString().substring(0, 10),
//                     cycle: (d in cycles ? cycles[d] : null),
//                     balance: (d in balances ? balances[d] / 1000000 : null),
//                     reward: (d in rewards ? rewards[d] / 1000000 : 0),
//                     cashMethod: (d in cashMethods ? cashMethods[d] / 1000000 : null),
//                     depMethod: (d in depMethods ? depMethods[d] / 1000000 : null),
//                     MVDMethod: (d in MVDMethods ? MVDMethods[d] / 1000000 : null)
//                 }
//                 analysisResults.push(element);
//             }
//             socket.emit('analysisRes', analysisResults);
//         } catch (error) {
//             if (error.repsonse && error.response.data && error.response.data.code && error.response.data.errors) {
//                 socket.emit('analysisResErr', {
//                     error: error.response.data.errors
//                 });
//             }
//             else {
//                 socket.emit('analysisResErr', {
//                     error: 'please check input params'
//                 });
//             }
//         }
//     } else {
//         socket.emit('analysisResErr', {
//             error: 'please check input params'
//         });
//     }
// }

//module.exports = { analysis };

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
				date_itr = new Date(d1)
				preIter = new Date(d1).toISOString();
				d2 = new Date(d2);
				balances[preIter] = response.data[i].balance / 1000000;


			
				// while (date_itr < d2) {
				// 	date_key = preIter
				// 	balances[date_key] = response.data[i].balance / 1000000;
				// 	date_itr = preIter.setDate(preIter.getDate() + 1);
				// }
			}
		}
	}
	return balances;
}

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

async function autoAnalysis(address, fiat, consensusRole) {
	//label objects by blocks, delete repeats, remove clutter

	//DATA DEPENDCEIES
	//ADD tran
	var values = []
	console.log(consensusRole)
	if("Baker" === consensusRole){
		values= await getRewardsBakers(address);
	}
	// else{
	// 	values = await getRewardsDelegators(address)
	// }
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
	console.log("done getting supply stats")
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
	let bookVal = prices[formatDate(Object.keys(basisBalances)[0])] * (basisValue);


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
			let MVdepletion = bookValsMVDepletion[i - 1].bvMvDep * (mvdAnal[i].marketCap / mvdAnal[i - 1].marketCap - mvdAnal[i].price / mvdAnal[i - 1].price);
			bookVal = bookValsMVDepletion[i - 1].bvMvDep +	basisRewards[i].basisReward - MVdepletion + tranVal * prices[formatDate(rewards[i].date)];
			let bvMVDepObj = {
					date: basisRewards[i].date,
					bvMvDep: bookVal,
				};
			//let percentage = basisRewards[i].basisReward /// bookVal;
			
				let rewardDepletionObj = {
						date: date,
						rewBasisDepletion:
							basisRewards[i].basisReward - depletion //* percentage, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
					};
				bookValsDepletion.push(bvDepObj);
				basisRewardDepletion.push(rewardDepletionObj);
			

			
				//percentage = basisRewards[i].basisReward /// bookVal;
				let rewardMVDepletionObj = {
						date: basisRewards[i].date,
						rewBasisMVDepletion:
							basisRewards[i].basisReward - MVdepletion //* percentage,
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
const InitiateMongoServer = require("../../config/db");
//require("../../dotenv").config();


InitiateMongoServer();


address = "tz1PFeoTuFen8jAMRHajBySNyCwLmY5RqF9M"
fiat = "USD"
consensusRole = "Baker"

autoAnalysis(address, fiat, consensusRole).then((value) => {
    console.log(value);
    return value
  });

// getBalances(address).then((value) => {
// 	console.log(value) 
// 	return value
// })
