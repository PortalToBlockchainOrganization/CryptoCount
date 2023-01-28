import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import classes from "./Navbar.module.css";
import Menu from "../Menu/Menu";
//import ReactSwitch from "react-switch"
import {createContext} from "react"


export const ThemeContext = createContext(null)


const NavbarComponent = ({ signedIn, signOut, user, canAccessAnalysis }) => {
	let analysisStyle = classes.NavLinkDisabled;
	console.log("THINGGG")
	console.log(canAccessAnalysis)
	if (canAccessAnalysis) {
		analysisStyle = classes.NavLink;
	}

	const handleClick = (e) => {
		if (!canAccessAnalysis) {
			e.preventDefault();
		}
	};


	const [theme, setTheme] = React.useState('dark');
	const toggleTheme = ()=>{
		setTheme((curr)=>(curr === "light" ? "dark" : "light"))
	}
	
	const newTab = () => {
            window.open(
            "https://app.swaggerhub.com/apis-docs/PORTALTOBLOCKCHAIN_1/crypto-count_api/0.2.2#/", "_blank");
        }

		const newTab2 = () => {
            window.open(
            "https://ptbotech.org/", "_blank");
        }


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
									Enter
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
									Histories
								</NavLink>
								<a
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									onClick={newTab2}
								>
									Integrate
								</a>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/regulatory"
								>
									Regulation Tracker
								</NavLink>
								<a
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									onClick={newTab}
								>
									API
								</a>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/about"
								>
									About
								</NavLink>
								{/* <NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/blog"
								>
									Blog
								</NavLink> */}
						
								{/* <NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/privacy"
								>
									Privacy
								</NavLink> */}
							</>
						) : (
							<Nav className={classes.AccountNav}>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/"
									exact
								>
									Enter
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
								{/* <NavLink
									className={analysisStyle}
									activeClassName={classes.NavActive}
									onClick={toAnalysisIfSetGen}
									tooltip-data="Please enter or select delegation parameters to access."
									to="/analysis"
								>
									Analysis
								</NavLink> */}
									<a
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									onClick={newTab2}
								>
									Integrate
								</a>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/regulatory"
								>
									Regulation Tracker
								</NavLink>
								{/* <NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/blog"
								>
									Blog
								</NavLink> */}
								<a
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									onClick={newTab}
								>
									API
								</a>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/about"
								>
									About
								</NavLink>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/privacy"
								>
									Privacy
								</NavLink>
								<NavLink
									className={classes.NavLink}
									activeClassName={classes.NavActive}
									to="/signin"
								>
									Sign In
								</NavLink>
							
								{/* <div className="switch">
								<ReactSwitch onChange={toggleTheme} checked={theme==="dark"}/>
								</div> */}
								{/* <div className="switch">
									<ReactSwitch onChange={toggleTheme} checked={theme==="dark"}/>
								</div> */}
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
				<div className={classes.Beta}>Version<br></br> 0.2.3.2</div>
				{true ? (
					<Navbar.Text className={classes.Name}>
						{signedIn() ? (
							<div className={classes.MenuWrapper}>
								<div className={classes.Log}>
									
									<Menu
										label={`${user._id}`}
									>
										{/* <NavLink
											to="change-password"
											className={classes.Link}
										>
											Change Password
										</NavLink> */}
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


// {signedIn() ? (
// 	<div className={classes.Log}>

// 	<Menu
// 		label={`${user.email}`}
// 	>
// 		<Link
// 			onclick={signOut}
// 			// to="change-password"
// 			className={classes.Link}
// 		>
// 			Log Out
// 		</Link>
// 	</Menu>
// </div>
// ) : (
// 	""
// )}
