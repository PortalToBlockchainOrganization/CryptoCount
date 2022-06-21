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

interface FinalRewards {
    date: Date,
    rewardAmount: number
}


class TezosSet {
    
    walletAddress: string;

    constructor(){


    }

    // FIX ME: implement in child class
    async init(fiat: string, address: string){
        this.walletAddress = address;


    }

    async getRewards(){
        // method specific static strings
        let transactionsUrl: string = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${this.walletAddress}`;
        let delegatorRewardsUrl: string = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0&limit=10000`;


        await connectToDatabase();

        // get history of delegators bakers 
        let delegatorRewardsResponse: AxiosResponse = await axios.get(delegatorRewardsUrl);

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

        // put together all baker reward requests and call api to get payoutArrays

        // requests are chunked in groups of 16 to prevent rate limiting issues
        let completeRewardsRequests: Array<string> = bakerCylcles.map(bakerCylcle => {return bakerCylcle.rewardsRequests}).flat()
        let j, temporary, chunk: number = 16;
        let responses: Array<AxiosResponse> = [];
        
        for (let i: number = 0,j = completeRewardsRequests.length; i < j; i += chunk) {
            temporary = completeRewardsRequests.slice(i, i + chunk);
            let response: Array<AxiosResponse> = await axios.all(temporary.map(url=> axios.get(url)));
            responses.push(...response)
        }


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
        let transactionsResponse: AxiosResponse = await axios.get(transactionsUrl);
        console.log(transactionsResponse);
        let transactions:Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}> =
        transactionsResponse.data.map(({target, sender, amount, timestamp}) => ({target, sender, amount, timestamp}));

        let adjustedRewards: Array<FinalRewards> = transactions.map(transaction => {
            let transactionDate: Date = new Date(transaction.timestamp);
            let adjustedAmount: number = transaction.amount / 1000000;
            let reward: FinalRewards = {date: transactionDate, rewardAmount: adjustedAmount};
            if (transaction?.target?.address === this.walletAddress){
                reward = {date: transactionDate, rewardAmount: adjustedAmount}
            }
            else if (transaction?.sender?.address === this.walletAddress){
                reward.rewardAmount = adjustedAmount * -1;
            }
            if (!(bakers.has(transaction?.sender?.address) || bakers.has(transaction?.target?.address))) {
                //check for baker transactions
                return reward
            }


        });

        console.log(rewardsByDay, adjustedRewards);

        // return [ rewardsByDay, adjustedRewards ];

    }
        

    

    // utility methods:
    setRewardsUrls(bakerData: BakerCycle){ 
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.baking-bad.org/v2/rewards/${bakerData.bakerAddress}?cycle=${i}`);
        }
    }
        
}

let ts: TezosSet = new TezosSet();
ts.init("","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH")
ts.getRewards();
