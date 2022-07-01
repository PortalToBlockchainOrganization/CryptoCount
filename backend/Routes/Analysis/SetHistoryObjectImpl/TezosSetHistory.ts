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

class TezosSet {
    
    walletAddress: string;
    bakerCycles: Array<BakerCycle>;
    rewardsByDay: Array<RewardsByDay>;
    bakerAddresses: Set<string>;
    cyclesByDay: Array<CycleAndDate>;
    unaccountedNetTransactions: Array<TransactionsByDay>;
    transactionsUrl: string;
    delegatorRewardsUrl: string;
    rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>;
    cyclesMappedToDays: Map<string, number>;


    constructor(){


    }

    async init(fiat: string, address: string): Promise<void>{ // TODO after building out analysis have init function create the complete 'unrealized' object
        this.walletAddress = address;
        this.rewardsByDay = [];
        this.unaccountedNetTransactions = [];
        this.bakerCycles = [];
        this.cyclesByDay = [];
        this.cyclesMappedToDays = new Map<string, number>();
        this.bakerAddresses = new Set<string>();
        this.transactionsUrl = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${this.walletAddress}`;
        this.delegatorRewardsUrl = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0&limit=10000`;
        await this.setRewardsAndTransactions();
        return
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
        this.cyclesByDay = (await collections.cycleAndDate.find({}).toArray()) as CycleAndDate[];
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
        // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude those 
        // + if Melange Payouts is found - add a rewardByDay to the rewardsByDay list   
        let transactionsResponse: AxiosResponse = await axios.get(this.transactionsUrl);
        this.rawWalletTransactions = transactionsResponse.data.map(({target, sender, amount, timestamp}) => ({target, sender, amount, timestamp}));

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
            // TODO: split into 4 methods 

        // run these first two in parralel 
            // 1. retrieveBakers: retrieve bakers and the cycles associated with this delegator mainly, 
            // set the set of bakerAddresses and the mapping of bakers to the cycles which this delegator recieved rewards from
            // 2. retrieveCyclesAndDates: retrieve the cycle data we have in our database and store it 

        // run these two in parralel
            // 3. retrieveBakersPayouts: retrieve the payout rewards that were distributed by the bakers for their 
            //                          associated cycles and map those to the dates associated with those cycles
            // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude those 
            // 5. processIntermediaryTransactions: if Melange Payouts is found in wallet transactions - add a rewardByDay to the rewardsByDay list

        await Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates()])

        await Promise.all([this.retrieveBakersPayouts(), this.getNetTransactions()])
        this.processIntermediaryTransactions();

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

    // utility methods:
    setRewardsUrls(bakerData: BakerCycle): void{ 
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.baking-bad.org/v2/rewards/${bakerData.bakerAddress}?cycle=${i}`);
        }
    }
}

let ts: TezosSet = new TezosSet();
ts.init("","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH").then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
