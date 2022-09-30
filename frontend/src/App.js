import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { devToolsEnhancer } from "redux-devtools-extension";
import * as actionCreators from "./actions/actionCreators";
import Main from "./components/Main/Main";

function mapStateToProps(state) {
	return {
		user: state.user,
		params: {
			address: state.params.address,
			basisDate: state.params.basisDate,
			fiat: state.params.fiat,
			consensusRole: state.params.consensusRole,
		},
		Errs: state.Errs,
		cal: state.cal,
		set: state.set,
		realizedHistory: state.realizedHistory,
		mode: state.mode
	};
}

// Function properties automatically passed to Main
function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const App = withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

export default App;
