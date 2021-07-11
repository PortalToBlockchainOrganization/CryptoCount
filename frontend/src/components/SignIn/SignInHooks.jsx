import React, { useState } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import classes from "./SignIn.module.css";

const SignInHooks = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	let signIn = (event) => {
		props.signIn({ email, password }, () => {
			if (props.user._id !== null) {
				props.history.push("/history");
				if (props.location.state.from !== undefined) {
					props.history.push(props.location.state.from);
				}

				if (props.params.address) {
					props.analPost(props.params);
				}
			}
		});
		event.preventDefault();
	};

	return (
		<section className={classes.SignInWrapper}>
			<div className={classes.Form}>
				<h2>Sign in</h2>
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
						<Form.Label>Password</Form.Label>
						<FormControl
							type="password"
							name="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							variant="danger"
							className="mt-4"
							type="submit"
							onClick={signIn}
						>
							Sign in
						</Button>
						<p className="mt-4">
							Need an account?{" "}
							<a
								className={classes.RegisterLink}
								href="/register"
							>
								Register Here
							</a>
						</p>
					</FormGroup>
				</Form>
			</div>
		</section>
	);
};

export default SignInHooks;
