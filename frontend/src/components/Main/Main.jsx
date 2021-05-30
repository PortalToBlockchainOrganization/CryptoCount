import React from "react";
import { RegisterHooks, SignInHooks, Landing } from "../components";
import Analysis from "../Analysis/Analysis";
import { Route, Redirect, Switch } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import "./Main.css";
import ErrDialog from "../ConfDialog/ErrDialog";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const isAuthed = rest.isAuthed();
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed === true ? (
					<Component {...props} />
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
	const signedIn = () => {
		return Object.keys(props.user).length !== 0; // Nonempty Prss obj
	};

	const closeErr = () => {
		props.closeErr();
	};

	const signOut = () => {
		props.signOut();
		props.history.push("/");
	};

	if (signedIn === undefined) {
		return <div></div>;
	}

	return (
		<div>
			<div>
				<div>
					<Navbar expand="sm">
						<IndexLinkContainer to="/" exact>
							<Navbar.Brand>
								<img
									src="/logo.png"
									width="30"
									height="30"
									className="d-inline-block align-top"
									alt="React Bootstrap logo"
								></img>
							</Navbar.Brand>
						</IndexLinkContainer>
						<Navbar.Toggle />
						<Navbar.Collapse>
							<Nav className="ml-auto" variant="pills">
								<IndexLinkContainer
									className="nav-pills"
									to="/"
									exact
									key={3}
								>
									<Nav.Link>Home</Nav.Link>
								</IndexLinkContainer>
								{signedIn() ? (
									<div className="signed-links">
										<IndexLinkContainer
											className="nav-pills"
											to="/analysis"
											exact
											key={1}
										>
											<Nav.Link to="/analysis" exact>
												Analysis
											</Nav.Link>
										</IndexLinkContainer>
										<IndexLinkContainer
											className="nav-pills"
											to="/addresses"
											exact
											key={0}
										>
											<Nav.Link to="/addresses">
												My Addresses
											</Nav.Link>
										</IndexLinkContainer>
									</div>
								) : (
									[
										<IndexLinkContainer
											className="nav-pills"
											to="/signin"
											key={4}
										>
											<Nav.Link>Sign In</Nav.Link>
										</IndexLinkContainer>,
										<IndexLinkContainer
											className="nav-pills"
											to="/register"
											key={5}
										>
											<Nav.Link>Register</Nav.Link>
										</IndexLinkContainer>,
									]
								)}
							</Nav>
							{signedIn() ? (
								<Nav className="ml-auto">
									<Nav.Link
										className="text-secondary"
										onClick={() => signOut()}
									>
										Sign out
									</Nav.Link>
								</Nav>
							) : (
								""
							)}
						</Navbar.Collapse>
					</Navbar>

					<div className="text-right mr-5">
						{signedIn() ? (
							<Navbar.Text className="mr-5">
								{`Logged in as: ${props.user.firstName}
                        ${props.user.lastName}`}
							</Navbar.Text>
						) : (
							""
						)}
					</div>
				</div>

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
					<ProtectedRoute
						path="/analysis"
						exact
						strict
						component={(props) => (
							<Analysis
								match={props.location}
								user={props.user}
							/>
						)}
						isAuthed={signedIn}
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
		</div>
	);
};

export default Main;
