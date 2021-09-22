import React, { useState } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import classes from "./ChangePassword.module.css";
const ChangePassword = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [canSubmit, setCanSubmit] = useState(false);

	React.useEffect(() => {
		if (
			currentPassword.length > 0 &&
			newPassword.length > 0 &&
			newPassword === confirmNewPassword
		) {
			setCanSubmit(true);
		} else {
			setCanSubmit(false);
		}
	}, [currentPassword, newPassword, confirmNewPassword]);
	const handleSubmit = (event) => {
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
		// setEmailSent(true);
		event.preventDefault();
	};
	return (
		<section className={classes.SignInWrapper}>
			<div className={classes.Form}>
				<h2>Change Password</h2>
				<Form>
					<FormGroup>
						<Form.Label>Current password</Form.Label>
						<FormControl
							className="mb-2"
							type="password"
							name="password"
							placeholder="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
						<Form.Label>New password</Form.Label>
						<FormControl
							className="mb-2"
							type="password"
							name="password"
							placeholder="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
						{newPassword !== confirmNewPassword && (
							<div className={classes.Mismatch}>
								Passwords do not match
							</div>
						)}
						<Form.Label>Re-enter new password</Form.Label>
						<FormControl
							className="mb-2"
							type="password"
							name="password"
							placeholder="password"
							value={confirmNewPassword}
							onChange={(e) =>
								setConfirmNewPassword(e.target.value)
							}
						/>
					</FormGroup>
					<FormGroup>
						<Button
							variant="danger"
							className="mt-2"
							type="submit"
							onClick={handleSubmit}
							disabled={!canSubmit}
						>
							Change password
						</Button>
					</FormGroup>
				</Form>
			</div>
		</section>
	);
};

export default ChangePassword;
