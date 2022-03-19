let BlockchainModel = require('../models/blockchain');
let StatisticModel = require('../models/statistic');
let CycleModel = require('../models/cycle');
let axios = require('axios');


async function getBakerRewards(address) {
    let rewards = [];
    let flowins = {};
    let flowouts = {};
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
                        amount: element.rewards
                    });
                } else if ('baking' === element.type) {
                    rewards.push({
                        type: 'baking',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.reward + element.fees
                    });
                } else if ('nonce_revelation' === element.type) {
                    rewards.push({
                        type: 'nonce_revelation',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.bakerRewards
                    });
                } else if ('double_baking' === element.type) {
                    let isAccuser = element.accuser.address === address;
                    if (isAccuser) {
                        rewards.push({
                            type: 'double_baking',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: element.accuserRewards
                        });
                    } else {
                        rewards.push({
                            type: 'double_baking',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -(element.offenderLostDeposits + element.offenderLostRewards + element.offenderLostFees)
                        })
                    }
                } else if ('double_endorsing' === element.type) {
                    let isAccuser = element.accuser.address === address;
                    if (isAccuser) {
                        rewards.push({
                            type: 'double_endorsing',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: element.accuserRewards
                        });
                    } else {  // is accused offender
                        rewards.push({
                            type: 'double_endorsing',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -(element.offenderLostDeposits + element.offenderLostRewards + element.offenderLostFees)
                        });
                    }
                }
                else if ('transaction' === element.type) {
                    let isInTransaction = element.target.address === address;
                    if ('applied' === element.status) {
                        if (isInTransaction) {
                            const d = Math.floor(Date.parse(element.timestamp) / (1000 * 60 * 60 * 24));
                            if (d in flowins) {
                                flowins[d] += element.amount;
                            } else {
                                flowins[d] = element.amount;
                            }
                        } else {
                            const d = Math.floor(Date.parse(element.timestamp) / (1000 * 60 * 60 * 24));
                            if (d in flowouts) {
                                flowouts[d] += element.amount + element.bakerFee + element.storageFee + element.allocationFee;
                            } else {
                                flowouts[d] = element.amount + element.bakerFee + element.storageFee + element.allocationFee;
                            }
                        }
                    }
                    else if ('failed' === element.status && !isInTransaction) {
                        rewards.push({
                            type: 'transaction',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -1 * (element.bakerFee + element.storageFee + element.allocationFee)
                        })
                    }
                    else if ('backtracked' === element.type) {
                    }
                    else if ('skipped' === element.type) {
                    }
                }
                else if ('origination' === element.type) {
                    rewards.push({
                        type: 'origination',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -(element.bakerFee + element.storageFee + element.allocationFee)
                    });
                }
                else if ('delegation' === element.type) {
                    let isSender = element.sender.address === address;
                    if (isSender) {
                        rewards.push({
                            type: 'delegation',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -1 * element.bakerFee
                        })
                    }
                }
                else if ('reveal' === element.type) {
                    rewards.push({
                        type: 'reveal',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -1 * element.bakerFee
                    })
                }
                else if ('revelation_penalty' === element.type) {
                    rewards.push({
                        type: 'revelation_penalty',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -1 * (element.lostReward + element.lostFees)
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
    let rewardsByDay = {};
    for (let i = 0; i < rewards.length; i++) {
        const d = Math.floor(rewards[i].timestamp / (1000 * 60 * 60 * 24));  // number of days since January 1, 1970, 00:00:00 UTC
        const amount = rewards[i].amount;
        if (!(d in rewardsByDay)) {
            rewardsByDay[d] = 0;
        }
        rewardsByDay[d] += amount;
    }
    return [rewardsByDay, flowins, flowouts];
}


async function getBalances(address) {
    let balances = {};
    let offset = 0;
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            offset += response.data.length  // update lastId
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const d = Math.floor(new Date(Date.parse(element.timestamp)).getTime() / (1000 * 60 * 60 * 24));
                balances[d] = element.balance;
            }
            if (response.data.length < 10000) {  // if is the last page
                break;
            }
        } catch (error) {
            console.error(error);
        }
    }
    if (Object.keys(balances).length > 0) {
        const startD = Math.min(Object.keys(balances).map(Number)[0]);
        const todayD = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
        for (let i = startD; i <= todayD; i++) {
            if (i in balances) {
            } else {
                if (i > startD) {
                    balances[i] = balances[i - 1];
                }
            }
        }
    }
    return balances;
}

