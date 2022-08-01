// TODO: non relative imports

import {AnalysisObject} from "../AnalysisObject";
import axios, { AxiosRequestConfig } from "axios"; 
import {AxiosResponse} from "axios";
// data imports
import TezosPricesAndMarketCap from "../../../model/blockchain.js";
import TezosCycles from "../../../model/cycle.js";
import { version, Document, Model } from "mongoose";
import CycleAndDate from "../../../documentInterfaces/CycleAndDate";
import PriceAndMarketCap from "../../../documentInterfaces/PriceAndMarketCap";
import CurrencySupplyAndDate from "../../../documentInterfaces/CurrencySupplyAndDate";

import {collections, connectToDatabase} from "../../../documentInterfaces/database.service";
import cycle from "../../../model/cycle.js";
import {writeFile} from "fs";

// tezos specific constants
const REWARDADJUSTMENTDENOMINATOR: number = 1000000;
const BAKINGBADBATCHSIZE: number = 16;
const UNSCALEDAMOUNTTHRESHOLD: number = 0.0001;
const AMOUNTSCALER: number = 10000;
const TRANSACTIONURLLIMIT = 10000;
const MUTEZ: number = 1000000;
// define intermediary data holders as interfaces
interface BakerCycle {
    bakerAddress: string;
    cycleStart: number;
    cycleEnd: number;
    rewardsRequests: Array<string>;
}
interface PayoutCycleReward {
    quantity: number,
    cycle: number
}

interface RewardsByDay {
    date: string,
    rewardAmount: number,
    cycle: number
}

interface TransactionsByDay {
    date: string,
    amount: number
}

interface PriceAndMarketCapByDay {
    date: string,
    price: number,
    marketCap: number
}

interface BVbyDomain {
    startDate: string,
    endDate: string,
    scaledBookValue: number
}

interface DepletionByDay{
    date: string,
    amount: number
}

class TezosSet {
    fiat: string;
    walletAddress: string;
    bakerCycles: Array<BakerCycle>;
    rewardsByDay: Array<RewardsByDay>;
    bakerAddresses: Set<string>;
    cyclesByDay: Array<CycleAndDate>;
    supplyByDay: Array<CurrencySupplyAndDate>;
    unaccountedNetTransactions: Array<TransactionsByDay>;
    transactionsUrl: string;
    delegatorRewardsUrl: string;
    balanceHistoryUrl: string;
    rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>;
    cyclesMappedToDays: Map<string, number>;
    isCustodial: boolean;
    rewardsByCycle: Array<RewardsByDay>;
    balancesByDay: Record<string, number>;
    pricesAndMarketCapsByDay: Map<string, PriceAndMarketCapByDay>;
    nativeRewardsFMVByCycle: Array<RewardsByDay>;
    investmentsScaledBVByDomain: Array<BVbyDomain>;
    nativeSupplyDepletion: Array<DepletionByDay>;
    nativeSupplyDepletionRewards: Array<RewardsByDay>;
    constructor(){


    }

    async init(fiat: string, address: string): Promise<void>{ // TODO after building out analysis have init function create the complete 'unrealized' object
        this.walletAddress = address;
        this.fiat = fiat;
        this.pricesAndMarketCapsByDay = new Map<string, PriceAndMarketCapByDay>();
        this.rewardsByDay = [];
        this.balancesByDay = {};
        this.unaccountedNetTransactions = [];
        this.bakerCycles = [];
        this.cyclesByDay = [];
        this.supplyByDay = [];
        this.rawWalletTransactions = [];
        this.nativeSupplyDepletion = [];
        this.rewardsByCycle = [];
        this.cyclesMappedToDays = new Map<string, number>();
        this.bakerAddresses = new Set<string>();
        this.transactionsUrl = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${this.walletAddress}&limit=10000`;
        this.delegatorRewardsUrl = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0&limit=10000`;
        this.nativeRewardsFMVByCycle = new Array<RewardsByDay>();
        this.nativeSupplyDepletionRewards = new Array<RewardsByDay>();


        await connectToDatabase();
        // get data from apis + db
        await Promise.all([this.getRewardsAndTransactions(), this.getBalances(), this.getPricesAndMarketCap()]);
        // conduct analysis
        this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
        this.investmentsScaledBVByDomain = this.calculateInvestmentBVByDomain();
        await this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain);
        // await analysis();

