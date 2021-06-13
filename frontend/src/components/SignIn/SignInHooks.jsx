import React, { useState } from "react";
import {
	Form,
	FormGroup,
	Row,
	Col,
	FormControl,
	Button,
} from "react-bootstrap";
import "./SignIn.css";

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
		<section className="container">
			<Col sm={{ offset: 2 }}>
				<h1>Sign in</h1>
			</Col>
			<Form>
				<FormGroup as={Row} controlId="formHorizontalEmail">
					<Col as={Form.Label} sm={2}>
						Email
					</Col>
					<Col sm={8}>
						<FormControl
							type="email"
							name="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Col>
				</FormGroup>
				<FormGroup as={Row} controlId="formHorizontalPassword">
					<Col as={Form.Label} sm={2}>
						Password
					</Col>
					<Col sm={8}>
						<FormControl
							type="password"
							name="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							variant="outline-danger"
							className="mt-3 m-3"
							type="submit"
							onClick={signIn}
						>
							Sign in
						</Button>
					</Col>
				</FormGroup>
				<FormGroup></FormGroup>
			</Form>
		</section>
	);
};

export default SignInHooks;
