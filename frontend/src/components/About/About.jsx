import React from "react";
import classes from "./About.module.css";

const About = () => {
	return (
		<div className={classes.APIWrapper}>
			<div className={classes.API}>
            <h1 className={classes.Header}>
					About CryptoCount 	
					<hr className={classes.HR} />
				</h1>
                <br />
				<br />
                CryptoCount delivers income statements to block reward holders, offering an accounting interface for users to visualize their block rewards.
                <br />
				<br />
                The statements are generated when a user selects a quantity of rewards to realize.
                <br />
				<br />
                The downloadable statements can be delivered to authorities for tax reporting. 
                <br />
				<br />
                The CryptoCount project supports integration to an existing app. The one-click react component is in the <a href="https://www.portaltoblockchain.org/about">Client Module</a> section of the PTBO website. 
                <br />
				<br />
                CryptoCount currently supplies financial data and accounting services to Tezos block reward delegators.
                <br />
				<br />
                The software was designed from the literature by Sutherland and Landoni in the <a href="https://www.portaltoblockchain.org/literature">Academic Literature</a> section of the PTBO website. 
                <br />
				<br />
                CryptoCount currently supports 40 countries and 1 blockchain. 
                <br />
				<br />
                Contact us to if you want to supply feedback, need module integration assistance, or would like to have CryptoCount integrated into your blockchain. 
			</div>
		</div>
	);
};

export default About;