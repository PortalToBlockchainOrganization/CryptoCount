import React from "react";
import {
	Form,
	Button,
	OverlayTrigger,
	Tooltip,
	Popover,
} from "react-bootstrap";
import VerticalModal from "../VerticalModal/VerticalModal";
import "./Landing.css";
import tezos from "../../Assets/Orgs/Tezos.png";
import BakingBad from "../../Assets/Orgs/BakingBad.png"
import tzkt from "../../Assets/Orgs/tzkt.png";
import tezosFoundation from "../../Assets/Orgs/TezosFoundation.png";
import ptbo from "../../Assets/Orgs/ptbo.png";
import lottie from "lottie-web";
import womenThinking from "../../Assets/womenThinking.json";
import womenComputer from "../../Assets/womenComputer.json";
import womenSigning from "../../Assets/womenSigning.json";
import chrome from "../../Assets/chrome.svg";
import firefox from "../../Assets/firefox.svg";
import SliderComponent from "./Slider.js"
import bb from "../../Assets/bb.png";
//import { ThemeContext, themes } from '../DarkMode/SizeContainer';
//import { Slider } from '@mui/material';
import Slider from 'react-input-slider';
import { keys } from "@mui/system";
import { useEffect } from 'react'
import Discord from "../../Assets/Discord.png";
import Twitter from "../../Assets/Twitter.png";
import GitHubIcon from "../../Assets/GitHub.png";





//

