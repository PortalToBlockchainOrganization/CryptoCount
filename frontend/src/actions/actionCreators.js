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

export function deleteParams() {
	return { type: "DELETE_PARAMS" };
}

export function editParams(params, cb) {
	if (cb) {
		cb();
	}
	return { type: "EDIT_PARAMS", payload: params };
}

export function analPost(params, cb) {
	return (dispatch) => {
		api.analPost(params).then((res) => {
			if (cb) {
				cb();
			}
			res.json().then((res) => {
				if (res["dup check"] !== undefined) {
					return dispatch({
						type: "DUPLICATE",
						payload: { dup_address: params.address },
					});
				}
				let temp = { ...params };
				temp["histObjId"] = res["setId"];
				dispatch({ type: "UNIQUE", payload: { _id: res["setId"] } });
			});
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

export function getUnrealizedSetStarted() {
	return { type: "CREATE_SET_STARTED" };
}

export function getUnrealizedSet(params) {
	return (dispatch) => {
		dispatch(getUnrealizedSetStarted());
		api.getUnrealizedSet(params)
			.then((res) =>
				res
					.json()
					.then((data) => {
						return data;
					})
					.then((data) => {
						return dispatch({
							type: "CREATE_SET_SUCCEEDED",
							payload: data,
						});
					})
			)
			.catch((err) => {
				console.log(err);
			});
	};
}

export function overwriteSet(params) {
	return (dispatch) => {
		dispatch();
	};
}

export function getRealizingSetStart() {
	return { type: "CREATE_REALIZED_SET_STARTED" };
}

export function getRealizingSet(setId, quantity, cb) {
	let temp;
	return (dispatch) => {
		dispatch(getRealizingSetStart());
		api.getRealizingSet(setId, quantity).then((res) => {
			res.json().then((res) => {
				temp = res;
				return dispatch({
					type: "ADD_REALIZING_SET",
					payload: res,
				});
			});
		});
		if (cb) {
			console.log("CB");
			cb(temp);
		}
	};
}

export function saveRealizing(setId, confirm_quantity) {
	return (dispatch) => {
		api.saveRealize(setId, confirm_quantity).then((res) => {
			return dispatch({ type: "SAVE_REALIZE", payload: res.json() });
		});
	};
}
