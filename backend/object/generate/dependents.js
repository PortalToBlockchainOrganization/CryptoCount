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

//TRUE ADDITIONS
// // // // //POSTIVE TRANSACTIONS OBJECT
// // // // let positiveTrans = [];
// // // // for (i = 0; i < tranArray.length; i++) {
// // // // 	if (tranArray[i].amounnt > 0) {
// // // // 		object = {
// // // // 			date: tranArray[i].date,
// // // // 			amount: tranArray[i].amounnt,
// // // // 		};
// // // // 		positiveTrans.push(object);
// // // // 	}
// // // // }
// // // // //VET SAME DAY ~NULL~ NET POSITIVE TRANSACTIONS - looking for real increases to the basis
// // // // let netPositives = [];
// // // // for (i = 0; i < positiveTrans.length; i++) {
// // // // 	let date = await formatDate(positiveTrans[i].date);
// // // // 	let value = positiveTrans[i].amount;
// // // // 	//balance object
// // // // 	let bal1 = basisBalances[date];
// // // // 	if (bal1 - value < 0) {
// // // // 	} else {
// // // // 		object = {
// // // // 			date: positiveTrans[i].date,
// // // // 			amount: positiveTrans[i].amount,
// // // // 		};
// // // // 		netPositives.push(object);
// // // // 	}
// // // // }
// // // // // rn - if it stayed in longer than a day than its going to be part of the average
// // // // let netPositiveTotal = 0
// // // // let priceByincreaseTotal = 0
// // // // let significantPrices = [];
// // // // for (i = 0; i < netPositives.length; i++) {
// // // // 	let date = await formatDate(netPositives[i].date);
// // // // 	for (j = 0; j < pricesForUser.length; j++) {
// // // // 		let priceDate = await formatDate(pricesForUser[j].date);
// // // // 		if (priceDate == date) {
// // // // 			significantPrices.push(pricesForUser[j].price);
// // // // 		}
// // // // 	}
// // // // 	netPositiveTotal += netPositives[i].amount
// // // // 	priceByincreaseTotal += netPositives[i].amount * significantPrices[i]
// // // // }

//RETURN ARRAY OF BASIS PRICES FOR EACH TRUE ADDITION 

// // // // let basisPrice = priceByincreaseTotal / netPositiveTotal;
// // // // console.log('done w price')




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
