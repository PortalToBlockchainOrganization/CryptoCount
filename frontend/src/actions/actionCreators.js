import * as api from "../api";

export function signIn(credentials, set, cb) {
    if(set === undefined){
        return (dispatch, prevState) => {
			console.log(credentials)
            api.signIn(credentials, undefined)
                .then((userinfo) => {
                    console.log(userinfo);
                    dispatch({ type: "SIGN_IN", user: userinfo })
                })
                .then(() => {
                    if (cb) {
                        cb();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    dispatch({ type: "SIGN_IN_ERR", details: error });
                });
        };
    }
    else{
		console.log(credentials)
        return (dispatch, prevState) => {
            api.signIn(credentials, set)
                .then((userinfo) =>{ 
					console.log(userinfo); 
					
					dispatch({ type: "SIGN_IN", user: userinfo })
				})
                .then(() => {
                    if (cb) {
                        cb();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    dispatch({ type: "SIGN_IN_ERR", details: error });
                });
        };
    }

}

export function signInWithGoogle(data, cb){
	return (dispatch, prevState) => {
		console.log("dispatch")
		dispatch({ type: "SIGN_IN", user: data })
		// dispatch({ type: "SIGN_IN", user: data })
		// api.googleAuth().then((userInfo)=>{
		// 	console.log('holy fuck' + userInfo)
		// 	dispatch({ type: "SIGN_IN", user: userInfo })

		// })
	}
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

export function deleteSet(set, cb) {
	return (dispatch, prevState) => {
		console.log(set);
		api.deleteSet(set)
			.then(() => {
				if (cb) {
					cb();
				}
				return dispatch({ type: "REMOVE_SET", payload: set });
			})
			.catch((error) =>
				dispatch({ type: "DELETE_SET_ERR", details: error })
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

export function generateAnalysis(params, cb) {
	return (dispatch) => {
		api.generatePost(params)
			.then((res) => {
				if (cb) {
					cb();
				}
				res.json().then((res) => {
					console.log(res);
					if (res["dup check"] !== undefined) {
						return dispatch({
							type: "DUPLICATE",
							payload: { dupId: res["dup of"] },
						});
					}
					let temp = { ...params };
					temp["histObjId"] = res["setId"];
					console.log(temp);
					dispatch({
						type: "UNIQUE",
						payload: { _id: res["setId"] },
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
}

// export function getCalendarData(params, cb) {
// 	let data;
// 	return (dispatch) => {
// 		api.getCalendarData(params)
// 			.then((res) => res.json())
// 			.then((res) => {
// 				data = res;
// 				if (cb) {
// 					cb();
// 				}
// 				return dispatch({ type: "CREATE_CAL", payload: data });
// 			})
// 			.catch((error) => console.log(error));
// 	};
// }

export function getUnrealizedSetStarted() {
	return { type: "CREATE_SET_STARTED" };
}

export function changeMode(){  
	return {    
	   type: "CHANGE_MODE"  
	}
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

export function resetSet() {
	return (dispatch) => {
		dispatch({ type: "DELETE_SET" });
	};
}

export function autoUnrealized(params, cb) {
	return (dispatch) => {
		dispatch(getUnrealizedSetStarted());
		api.unrealizedSet(params)
			.then((res) => {
				//console.log(res.json());
				res.json().then((data) => {
					dispatch({
						type: "CREATE_SET_SUCCEEDED",
						payload: data,
					});

					if (cb) cb();
					return;
				});
			})
			.catch((err) => {
				console.log(err);
				dispatch({ type: "BAD_ADDRESS_ERROR", details: err });
			});
	};
}

export function noAuthUnrealizedSet(params, cb) {
	return (dispatch) => {
		dispatch(getUnrealizedSetStarted());
		api.noAuthUnrealizedSet(params)
			.then((res) => {
				res.json().then((data) => {
					dispatch({
						type: "CREATE_SET_SUCCEEDED",
						payload: data,
					});

					if (cb) cb();
					return;
				});
			})
			.catch((err) => {
				console.log(err);
				dispatch({ type: "BAD_ADDRESS_ERROR", details: err });
			});
	};
}

export function getRealizingSetStart() {
	return { type: "CREATE_REALIZED_SET_STARTED" };
}

export function getRealizingSet(setId, quantity, cb) {
	return (dispatch) => {
		dispatch(getRealizingSetStart());
		console.log("exporting")
		console.log(setId, quantity)
		api.getRealizingSet(setId, quantity).then((res) => {
			res.json().then((res) => {
				dispatch({
					type: "ADD_REALIZING_SET",
					payload: res,
				});
				if (cb) {
					console.log("CB");
					cb();
				}
				return;
			});
		});
	};
}

export function noAuthRealizingSet(setId, quantity, cb) {
	console.log("NO AUTH REALIZING");
	return (dispatch) => {
		dispatch(getRealizingSetStart());
		api.noAuthGetRealizingSet(setId, quantity).then((res) => {
			res.json().then((res) => {
				dispatch({
					type: "ADD_REALIZING_SET",
					payload: res,
				});
				if (cb) {
					console.log("CB");
					cb();
				}
				return;
			});
		});
	};
}

export function startSaveRealizing() {
	return { type: "START_SAVE_REALIZE", payload: { isLoading: true } };
}

export function saveRealizing(setId) {
	return (dispatch) => {
		dispatch(startSaveRealizing);
		api.saveRealize(setId).then((res) => {
			res.json().then((res) => {
				return dispatch({
					type: "SAVE_REALIZE",
					payload: { data: res, isLoading: false },
				});
			});
		});
	};
}

export function getSet(params) {
	return (dispatch) => {
		dispatch(getUnrealizedSetStarted());
		console.log('dispatch')
		api.getSet(params.setId)
			.then((res) => {
				res.json().then((res) => {
					console.log(res);
					return dispatch({
						type: "CREATE_SET_SUCCEEDED",
						payload: res,
					});
				});
			})
			.catch((err) => {
				console.log(err);
				dispatch({ type: "BAD_ADDRESS_ERROR", details: err });
			});
	};
}

export function getHistoryStarted() {
	return { type: "CREATE_HISTORY_STARTED", payload: { isLoading: true } };
}

export function getHistory(cb) {
	return (dispatch) => {
		dispatch(getHistoryStarted());
		let history = [];
		api.getSets().then((res) => {
			res.json().then((res) => {
				history = res.map((set) => {
					if (
						(set?.unrealizedRewards?.length > 0 ||
							set?.realizedRewards?.length) &&
						set?.address &&
						set?.fiat
					) {
						let tempParams = {
							createdAt: set["createdAt"],
							id: set["_id"],
							address: set["address"],
							fiat: set["fiat"],
							basisDate: set["basisDate"]
								? set["basisDate"]
								: "Auto",
						};
						history.push(tempParams);
						if (cb) cb(tempParams);
					}
					return history;
				});
			});
		});
		console.log("FINAL HISTORY:", history);
		dispatch({ type: "CREATE_HISTORY_SUCCEEDED", payload: history });
		return Promise.all(history);

		// WORKING
		// const promises = setIdList.map((setId) => {
		// 	return new Promise((res, rej) => {
		// 		api.getSet(setId)
		// 			.then((res) => {
		// 				res.json().then((res) => {
		// 					let tempParams = {
		// 						fiat: res["fiat"],
		// 						basisDate: res["basisDate"],
		// 						address: res["address"],
		// 					};
		// 					history.push(tempParams);
		// 					if (cb) cb(tempParams);
		// 				});
		// 			})
		// 			.catch((err) => {
		// 				console.log(err);
		// 			});
		// 	});
		// });
		// dispatch({ type: "CREATE_HISTORY_SUCCEEDED", payload: history });
		// return Promise.all(promises);
	};
}

