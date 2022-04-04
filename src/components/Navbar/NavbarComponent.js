import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
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
			<header className="px-4 z-10 shadow-sm flex items-center h-16">
				<NavLink to="/">
					<img
						src="/logo.png"
						width="30"
						height="30"
						className="d-inline-block align-top"
						alt="Rlogo"
					/>
				</NavLink>
				<Navbar.Toggle />
				<nav className="ml-auto h-full">
					{signedIn() ? (
						<>
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
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
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/history"
							>
								Realized History
							</NavLink>
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/about"
							>
								About
							</NavLink>
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/privacy"
							>
								Privacy
							</NavLink>
						</>
					) : (
						<div className="h-full flex items-center">
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/privacy"
							>
								Privacy
							</NavLink>
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/about"
							>
								About
							</NavLink>
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/signin"
							>
								Sign In
							</NavLink>
							<NavLink
								className="text-center text-gray-500 font-medium h-full p-5"
								activeClassName="h-full border-b-2 border-red-500"
								to="/register"
							>
								Register
							</NavLink>
						</div>
					)}
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
				</nav>
			</header>
			<div
				className={classes.NameWrapper}
				style={{ backgroundColor: "transparent" }}
			>
				<div className={classes.Beta}>beta version 0.1.0</div>
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
