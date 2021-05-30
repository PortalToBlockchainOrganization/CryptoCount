import React from "react";
import { Bar } from "react-chartjs-2";
import classes from "./Analysis.module.css";
const Analysis = () => {
	// foobar data
	const data = {
		labels: [
			"Test",
			"Blue",
			"Yellow",
			"Green",
			"Purple",
			"Orange",
			"Red",
			"Blue",
			"Yellow",
			"Green",
			"Purple",
			"Orange",
			"Red",
			"Blue",
			"Yellow",
			"Green",
			"Purple",
			"Orange",
			"Yellow",
			"Green",
			"Purple",
			"Orange",
		],
		datasets: [
			{
				label: "# of Votes",
				data: [
					11, 19, 3, 5, 2, 32, 19, 3, 5, 2, 3, 11, 19, 3, 5, 2, 32,
					19, 3, 5, 2, 3,
				],
				backgroundColor: [
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)",
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)",
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)",
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
				],
			},
		],
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

	return (
		<div className={classes.AnalysisWrapper}>
			<div className={classes.Chart}>
				<Bar data={data} options={options} />
			</div>
		</div>
	);
};

export default Analysis;
