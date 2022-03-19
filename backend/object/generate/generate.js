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
		let value = positiveTrans[i].amount;
		//balance object
		let bal1 = basisBalances[date];
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

	//y do we do the procssing on this
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
			let depletion = bookValsDepletion[i - 1].bvDep * (1 - supply[i - 1].supply / supply[i].supply);   // depletion is of accounts whole value, the reward is proportion of the accounts whole value so the depletion applicable to it as a sub asset is a propotion of the whole depletion 
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
	let xtzBasis = basisBalances[Object.keys(basisBalances)[Object.keys(basisBalances).length - 1]] / 1000000 
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
