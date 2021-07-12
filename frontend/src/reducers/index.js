import { combineReducers } from "redux";

import user from "./user";
import Errs from "./Errs";
import params from "./params";
import cal from "./cal";
import set from "./set";
import realizedHistory from "./realizedHistory";

const rootReducer = combineReducers({
	user,
	Errs,
	params,
	cal,
	set,
	realizedHistory,
});

export default rootReducer;
