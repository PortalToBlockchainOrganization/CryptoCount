import { isWhiteSpaceLike } from "typescript";
import { fiatLabels } from "./fiatLabels";
import { getData } from "./ChartData";

export const chartOptions = (set) => {
	const Title = (()=> {
		//img.concat
		// var first4 = set?.data?.address.slice(0,4)
		// first4.concat("...")
		// var last4 = set?.data?.address.slice(25)
		// first4.concat(last4)
		// first4.concat(' ',"Block Reward Entries")
		// console.log(first4)
		var first4 = set?.data?.walletAddress
		return first4
	})

	//get the basis costs array
	let basisCosts = []
	if(set?.data?.realizedNativeRewards){
		set?.data?.unrealizedNativeRewards.forEach(element => {
			basisCosts.push(element.basisCost)
		});
		set?.data?.realizedNativeRewards.forEach(element => {
			basisCosts.push(element.basisCost)
		});
	}
	else{
		set?.data?.unrealizedNativeRewards.forEach(element => {
			basisCosts.push(element.basisCost)
		});
	}



	console.log(basisCosts)

	return {
		responsive: true,
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
					color: "white"
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
						size: 16,
					},
					color: "white",
					
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
				text: " ".concat(" " + set?.data?.walletAddress + "    ","Native Tez Consensus Block Reward Accounting Entries"),
				align: "start",
				font: {
					size: 15,
				},
				color: "white",
				padding: {
                    top: 10,
                    bottom: 30,
					left: 50
                },
				margin:{
					left: 50
				}
				
			},
			tooltip: {
				callbacks: {
				//   label: (ttItem) => (`${ttItem.dataset.label}: ${ttItem.dataset.data[ttItem.dataIndex].basisCost}`)
					beforeBody: function(tooltipItems){
						return "Reward Basis Cost: " + basisCosts[tooltipItems[0].dataIndex].toFixed(2);
					}
				}
			},
		},
	};
};
