// TODO: non relative imports

import {AnalysisObject} from "../AnalysisObject";
import axios, { AxiosRequestConfig } from "axios"; 
import {AxiosResponse} from "axios";
// data imports
import TezosPricesAndMarketCap from "../../../model/blockchain.js";
import TezosCycles from "../../../model/cycle.js";
import { version, Document, Model } from "mongoose";
import CycleAndDate from "../../../documentInterfaces/CycleAndDate";
import {collections, connectToDatabase} from "../../../documentInterfaces/database.service";
import cycle from "../../../model/cycle.js";
import {writeFile} from "fs";

// tezos specific constants
const REWARDADJUSTMENTDENOMINATOR: number = 1000000;
const BAKINGBADBATCHSIZE: number = 16;
const UNSCALEDAMOUNTTHRESHOLD: number = 0.0001;
const AMOUNTSCALER: number = 10000;

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
    date: Date,
    rewardAmount: number
}

interface PriceAndMarketCap {
    date: string,
    price: number,
    marketCap: number
}

class TezosSet {
    
    walletAddress: string;
    bakerCycles: Array<BakerCycle>;
    rewardsByDay: Array<RewardsByDay>;
    bakerAddresses: Set<string>;
    cyclesByDay: Array<CycleAndDate>;
    unaccountedNetTransactions: Array<TransactionsByDay>;
    transactionsUrl: string;
    nativeRewardFMVByDay: Array<RewardsByDay>;
    nativeRewardSupplyDepletionByDay: Array<RewardsByDay>;
    nativeRewardMarketDilutionByDay: Array<RewardsByDay>;
    delegatorRewardsUrl: string;
    fiat: string;
    balanceHistoryUrl: string;
    rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>;
    cyclesMappedToDays: Map<string, number>;
    isCustodial: boolean;
    rewardsByCycle: Array<RewardsByDay>;
    balancesByDay: Record<string, number>;
    PriceAndMarketCap: Array<PriceAndMarketCap>;


    constructor(){


    }

    async init(fiat: string, address: string): Promise<void>{ // TODO after building out analysis have init function create the complete 'unrealized' object
        this.walletAddress = address;
        this.rewardsByDay = [];
        this.nativeRewardFMVByDay = [];
        this.nativeRewardMarketDilutionByDay = [];
        this.nativeRewardSupplyDepletionByDay = [];
        this.balancesByDay = {};
        this.unaccountedNetTransactions = [];
        this.bakerCycles = [];
        this.cyclesByDay = [];
        this.PriceAndMarketCap = []
        this.fiat = fiat;
        this.cyclesMappedToDays = new Map<string, number>();
        this.bakerAddresses = new Set<string>();
        this.transactionsUrl = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${this.walletAddress}`;
        this.delegatorRewardsUrl = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0&limit=10000`;
        await this.getBalances();
        // await Promise.all([this.setRewardsAndTransactions(), this.getBalances()]);
        return
    }

