import React from "react";
import { Form, Button } from "react-bootstrap";
import VerticalModal from "../VerticalModal/VerticalModal";
import "./Landing.css";

const Landing = (props) => {
	// Begin POST data states
	const [addrs, setAddrs] = React.useState({ delAddrs: "" });
	const [basisDate, setBasisDate] = React.useState({ basisDate: "" });
	// const [quantityRealized, setQuant] = React.useState({ quant: 0 });
	const [fiat, setFiat] = React.useState("Select fiat currency");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [showModal, setShowModal] = React.useState(false);
	const [isContinuing, setContinuing] = React.useState(false);
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

		props.setParams(params);

		if (props.signedIn()) {
			props.analPost(params, () => {
				props.history.push("analysis");
			});
		}
		props.history.push("/analysis");
		setShowModal(false);
		e.preventDefault();
	};

	const goToCalendar = (e) => {
		let params = { address: addrs["delAddrs"], fiat: fiat };
		setContinuing(!isContinuing);
		if (!isContinuing) {
			setLoadingState(true);
			props.setParams(params);
			props.getCalendarData(params, setLoadingState);
		}
		e.preventDefault();
	};

	return (
		<div className="lp-container">
			<section className="static-wrapper">
				<div className="logo-container">
					<img className="logo" src="./logo.png" alt="logo" />
					<div className="name-one-liner">
						<h1 className="logo-name">CryptoCount</h1>
						<p>
							CryptoCount helps you report your realized staking
							reward income as a business entity. <br />
							<br />
							We help you calculate your income over a cost basis
							and depreciate your assets, or help you plan your
							staking decisions. <br />
							<br />
							You will save significant income using this tool.{" "}
							<br />
							<br />
							Select your blockchain, address, and a taxation
							period to begin.
						</p>
					</div>
				</div>
			</section>
			<div className="form">
				<Form onSubmit={handleSignIn}>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Enter Your Delegation Address</Form.Label>
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
				isContinuing={isContinuing}
				setContinuing={goToCalendar}
				onHide={() => {
					setShowModal(false);
					setContinuing(false);
				}}
				isLoading={isLoading}
				fiat={fiat}
				updateFiat={setFiat}
				setParams={setParams}
				cal={props.cal}
			/>
		</div>
	);
};

export default Landing;
