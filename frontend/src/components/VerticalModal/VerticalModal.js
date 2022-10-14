import React from "react";
import {
	Modal,
	Button,
	Form,
	DropdownButton,
	Col,
	Spinner,
} from "react-bootstrap";
import classes from "./VerticalModal.module.css";
import "./VerticalModal.css";
import BasisDatePicker from "../BasisDatePicker/BasisDatePicker";
import DropdownItem from "./DropdownItem/DropdownItem";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import Dropdownconsensus from "./DropDownConsensus/dropdownconsensus.js"
// update quantiy realized to anal page
const VerticalModal = (props) => {
	let currencies = [
		"CHF",
		"KRW",
		"HUF",
		"NOK",
		"IKR",
		"PKR",
		"AED",
		"ILS",
		"SEK",
		"SGD",
		"GBP",
		"BDT",
		"JPY",
		"DKK",
		"MYR",
		"HKD",
		"USD",
		"RUB",
		"BRL",
		"CLP",
		"PLN",
		"INR",
		"CZK",
		"CNY",
		"AUD",
		"MXN",
		"NGN",
		"EUR",
		"MMK",
		"ZAR",
		"TWD",
		"VND",
		"CAD",
		"NZD",
		"IDR",
		"TRY",
		"THB",
		"PHP",
		"VEF",
		"UAH",
		"ARS",
	];

	let consensusRole = ["Baker", "Delegator"]

	currencies.sort();

	const handleFiatUpdate = (e) => {
		props.updateFiat(e);
	};

	const handleConsensusRoleUpdate = (e) => {
		if(e === "Baker"){
			e = "Baker"
		}
		props.updateConsensus(e);
	}

	const nextPage = (e) => {
		let temp = props.modalPage + 1;
		if (temp === 2) {
			props.getCalendar(e);
		}
		props.setModalPage(temp);
		e.preventDefault();
	};

	const prevPage = () => {
		let temp = props.modalPage;
		props.setModalPage(temp - 1);
	};

	// array of modal pages
	let modalData = [
		{
			title: "Select Consensus Role: ",
			input: (
				<Form>
					<Form.Row className={classes.formRow}>
						<DropdownButton
							xs="auto"
							title={props.consensusRole}
							variant="outline-danger"
							onSelect={handleConsensusRoleUpdate}
						>
							{consensusRole.map((consensusRole, index) => {
								let path = require(`../../Assets/Roles/${consensusRole}.png`);
								return (
									<Dropdownconsensus
										class = {classes.back}
										key={index}
										consensusRole={consensusRole}
										path={path.default}
									/>
								);
							})}
						</DropdownButton>
					</Form.Row>
				</Form>
			),
		},
		{
			title: "Enter the fiat: ",
			input: (
				<Form>
					<Form.Row className={classes.formRow}>
						<DropdownButton
							xs="auto"
							title={props.fiat}
							variant="outline-danger"
							onSelect={handleFiatUpdate}
						>
							{currencies.map((currency, index) => {
								let path = require(`../../Assets/Flags/${currency}.PNG`);
								return (
									<DropdownItem
										class = {classes.back}
										key={index}
										currency={currency}
										path={path.default}
									/>
								);
							})}
						</DropdownButton>
					</Form.Row>
				</Form>
			),
		},
		// {
		// 	title: "Select an analysis type: ",
		// 	input: (
		// 		<Form>
		// 			<Form.Row>
		// 				<div className={classes.RadioInputs}>
		// 					<div className={classes.radioWrapper}>
		// 						<div className={classes.Radio}>
		// 							<input
		// 								type="radio"
		// 								id="auto"
		// 								name="m_or_a"
		// 								onChange={(e) =>
		// 									props.setSelectedAnalysisType(
		// 										e.target.id
		// 									)
		// 								}
		// 							/>
		// 							<label htmlFor="auto">Auto</label>
		// 						</div>
		// 						<div
		// 							className={classes.help}
		// 							tooltip-data="Calculates the weighted average of additions to your staking basis."
		// 						>
		// 							<HelpOutlineRoundedIcon
		// 								className={classes.helpIcon}
		// 							/>
		// 						</div>
		// 					</div>
		// 					<div className={classes.radioWrapper}>
		// 						<div className={classes.Radio}>
		// 							<input
		// 								type="radio"
		// 								id="manual"
		// 								name="m_or_a"
		// 								onChange={(e) =>
		// 									props.setSelectedAnalysisType(
		// 										e.target.id
		// 									)
		// 								}
		// 							/>
		// 							<label htmlFor="manual">Manual</label>
		// 						</div>
		// 						<div
		// 							className={classes.help}
		// 							tooltip-data="Manually select a day to count as your basis price."
		// 						>
		// 							<HelpOutlineRoundedIcon
		// 								className={classes.helpIcon}
		// 							/>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</Form.Row>
		// 		</Form>
		// 	),
		// },
		// {
		// 	title: "Enter a basis date",
		// 	input: (
		// 		<Form>
		// 			<Form.Row className={classes.row}>
		// 				<Col xs="auto">
		// 					{props.isLoading ? (
		// 						<Spinner animation="border" variant="danger" />
		// 					) : (
		// 						<BasisDatePicker
		// 							date={new Date(props.basisDate)}
		// 							label="Basis date"
		// 							handleDateInput={props.handleDateInput}
		// 							cal={props.cal}
		// 						/>
		// 					)}
		// 				</Col>
		// 			</Form.Row>
		// 		</Form>
		// 	),
		// },
	];

	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton className={classes.head}>
				<Modal.Title id="contained-modal-title-vcenter">
					{modalData[props.modalPage].title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className={classes.body}>
				{modalData[props.modalPage].input}
			</Modal.Body>
			<Modal.Footer className={classes.head}>
				<Form onSubmit={props.setParams}>
					<Button
						className={classes.Button}
						variant="danger"
						onClick={props.modalPage > 0 ? prevPage : props.onHide}
					>
						Back
					</Button>
					<Button
						className={classes.buttonNext}
						variant="outline-danger"
						disabled={
							props.modalPage === 1 ? "disabled" : null
							// props.basisDate["basisDate"] === "" &&
							// props.setSelectedAnalysisType === undefined
							// 	? "disabled"
							// 	: null
						}
						onClick={nextPage}
					>
						Next
					</Button>
					<Button
						className={classes.buttonNext}
						variant="outline-danger"
						disabled={
							props.modalPage === 0
								? "disabled"
								: null
						}
						type="submit"
					>
						Submit
					</Button>
				</Form>
			</Modal.Footer>
		</Modal>
	);
};

export default VerticalModal;
