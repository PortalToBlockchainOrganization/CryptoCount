import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Spinner, Form, Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import classes from "./Analysis.module.css";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
/**
 * Component for the Analysis page. Renders a chart displaying realized,
 * unrealized, and realizing sets. Allows user to query for sets, realize,
 * and save.
 * @param {*} props
 * @returns
 */
const Analysis = (props) => {
	const history = useHistory();
	const fiatLabels = {
		AED: "United Arab Emirates Dirham",
		ARS: "Argentine Peso",
		AUD: "Australian Dollar",
		BDT: "Bangladeshi Taka",
		BRL: "Brazilian Real",
		CAD: "Canadian Dollar",
		CHF: "Swiss Franc",
		CLP: "Chilean Peso",
		CNY: "Chinese Yuan",
		CZK: "Czech Koruna",
		DKK: "Danish Krone",
		EUR: "Euro",
		GBP: "Pound sterling",
		HKD: "Hong Kong Dollar",
		HUF: "Hungarian Forint",
		IDR: "Indonesian Rupiah",
		IKR: "Icelandic Króna",
		ILS: "Israeli New Shekel",
		INR: "Indian Rupee",
		JPY: "Japanese Yen",
		KRW: "South Korean won",
		MMK: "Myanmar Kyat",
		MXN: "Mexican Peso",
		MYR: "Malaysian Ringgit",
		NGN: "Nigerian Naira",
		NOK: "Norwegian krone",
		NZD: "New Zealand Dollar",
		PHP: "Philippine peso",
		PKR: "Pakistani Rupee",
		PLN: "Poland złoty",
		RUB: "Russian Ruble",
		SEK: "Swedish Krona",
		SGD: "Singapore Dollar",
		THB: "Thai Baht",
		TRY: "Turkish lira",
		TWD: "New Taiwan dollar",
		UAH: "Ukrainian hryvnia",
		USD: "United States Dollar",
		VEB: "Venezuelan bolivar",
		VND: "Vietnamese dong",
		ZAR: "South African Rand",
	};
	const {
		params,
		set,
		getUnrealizedSet,
		getRealizingSet,
		deleteParams,
		getSet,
		saveRealizing,
	} = props;
	// const [isLoading, setIsLoading] = useState(set["isLoading"])
	const [showModal, setShowModal] = useState(true);

	const quantityRealize = React.createRef();

	const updateChart = (setToRender) => {
		// update chart based on button press
		setCurrentSet(getData(setToRender));
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
		if (set["data"]["_id"] !== undefined && quantityRealize !== 0) {
			getRealizingSet(
				set["data"]["_id"],
				quantityRealize.current.value,
				updateChart
			);
		}
	};

	const handleSave = (e) => {
		e.preventDefault();
		if (set["data"]["_id"] !== undefined) {
			saveRealizing(set["data"]["_id"]);
			// props.getHistory();
		}
	};

	const getData = useCallback(
		(setToRender) => {
			// get the last date from realizing set
			// const getMaxDate = (key) => {
			// 	// default returns realizingBasisReward max date
			// 	if (!key) {
			// 		key = "realizingRewardBasis";
			// 	}
			// 	if (set["data"] !== undefined) {
			// 		return set["data"][key][set["data"][key].length - 1][
			// 			"date"
			// 		];
			// 	}
			// 	return;
			// };

			// mapping for unrealized and realizing set
			let mapping = {
				unrealizedBasisRewards: "realizingRewardBasis",
				unrealizedBasisRewardsDep: "realizingRewardBasisDep",
				unrealizedBasisRewardsMVDep: "realizingRewardBasisMVDep",
			};

			let realMapping = {
				unrealizedBasisRewards: "realizedBasisRewards",
				unrealizedBasisRewardsDep: "realizedBasisRewardsDep",
				unrealizedBasisRewardsMVDep: "realizedBasisRewardsMVDep",
			};

			// if there is no current data and if the id is not a duplicate
			let tempParams = params;
			// if there is no set data and it's not loading get unrealized set
			if (set?._id && set["isLoading"] === undefined) {
				tempParams["histObjId"] = set["_id"];
				getUnrealizedSet(tempParams);
			}

			// if the current set is not loading
			if (!set?.isLoading) {
				// get subset data to render default is basis rewards
				let incomeToReport;
				setToRender = setToRender
					? setToRender
					: "unrealizedBasisRewards";

				/* reward key for the quantity within the list of objects for 
				each set */
				let rewardKey = null;
				if (setToRender === "unrealizedBasisRewards") {
					rewardKey = "basisReward";
					incomeToReport = "realizingBasisAgg";
				} else if (setToRender === "unrealizedBasisRewardsDep") {
					rewardKey = "rewBasisDepletion";
					incomeToReport = "realizingDepAgg";
				} else {
					rewardKey = "rewBasisMVDepletion";
					incomeToReport = "realizingMVDAgg";
				}
				// initializing data to be returned as currentSet
				// let dates = [];
				// let basisRewards = [];
				let realizingRewards = [];
				let realizedRewards = [];
				// chart js data
				let data = {
					labels: [],
					datasets: [
						{
							label: "Realized Rewards",
							backgroundColor: "rgba(255, 99, 132, 0.9)",
							borderRadius: 3,
							barThickness: 15,
							data: [],
						},
						{
							label: "Realizing Rewards",
							backgroundColor: "rgba(242, 120, 75, 0.9)",
							borderRadius: 3,
							barThickness: 15,
							data: [],
						},
						{
							label: "Unrealized Rewards",
							backgroundColor: "rgba(191, 191, 191, 0.9)",
							borderRadius: 3,
							barThickness: 15,
							data: [],
						},
					],
					hoverOffset: 4,
					address: set["data"].address,
					fiat: set["data"].fiat,
					basisDate: set["data"].basisDate,
					basisPrice: set["data"].basisPrice,
					incomeToReport:
						set["data"][incomeToReport] +
						set["data"]["realizingBasisAgg"],
				};

				let currentRealizingSet = mapping[setToRender];
				let currentRealizedSet = realMapping[setToRender];

				// get all dates, all dates are accounted for in realized and unrealized sets
				if (data.labels.length === 0) {
					set?.data[currentRealizedSet].map(({ date }) => {
						data.labels.push(date);
					});

					set?.data[`${setToRender}`].map(({ date }) => {
						data.labels.push(date);
					});
				}
				// if realized set, render
				if (set?.data?.realizedRewards) {
					realizedRewards = set.data[currentRealizedSet].map(
						(element) => {
							return data.datasets[0].data.push(
								element[`${rewardKey}`]
							);
						}
					);
				}

				if (set?.data?.realizingRewards) {
					// if realized Set skip those dates
					if (realizedRewards.length > 0) {
						realizingRewards = new Array(realizedRewards.length);
						data.datasets[1].data = realizingRewards;
					}
					realizingRewards = set.data[currentRealizingSet].map(
						(element) => {
							return data.datasets[1].data.push(
								element[`${rewardKey}`]
							);
						}
					);
				}

				// if realizing rewards is greater than 0 add the length of
				// realizing to unrealized as nulls
				if (set?.data?.realizingRewards?.length > 0) {
					// create empty elements in unrealized set
					//  up to size of realizing set
					data.datasets[2].data = new Array(
						data.datasets[1].data.length
					);
				}

				if (set?.data?.realizedRewards.length > 0) {
					data.datasets[2].data = new Array(
						data.datasets[0].data.length
					);
				}

				if (
					set?.data?.realizedRewards?.length > 0 &&
					set?.data?.realizingRewards?.length > 0
				) {
					data.datasets[2].data = new Array(
						data.datasets[1].data.length
					);
				}
				let d0L = data?.datasets[0]?.data?.length;
				let d1L = data?.datasets[1]?.data?.length;
				console.log(d0L - d1L);
				set?.data[`${setToRender}`].map((element, index) => {
					if (set?.data?.realizedRewards.length > 0) {
						if (index > d1L - d0L - 1) {
							return data.datasets[2].data.push(
								element[`${rewardKey}`]
							);
						}
					}
					if (index > data.datasets[1].data.length - 1) {
						return data.datasets[2].data.push(
							element[`${rewardKey}`]
						);
					}
				});

				/* if there is a realizing set loop through the array and set
				the chart js data */
				// if (set?.data?.realizingRewardBasis) {
				// 	realizingRewards = set["data"][currentRealizingSet].map(
				// 		(element) => {
				// 			// if there is a realized set, make sure the start date is after the last realized date
				// 			if (set?.data?.realizedRewards) {
				// 				// if current element date is less than max date
				// 				// of realized set, skip
				// 				console.log(
				// 					element["date"],
				// 					getMaxDate("realizedRewards"),
				// 					element["date"] >
				// 						getMaxDate("realizedRewards")
				// 				);
				// 				if (
				// 					element["date"] >=
				// 					getMaxDate("realizedRewards")
				// 				) {
				// 					realizingRewards.push(
				// 						element[`${rewardKey}`]
				// 					);
				// 				} else {
				// 					realizingRewards.push(null);
				// 				}
				// 			} else {
				// 				realizingRewards.push(element[`${rewardKey}`]);
				// 			}
				// 			// realizing set index 1 (second chart js dataset)
				// 			data["datasets"][1]["data"] = realizingRewards;
				// 			return realizingRewards;
				// 		}
				// 	);
				// }

				// // if there are realized rewards push those dates first
				// if (set["data"]["realizedRewards"] !== undefined) {
				// 	realizedRewards = set["data"][currentRealizedSet].map(
				// 		(element) => {
				// 			realizedRewards.push(element[`${rewardKey}`]);
				// 			data["datasets"][0]["data"] = realizedRewards;
				// 			basisRewards.push(null);
				// 			dates.push(
				// 				new moment(element["date"]).format(
				// 					"MMM DD, YYYY"
				// 				)
				// 			);
				// 			return realizedRewards;
				// 		}
				// 	);
				// }
				// // loop through unrealized data and set chart js data
				// set["data"][`${setToRender}`].map((element) => {
				// 	dates.push(
				// 		new moment(element["date"]).format("MMM DD, YYYY")
				// 	);

				// 	if (set["data"][currentRealizingSet] !== undefined) {
				// 		if (element["date"] >= getMaxDate()) {
				// 			basisRewards.push(element[`${rewardKey}`]);
				// 			data["datasets"][1]["data"].push(null);
				// 		} else {
				// 			basisRewards.push(null);
				// 		}
				// 	} else if (set["data"][currentRealizedSet] !== undefined) {
				// 		basisRewards.push(element[`${rewardKey}`]);
				// 		// data["datasets"][0]["data"].push(null);
				// 	} else {
				// 		basisRewards.push(element[`${rewardKey}`]);
				// 	}
				// 	/* set chart js labels as unrealized dates
				// 	(this is the max range of all sets) */
				// 	data["labels"] = dates;

				// 	// unrealized set (third chart js dataset - last to render)
				// 	data["datasets"][2]["data"] = basisRewards;
				// 	return data;
				// });
				data["realizingRatio"] =
					set["data"]["realizingBasisP"] /
					set["data"]["unrealizedBasisP"];
				return data;
			}
		},
		[set, params, getUnrealizedSet]
	);

	// chart js options
	const options = {
		scales: {
			yAxes: {
				grid: {
					drawTicks: false,
				},
				title: {
					display: true,
					text:
						set["data"] !== undefined
							? fiatLabels[set["data"]["fiat"]]
							: "",
					font: {
						size: 15,
					},
				},
				ticks: {
					precision: 0,
					beginAtZero: true,
				},
			},
			xAxes: {
				categoryPercentage: 1.0,
				barPercentage: 1.0,
				stacked: true,
				grid: {
					display: false,
					drawTicks: false,
				},
				title: {
					display: true,
					text: "Date",
					font: {
						size: 15,
					},
				},
				ticks: {
					beginAtZero: true,
				},
			},
		},
		plugins: {
			legend: {
				display: true,
			},
		},
	};

	// load the fiat flag from directory
	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);

	// current set data
	const [currentSet, setCurrentSet] = useState();
	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData());
	}, [getData]);

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
	return !set?.isLoading ? (
		<div className={classes.AnalysisWrapper}>
			<div className={classes.Chart}>
				<div className={classes.ChartWrapper}>
					<Bar data={currentSet} options={options} />
					<div
						className={classes.help}
						tooltip-data="This chart shows your block rewards"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div>
				</div>
				<div className={classes.ChartParams}>
					<div className={classes.BarContainer}>
						<div className={classes.Bar}>
							{currentSet &&
							!isNaN(currentSet["realizingRatio"]) ? (
								<>
									<div
										className={classes.Realizing}
										style={{
											flex: currentSet
												? currentSet["realzingRatio"]
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
												  currentSet["realizingRatio"] +
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
							tooltip-data="Your staking basis powers your block rewards"
						>
							<HelpOutlineRoundedIcon
								className={classes.helpIcon}
							/>
						</div>
					</div>
					<div>
						<img
							className={classes.fiatImg}
							src={path.default}
							alt={props.fiat}
						/>
						{props.fiat}
					</div>
					{/* <div>
						{data !== undefined ? data.basisPrice.toFixed(2) : null}
					</div> */}
					<div>Basis Balance</div>
				</div>
				<div className={classes.setToggles}>
					<div className={classes.basisSet}>
						<div className={classes.buttonAndInfo}>
							<Button
								variant="outline-danger"
								onClick={() => {
									updateChart("unrealizedBasisRewards");
								}}
							>
								Basis Set
							</Button>

							<div
								className={classes.help}
								tooltip-data="Your basis set is your crypto's value with your basis price"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
					{/* <div className={classes.header}>Depletion Sets</div> */}
					<div className={classes.depletionSet}>
						<div className={classes.buttonAndInfo}>
							<Button
								variant="outline-danger"
								onClick={() =>
									updateChart("unrealizedBasisRewardsMVDep")
								}
							>
								Mvd Set
							</Button>
							<div
								className={classes.help}
								tooltip-data="Market Value Dilution accounting set"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
						<div className={classes.buttonAndInfo}>
							<Button
								variant="outline-danger"
								onClick={() =>
									updateChart("unrealizedBasisRewardsDep")
								}
							>
								Supply Dep Set
							</Button>
							<div
								className={classes.help}
								tooltip-data="Circulating supply depletion accounting set"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
				</div>

				{set && set["isLoading"] ? (
					<div className={classes.setToggles}>
						<Spinner animation="border" variant="danger" />
					</div>
				) : (
					<Form
						className={classes.setToggles}
						onSubmit={handleRealizing}
					>
						<Form.Label>Enter Quantity Realized:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								<Form.Control
									type="number"
									placeholder="0 XTZ"
									ref={quantityRealize}
								/>
								<div
									className={classes.help}
									tooltip-data="Enter a quantity of crypto you'd like to sell and see if it's economically fair value for reporting your taxes. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div>
						<Button type="submit" variant="danger">
							Apply
						</Button>
					</Form>
				)}
				{currentSet && !isNaN(currentSet["incomeToReport"]) ? (
					<div className={classes.setToggles}>
						<Form.Label>Income to Report:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								{currentSet["incomeToReport"]
									.toFixed(2)
									.concat(" ", set["data"]?.fiat)}
								<div className={classes.help}>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div>
						<Button
							type="submit"
							variant="danger"
							onClick={handleSave}
						>
							Save
						</Button>
					</div>
				) : null}
			</div>
		</div>
	) : (
		<div className={classes.SpinnerWrapper}>
			<Spinner animation="border" variant="danger" />
		</div>
	);
};

export default Analysis;
