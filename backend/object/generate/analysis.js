//analysis here


//passes in
mvdAnal
totalSupplys
rewards
tranArray
basisBalances
pricesForUser //needs to be prices by day dict





let basisValue = Object.values(basisBalances)[0];
let bookVal = basisPrice * (basisValue / 1000000);


let bookValsMVDepletion = [];
let bookValsDepletion = [];
let bookValsBasis = []
let bookValFMV = []

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
let fmvBVobj = {
    "date": rewards[0].date,
    "bvFMV": bookVal
}
bookValsMVDepletion.push(bvMvDepObj)
bookValsDepletion.push(bvDepObj);
bookValsBasis.push(bvBasObj)
bookValFMV.push(fmvBVobj)

for(i = 1; i < rewards.length - 1; i++){
    bookVal = bookValsBasis[i-1].bvBas + rewards[i].rewardQuantity * basisPrice // 
    bvBasObj = {
        "date": rewards[i].date,
        "bvBas": bookVal
    }
    bookValsBasis.push(bvBasObj)
}

let FMVReward = []
let FMVRewardDepletion = [];
let basisRewardsAll = [];
let FMVRewardMVDepletion = [];

for j basisPrices{
	let basisRewards = []
	for (i = 0; i < rewards.length; i++) {
		let basisRewardObj = {
			"date": rewards[i].date,
			"basisReward": rewards[i].rewardQuantity * basisPrice,
		};
		basisRewards.push(basisRewardObj);
	}
	basisRewardsAll.push(basisRewards)
}

for (i = 0; i < rewards.length; i++) {
    let FMVRewardObj = {
        "date": rewards[i].date,
        "FMVReward": rewards[i].rewardQuantity * price[rewards[i].date],
    };
    FMVReward.push(FMVRewardObj);
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
        let bookVal = bookValsDepletion[i - 1].bvDep + FMVReward[i].FMVReward - depletion + tranVal * price[d]; // r//change to price on that date - more accurate book val
        let bvDepObj = {
                date: date,
                bvDep: bookVal,
            };
        let percentage = FMVReward[i].FMVReward / bookVal;  // percentage of bv that is rewards
        let rewardDepletionObj = {
                date: date,
                rewFMVDepletion:
                FMVReward[i].FMVReward - depletion * percentage, //CHANGE THIS ADD DEPLETION AT THE RATIO OF THIS REWARD TO ACCOUNT BALANCE
            };
        bookValsDepletion.push(bvDepObj);
        FMVRewardDepletion.push(rewardDepletionObj);

        let MVdepletion = bookValsMVDepletion[i - 1].bvMvDep * (mvdAnal[i].marketCap / mvdAnal[i - 1].marketCap - mvdAnal[i].price / mvdAnal[i - 1].price);
        bookVal = bookValsMVDepletion[i - 1].bvMvDep +	FMVReward[i].FMVReward - MVdepletion + tranVal * price[basisRewards[i].date];
        let bvMVDepObj = {
                date: basisRewards[i].date,
                bvMvDep: bookVal,
            };
        percentage = FMVReward[i].FMVReward / bookVal;
        let rewardMVDepletionObj = {
                date: basisRewards[i].date,
                rewFMVMVDepletion:
                FMVReward[i].FMVReward - MVdepletion * percentage,
            };
        bookValsMVDepletion.push(bvMVDepObj);
        FMVRewardMVDepletion.push(rewardMVDepletionObj);
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
let unrealizedFMVAgg = 0
let unrealizedDepAgg = 0;
let unrealizedMVDAgg = 0;
for (i = 0; i < rewards.length && i < basisRewards.length && i < basisRewardDepletion.length && i < basisRewardMVDepletion.length; i++) {
    try{
        unrealizedRewardAgg += rewards[i].rewardQuantity;
        unrealizedBasisAgg += basisRewards[i].basisReward;
        unrealizedDepAgg += FMVRewardDepletion[i].rewBasisDepletion;
        unrealizedMVDAgg += FMVRewardMVDepletion[i].rewBasisMVDepletion;
        unrealizedFMVAgg += FMVReward[i].FMVReward
    }
    catch(e){break}
    
}



//RETURN OBJECT
analysisResObj = {
    unrealizedRewards: rewards,
    unrealizedBasisRewards: basisRewards,
    unrealizedFMVRewardsDep: FMVRewardDepletion,
    unrealizedFMVRewardsMVDep: FMVRewardMVDepletion,
    unrealizedFMVReward: FMVReward,
    unrealizedRewardAgg: unrealizedRewardAgg,
    unrealizedBasisAgg: unrealizedBasisAgg,
    unrealizedDepAgg: unrealizedDepAgg,
    unrealizedMVDAgg: unrealizedMVDAgg,
    unrealizedFMVAgg: unrealizedFMVAgg,
    address: address,
    fiat: fiat,
    balances: balances,
    prices: prices,
    positiveTranArray: positiveTranArray,
    negativeTranArray: negativeTranArray,
    basisPrice: basisPrice,
    //modern holdings here adjust above
    xtzBasis: xtzBasis,
    basisP: basisP,
    basisDep: basisDep,
    basisMVdep: basisMVdep,
    assets: assets
};

return analysisResObj;
}

unrealized set after generate:
[{rewardBasisVal: y, cycle: x, date: z}],
[{rewFMV: y, cycle: x, date: z}],
[{rewFMVdep: y, cycle: x, date: z}],
[{rewFMVmvDep: y, cycle: x, date: z}],
[{rewardQ: y, cycle: x, date: z}],

balance
[{balanceQ: y, date: x}],

positive tran and negative tran
[{+tranQ: y, date: x}],
[{-tranQ: y, date:x}],

price per date
[{date:x, price: y}],

include rewards
{useProtocolRewards: true},
{useDefiRewards: true},