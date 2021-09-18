import React, { useState } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import ResetConfirmation from "./ResetConfirmation";
import classes from "./ResetPassword.module.css";
const ResetPassword = (props) => {
	const [email, setEmail] = useState("");
	const [emailSent, setEmailSent] = useState(false);

	let handleSubmit = (event) => {
		console.log(email);
		// props.signIn({ email }, () => {
		// 	if (props.user._id !== null) {
		// 		props.history.push("/history");
		// 		if (
		// 			props.location.state &&
		// 			props.location.state.from !== undefined
		// 		) {
		// 			props.history.push(props.location.state.from);
		// 		}

		// 		if (props.params.address) {
		// 			props.analPost(props.params);
		// 		}
		// 	}
		// });
		setEmailSent(true);
		event.preventDefault();
	};
	if (emailSent) {
		return <ResetConfirmation email={email} />;
	}
	return (
		<section className={classes.SignInWrapper}>
			<div className={classes.Form}>
				<h2>Forgot password</h2>
				<Form>
					<FormGroup>
						<Form.Label>Email</Form.Label>
						<FormControl
							type="email"
							name="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FormGroup>
					<FormGroup>
						<Button
							variant="danger"
							className="mt-2"
							type="submit"
							onClick={handleSubmit}
						>
							Send email
						</Button>
					</FormGroup>
				</Form>
			</div>
		</section>
	);
};

export default ResetPassword;
