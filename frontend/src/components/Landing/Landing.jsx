import React from "react";
import { Form, Button, OverlayTrigger, Tooltip, Popover } from "react-bootstrap";
import VerticalModal from "../VerticalModal/VerticalModal";
import "./Landing.css";
import tezos from "../../Assets/Orgs/Tezos.png";
import tzkt from "../../Assets/Orgs/tzkt.png";
import tezosFoundation from "../../Assets/Orgs/TezosFoundation.png";
import ptbo from "../../Assets/Orgs/ptbo.png";
import lottie from "lottie-web";
import womenThinking from "../../Assets/womenThinking.json";
import womenComputer from "../../Assets/womenComputer.json";
import womenSigning from "../../Assets/womenSigning.json";
import chrome from "../../Assets/chrome.svg";
import firefox from "../../Assets/firefox.svg";
import {Link} from "react-router-dom";
import bb from "../../Assets/bb.png";

const Landing = (props) => {
	// Begin POST data states
	const [addrs, setAddrs] = React.useState({ delAddrs: "" });
	const [basisDate, setBasisDate] = React.useState({ basisDate: "" });
	const [fiat, setFiat] = React.useState("Select fiat currency");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [showModal, setShowModal] = React.useState(false);
	const [modalPage, setModalPage] = React.useState(0);
	const [selectedAnalysisType, setSelectedAnalysisType] = React.useState();
	const [isLoading, setLoadingState] = React.useState(false);

	const handleDelegationSubmit = () => {
		setShowModal(true);
	};

	const handleDelegationChange = (e) => {
		setAddrs({ delAddrs: e.target.value });
	};

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
		};

		if (selectedAnalysisType === "auto") {
			props.setParams({
				fiat: params["fiat"],
				address: params["address"],
			});
			props.autoUnrealized(
				{
					fiat: params["fiat"],
					address: params["address"],
				},
				() => {
					props.history.push("/analysis");
				}
			);
		} else {
			props.setParams(params);
			if (props.signedIn()) {
				props.analPost(params, () => {
					props.history.push("/analysis");
				});
			}
		}
		props.history.push("/analysis");
		setShowModal(false);
		e.preventDefault();
	};

	const getCalendar = (e) => {
		let params = { address: addrs["delAddrs"], fiat: fiat };
		setLoadingState(true);
		props.setParams(params);
		props.getCalendarData(params, setLoadingState);
	};

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
						<img className="logo" src="./logo.png" alt="logo" />
					</div>
				</section>
				<br />
				<br />
				<div className="name-one-liner">
					<h1 className="logo-name">CryptoCount</h1>
				</div>
				<div className="name-one-liner">
					<h2 className="logo-tagline">Generate block reward income statements.</h2>
				</div>
				<div className="form">
					<Form onSubmit={handleSignIn}>
						{props.signedIn() ? (
							<Form.Group controlId="formBasicEmail">
								<Form.Label>
									Paste Your Delegation Address
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Tezos Delegation Address"
									onChange={handleDelegationChange}
								/>
							</Form.Group>
						) : null}
						{props.signedIn() ? null : (
							<Form.Group>
								<div className="mb-3">
								Sign In or Register <Link to="/register">Here!</Link>
								</div>
								<Form.Control
									type="email"
									autoComplete="email"
									placeholder="email address"
									onChange={handleEmailChange}
								/>
								<Form.Control
									className="password"
									type="password"
									placeholder="password"
									onChange={handlePasswordChange}
								/>
							</Form.Group>
						)}
						{props.signedIn() ? null : (
							<Button
								disabled={email.length > 0 ? "" : "disabled"}
								variant="danger"
								block
								type="submit"
							>
								Sign in
							</Button>
						)}
						<Button
							className="button-continue"
							disabled={
								addrs["delAddrs"].length > 0 ? "" : "disabled"
							}
							variant="outline-danger"
							background-color="green"
							block
							onClick={handleDelegationSubmit}
						>
							Skip Sign In
						</Button>

						
					</Form>
				</div>
                <div className="name-one-liner">
                    <h2 className="logo-tagline2">Interested in Staking? Visit Baking Bad for the latest Tezos Delegator information.</h2>
                </div>
                <a
                    className="download-link1"
                    href="https://baking-bad.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Baking-Bad
                    <img src={bb} alt="chrome-web-store" />
                </a>

				<div className="name-one-liner">
					<h2 className="logo-tagline2">Download the browser extension for easy annual block reward realizations.</h2>
				</div>
				<a
					className="download-link1"
					href="https://chrome.google.com/webstore/detail/cryptocount/bkcakdddagaipncnpoehneegdlhdlmjf"
					target="_blank"
					rel="noreferrer"
				>
					Download for Chrome (ALPHA)
					<img src={chrome} alt="chrome-web-store" />
				</a>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                          <Popover.Title as="h3">
                          In Development
                          </Popover.Title>
                        </Popover>
                      )} >
                    <a
                        id='firefox-link'
                        className="download-link"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Download for FireFox{" "}
                        <img src={firefox} alt="firefox-add-on" />
                    </a>
                </OverlayTrigger>
				<a
					className="download-link"
					href="https://www.portaltoblockchain.org/"
					target="_blank"
					rel="noreferrer"
				>
					Developer Hub
					<img className="ptbo-link" src={ptbo} alt="ptbo" />
				</a>
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
					updateFiat={setFiat}
					setParams={setParams}
					cal={props.cal}
					selectedAnalysisType={selectedAnalysisType}
					setSelectedAnalysisType={setSelectedAnalysisType}
					getCalendar={getCalendar}
				/>
			</div>
			{!props.signedIn() ? (
				<div className="tutorial">
					<div className="p-gif">
						<div className="animation" id="women-thinking" />
						<div className="text">
							<h2>Count Before You Sell.</h2>
							<p>
								If I sell block rewards, what do I report for income?
							</p>
						</div>
					</div>
					<div className="p-gif">
						<p className="text">
							Get an official statement of block reward income
							calculated by CryptoCount.{" "}
							<br />
							<br />
						</p>
						<div className="animation" id="women-computer" />
					</div>
					<div className="p-gif">
						<div className="animation" id="women-signing" />
						<p className="text">
							Report your economically fair income to your
							countries' internal revenue service.
						</p>
					</div>
				</div>
			) : null}
			<div className="poweredBy">
				Powered by
				<a href="https://tezos.com/" target="_blank" rel="noreferrer">
					<img className="t-logo" src={tezos} alt="Tezos" />
				</a>
				<a
					href="https://baking-bad.org"
					target="_blank"
					rel="noreferrer"
				>
					<img className="t-logo" src={tzkt} alt="tzkt" />
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
	);
};

export default Landing;
