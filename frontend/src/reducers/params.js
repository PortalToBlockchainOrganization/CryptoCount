function params(state = {}, action) {
	switch (action.type) {
		case "CREATE_PARAMS":
			return action.payload;
		case "EDIT_PARAMS":
			return action.payload;
		case "DELETE_PARAM":
			return state;
		case "SIGN_OUT":
			return {};
		default:
			return state;
	}
}

export default params;
