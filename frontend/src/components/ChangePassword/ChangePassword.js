import React, { useState } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import classes from "./ChangePassword.module.css";
import { changePassword } from "../../api";
import ChangeConfirmation from "./ChangeConfirmation";

const ChangePassword = (props) => {
	console.log(props);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [canSubmit, setCanSubmit] = useState(false);
	const [error, setError] = useState(false);
	const [resetSuccessful, setResetSuccessful] = useState(false);

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

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await changePassword({
				email: props.email,
				password: currentPassword,
				new_password: newPassword,
			});
			if (res.status === 200) {
				setResetSuccessful(true);
			}
		} catch (error) {
			console.log(error);
			setError(true);
		}
		// setEmailSent(true);
		event.preventDefault();
	};

	if (resetSuccessful) {
		return <ChangeConfirmation />;
	}

	return (
		<section className={classes.SignInWrapper}>
			<div className={classes.Form}>
				<h2>Change Password</h2>
				<Form>
					<FormGroup>
						{error && (
							<div className={classes.Mismatch}>
								Incorrect password entered
							</div>
						)}
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
