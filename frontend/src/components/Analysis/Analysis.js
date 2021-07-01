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

	console.log(set);
	const updateChart = (setToRender) => {
		setData(getData(setToRender));
	};
	// foobar data
	const getData = useCallback(
		(setToRender) => {
			if (!set || Object.keys(set).length === 0) {
				getUnrealizedSet(params);
			} else {
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
					address: set.address,
					fiat: set.fiat,
					basisDate: set.basisDate,
					basisPrice: set.basisPrice,
				};
				set[`${setToRender}`].map((element) => {
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
		[params, set, getUnrealizedSet]
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
		},
	};

	const [data, setData] = useState(getData());

	// rerender the chart
	useEffect(() => {
		setData(getData());
	}, [getData]);

	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);
	return Object.keys(set).length > 0 ? (
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
