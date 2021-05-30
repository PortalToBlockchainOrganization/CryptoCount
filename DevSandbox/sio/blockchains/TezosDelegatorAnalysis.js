let BlockchainModel = require('../../models/blockchain');
let StatisticModel = require('../../models/statistic');
let CycleModel = require('../../models/cycle');
let axios = require('axios');
const cycle = require('../../models/cycle');
//im very happy to switch between problems so easily

async function getRewards(address) {
    let rewards = [];
    let lastId = 0;
    while (true) {
        //baker on chain reward collection by querying address operations, a delegator address will likely return the transactions with bakers unidentified who the baker is 
        try {
            //payload 1
            let url = 'https://api.tzkt.io/v1/rewards/delegators/${address}'
            const response = await axios.get(url)
            bakerAddress = [];
            //parse response for baker addy
            //multuiple baker addys here are possible so loop for the changed baker
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                cyclechange = []
                if (address == element.payouts.address){
                    bakerAddress.push(element.baker.address)
                }
                else{
                    bakerAddress.push(element.baker.address)
                    cyclechange.push(element.cycle)
                }
            }

            //date and cylces 
            //get cycle database info here

            //payload 2
            //for cycle in cycleset 
            for (let i = 0; i < cycles.length; i++){
                cycle = cycles[i];
                for (let i = 0; i < bakerAddress.data.length; i++){
                    bakerAddress = bakerAddress[i]
                    let url = 'https://api.baking-bad.org/v2/rewards/${bakerAddress}?cycle=${cycle}'
                    const response = await axios.get(url)
                    //get delegated reward per cylce
                    for (let i = 0; i < response.data.length; i++) {
                        const element = response.data[i];
                        if (address === element.payouts.address){
                            rewards.push({
                                cycle: cycle[i],
                                amount: element.payout.amount    
                            })
                            rewards.push(element.payouts.amount)
                        }
                    }
                }
            }    
            if (response.data.length < 1000) {  // if is the last page
                break;
            }
        } catch (error) {
            throw error;
        }
    }
    // create dictionary (key -> date: value -> sum of rewards on that day)
    let rewardsByDay = {};
    for (let i = 0; i < rewards.length; i++) {
        const d = Math.floor(rewards[i].timestamp / (1000 * 60 * 60 * 24));  // number of days since January 1, 1970, 00:00:00 UTC
        const amount = rewards[i].amount;
        if (!(d in rewardsByDay)) {
            rewardsByDay[d] = 0;
        }
        rewardsByDay[d] += amount;
    }
    return [rewardsByDay];
}


async function getBalances(address) {
    let balances = {};
    //offset from index
    let offset = 0;
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            offset += response.data.length  // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query 
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const d = Math.floor(new Date(Date.parse(element.timestamp)).getTime() / (1000 * 60 * 60 * 24));
                balances[d] = element.balance;
            }
            if (response.data.length < 10000) {  // if is the last page
                break;
            }
        } catch (error) {
            console.error(error);
        }
    }
    if (Object.keys(balances).length > 0) {
        const startD = Math.min(Object.keys(balances).map(Number)[0]);
        const todayD = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
        for (let i = startD; i <= todayD; i++) {
            if (i in balances) {
            } else {
                if (i > startD) {
                    balances[i] = balances[i - 1];
                }
            }
        }
    }
    //outputs dict of balances all days after basis date and to current day
    return balances;
}

