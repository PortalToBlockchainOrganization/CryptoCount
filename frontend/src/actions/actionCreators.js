import * as api from "../api";

export function signIn(credentials, cb) {
	return (dispatch, prevState) => {
		api.signIn(credentials)
			.then((userinfo) => dispatch({ type: "SIGN_IN", user: userinfo }))
			.then(() => {
				if (cb) {
					cb();
				}
			})
			.catch((error) => {
				dispatch({ type: "SIGN_IN_ERR", details: error });
			});
	};
}

export function signOut(cb) {
	return (dispatch, prevState) => {
		api.signOut()
			.then(() => dispatch({ type: "SIGN_OUT" }))
			.then(() => {
				if (cb) {
					cb();
				}
			});
	};
}

export function register(data, cb) {
	return (dispatch, prevState) => {
		api.register(data)
			.then(() => {
				if (cb) {
					cb();
				}
			})
			.catch((error) =>
				dispatch({ type: "REGISTER_ERR", details: error })
			);
	};
}

export function closeErr(cb) {
	return (dispatch, prevState) => {
		return dispatch({ type: "CLOSE_ERR" });
	};
}

export function setParams(params, cb) {
	if (cb) {
		cb();
	}
	return { type: "CREATE_PARAMS", payload: params };
}

export function analPost(params, cb) {
	return (dispatch) => {
		api.analPost(params).then(() => {
			if (cb) {
				cb();
			}
		});
	};
}

export function getCalendarData(params, cb) {
	let data;
	return (dispatch) => {
		api.getCalendarData(params)
			.then((res) => res.json())
			.then((res) => {
				data = res;
				if (cb) {
					cb();
				}
				return dispatch({ type: "CREATE_CAL", payload: data });
			})
			.catch((error) => console.log(error));
	};
}

export function getUnrealizedSet(params, cb) {
	let currentSet;
	return (dispatch) => {
		api.getUnrealizedSet(params)
			.then((res) => res.json())
			.then((data) => {
				currentSet = data;
				if (cb) cb();
				return dispatch({ type: "CREATE_SET", payload: currentSet });
			})
			.catch((err) => {
				console.log(err);
			});
	};
}
