function user(state = {}, action) {
	switch (action.type) {
		case "SIGN_IN":
			return action.user;
		case "SIGN_OUT":
			return {}; // Clear user state
		case "SIGN_IN_ERR":
			return state;
		default:
			return state;
	}
}

export default user;
