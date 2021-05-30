const express = require('express');
const router = express.Router();
let BlockchainModel = require('../models/blockchain');
let StatisticModel = require('../models/statistic');
let CycleModel = require('../models/cycle');
let axios = require('axios');


async function getRewards(address) {
    let rewards = [];
    let flowins = {};
    let flowouts = {};
    let lastId = 0;
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/accounts/${address}/operations?type=endorsement,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&lastId=${lastId}&limit=1000&sort=0`;
            // let url = `https://api.tzkt.io/v1/accounts/${address}/operations?lastId=${lastId}&limit=1000&sort=0`;
            const response = await axios.get(url);
            lastId = response.data[response.data.length - 1].id;  // update lastId
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                if ('endorsement' === element.type) {
                    rewards.push({
                        type: 'endorsement',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.rewards
                    });
                } else if ('baking' === element.type) {
                    rewards.push({
                        type: 'baking',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.reward + element.fees
                    });
                } else if ('nonce_revelation' === element.type) {
                    rewards.push({
                        type: 'nonce_revelation',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: element.bakerRewards
                    });
                } else if ('double_baking' === element.type) {
                    let isAccuser = element.accuser.address === address;
                    if (isAccuser) {
                        rewards.push({
                            type: 'double_baking',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: element.accuserRewards
                        });
                    } else {
                        rewards.push({
                            type: 'double_baking',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -(element.offenderLostDeposits + element.offenderLostRewards + element.offenderLostFees)
                        })
                    }
                } else if ('double_endorsing' === element.type) {
                    let isAccuser = element.accuser.address === address;
                    if (isAccuser) {
                        rewards.push({
                            type: 'double_endorsing',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: element.accuserRewards
                        });
                    } else {  // is accused offender
                        rewards.push({
                            type: 'double_endorsing',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -(element.offenderLostDeposits + element.offenderLostRewards + element.offenderLostFees)
                        });
                    }
                }
                else if ('transaction' === element.type) {
                    let isInTransaction = element.target.address === address;
                    if ('applied' === element.status) {
                        if (isInTransaction) {
                            const d = Math.floor(Date.parse(element.timestamp) / (1000 * 60 * 60 * 24));
                            if (d in flowins) {
                                flowins[d] += element.amount;
                            } else {
                                flowins[d] = element.amount;
                            }
                        } else {
                            const d = Math.floor(Date.parse(element.timestamp) / (1000 * 60 * 60 * 24));
                            if (d in flowouts) {
                                flowouts[d] += element.amount + element.bakerFee + element.storageFee + element.allocationFee;
                            } else {
                                flowouts[d] = element.amount + element.bakerFee + element.storageFee + element.allocationFee;
                            }
                        }
                    }
                    else if ('failed' === element.status && !isInTransaction) {
                        rewards.push({
                            type: 'transaction',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -1 * (element.bakerFee + element.storageFee + element.allocationFee)
                        })
                    }
                    else if ('backtracked' === element.type) {
                    }
                    else if ('skipped' === element.type) {
                    }
                }
                else if ('origination' === element.type) {
                    rewards.push({
                        type: 'origination',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -(element.bakerFee + element.storageFee + element.allocationFee)
                    });
                }
                else if ('delegation' === element.type) {
                    let isSender = element.sender.address === address;
                    if (isSender) {
                        rewards.push({
                            type: 'delegation',
                            timestamp: new Date(Date.parse(element.timestamp)),
                            amount: -1 * element.bakerFee
                        })
                    }
                }
                else if ('reveal' === element.type) {
                    rewards.push({
                        type: 'reveal',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -1 * element.bakerFee
                    })
                }
                else if ('revelation_penalty' === element.type) {
                    rewards.push({
                        type: 'revelation_penalty',
                        timestamp: new Date(Date.parse(element.timestamp)),
                        amount: -1 * (element.lostReward + element.lostFees)
                    })
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
    return [rewardsByDay, flowins, flowouts];
}


async function getBalances(address) {
    let balances = {};
    let offset = 0;
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            offset += response.data.length  // update lastId
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
    return balances;
}

router.get('/analysis/:address', async (req, res) => {
    if (req.params.address && req.query.start && req.query.end) {
        try {
            const startDate = new Date(Date.parse(req.query.start));
            const startDateD = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24));
            const endDate = new Date(Date.parse(req.query.end));
            const endDateD = Math.floor(endDate.getTime() / (1000 * 60 * 60 * 24));
            const days = endDateD - startDateD;

            let balances = await getBalances(req.params.address);
            if (balances.length === 0) {
                res.status(400).json({ error: 'The address does not has balance history.' });
                return;
            }
            let firstBalanceD = Number(Object.keys(balances)[0]);
            if (startDateD < firstBalanceD) {
                res.status(400).json({
                    error: 'The start date is earilier than the first balance day.',
                    firstBalanceDay: new Date(firstBalanceD * 1000 * 60 * 60 * 24).toISOString().substring(0, 10)
                });
                return;
            }

            // calculate cash value column
            // get XTZ prices
            const priceDocs = await BlockchainModel.find();
            let prices = {};
            // convert document to dictionary for better find performance (date -> int: price -> number; date -> int: marketCap -> number)
            for (let i = 0; i < priceDocs.length; i++) {
                const d = Math.floor(priceDocs[i].date.getTime() / (1000 * 60 * 60 * 24));
                prices[d] = priceDocs[i].price;
            }
            // get rewards for the address
            let [rewards, flowins, flowouts] = await getRewards(req.params.address);
            // get cash value of rewards in each day
            let cashMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (d in prices) {
                    if (d in rewards) {
                        cashMethods[d] = prices[d] * rewards[d];
                    }
                    else {
                        cashMethods[d] = prices[d] * 0;  // days which don't have reward
                    }
                }
            }
            // calculate 

            // calculate dep method column
            const supplyDocs = await StatisticModel.find();
            let totalSupplys = {};
            let marketCaps = {};
            for (let i = 0; i < supplyDocs.length; i++) {
                const d = Math.floor(new Date(Date.parse(supplyDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
                totalSupplys[d] = supplyDocs[i].totalSupply;
                marketCaps[d] = (d in prices) ? totalSupplys[d] * prices[d] : 0;
            }
            let depletions = {};
            let depBookValues = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (i === 0) {
                    depletions[d] = 0;
                    depBookValues[d] = prices[d] * balances[d]; // assume the user gets initial balance at the start date it inputs
                }
                else {
                    let flowValue = 0; // it can be positibe; it can be negative too
                    // let depBookValueChange = 0;

                    if (d in flowins) {
                        flowValue += flowins[d];
                    }
                    if (d in flowouts) {
                        flowValue -= flowouts[d];
                    }
                    if (flowValue > 0) {
                        const dayInitBookValue = depBookValues[d - 1] + Math.abs(flowValue) * prices[d - 1];  // assume the flow-in happened in the first second of the day
                        depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                        depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
                    } else {
                        const dayInitBookValue = (1 - Math.abs(flowValue) / balances[d - 1]) * depBookValues[d - 1];  // assume the flow-out happened in the first second of the day
                        depletions[d] = - dayInitBookValue * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                        depBookValues[d] = dayInitBookValue + cashMethods[d] + depletions[d];  // assume the reward comes at the end of the day
                    }
                    // depletions[d] = - depBookValues[d - 1] * (1 - totalSupplys[d - 1] / totalSupplys[d]);  // this is a negative value
                    // depBookValues[d] = depBookValues[d - 1] + cashMethods[d] + depletions[d] - depBookValueLoss;
                }
            }
            let depMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24)) + i;
                if (d in depletions && d in cashMethods) {
                    depMethods[d] = depletions[d] + cashMethods[d];
                } else { }
            }

            // caluclate MVD method column
            let MVDils = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (i === 0) {
                    MVDils[d] = 0;
                }
                else {
                    MVDils[d] = -(marketCaps[d] / marketCaps[d - 1] - prices[d] / prices[d - 1]) * balances[d - 1] * prices[d - 1];
                }
            }
            let MVDMethods = {};
            for (let i = 0; i <= days; i++) {
                const d = startDateD + i;
                if (d in MVDils && d in cashMethods) {
                    MVDMethods[d] = MVDils[d] + cashMethods[d];
                } else { }
            }

            // calculate cycles
            const cycleDocs = await CycleModel.find();
            let cycles = {};
            for (let i = 0; i < cycleDocs.length; i++) {
                const d = Math.floor(new Date(Date.parse(cycleDocs[i].dateString)).getTime() / (1000 * 60 * 60 * 24));
                cycles[d] = cycleDocs[i].cycleNumber;
            }

            // assemble array to return
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
            res.json(analysisResults);
        } catch (error) {
            if (error.repsonse && error.response.data && error.response.data.code && error.response.data.errors) {
                res.status(error.response.data.code).json(error.response.data.errors);
            }
            else {
                console.error(error);
                res.status(400).json({ error: 'please check input params' });
            }
        }
    } else {
        res.status(400).json({ error: 'please check input params' });
    }
})



module.exports = router;