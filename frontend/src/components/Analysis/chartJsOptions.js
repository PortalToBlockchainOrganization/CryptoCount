import { fiatLabels } from "./fiatLabels";
export const chartOptions = (set) => {
	return {
		scales: {
			yAxes: {
				grid: {
					drawTicks: false,
				},
				title: {
					display: true,
					text:
						set?.data !== undefined
							? fiatLabels[set?.data?.fiat]
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
			title: {
				display: true,
				text: set?.data?.address.concat(' ',"Block Reward Entries"),
				align: "start",
				font: {
					size: 15,
				},
			},
		},
	};
};
