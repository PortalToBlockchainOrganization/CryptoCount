import React from "react";
import { Dropdown } from "react-bootstrap";
import classes from "./dropdownconsensus.module.css";
/**
 * Custom dropdown element for fiat. Renders an image and str representation
 * of the fiat
 * @param {*} props
 * @param props.consensusRole - str representation of consensus role
 * @param props.path - path for consensus img
 * @returns Dropdown item for fiat selector
 */
const Dropdownconsensus = (props) => {
	return (
		<Dropdown.Item eventKey={props.consensusRole} className={classes.back}>
			<div className={classes.Item}>
				<img
					className={classes.Flag}
					src={props.path}
					alt={props.consensusRole}
				/>
				{props.consensusRole}
			</div>
		</Dropdown.Item>
	);
};

export default Dropdownconsensus;