        return
    }

    async analysis(): Promise<any> {
        //calculateInvestmentBVByDomain

    }

    calculateNativeRewardFMVByCycle(): Array<RewardsByDay> {
        //rewards by day by price that day
        return this.rewardsByCycle.map(reward => {
            return {date: reward.date, rewardAmount: reward.rewardAmount*this.pricesAndMarketCapsByDay[reward.date].price, cycle:reward.cycle}
        })
    }

    async calculateNativeSupplyDepletionRewards(scaledBVByDomain: Array<BVbyDomain>): Promise<void> {
        // do this in some earlier method
        this.supplyByDay = (await collections.tezosSupply.find().sort( { dateString: 1 } ).toArray()) as CurrencySupplyAndDate[];

        // expand date ranges of bvinvestments to a mapping of single dates to bv values
        let mappedBV: Map<string, number> = new Map(); 
        scaledBVByDomain.forEach(bvDomain => {
            // iterate over the date range (inclusive)
            let startDate: Date = new Date(bvDomain.startDate);
            let endDate: Date = new Date(bvDomain.endDate);
            while(startDate<=endDate){
                mappedBV[startDate.toISOString().slice(0,10)] = bvDomain.scaledBookValue;
                startDate.setDate(startDate.getDate() + 1);
            }
        })


        // for each day in our supply db documents - mark the change in supply (ie change in supply for date [i] = 1-(supply[i-1]/supply[i]))
        // find the scaledbv that represents the range the date [i] is in and mulitply that scaledbv value to the value above
        // ex: end up with a day associated with that value
        let nativeSupplyDepletionByDay: Array<DepletionByDay> 
        let filteredSupplyByDay: Array<CurrencySupplyAndDate> = this.supplyByDay.filter(supply =>
            supply.dateString in mappedBV
        );
        
        let lastSupply: CurrencySupplyAndDate = filteredSupplyByDay[0];
        
        nativeSupplyDepletionByDay = filteredSupplyByDay.slice(1).map(supply => {
            let ratio: number = lastSupply.totalSupply/supply.totalSupply;
            if (lastSupply.dateString === supply.dateString){
                return
            }
            lastSupply = supply;
            return {date: supply.dateString, amount: (1 - ratio) * mappedBV[supply.dateString]}
        });

        console.log(nativeSupplyDepletionByDay);

        let mappedFMV: Map<string, RewardsByDay> = new Map();
        this.nativeRewardsFMVByCycle.forEach(fmvReward=> {
            mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
        });
        console.log(mappedFMV)


        let mappedCyclesToFirstCycleDate: Map<number, string> = new Map();
        this.cyclesMappedToDays.forEach((key,value) => {
            mappedCyclesToFirstCycleDate[value] = key;
        })

        let nativeSupplyDepletionRewards: Array<RewardsByDay> = [];
        let currentDate: string = nativeSupplyDepletionByDay[0].date
        let currentSupplyCycle: number = mappedCyclesToFirstCycleDate[currentDate];
        console.log(currentSupplyCycle)
        let aggSupplyAmount: number = nativeSupplyDepletionByDay[0].amount;



        nativeSupplyDepletionByDay.forEach(nativeSupplyDepletion => {  
            if(this.cyclesMappedToDays.get(nativeSupplyDepletion.date)!==currentSupplyCycle){
                nativeSupplyDepletionRewards.push({date: this.cyclesMappedToDays[currentSupplyCycle], 
                    rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount, 
                    cycle: currentSupplyCycle})

                currentDate = nativeSupplyDepletion.date;
                currentSupplyCycle = mappedCyclesToFirstCycleDate[currentDate];
                aggSupplyAmount = nativeSupplyDepletion.amount;
            }
            else if(nativeSupplyDepletion.date===nativeSupplyDepletionByDay[nativeSupplyDepletionByDay.length-1].date){
                aggSupplyAmount+=nativeSupplyDepletion.amount;
                nativeSupplyDepletionRewards.push({date: this.cyclesMappedToDays[currentSupplyCycle], 
                    rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount, 
                    cycle: currentSupplyCycle})
            }
            else{
                aggSupplyAmount+=nativeSupplyDepletion.amount;
            }

        })

        console.log(nativeSupplyDepletionRewards)

    }


    calculateInvestmentBVByDomain(): Array<BVbyDomain> {
       //i. scale transactions by fiat + add investment book value
        //  - first investment book value is value of first transactiosn
        //  - every subsequent bv is the the last bv + the current transaction amount 
        //  - startDate is the day of the current transaction
        //  - endDate is the day before the next transaction 


        // group by date
        let groupedTransactions: Map<string, TransactionsByDay> = new Map<string, TransactionsByDay>();
        this.unaccountedNetTransactions.forEach(transaction => {
            groupedTransactions[transaction.date] = {date: transaction.date, amount: transaction.date in groupedTransactions ? groupedTransactions[transaction.date].amount + transaction.amount : transaction.amount}
        })
        let groupedTransactionsArray: Array<TransactionsByDay> = Object.values(groupedTransactions);

        // create array of date ranges inclusive mapped to the scaledbookvalues
        let scaledBVByDomain: Array<BVbyDomain> = []; 
        for(let i: number = 0; i < groupedTransactionsArray.length; i++){
            // determine the date range
            let startDate: string = groupedTransactionsArray[i].date;
            
            let nextDay: Date = new Date(groupedTransactionsArray[i].date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            let nextDate: Date = undefined;

            // if the current transaction is the last one in our array 
            // we'll bound the end with todays date
            if(i===groupedTransactionsArray.length-1){
                nextDate = new Date();
            }
            else{
                nextDate = new Date(groupedTransactionsArray[i+1].date);
                nextDate.setDate(nextDate.getDate() - 1);
            }
            let endDate: string = ""; 
            // if the next transactions date is the day after the current transaction 
            // the end date for the current transaction will be the same as the start
            if(nextDay.toISOString().slice(0,10).localeCompare(nextDay.toISOString().slice(0,10))){
                endDate = startDate;
            }
            else{
                // endDate is the day before the nextdate 
                endDate = nextDate.toISOString().slice(0,10);
            }

            let bvValue: number = groupedTransactionsArray[i].amount;
            if(i!==0){
                bvValue += scaledBVByDomain[scaledBVByDomain.length - 1].scaledBookValue;
            }
            scaledBVByDomain.push({startDate: startDate, endDate: endDate, scaledBookValue: bvValue})

        }
        return scaledBVByDomain;
    }


    // async retrieval methods
    async retrieveBakers(): Promise<void> {
        // 1. retrieveBakers: retrieve bakers and the cycles associated with this delegator mainly, 
        // set the set of bakerAddresses and the mapping of bakers to the cycles which this delegator recieved rewards from
        
        // get history of delegators bakers 
        let delegatorRewardsResponse: AxiosResponse = await axios.get(this.delegatorRewardsUrl);

        let filteredResponse:Array<{cycle: number, balance: number, baker: {alias: string, address: string}}> =
        delegatorRewardsResponse.data.map(({cycle, balance, baker}) => ({cycle, balance, baker}));

        // map bakers to their start and end cycles
        let curBaker: BakerCycle = undefined;
        
        for (let cycleData of filteredResponse.reverse()){
            // initial baker
            if(curBaker === undefined){
                curBaker = {bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: []};
            }
            // extend cycle end
            if (curBaker.bakerAddress===cycleData.baker.address){
                curBaker.cycleEnd = cycleData.cycle;
            }
            // push curBaker, start new baker
            else {
                this.setRewardsUrls(curBaker);
                this.bakerCycles.push(curBaker);
                this.bakerAddresses.add(cycleData.baker.address);
                curBaker = {bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: []};
            } 
        
        }
        this.setRewardsUrls(curBaker)
        this.bakerCycles.push(curBaker)
        this.bakerAddresses.add(curBaker.bakerAddress)
        return
    }

    async retrieveCyclesAndDates(): Promise<void> {
        // 2. retrieveCyclesAndDates: retrieve the cycle data we have in our database and store it // get mapping of cycles to dates
        this.cyclesByDay = (await collections.cycleAndDate.find().sort( { dateString: 1 } ).toArray()) as CycleAndDate[];
        this.cyclesByDay.forEach(cycleByDay => (this.cyclesMappedToDays.set(cycleByDay.dateString, cycleByDay.cycleNumber)));
        return
    }

    async retrieveBakersPayouts(): Promise<void> {
        // put together all baker reward request urls and call api to get payoutArrays
        // NOTE: requests are chunked in groups of 16 to prevent rate limiting issues
        let completeRewardsRequests: Array<string> = this.bakerCycles.map(bakerCycle => {return bakerCycle.rewardsRequests}).flat();
        let j, temporary, chunk: number = BAKINGBADBATCHSIZE;
        let responses: Array<AxiosResponse> = [];
        
        for (let i: number = 0,j = completeRewardsRequests.length; i < j; i += chunk) {
            temporary = completeRewardsRequests.slice(i, i + chunk);
            let response: Array<AxiosResponse> = await axios.all(temporary.map(url=> axios.get(url)));
            responses.push(...response)
        }

        // map cycles to reward amounts
        let rewards: Record<number, number> = {};
        responses.forEach(response => {
            if (response?.data?.payouts === undefined){
                console.log("No payout data found in a response");
            }
            else{
                response.data.payouts.forEach(payout => {
                    if(payout.address === this.walletAddress){
                        let amount: number = payout["amount"]
                        if(amount < UNSCALEDAMOUNTTHRESHOLD && amount > 0) {
                            amount = amount * AMOUNTSCALER;
                        }
                        if(rewards[response.data.cycle]===undefined){
                            rewards[response.data.cycle] = amount; 
                        }
                        else{
                            rewards[response.data.cycle] += amount;
                        }
                    }
                })
            }
        });
        this.rewardsByDay = this.cyclesByDay.filter(cycleAndDateDoc => cycleAndDateDoc.cycleNumber.toString() in rewards).map(cycleAndDateDoc => {
            return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber.toString()], cycle: cycleAndDateDoc.cycleNumber};
        });
        return
    }

    getNetTransactions(): void {
        // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude reward transactions
        // + Melange Payouts. add a rewardByDay to the rewardsByDay list   

        this.unaccountedNetTransactions = this.rawWalletTransactions.filter(transaction => {
            return (!(this.bakerAddresses.has(transaction?.sender?.address) || this.bakerAddresses.has(transaction?.target?.address)))
        }).map(transaction => {
            let transactionDate: string = new Date(transaction.timestamp).toISOString().slice(0,10);
            let adjustedAmount: number = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
            let amount: TransactionsByDay = {date: transactionDate, amount: adjustedAmount};
            if (transaction?.target?.address === this.walletAddress){
                amount = {date: transactionDate, amount: adjustedAmount}
            }
            else if (transaction?.sender?.address === this.walletAddress){
                amount.amount = adjustedAmount * -1;
            }
            return amount
        });
        return
    }

    async getRawWalletTransactions(): Promise<void> { 
        let transactionsLength: number = TRANSACTIONURLLIMIT;
        while(transactionsLength===TRANSACTIONURLLIMIT){
            let transactionsResponse: AxiosResponse = await axios.get(this.transactionsUrl);
            let transactionsResponseArray: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}> = 
                transactionsResponse.data.map(({target, sender, amount, timestamp}) => ({target, sender, amount, timestamp}));
            this.rawWalletTransactions.push(...transactionsResponseArray);
            transactionsLength = transactionsResponseArray.length;
        }
        this.rawWalletTransactions.forEach(transaction => {
            if(transaction?.sender?.alias === "Melange Payouts")
                this.isCustodial = true;
        })
        this.isCustodial = false;
    }

    processIntermediaryTransactions(): void {
        let intermediaryTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}> = this.rawWalletTransactions.filter(transaction => {
            (transaction?.sender?.alias === "Melange Payouts")
        });

        let intermediaryRewards: Array<RewardsByDay> = intermediaryTransactions.map(transaction => {
            let transactionDate: string = transaction.timestamp.slice(0,10);
            let adjustedAmount: number = transaction.amount/REWARDADJUSTMENTDENOMINATOR;
            let cycleNumber: number = this.cyclesMappedToDays.get(transactionDate);
            let reward: RewardsByDay = {date: transactionDate, rewardAmount: adjustedAmount, cycle: cycleNumber};
            return reward;
        })
        this.rewardsByDay.push(...intermediaryRewards);
        return
    }

    async getRewardsAndTransactions(): Promise<void> {
        await Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates() ,this.getRawWalletTransactions()]);
        if(this.isCustodial){
            this.processIntermediaryTransactions();
            this.getNetTransactions();
        } 
        else{
            await this.retrieveBakersPayouts();
            this.getNetTransactions();
        }
        this.filterPayouts();

    }

    filterPayouts(): void {
        // group "rewardsByDay", by cycle and only keep the item with the earliest date in each group -> save to rewardsByCycle
        let currentItem = this.rewardsByDay[this.rewardsByDay.length - 1];
        for (const reward of this.rewardsByDay.slice().reverse()){
            if (reward.cycle !== currentItem.cycle){
                this.rewardsByCycle.push(currentItem);
            }
            currentItem = reward;
        }
        if(this.rewardsByDay[0].date===currentItem.date){
            this.rewardsByCycle.push(currentItem);
        }
        return
    };

    getNonInclusiveDateRange(startDateString: string, endDateString: string): Array<string>{
        // non inclusive on both sides
        let dates: Array<string> = [];
        var now = new Date();
        let endDate = new Date(endDateString);
        
        // start on next day following startDate
        let startDate = new Date(startDateString);
        startDate.setDate(startDate.getDate()+1)
        var daysOfYear = [];

        // end on day before endDate
        for (startDate; startDate < endDate; startDate.setDate(startDate.getDate() + 1)) {
            dates.push(startDate.toISOString().split('T')[0]);
        }

        return dates;
    }

    async getBalances(): Promise<void> {
        // this method will retrieve the balances associated with the user wallet
        // for each day present in the returned api body, we will associate that day with the
        // latest available balance of that day
        // for the days not present, we will associate those
        // days with the balance of the last available day's last available balance

        let balances: Record<string, number> = {};

        //offset from index
        let offset = 0;
        let resp_len = 10000;
        let currentDay: string = null;
        let latestBalance: number = null;
        while (resp_len === 10000) {
            let url = `https://api.tzkt.io/v1/accounts/${this.walletAddress}/balance_history?offset=${offset}&limit=10000`;
            let response: AxiosResponse = await axios.get(url);

            // update the response length to indicate when we've reached the end of the balance history
            resp_len = response.data.length;
            offset += response.data.length;

            // for each day, have the balance equal the latest balance of that day
            if(currentDay === null){
                currentDay = response.data[0].timestamp.substring(0,10);
            }
            if(latestBalance === null){
                latestBalance = response.data[0].balance/MUTEZ;
            }

            for(let day of response.data){
                // update the latestBalance since we're on the currently marked day
                if(day.timestamp.substring(0,10) === currentDay){
                    latestBalance = day.balance/MUTEZ;
                }
                else{
                    // push the day and its last balance to our map since we're now on a new day
                    balances[currentDay] = latestBalance/MUTEZ;

                    // get the range of dates from the currentDay to the day we are cheking on
                    let fillerDays = this.getNonInclusiveDateRange(currentDay, day.timestamp.substring(0,10));
                    // for these days, add the currentDays balance
                    for(let fillerDay of fillerDays){
                        balances[fillerDay] = latestBalance/MUTEZ; 
                    }
                    currentDay = day.timestamp.substring(0,10);
                    latestBalance = day.balance/MUTEZ;
                }
            
            }
        }
        // push the last day
        balances[currentDay] = latestBalance/MUTEZ;
        this.balancesByDay = balances;
        return
    }

    async getPricesAndMarketCap() {

        let price = `price${this.fiat}`;
        let marketCap = `marketCap${this.fiat}`;
        let priceAndMarketCapData: Array<PriceAndMarketCap>  = (await collections.priceAndMarketCap.find().sort( { date: 1 } ).toArray()) as PriceAndMarketCap[];
        priceAndMarketCapData.forEach(
            priceAndMarketCap => {
                // date reformatting
                let dateSplit: string[] = priceAndMarketCap.date.toString().split("-");
                dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                let correctedDate: string = dateSplit.join("-");
                this.pricesAndMarketCapsByDay[correctedDate] = {date: correctedDate, price: priceAndMarketCap[price], marketCap: priceAndMarketCap[marketCap]}
            }
        )
        return
    }

    // utility methods:
    setRewardsUrls(bakerData: BakerCycle): void{ 
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.baking-bad.org/v2/rewards/${bakerData.bakerAddress}?cycle=${i}`);
        }
    }
    
}

let ts: TezosSet = new TezosSet();
ts.init("USD","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH").then(x => {writeFile("test.json", JSON.stringify(ts.nativeRewardsFMVByCycle, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + "test.json");
    }
})});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});