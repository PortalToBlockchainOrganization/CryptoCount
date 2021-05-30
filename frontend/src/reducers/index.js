import { combineReducers } from "redux";

import user from "./user";
import Errs from "./Errs";
import params from "./params";
import cal from "./cal";

const rootReducer = combineReducers({ user, Errs, params, cal });

export default rootReducer;