   async getBakerRewards(): Promise<void> {
        this.rewardsByDay 
        let lastId = 0
        while (true){
            let url = `https://api.tzkt.io/v1/accounts/${address}/operations?type=endorsement,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&lastId=${lastId}&limit=1000&sort=0`;
            let response: AxiosResponse = await axios.get(url);
        }
       
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
        await connectToDatabase();
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

        this.rewardsByDay = this.cyclesByDay.map(cycleAndDateDoc => {
            return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber};
        });
        return
    }

    async getNetTransactions(): Promise<void> {
        // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude reward transactions
        // + Melange Payouts. add a rewardByDay to the rewardsByDay list   

        this.unaccountedNetTransactions = this.rawWalletTransactions.filter(transaction => {
            return (!(this.bakerAddresses.has(transaction?.sender?.address) || this.bakerAddresses.has(transaction?.target?.address)))
        }).map(transaction => {
            let transactionDate: Date = new Date(transaction.timestamp);
            let adjustedAmount: number = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
            let reward: TransactionsByDay = {date: transactionDate, rewardAmount: adjustedAmount};
            if (transaction?.target?.address === this.walletAddress){
                reward = {date: transactionDate, rewardAmount: adjustedAmount}
            }
            else if (transaction?.sender?.address === this.walletAddress){
                reward.rewardAmount = adjustedAmount * -1;
            }
            return reward
        });
        return
    }

    async getRawWalletTransactions(): Promise<void> { 
        let transactionsResponse: AxiosResponse = await axios.get(this.transactionsUrl);
        this.rawWalletTransactions = transactionsResponse.data.map(({target, sender, amount, timestamp}) => ({target, sender, amount, timestamp}));
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

    async setRewardsAndTransactions(): Promise<void> {
        await Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates() ,this.getRawWalletTransactions()]);
        if(this.isCustodial){
            this.processIntermediaryTransactions();
            await this.getNetTransactions();
        } 
        else{
            await Promise.all([this.retrieveBakersPayouts(), this.getNetTransactions()]);
        }
        this.filterPayouts();

    }

    filterPayouts(): void {
        // group "rewardsByDay", by cycle and only keep the item with the earliest date in each group -> save to rewardsByCycle
        this.rewardsByCycle = [];
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
                latestBalance = response.data[0].balance;
            }

            for(let day of response.data){
                // update the latestBalance since we're on the currently marked day
                if(day.timestamp.substring(0,10) === currentDay){
                    latestBalance = day.balance;
                }
                else{
                    // push the day and its last balance to our map since we're now on a new day
                    balances[currentDay] = latestBalance;

                    // get the range of dates from the currentDay to the day we are cheking on
                    let fillerDays = this.getNonInclusiveDateRange(currentDay, day.timestamp.substring(0,10));
                    // for these days, add the currentDays balance
                    for(let fillerDay of fillerDays){
                        balances[fillerDay] = latestBalance; 
                    }
                    currentDay = day.timestamp.substring(0,10);
                    latestBalance = day.balance;
                }
            
            }
        }
        // push the last day
        balances[currentDay] = latestBalance;
        this.balancesByDay = balances;
        return
    }


    async getRewards(){ // depricated
        await connectToDatabase();

        // get history of delegators bakers 
        let delegatorRewardsResponse: AxiosResponse = await axios.get(this.delegatorRewardsUrl);

        let filteredResponse:Array<{cycle: number, balance: number, baker: {alias: string, address: string}}> =
        delegatorRewardsResponse.data.map(({cycle, balance, baker}) => ({cycle, balance, baker}));


        // map bakers to their start and end cycles

        let bakerCylcles: Array<BakerCycle> = [];
        let bakers: Set<string> = new Set<string>();
        let curBakerIndex: number = bakerCylcles.length;
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
                bakerCylcles.push(curBaker);
                bakers.add(cycleData.baker.address);
                curBaker = {bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: []};
            } 
        
        }
        this.setRewardsUrls(curBaker)
        bakerCylcles.push(curBaker)
        bakers.add(curBaker.bakerAddress)

        // put together all baker reward request urls and call api to get payoutArrays
        // NOTE: requests are chunked in groups of 16 to prevent rate limiting issues
        let completeRewardsRequests: Array<string> = bakerCylcles.map(bakerCylcle => {return bakerCylcle.rewardsRequests}).flat()
        let j, temporary, chunk: number = 16;
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
                console.log("NO PAYOUT DATA ", response.data)
            }
            else{
                response.data.payouts.forEach(payout => {
                    if(payout.address === this.walletAddress){
                        let amount: number = payout["amount"]
                        if(amount < 0.0001 && amount > 0) {
                            amount = amount * 10000;
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

        
        // get mapping of cycles to dates
        const cyclesAndDates = (await collections.cycleAndDate.find({}).toArray()) as CycleAndDate[];
        let rewardsByDay: Array<RewardsByDay> = cyclesAndDates.map(cycleAndDateDoc => {
            return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber};
        });

        // get wallet transactions
        let transactionsResponse: AxiosResponse = await axios.get(this.transactionsUrl);
        let transactions:Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}> =
        transactionsResponse.data.map(({target, sender, amount, timestamp}) => ({target, sender, amount, timestamp}));

        let filteredTransactions: Array<TransactionsByDay> = transactions.filter(transaction => {
            (!(bakers.has(transaction?.sender?.address) || bakers.has(transaction?.target?.address)) )
        }).map(transaction => {
            let transactionDate: Date = new Date(transaction.timestamp);
            let adjustedAmount: number = transaction.amount / 1000000;
            let reward: TransactionsByDay = {date: transactionDate, rewardAmount: adjustedAmount};
            if (transaction?.target?.address === this.walletAddress){
                reward = {date: transactionDate, rewardAmount: adjustedAmount}
            }
            else if (transaction?.sender?.address === this.walletAddress){
                reward.rewardAmount = adjustedAmount * -1;
            }
            return reward
        });
        
        return [ rewardsByDay, filteredTransactions ];

    }

    async nativeRewardFMV(): Promise<void> {
//rewards by day by price that day
        let prices = this.getPrice(this.fiat)
        this.rewardsByDay.forEach(reward => {
            let date = reward.date
            let quantity = reward.rewardAmount
            let cycle = reward.cycle

            rewardAmount = quantity * prices[date] 

            this.nativeRewardFMVByDay return {}

        })
//print the array i want from the ts object
        

this.nativeRewardFMVByDay
    }

    async getPrice(fiat: string): Promise<void>{
        let priceAndMarketCapData = await BlockchainModel.find();
        let price = `price${fiat}`;
        let marketCap = `marketCap${fiat}`;
        let finalData = [];
        for (i = 0; i < priceAndMarketCapData.length; i++) {
            let date = priceAndMarketCapData[i].date;
            // convert year month day to month day year
            var date_arr1 = date.toString().split("-");
            var date_arr2 = [date_arr1[1], date_arr1[2], date_arr1[0]];
            date = date_arr2.join("-");

            let priceN = priceAndMarketCapData[i][price];
            let marketCapN = priceAndMarketCapData[i][marketCap];
            let finalObj = {
                date: date,
                price: priceN,
                marketCap: marketCapN,
            };
            finalData.push(finalObj);
	}
    //need help populating the interface in the loop
    this.PriceAndMarketCap = finalData
return 
    } 


    async nativeInvestmentBookValueByDomain(): Promise<void> {
        // For Net transactions
        // *p that day (last investment domain value) -> array investmentBV by date domains 
        
        // InvestmentBV
        // Fiat
        // StartDate
        // Enddate
    }



    async nativeSupplyDepletionRewards(): Promise<void>{

//         BV fiat of the investment by daily supply change during same period = that day depletion

// Start at the begining of the bv domain: 
// Supply each of the days thru the the bv array


// Agg the three days of depletion between native rewards. Add to the rewards for new set

    }


    async nativeMarketDiltuionRewards(): Promise<void>{

//         Daily change in network value 
// Daily change in user value 
// If diff positive:
// daily market dilution = Difference * bv fiat during the time period 
// Agg then add to rewards
    }


    // utility methods:
    setRewardsUrls(bakerData: BakerCycle): void{ 
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.baking-bad.org/v2/rewards/${bakerData.bakerAddress}?cycle=${i}`);
        }
    }

    setBakerRewardsUrls(): void{ 
        //while lastId doesnot equal current id ,  or just always make 10,000
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.tzkt.io/v1/accounts/${address}/operations?type=endorsement,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&lastId=${lastId}&limit=800&sort=0`);
        }
    }





}

let ts: TezosSet = new TezosSet();
ts.init("","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH").then(x => {writeFile("test.json", JSON.stringify(ts.balancesByDay, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + "test.json");
    }
})});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
