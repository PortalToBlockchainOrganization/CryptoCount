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

	let nativeBlockRewards = []
	if(set?.data?.realizedNativeRewards){
		set?.data?.unrealizedNativeRewards.forEach(element => {
			nativeBlockRewards.push(element.amount)
		});
		set?.data?.realizedNativeRewards.forEach(element => {
			nativeBlockRewards.push(element.amount)
		});
	}
	else{
		set?.data?.unrealizedNativeRewards.forEach(element => {
			nativeBlockRewards.push(element.amount)
		});
	}


	//console.log(basisCosts)

	return {
		responsive: true,
		
		legend: {
			labels: {
				fontColor: "blue",
				fontSize: 18
			}
		},
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
					callback: function (value, index, values) {
						return value + " " + set?.data?.fiat;
					}
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
				text: " ".concat("Native Block Rewards' Accounting Entries"),
				align: "center",
				font: {
					size: 16,
					
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
				// filter: function (tooltipItem, data) {
				// 	//var label = data.datasets[].data[tooltipItem[0].dataIndex];
				// 	console.log(tooltipItem, data);
				// 	// if (label === "0") {
				// 	//   return false;
				// 	// } else {
				// 	//   return true;
				// 	// }
				// },
				filter: tooltipItem => tooltipItem.dataset.data[tooltipItem.dataIndex] > 0,
				callbacks: {
				//   label: (ttItem) => (`${ttItem.dataset.label}: ${ttItem.dataset.data[ttItem.dataIndex].basisCost}`)
					beforeBody: function(tooltipItems){
						console.log(tooltipItems)
						try{
							var it =  basisCosts[tooltipItems[0].dataIndex].toFixed(2) + " " + set?.data?.fiat;
						}catch(e){
							console.log(e)
						}
						
						var string = "Entry Basis Cost: "
						if(it!==undefined){
							string = "Entry Basis Cost: " + it 
						}
						return string
					},
					afterBody: function(tooltipItems){
						console.log(tooltipItems)
						try{
							var it =  nativeBlockRewards[tooltipItems[0].dataIndex].toFixed(2) + " XTZ";
						}catch(e){
							console.log(e)
						}
						
						var string = "Quantity of Tez: "
						if(it!==undefined){
							string = "Quantity of Tez: " + it 
						}
						return string
					},
					label: function(tooltipItems) { 
						console.log('fiat labeler')
						console.log(tooltipItems)
						//return tooltipItems
						var value = tooltipItems.formattedValue.concat( ' ' + set?.data?.fiat)
						var value2 = "Entry Reward Value: "+ value
						return value2
					},
				},

			},
		},
	};
};
