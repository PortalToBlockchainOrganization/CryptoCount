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
import coingecko from "../../Assets/Orgs/coingecko.png"
import ptbo from "../../Assets/Orgs/ptbo.png";
import apache from "../../Assets/Orgs/apache.png";
import lottie from "lottie-web";
import womenThinking from "../../Assets/womenThinking.json";
import womenComputer from "../../Assets/womenComputer.json";
import womenSigning from "../../Assets/womenSigning.json";
import chrome from "../../Assets/chrome.svg";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import firefox from "../../Assets/firefox.svg";
import CopyToClipboard from "react-copy-to-clipboard"
import SliderComponent from "./Slider.js"
import bb from "../../Assets/bb.png";
import { useState } from "react";
import logogif from "../../Assets/logo.gif";
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


	const [showModal2, setShowModal2] = React.useState(false);

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

	const [isCopied, setIsCopied] = useState(false);
	const [isCopied2, setIsCopied2] = useState(false);



	useEffect(()=>{
		props.stats()
		
	}, [])

	const {stats} = props

		
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

	const renderPayButton = () => {
		if (props.signedIn()) {
		  return (
			<Button onClick={() => props.history.push("/pay")}>Pay $45</Button>
		  );
		} else {
		  return (
			<Button onClick={() => props.history.push("/signin")}>Sign In/Register</Button>
		  );
		}
	  }

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
				<h1 className="logo-name9">Everything Tezos Tax Reconcilliation and Reconnasiance</h1>
				<section className="static-wrapper">
					<div className="logo-container">
						<a href="https://tezos.com"><img className="logo" src="./Tezos.png" alt="logo" /></a>
						<div className="X"> X </div>
						<img src={logogif} className="logosmall"alt="loading..." />
						
						{/* <img className="logo" src="./logo.png" alt="logo" /> */}
					</div>
				</section>
				<br />
				<br />
				{/* <div className="name-one-liner">
					<h1 className="logo-name">CryptoCount</h1>
				</div> */}
				
				<div className="KASD">
					<h2 className="logo-tagline">
					 Tezos Block Rewards' Fair Market Value Assessment Tool. 
					</h2>
					
				</div>
				<div className="name-one-liner">
					<h2 className="logo-tagline">
					Mockup sales and get free income statements of Tezos based assets in 40 fiat currencies.				
						</h2>
					
				</div>
				<div style={{display: 'flex'}}><div   className="logo-tagline69">LIVE PRODUCT:  XTZ Staking Reward FMV Income Mockups </div></div>
				<div style={{display: 'flex'}} className="form2">
				{/* <div className="form">
					<Form onSubmit={handleSignIn}>
						<Form.Group controlId="formBasicEmail">
						
							<h2 class="thickerplz">
								Connect your Tezos wallet
							
							</h2>
							
							<form className="form-inline cool-form">
							<div className="formLength">
							<input className="formLength" placeholder="Tz.., KT.., or Tezos Domain" onChange={handleDelegationChange}/>
							</div>
							</form> 
							<Form.Control
								type="text"
								class="placeholdbetter"
								placeholder="Tz.., KT.., or Tezos Domain"
								onChange={handleDelegationChange}
							/>
						</Form.Group>
						
						<Button
							className="button-continue"
							// disabled={
							// 	addrs["delAddrs"].length > 0 ? "" : "disabled"
							// }
							variant="outline-danger"
							block
							onClick={handleDelegationSubmit2}
						>
							Continue
						</Button>
					</Form>
					
				</div> */}
				<div className="form">
					<Form onSubmit={handleSignIn}>
						<Form.Group controlId="formBasicEmail">
						
							<h2 class="thickerplz">
								Paste your Address or Tez Domain
							
							</h2>
							
							{/* <form className="form-inline cool-form">
							<div className="formLength">
							<input className="formLength" placeholder="Tz.., KT.., or Tezos Domain" onChange={handleDelegationChange}/>
							</div>
							</form> */}
							<Form.Control

								type="text"
								class="thickerplz"
								placeholder="Tz.., KT.., or Tezos Domain"
								onChange={handleDelegationChange}
							/>
						</Form.Group>
						

						<Button
							className="button-continue"
							disabled={
								addrs["delAddrs"].length > 0 ? "" : "disabled"
							}
							variant="success"
							block
							onClick={handleDelegationSubmit}
						>
							Continue
						</Button>
					</Form>
					
				</div>
				{/* <div
								className="help"
								tooltip-data="Copy your Tezos address from your wallet and paste it in the field to view your accounting set"
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
				</div> */}
				{/* <div class="logo-tagline">Or</div> */}
				<div className="form">
					
					<Form
					updateConsensus={setConsensus}
					>
						<Form.Group controlId="formBasicEmail">
						
							<h2 class="thickerplz">
								Paste Your Set Id 
							</h2>
							<Form.Control
								setId={setId}
								type="text"
								class="thickerplz"
								placeholder="Set Id"
								onChange={handleSetIdChange}
							/>
						</Form.Group>

						<Button
							className="button-continue"
							// disabled={
							// 	setId["setId"].length > 0 ? "" : "disabled"
							// }
							variant="success"
							block
							onClick={setIdQuery}
						>
							Continue
						</Button>
					</Form>
				</div>
				</div>
				<div
								className="help"
								tooltip-data="Paste in a set id to retrieve your updated accounting set from a previous CryptoCount session."
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
								</div>
				
				<div>
				<div style={{display: 'flex'}}><h1   className="logo-tagline">UNDER DEVELOPMENT: XTZ + Tezos Chain Token Capital Gain and FMV Income Mockups </h1><h1 className="logo-name11"> <div>
  {renderPayButton()}
