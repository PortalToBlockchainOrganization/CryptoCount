function cal(state = {}, action) {
	switch (action.type) {
		case "CREATE_CAL":
			return action.payload;
		case "DELETE_CAL":
			return state;
		case "SIGN_OUT":
			return {};
		default:
			return state;
	}
}

export default cal;
