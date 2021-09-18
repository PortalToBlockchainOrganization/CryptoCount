import React from "react";
import { RegisterHooks, SignInHooks, Landing } from "../components";
import Analysis from "../Analysis/Analysis";
import { Route, Redirect, Switch } from "react-router-dom";
import NavbarComponent from "../Navbar/NavbarComponent";
import "./Main.css";
import ErrDialog from "../ConfDialog/ErrDialog";
import History from "../History/History";
import ProtectedRoute from "../ProtectedRoute";
import ResetPassword from "../ResetPassword/ResetPassword";

const AnalysisBlock = ({ component: Component, ...rest }) => {
	const isAuthed = rest.isAuthed();
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed === true ? (
					rest.params &&
					(rest.params["address"] !== undefined ||
						rest.set !== null) ? (
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
	const { user, realizedHistory, getHistory, resetSet } = props;

	console.log(props.params.fiat || Object.keys(props.set) > 0);
	if (props?.params?.fiat || Object.keys(props?.set) > 0) {
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
				<Route path="/reset-password" exact component={ResetPassword} />
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
						getSet={props.getSet}
						setParams={props.setParams}
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