const Landing = (props) => {
	// Begin POST data states
	const [darkMode, setDarkMode] = React.useState(true);

	const [state, setState] = React.useState({ x: 10, y: 10 });
	const {
		set,
		user,
	
		getSet,
   
	} = props;


	<Slider
		styles={{
			track: {
			backgroundColor: 'green'
			},
			active: {
			backgroundColor: 'white'
			},
			thumb: {
			width: 50,
			height: 5
			},
			disabled: {
			opacity: 1
			}
		}}
		/>

	// const [setId, setSetId] = React.useState({setId: ""})
	// const handleSet = (e) => {
	// 	/* if there is set data and quantityRealize is not 0 then allow API
	// 	request to get Realized
	// 	*/
	// 	e.preventDefault();
	// 	console.log("asdf")

	// 	console.log("Getting set by Id");
	// 	getSet(
	// 		set["data"]["objectId"], // from component
	// 	);

		

	// 	//set to /analysis
	// };




	const [addrs, setAddrs] = React.useState({ delAddrs: "" });
	const [basisDate, setBasisDate] = React.useState({ basisDate: "" });
	const [fiat, setFiat] = React.useState("Select Fiat Currency");
	const [consensusRole, setConsensus] =  React.useState("Select Consensus Role");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [showModal, setShowModal] = React.useState(false);
	const [modalPage, setModalPage] = React.useState(0);
	const [selectedAnalysisType, setSelectedAnalysisType] = React.useState();
	const [isLoading, setLoadingState] = React.useState(false);
	const [setId, setSetId] = React.useState({ setObjectId: "" });

	const handleDelegationSubmit = () => {
		setShowModal(true);
	};

	console.log('user')
	console.log(user)

	useEffect(()=>{

		const urlSearchParams = new URLSearchParams(window.location.search);
		console.log("running")
		var intermObject = Object.fromEntries(urlSearchParams.entries())
		const it = JSON.stringify(intermObject);
		console.log(it.length)
		if(it.length>0){
			console.log('yo')
		}else{console.log('no')}

		if(it.length > 3){
			console.log(Object.fromEntries(urlSearchParams.entries())
			)
			var isITOBJ = (Object.fromEntries(urlSearchParams.entries()))
			//var string = JSON.stringify(isITOBJ)
			console.log(urlSearchParams)
			//console.log(string)
			// var parsed = JSON.parse(urlSearchParams)
			console.log(isITOBJ)
	
	
			//handle dispatch 
			props.signInWithGoogle(isITOBJ)
			if(props.user.email !== undefined){
				props.history.push("/history")
			}
		}
		
	}, [props])

		
	//handle session
	//make it so histories renders


	const getSignInOutOfURL = () => {

	}

	const handleSetIdSubmit = () =>{
		console.log('setid')
		setShowModal(false);
	}

	const handleDelegationChange = (e) => {
		setAddrs({ delAddrs: e.target.value });
	};

	const handleSetIdChange = (e) => {
		setSetId({
			setObjectId: e.target.value,
		})
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleDateInput = (e) => {
		setBasisDate({
			basisDate: e.toISOString().substr(0, 10),
		});
	};

	const handleSignIn = (e) => {
		props.signIn({ email, password }, () => {
			props.history.push("/");
		});
		e.preventDefault();
	};

	const setParams = (e) => {
		if (props.set["data"] !== undefined) {
			props.resetSet();
		}

		let params = {
			address: addrs["delAddrs"],
			basisDate: basisDate["basisDate"],
			fiat: fiat,
			consensusRole: consensusRole,
			user_id: user._id
		};
		console.log(params)

		props.setParams({
			fiat: params["fiat"],
			address: params["address"],
			consensusRole: params["consensusRole"],
			user_id: params["user_id"]
		});
		console.log(props)
		console.log(Object.keys(props.user).length > 0);
		if (Object.keys(props.user).length > 0) {
			console.log("AUTO");
			props.autoUnrealized(
				{
					fiat: params["fiat"],
					address: params["address"],
					consensusRole: params["consensusRole"],
					user_id: params["user_id"]
				},
				() => {
					props.history.push("/analysis");
				}
			);
		} else {
			props.noAuthUnrealizedSet(
				{
					fiat: params["fiat"],
					address: params["address"],
					consensusRole: params["consensusRole"],
					user_id: params["user_id"]
				},
				() => {
					props.history.push("/analysis");
				}
			);
		}
		// } else {
		// 	props.setParams(params);
		// 	if (props.signedIn()) {
		// 		props.analPost(params, () => {
		// 			props.history.push("/analysis");
		// 		});
		// 	}
		// }
		props.history.push("/analysis");
		setShowModal(false);
		e.preventDefault();
	};

	const setIdQuery = (e) => {
		// if (props.set["data"] !== undefined) {
		// 	props.resetSet();
		// }
		console.log('query')
		console.log(setId["setObjectId"])
		console.log(user._id)
		
		getSet(setId["setObjectId"],user._id);
			// () => {
			// 	props.history.push("/analysis");
			// }
		
		props.history.push("/analysis");
		setShowModal(false);
		e.preventDefault();
	};

	// const handleConsensusRoleUpdate = (e) => {
	// 	e = 'boobs'
	// 	props.setConsensus();
	// }

	const getCalendar = (e) => {
		let params = { address: addrs["delAddrs"], fiat: fiat };
		setLoadingState(true);
		props.setParams(params);
		props.getCalendarData(params, setLoadingState);
	};

	

	// var slider = document.getElementById("myRange")
	// var output = document.getElementById("value")

	// console.log(slider)

	// output.innerHTML = slider.value

	// slider.oninput = function(){
	// 	output.innerHTML = this.value * 0.0512
	// }

	// slider.addEventListener("mousemove", function(){
	// 	var x = slider.value;
	// 	var color = 'linear-gradient(90deg, white' + x + '%,black' + x  + '%)'
	// 	slider.style.background = color;

	// })

	React.useEffect(() => {
		lottie.loadAnimation({
			container: document.querySelector("#women-thinking"),
			animationData: womenThinking,
		});
	}, []);
	React.useEffect(() => {
		lottie.loadAnimation({
			container: document.querySelector("#women-computer"),
			animationData: womenComputer,
		});
	}, []);
	React.useEffect(() => {
		lottie.loadAnimation({
			container: document.querySelector("#women-signing"),
			animationData: womenSigning,
		});
	}, []);
	return (
		<div className="wrapper">
			<div className="lp-container">
				
				<section className="static-wrapper">
					<div className="logo-container">
						<a href="https://tezos.com"><img className="logo" src="./Tezos.png" alt="logo" /></a>
						<div className="X"> X </div>
						<img className="logo" src="./logo.png" alt="logo" />
					</div>
				</section>
				<br />
				<br />
				<div className="name-one-liner">
					<h1 className="logo-name">CryptoCount</h1>
				</div>
				
				<div className="name-one-liner">
					<h2 className="logo-tagline">
					 On-chain asset assessment tax tool. Mockup realizations of aggregated Tezos based assets in 40 fiat currencies.
					</h2>
				</div>
				<div className="form">
					<Form onSubmit={handleSignIn}>
						<Form.Group controlId="formBasicEmail">
						
							<h4 class="thickerplz">
								Paste Your Tezos Staking Address
							</h4>
							<Form.Control
								type="text"
								class="placeholdbetter"
								placeholder="Tz or KT... Delegator Or Baker Address"
								onChange={handleDelegationChange}
							/>
						</Form.Group>

						<Button
							className="button-continue"
							disabled={
								addrs["delAddrs"].length > 0 ? "" : "disabled"
							}
							variant="outline-danger"
							block
							onClick={handleDelegationSubmit}
						>
							Continue
						</Button>
					</Form>
				</div>
				<div class="logo-tagline">Or</div>
				<div className="form">
					
					<Form
					updateConsensus={setConsensus}
					>
						<Form.Group controlId="formBasicEmail">
						
							<h4 class="thickerplz">
								Paste Your Set Id
							</h4>
							<Form.Control
								setId={setId}
								type="text"
								class="placeholdbetter"
								placeholder="Set Id"
								onChange={handleSetIdChange}
							/>
						</Form.Group>

						<Button
							className="button-continue"
							// disabled={
							// 	setId["setId"].length > 0 ? "" : "disabled"
							// }
							variant="outline-danger"
							block
							onClick={setIdQuery}
						>
							Continue
						</Button>
					</Form>
				</div>
				<div>
				{/* <ThemeContext.Consumer>
									{({ changeTheme }) => (
									<Button
										color="link"
										onClick={() => {
										setDarkMode(!darkMode);
										changeTheme(darkMode ? themes.light : themes.dark);
										}}
									>
										<i className={darkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
										<span className="d-lg-none d-md-block">Switch mode</span>
									</Button>
									)}
				</ThemeContext.Consumer> */}

				</div>
				
				{/* <div className="name-one-liner">
					<h2 className="logo-tagline2">
						Learn more about CryptoCount
					</h2>
				</div> */}
			

				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						BROWSER EXTENSION 
					</h2>
				</div>
				<a
					className="download-link1"
					href="https://chrome.google.com/webstore/detail/cryptocount/bkcakdddagaipncnpoehneegdlhdlmjf"
					target="_blank"
					rel="noreferrer"
				>
					Download for Chrome
					<img src={chrome} alt="chrome-web-store" />
				</a>
		
				{/* <OverlayTrigger
					placement="right"
					overlay={
						<Popover>
							<Popover.Title as="h3">
								In Development 
							</Popover.Title>
						</Popover>
					}
				>
					<a
						id="firefox-link"
						className="download-link"
						target="_blank"
						rel="noreferrer"
					>
						Download for FireFox{" "}
						<img src={firefox} alt="firefox-add-on" />
					</a>
				</OverlayTrigger> */}
				<a
					className="download-link"
					href="https://www.portaltoblockchain.org/"
					target="_blank"
					rel="noreferrer"
				>
					PTBO TECH
					<img className="ptbo-link" src={ptbo} alt="ptbo" />
				</a>
				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						SOCIAL CHANNELS 
					</h2>
				</div>
				<a
						href="https://github.com/PortalToBlockchainOrganization"
						target="_blank"
						rel="noreferrer"
						className="download-link"
				>
						Github
					<img className="ptbo-link" src={GitHubIcon} alt="ptbo" />
				</a>
				<a
						href="https://discord.gg/a4PhFgBf"
						target="_blank"
						rel="noreferrer"
						className="download-link"
					>
						Discord
					<img className="ptbo-link" src={Discord} alt="ptbo" />
				</a>
					<a
						href="https://twitter.com/CryptoCountApp"
						target="_blank"
						rel="noreferrer"
						className="download-link"
					>
						Twitter
					<img className="ptbo-link" src={Twitter} alt="ptbo" />
				</a>
				{/* <div className='slideWrap'> */}
				
					<div className="name-one-liner2">
						<div className="logo-tagline4">
							Interested in staking on Tezos? See your expected return below 
						</div>
					</div>
					
					<SliderComponent></SliderComponent>
				{/* </div> */}
				<VerticalModal
					basisDate={basisDate}
					handleDateInput={handleDateInput}
					show={showModal}
					modalPage={modalPage}
					setModalPage={setModalPage}
					onHide={() => {
						setShowModal(false);
						setModalPage(0);
					}}
					isLoading={isLoading}
					fiat={fiat}
					consensusRole={consensusRole}
					updateConsensus={setConsensus}
					updateFiat={setFiat}
					setParams={setParams}
					cal={props.cal}
					selectedAnalysisType={selectedAnalysisType}
					setSelectedAnalysisType={setSelectedAnalysisType}
					getCalendar={getCalendar}
				/>
			
			{/* {!props.signedIn() ? (
				<div className="tutorial">
					<div className="p-gif">
						<div className="animation" id="women-thinking" />
						<div className="CTA">
							<div className="text">
								<h3>
									Track your Tezos activities and save fiat
									realizations.
								</h3>
								<br />
								<Button href="/About">Learn More</Button>
							</div>
						</div>
					</div>
					<div className="p-gif">
						<div className="CTA">
							<div className="text">
								<h3>
									Use CryptoCount's tools to consolidate your cryptocurrency
									accounting.
								</h3>
								<br />
								<Button href="/Regulatory">Learn More</Button>
							</div>
						</div>
						<div className="animation" id="women-computer" />
					</div>
					<div className="p-gif">
						<div className="animation" id="women-signing" />
						<div className="CTA">
							<div className="text">
								<h3>
									Monitor your Web3 activities' paralellel
									fiat performance.
								</h3>
								<br />
								<Button class="button" href="/Register">
									Free Account, No KYC Info
								</Button>
							</div>
						</div>
					</div>
					<div className="p-gif">
						<img className="ptbo-lp" src={ptbo} alt="ptbo-logo" />
						<div className="CTA">
							<div className="text">
								<h3>
									Does your platform host a layered
									staking operation? Use the 
									
									
									API to generate data and
									statements for your users.
								</h3>
								<br />
								<Button
									class="button"
									href="https://portaltoblockchain.org/api"
								>
									Go to API
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : null} */}
			<div>	<a
					className="download-link1"
					href="/Blog"
					target="_blank"
					rel="noreferrer">
					How To Use
					<img src="./logo.png" alt="chrome-web-store" />
				</a>
			</div>
			<div >
			<div className="bb2">
					<h2 className="logo-tagline5">
						Find the best baker here:
					</h2>
				</div>
				<button className="bb3"  href="https://baking-bad.org"><img className="bb" src={BakingBad} alt="BB"></img></button>
			</div>
			<div className="powered">POWERED BY</div>
			<div className="poweredBy">
				
				<a href="https://tezos.com/" target="_blank" rel="noreferrer">
					<img className="t-logo2" src={tezos} alt="Tezos" />
				</a>
				<a
					href="https://baking-bad.org"
					target="_blank"
					rel="noreferrer"
				>
					<img className="t-logo2" src={tzkt} alt="tzkt" />
				</a>
				<a
					href="https://tezos.foundation/"
					target="_blank"
					rel="noreferrer"
				>
					<img
						className="tFoundation"
						src={tezosFoundation}
						alt="Tezos Foundation"
					/>
				</a>
				<div
					href="portaltoblockchain.org"
					target="_blank"
					rel="noreferrer"
				>
					<img className="t-logo" src={ptbo} alt="ptbo" />
				</div>
			</div>
		</div>
	</div>
	);
};

export default Landing;
