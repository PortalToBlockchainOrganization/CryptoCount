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
		CryptoCount supplies tax optimized financial data to Tezos block reward delegators.				
                <br />
				<br />
		The website visualizes block rewards and generates income statements to users.	
		<br />
				<br />
                Statements are generated when a user selects a quantity of rewards to realize.
                <br />
				<br />
				Downloadable statements can be delivered to authorities for income tax reporting. 
                <br />
				<br />
				CryptoCount supports 40 countries and 1 blockchain. 
                <br />
				<br />
                The project supports data integration to an existing app. Pre-built react components and API documentation are located in the <a href="https://www.portaltoblockchain.org/about">Client Module</a> and <a href="https://www.portaltoblockchain.org/api">API</a> sections of this site. 
                <br />
				<br />
                The software was designed from economic literature authored by Sutherland and Landoni(2020), listed in the <a href="https://www.portaltoblockchain.org/literature">Academic Literature</a> section of this site. 
                <br />
				<br />
                Contact us <a href="https://www.portaltoblockchain.org">Here</a>. 
			</div>
		</div>
	);
};

export default About;
