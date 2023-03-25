import { chartOptions } from "./chartJsOptions";
import React, { useEffect, useState } from "react";
import { getData } from "./ChartData";
import { useHistory, Link } from "react-router-dom";
import { Button, Spinner, Form, Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import classes from "./Analysis02.module.css";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import jsPDF from "jspdf";
import TextTransition, { presets } from "react-text-transition";
import CopyToClipboard from "react-copy-to-clipboard"
import { CSVLink } from "react-csv";
import styled from 'styled-components';


/**
 * Component for the Analysis page. Renders a chart displaying realized,
 * unrealized, and realizing sets. Allows user to query for sets, realize,
 * and save.
 * @param {*} props
 * @returns
 */

const loadingTexts = ["Reading or updating data from Tezos net. Delegator data will load in about 10 seconds.", "Running multiple assessments for assets", "Generating aggregated interface."]



const Analysis = (props) => {
	const history = useHistory();
	console.log(props)
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
		umbrellaHolder,
	} = props;
	// const [isLoading, setIsLoading] = useState(set["isLoading"])
	const [showModal, setShowModal] = useState(true);
	const [active, setActive] = useState("unrealizedNativeFMVRewards");



	const [index, setIndex] = React.useState(0);
		// current set data
	const [currentSet, setCurrentSet] = useState();

	React.useEffect(() => {
	  const intervalId = setInterval(() =>
		setIndex(index => index + 1),
		50000 // every 3 seconds
	  );
	  return () => clearTimeout(intervalId);
	}, []);

	const quantityRealize = React.createRef([]);
	var quantityRealizeInForm = " XTZ"
	

	useEffect((e)=>{
		setActive("unrealizedNativeFMVRewards")
		
		}, [])
	
	//call use effect to get umbrellaholder
	// useEffect(()=>{
	// 	umbrellaHolder(set["data"]["umbrellaHolderId"])
	// }, [set, umbrellaHolder])
	const [umbrellaArray, setUmbrellaArray] = useState([])

	const getUmbrellaHolderComponent = ()=>{
		var umbrellaHolderId = set["data"]["umbrellaHolderId"]
		umbrellaHolder(umbrellaHolderId)
	// 	.then((value)=>{
	// 		setUmbrellaArray(value)
	// 	})
	// 	console.log(umbrellaArray)
	// 
	}

	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData(null, set, params, getUnrealizedSet));
	}, [set, params, getUnrealizedSet]);

	const updateChart1 = (setToRender) => {
		// update chart based on button press
		// console.log('updatechart data vals')
		// console.log(set)
		setCurrentSet(getData(setToRender, set, params, getUnrealizedSet));
		handleCSVDownload()
		//setActive(setToRender)
		console.log('done updating here')
		console.log(setToRender)
		// if(!setToRender){
		// 	setActive("unrealizedNativeFMVRewards")
		// }
		
	};


	const updateChart = (setToRender) => {
		// update chart based on button press
		// console.log('updatechart data vals')
		// console.log(set)
		setCurrentSet(getData(setToRender, set, params, getUnrealizedSet));
		setActive(setToRender)
		console.log('done updating here')
		console.log(setToRender)
		// if(!setToRender){
		// 	setActive("unrealizedNativeFMVRewards")
		// }
		
	};
	//console.log(setToRender)
	//setActive("unrealizedNativeFMVRewards")
	console.log(active)
	//updateChart("unrealizedNativeFMVRewards")


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

	const [oldSetId, setoldSetId] = useState('');


	const oldSetIdQuery = (id) => {
		// if (props.set["data"] !== undefined) {
		// 	props.resetSet();
		// }
		//e.preventDefault();
		console.log('query')

		console.log(set["data"]["objectId"])
		console.log(user._id)
		
		getSet(id,user._id);
			// () => {
			// 	props.history.push("/analysis");
			// }
		
		// props.history.push("/analysis");
		// setShowModal(false);
		//e.preventDefault();
	};

	//undo functionality
	const setIdQuery = (e) => {
		// if (props.set["data"] !== undefined) {
		// 	props.resetSet();
		// }
		console.log('query')

		console.log(set["data"]["objectId"])
		console.log(user._id)
		
		getSet(set["data"]["objectId"],user._id);
			// () => {
			// 	props.history.push("/analysis");
			// }
		
		// props.history.push("/analysis");
		// setShowModal(false);
		e.preventDefault();
	};

	const handleRealizing = (e) => {
		/* if there is set data and quantityRealize is not 0 then allow API
		request to get Realized
		*/
		e.preventDefault();
	
		if (set["data"]["objectId"] !== undefined && quantityRealize !== 0) {
			if(quantityRealize.current.value > 0){
				if (!signedIn()) {
					console.log("NOAUTH TRIGGERED");
					noAuthRealizingSet(
						set["data"]["objectId"],
						quantityRealize.current.value,
						updateChart1,
						
						
					);
				} else {
					console.log("NOAUTHSKIPPED")
					getRealizingSet(
						set["data"]["objectId"],
						quantityRealize.current.value,
						updateChart1,
						// console.log('ppoooo'),
						// setActive("unrealizedNativeFMVRewards")
						
					);
				}
			}
			
		}
	};

	const handleSave = (e) => {
        console.log("saving");
		// e.preventDefault();
		if (set["data"]["objectId"] !== undefined) {
			saveRealizing(
				set["data"]["objectId"], 
				set["data"]["aggregateRealizedNativeReward100p"],
				updateChart1,
				)

			// props.getHistory();
			
		}
	};

	
	const [isCopied, setIsCopied] = useState(false);

	
	
	// const [quantity100Value, setQuantity100Value] = React.useState()
	var quantity100Value = 0
	//var quantity100value = 0
	// const quantity100value = React.useRef(null);
	// const quantity75value = React.useRef(null);
	// const quantity50value = React.useRef(null);
	// const quantity25value = React.useRef(null);
	// React.useEffect(() => { 
	// 	quantity100value.current = set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0)
	// 	quantity75value.current = set["data"]["aggregateUnrealizedNativeReward75p"].toFixed(0)
	// 	quantity50value.current = set["data"]["aggregateUnrealizedNativeRewardp"].toFixed(0)
	// 	quantity25value.current = set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0)

	// });
	// eslint-disable-next-line no-const-assign
	//setQuantity100Value(set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0))

	var s = 0
	var quantity100 = 0
	const updateFIFO = function() {
		// quantity100Value = set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0)
		// console.log('set quantity')
		// console.log(quantity100Value)
		//handle100()
	
		s = 1
		quantity100 = set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0);
	
	}

	
	//set["data"]["TezosPriceOnDateObjectGenerated"]
	// console.log(priceToday)
	// click handler
	const handle100 = ( e/** DOM event, click */ ) => {
		// prevent page from refreshing
		e.preventDefault();
		// console.log(s)
		if(s > 0){
			//console.log('changy')
			quantityRealize.current.value = quantity100
		}else{
			//console.log('chaing 100000')
			quantityRealize.current.value = set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0);
		}
		
		//console.log(quantity100value)
		//setQuantity100Value(set["data"]["aggregateUnrealizedNativeReward100p"].toFixed(0))
		// quantityRealize is Ref
		
	};

	

	

	//make update after save
	const handle25 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();
		if(set["data"][""])
		console.log('popo')

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward25p"].toFixed(0);

		quantityRealizeInForm = quantityRealize.current.value.toString() + " XTZ"
		console.log(quantityRealizeInForm)
	};

	const handle50 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward50p"].toFixed(0);
	};
	const StyledTr = styled.tr`
	&.selected {
	  background-color: yellow;
	}
  `;
	const handle75 = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["aggregateUnrealizedNativeReward75p"].toFixed(0);
	};


	// {[
	// 	"LPOSBlockchain", "TezosStakingAddress",
	// 	"Fiat", "PeriodStart", 
	// 	"PeriodEnd", "QuantityofXTZRewardsSold",  
	// 	"AverageAssetBasisCost", "FairMarketValueNativeRewardIncome",
	// 	"SupplyDepletionNativeRewardIncome", "MarketDilutionNativeRewardIncome", 
	
	// ]},
	// [
	// 	"Tezos", `${set["data"]["walletAddress"]}`, `${set["data"]["fiat"]}`, `${set["data"]["realizingNativeRewards"][0]["date"]}`,
	// 	`${set["data"]["realizingNativeRewards"][last - 1]["date"]}`, `${(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 
	// 	`${set["data"]["weightedAverageTotalDomainInvestmentCost"].toFixed(2)}`, `${(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
	// 	`${(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, `${(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
	// ]
	// var csvData = [{ firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" }]
	// set["csv"] = csvData
	//var csvHeaders = []

