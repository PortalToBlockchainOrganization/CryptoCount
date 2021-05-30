//db update

//get database framework from database.js
let db = require('./database.js');
//get db element frameworks
let BlockchainModel = require('./models/blockchain');
let StatisticModel = require('./models/statistic');
let CycleModel = require('./models/cycle');
// json xml request repsonse module: framework foundation buffing, effects in req res syntax 
let axios = require('axios');
//request rate limiter
let Bottleneck = require('bottleneck');
//a second cycle db element framework - a const
const cycle = require('./models/cycle');


async function updatePrices() {
    // update price data in db (full sync) // create emission from framework
    BlockchainModel
        .findOne({}).sort({ date: 'desc' }).exec()
        .then(doc => {
            let updateFromDate = new Date(Date.UTC(2018, 5, 30));
            const updateToDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);  // get yesterday
            const limiter = new Bottleneck({
                maxConcurrent: 1,
                minTime: 1000
            });
            const days = Math.floor((updateToDate.getTime() - updateFromDate.getTime()) / (1000 * 60 * 60 * 24));
            //prepare dates for coingecko query
            for (let i = 0; i <= days; i++) {
                const d = new Date(updateFromDate.getTime() + i * 1000 * 60 * 60 * 24);
                const fetchData = async () => {
                    return await axios.get(`https://api.coingecko.com/api/v3/coins/tezos/history?date=${d.getUTCDate()}-${d.getUTCMonth() + 1}-${d.getUTCFullYear()}&localization=false`);
                };//bottleneck limiter object, schedule update method
                limiter.schedule(fetchData)
                    .then(function (response) {
                        //specific coingecko dictionary format 
                        if (response.data.market_data) {
                            //more currencies 
                            const priceAED = response.data.market_data.current_price.aed;
                            const marketCapAED = response.data.market_data.market_cap.aed;
                            const priceARS = response.data.market_data.current_price.ars;
                            const marketCapARS = response.data.market_data.market_cap.ars;
                            const priceAUD = response.data.market_data.current_price.aud;
                            const marketCapAUD = response.data.market_data.market_cap.aud;
                            const priceBDT = response.data.market_data.current_price.bdt;
                            const marketCapBDT = response.data.market_data.market_cap.bdt;
                            const priceBRL = response.data.market_data.current_price.brl;
                            const marketCapBRL = response.data.market_data.market_cap.brl;
                            const priceCAD = response.data.market_data.current_price.cad;
                            const marketCapCAD = response.data.market_data.market_cap.cad;
                            const priceCHF = response.data.market_data.current_price.chf;
                            const marketCapCHF = response.data.market_data.market_cap.chf;
                            const priceCLP = response.data.market_data.current_price.clp;
                            const marketCapCLP = response.data.market_data.market_cap.clp;
                            const priceCNY = response.data.market_data.current_price.cny;
                            const marketCapCNY = response.data.market_data.market_cap.cny;
                            const priceCZK = response.data.market_data.current_price.czk;
                            const marketCapCZK = response.data.market_data.market_cap.czk;
                            const priceDKK = response.data.market_data.current_price.dkk;
                            const marketCapDKK = response.data.market_data.market_cap.dkk;
                            const priceEUR = response.data.market_data.current_price.eur;
                            const marketCapEUR = response.data.market_data.market_cap.eur;
                            const priceGBP = response.data.market_data.current_price.gbp;
                            const marketCapGBP = response.data.market_data.market_cap.gbp;
                            const priceHKD = response.data.market_data.current_price.hkd;
                            const marketCapHKD = response.data.market_data.market_cap.hkd;
                            const priceHUF = response.data.market_data.current_price.huf;
                            const marketCapHUF = response.data.market_data.market_cap.huf;
                            const priceIDR = response.data.market_data.current_price.idr;
                            const marketCapIDR = response.data.market_data.market_cap.idr;
                            const priceILS = response.data.market_data.current_price.ils;
                            const marketCapILS = response.data.market_data.market_cap.ils;
                            const priceINR = response.data.market_data.current_price.inr;
                            const marketCapINR = response.data.market_data.market_cap.inr;
                            const priceJPY = response.data.market_data.current_price.jpy;
                            const marketCapJPY = response.data.market_data.market_cap.jpy;
                            const priceKRW = response.data.market_data.current_price.krw;
                            const marketCapKRW = response.data.market_data.market_cap.krw;
                            const priceMMK = response.data.market_data.current_price.mmk;
                            const marketCapMMK = response.data.market_data.market_cap.mmk;
                            const priceMXN = response.data.market_data.current_price.mxn;
                            const marketCapMXN = response.data.market_data.market_cap.mxn;
                            const priceIKR = response.data.market_data.current_price.ikr;
                            const marketCapIKR = response.data.market_data.market_cap.ikr;
                            const priceMYR = response.data.market_data.current_price.myr;
                            const marketCapMYR = response.data.market_data.market_cap.myr;
                            const priceNGN = response.data.market_data.current_price.ngn;
                            const marketCapNGN = response.data.market_data.market_cap.ngn;
                            const priceNOK = response.data.market_data.current_price.nok;
                            const marketCapNOK = response.data.market_data.market_cap.nok;
                            const priceNZD = response.data.market_data.current_price.nzd;
                            const marketCapNZD = response.data.market_data.market_cap.nzd;
                            const pricePHP = response.data.market_data.current_price.php;
                            const marketCapPHP = response.data.market_data.market_cap.php;
                            const pricePKR = response.data.market_data.current_price.pkr;
                            const marketCapPKR = response.data.market_data.market_cap.pkr;
                            const pricePLN = response.data.market_data.current_price.pln;
                            const marketCapPLN = response.data.market_data.market_cap.pln;
                            const priceRUB = response.data.market_data.current_price.rub;
                            const marketCapRUB = response.data.market_data.market_cap.rub;
                            const priceSEK = response.data.market_data.current_price.sek;
                            const marketCapSEK = response.data.market_data.market_cap.sek;
                            const priceSGD = response.data.market_data.current_price.sgd;
                            const marketCapSGD = response.data.market_data.market_cap.sgd;
                            const priceTHB = response.data.market_data.current_price.thb;
                            const marketCapTHB = response.data.market_data.market_cap.thb;
                            const priceTRY = response.data.market_data.current_price.try;
                            const marketCapTRY = response.data.market_data.market_cap.try;
                            const priceTWD = response.data.market_data.current_price.twd;
                            const marketCapTWD = response.data.market_data.market_cap.twd;
                            const priceUAH = response.data.market_data.current_price.uah;
                            const marketCapUAH = response.data.market_data.market_cap.uah;
                            const priceUSD = response.data.market_data.current_price.usd;
                            const marketCapUSD = response.data.market_data.market_cap.usd;
                            const priceVEF = response.data.market_data.current_price.vef;
                            const marketCapVEF = response.data.market_data.market_cap.vef;
                            const priceVND = response.data.market_data.current_price.vnd;
                            const marketCapVND = response.data.market_data.market_cap.vnd;
                            const priceZAR = response.data.market_data.current_price.zar;
                            const marketCapZAR = response.data.market_data.market_cap.zar;
                            //basically repost the model here 
                            BlockchainModel
                                .findOneAndUpdate(
                                    {
                                        date: d
                                    },
                                    {
                                        priceAED: priceAED,
                                        marketCapAED: marketCapAED,
                                        priceARS: priceARS,
                                        marketCapARS: marketCapARS,
                                        priceAUD: priceAUD,
                                        marketCapAUD: marketCapAUD,
                                        priceBDT: priceBDT,
                                        marketCapBDT: marketCapBDT,
                                        priceBRL: priceBRL,
                                        marketCapBRL: marketCapBRL,
                                        priceCAD: priceCAD,
                                        marketCapCAD: marketCapCAD,
                                        priceCHF: priceCHF,
                                        marketCapCHF: marketCapCHF,
                                        priceCLP: priceCLP,
                                        marketCapCLP: marketCapCLP,
                                        priceCNY: priceCNY,
                                        marketCapCNY: marketCapCNY,
                                        priceCZK: priceCZK,
                                        marketCapCZK: marketCapCZK,
                                        priceDKK: priceDKK,
                                        marketCapDKK: marketCapDKK,
                                        priceEUR: priceEUR,
                                        marketCapEUR: marketCapEUR,
                                        priceGBP: priceGBP,
                                        marketCapGBP: marketCapGBP,
                                        priceHKD: priceHKD,
                                        marketCapHKD: marketCapHKD,
                                        priceHUF: priceHUF,
                                        marketCapHUF: marketCapHUF,
                                        priceIDR: priceIDR,
                                        marketCapIDR: marketCapIDR,
                                        priceILS: priceILS,
                                        marketCapILS: marketCapILS,
                                        priceINR: priceINR,
                                        marketCapINR: marketCapINR,
                                        priceJPY: priceJPY,
                                        marketCapJPY: marketCapJPY,
                                        priceKRW: priceKRW,
                                        marketCapKRW: marketCapKRW,
                                        priceMMK: priceMMK,
                                        marketCapMMK: marketCapMMK,
                                        priceMXN: priceMXN,
                                        marketCapMXN: marketCapMXN,
                                        priceIKR: priceIKR,
                                        marketCapIKR: marketCapIKR,
                                        priceMYR: priceMYR,
                                        marketCapMYR: marketCapMYR,
                                        priceNGN: priceNGN,
                                        marketCapNGN: marketCapNGN,
                                        priceNOK: priceNOK,
                                        marketCapNOK: marketCapNOK,
                                        priceNZD: priceNZD,
                                        marketCapNZD: marketCapNZD,
                                        pricePHP: pricePHP,
                                        marketCapPHP: marketCapPHP,
                                        pricePKR: pricePKR,
                                        marketCapPKR: marketCapPKR,
                                        pricePLN: pricePLN,
                                        marketCapPLN: marketCapPLN,
                                        pricePLN: pricePLN,
                                        marketCapPLN: marketCapPLN,
                                        priceRUB: priceRUB,
                                        marketCapRUB: marketCapRUB,
                                        priceSEK: priceSEK,
                                        marketCapSEK: marketCapSEK,
                                        priceSGD: priceSGD,
                                        marketCapSGD: marketCapSGD,
                                        priceTHB: priceTHB,
                                        marketCapTHB: marketCapTHB,
                                        priceTRY: priceTRY,
                                        marketCapTRY: marketCapTRY,
                                        priceTWD: priceTWD,
                                        marketCapTWD: marketCapTWD,
                                        priceUAH: priceUAH,
                                        marketCapUAH: marketCapUAH,
                                        priceUSD: priceUSD,
                                        marketCapUSD: marketCapUSD,
                                        priceVEF: priceVEF,
                                        marketCapVEF: marketCapVEF,
                                        priceVND: priceVND,
                                        marketCapVND: marketCapVND,
                                        priceZAR: priceZAR,
                                        marketCapZAR: marketCapZAR,
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    })
                                .then(function (doc) {
                                    console.log(`${d}: ${doc.priceUSD}, ${doc.marketCapUSD}, ${doc.priceCHF}, ${doc.marketCapCHF}, and all others updated`);
                                })
                                .catch(function (error) {
                                    console.error(error);
                                });
                        } else {
                            console.error(`no valid data for ${d.toUTCString()}`);
                        }
                    })
            }
        })
        .catch(error => {
            console.error(error);
        });
}

