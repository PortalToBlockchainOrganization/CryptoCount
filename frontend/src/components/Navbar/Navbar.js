import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import classes from "./Navbar.module.css";

const NavbarComponent = ({ signedIn, signOut, user, canAccessAnalysis }) => {
	let analysisStyle = classes.NavLinkDisabled;

	if (canAccessAnalysis) {
		analysisStyle = classes.NavLink;
	}

	const handleClick = (e) => {
		if (!canAccessAnalysis) {
			e.preventDefault();
		}
	};

	return (
		<>
			<Navbar expand="sm" className={classes.NavWrapper}>
				<NavLink to="/">
					<Navbar.Brand>
						<img
							src="/logo.png"
							width="30"
							height="30"
							className="d-inline-block align-top"
							alt="React Bootstrap logo"
						/>
					</Navbar.Brand>
				</NavLink>
				<Navbar.Toggle />
				<Navbar.Collapse>
					<Nav className={classes.Nav} variant="pills">
						{signedIn() ? (
							<>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/"
									exact
								>
									Home
								</NavLink>
								<NavLink
									className={analysisStyle}
									activeClassName={classes.NavActive}
									onClick={handleClick}
									tooltip-data="Please enter or select delegation parameters to access."
									to="/analysis"
								>
									Analysis
								</NavLink>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/history"
								>
									Realized History
								</NavLink>
							</>
						) : (
							<Nav className={classes.AccountNav}>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/signin"
								>
									Sign In
								</NavLink>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/register"
								>
									Register
								</NavLink>
							</Nav>
						)}
					</Nav>
					{signedIn() ? (
						<NavLink
							className={classes.SignOut}
							onClick={signOut}
							to="/"
						>
							Sign out
						</NavLink>
					) : (
						""
					)}
				</Navbar.Collapse>
			</Navbar>
			<div className="text-right mr-5">
				{signedIn() ? (
					<Navbar.Text className={classes.Name}>
						{`Logged in as: ${user.firstName}
							${user.lastName}`}
					</Navbar.Text>
				) : (
					""
				)}
			</div>
		</>
	);
};

export default NavbarComponent;
