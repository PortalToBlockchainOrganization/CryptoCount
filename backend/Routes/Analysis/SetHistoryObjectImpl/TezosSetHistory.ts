// TODO: non relative imports

import {AnalysisObject} from "../AnalysisObject";
import axios, { AxiosRequestConfig } from "axios"; 
import {AxiosResponse} from "axios";
// data imports
import TezosPricesAndMarketCap from "../../../model/blockchain.js";
import TezosCycles from "../../../model/cycle.js";
import { version } from "mongoose";
import cycle from "../../../model/cycle.js";

// define intermediary data holders as interfaces
interface BakerCycle {
    bakerAddress: String;
    cycleStart: number;
    cycleEnd: number;
    rewardsRequests: Array<string>;
}

interface RewardObject {
    quantity: number,
    cycle: number
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
        // get history of delegators bakers 
        let url: string = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0&limit=10000`;
        let response:AxiosResponse = await axios.get(url);

        let filteredResponse:Array<{cycle: number, balance: number, baker: {alias: string, address: string}}> =
            response.data.map(({cycle, balance, baker}) => ({cycle, balance, baker}));


        // map bakers to their start and end cycles

        let bakerCylcles: Array<BakerCycle> = [];
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
                this.setRewardsUrls(curBaker)
                bakerCylcles.push(curBaker)
                curBaker = {bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: []};
            } 
        
        }
        this.setRewardsUrls(curBaker)
        bakerCylcles.push(curBaker)

        // put together all baker reward requests and call api to get payoutArrays

        let completeRewardsRequests: Array<string> = bakerCylcles.map(bakerCylcle => {return bakerCylcle.rewardsRequests}).flat()
        let j, temporary, chunk: number = 16;
        let responses: Array<AxiosResponse> = [];
        
        for (let i: number = 0,j = completeRewardsRequests.length; i < j; i += chunk) {
            temporary = completeRewardsRequests.slice(i, i + chunk);
            let response: Array<AxiosResponse> = await axios.all(temporary.map(url=> axios.get(url)));
            // do whatever
            responses.push(...response)
        }

        // filter payoutArrays to only get payout sent to delegator wallet
        let rewardObjects: Array<RewardObject> = responses.map(response => {
            let payouts: Array<number> = response.data.payouts;
            if (payouts === undefined){
                console.log("NO PAYOUT DATA ", response.data)
            }
            else{
                return payouts.filter(payout => {
                    this.walletAddress === payout["address"];
                }).map(payout => {
                    let amount: number = payout["amount"]
                    if(amount < 0.0001 && amount > 0{
                        amount = amount * 10000;
                    }
                    let rewardObject: RewardObject = {
                        quantity: amount,
                        cycle: response.data.cycle
                    };
                    return rewardObject
            }))
            }

        })

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
