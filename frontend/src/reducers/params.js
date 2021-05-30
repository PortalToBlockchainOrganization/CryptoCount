function params(state = {}, action) {
	switch (action.type) {
		case "CREATE_PARAMS":
			return action.payload;
		case "DELETE_PARAM":
			return state;
		default:
			return state;
	}
}

export default params;
