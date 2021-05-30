$(function(){
    var ctx = document.getElementById('rewardChart');
    window.myLine = new Chart(ctx, config);
})


//reward chart js
var dateb4 = localStorage.getItem('date')
var cashmethod = localStorage.getItem('cashValueRewardAccumulated')
var depletionmethod = localStorage.getItem('depletionRewardAccumulated')
var dilutionmethod = localStorage.getItem('dilutionRewardAccumulated')

var date = dateb4.split(',')
var cashmethod = cashmethod.split(',')
var depletionmethod = depletionmethod.split(',')
var dilutionmethod = dilutionmethod.split(',')
//segmenting the data to be in intervals of 5
/*
for(i=0; i<date.length; i+5){
 	labels += date[i]
	cashValue += parseFloat(cashmethod[i])
	rewDepl += parseFloat(depletionmethod[i])
	rewDil += parseFloat(dilutionmethod[i])
}
*/

console.log('browser murder')
var config = {
			type: 'line',
			data: {
				labels: date,
				datasets: [{
					label: 'Reward Income Cash Value Method',
					data: cashmethod,
					fill: false,
          backgroundColor: 'red',
          borderColor: 'red',
          pointRadius: .7,
          borderWidth: 1.5,
				},
				{
					label: 'Reward Income Depletion Method',
					data: depletionmethod,
					fill: false,
          backgroundColor: 'green',
          borderColor: 'green',
          pointRadius: .7,
          borderWidth: 1.5,
				},

				{
					label: 'Reward Income MV Dilution Method',
					data: dilutionmethod,
					fill: false,
          backgroundColor: 'blue',
          borderColor: 'blue',
          pointRadius: .7,
          borderWidth: 1.5,
				},
				]
			},
      options: {
        scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'AGGREGATE INCOME IN $USD'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'DATE IN PERIOD'
                }
              }]
            },
         elements: {
             line: {
                 tension: 1 // disables bezier curves
             }
         },
         animation: {
             duration: 0 // general animation time
         },
         hover: {
             animationDuration: 0 // duration of animations when hovering an item
         },
         responsiveAnimationDuration: 0, // animation duration after a resize
       }

		};
