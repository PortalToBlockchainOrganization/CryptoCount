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
		Welcome to CryptoCount V0.2. CryptoCount analyzes Tezos blockchain data to help Tezos delegators report their fair market value block reward tax income.				
                <br />
				<br />
		CryptoCount is a tool for passively tracking your Tezos assets' paralellel performance in the fiat world.  
		<br />
				<br />
				CryptoCount is 100% idempotent (read-only). CryptoCount will never: change the state of your Tezos address's related assets, ask for your private keys, or, any verifiable "KYC" information. 
				<br />
				<br />
				V0.3 will feature interfaces accounting for: capital gains generated from realizing your Tezos-native basis, Tezos-token conversion capital gains, token-based asset sale capital gains, and, fair market value tracking of Defi activities (Liquidity, Lending, Revenue Sharing).
				<br />
				<br />
                You can generate a statements by selecting a quantity of rewards to realize.
                <br />
				<br />
				The downloadable statements can be delivered to authorities for income tax reporting. 
                <br />
				<br />
				CryptoCount supports 40 countries and 1 the Tezos blockchain. 
                <br />
				<br />
                CryptoCount supports data integration to an existing app. Pre-built react components and API documentation are located in the <a href="https://www.portaltoblockchain.org/client">Integrate CryptoCount</a> and <a href="https://www.portaltoblockchain.org/api">API</a> sections of the PTBO website. 
                <br />
				<br />
                This software was derived from economic literature authored by Sutherland and Landoni(2020), listed in the <a href="https://www.portaltoblockchain.org/literature">Academic Literature</a> section of this site. 
                <br />
				<br />
                Contact us <a href="https://www.portaltoblockchain.org">Here</a>. 
			</div>
		</div>
	);
};

export default About;
