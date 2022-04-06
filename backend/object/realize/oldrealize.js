//REALIZE ROUTE
async function realizeRew(realizedQuantity, setId) {
	//take realize post api
	// let realizedQuantity = 900
	// date 1
	//date 2

	//Put this in the realize iteration below
	for unrealized rewards
		if date1 >= unrealized.date && unrealized.date <= date2	




// list of basis price by date: 
//for every true addition of staking basis
//calculate basis price
//push to basis price list with date caculated

========================
bp1 bp2 bp3 bp4 

-----

For all of the basis price date domains the realization touches


use the basis price of the date value at the highest date value of the realization domain

run an analysis for every basis price? 

x history objects for one history object 

main history object ~ current basis price

each history object ~ basis price, calc at date

iterate through main hisotry object

realization quantity, date domain 

quantity, basis price history objects, dates 

   (-----) ~ realizng  	// date 1
  						 //date 2
[~~~~~~~~~~~~] ~ unrealized

[~{bp1}~{bp2}~{bpf}] 

bpn ele of bpf

//get the date of the last real
date 2 

list of calc at dates

for history.calcAt dates
if date2 > history[i-1].calcAt && date2 <= history[i].calcAt
return history[i]



for unrealizrd of bpN
if date1 >= unrealized[i].date && unrealized[i].date <= date2	
push to realziing


realization of bpn

attach to bpf


iter thru bpf
bpNdate = 
for unrealized rewards
if date1 >= unrealized.date && unrealized.date <= date2	
bpNdate = unrealized[i].date

//get the history 
for bpNs
if date2 > bpNDate &&


push to realize

get the basis price for the most recent true addition in the unrealization domain in the realizing domain






// captial gain of input 
//store previous MHOH
//after u selection (can start w the pos or the negs)
//positive tran value value: x, date: y, realizeID: z
//positive tran value 2 bucket half full value: x, date: y, realizeID: z
//remaining positive tran value back into tran values
//negative tran value: x, date:y, realizeId: z
//or plannedNegativeTranValue: x, date:y, realizeID: z
//upon return after commiting negative transaction -> replace the planned negative tran value with the actual negative tran value near it in q
//calculate the basis cost for the postive trans[i] * price[posTran[i].date]
//calculate the sale value negative tran[i] * price[negTran[i].date]
//differenece is capital gain 



//new merged history object created







	var qSell = realizedQuantity

	//get the realizehistoryobject from the db
	let foundRealizeHistory = await RealizeSet.findOne({ _id: setId });


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

	//BASIS BUCKET\
	//RECALCULATE REMOVE THE QUANTITY OF REWARDS FROM THE BASIS(S)
	//SUBTRACT FROM THE XTZ ONE
	//SUBTRACT REWARD BASIS AGGS FROM THE OTHER SETS

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



	//re aggrega

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