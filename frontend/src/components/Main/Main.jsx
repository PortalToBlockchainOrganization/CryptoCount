import React from "react";
import { RegisterHooks, SignInHooks, Landing } from "../components";
import Analysis from "../Analysis/Analysis";
import { Route, Redirect, Switch } from "react-router-dom";
import NavbarComponent from "../Navbar/NavbarComponent";
import "./Main.css";
import ErrDialog from "../ConfDialog/ErrDialog";
import History from "../History/History";
import ProtectedRoute from "../ProtectedRoute";

const AnalysisBlock = ({ component: Component, ...rest }) => {
	const isAuthed = rest.isAuthed();
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed === true ? (
					rest.params && rest.params["address"] !== undefined ? (
						<Component {...rest} />
					) : (
						<>
							<Redirect to={{ pathname: "/" }} />
						</>
					)
				) : (
					<Redirect
						to={{
							pathname: "/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

const Main = (props) => {
	const [canAccessAnalysis, setCanAccessAnalysis] = React.useState(false);
	// const [history, setHistory] = React.useState();
	const { user, realizedHistory, getHistory, resetSet } = props;
	// const callHistory = useCallback(() => {
	// 	if (
	// 		user?.setIds?.length > 0 &&
	// 		realizedHistory.history === undefined
	// 		// realizedHistory["history"] === undefined
	// 	) {
	// 		getHistory(user.setIds);
	// 		console.log(realizedHistory);
	// 	}
	// 	if (realizedHistory.history !== undefined) {
	// 		console.log("SETTING HISTORY");
	// 		setHistory(realizedHistory);
	// 	}
	// }, [realizedHistory, getHistory, user.setIds]);

	// // // get history of sets when setIds change
	// React.useEffect(() => {
	// 	callHistory();
	// }, [callHistory]);

	if (props?.params?.fiat && props?.set !== null) {
		if (!canAccessAnalysis) {
			setCanAccessAnalysis(true);
		}
	}
	const signedIn = () => {
		return Object.keys(props.user).length !== 0; // Nonempty Prss obj
	};

	const closeErr = () => {
		props.closeErr();
	};

	const signOut = () => {
		setCanAccessAnalysis(false);
		props.signOut();
	};

	if (signedIn() === undefined) {
		return <div></div>;
	}
	return (
		<div>
			<NavbarComponent
				signedIn={signedIn}
				signOut={signOut}
				user={props.user}
				canAccessAnalysis={canAccessAnalysis}
			/>
			{/*Alternate pages beneath navbar, based on current route*/}
			<Switch>
				<Route
					path="/"
					exact
					render={() => (
						<Landing
							{...props}
							signedIn={signedIn}
							signOut={signOut}
							editParams={props.editParams}
							resetSet={resetSet}
							set={props.set}
						/>
					)}
				/>
				<Route
					path="/signin"
					exact
					render={() => <SignInHooks {...props} />}
				/>
				<Route
					path="/register"
					exact
					render={() => <RegisterHooks {...props} />}
				/>
				<ProtectedRoute path="/history" isAuthed={signedIn}>
					<History
						user={user}
						getHistory={getHistory}
						realizedHistory={realizedHistory}
					/>
				</ProtectedRoute>
				<AnalysisBlock
					path="/analysis"
					exact
					strict
					component={Analysis}
					match={props.location}
					params={props.params}
					isAuthed={signedIn}
					getUnrealizedSet={props.getUnrealizedSet}
					set={props.set}
					getRealizingSet={props.getRealizingSet}
					deleteParams={props.deleteParams}
					getSet={props.getSet}
					saveRealizing={props.saveRealizing}
					getHistory={props.getHistory}
				/>
				<Route>
					<Redirect to="/" />
				</Route>
			</Switch>

			{/*Error popup dialog*/}
			<ErrDialog
				show={Object.keys(props.Errs).length}
				title="Error Notice"
				body={props.Errs}
				buttons={["OK"]}
				onClose={() => closeErr()}
			/>
		</div>
	);
};

export default Main;
