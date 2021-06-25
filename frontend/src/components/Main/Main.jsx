import React from "react";
import { RegisterHooks, SignInHooks, Landing } from "../components";
import Analysis from "../Analysis/Analysis";
import { Route, Redirect, Switch } from "react-router-dom";
import NavbarComponent from "../Navbar/Navbar.js";
import "./Main.css";
import ErrDialog from "../ConfDialog/ErrDialog";
import History from "../History/History";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const isAuthed = rest.isAuthed();
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed === true ? (
					rest.params && rest.params["address"] !== undefined ? (
						<Component
							params={rest.params}
							getUnrealizedSet={rest.getUnrealizedSet}
						/>
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

	if (props.params.basisDate !== undefined) {
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
					path="/home"
					exact
					component={() =>
						props.user.email ? (
							<Redirect to="/home" />
						) : (
							<Redirect to="/" />
						)
					}
				/>
				<Route
					path="/"
					exact
					render={() => (
						<Landing
							{...props}
							signedIn={signedIn}
							signOut={signOut}
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
				<Route path="/history" render={() => <History {...props} />} />
				<ProtectedRoute
					path="/analysis"
					exact
					strict
					component={Analysis}
					match={props.location}
					params={props.params}
					isAuthed={signedIn}
					getUnrealizedSet={props.getUnrealizedSet}
				/>
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
