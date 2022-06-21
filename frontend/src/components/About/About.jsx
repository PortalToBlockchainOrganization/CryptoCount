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
		CryptoCount 0.2 reads and analyzes the Tezos blockchain to help Tezonians report their fair tax income.				
                <br />
				<br />
		CryptoCount generates read-only tax accounting objects that track your Tezos assets. The object assesses your assets' paralellel performance in a selected fiat currency.  
		<br />
				<br />
				Realize your assets to get FMV aggregate asset income statements. Save realizations to return to the set later with updated unrealized activities.
				<br />
				<br />
				CryptoCount is 100% idempotent (read-only). CryptoCount will never: change the state of your Tezos address's related assets, ask for your private keys, or, any verifiable "KYC" information. 
				<br />
				<br />
				V 0.3 of CryptoCount (under development) supports tracking and realizing of native Tez capital gains, Tezos-based token capital gains, token-based asset capital gains, and FMV DeFi reward assessments (Liquidity, Lending, Revenue Sharing, etc.).
				<br />
				<br />
				Downloadable statements can be delivered to authorities for income tax reporting. 
                <br />
				<br />
				CryptoCount supports 40 countries and Tezonians.  
                <br />
				<br />
                CryptoCount supports data integration to an existing app. Pre-built react components and API documentation are located in the <a href="https://www.portaltoblockchain.org/client">Integrate CryptoCount</a> and <a href="https://www.portaltoblockchain.org/api">API</a> sections of the PTBO website. 
                <br />
				<br />
                This software was derived from economic literature authored by Sutherland and Landoni(2020), listed in the <a href="https://www.portaltoblockchain.org/literature">Academic Literature</a> section of this site. 
                <br />
				<br />
                Feel free to contact us <a href="https://www.portaltoblockchain.org">Here</a> or join our <a href="https://discord.gg/7rYEu5c32E">Discord</a>. 
			</div>
		</div>
	);
};

export default About;
