import React from "react";
import classes from "./ResetConfirmation.module.css";
const ResetConfirmation = ({ email }) => {
	return (
		<div className={classes.main}>
			<div className={classes.text}>
				Check your email for password reset details.
			</div>
			<div className={classes.email}>
				Email with reset instructions sent to{" "}
				<span className={classes.userEmail}>{email}</span>
			</div>
		</div>
	);
};

export default ResetConfirmation;
