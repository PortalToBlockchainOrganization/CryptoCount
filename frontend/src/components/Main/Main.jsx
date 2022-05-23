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
import ChangePassword from "../ChangePassword/ChangePassword";
import About from "../About/About";
import Privacy from "../Privacy/Privacy";
import Regulatory from "../Regulatory/Regulatory.js"
import Blog from "../Blog/blog.js"

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

	if (props?.params?.fiat || Object.keys(props?.set) > 0) {
		if (!canAccessAnalysis) {
			setCanAccessAnalysis(true);
		}
	}
	const signedIn = () => {
		return Object.keys(props.user).length !== 0; // Nonempty Prss obj
	};

	const closeErr = (errs) => {
		console.log(errs);
		let redir = false;
		if (errs[0].tag === "badAddress") redir = true;
		props.closeErr();
		if (redir) props.history.push("/");
	};

	const signOut = () => {
		setCanAccessAnalysis(false);
		props.signOut();
		props.history.push("/");
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
				<About path="/about" exact strict componenet={About}>
					About
				</About>
				<Privacy path="/privacy" exact strict componenet={Privacy}>
					Privacy
				</Privacy>
				<Regulatory path="/regulatory" exact strict component={Regulatory}>
					Regulatory
				</Regulatory>
				<Blog path="/blog" exact strict component={Blog}>
					Blog
					</Blog> 
				<Route
					path="/signin"
					exact
					render={() => <SignInHooks {...props} />}
				/>
				<ProtectedRoute
					exact
					path="/change-password"
					isAuthed={signedIn}
				>
					<ChangePassword email={user["email"]} />
				</ProtectedRoute>
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
						deleteSet={props.deleteSet}
					/>
				</ProtectedRoute>
				<Route exact path="/analysis">
					<Analysis
						match={props.location}
						params={props.params}
						user={props.user}
						isAuthed={signedIn}
						getUnrealizedSet={props.getUnrealizedSet}
						set={props.set}
						getRealizingSet={props.getRealizingSet}
						deleteParams={props.deleteParams}
						getSet={props.getSet}
						saveRealizing={props.saveRealizing}
						getHistory={props.getHistory}
						noAuthRealizingSet={props.noAuthRealizingSet}
					/>
				</Route>
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
				onClose={() => closeErr(props.Errs)}
			/>
		</div>
	);
};

export default Main;
