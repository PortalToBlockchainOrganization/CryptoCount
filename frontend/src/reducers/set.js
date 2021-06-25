function set(state = {}, action) {
	switch (action.type) {
		case "CREATE_SET":
			return action.payload;
		case "DELETE_SET":
			return state;
		default:
			return state;
	}
}

export default set;