</div></h1></div>
				<div style={{display: 'flex', opacity: '0.7'}} className="form3">
					
				{/* <div className="form">
					<Form onSubmit={handleSignIn}>
						<Form.Group controlId="formBasicEmail">
						
							<h2 class="thickerplz">
								Connect your Tezos wallet
							
							</h2>
							
							<form className="form-inline cool-form">
							<div className="formLength">
							<input className="formLength" placeholder="Tz.., KT.., or Tezos Domain" onChange={handleDelegationChange}/>
							</div>
							</form>
							<Form.Control
								type="text"
								class="placeholdbetter"
								placeholder="Tz.., KT.., or Tezos Domain"
								onChange={handleDelegationChange}
							/>
						</Form.Group>
						
						<Button
							className="button-continue"
							// disabled={
							// 	addrs["delAddrs"].length > 0 ? "" : "disabled"
							// }
							variant="outline-danger"
							block
							onClick={handleDelegationSubmit2}
						>
							Continue
						</Button>
					</Form>
					
				</div> */}
				<div className="form">
					<Form onSubmit={handleSignIn}>
						<Form.Group controlId="formBasicEmail">
						
							<h2 class="thickerplz">
								Paste your Address or Tez Domain
							
							</h2>
							
							{/* <form className="form-inline cool-form">
							<div className="formLength">
							<input className="formLength" placeholder="Tz.., KT.., or Tezos Domain" onChange={handleDelegationChange}/>
							</div>
							</form> */}
							<Form.Control
								type="text"
								class="thickerplz"
								placeholder="Tz.., KT.., or Tezos Domain"
								//onChange={handleDelegationChange}
							/>
						</Form.Group>
						

						<Button
							className="button-continue"
							disabled={
								addrs["delAddrs"].length > 0 ? "" : "disabled"
							}
							variant="outline-danger"
							block
							// onClick={handleDelegationSubmit}
						>
							Continue
						</Button>
					</Form>
					
				</div>
				{/* <div
								className="help"
								tooltip-data="Copy your Tezos address from your wallet and paste it in the field to view your accounting set"
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
				</div> */}
				{/* <div class="logo-tagline">Or</div> */}
				<div className="form">
					
					<Form
					updateConsensus={setConsensus}
					>
						<Form.Group controlId="formBasicEmail">
						
							<h2 class="thickerplz">
								Paste Your Set Id 
							</h2>
							<Form.Control
								setId={setId}
								type="text"
								class="thickerplz"
								placeholder="Set Id"
								// onChange={handleSetIdChange}
							/>
						</Form.Group>

						<Button
							className="button-continue"
							// disabled={
							// 	setId["setId"].length > 0 ? "" : "disabled"
							// }
							variant="outline-danger"
							block
							//onClick={setIdQuery2}
						>
							Continue
						</Button>
					</Form>
				</div>
				</div>
				<div
								className="help"
								tooltip-data="Paste in a set id to retrieve your updated accounting set from a previous CryptoCount session."
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
								</div>
				
				<div></div>
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
				
			

				<div className="statsTitle">Stats and KPI</div>
				<div style={{display: 'flex'}}>
				<div className="stats">
						<div className="stats1">{set["users"]}</div><div className="stats3"> Users </div>

						<div className="stats1">{set["objects"]}</div><div className="stats3"> Sets</div>
						</div>
						{/* <div>
						<div className="stats2">Powered By Google and PTBO TECH</div>
				</div> */}
				<div className="stats">
						<div className="stats1"></div><div className="stats3"> Total Mocked Up Assets </div>

						<div className="stats1">1,784,198,801.3</div><div className="stats3"> XTZ</div>
						</div>

				</div>

				<div>
					<div className="stats2">Powered By Google and PTBO TECH</div>

				</div>
				

				{/* <div className="name-one-liner">
					<h2 className="logo-tagline2">
						Learn more about CryptoCount
					</h2>
				</div> */}
				<div style={{display: 'flex'}}>
				<div  className="setToggles13">
					<div className="words3">Demo CryptoCount (It's Free)</div>
					
				<CopyToClipboard text={"63b7a9c38c78bc302554e5d6"} onCopy={() => setIsCopied({isCopied: true})}>
							<button className="words3"><span>{isCopied ? 'Copied' : 'Copy Set ID'}</span>
							</button>
						</CopyToClipboard>
				</div>
				{/* <div
								className="help"
								tooltip-data="Copy a sample set id and paste it above to demo CryptoCount"
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
								</div> */}

				<div  className="setToggles13">
					<div className="words3">Contact Developers </div>
		
				<CopyToClipboard text={"henrik@ptbotech.org"} onCopy={() => setIsCopied2({isCopied2: true})}>
							<button className="words3"><span>{isCopied2 ? 'Copied' : 'Copy Email'}</span>
							</button>
						</CopyToClipboard>
				</div>
				{/* <div
								className="help"
								tooltip-data="Reachout to PTBO TECH team"
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
								</div> */}
				</div>
		
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
				<div style={{display: 'flex'}}>
				<div class="it" style={{marginRight: '-10vh'}}>
				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						How To Use
					</h2>
				</div>
				<a
				    className="download-link1"
				    href="/Blog"
				    target="_blank"
				    rel="noreferrer">
				    Tutorial
				    <img src="./logo.png" alt="chrome-web-store" />
				</a>

			
           			
				
				
				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						Social Channels
					</h2>
				</div>
				<a
						href="https://github.com/PortalToBlockchainOrganization"
						target="_blank"
						rel="noreferrer"
						className="download-link1"
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
				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						Browser Extension
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
				{/* <div className='slideWrap'> */}
				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						Integrate CryptoCount
					</h2>
				</div>
				<a
					className="download-link1"
					href="https://www.ptbotech.org/client"
					target="_blank"
					rel="noreferrer"
				>
					PTBO TECH
					<img className="ptbo-link" src={ptbo} alt="ptbo" />
				</a>
				<div className="name-one-liner2">
					<h2 className="logo-tagline3">
						Open Source
					</h2>
				</div>
				<a
					className="download-link1"
					href="https://www.ptbotech.org/literature"
					target="_blank"
					rel="noreferrer"
				>
					Roadmap
					<img className="ptbo-link" src={apache} alt="apache" />
				</a>

				
				</div>
				<div class="it2">
					<div className="name-one-liner2">
						<div className="logo-tagline4">
							See expected Tezos staking return below 
							<div
								className="help"
								tooltip-data="Expected annual return around 6.5%, XTZ price to fiat random variable with expected normal distribution"
								>
								<HelpOutlineRoundedIcon
									className="helpIcon" />
								</div>
						</div>
						
					</div>
					
					<SliderComponent></SliderComponent>
					<div >
			<div className="bb2">
					<h2 className="logo-tagline5">
						Visit BakingBad for the latest status of Tezos Bakers:
					</h2>
				</div>
				<a className="bb3" rel="noreferrer" target="_blank" href="https://baking-bad.org"><img className="bb" src={BakingBad} alt="BB"></img></a>
			</div>
					</div>
					</div>
				{/* </div> */}
				{/* <VerticalModal2
					basisDate={basisDate}
					handleDateInput={handleDateInput}
					show={showModal2}
					modalPage={modalPage}
					setModalPage={setModalPage}
					onHide={() => {
						setShowModal2(false);
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
				/> */}
			
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
				<a
					href="portaltoblockchain.org"
					target="_blank"
					rel="noreferrer"
				>
					<img 
					className="t-logo" 
					src={ptbo} 
				alt="ptbo" />
				</a>
				<a
					href="coingecko.com"
					target="_blank"
					rel="noreferrer"
				>
					<img 
					className="t-logo" 
					src={coingecko} 
				alt="coingecko" />
				</a>
			</div>
		</div>
	</div>
	);
};

export default Landing;
