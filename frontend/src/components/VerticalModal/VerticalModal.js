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
// update quantiy realized to anal page
const VerticalModal = (props) => {
	const currencies = [
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
		"VEB",
		"UAH",
		"ARS",
	];

	const handleFiatUpdate = (e) => {
		props.updateFiat(e);
	};

	let modalData = !props.isContinuing
		? {
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
		  }
		: {
				title: "Enter a basis date",
				input: (
					<Form>
						<Form.Row className={classes.row}>
							<Col xs="auto">
								{props.isLoading ? (
									<Spinner
										animation="border"
										variant="danger"
									/>
								) : (
									<BasisDatePicker
										date={new Date(props.basisDate)}
										label="Basis date"
										handleDateInput={props.handleDateInput}
										cal={props.cal}
									/>
								)}
							</Col>
						</Form.Row>
					</Form>
				),
		  };

	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					{modalData.title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className={classes.body}>{modalData.input}</Modal.Body>
			<Modal.Footer>
				<Form onSubmit={props.setParams}>
					<Button
						className={classes.Button}
						variant="danger"
						onClick={
							props.isContinuing
								? props.setContinuing
								: props.onHide
						}
					>
						Back
					</Button>
					{!props.isContinuing ? (
						<Button
							className={classes.buttonNext}
							disabled={
								props.fiat !== "Select fiat currency"
									? ""
									: "disabled"
							}
							variant="outline-danger"
							onClick={props.setContinuing}
						>
							Next
						</Button>
					) : (
						<Button
							className={classes.buttonNext}
							variant="outline-danger"
							disabled={
								props.basisDate["basisDate"].length !== 0
									? null
									: "disabled"
							}
							type="submit"
						>
							Submit
						</Button>
					)}
				</Form>
			</Modal.Footer>
		</Modal>
	);
};

export default VerticalModal;
