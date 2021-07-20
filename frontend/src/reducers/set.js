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
			tempSet["data"]["realizingRewards"] =
				action.payload["realizingRewards"];
			tempSet["data"]["realizingRewardBasis"] =
				action.payload["realizingRewardBasis"];
			tempSet["data"]["realizingRewardBasisDep"] =
				action.payload["realizingRewardBasisDep"];
			tempSet["data"]["realizingRewardBasisMVDep"] =
				action.payload["realizingRewardBasisMVDep"];
			tempSet["data"]["realizingRewardAgg"] =
				action.payload["realizingRewardAgg"];
			tempSet["data"]["realizingBasisAgg"] =
				action.payload["realizingBasisAgg"];
			tempSet["data"]["realizingDepAgg"] =
				action.payload["realizingDepAgg"];
			tempSet["data"]["realizingMVdAgg"] =
				action.payload["realizingMVdAgg"];
			tempSet["data"]["unrealizedBasisP"] =
				action.payload["unrealizedBasisP"];
			tempSet["data"]["realizingBasisP"] =
				action.payload["realizingBasisP"];
			tempSet["data"]["realizingBasisMVDAgg"] =
				action.payload["realizingBasisMVDAgg"];
			tempSet["isLoading"] = false;
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
