

import moment from "moment";
import { isWhiteSpaceLike } from "typescript";
export const getData = (setToRender, set, params, getUnrealizedSet) => {
	//set to render is unrealizedNativeFMVRewards or others

	console.log("setDatabeforegetting it in char")
	console.log(set)

	//add a dataset[i].label for basis cost 
	//add dataset[i].data[i] for basis cost

	// mapping for unrealized and realizing set
	let mapping = {
		unrealizedNativeFMVRewards: "realizingNativeFMVRewards",
		unrealizedNativeSupplyDepletionRewards: "realizingNativeSupplyDepletionRewards",
		unrealizedNativeMarketDilutionRewards: "realizingNativeMarketDilutionRewards",
	};
	
	let realMapping = {
		unrealizedNativeFMVRewards: "realizedNativeFMVRewards",
		unrealizedNativeSupplyDepletionRewards: "realizedNativeSupplyDepletionRewards",
		unrealizedNativeMarketDilutionRewards: "realizedNativeMarketDilutionRewards",
	};

	// if there is no current data and if the id is not a duplicate
	let tempParams = params;

	// if there is no set data and it's not loading get unrealized set
	if (set?._id !== undefined && set["isLoading"] === undefined) {
		tempParams["histObjId"] = set["_id"];
		getUnrealizedSet(tempParams);
	}

	// if the current set is not loading
	if (set !== null && set.data !== undefined && set.isLoading !== undefined) {
		//console.log(set);
		// get subset data to render default is basis rewards
		let incomeToReport;
		setToRender = setToRender ? setToRender : "unrealizedNativeFMVRewards";  //default set
		// console.log(set?.data[`${setToRender}`])

		/* reward key for the quantity within the list of objects for 
			each set */
			
		let rewardKey = null;
		if (setToRender === "unrealizedNativeFMVRewards") {
			rewardKey = "rewardAmount";
			incomeToReport = "realizingNativeFMVRewards100p";
		} else if (setToRender === "unrealizedNativeSupplyDepletionRewards") {
			rewardKey = "rewardAmount";
			incomeToReport = "realizingNativeSupplyDepletionRewards100p";
		} else {
			rewardKey = "rewardAmount";
			incomeToReport = "realizingNativeMarketValueDilutionRewards100p";
		}
		// initializing data to be returned as currentSet
		let realizingRewards = [];
		let realizedRewards = [];
		// chart js data
		let data = {
			labels: [],
			datasets: [
				{
					label: "Unrealized Rewards",
					backgroundColor: "rgba(255, 99, 132, 0.9)",
					borderRadius: .5,
					barThickness: 3,
					data: [],
					color: "white",
				},
				{
					label: "Realizing Rewards",
					opactity: 1.5,
					backgroundColor: "rgba(242, 120, 75, 0.9)",
					borderRadius: .5,
					barThickness: 3,
					data: [],
					
				},
				{
					label: "Realized Rewards",
					backgroundColor: "rgba(191, 191, 191, 0.9)",
					borderRadius: .5,
					barThickness: 3,
					data: [],
				},
				
			
				// {
				// 	label: "Basis Cost",
				// 	borderRadius: 3,
				// 	backgroundColor: "rgba(100, 120, 75, 0.9)",
				// 	barThickness: 7,
				// 	data: [],
				// },
			],
			hoverOffset: 0,
			address: set["data"]?.address,
			fiat: set["data"]?.fiat,
			basisDate: set["data"]?.basisDate,
			basisPrice: set["data"]?.basisPrice,
			incomeToReport:
				set["data"][incomeToReport] //+ set["data"]?.realizingBasisAgg,
		};

		let currentRealizingSet = mapping[setToRender];
		let currentRealizedSet = realMapping[setToRender];
		console.log('currRealize et')
		console.log(currentRealizedSet) 
		// get all dates, all dates are accounted for in realized and unrealized sets
		//useing the map becuase of 3 sets
		//populate data.labels of chart
		// console.log(data.labels.length)
		if (data.labels.length === 0) {
			//this one gets the realized data
			// console.log(setToRender)
			// console.log(currentRealizedSet)
			// console.log(set?.data[currentRealizedSet])

			set?.data[currentRealizedSet].map(({ date }) => {
				return data.labels.push(
					new moment(date).format("MMM DD, YYYY")
				);
			});
		//set to render determines which set to render, this one gets the unrealized data, bc top def of set to render
			set?.data[`${setToRender}`].map(({ date }) => {
				return data.labels.push(
					new moment(date).format("MMM DD, YYYY")
				);
			});
		}
		//data sets 
		// if realized set, render
		//the key for whatever set being displayed, and the current realized set also like that
		// console.log(set?.data?.realizedNativeRewards)
		//reward key is always rewardAmount
		//unrealizedNativeMarketDilutionRewards
		if (set?.data?.realizedNativeRewards) {
			// console.log(set?.data[currentRealizedSet])
			realizedRewards = set.data[currentRealizedSet].map((element) => {
				return data.datasets[0].data.push(element[`${rewardKey}`], );
			});
		}

		// var basisCostData = [];
		// set.data[currentRealizedSet].map((element) => {
		// 	return basisCostData.push(element["basisCost"])
		// })


		// console.log(data.labels.length)
		// console.log(set?.data?.unrealizedNativeRewards)
		// console.log(set?.data?.realizingNativeRewards)
		//new color here new data entry render thang
		if (set?.data?.realizingNativeRewards) {
			// if realized Set skip those dates, gets deep over the realized rewards in its iteration when building the chart
			if (realizedRewards.length > 0) {
				realizingRewards = new Array(realizedRewards.length); // got past realized rewards
				data.datasets[1].data = realizingRewards;
			}
			//the entry is empty array of length that pass it over the realized rewards and appends to the large empy values of the data set
			realizingRewards = set.data[currentRealizingSet].map((element) => {
				return data.datasets[1].data.push(element[`${rewardKey}`]); //populating with realizing
			});
		}
		//console.log(data.labels.length)


		// if realizing rewards is greater than 0 add the length of
		// realizing to unrealized as nulls
		if (set?.data?.realizingNativeRewards?.length > 0) {
			// create empty elements in unrealized set
			//  up to size of realizing set
			data.datasets[2].data = new Array(data.datasets[1].data.length);
		}

		if (set?.data?.realizedNativeRewards.length > 0) {
			data.datasets[2].data = new Array(data.datasets[0].data.length);
		}
		//this is all the live rendering logic

		if (
			set?.data?.realizedNativeRewards?.length > 0 &&
			set?.data?.realizingNativeRewards?.length > 0
		) {
			data.datasets[2].data = new Array(data.datasets[1].data.length);
		}
		let d0L = data?.datasets[0]?.data?.length;
		let d1L = data?.datasets[1]?.data?.length;

		set?.data[`${setToRender}`].map((element, index) => {
			if (set?.data?.realizedNativeRewards.length > 0) {
				if (index > d1L - d0L - 1) {
					return data.datasets[2].data.push(element[`${rewardKey}`]); //render the realized rewards
				}
			} else {
				if (index > data.datasets[1].data.length - 1) {
					return data.datasets[2].data.push(element[`${rewardKey}`]); //no realized data
				}
			}
			return null;
		});

		//console.log(set?.data[`${setToRender}`])

		data["realizingRatio"] =
			set["data"]["realizingBasisP"] / set["data"]["unrealizedBasisP"];

		//console.log("dataChart")
		// if(data.datasets[1].data[1]){
		// 	console.log('no')
		// }
		// data.datasets.forEach((data)=>{
		// 	data.data.map((element)=>{
		// 		console.log(element)
		// 		if(element < .00001)
		// 		{return "N/A"}
					
		// 	})
		// })
		console.log(data.datasets)
		// data.datasets.data.map((data)=>{
		// 	if(data === 0 )
		console.log('chartdaat')
			console.log(data)
		// 	return data
		// })
		return data;
	}
};
