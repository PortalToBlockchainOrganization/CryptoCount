function set(state = {}, action) {
	switch (action.type) {
		case "UMBRELLA_HOLDER":
			let umbrellaHolder = state;
			umbrellaHolder["umbrellaHolder"] = action.payload["umbrellaHolder"]
			return umbrellaHolder
		case "STATS":
			let thing = state;
			thing["users"] = action.payload["users"]
			thing["objects"] = action.payload["objects"]
			return thing
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
			return { isLoading: false, csv: [],data: action.payload };
		case "CREATE_REALIZED_SET_STARTED":
			let tempState = { ...state };
			tempState["isLoading"] = true;
			return tempState;
		
		case "ADD_REALIZING_SET":
			// TYPO IN RESPONSE PLS FIX
			let tempSet = state;
			// tempSet["data"]["unrealizedNativeRewards"] = 
			// 	action.payload["unrealizedNativeRewards"];
			// tempSet["data"]["unrealizedNativeFMVRewards"] = 
			// 	action.payload["unrealizedNativeFMVRewards"];
			// tempSet["data"]["unrealizedNativeSupplyDepletionRewards"] = 
			// 	action.payload["unrealizedNativeSupplyDepletionRewards"];
			// tempSet["data"]["unrealizedNativeMarketDilutionRewards"] = 
			// 	action.payload["unrealizedNativeMarketDilutionRewards"];
			tempSet["data"]["umbrellaHolderId"] = action.payload["umbrellaHolderId"]
			tempSet["data"]["realizingNativeRewards"] =
				action.payload["realizingNativeRewards"];
			tempSet["data"]["realizingNativeFMVRewards"] =
				action.payload["realizingNativeFMVRewards"];
			tempSet["data"]["realizingNativeSupplyDepletionRewards"] =
				action.payload["realizingNativeSupplyDepletionRewards"];
			tempSet["data"]["realizingNativeMarketDilutionRewards"] =
				action.payload["realizingNativeMarketDilutionRewards"];
			tempSet["data"]["realizedNativeRewards"] =
				action.payload["realizedNativeRewards"];
			tempSet["data"]["realizedNativeFMVRewards"] =
				action.payload["realizedNativeFMVRewards"];
			tempSet["data"]["realizedNativeSupplyDepletionRewards"] =
				action.payload["realizedNativeSupplyDepletionRewards"];
			tempSet["data"]["realizedNativeMarketDilutionRewards"] =
				action.payload["realizedNativeMarketDilutionRewards"];
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
				action.payload["fiat"];
			tempSet["data"]["netDiffFMV"] =
				action.payload["netDiffFMV"];
			tempSet["data"]["netDiffDilution"] =
				action.payload["netDiffDilution"];
			tempSet["data"]["netDiffSupplyDepletion"] =
				action.payload["netDiffSupplyDepletion"];
			tempSet["data"]["realizingDomainStartDate"] = action.payload["realizingDomainStartDate"]
			tempSet["data"]["realizingDomainEndDate"] = action.payload["realizingDomainEndDate"]
			tempSet["objectId"] = action.payload["_id"];
            tempSet["isLoading"] = false;
            tempSet["email"] = action.payload["email"]
            tempSet["firstName"] = action.payload["firstName"]
            tempSet["lastName"] = action.payload["lastName"]
			
			return tempSet;
		case "ADD_SAVE_REALIZE":
			let tempSet2 = state;
			tempSet2["data"]["aggregateUnrealizedNativeReward25p"]= 
				action.payload["aggregateUnrealizedNativeReward25p"]
			tempSet2["data"]["aggregateUnrealizedNativeReward50p"]= 
				action.payload["aggregateUnrealizedNativeReward50p"]
			tempSet2["data"]["aggregateUnrealizedNativeReward75p"]= 
				action.payload["aggregateUnrealizedNativeReward75p"]
			tempSet2["data"]["aggregateUnrealizedNativeReward100p"]= 
				action.payload["aggregateUnrealizedNativeReward100p"]
			tempSet2["data"]["unrealizedNativeRewards"] = 
				action.payload["unrealizedNativeRewards"];
			tempSet2["data"]["unrealizedNativeFMVRewards"] = 
				action.payload["unrealizedNativeFMVRewards"];
			tempSet2["data"]["unrealizedNativeSupplyDepletionRewards"] = 
				action.payload["unrealizedNativeSupplyDepletionRewards"];
			tempSet2["data"]["unrealizedNativeMarketDilutionRewards"] = 
				action.payload["unrealizedNativeMarketDilutionRewards"];
			tempSet2["data"]["realizedNativeRewards"] =
				action.payload["realizedNativeRewards"];
			tempSet2["data"]["realizedNativeFMVRewards"] =
				action.payload["realizedNativeFMVRewards"];
			tempSet2["data"]["realizedNativeSupplyDepletionRewards"] =
				action.payload["realizedNativeSupplyDepletionRewards"];
			tempSet2["data"]["realizedNativeMarketDilutionRewards"] =
				action.payload["realizedNativeMarketDilutionRewards"];
			tempSet2["data"]["realizingNativeRewards"] =
				action.payload["realizingNativeRewards"];
			tempSet2["data"]["realizingNativeFMVRewards"] =
				action.payload["realizingNativeFMVRewards"];
			tempSet2["data"]["realizingNativeSupplyDepletionRewards"] =
				action.payload["realizingNativeSupplyDepletionRewards"];
			tempSet2["data"]["realizingNativeMarketDilutionRewards"] =
				action.payload["realizingNativeMarketDilutionRewards"];
			// tempSet2["data"]["aggregateRealizedNativeReward100p"] =
			// 	action.payload["aggregateRealizedNativeReward100p"];
			// tempSet2["data"]["aggregateRealizedNativeFMVReward100p"] =
			// 	action.payload["aggregateRealizedNativeFMVReward100p"];
			// tempSet2["data"]["aggregateRealizedNativeSupplyDepletion100p"] =
			// 	action.payload["aggregateRealizedNativeSupplyDepletion100p"];
			// tempSet2["data"]["aggregateRealizedNativeMarketDilution100p"] =
			// 	action.payload["aggregateRealizedNativeMarketDilution100p"];
			tempSet2["data"]["pointOfSaleAggValue"] =
				action.payload["pointOfSaleAggValue"];
			tempSet2["data"]["TezosPriceOnDateObjectGenerated"] =
				action.payload["TezosPriceOnDateObjectGenerated"];
				tempSet2["data"]["fiat"] =
				action.payload["fiat"];
			tempSet2["data"]["netDiffFMV"] =
				action.payload["netDiffFMV"];
			tempSet2["data"]["netDiffDilution"] =
				action.payload["netDiffDilution"];
			tempSet2["data"]["netDiffSupplyDepletion"] =
				action.payload["netDiffSupplyDepletion"];
			// tempSet2["data"]["realizingDomainStartDate"] = action.payload["realizingDomainStartDate"]
			// tempSet2["data"]["realizingDomainEndDate"] = action.payload["realizingDomainEndDate"]
			tempSet2["objectId"] = action.payload["_id"];
            tempSet2["isLoading"] = false;
            tempSet2["email"] = action.payload["email"]
            tempSet2["firstName"] = action.payload["firstName"]
            tempSet2["lastName"] = action.payload["lastName"]
			return tempSet2;
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

