import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import classes from "./Analysis.module.css";
/**
 * Component for the Analysis page. Renders a chart displaying realized,
 * unrealized, and realizing sets. Allows user to query for sets, realize,
 * and save.
 * @param {*} props
 * @returns
 */
const Analysis = (props) => {
	const { params, set, getUnrealizedSet, getRealizingSet } = props;
	const [quantityRealize, setQuantityRealize] = useState(0);
	const updateChart = (setToRender) => {
		setCurrentSet(getData(setToRender));
	};

	console.log(quantityRealize);
	const handleChange = (e) => {
		setQuantityRealize(e.target.value);
		e.preventDefault();
	};

	const handleRealizing = (e) => {
		console.log(set["data"]["_id"], quantityRealize);
		if (set["data"]["_id"] !== undefined && quantityRealize !== 0) {
			getRealizingSet(set["data"]["_id"], quantityRealize);
		}
		e.preventDefault();
	};

	// const getMinDate = () => {
	// 	return set["data"]["realizingRewardBasis"][0]["date"];
	// };

	const getMaxDate = (setLabel) => {
		return set["data"]["realizingRewardBasis"][
			set["data"]["realizingRewardBasis"].length - 2
		]["date"];
	};

	const getData = useCallback(
		(setToRender) => {
			let mapping = {
				unrealizedBasisRewards: "realizingRewardBasis",
				unrealizedBasisRewardsDep: "realizingRewardBasisDep",
				unrealizedBasisRewardsMVDep: "realizingRewardBasisMVDep",
			};
			// if there is no current data and if the id is not a duplicate
			let tempParams = params;
			if (set["_id"] !== undefined && set["isLoading"] === undefined) {
				tempParams["histObjId"] = set["_id"];
				console.log(tempParams);
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
							label: "Basis Rewards",
							backgroundColor: "rgba(255, 99, 132, 1)",
						},
						{
							label: "Realizing Rewards",
							backgroundColor: "rgba(191, 191, 191, 1)",
						},
					],
					address: set["data"].address,
					fiat: set["data"].fiat,
					basisDate: set["data"].basisDate,
					basisPrice: set["data"].basisPrice,
				};

				let currentRelSet = mapping[setToRender];
				// if realizing set is null
				set["data"][`${setToRender}`].map((element) => {
					dates.push(element["date"]);
					if (set["data"][currentRelSet] !== undefined) {
						if (element["date"] >= getMaxDate()) {
							basisRewards.push(element[`${rewardKey}`]);
						} else {
							basisRewards.push(null);
						}
					} else {
						basisRewards.push(element[`${rewardKey}`]);
					}
					data["labels"] = dates;
					data["datasets"][0]["data"] = basisRewards;
					return data;
				});
				if (set["data"]["realizingRewardBasis"] !== undefined) {
					realizingRewards = set["data"][currentRelSet].map(
						(element) => {
							realizingRewards.push(element[`${rewardKey}`]);
							data["datasets"][1]["data"] = realizingRewards;
							return realizingRewards;
						}
					);
				}
				return data;
			}
		},
		[set, params, getUnrealizedSet]
	);

	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
			xAxes: [
				{
					stacked: true,
					barThickness: 0.8,
				},
			],
		},
	};

	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);

	const [currentSet, setCurrentSet] = useState(getData());
	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData());
	}, [getData]);

	// useEffect(() => {
	// 	setCurrentSet();
	// }, []);

	return set["data"] !== undefined ? (
		<div className={classes.AnalysisWrapper}>
			{/* <div className={classes.Buttons}>
				<Button variant="outline-danger" onClick={updateNumber}>
					Previously Realized
				</Button>
				<Button variant="outline-danger">Realizing</Button>
				<Button variant="outline-danger">Unrealized</Button>
			</div> */}
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
					<div>
						{/* {data !== undefined ? data.basisPrice.toFixed(2) : null} */}
					</div>
					<div>Basis Balance</div>
				</div>
				<div className={classes.setToggles}>
					<Button
						variant="outline-danger"
						onClick={() =>
							updateChart("unrealizedBasisRewardsMVDep")
						}
					>
						Mvd Set
					</Button>
					<Button
						variant="outline-danger"
						onClick={() => updateChart("unrealizedBasisRewardsDep")}
					>
						Supply Dep Set
					</Button>
					<Button
						variant="outline-danger"
						onClick={() => {
							updateChart("unrealizedBasisRewards");
						}}
					>
						Basis Set
					</Button>
				</div>
				<Form className={classes.setToggles} onSubmit={handleRealizing}>
					<Form.Label>Enter Quantity Realized:</Form.Label>
					<div className={classes.quantGroup}>
						<Form.Control
							type="number"
							placeholder="0"
							onChange={handleChange}
						/>
					</div>
					<Button type="submit" variant="danger">
						Apply
					</Button>
				</Form>
				<div className={classes.setToggles}>
					<Form.Label>Income to Report:</Form.Label>
					<div className={classes.quantGroup}>
						<Form.Control type="number" placeholder="0" />
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