async function updateTotalSupplys() {
    let offset = 0;
    let statistics = []
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/statistics?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            // console.log(url);
            offset = response.data[response.data.length - 1].level + 1;  // update for next iteration
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                statistics.push(element);
            }
            if (response.data.length < 10000) {
                break;
            }
        } catch (error) {
            console.error(error);
        }
    }
    let lastDateNumber = 0;
    let lastTotalSupply = 0;
    let lastDateString = '';
    //updates the supply framework by iterating through the suppply query and updating the whole element section of the db
    for (let i = 0; i < statistics.length; i++) {
        const dateNumber = Math.floor(new Date(Date.parse(statistics[i].timestamp)).getTime() / (1000 * 60 * 60 * 24));
        if (dateNumber > lastDateNumber) {
            if (lastDateNumber !== 0) {
                StatisticModel.findOneAndUpdate(
                    {
                        dateString: lastDateString
                    },
                    {
                        dateString: lastDateString,
                        totalSupply: lastTotalSupply
                    },
                    {
                        new: true,
                        upsert: true
                    })
                    .then((doc) => {
                        console.log(`totalSupply on date ${doc.dateString} updated in database`);
                    }).catch((err) => {
                        console.error(err);
                    })
            }
        }
        lastDateNumber = dateNumber;
        lastTotalSupply = statistics[i].totalSupply;
        lastDateString = new Date(Date.parse(statistics[i].timestamp)).toISOString().substring(0, 10);
    }
}