function Table({ data, tableId }) {
	const [selectedRows, setSelectedRows] = useState([]);
  
	function handleRowClick(index) {
		console.log('in selection')
	  if (selectedRows.includes(index)) {
		setSelectedRows(selectedRows.filter(i => i !== index));
	  } else {
		setSelectedRows([...selectedRows, index]);
	  }
	  console.log(selectedRows)
	}
  
	return (
	  <table>
		<thead>
		  <tr>
			<th>Column 1</th>
			<th>Column 2</th>
		  </tr>
		</thead>
		<tbody>
		  {data.map((item, index) => (
			  <StyledTr
				key={index}
				onClick={() => handleRowClick(index)}
				className={selectedRows.includes(index) ? 'selected' : ''}
			  >
				<td>{item.column1}</td>
				<td>{item.column2}</td>
			  </StyledTr>
			)
		  )}
		</tbody>
	  </table>
	);
  }
	const [selectedRows1, setSelectedRows1] = useState([]);
  	const [selectedRows2, setSelectedRows2] = useState([]);

	function handleRowClick1(index) {
		setSelectedRows1(...selectedRows1, index)
		console.log(selectedRows1)
	}

	function handleRowClick2(index) {
		setSelectedRows2(...selectedRows2, index)
	}

	const [csvData, setCsvData] = useState([])

	const handleCSVDownload = () => {
		console.log('in datcsv ')
		var last = set["data"]["realizingNativeRewards"].length
		if(last !== 0){
			var csvDataReal = 
			[ [ 
					"LPOSBlockchain", "TezosStakingAddress",
					"Fiat", "PeriodStart", 
					"PeriodEnd", "QuantityofXTZRewardsSold",  
					"AverageAssetBasisCost", "FairMarketValueNativeRewardIncome",
					"SupplyDepletionNativeRewardIncome", "MarketDilutionNativeRewardIncome", 
			],
			[
				"Tezos", `${set["data"]["walletAddress"]}`, `${set["data"]["fiat"]}`, `${set["data"]["realizingNativeRewards"][0]["date"]}`,
				`${set["data"]["realizingNativeRewards"][last - 1]["date"]}`, `${(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 
				`${set["data"]["weightedAverageTotalDomainInvestmentCost"].toFixed(2)}`, `${(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
				`${(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, `${(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
			]]
		}
		else{
			last = set["data"]["realizedNativeRewards"].length
			csvDataReal = 
			[[ 
					"LPOSBlockchain", "TezosStakingAddress",
					"Fiat", "PeriodStart", 
					"PeriodEnd", "QuantityofXTZRewardsSold",  
					"AverageAssetBasisCost", "FairMarketValueNativeRewardIncome",
					"SupplyDepletionNativeRewardIncome", "MarketDilutionNativeRewardIncome", 
			],
			[
				"Tezos", `${set["data"]["walletAddress"]}`, `${set["data"]["fiat"]}`, `${set["data"]["realizedNativeRewards"][0]["date"]}`,
				`${set["data"]["realizedNativeRewards"][last - 1]["date"]}`, `${(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 
				`${set["data"]["weightedAverageTotalDomainInvestmentCost"].toFixed(2)}`, `${(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
				`${(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, `${(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
			]]
		}
		setCsvData(csvDataReal)
		// 	{userRealize: {blockchain:"Tezos"} , {TezosStakingAddress:`${set["data"]["walletAddress"]}`} },

		// ]
		// 		Fiat: `${set["data"]["fiat"]}`,PeriodStart: `${set["data"]["realizingNativeRewards"][0]["date"]}`, 
		// 		PeriodEnd:`${set["data"]["realizingNativeRewards"][last - 1]["date"]}`, QuantityofXTZRewardsSold:`${(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,  
		// 		AverageAssetBasisCost:`${set["data"]["weightedAverageTotalDomainInvestmentCost"].toFixed(2)}`, FairMarketValueNativeRewardIncome:`${(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
		// 		SupplyDepletionNativeRewardIncome:`${(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,MarketDilutionNativeRewardIncome:`${(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 
			
		// 	},{}
		// ]
		// 	// {LPOSBlockchain: "Tezos", TezosStakingAddress: `${set["data"]["walletAddress"]}`,
		// 	//  Fiat: `${set["data"]["fiat"]}`, PeriodStart: set["data"]["realizingNativeRewards"][0]["date"], 
		// 	//  PeriodEnd: set["data"]["realizingNativeRewards"][last - 1]["date"], QuantityofXTZRewardsSold: (Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 
		// 	//  AverageAssetBasisCost: set["data"]["weightedAverageTotalDomainInvestmentCost"].toFixed(2), FairMarketValueNativeRewardIncome: (Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
		// 	// SupplyDepletionNativeRewardIncome: (Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), MarketDilutionNativeRewardIncome: (Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") },
		// 	// ];
			console.log(csvData)

	}

	const handleDownload = (e) => {
			e.preventDefault();
		console.log('asdf')
		var doc = new jsPDF()
		console.log('l;jh')
		var myImage = require('./sixtyFourBitIMG').image
		doc.setFontSize(18);
		doc.addImage(myImage, 'JPEG', 20, 25, 31, 23, 'PTBO Logo');
		doc.text("TEZOS NATIVE BLOCK REWARD INCOME", 54, 35)
		doc.setFontSize(12);
		doc.text("CALCUALTED BY CRYPTOCOUNT", 55, 40)
		doc.setFontSize(10)
		doc.text("Portal To Blockchain Organization (PTBO)", 55, 45)
		//doc.addImage(tezLogo, 'JPEG', 20, 25, 23, 23, 'Tezos Logo');
        doc.text("PoS Protocol Blockchain: TEZOS " , 25, 60)
        doc.text("Tezos Delegator Address: " + set["data"]["walletAddress"], 25, 67)
        doc.text("Fiat: " + set["data"]["fiat"], 25, 74)
        var qRewSold = (Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        doc.text("Period Start: " + set["data"]["realizingNativeRewards"][0]["date"], 25, 88);
        var last = set["data"]["realizingNativeRewards"].length
        doc.text("Period End: " + set["data"]["realizingNativeRewards"][last - 1]["date"], 25, 95);
        doc.text("Quantity Of Rewards Sold: " + qRewSold + " XTZ", 25, 109)
        doc.text("Average Asset Basis Cost: " + set["data"]["weightedAverageTotalDomainInvestmentCost"].toFixed(2) + " " + set["data"]["fiat"], 25, 116)
        doc.text("Fair Market Value Native Reward Income: "+ (Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (set["data"]["fiat"]), 25, 123)
		doc.text("Supply Depletion Native Reward Income: "+ (Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+(set["data"]["fiat"]), 25, 130)
        doc.text("Market Dilution Native Reward Income: "+ (Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (set["data"]["fiat"]), 25, 137)

		//var doc = [props][pdfDocument]
        //doc.setFontSize(12)
        // doc.text("CALCULATED ON BEHALF OF", 25, 137)

        // doc.text("NAME: " + set["firstName"] + ' ' + set["lastName"], 25, 144)
        // doc.text("EMAIL: " + set["email"], 25, 151)

		doc.save("CryptoCountRealization.pdf");
	};

	const data1 = [
		{ column1: 'hello', column2: 'me' },
		{ column1: 'hello', column2: 'hello' },
		// ...
	  ];

	  const data2 = [
		{ column1: 'hello', column2: 'goodbye' },
		{ column1: 'goodbye', column2: 'goodbye' },
		// ...
	  ];

	// current set data
	//const [currentSet, setCurrentSet] = useState();
	



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
		// page wrap

		
		<div className={classes.AnalysisWrapper}>

			{/* title */}
			<div className={classes.thetitle}> <a href="https://tezos.com"><img className={classes.logoAnalysis} src="./Tezos.png" alt="logo" /></a> x CryptoCount 
			</div>

            <div style={{display: 'flex'}}>
			{/* new left hand wrap */}
			{/* <div className={classes.leftWrap}> */}
            <div className={classes.left}>
	
		
			<div className={classes.the}>Your Tezos Staking Information</div>
			{/* client info */}
			<div  className={classes.setTogglesXY}>
				<div className={classes.wordGood}>
					Staking Address
				</div>
				<div className={classes.numberAlive3}>
				{(set["data"]["walletAddress"])}
				</div>
				<div className= {classes.wordGood}>
					Consensus Role
				</div>
				<div className={classes.numberAlive3}> {(set["data"]["consensusRole"])}
				</div>
				<div className={classes.wordGood}>
					Fiat
				</div>
				<div className={classes.numberAlive3}> {(set["data"]["fiat"])}
				</div>
			</div>

			<div className={classes.the}>Native Consensus Reward Accounting Entries</div>
			{/* chart  */}
			<div className={classes.ChartWrapper}>
			<Bar data={currentSet} options={options} className={classes.canvas} />
			<div
				className={classes.help2}
				tooltip-data="Native block rewards by value in fiat currency."
			>
			<HelpOutlineRoundedIcon className={classes.helpIcon2} />
			</div>
			</div>

			</div>

			{/* loading
			{set && set["isLoading"] ? (
				<div className={classes.setToggles}>
					<Spinner animation="border" variant="danger" />
				</div>
			) : ( */}

			{/* // parent after condition */}
			{/* <div> */}

			{/* new left hand wrap
			<div className={classes.leftWrap}>
			</div> */}


			{/* new right hand wrap */}
			{/* <div className={classes.rightWrap}> */}
            <div className={classes.right}>


			{/* fifo station title*/}
			<div className={classes.space}>
			<div className={classes.the}>F. I. F. O. Native Block Reward Mockup (Realizes Over Each Set)</div>
			<div
				className={classes.help}
				tooltip-data="Use the FIFO mockup tool to generate a block reward income statement."
			>
				<HelpOutlineRoundedIcon
					className={classes.helpIcon}
				/>
			</div>
			</div>

			{/* fifo selectors */}
			<div className={classes.quantGroup}>
            <div style={{display: "row"}}>
            <div style={{display: "flex"}}>
			<div className={classes.words}>Mockup XTZ Reward Quantity</div>
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
			<div className={classes.formLength}>
			<input className={classes.formLength} placeholder={quantityRealizeInForm} ref={quantityRealize}/>
			</div>
			</form>
			</div>	
			<div>XTZ

            </div>
            </div>
            <div>
           
            {/* fifo selctors buttons */}
			<div className={classes.buttWrap}>		
			<Button className={classes.the2} onClick={handleRealizing} block variant="success">
					Generate Asset Income Assessment
			</Button>
			<Button
				className={classes.the7}
				// disabled={
				// 	setId["setId"].length > 0 ? "" : "disabled"
				// }
				variant="danger"
				block
				onClick={setIdQuery}
			>
				Undo Realization
			</Button>
			<div
			className={classes.help}
			tooltip-data="Undo will not undo a Saved realization, only assets in the Realizing state (CC 0.2.2 Spec)"
			>
			<HelpOutlineRoundedIcon className={classes.helpIcon} />
			</div>	
			</div>	
            </div>
			</div>

            </div>
			


			{/* toggle chart */}
			<div>
				<div className={classes.space2}>
					<div className={classes.the}>Toggle Chart Accounting Set</div>
					<div
						className={classes.help}
						tooltip-data="View one of three accounting sets"
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
								XTZ FMV Set
							</Button>

							<div
								className={classes.help}
								tooltip-data="Rewards by the price of Tezos in fiat on the day received."
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
								XTZ Native Supply Depletion
							</Button>
							<div
								className={classes.help}
								tooltip-data="Rewards by the price of Tezos in fiat on the day recieved with depletion by supply growth added."
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
								XTZ Market Value Dilution
							</Button>
							<div
								className={classes.help}
								tooltip-data="Rewards by the price of Tezos in fiat on the day recieved with dilution by market growth added."
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
				</div>
			</div>

			</div>

            </div>


			{/* umbrella holder */}
			<div className={classes.umbrellaWrap}>
				<Button className={classes.buttonAndInfo3} onClick={getUmbrellaHolderComponent}>List Saved States</Button>
					<div className={classes.buttonAndInfo}>
						{console.log(set["umbrellaHolder"])}
						<div>
							{set["umbrellaHolder"] ? 
								set["umbrellaHolder"].map((umbrellaId, index) => ( 
								<div>
									<li className={classes.listOfIds}>{umbrellaId.id}<Button className={classes.buttonAndInfo2}onClick={()=>{oldSetIdQuery(umbrellaId.id)}}>Retreive State</Button></li>
									
								</div>
							))  : null}
							
							
							</div>
					</div>
			</div>

			{set["data"]["aggregateRealizedNativeReward100p"] > 1 ? (

			<><div className={classes.space5}>



			{/* income metrics section title */}
			<div className={classes.the76}>Your Tezos Block Reward Income Metrics</div>
			<div
					className={classes.help}
					tooltip-data="A full breakdown of realization."
			>
			<HelpOutlineRoundedIcon
				className={classes.helpIcon} />
			</div>




			</div>

			<div className={classes.setToggles3}>


				<div className={classes.dipo}>




			{/* point of sale title */}
			<div className={classes.the15}>Point Of Sale Highlights</div>
			<div
				className={classes.help}
				tooltip-data="Price of Tezos today, value of realization today, and quantity of realization."
				>
				<HelpOutlineRoundedIcon
					className={classes.helpIcon} />
			</div>



				</div>

				<div  className={classes.setTogglesX}>



			{/* point of sale metrics */}
			<div className={classes.wordGood}>XTZ Price Today: </div>  <href className={classes.numberAlive}>{(set["data"]["TezosPriceOnDateObjectGenerated"])} {(set["data"]["fiat"])}</href>
			<div className={classes.wordGood}>Point of Sale Aggregate Value: </div> <href className={classes.numberAlive}>{(Math.round((set["data"]["pointOfSaleAggValue"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}</href>
			<div className={classes.wordGood}>Quantity:</div><href className={classes.numberAlive}>{(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}XTZ</href>


				</div>


					<div className={classes.dipo}>

			{/* income title */}
			<div className={classes.the15}>Incomes:</div>
			<div
			className={classes.help}
			tooltip-data="The incomes generated from the three accounting sets."
			>
			<HelpOutlineRoundedIcon
				className={classes.helpIcon} />
			</div>


					</div>



					
			{/* incomes  */}
			<div  className={classes.setTogglesX}>
			<div className={classes.wordGood}>
				Fair Market Value (FMV):
			</div>
			<div className={classes.numberAlive}>
				{(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {' '}{(set["data"]["fiat"])}
			</div>
			<div className= {classes.wordGood}>
				Supply Depletion:
			</div>
			<div className={classes.numberAlive}> 
			{(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
			</div>
			<div className={classes.wordGood}>
				Market Dilution:
			</div>
			<div className={classes.numberAlive}> 
			{(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
			</div>
			</div>




					<div className={classes.dipo}>




			{/* profit loss diffs title */}
			<div className={classes.the15}>Profit/Loss:</div>
			<div
				className={classes.help}
				tooltip-data="The profit/loss margin between the point of sale value and the reportable incomes."
				>
			<HelpOutlineRoundedIcon
					className={classes.helpIcon} />
			</div>
			</div>
					



					<div  className={classes.setTogglesX}>



			{/* fmv diff  */}
			<div  className={classes.wordGood}>
				Fair Market Value (FMV): 
			<div className={classes.diffs} style={{ fontSize: "1em",backgroundColor: set["data"]["netDiffFMV"] >=  0 ? backgrounds.Green: backgrounds.Red,
				}}>
			{(Math.round((set["data"]["netDiffFMV"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
			</div>
			</div>




			{/* supply diff */}
			<div  className={classes.wordGood}>
				XTZ Supply Depletion: 
			<div className={classes.diffs}style={{ fontSize: "1em",
				backgroundColor: set["data"]["netDiffSupplyDepletion"] >  0 ? backgrounds.Green: backgrounds.Red,
				}}>
				{(Math.round((set["data"]["netDiffSupplyDepletion"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
			</div>
			</div>




			{/* market diff */}
			<div className={classes.wordGood}>
				XTZ Market Value Dilution: 
			<div className={classes.diffs} style={{ fontSize: "1em",backgroundColor: set["data"]["netDiffDilution"] >  0 ? backgrounds.Green : backgrounds.Red,
				}}>
				{(Math.round((set["data"]["netDiffDilution"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
			</div> 
			</div>




					</div>

					<div className={classes.dipo}>



			{/* basis cost title */}
			<div className={classes.the15}>Assets' Basis Costs:
			</div>
			<div
				className={classes.help}
				tooltip-data="The assets being realized average investment cost."
				>
				<HelpOutlineRoundedIcon
					className={classes.helpIcon} />
			</div>
			</div>
					


				<div  className={classes.setTogglesX}>



			{/* basis cost  */}
			<div  className={classes.wordGood}>
				Avg Basis Investment Cost Per Asset (All Entries): 
			<div className={classes.numberAlive} style={{ fontSize: "1em",
				}}>
				{(Math.round((set["data"]["weightedAverageTotalDomainInvestmentCost"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
			</div>
			</div>
					




					</div>


					<div className={classes.dipo}>



			{/* aggregate period title */}
			<div className={classes.the15}>Asset Aggregation Period:
			</div>
			<div
				className={classes.help}
				tooltip-data="The date domain (inclusive) of realizing assets"
				>
				<HelpOutlineRoundedIcon
					className={classes.helpIcon} />
			</div>



					</div>
					

					<div  className={classes.setTogglesX}>





			{/* realizing domain */}
			<div className={classes.words2}>
					{(set["data"]["realizingDomainStartDate"])}
			</div>
			<div className={classes.words2}>
				{(set["data"]["realizingDomainEndDate"])}
			</div>


					</div>
					<div>
					




			{/* beta transaction tables */}
			{/* <Table data={data1} tableId='table1' handleRowClick={handleRowClick1} selectedRows={selectedRows1}/>
			<br></br>
			<Table data={data2} tableId='table2' handleRowClick={handleRowClick2} selectedRows={selectedRows2}/> */}


				</div>

					

				</div>

					{/* trash? */}
				{set["data"]["realizingNativeRewards"].length > 0 ?(
					<div className={classes.sticky2}>
					
					</div>
					
				): null}





			{/* action bar post realizing title */}
			<div className={classes.sticky}>
			<div className={classes.the}>REALIZING ASSET ACTIONS: 
			<div
				className={classes.help}
				tooltip-data="Download a pdf with the full asset income breakdown and/or save the asset realization to return to it later with updated unrealized entries."
				>
			<HelpOutlineRoundedIcon
						className={classes.helpIcon} />
			</div>
			<div className={classes.littlelogo2}>
			<img
			src="/logo.png"
			width="40"
			height="40"
			className="d-inline-block align-top"
			alt="React Bootstrap logo"
			/></div>
			</div>
					
						
						
			{/* action bar post realizing stuff */}
			<div  className={classes.setToggles12}>
			<div className={classes.the3}><button className={classes.lastButtons} onClick={handleDownload}>Download PDF</button><CSVLink className={classes.lastButtons}filename={"CryptoCountRealization.csv"} asyncOnClick={true} data={csvData}>Download CSV</CSVLink>;
			<button className={classes.lastButtons} onClick={handleSave}>Save</button> 			
			</div>	
			<div className={classes.words4}>SetId: </div>
			<href className={classes.numberAlive3} id="setId">{(set["data"]["objectId"])}</href>
			<CopyToClipboard text={(set["data"]["objectId"])}
					onCopy={() => setIsCopied({isCopied: true})}>
						<button className={classes.words4}><span>{isCopied ? 'Copied' : 'Copy'}</span>
						</button>
			</CopyToClipboard>
			</div>
					
					
					
			</div>
			</>
			) : null}


			{/* </div> */}

			{/* // )} */}

			






			{/* wrapper  */}
			{/* <div className={classes.Chart}> */}



			{/* chart  */}
			{/* <div className={classes.ChartWrapper}>
				<Bar data={currentSet} options={options} className={classes.canvas} />
				<div
					className={classes.help}
					tooltip-data="Native block rewards by value in fiat currency."
				>
					<HelpOutlineRoundedIcon className={classes.helpIcon} />
				</div>
			</div>
		 */}


			{/* loading */}
			{/* {set && set["isLoading"] ? ( */}
				 <div className={classes.setToggles}>
					<Spinner animation="border" variant="danger" />
					<div className={classes.words}>Waiting for command</div>
				 </div>
				 
			{/* ) : ( */}
					
					
					{/* <div>
						
					<div>
 */}


					{/* toggle chart */}
					{/* <div>
					<div className={classes.space}>
						<div className={classes.the}>Toggle Chart Accounting Set</div>
						<div
							className={classes.help}
							tooltip-data="View one of three accounting sets"
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
									XTZ FMV Set
								</Button>
								<div
									className={classes.help}
									tooltip-data="Rewards by the price of Tezos in fiat on the day received."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div> */}
					
						{/* <div className={classes.plus}>+</div>
							
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
									XTZ Native Supply Depletion
								</Button>
								<div
									className={classes.help}
									tooltip-data="Rewards by the price of Tezos in fiat on the day recieved with depletion by supply growth added."
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
									XTZ Market Value Dilution
								</Button>
								<div
									className={classes.help}
									tooltip-data="Rewards by the price of Tezos in fiat on the day recieved with dilution by market growth added."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
					</div>
					</div> */}





					{/* umbrella holder */}
					{/* <div>
						<Button className={classes.buttonAndInfo3} onClick={getUmbrellaHolderComponent}>List Saved States</Button>
							<div className={classes.buttonAndInfo}>
								{console.log(set["umbrellaHolder"])}
								<div>
									{set["umbrellaHolder"] ? 
										set["umbrellaHolder"].map((umbrellaId, index) => ( 
										<div>
											<li className={classes.listOfIds}>{umbrellaId.id}<Button className={classes.buttonAndInfo2}onClick={()=>{oldSetIdQuery(umbrellaId.id)}}>Retreive State</Button></li>
											
										</div>
									))  : null}
									
									
									</div>
							</div>
					</div> */}

					



					{/* </div> */}

					{/* fifo station title*/}
					{/* <div className={classes.space}>
					<div className={classes.the}>F. I. F. O. Native Block Reward Mockup</div>
					<div
						className={classes.help}
						tooltip-data="Enter or select a quantity of native rewards you'd like to sell. "
					>
						<HelpOutlineRoundedIcon
							className={classes.helpIcon}
						/>
					</div>
					</div>
					<div className={classes.setToggles3}> */}




					{/* fifo selectors */}
					{/* <div className={classes.quantGroup}>
						<div className={classes.words}>Reward Quantity</div>
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
						<div className="col-sm-4"> */}
						{/* <input className={classes.smallerInput} placeholder={quantityRealizeInForm} ref={quantityRealize}/> */}
						{/* </div>
						</form>
						</div>	
						<div>XTZ</div>
					</div> */}
				
					


					
					{/* <div className={classes.setToggles2}>	 */}



					{/* fifo selctors buttons */}
					{/* <div className={classes.buttWrap}>	
						<Button className={classes.the2} onClick={handleRealizing} block variant="success">
								Generate Asset Income Assessment
						</Button>
						<Button
							className={classes.the7}
							// disabled={
							// 	setId["setId"].length > 0 ? "" : "disabled"
							// }
							variant="danger"
							block
							onClick={setIdQuery}
						>
							Undo Realization
						</Button>
						<div
						className={classes.help}
						tooltip-data="Undo will not undo a Saved realization, only assets in the Realizing state (CC 0.2.2 Spec)"
						>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
						</div>	
					</div>	 */}



					{/* </div>	
					</div>
					</div> */}
						
							
					
				{/* )} */}

				{/* pre realize condition */}
				{set["data"]["aggregateRealizedNativeReward100p"] < 1 ?(

				
					<div className={classes.sticky6}> 



					{/* pre realizing bar */}
					<div className={classes.the}>MORE ACTIONS: 
					<div
							className={classes.help}
							tooltip-data="Copy the set ID to return to this set without making an account."
							>
							<HelpOutlineRoundedIcon
								className={classes.helpIcon} />
					</div>
					<div className={classes.littlelogo}><img
						src="/logo.png"
						width="40"
						height="40"
						className="d-inline-block align-top"
						alt="React Bootstrap logo"
					/></div>
					</div>
					<div  className={classes.setToggles13}>
					<div className={classes.words}>SetId: </div>
					<href className={classes.numberAlive2} id="setId">{(set["data"]["objectId"])}</href>
					<CopyToClipboard text={(set["data"]["objectId"])} onCopy={() => setIsCopied({isCopied: true})}>
						<button className={classes.words3}><span>{isCopied ? 'Copied' : 'Copy'}</span>
						</button>
					</CopyToClipboard>
					</div>



					</div> 
					

				): null}
			
				
{/* {console.log(currentSet)} */}
			
				
			

				{/* {set["data"]["aggregateRealizedNativeReward100p"] > 1 ? (
					<><div className={classes.space2}> */}



					{/* income metrics section title */}
					{/* <div className={classes.the}>Income Metrics</div>
					<div
							className={classes.help}
							tooltip-data="A full breakdown of realization."
					>
					<HelpOutlineRoundedIcon
						className={classes.helpIcon} />
					</div> */}
			



					{/* </div>
					<div className={classes.setToggles3}>
						<div className={classes.dipo}>
 */}



					{/* point of sale title */}
					{/* <div className={classes.the}>Point Of Sale Highlights</div>
					<div
						className={classes.help}
						tooltip-data="Price of Tezos today, value of realization today, and quantity of realization."
						>
						<HelpOutlineRoundedIcon
							className={classes.helpIcon} />
					</div>
						</div>
					
						<div  className={classes.setTogglesX}>
 */}


					{/* point of sale metrics */}
					{/* <div className={classes.wordGood}>Tez Price Today: </div>  <href className={classes.numberAlive}>{(set["data"]["TezosPriceOnDateObjectGenerated"])} {(set["data"]["fiat"])}</href>
					<div className={classes.wordGood}>Point of Sale Aggregate Value: </div> <href className={classes.numberAlive}>{(Math.round((set["data"]["pointOfSaleAggValue"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}</href>
					<div className={classes.wordGood}>Quantity:</div><href className={classes.numberAlive}>{(Math.round((set["data"]["aggregateRealizedNativeReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}Tez</href>
						</div>
							<div className={classes.dipo}> */}

					{/* income title */}
					{/* <div className={classes.the}>Incomes:</div>
					<div
					className={classes.help}
					tooltip-data="The incomes generated from the three accounting sets."
					>
					<HelpOutlineRoundedIcon
						className={classes.helpIcon} />
					</div>
							</div> */}



							
					{/* incomes  */}
					{/* <div  className={classes.setTogglesX}>
					<div className={classes.wordGood}>
						Fair Market Value (FMV):
					</div>
					<div className={classes.numberAlive}>
						{(Math.round((set["data"]["aggregateRealizedNativeFMVReward100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {' '}{(set["data"]["fiat"])}
					</div>
					<div className= {classes.wordGood}>
						Supply Depletion:
					</div>
					<div className={classes.numberAlive}> 
					{(Math.round((set["data"]["aggregateRealizedNativeSupplyDepletion100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
					</div>
					<div className={classes.wordGood}>
						Market Dilution:
					</div>
					<div className={classes.numberAlive}> 
					{(Math.round((set["data"]["aggregateRealizedNativeMarketDilution100p"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
					</div>
					</div> */}




							{/* <div className={classes.dipo}> */}




					{/* profit loss diffs title */}
					{/* <div className={classes.the}>Profit/Loss:</div>
					<div
						className={classes.help}
						tooltip-data="The profit/loss margin between the point of sale value and the reportable incomes."
						>
					<HelpOutlineRoundedIcon
							className={classes.helpIcon} />
					</div>
					</div>
							
							<div  className={classes.setTogglesX}>
 */}


					{/* fmv diff  */}
					{/* <div  className={classes.wordGood}>
						Fair Market Value (FMV): 
					<div className={classes.diffs} style={{ fontSize: "1em",backgroundColor: set["data"]["netDiffFMV"] >=  0 ? backgrounds.Green: backgrounds.Red,
						}}>
					{(Math.round((set["data"]["netDiffFMV"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
					</div>
					</div>
 */}



					{/* supply diff */}
					{/* <div  className={classes.wordGood}>
						Tez Supply Depletion: 
					<div className={classes.diffs}style={{ fontSize: "1em",
						backgroundColor: set["data"]["netDiffSupplyDepletion"] >  0 ? backgrounds.Green: backgrounds.Red,
						}}>
						{(Math.round((set["data"]["netDiffSupplyDepletion"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
					</div>
					</div>
 */}


					{/* market diff */}
					{/* <div className={classes.wordGood}>
						Tez Market Value Dilution: 
					<div className={classes.diffs} style={{ fontSize: "1em",backgroundColor: set["data"]["netDiffDilution"] >  0 ? backgrounds.Green : backgrounds.Red,
						}}>
						{(Math.round((set["data"]["netDiffDilution"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
					</div> 
					</div>
							</div>
							<div className={classes.dipo}>
 */}


					{/* basis cost title */}
					{/* <div className={classes.the}>Assets' Basis Costs:
					</div>
					<div
						className={classes.help}
						tooltip-data="The assets being realized average investment cost."
						>
						<HelpOutlineRoundedIcon
							className={classes.helpIcon} />
					</div>
					</div>
							
						<div  className={classes.setTogglesX}>
 */}


					{/* basis cost  */}
					{/* <div  className={classes.wordGood}>
						Avg Basis Investment Cost Per Asset (All Entries): 
					<div className={classes.numberAlive} style={{ fontSize: "1em",
						}}>
						{(Math.round((set["data"]["weightedAverageTotalDomainInvestmentCost"])*10)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{(set["data"]["fiat"])}
					</div>
					</div>
							
							</div>
							<div className={classes.dipo}>
 */}


					{/* aggregate period title */}
					{/* <div className={classes.the}>Asset Aggregation Period:
					</div>
					<div
						className={classes.help}
						tooltip-data="The date domain (inclusive) of realizing assets"
						>
						<HelpOutlineRoundedIcon
							className={classes.helpIcon} />
					</div>
							</div>
							
							<div  className={classes.setTogglesX}>
 */}


					{/* realizing domain */}
					{/* <div className={classes.words2}>
							{(set["data"]["realizingDomainStartDate"])}
					</div>
					<div className={classes.words2}>
						{(set["data"]["realizingDomainEndDate"])}
					</div>
							</div>
							<div>
							
 */}


					{/* beta transaction tables */}
					{/* <Table data={data1} tableId='table1' handleRowClick={handleRowClick1} selectedRows={selectedRows1}/>
					<br></br>
					<Table data={data2} tableId='table2' handleRowClick={handleRowClick2} selectedRows={selectedRows2}/>
						  </div>
							
						</div> */}

					





					{/* action bar post realizing title */}
					{/* <div className={classes.sticky}>
					<div className={classes.the}>REALIZING ASSET ACTIONS: 
					<div
						className={classes.help}
						tooltip-data="Download a pdf with the full asset income breakdown and/or save the asset realization to return to it later with updated unrealized entries."
						>
					<HelpOutlineRoundedIcon
								className={classes.helpIcon} />
					</div>
					<div className={classes.littlelogo2}>
					<img
					src="/logo.png"
					width="40"
					height="40"
					className="d-inline-block align-top"
					alt="React Bootstrap logo"
					/></div>
					</div> */}
							
								
								
					{/* action bar post realizing stuff */}
					{/* <div  className={classes.setToggles12}>
					<div className={classes.the3}><button className={classes.lastButtons} onClick={handleDownload}>Download PDF</button><CSVLink className={classes.lastButtons}filename={"CryptoCountRealization.csv"} asyncOnClick={true} data={csvData}>Download CSV</CSVLink>;
					<button className={classes.lastButtons} onClick={handleSave}>Save</button> 			
					</div>	
					<div className={classes.words4}>SetId: </div>
					<href className={classes.numberAlive3} id="setId">{(set["data"]["objectId"])}</href>
					<CopyToClipboard text={(set["data"]["objectId"])}
							onCopy={() => setIsCopied({isCopied: true})}>
								<button className={classes.words4}><span>{isCopied ? 'Copied' : 'Copy'}</span>
								</button>
					</CopyToClipboard>
					</div> */}
							
							
							
					{/* </div> */}
					{/* </>
				) : null} */}

			
			</div>
		// </div>
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
