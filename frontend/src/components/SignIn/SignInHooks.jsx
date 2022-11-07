import React, { useState } from "react";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import classes from "./SignIn.module.css";
import { useEffect } from 'react'
// import google from "../../Assets/Orgs/google.png";

const SignInHooks = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");




	let signIn = (event, signedIn) => {
		props.signIn({ email, password }, () => {
			console.log("we signed in ")
			console.log(password)
			if (props.user._id !== null) {
				props.history.push("/");
			

				if (
					props.location.state &&
					props.location.state.from !== undefined
				) {
					props.history.push(props.location.state.from);
				} else {
					props.history.push("/");
				}

				if (props.params.address) {
					props.analPost(props.params);
				}
			}

		});
		//console.log(signedIn())
		if(props.user !== undefined){
					props.history.push("/history")
				}
		event.preventDefault();
		//props.history.push("/history")
	};
	useEffect(()=>{

		if(props.user.email !== undefined){
			props.history.push("/history")
		}
		
	}, [props])
	

	let signInWithGoogle = (event) => {
		props.signInWithGoogle({ }, () => {
			console.log("back from action")
			if (props.user._id !== null) {
				// props.history.push("/history");
				if (
					props.location.state &&
					props.location.state.from !== undefined
				) {
					props.history.push(props.location.state.from);
				} else {
					props.history.push("/History");
				}

				// if (props.params.address) {
				// 	props.analPost(props.params);
				// }
			}
		});
		event.preventDefault();
	};

	return (
		<section className={classes.SignInWrapper}>
			<div className={classes.Form}>
				<div className={classes.heat}>Sign in</div>
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
						<div className={classes.wrap}>
						<Button
							variant="danger"
							className={classes.button}
							type="submit"
							onClick={signIn}
						>
							Sign in
						</Button>
						{/* <div className={classes.need}>Or</div> */}
						{/* <div className={classes.words}>Or</div>
						<br></br>
						
							
						<a href="https://cryptocount.co/api/auth/google"> <img className={classes.logo} src="./google.png" alt="google"></img></a> */}
						</div>
						
						<p className="mt-3">
							<a
								className={classes.RegisterLink}
								href="/reset-password"
							>
								Forgot password?
							</a>
						</p>
						<p className={classes.need}>
							New here?{" "}
							<a
								className={classes.RegisterLink}
								href="/register"
							>
								Register
							</a>
						</p>
					</FormGroup>
				</Form>
			</div>
		</section>
	);
};

export default SignInHooks;
