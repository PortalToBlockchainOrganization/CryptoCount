import React from "react";
import classes from "./blog.module.css";
import enter from "./blogassets/enter.png";
import api from "./blogassets/api.png";
import auto from "./blogassets/auto.png";
import brabrabra from "./blogassets/brabrabra.png";
import braReal from "./blogassets/braReal.png";
import depreciate from "./blogassets/depreciate.png";
import jacked from "./blogassets/jacked.png";
import saveReal from "./blogassets/saveReal.png";
import select from "./blogassets/Select.png";
import statement from "./blogassets/statement.png";

const blog = () => {
	return (
		<div className={classes.APIWrapper}>
			<h2>Updated: 6/6/2022</h2>
			<br></br>
			<h2>CryptoCount V 0.2.1</h2>
			<br></br>
			<div>
				Welcome to CryptoCount 0.2.1 Cryptocount sources pre-indexed
				blockchain data APIs for on-chain information about your Tezos
				address’ activities. Paste your delegation or baker address to
				generate your history object (baker analysis data pipeline in beta).
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img
					width="1000px"
					class="imgage"
					src={enter}
					alt="enter"
				></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Then, select the fiat currency you plan to offboard your Tezos assets
				into.
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="600px" width="700" src={select}></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Finally, select the auto or manual accounting method. Selecting
				manual opens a calendar which allows one to select a basis cost
				from a date to convert their Tez. (Note, manual
				method will be deprecated in 0.3.)
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="500px" width="700" src={auto}></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Your CryptoCount set history is being generated!
				<br></br>
				Once the object loads your page will look like this:
			</div>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="700px" width="750" src={jacked}></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Here you can see your block rewards by their date and fair
				market value (FMV) in the fiat currency you selected.
				<br></br>
				<br></br>
				You can alternate between observing the FMV of the rewards and
				two depreciation accounting sets currently in Beta.
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="600px" width="750" src={depreciate}></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Generate a FIFO realization by selecting Max Rewards or enter a
				quantity below that amount and select “Generate”.
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="600px" width="750" src={brabrabra}></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Observe your reward income and download the statement.
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="600px" width="750" src={braReal}></img>
			</div>
			<br></br>
			<br></br>

			<div className={classes.ImageWrapper}>
				<img height="600px" width="700" src={statement}></img>
			</div>

			<br></br>
			<br></br>
			<div>
				You can save your realization once you’ve created an account.
				Saving a realization is built for continuous passive realization of
				assets. With CryptoCount you can create a history of chained
				realizations over a period of years. A saved set will update
				with new entries whenever you return to analyze it.
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="600px" width="750" src={saveReal}></img>
			</div>
			<br></br>
			<br></br>
			<div>
				Are you a business that supports a system of layered Tezos
				baking/delegating? Use our analysis object generator{" "}
				<a href="https://portaltoblockchain.org/api">API</a> to retrieve
				reward fiat offboarding data for your users.{" "}
			</div>
			<br></br>
			<br></br>
			<div className={classes.ImageWrapper}>
				<img height="600px" width="1200" src={api}></img>
			</div>
			<br></br>
			<br></br>
		</div>
	);
};

export default blog;