async function updateCycles() {
    let offset = 0;
    let cycles = []
    while (true) {
        try {
            let url = `https://api.tzkt.io/v1/statistics/cyclic?offset=${offset}&limit=10000`;
            const response = await axios.get(url);
            // console.log(url);
            offset = response.data[response.data.length - 1].level + 1;  // update for next iteration
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                cycles.push(element);
            }
            if (response.data.length < 10000) {
                break;
            }
        } catch (error) {
            console.error(error);
        }
    }
    let cycleObj = {};
    for (let i = 0; i < cycles.length; i++) {
        const date = new Date(Date.parse(cycles[i].timestamp));
        const dateString = date.toISOString().substring(0, 10);
        cycleObj[dateString] = cycles[i].cycle + 1;
    }
    let days = Math.floor((new Date().getTime() - new Date(Date.parse("2018-06-30")).getTime()) / (1000 * 60 * 60 * 24));
    for (let i = 0; i <= days; i++) {
        let date = new Date(Date.parse("2018-06-30") + i * 24 * 60 * 60 * 1000);
        let dateString = date.toISOString().substring(0, 10);
        if (dateString in cycleObj) { 
            // handle with current cycle (latest cycle)
            if (dateString === cycles[cycles.length-1].timestamp.substring(0, 10)) {  // if this is the last cycle in returned data
                while (i <= days) {
                    date = new Date(date.getTime() + 1000 * 60 * 60 * 24);
                    cycleObj[date.toISOString().substring(0, 10)] = cycles[cycles.length-1].cycle + 1;
                    i += 1;
                }
                // break out of the loop
            }
        }
        else {
            const lastDate = new Date(date.getTime() - 1000 * 60 * 60 * 24);
            const lastDateString = lastDate.toISOString().substring(0, 10);
            cycleObj[dateString] = lastDateString in cycleObj? cycleObj[lastDateString]: 0;
        }
    }
    for (let i = 0; i <= days; i++) {
        const date = new Date(Date.parse("2018-06-30") + i * 24 * 60 * 60 * 1000);
        const dateString = date.toISOString().substring(0, 10);
        CycleModel.findOneAndUpdate(
            {
                dateString: dateString
            },
            {
                dateString: dateString,
                cycleNumber: cycleObj[dateString]
            },
            {
                new: true,
                upsert: true
            })
            .then((doc) => {
                console.log(`cycleNumber on date ${doc.dateString} updated in database`);
            }).catch((err) => {
                console.error(err);
            });
    }
}

module.exports = { updatePrices, updateTotalSupplys, updateCycles };
