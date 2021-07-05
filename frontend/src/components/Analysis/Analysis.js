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
	const { params, set, getUnrealizedSet } = props;
	const getData = useCallback(
		(setToRender) => {
			// if there is no current data and if the id is not a duplicate
			let tempParams = params;
			console.log(params);
			console.log(set);
			if (set["_id"] !== undefined && set["isLoading"] === undefined) {
				tempParams["histObjId"] = set["_id"];
				console.log(tempParams);
				getUnrealizedSet(tempParams);
			}

			if (set["isLoading"] && set["isLoading"] === false) {
				setToRender = setToRender ? setToRender : "basisRewards";
				let rewardKey = null;
				if (setToRender === "basisRewards") {
					rewardKey = "basisReward";
				} else if (setToRender === "basisRewardsDep") {
					rewardKey = "rewBasisDepletion";
				} else {
					rewardKey = "rewBasisMVDepletion";
				}
				let dates = [];
				let basisRewards = [];
				let data = {
					labels: [],
					datasets: [{ label: "Basis Rewards", backgroundColor: [] }],
					address: set["data"].address,
					fiat: set["data"].fiat,
					basisDate: set["data"].basisDate,
					basisPrice: set["data"].basisPrice,
				};
				set["data"][`${setToRender}`].map((element) => {
					dates.push(element["date"]);
					basisRewards.push(element[`${rewardKey}`]);
					data["labels"] = dates;
					data["datasets"][0]["data"] = basisRewards;
					data["datasets"][0]["backgroundColor"].push(
						`rgba(255, 99, 132, 1)`
					);

					return data;
				});
				return data;
			}
		},
		[set, params, getUnrealizedSet]
	);
	const [data, setData] = useState(getData());
	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);
	console.log(set);

	// rerender the chart
	useEffect(() => {
		setData(getData());
	}, []);

	const updateChart = (setToRender) => {
		setData(getData(setToRender));
	};

	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	};

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
				<Bar data={data} options={options} />
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
					<div>{data ? data.basisPrice.toFixed(2) : null}</div>
					<div>Basis Balance</div>
				</div>
				<div className={classes.setToggles}>
					<Button
						variant="outline-danger"
						onClick={() => updateChart("basisRewardsMVDep")}
					>
						Mvd Set
					</Button>
					<Button
						variant="outline-danger"
						onClick={() => updateChart("basisRewardsDep")}
					>
						Supply Dep Set
					</Button>
					<Button
						variant="outline-danger"
						onClick={() => {
							updateChart("basisRewards");
						}}
					>
						Basis Set
					</Button>
				</div>
				<div className={classes.setToggles}>
					<Form.Label>Enter Quantity Realized:</Form.Label>
					<div className={classes.quantGroup}>
						<Form.Control type="number" placeholder="0" />
					</div>
					<Button type="submit" variant="danger">
						Apply
					</Button>
				</div>
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