async function analysis(socket, address, start, end) {
    if (address && start && end) {
        try {
            const startDate = new Date(Date.parse(start));
            const startDateD = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24));
            const endDate = new Date(Date.parse(end));
            const endDateD = Math.floor(endDate.getTime() / (1000 * 60 * 60 * 24));
            const days = endDateD - startDateD;

            let balances = await getBalances(address);
            if (balances.length === 0) {
                socket.emit('analysisResErr', { error: 'The address does not has balance history.' });
                return;
            }
            let firstBalanceD = Number(Object.keys(balances)[0]);
            if (startDateD < firstBalanceD) {
                socket.emit('analysisResErr', {
                    error: 'The start date is earilier than the first balance day.',
                    firstBalanceDay: new Date(firstBalanceD * 1000 * 60 * 60 * 24).toISOString().substring(0, 10)
                });
                return;
            }

            // calculate cash value column
            // get XTZ prices
            const priceDocs = await BlockchainModel.find();
            let prices = {};
            // convert document to dictionary for better find performance (date -> int: price -> number; date -> int: marketCap -> number)
            for (let i = 0; i < priceDocs.length; i++) {
                const d = Math.floor(priceDocs[i].date.getTime() / (1000 * 60 * 60 * 24));
                prices[d] = priceDocs[i].price;
            }
            // get rewards for the address
            let [rewards, flowins, flowouts] = await getRewards(address);
            // get cash value of rewards in each day
            let cashMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (d in prices) {
                    if (d in rewards) {
                        cashMethods[d] = prices[d] * rewards[d];
                    }
                    else {
                        cashMethods[d] = prices[d] * 0;  // days which don't have reward
                    }
                }
            }
            // calculate 

            // calculate dep method column
            const supplyDocs = await StatisticModel.find();
            let totalSupplys = {};
            let marketCaps = {};
            for (let i = 0; i < supplyDocs.length; i++) {
                const d = Math.floor(new Date(Date.parse(supplyDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
                totalSupplys[d] = supplyDocs[i].totalSupply;
                marketCaps[d] = (d in prices) ? totalSupplys[d] * prices[d] : 0;
            }
            let depletions = {};
            let depBookValues = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (i === 0) {
                    depletions[d] = 0;
                    depBookValues[d] = prices[d] * balances[d]; // assume the user gets initial balance at the start date it inputs
                }
                else {
                    let flowValue = 0; // it can be positibe; it can be negative too
                    // let depBookValueChange = 0;

                    if (d in flowins) {
                        flowValue += flowins[d];
                    }
                    if (d in flowouts) {
                        flowValue -= flowouts[d];
                    }
                    if (flowValue > 0) {
                        const dayInitBookValue = depBookValues[d - 1] + Math.abs(flowValue) * prices[d - 1];  // assume the flow-in happened in the first second of the day
                        depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                        depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
                    } else {
                        const dayInitBookValue = (1 - Math.abs(flowValue) / balances[d - 1]) * depBookValues[d - 1];  // assume the flow-out happened in the first second of the day
                        depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                        depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
                    }
                    // depletions[d] = - depBookValues[d - 1] * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                    // depBookValues[d] = depBookValues[d - 1] + cashMethods[d] + depletions[d] - depBookValueLoss;
                }
            }
            let depMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
                if (d in depletions && d in cashMethods) {
                    depMethods[d] = depletions[d] + cashMethods[d];
                } else { }
            }

            // caluclate MVD method column
            let MVDils = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (i === 0) {
                    MVDils[d] = 0;
                }
                else {
                    MVDils[d] = -(marketCaps[d] / marketCaps[d - 1] - prices[d] / prices[d - 1]) * balances[d - 1] * prices[d - 1];
                }
            }
            let MVDMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (d in MVDils && d in cashMethods) {
                    MVDMethods[d] = MVDils[d] + cashMethods[d];
                } else { }
            }

            // calculate cycles
            const cycleDocs = await CycleModel.find();
            let cycles = {};
            for (let i = 0; i < cycleDocs.length; i++) {
                const d = Math.floor(new Date(Date.parse(cycleDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
                cycles[d] = cycleDocs[i].cycleNumber;
            }

            // assemble array to return
            let analysisResults = [];
            for (let i = 0; i < days; i++) {
                const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
                const d_obj = new Date(d * 1000 * 60 * 60 * 24);
                let element = {
                    date: d_obj.toISOString().substring(0, 10),
                    cycle: (d in cycles ? cycles[d] : null),
                    balance: (d in balances ? balances[d] / 1000000 : null),
                    reward: (d in rewards ? rewards[d] / 1000000 : 0),
                    cashMethod: (d in cashMethods ? cashMethods[d] / 1000000 : null),
                    depMethod: (d in depMethods ? depMethods[d] / 1000000 : null),
                    MVDMethod: (d in MVDMethods ? MVDMethods[d] / 1000000 : null)
                }
                analysisResults.push(element);
            }
            socket.emit('analysisRes', analysisResults);
        } catch (error) {
            if (error.repsonse && error.response.data && error.response.data.code && error.response.data.errors) {
                socket.emit('analysisResErr', {
                    error: error.response.data.errors
                });
            }
            else {
                socket.emit('analysisResErr', {
                    error: 'please check input params'
                });
            }
        }
    } else {
        socket.emit('analysisResErr', {
            error: 'please check input params'
        });
    }
}

module.exports = { analysis };






















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




//level 2
async function getRewards(address) {
	//URL SET OBJECT CONSTRUCTION

	//call cycle doc object
    const cycleDocs = await CycleModel.find().sort({cycleNumber: 1});

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
			i <= cycleEnd || i < rewardFetch[j].cycleEnd;
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