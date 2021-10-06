import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import classes from "./Navbar.module.css";
import Menu from "../Menu/Menu";

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
		<div>
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
						<Link
							className={classes.SignOut}
							onClick={signOut}
							to="/"
						>
							Sign out
						</Link>
					) : (
						""
					)}
				</Navbar.Collapse>
			</Navbar>
			<div
				className={classes.NameWrapper}
				style={{ backgroundColor: "transparent" }}
			>
				<div className={classes.Beta}>beta version 0.0.1</div>
				{true ? (
					<Navbar.Text className={classes.Name}>
						{signedIn() ? (
							<div className={classes.MenuWrapper}>
								<div className={classes.Log}>
									Logged in as:
									<Menu
										label={`${user.firstName} ${user.lastName}`}
									>
										<NavLink
											to="change-password"
											className={classes.Link}
										>
											Change Password
										</NavLink>
									</Menu>
								</div>
							</div>
						) : null}
					</Navbar.Text>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default NavbarComponent;
