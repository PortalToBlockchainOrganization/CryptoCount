function realizedHistory(state = {}, action) {
	switch (action.type) {
		case "CREATE_HISTORY_STARTED":
			return action.payload;
		case "CREATE_HISTORY_SUCCEEDED":
			return { isLoading: false, history: action.payload };
		case "SIGN_OUT":
			return {};
		default:
			return { isLoading: false };
	}
}

export default realizedHistory;
