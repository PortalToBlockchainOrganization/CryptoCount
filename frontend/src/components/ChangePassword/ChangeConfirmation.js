import React from "react";
import classes from "./ChangeConfirmation.module.css";
const ChangeConfirmation = ({ email }) => {
	return (
		<div className={classes.main}>
			<div className={classes.text}>Password successfully reset</div>
		</div>
	);
};

export default ChangeConfirmation;
