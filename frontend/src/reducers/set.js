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
