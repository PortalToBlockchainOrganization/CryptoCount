import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
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
	const fiatLabels = {
		AED: "United Arab Emirates Dirham",
		ARS: "Argentine Peso",
		AUD: "Australian Dollar",
		CHF: "Swiss Franc",
		KRW: "South Korean won",
		HUF: "Hungarian Forint",
		NOK: "Norwegian krone",
		IKR: "Icelandic Króna",
		PKR: "Pakistani Rupee",
		USD: "United States Dollar",
	};
	const { params, set, getUnrealizedSet, getRealizingSet } = props;
	const [isLoading, setIsLoading] = useState(set["isLoading"]);

	// const [quantityRealize, setQuantityRealize] = useState(0);
	const quantityRealize = React.createRef();

	const updateChart = (setToRender) => {
		setCurrentSet(getData(setToRender));
		setIsLoading(false);
	};

	// const handleChange = (e) => {
	// 	setQuantityRealize(e.target.value);
	// 	e.preventDefault();
	// };

	const handleRealizing = (e) => {
		e.preventDefault();
		if (set["data"]["_id"] !== undefined && quantityRealize !== 0) {
			getRealizingSet(
				set["data"]["_id"],
				quantityRealize.current.value,
				setCurrentSet
			);
		}
	};
	console.log(set);

	// const getMinDate = () => {
	// 	return set["data"]["realizingRewardBasis"][0]["date"];
	// };

	const getData = useCallback(
		(setToRender) => {
			const getMaxDate = () => {
				if (set["data"] !== undefined) {
					return set["data"]["realizingRewardBasis"][
						set["data"]["realizingRewardBasis"].length - 2
					]["date"];
				}
				return;
			};

			let mapping = {
				unrealizedBasisRewards: "realizingRewardBasis",
				unrealizedBasisRewardsDep: "realizingRewardBasisDep",
				unrealizedBasisRewardsMVDep: "realizingRewardBasisMVDep",
			};
			// if there is no current data and if the id is not a duplicate
			let tempParams = params;
			if (set["_id"] !== undefined && set["isLoading"] === undefined) {
				tempParams["histObjId"] = set["_id"];
				getUnrealizedSet(tempParams);
			}

			if (set["isLoading"] !== undefined && set["isLoading"] === false) {
				setToRender = setToRender
					? setToRender
					: "unrealizedBasisRewards";
				let rewardKey = null;
				if (setToRender === "unrealizedBasisRewards") {
					rewardKey = "basisReward";
				} else if (setToRender === "unrealizedBasisRewardsDep") {
					rewardKey = "rewBasisDepletion";
				} else {
					rewardKey = "rewBasisMVDepletion";
				}
				let dates = [];
				let basisRewards = [];
				let realizingRewards = [];
				let data = {
					labels: [],
					datasets: [
						{
							label: "Realized Rewards",
							backgroundColor: "rgba(255, 99, 132, 0.9)",
							// borderColor: "rgba(235, 79, 122, 1)",
							borderRadius: 3,
							barThickness: 15,
							// borderWidth: 0.5,
						},
						{
							label: "Realizing Rewards",
							backgroundColor: "rgba(242, 120, 75, 0.9)",
							// borderColor: "rgba(230, 170, 68, 1)",
							borderRadius: 3,
							barThickness: 15,
							// borderWidth: 0.5,
						},
						{
							label: "Unrealized Rewards",
							backgroundColor: "rgba(191, 191, 191, 0.9)",
							// borderColor: "rgba(171, 171, 171, 1)",
							borderRadius: 3,
							barThickness: 15,
							// borderWidth: 0.5,
						},
					],
					hoverOffset: 4,
					address: set["data"].address,
					fiat: set["data"].fiat,
					basisDate: set["data"].basisDate,
					basisPrice: set["data"].basisPrice,
				};

				let currentRelSet = mapping[setToRender];
				// if there is a realizing set
				if (set["data"]["realizingRewardBasis"] !== undefined) {
					realizingRewards = set["data"][currentRelSet].map(
						(element) => {
							realizingRewards.push(element[`${rewardKey}`]);
							// realizing set index 1
							data["datasets"][1]["data"] = realizingRewards;
							return realizingRewards;
						}
					);
				}
				// if realizing set is null
				set["data"][`${setToRender}`].map((element) => {
					dates.push(
						new moment(element["date"]).format("MMM DD, YYYY")
					);
					if (set["data"][currentRelSet] !== undefined) {
						if (element["date"] >= getMaxDate()) {
							basisRewards.push(element[`${rewardKey}`]);
							data["datasets"][1]["data"].push(null);
						} else {
							basisRewards.push(null);
						}
					} else {
						basisRewards.push(element[`${rewardKey}`]);
					}
					data["labels"] = dates;
					// unrealized set
					data["datasets"][2]["data"] = basisRewards;
					return data;
				});

				return data;
			}
		},
		[set, params, getUnrealizedSet]
	);

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

	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);

	const [currentSet, setCurrentSet] = useState();
	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData());
	}, [getData]);

	return set["data"] !== undefined ? (
		<div className={classes.AnalysisWrapper}>
			<div className={classes.Chart}>
				<Bar data={currentSet} options={options} />
				<div className={classes.ChartParams}>
					<div>realize history ID</div>
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
							<HelpOutlineRoundedIcon className={classes.help} />
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
							<HelpOutlineRoundedIcon className={classes.help} />
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
							<HelpOutlineRoundedIcon className={classes.help} />
						</div>
					</div>
				</div>

				{isLoading ? (
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
								<HelpOutlineRoundedIcon
									className={classes.help}
								/>
							</div>
						</div>
						<Button type="submit" variant="danger">
							Apply
						</Button>
					</Form>
				)}
				<div className={classes.setToggles}>
					<Form.Label>Income to Report:</Form.Label>
					<div className={classes.quantGroup}>
						<div className={classes.buttonAndInfo}>
							<Form.Control
								type="number"
								placeholder={"0 " + set["data"].fiat}
							/>
							<HelpOutlineRoundedIcon className={classes.help} />
						</div>
					</div>
					<Button type="submit" variant="danger">
						Save
					</Button>
				</div>
			</div>
		</div>
	) : (
		<div className={classes.SpinnerWrapper}>
			<Spinner animation="border" variant="danger" />
		</div>
	);
};

export default Analysis;
