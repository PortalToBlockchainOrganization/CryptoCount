function realizedHistory(state = {}, action) {
	switch (action.type) {
		case "CREATE_HISTORY_STARTED":
			return action.payload;
		case "CREATE_HISTORY_SUCCEEDED":
            console.log("CREATE_HISTORY_SUCCEEDED", action.payload)
            return { isLoading: false, history: action.payload };
        case "NEW_SET_CREATED":
            var temp = state
            console.log(temp)
            temp.push(action.payload)
            return temp
        case "REMOVE_SET":
            var temp = state
            temp = state.history.filter(set => set.id !== action.payload);
            return {isLoading: false, history: temp};
		case "SIGN_OUT":
			return {};
		default:
			return { isLoading: false };
	}
}

export default realizedHistory;
