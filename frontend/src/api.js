const baseURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3001"
		: "https://cryptocount.co/api/";
const headers = new Headers();
var sessionId;

// Orderly interface to the REST server, providing:
// 1. Standard URL base
// 2. Standard headers to manage CORS and content type
// 3. Guarantee that 4xx and 5xx results are returned as
//    rejected promises, with a payload comprising an
//    array of user-readable strings describing the error.
// 4. All successful post operations return promises that
//    resolve to a JS object representing the newly added
//    entity (all fields, not just those in the post body)
//    The only exception is Prss POST which cannot do this
//    due to login requirements.  Prss POST does the best
//    it can by returning the object it just added, augmented
//    with the proper ID.
// 5. Signin and signout operations that retain relevant
//    sessionId data.  Successful signin returns promise
//    resolving to newly signed in user.
headers.set("Content-Type", "application/json");



console.log(process.env.NODE_ENV);
const reqConf = {
	headers: headers,
};

if (process.env.NODE_ENV === "development") {
	reqConf["credentials"] = "include";
}

function safeFetch(method, endpoint, body) {
	return fetch(baseURL + endpoint, {
		method: method,
		body: JSON.stringify(body),
		...reqConf,
	})
		// .catch(function (response) {
		// 	return Promise.reject([{ tag: "UnRespServer" }]);
		// })
		.then(function (response) {
			if (response.status === 400) {
				return response.json().then(function (response) {
					return Promise.reject(response);
				});
			} else if (response.status === 401) {
				return Promise.reject([{ tag: "Unauthorized" }]);
			} else if (response.status === 403)
				return Promise.reject([{ tag: "Forbidden" }]);
			else if (response.status === 500)
				return Promise.reject([{ tag: "Internal" }]);
			else return Promise.resolve(response);
		});
}


export function post(endpoint, body) {
	return safeFetch("POST", endpoint, body);
}

export function put(endpoint, body) {
	return safeFetch("PUT", endpoint, body);
}

export function get(endpoint, body) {
	return safeFetch("GET", endpoint, body);
}

export function del(endpoint, body) {
	return safeFetch("DELETE", endpoint, body);
}

// Functions for performing the api requests

/**
 * Sign a user into the service, returning a promise of the
 * user token
 * @param {{email: string, password: string}} cred
 */

export function signIn(cred, set) {
    if (set!==undefined){
        cred.set = set
    }
	return post("/auth/login", cred)
		.then((response) => {
			return response.json()})
			.then((response)=>{
				// let location = response.headers.get("Location").split("/");
				sessionId = response.authToken;
				console.log('woopee')
				console.log(response)
				return response
			})
		//  .then((response) => response.json()) // ..json() returns a Promise!
		// .then((body) => get("login/auth" + body.prsId))
		// .then((userResponse) => userResponse.json())
		.then((rsp) => rsp);
}

/**
 * @returns {Promise} result of the sign out request
 */
export function signOut() {
	return del("/auth/logout" + sessionId);
}

/**
 * Register a user
 * @param {Object} user
 * @returns {Promise resolving to new user}
 */
export function register(user) {
	return post("/auth/register", user);
}

export function deleteSet(id) {
	console.log('deleteing api')
	console.log(id)
	return post("/history/delete/", {
		setId: id
	});
}

// export function generatePost(params) {
// 	if (params) {
// 		return post("Anal", {
// 			address: params["address"],
// 			basisDate: params["basisDate"],
// 			fiat: params["fiat"],
// 		});
// 	}
// }

// export function getCalendarData(params) {
// 	return post("Anal/Cal/", {
// 		address: params["address"],
// 		fiat: params["fiat"],
// 	});
// }

// export function getUnrealizedSet(params) {
// 	return post("Anal/Unrel", {
// 		address: params["address"],
// 		//basisDate: params["basisDate"],
// 		fiat: params["fiat"],
// 		histObjId: params["histObjId"],
// 	});
// }

export function generatePost(params) {
	console.log("1")

	return post("/tezos/Generate", 
		{
			"fiat": params["fiat"],
			"address": params["address"],
			"consensusRole": params["consensusRole"],
			"user_id": params["user_id"]
		},
	);
}

export function unrealizedSet(params) {
	console.log("2")

	return post("/tezos/Generate", 	
	{

			"fiat": params["fiat"],
			"address": params["address"],
			"consensusRole": params["consensusRole"],
			"user_id": params["user_id"]
			
		
	});
}

export function stats(){
	return post("/history/stats")
}

//is this for rendering a set after being called from the datbase?
export function getUnrealizedSet(params) {
	console.log("3")

	return post("/tezos/Generate", {
			"fiat": params["fiat"],
			"address": params["address"],
			"consensusRole": params["consensusRole"],
			"user_id": params["user_id"]
			
		
	});
}

export function noAuthUnrealizedSet(params) {
	console.log("4" )

	return post("/tezos/Generate", {
			fiat: params["fiat"],
			address: params["address"],
			consensusRole: params["consensusRole"],	
			user_id: params["user_id"]
	});
}

export function getRealizingSet(setId, quantity) {
	return post("/tezos/Realize", {
		setId: setId,
		quantity: quantity,
	});
}

export function noAuthGetRealizingSet(setId, quantity) {
	console.log("API", setId, quantity);
	return post("/tezos/Realize", {
		setId: setId,
		quantity: quantity,
	});
}

export function saveRealize(setId, confirm_quantity) {
	return post("/tezos/Save", {
		objectId: setId,
		quantity: confirm_quantity,
	});
}

export function getSet(setId, user_id) {
	return post("/tezos/Retrieve", {
		setId: setId,
		user_id: user_id,
	});
}

export function getUmbrellaHolder(umbrellaHolderId){
	return post ("/tezos/UmbrellaHolder",{
		umbrellaHolderId: umbrellaHolderId
	})
}



export function getSets(user_id) {
	return post("/history/",{
		user_id: user_id
	})
}

export function forgotPassword(emailObj) {
	return post("/forgotpw", emailObj);
}

export function changePassword(userWithNewPassword) {
	return post("/changepw", userWithNewPassword);
}

export function googleAuth(){
	return get("/auth/google")
}

const errMap = {
	Internal: "An Internal Server Error Occurred",
	Forbidden: "You are Forbidden from Viewing the Requested Page",
	Unauthorized: "You are Unauthorized to View the Requested Page",
	UnRespServer: "The Server is Likely Down",
	missingField: "Field missing from request: ",
	badValue: "Field has bad value: ",
	notFound: "Entity not present in DB",
	badLogin: "Email/password combination invalid",
	dupEmail: "Email duplicates an existing email",
	noTerms: "Acceptance of terms is required",
	forbiddenRole: "Role specified is not permitted.",
	noOldPwd: "Change of password requires an old password",
	oldPwdMismatch: "Old password that was provided is incorrect.",
	dupTitle: "Conversation title duplicates an existing one",
	dupEnrollment: "Duplicate enrollment",
	forbiddenField: "Field in body not allowed.",
	queryFailed: "Query failed (server problem).",
	badAddress: "Invalid baker or delegator address.",
};

/**
 * @param {string} errTag
 * @param {string} lang
 */
export function errorTranslate(errTag) {
	return errMap[errTag] || "Unknown Error!";
}

