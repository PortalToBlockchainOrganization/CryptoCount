import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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
	console.log(props);
	// foobar data

	const getData = useCallback(() => {
		const res = {
			basisRewards: [
				{
					date: "2021-01-07",
					basisReward: 1.949423945490533,
				},
				{
					date: "2021-01-11",
					basisReward: 2.280458200385152,
				},
				{
					date: "2021-01-13",
					basisReward: 2.096550280999253,
				},
				{
					date: "2021-01-17",
					basisReward: 1.8758607777361733,
				},
				{
					date: "2021-01-19",
					basisReward: 1.8390791938589934,
				},
				{
					date: "2021-01-23",
					basisReward: 2.1333318648764323,
				},
				{
					date: "2021-01-26",
					basisReward: 1.691952858350274,
				},
				{
					date: "2021-01-28",
					basisReward: 2.1333318648764323,
				},
				{
					date: "2021-02-01",
					basisReward: 1.6551712744730942,
				},
				{
					date: "2021-02-03",
					basisReward: 1.7287344422274538,
				},
				{
					date: "2021-02-06",
					basisReward: 1.9126423616133532,
				},
				{
					date: "2021-02-09",
					basisReward: 2.243676616507972,
				},
				{
					date: "2021-02-11",
					basisReward: 1.8390791938589934,
				},
				{
					date: "2021-02-14",
					basisReward: 1.3241370195784752,
				},
				{
					date: "2021-02-18",
					basisReward: 1.8022976099818135,
				},
				{
					date: "2021-02-21",
					basisReward: 2.243676616507972,
				},
				{
					date: "2021-02-23",
					basisReward: 1.9126423616133532,
				},
				{
					date: "2021-02-27",
					basisReward: 2.206895032630792,
				},
				{
					date: "2021-03-02",
					basisReward: 1.8022976099818135,
				},
				{
					date: "2021-03-04",
					basisReward: 1.9862055293677126,
				},
				{
					date: "2021-03-06",
					basisReward: 1.8758607777361733,
				},
				{
					date: "2021-03-10",
					basisReward: 1.7655160261046339,
				},
				{
					date: "2021-03-12",
					basisReward: 2.1701134487536122,
				},
				{
					date: "2021-03-16",
					basisReward: 1.9126423616133532,
				},
				{
					date: "2021-03-19",
					basisReward: 2.0597686971220726,
				},
				{
					date: "2021-03-22",
					basisReward: 1.913190407213123,
				},
				{
					date: "2021-03-23",
					basisReward: 1.7347151277658832,
				},
			],
			address: "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH",
			fiat: "USD",
			basisDate: "2021-02-28",
			basisPrice: 3.678158387717987,
		};

		let dates = [];
		let basisRewards = [];
		let data = {
			labels: [],
			datasets: [{ label: "Basis Rewards", backgroundColor: [] }],
			address: res.address,
			fiat: res.fiat,
			basisDate: res.basisDate,
			basisPrice: res.basisPrice,
		};
		res["basisRewards"].map((element) => {
			dates.push(element["date"]);
			basisRewards.push(element["basisReward"]);
			data["labels"] = dates;
			data["datasets"][0]["data"] = basisRewards;
			data["datasets"][0]["backgroundColor"].push(
				`rgba(255, 99, 132, 1)`
			);

			return data;
		});
		return data;
	}, []);

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

	let path = require(`../../Assets/Flags/${props.fiat}.PNG`);
	console.log(data);
	return (
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
					<div>{data.basisPrice.toFixed(2)}</div>
					<div>Basis Balance</div>
				</div>
				<div className={classes.setToggles}>
					<Button variant="outline-danger">Mvd Set</Button>
					<Button variant="outline-danger">Supply Dep Set</Button>
					<Button variant="outline-danger">Basis Set</Button>
				</div>
				<div className={classes.overlayTriggers}></div>
				<div className={classes.save}></div>
			</div>
		</div>
	);
};

export default Analysis;
