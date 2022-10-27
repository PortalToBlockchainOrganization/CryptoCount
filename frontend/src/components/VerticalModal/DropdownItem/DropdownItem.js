import React from "react";
import { Dropdown } from "react-bootstrap";
import classes from "./DropdownItem.module.css";
/**
 * Custom dropdown element for fiat. Renders an image and str representation
 * of the fiat
 * @param {*} props
 * @param props.currency - str representation of fiat
 * @param props.path - path for fiat img
 * @returns Dropdown item for fiat selector
 */
const DropdownItem = (props) => {
	return (
		<Dropdown.Item eventKey={props.currency} className={classes.back}>
			<div className={classes.Item} >
				<img
					className={classes.Flag}
					src={props.path}
					alt={props.currency}
				/>
				{props.currency}
			</div>
		</Dropdown.Item>
	);
};

export default DropdownItem;
