import { fiatLabels } from "./fiatLabels";
export const chartOptions = (set) => {
	const Title = (()=> {
		//img.concat
		// var first4 = set?.data?.address.slice(0,4)
		// first4.concat("...")
		// var last4 = set?.data?.address.slice(25)
		// first4.concat(last4)
		// first4.concat(' ',"Block Reward Entries")
		// console.log(first4)
		var first4 = set?.data?.address
		return first4
	})
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
				text: set?.data?.address.slice(0, 9).concat('... ',"Fair Market Value Block Reward Entries"),
				align: "start",
				font: {
					size: 15,
				},
			},
		},
	};
};
