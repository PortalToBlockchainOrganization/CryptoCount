import React, { useState, useEffect } from "react";
import { Form, FormGroup, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import classes from "./Register.module.css";

// Functional component label plus control w/optional help message

const FieldGroup = function ({ id, label, help, ...props }) {
	return (
		<FormGroup controlId={id}>
			<Form.Label>{label}</Form.Label>
			<Form.Control {...props} />
			{help && <Form.Text className="text-muted">{help}</Form.Text>}
		</FormGroup>
	);
};

const RegisterHooks = (props) => {
	console.log("Rendering Register");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [termsAccepted, setTerms] = useState(true);
	// eslint-disable-next-line
	const [role, setRole] = useState(0);
	// const [offerSignIn, setOffer] = useState(false);
	const [enableBtn, setBtn] = useState(false);
    const [set, setSet] = useState(props.set)
	console.log(Object.keys(props?.set).length > 0);
	console.log(props.set);
	let submit = () => {
		const user = {
			firstName,
			lastName,
			email,
			password,
			termsAccepted,
			role,
        };
        
		props.register(user, () => {
			if (Object.keys(props?.set).length > 0) {
                props.history.push("/analysis");
                props.signIn({ email, password, set});
            }
            else{
                props.signIn({ email, password, undefined });
                props.history.push("/");
            }
		});
	};

	let toggleTerms = (e) => {
		setTerms(termsAccepted);
	};

	// let toggleTerms = (e) => {
	// 	setTerms(e.target.value);
	// };

	// let signIn = (body, cb) => {
	// 	props.signIn(body, cb);
	// };

	useEffect(() => {
		setBtn(
			email &&
				lastName &&
				password &&
				password === password2 &&
				termsAccepted
		);
	}, [email, lastName, password, password2, termsAccepted]);

	return (
		<div className={classes.RegisterWrapper}>
			<form className={classes.Form}>
				<FieldGroup
					id="email"
					type="email"
					label="Email"
					placeholder="email@cryptocount.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required={true}
				/>

				<FieldGroup
					id="firstName"
					type="text"
					label="First name"
					placeholder="First name"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>

				<FieldGroup
					id="lastName"
					type="text"
					label="Last name"
					placeholder="Last name"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required={true}
				/>

				<FieldGroup
					id="password"
					type="password"
					label="Password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required={true}
				/>

				<FieldGroup
					id="passwordTwo"
					type="password"
					label="Confirm password"
					placeholder="Confirm password"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					required={true}
					help="Repeat your password"
				/>

		
				
					
				
						<div>
							By selecting "Submit" you agree to the
							<Link to="/privacy"> terms and conditions</Link>.
							                 
						</div>
					
			
				{password !== password2 ? (
					<Alert className="mt-4" variant="warning">
						Passwords don't match
					</Alert>
				) : (
					""
				)}

				<Button
					variant="danger"
					className="mt-4"
					onClick={() => submit()}
					disabled={!enableBtn}
				>
					Submit
				</Button>
			</form>

			{/* <ConfDialog
				show={offerSignIn}
				title="Registration Success"
				body={`Would you like to log in as ${email}?`}
				buttons={["YES", "NO"]}
				onClose={(answer) => {
					setOffer(true);
					if (answer === "YES") {
						props.signIn({ email: email, password: password }, () =>
							props.history.push("/")
						);
					}
				}}
			/> */}
		</div>
	);
};

export default RegisterHooks;