async function analysis(socket, address, basisdate, fiat) {
    if (address && basisdate && fiat) {
        try {

            //days below can be calculated by a get day field, we'll always being going from basis date to present day
            const startDate = new Date(Date.parse(start));
            const startDateD = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24));
            const today = new Date(Date.parse());
            const todayD = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
            const days = todayD - startDateD;
            //^change



            let balances = await getBalances(address);
            if (balances.length === 0) {
                socket.emit('analysisResErr', { error: 'The address does not has balance history.' });
                return;
            }
            let firstBalanceD = Number(Object.keys(balances)[0]);
            if (basisdate < firstBalanceD) {
                socket.emit('analysisResErr', {
                    error: 'Your selected basis date is before your account had a balance.',
                    firstBalanceDay: new Date(firstBalanceD * 1000 * 60 * 60 * 24).toISOString().substring(0, 10)
                });
                return;
            }

            // calculate cash value column
            // get XTZ prices
            //one of 20 data sets now
            //if fiat == usd fiat.match()
            //else fiat === rub  
            //else fiat === YEN etc. 
            // something like priceDocs = await BlockchainModelUSD.find()
            const priceDocs = await BlockchainModel.find();
            let prices = {};
            //currency matcher 
            //coingecko data prepartion
            //we make this dictionary everytime in this function because we are passing different fiats per instance of analysis
            // convert document to dictionary for better find performance (date -> int: price -> number; date -> int: marketCap -> number)
            for (let i = 0; i < priceDocs.length; i++) {
                const d = Math.floor(priceDocs[i].date.getTime() / (1000 * 60 * 60 * 24));
                prices[d] = priceDocs[i].price + {$fiat};
            }
            // get rewards for the address
            let [rewards] = await getRewards(address);
            // get cash value of rewards in each day
            //i dont think this is using the basis at all for the rewards. 
            let cashMethods = {};
            for (let i = 0; i <= days; i++) {
                const basisPrice = price[0];
                // days = startDateD
                //d = startDateD + i 
                if (d in prices) {
                    if (d in rewards) {
                        cashMethods[d] = basisPrice * rewards[d];
                    }
                    else {
                        cashMethods[d] = prices[d] * 0;  // days which don't have reward
                    }
                }
            }

            // calculate dep method column
            //statisitc db meta
            const supplyDocs = await StatisticModel.find();
            let totalSupplys = {};
            let marketCaps = {};
            //making supply and market caps with date: value
            for (let i = 0; i < supplyDocs.length; i++) {
                const d = Math.floor(new Date(Date.parse(supplyDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
                totalSupplys[d] = supplyDocs[i].totalSupply;
                marketCaps[d] = (d in prices) ? totalSupplys[d] * prices[d] : 0;
            }
            let depletions = {};
            let depBookValues = {};
            //length of days always basis date to present day
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (i === 0) {
                    depletions[d] = 0;
                    depBookValues[d] = basisPrice * balances[d]; // assume the user gets initial balance at the start date it inputs
                }
                else {
                    //the book value for each day is balance times the basis price plus or minus rewards 
                    //depletion excel calculations
                    //seems correct uses basis day, wei calls it day init book value
                        const dayInitBookValue = (1 / balances[d - 1]) * depBookValues[d - 1];  // assume the flow-out happened in the first second of the day
                        depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                        depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
                    // depletions[d] = - depBookValues[d - 1] * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                    // depBookValues[d] = depBookValues[d - 1] + cashMethods[d] + depletions[d] - depBookValueLoss;
                }
            }
            //add depletion to cash value of rewards
            let depMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
                if (d in depletions && d in cashMethods) {
                    depMethods[d] = depletions[d] + cashMethods[d]; //recall cash methods doesnt use basis day for prices atm
                } else { }
            }


            // caluclate MVD method column
            let MVDils = {};
            for (let i = 0; i <= days; i++) {
                const d = basisdate + i;
                if (i === 0) {
                    MVDils[d] = 0;
                }
                else {
                    MVDils[d] = -(marketCaps[d] / marketCaps[d - 1] - prices[d] / prices[d - 1]) * balances[d - 1] * basisPrice;
                }
            }
            //adding mvdilution to cash value 
            let MVDMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (d in MVDils && d in cashMethods) {
                    MVDMethods[d] = MVDils[d] + cashMethods[d];
                } else { }
            }

            // calculate cycles
            //cycle model meta

            const cycleDocs = await CycleModel.find();
            let cycles = {};
            for (let i = 0; i < cycleDocs.length; i++) {
                const d = Math.floor(new Date(Date.parse(cycleDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
                cycles[d] = cycleDocs[i].cycleNumber;
            }

            // assemble array to return
            //creating a json
            let analysisResults = [];
            for (let i = 0; i < days; i++) {
                const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
                const d_obj = new Date(d * 1000 * 60 * 60 * 24);
                let element = {
                    date: d_obj.toISOString().substring(0, 10),
                    cycle: (d in cycles ? cycles[d] : null),
                    balance: (d in balances ? balances[d] / 1000000 : null),
                    reward: (d in rewards ? rewards[d] / 1000000 : 0),
                    cashMethod: (d in cashMethods ? cashMethods[d] / 1000000 : null),
                    depMethod: (d in depMethods ? depMethods[d] / 1000000 : null),
                    MVDMethod: (d in MVDMethods ? MVDMethods[d] / 1000000 : null)
                }
                analysisResults.push(element);
            }
            socket.emit('analysisRes', analysisResults);
        } catch (error) {
            if (error.repsonse && error.response.data && error.response.data.code && error.response.data.errors) {
                socket.emit('analysisResErr', {
                    error: error.response.data.errors
                });
            }
            else {
                socket.emit('analysisResErr', {
                    error: 'please check input params'
                });
            }
        }
    } else {
        socket.emit('analysisResErr', {
            error: 'please check input params'
        });
    }
}

module.exports = { analysis };