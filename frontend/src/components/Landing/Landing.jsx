import React from "react";
import { Form, Button } from "react-bootstrap";
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
						<div className="name-one-liner">
							<h1 className="logo-name">CryptoCount</h1>
						</div>
					</div>
				</section>
				<div className="form">
					<Form onSubmit={handleSignIn}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>
								Enter Your Delegation Address
							</Form.Label>
							<Form.Control
								type="text"
								placeholder="Delegation Address"
								onChange={handleDelegationChange}
							/>
						</Form.Group>
						{props.signedIn() ? null : (
							<Form.Group>
								<div className="mb-3">
									Or Sign In To Your Account
								</div>
								<Form.Control
									type="email"
									placeholder="email@cryptocount.com"
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
					</Form>
				</div>
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
								If I want to sell some of my crypto rewards or
								its staking basis, what would I say for my
								taxes?
							</p>
						</div>
					</div>
					<div className="p-gif">
						<p className="text">
							Count your crypto rewards and basis with Crypto
							Count before you sell at an exchange. <br />
							<br />
						</p>
						<div className="animation" id="women-computer" />
					</div>
					<div className="p-gif">
						<div className="animation" id="women-signing" />
						<p className="text">
							Realize amounts of crypto in CryptoCount with your
							country's currency. Use CryptoCount's calculation of
							your economically fair income for your taxes.
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
				<a
					href="portaltoblockchain.org"
					target="_blank"
					rel="noreferrer"
				>
					<img className="t-logo" src={ptbo} alt="ptbo" />
				</a>
			</div>
		</div>
	);
};

export default Landing;
