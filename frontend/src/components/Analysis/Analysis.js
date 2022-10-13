import { chartOptions } from "./chartJsOptions";
import React, { useEffect, useState } from "react";
import { getData } from "./ChartData";
import { useHistory, Link } from "react-router-dom";
import { Button, Spinner, Form, Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import classes from "./Analysis.module.css";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import jsPDF from "jspdf";
import TextTransition, { presets } from "react-text-transition";

/**
 * Component for the Analysis page. Renders a chart displaying realized,
 * unrealized, and realizing sets. Allows user to query for sets, realize,
 * and save.
 * @param {*} props
 * @returns
 */

const loadingTexts = ["Reading or updating your data from the Tezos blockchain.", "Assessing your assets", "Generating aggregated assessment."]



const Analysis = (props) => {
	const history = useHistory();
	const {
		params,
		set,
		getUnrealizedSet,
		//autoUnrealized,
		getRealizingSet,
		noAuthRealizingSet,
		deleteParams,
		getSet,
        saveRealizing,
        user,
		signedIn,
	} = props;
	// const [isLoading, setIsLoading] = useState(set["isLoading"])
	const [showModal, setShowModal] = useState(true);
	const [active, setActive] = useState("unrealizedBasisRewards");

	const [index, setIndex] = React.useState(0);

	React.useEffect(() => {
	  const intervalId = setInterval(() =>
		setIndex(index => index + 1),
		100000 // every 3 seconds
	  );
	  return () => clearTimeout(intervalId);
	}, []);

	const quantityRealize = React.createRef();

	useEffect((e)=>{
		setActive("unrealizedNativeFMVRewards")
		
		}, [])

	const updateChart = (setToRender) => {
		// update chart based on button press
		setCurrentSet(getData(setToRender, set, params, getUnrealizedSet));
		setActive(setToRender);
		
	};


	const numberWithCommas = (x) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const goHome = () => {
		/* remove redux params and send user back to home if they choose not
		to overwrite */
		deleteParams();
		setShowModal(false);
		history.push("/");
	};

	const overwrite = () => {
		/* if duplicate parameters, then get the set off set ID and update 
		the currentSet to the response of the api call
		*/
		setShowModal(false);
		getSet(set["dupId"]);
		setCurrentSet();
	};

	const handleRealizing = (e) => {
		/* if there is set data and quantityRealize is not 0 then allow API
		request to get Realized
		*/
		e.preventDefault();
		//console.log("asdf")

		if (set["data"]["objectId"] !== undefined && quantityRealize !== 0) {
			if (!signedIn()) {
				console.log("NOAUTH TRIGGERED");
				noAuthRealizingSet(
					set["data"]["objectId"],
					quantityRealize.current.value,
					updateChart
				);
			} else {
                console.log("NOAUTHSKIPPED")
				getRealizingSet(
					set["data"]["objectId"],
					quantityRealize.current.value,
					updateChart
				);
			}
		}
	};

	const handleSave = (e) => {
        console.log("saving");
		e.preventDefault();
		if (set["data"]["objectId"] !== undefined) {
			console.log("saving")
			saveRealizing(set["data"]["objectId"], set["data"]["aggregateRealizedNativeReward100p"]);
			// props.getHistory();
		}
	};

	

	
	



	//set["data"]["TezosPriceOnDateObjectGenerated"]
	// console.log(priceToday)
	// click handler
	const handle100 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0);
	};

	const handle25 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward25p"].toFixed(0);
	};

	const handle50 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward50p"].toFixed(0);
	};

	const handle75 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward75p"].toFixed(0);
	};


	const handleDownload = (e) => {
			e.preventDefault();

		var doc = new jsPDF()

		var myImage = require('./sixtyFourBitIMG')
		doc.setFontSize(18);
		doc.addImage(myImage, 'JPEG', 20, 25, 31, 23, 'PTBO Logo');
		doc.text("TEZOS NATIVE BLOCK REWARD INCOME", 54, 35)
		doc.setFontSize(12);
		doc.text("CALCUALTED BY CRYPTOCOUNT", 55, 40)
		doc.setFontSize(10)
		doc.text("Portal To Blockchain Organization (PTBO)", 55, 45)
		//doc.addImage(tezLogo, 'JPEG', 20, 25, 23, 23, 'Tezos Logo');
        doc.text("HOST BLOCKCHAIN: TEZOS " , 25, 60)
        doc.text("TEZOS DELEGATOR ADDRESS: " + set["data"]["address"], 25, 67)
        doc.text("FIAT: " + set["data"]["fiat"], 25, 74)
        var qRewSold = set["data"]["realizingRewardAgg"].toFixed(2)
        doc.text("PERIOD START: " + set["data"]["realizingRewards"][0]["date"], 25, 88);
        var last = set["data"]["realizingRewards"].length
        doc.text("PERIOD END: " + set["data"]["realizingRewards"][last - 1]["date"], 25, 95);
        doc.text("QUANTITY OF REWARDS SOLD: " + numberWithCommas(qRewSold) + " XTZ", 25, 109)
        doc.text("AVERAGE BASIS COST: " + set["data"]["basisPrice"].toFixed(2) + " " + set["data"]["fiat"], 25, 116)
        doc.text("TRUE REWARD INCOME: "+ numberWithCommas(currentSet["incomeToReport"].toFixed(2)) + " " + set["data"]["fiat"], 25, 123)
        //var doc = [props][pdfDocument]
        //doc.setFontSize(12)
        doc.text("CALCULATED ON BEHALF OF", 25, 137)

        doc.text("NAME: " + set["firstName"] + ' ' + set["lastName"], 25, 144)
        doc.text("EMAIL: " + set["email"], 25, 151)

		doc.save("TezosRewardIncomeStatement.pdf");
	};

	// current set data
	const [currentSet, setCurrentSet] = useState();

	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData(null, set, params, getUnrealizedSet));
	}, [set, params, getUnrealizedSet]);

	// chart js options
	const options = chartOptions(set, params.consensusRole);


	const backgrounds = {
		"Red": "#C62E2E",
		"Green": "#14A32A",
	}
	const space = {
		marginRight: "20px",
	}
	// load the fiat flag from directory
	// if (params.fiat === undefined) {
	// 	history.push("/");
	// 	return <div></div>;
	// }
	// let path = require(`../../Assets/Flags/${params.fiat}.PNG`);

	// const { register, setValue } = useForm();

	// if duplicate address detected show duplicate modal
	if (set?.dupId) {
		return (
			<Modal show={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>Duplicate Entry</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					It looks like you already have an existing object using
					these parameters. <br />
					<br />
					Do you want to continue and overwrite?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={goHome}>
						No
					</Button>
					<Button variant="outline-danger" onClick={overwrite}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	// otherwise if the set data exists render the graph
	return set !== null && set?.isLoading === false ? (
		<div className={classes.AnalysisWrapper}>
			<div className={classes.thetitle}> <a href="https://tezos.com"><img className={classes.logoAnalysis} src="./Tezos.png" alt="logo" /></a> x CryptoCount </div>
			<div className={classes.Chart}>
				<div className={classes.ChartWrapper}>
					<Bar data={currentSet} options={options} className={classes.canvas} />
					<div
						className={classes.help}
						tooltip-data="This chart shows your block rewards"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div>
				</div>
				{/* <div className={classes.ChartParams}>
					{/* <div>
						<div className={classes.Label}>Staking Basis: </div>
						<div className={classes.BarContainer}>
							<div className={classes.Bar}>
								{currentSet &&
								!isNaN(currentSet["realizingRatio"]) ? (
									<>
										<div
											className={classes.Realizing}
											style={{
												flex: currentSet
													? currentSet[
															"realzingRatio"
													  ]
													: null,
											}}
											tooltip-data={
												currentSet
													? `Realizing: ${(
															currentSet[
																"realizingRatio"
															] * 100
													  ).toFixed(2)}%`
													: null
											}
										>
											&nbsp;
										</div>
										<div
											className={classes.Unrealized}
											style={{
												flex: currentSet
													? 1 -
													  currentSet[
															"realizingRatio"
													  ] +
													  100
													: null,
											}}
											tooltip-data={
												currentSet
													? `Unrealized: ${(
															(1 -
																currentSet[
																	"realizingRatio"
																]) *
															100
													  ).toFixed(2)}%`
													: null
											}
										>
											&nbsp;
										</div>
									</>
								) : null}
							</div>
							<div
								className={classes.help}
								tooltip-data="This is a representation of your staking basis."
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div> */}
					{/* <div>
						{data !== undefined ? data.basisPrice.toFixed(2) : null}
					</div> */}
					{/* <div>
						<div className={classes.Label}>Avg Basis Cost: </div>
						{set?.data?.basisPrice &&
							set?.data?.basisPrice.toFixed(2)}{" "}
						{set?.data?.fiat} {/*{("   ", set["data"]?.fiat)} */}
					{/* </div>
					<div>
						<img
							className={classes.fiatImg}
							src={path.default}
							alt={props.fiat}
						/>
						{props.fiat}
					</div>
					<div
						className={classes.help}
						tooltip-data="The weighted average cost of additions to your staking basis"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div> */} 
				{/* </div> */}

				{set && set["isLoading"] ? (
					<div className={classes.setToggles}>
						<Spinner animation="border" variant="danger" />
					</div>
				) : (
				
					
					<div>

					<div>
							<div className={classes.space}>
								<div className={classes.the}>Accounting Set Selection</div>
								<div
									className={classes.help}
									tooltip-data="Select the accounting set you want to report. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
						
								
							</div>
				<div className={classes.setToggles}>		
						<div className={classes.basisSet}>
							<div className={classes.buttonAndInfo}>
								<Button
								// className = {classes.lastButtons}
									variant={
										active === "unrealizedNativeFMVRewards"
											? "primary"
											: "outline-primary"
									}
									onClick={() => {
										updateChart("unrealizedNativeFMVRewards");
									}}
								>
									FMV Set
								</Button>

								<div
									className={classes.help}
									tooltip-data="Rewards times the price of Tezos on the day it was received, no depletion."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div>
					
						<div className={classes.plus}>+</div>

							
							<div className={classes.buttonAndInfo}>
								<Button
								// className = {classes.lastButtons}
									variant={
										active === "unrealizedNativeSupplyDepletionRewards"
											? "primary"
											: "outline-primary"
									}
									onClick={() =>
										updateChart("unrealizedNativeSupplyDepletionRewards")
									}
								>
									Tez Native Supply Depletion
								</Button>
								<div
									className={classes.help}
									tooltip-data="Fair market value rewards with depletion by supply additions added to the entries."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
							<div className={classes.buttonAndInfo}>
								<Button
								// className = {classes.lastButtons}
									variant={
										active === "unrealizedNativeMarketDilutionRewards"
											? "primary"
											: "outline-primary"
									}
									onClick={() =>
										updateChart("unrealizedNativeMarketDilutionRewards")
									}
								>
									Tez Market Value Dilution
								</Button>
								<div
									className={classes.help}
									tooltip-data="Fair market value rewards with market value depletion added to the entries."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
					</div>

					{/* <div>
								<div className={classes.the}>Generation Station</div>
								<div
									className={classes.help}
									tooltip-data="Generate your assessment. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
						
								
							</div> */}
				

					</div>

					
							<div className={classes.space}>
								<div className={classes.the}>F. I. F. O. Station</div>
								<div
									className={classes.help}
									tooltip-data="Enter or select a quantity of native rewards you'd like to sell. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
						
								
							</div>
							<div className={classes.setToggles3}>
							<div className={classes.quantGroup}>

							
								<div className={classes.words}>Quantity</div>
								<div
									className={classes.help}
									tooltip-data="Select up to 100% of native rewards. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
								<Button
										variant="primary"
										onClick={handle25}
										className="buttonReward"
									>
										25%
								</Button>
								<Button
										variant="primary"
										onClick={handle50}
										className={classes.buttonReward}

									>
										50%
									</Button>
								<Button
										variant="primary"
										onClick={handle75}
										className={classes.buttonReward}
									>
										75%
									</Button>
									<Button
									className={classes.buttonReward}										variant="primary"
										onClick={handle100}
									>
										100%
									</Button>

							<div>
						<form className="form-inline cool-form">

						<div className="col-sm-4">
						<input className={classes.smallerInput} placeholder="XTZ" ref={quantityRealize}/>
						</div>
						</form>
						</div>	

							
						</div>
				
					
						{/* <div>
								<div className={classes.the}>Generation Station</div>
								<div
									className={classes.help}
									tooltip-data="Generate your assessment. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
						
								
							</div> */}
					<div className={classes.setToggles2}>	

					<div>	
						<Button className={classes.the} onClick={handleRealizing} variant="danger">
								Generate Income
							</Button>
							
					</div>	
					</div>	
						</div>
					</div>
						
							
					
				)}
			
				
{console.log(currentSet)}
			
				
			

				{set["data"]["aggregateRealizedNativeReward100p"] > 1 ? (
					<><div className={classes.space}>
						<div className={classes.the}>Income Station</div>
						<div
							className={classes.help}
							tooltip-data="Generate your assessment. "
						>
							<HelpOutlineRoundedIcon
								className={classes.helpIcon} />
						</div>


					</div>
					<div className={classes.setToggles3}>
					<div className={classes.the}>Point Of Sale Highlights</div>
						<div  className={classes.setTogglesX}>
							<div className={classes.wordGood}>Tez Price Today: </div>  <href className={classes.numberAlive}>{(set["data"]["TezosPriceOnDateObjectGenerated"])} {(set["data"]["fiat"])}</href>
							<div className={classes.wordGood}>Point of Sale Aggregate Value: </div> <href className={classes.numberAlive}>{(Math.round((set["data"]["pointOfSaleAggValue"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}</href>
							<div className={classes.wordGood}>Quantity:</div><href className={classes.numberAlive}>{(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}Tez</href>


							</div>

							<div className={classes.the}>Incomes:</div>
							<div  className={classes.setTogglesX}>
							<div className={classes.wordGood}>
								Fair Market Value (FMV):</div><div className={classes.numberAlive}>
								{(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {' '}{(set["data"]["fiat"])}</div>
							
							<div className= {classes.wordGood}>
								Supply Depletion:</div>
								<div className={classes.numberAlive}> {(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
							</div>
							<div className={classes.wordGood}>
								Market Dilution:</div>
								<div className={classes.numberAlive}> {(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
							</div>

							</div>
							<div className={classes.the}>Profit/Loss:</div>

							<div  className={classes.setTogglesX}>
							<div  className={classes.wordGood}>
								Fair Market Value (FMV): <div className={classes.diffs} style={{ fontSize: "1em",backgroundColor: set["data"]["netDiffFMV"] >=  0 ? backgrounds.Green: backgrounds.Red,
								}}>
								{(Math.round((set["data"]["netDiffFMV"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
									</div>
							</div>
							<div  className={classes.wordGood}>
								Tez Supply Depletion: <div className={classes.diffs}style={{ fontSize: "1em",
								backgroundColor: set["data"]["netDiffSupplyDepletion"] >  0 ? backgrounds.Green: backgrounds.Red,
								}}>
									{(Math.round((set["data"]["netDiffSupplyDepletion"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
									</div>
							</div>
							<div className={classes.wordGood}>
								Tez Market Value Dilution: <div className={classes.diffs} style={{ fontSize: "1em",backgroundColor: set["data"]["netDiffDilution"] >  0 ? backgrounds.Green : backgrounds.Red,
								}}>
									{(Math.round((set["data"]["netDiffDilution"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
									</div> 
							</div>

							</div>

							<div className={classes.the}>Assets' Basis Costs:</div>
<div  className={classes.setTogglesX}>
							<div  className={classes.wordGood}>
								Average Basis Investment Cost: <div className={classes.diffs} style={{ fontSize: "1em",
								}}>
								{(Math.round((set["data"]["weightedAverageTotalDomainInvestmentCost"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
									</div>
							</div>
							

							</div>



							<div className={classes.the}>Asset Aggregation Period:</div>

							<div  className={classes.setToggles2}>
							<div className={classes.words}>
								 {(set["data"]["realizingDomainStartDate"])}
							</div>
							<div className={classes.words}>
								{(set["data"]["realizingDomainEndDate"])}
							</div>

							</div>
						

							{/* <div className={classes.quantGroup}>
								<div className={classes.buttonAndInfo}>
									{isNaN(currentSet["incomeToReport"])
										? "0.00"
										: numberWithCommas(
											currentSet["incomeToReport"].toFixed(2)
										).concat(" ", set["data"]?.fiat)}
									<div
										className={classes.help}
										tooltip-data="This is your fair reward income"
									>
										<HelpOutlineRoundedIcon
											className={classes.helpIcon} />
									</div>
								</div>
							</div> */}

						</div>
						<div className={classes.the}>MORE:</div>

							<div  className={classes.setToggles2}>
							<div className={classes.the}><button className={classes.lastButtons}>Download Statement</button><button className={classes.lastButtons} onClick={handleSave}>Save</button> 
							
							</div>

							</div>
							<div className={classes.the}>RETURN:</div>

							<div  className={classes.setToggles2}>
							<div className={classes.words}>
							
							SetId: <href className={classes.numberAlive2}>{(set["data"]["objectId"])}</href>Copy</div>

							</div></>
				) : null}
				{currentSet > 0 ? (
					<div className={classes.setToggles}>
						<Form.Label>Tax Period Start:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								{/* {console.log(currentSet)} */}
								{isNaN(currentSet["incomeToReport"]) ||
								set["data"]["realizingRewards"] === undefined
									? "N/A"
									: set["data"]["realizingRewards"][0][
											"date"
									  ]}
								<div
									className={classes.help}
									tooltip-data="This is the start of your income period"
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div>
						<div>
							<>Tax Period End:</>
						</div>
						{/* <div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								{isNaN(currentSet["incomeToReport"]) ||
								set["data"]["realizingRewards"] === undefined
									? "N/A"
									: set["data"]["realizingRewards"][
											set["data"]["realizingRewards"]
												.length - 1
									  ]["date"]}
								<div
									className={classes.help}
									tooltip-data="This is the end of your income period"
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div> */}
					</div>
				) : null}
			</div>
		</div>
	) : (
		<div className={classes.SpinnerWrapper}>
			<Spinner animation="border" variant="danger" />
			<br></br>
			<TextTransition
				className={classes.colorForLoad}
				text={ loadingTexts[index % loadingTexts.length] }
				springConfig={ presets.wobbly }
			/>
		</div>
	);
};

export default Analysis;
