import React, { useState } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import ResetConfirmation from "./ResetConfirmation";
import classes from "./ResetPassword.module.css";
import { forgotPassword } from "../../api";
const ResetPassword = (props) => {
	const [email, setEmail] = useState("");
	const [emailSent, setEmailSent] = useState(false);

	let handleSubmit = async (event) => {
		console.log(email);
		event.preventDefault();
		try {
			const res = await forgotPassword({ email: email });
			if (res.status === 200) {
				setEmailSent(true);
			}
		} catch (error) {
			console.log(error);
			return;
		}
	};
	if (emailSent) {
		return <ResetConfirmation email={email} />;
	}
	return (
		<section className={classes.SignInWrapper}>
			<div className={classes.Form}>
				<h2 className={classes.the}>Forgot password</h2>
				<Form>
					<FormGroup>
						<Form.Label className={classes.the}>Email</Form.Label>
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
