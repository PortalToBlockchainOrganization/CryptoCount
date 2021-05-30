import React from "react";
import { Dropdown } from "react-bootstrap";
import classes from "./DropdownItem.module.css";
const DropdownItem = (props) => {
	return (
		<Dropdown.Item eventKey={props.currency}>
			<div className={classes.Item}>
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
