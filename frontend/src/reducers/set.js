function set(state = {}, action) {
	switch (action.type) {
		case "CREATE_SETID":
			let temp = state;
			state["_id"] = action.payload["setId"];
			return temp;
		case "CREATE_SET_STARTED":
			return {
				...state,
				isLoading: true,
			};
		case "CREATE_SET_SUCCEEDED":
			return { isLoading: false, data: action.payload };
		case "CREATE_REALIZED_SET_STARTED":
			let tempState = { ...state };
			tempState["isLoading"] = true;
			return tempState;
		case "ADD_REALIZING_SET":
			// TYPO IN RESPONSE PLS FIX
			let tempSet = state;
			tempSet["data"]["realizingNativeRewards"] =
				action.payload["realizingNativeRewards"];
			tempSet["data"]["realizingNativeFMVRewards"] =
				action.payload["realizingNativeFMVRewards"];
			tempSet["data"]["realizingNativeSupplyDepletionRewards"] =
				action.payload["realizingNativeSupplyDepletionRewards"];
			tempSet["data"]["realizingNativeMarketDilutionRewards"] =
				action.payload["realizingNativeMarketDilutionRewards"];
			tempSet["data"]["aggregateRealizedNativeReward100p"] =
				action.payload["aggregateRealizedNativeReward100p"];
			tempSet["data"]["aggregateRealizedNativeFMVReward100p"] =
				action.payload["aggregateRealizedNativeFMVReward100p"];
			tempSet["data"]["aggregateRealizedNativeSupplyDepletion100p"] =
				action.payload["aggregateRealizedNativeSupplyDepletion100p"];
			tempSet["data"]["aggregateRealizedNativeMarketDilution100p"] =
				action.payload["aggregateRealizedNativeMarketDilution100p"];
			tempSet["data"]["pointOfSaleAggValue"] =
				action.payload["pointOfSaleAggValue"];
			tempSet["data"]["TezosPriceOnDateObjectGenerated"] =
				action.payload["TezosPriceOnDateObjectGenerated"];
				tempSet["data"]["fiat"] =
				action.payload["publicfiat"];
			tempSet["data"]["netDiffFMV"] =
				action.payload["netDiffFMV"];
			tempSet["data"]["netDiffDilution"] =
				action.payload["netDiffDilution"];
			tempSet["data"]["netDiffSupplyDepletion"] =
				action.payload["netDiffSupplyDepletion"];
            tempSet["isLoading"] = false;
            tempSet["email"] = action.payload["email"]
            tempSet["firstName"] = action.payload["firstName"]
            tempSet["lastName"] = action.payload["lastName"]
			return tempSet;
		case "SAVE_REALIZE":
			return action.payload;
		case "DELETE_SET":
			return null;
		case "DUPLICATE":
			return action.payload;
		case "UNIQUE":
			return action.payload;
		case "SIGN_OUT":
			return {};
		default:
			return state;
	}
}

export default set;
