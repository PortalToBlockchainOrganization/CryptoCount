import moment from "moment";
export const getData = (setToRender, set, params, getUnrealizedSet) => {
	// mapping for unrealized and realizing set
	let mapping = {
		unrealizedBasisRewards: "realizingRewardBasis",
		unrealizedBasisRewardsDep: "realizingRewardBasisDep",
		unrealizedBasisRewardsMVDep: "realizingRewardBasisMVDep",
	};

	let realMapping = {
		unrealizedBasisRewards: "realizedBasisRewards",
		unrealizedBasisRewardsDep: "realizedBasisRewardsDep",
		unrealizedBasisRewardsMVDep: "realizedBasisRewardsMVDep",
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
		console.log(set);
		// get subset data to render default is basis rewards
		let incomeToReport;
		setToRender = setToRender ? setToRender : "unrealizedBasisRewards";

		/* reward key for the quantity within the list of objects for 
			each set */
		let rewardKey = null;
		if (setToRender === "unrealizedBasisRewards") {
			rewardKey = "basisReward";
			incomeToReport = "realizingBasisAgg";
		} else if (setToRender === "unrealizedBasisRewardsDep") {
			rewardKey = "rewBasisDepletion";
			incomeToReport = "realizingDepAgg";
		} else {
			rewardKey = "rewBasisMVDepletion";
			incomeToReport = "realizingMVDAgg";
		}
		// initializing data to be returned as currentSet
		let realizingRewards = [];
		let realizedRewards = [];
		// chart js data
		let data = {
			labels: [],
			datasets: [
				{
					label: "Realized Rewards",
					backgroundColor: "rgba(255, 99, 132, 0.9)",
					borderRadius: 3,
					barThickness: 15,
					data: [],
				},
				{
					label: "Realizing Rewards",
					backgroundColor: "rgba(242, 120, 75, 0.9)",
					borderRadius: 3,
					barThickness: 15,
					data: [],
				},
				{
					label: "Unrealized Rewards",
					backgroundColor: "rgba(191, 191, 191, 0.9)",
					borderRadius: 3,
					barThickness: 15,
					data: [],
				},
			],
			hoverOffset: 4,
			address: set["data"]?.address,
			fiat: set["data"]?.fiat,
			basisDate: set["data"]?.basisDate,
			basisPrice: set["data"]?.basisPrice,
			incomeToReport:
				set["data"][incomeToReport] + set["data"]?.realizingBasisAgg,
		};

		let currentRealizingSet = mapping[setToRender];
		let currentRealizedSet = realMapping[setToRender];

		// get all dates, all dates are accounted for in realized and unrealized sets
		if (data.labels.length === 0) {
			set?.data[currentRealizedSet].map(({ date }) => {
				return data.labels.push(
					new moment(date).format("MMM DD, YYYY")
				);
			});

			set?.data[`${setToRender}`].map(({ date }) => {
				return data.labels.push(
					new moment(date).format("MMM DD, YYYY")
				);
			});
		}
		// if realized set, render
		if (set?.data?.realizedRewards) {
			realizedRewards = set.data[currentRealizedSet].map((element) => {
				return data.datasets[0].data.push(element[`${rewardKey}`]);
			});
		}

		if (set?.data?.realizingRewards) {
			// if realized Set skip those dates
			if (realizedRewards.length > 0) {
				realizingRewards = new Array(realizedRewards.length);
				data.datasets[1].data = realizingRewards;
			}
			realizingRewards = set.data[currentRealizingSet].map((element) => {
				return data.datasets[1].data.push(element[`${rewardKey}`]);
			});
		}

		// if realizing rewards is greater than 0 add the length of
		// realizing to unrealized as nulls
		if (set?.data?.realizingRewards?.length > 0) {
			// create empty elements in unrealized set
			//  up to size of realizing set
			data.datasets[2].data = new Array(data.datasets[1].data.length);
		}

		if (set?.data?.realizedRewards.length > 0) {
			data.datasets[2].data = new Array(data.datasets[0].data.length);
		}

		if (
			set?.data?.realizedRewards?.length > 0 &&
			set?.data?.realizingRewards?.length > 0
		) {
			data.datasets[2].data = new Array(data.datasets[1].data.length);
		}
		let d0L = data?.datasets[0]?.data?.length;
		let d1L = data?.datasets[1]?.data?.length;

		set?.data[`${setToRender}`].map((element, index) => {
			if (set?.data?.realizedRewards.length > 0) {
				if (index > d1L - d0L - 1) {
					return data.datasets[2].data.push(element[`${rewardKey}`]);
				}
			} else {
				if (index > data.datasets[1].data.length - 1) {
					return data.datasets[2].data.push(element[`${rewardKey}`]);
				}
			}
			return null;
		});

		data["realizingRatio"] =
			set["data"]["realizingBasisP"] / set["data"]["unrealizedBasisP"];
		return data;
	}
};
