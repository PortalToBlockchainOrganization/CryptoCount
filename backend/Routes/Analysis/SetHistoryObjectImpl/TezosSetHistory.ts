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
import { Timestamp } from "mongodb";

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

interface DilutionByDay{
    date: string,
    amount: number
}

interface MarketByDay{
    date: string,
    amount: number
}

interface PriceByDay{
    date: string,
    amount: number
}

//create superclass History Object State Holder

class TezosSet {

    fiat: string;
    walletAddress: string;
    firstRewardDate: string;
    priceByDay: Array<PriceByDay>
    bakerCycles: Array<BakerCycle>;
    rewardsByDay: Array<RewardsByDay>;
    bakerAddresses: Set<string>;
    consensusRole: string;
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
    nativeMarketDilutionRewards: Array<RewardsByDay>;
    nativeSupplyDepletionRewards: Array<RewardsByDay>;
    marketByDay: Array<MarketByDay>;
    unrealizedNativeRewards: Array<RewardsByDay>;
    unrealizedNativeFMVRewards: Array<RewardsByDay>;
    unrealizedNativeMarketDilutionRewards: Array<RewardsByDay>;
    unrealizedNativeSupplyDepletionRewards: Array<RewardsByDay>;
    realizingNativeRewards: Array<RewardsByDay>;
    realizingNativeFMVRewards: Array<RewardsByDay>;
    realizingNativeMarketDilutionRewards: Array<RewardsByDay>;
    realizingNativeSupplyDepletionRewards: Array<RewardsByDay>;
    realizedNativeRewards: Array<RewardsByDay>;
    realizedNativeFMVRewards: Array<RewardsByDay>;
    realizedNativeMaketDilutionRewards: Array<RewardsByDay>;
    realizedNativeSupplyDepletionRewards: Array<RewardsByDay>;
    aggregateUnrealizedNativeReward25p: number;
    aggregateUnrealizedNativeReward50p: number;
    aggregateUnrealizedNativeReward75p: number;
    aggregateUnrealizedNativeReward100p: number;
    aggregateRealizedNativeReward100p: number;
    aggregateRealizedNativeReward50p: number;
    aggregateRealizedNativeFMVReward100p: number;
    aggregateRealizedNativeFMVReward50p: number;
    aggregateRealizedNativeMarketDilution100p: number;
    aggregateRealizedNativeMarketDilution50p: number;
    aggregateRealizedNativeSupplyDepletion100p: number;
    aggregateRealizedNativeSupplyDepletion50p: number;
    weightedAverageInvestmentCost: number;
    nextTimeStamp: any;
    totalOperations: any;
    noRewards: any;

    constructor(){

    }

    async init(fiat: string, address: string, consensusRole: string): Promise<void>{  
        this.walletAddress = address;
        this.fiat = fiat;
        this.consensusRole = consensusRole
        this.firstRewardDate = "";
        this.pricesAndMarketCapsByDay = new Map<string, PriceAndMarketCapByDay>();
        this.rewardsByDay = [];
        this.balancesByDay = {};
        this.unaccountedNetTransactions = [];
        this.bakerCycles = [];
        this.marketByDay = [];
        this.priceByDay = [];
        this.cyclesByDay = [];
        this.nativeMarketDilutionRewards = [];
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
        this.unrealizedNativeRewards = []
        this.unrealizedNativeFMVRewards = []
        this.unrealizedNativeMarketDilutionRewards = []
        this.unrealizedNativeSupplyDepletionRewards = []
        this.realizingNativeRewards = []
        this.realizingNativeFMVRewards = []
        this.realizingNativeMarketDilutionRewards = []
        this.realizingNativeSupplyDepletionRewards = []
        this.aggregateUnrealizedNativeReward25p = 0
        this.aggregateUnrealizedNativeReward50p = 0
        this.aggregateUnrealizedNativeReward75p = 0
        this.aggregateUnrealizedNativeReward100p = 0
        this.aggregateRealizedNativeReward100p = 0
        this.aggregateRealizedNativeReward50p = 0
        this.aggregateRealizedNativeFMVReward100p = 0
        this.aggregateRealizedNativeFMVReward50p = 0
        this.aggregateRealizedNativeMarketDilution100p = 0
        this.aggregateRealizedNativeMarketDilution50p = 0
        this.aggregateRealizedNativeSupplyDepletion100p = 0
        this.aggregateRealizedNativeSupplyDepletion50p = 0
        this.realizedNativeRewards = []
        this.realizedNativeFMVRewards = []
        this.realizedNativeMaketDilutionRewards = []
        this.realizedNativeSupplyDepletionRewards = []
        this.weightedAverageInvestmentCost = 0
        this.nextTimeStamp = ""
        this.totalOperations = []
        this.noRewards = ""
            

        await connectToDatabase();
        // get data from apis + db

        //check for baker consensus Role
        if (this.consensusRole == "Baker"){
            console.log("Baker processing")
            await Promise.all([this.getBakerRewardsAndTransactions(), this.getPricesAndMarketCap()])
            //make returenve baker rewards output equal to the pre unrealized data arrays
            //this.getBalances()
        }
        else{
            //delegator route
            await Promise.all([this.getDelegatorRewardsAndTransactions(), this.getBalances(), this.getPricesAndMarketCap()]);
        }

        if(this.noRewards === false){
            // conduct analysis
            this.firstRewardDate = this.rewardsByDay[0].date;
            this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
            this.investmentsScaledBVByDomain = this.calculateInvestmentBVByDomain();
            await this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain);
            await this.calculateNativeMarketDilutionRewards(this.investmentsScaledBVByDomain);
            await this.analysis();
            console.log("this")
            console.log(this)
        }
        else{
            console.log(this)
        }
     

        return
    }

    //product methods
    async analysis(): Promise<any> {
    
        // //data packages
        // this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
        // await this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain);
        // await this.calculateNativeMarketDilutionRewards(this.investmentsScaledBVByDomain);
    


        //convert
        this.rewardsByCycle.forEach((value)=> {this.unrealizedNativeRewards.push({date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle})})
        this.nativeRewardsFMVByCycle.forEach((value)=> { this.unrealizedNativeFMVRewards.push({date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle}) })
        this.nativeMarketDilutionRewards.forEach((value)=> {this.unrealizedNativeMarketDilutionRewards.push( {date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle})})
        this.nativeSupplyDepletionRewards.forEach((value)=> {this.unrealizedNativeSupplyDepletionRewards.push( {date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle})})


        //valuea -valueb gives a LIFO behavior
        //valueb - valuea gives FIFO behavior
        this.unrealizedNativeRewards.sort((a,b)=>{
            let valuea: number = new Date(b.date).getTime()
            let valueb: number = new Date(a.date).getTime()
            let value: number =  valueb - valuea
            return value
        })
        this.unrealizedNativeFMVRewards.sort((a,b)=>{
            let valuea: number = new Date(b.date).getTime()
            let valueb: number = new Date(a.date).getTime()
            let value: number = valueb - valuea
            return value
        })
        this.unrealizedNativeMarketDilutionRewards.sort((a,b)=>{
            let valuea: number = new Date(b.date).getTime()
            let valueb: number = new Date(a.date).getTime()
            let value: number = valueb - valuea
            return value
        })
        this.unrealizedNativeSupplyDepletionRewards.sort((a,b)=>{
            let valuea: number = new Date(b.date).getTime()
            let valueb: number = new Date(a.date).getTime()
            let value: number =  valueb - valuea
            return value
        })
        
        //filter the unrealized arrays to put in chronolgoical order
    

        this.realizeReward()
        this.aggregates()

        
    }

   async realizeReward(): Promise<any> {
        //define argument here, the depletion quantity 
        let quantity: number = 30;

        //convert the fmv arrays into maps to get the reward value by date
        let unrealizedNativeFMVRewardsMap = Object.assign({}, ...this.unrealizedNativeFMVRewards.map((x) => ({[x.date]: x.rewardAmount})));
        let unrealizedNativeMarketDilutionRewardsMap = Object.assign({}, ...this.unrealizedNativeMarketDilutionRewards.map((x) => ({[x.date]: x.rewardAmount})));
        let unrealizedNativeSupplyDepletionRewardsMap = Object.assign({}, ...this.unrealizedNativeSupplyDepletionRewards.map((x) => ({[x.date]: x.rewardAmount})));

        //let splicelist = []
        for(let i=0;i<this.unrealizedNativeRewards.length;i++){
            if(this.unrealizedNativeRewards[i].rewardAmount <= quantity){
                this.realizingNativeRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: this.unrealizedNativeRewards[i].rewardAmount, cycle: this.unrealizedNativeRewards[i].cycle})
                this.realizingNativeFMVRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeFMVRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle})
                this.realizingNativeMarketDilutionRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle})
                this.realizingNativeSupplyDepletionRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeSupplyDepletionRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle})
                //splicelist.push(index)
                this.unrealizedNativeRewards.splice(0, 1)
                this.unrealizedNativeFMVRewards.splice(0, 1)
                this.unrealizedNativeMarketDilutionRewards.splice(0, 1)
                this.unrealizedNativeSupplyDepletionRewards.splice(0, 1)
                quantity = quantity - this.unrealizedNativeRewards[i].rewardAmount
                }

            else if(this.unrealizedNativeRewards[i].rewardAmount > quantity && quantity != 0){
                let newValue1: number = quantity
                let newValue2: number = this.unrealizedNativeRewards[i].rewardAmount - quantity
                this.realizingNativeRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1, cycle: this.unrealizedNativeRewards[i].cycle})
                let value1 = unrealizedNativeFMVRewardsMap[this.unrealizedNativeRewards[i].date]
                let value2 = this.unrealizedNativeRewards[i].rewardAmount
                let value3 =  unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date]
                let value4 = unrealizedNativeSupplyDepletionRewardsMap[this.unrealizedNativeRewards[i].date]
                let [value5, value6, value7] = [value1/value2, value3/value2, value4/value2]
                this.realizingNativeFMVRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value5, cycle: this.unrealizedNativeRewards[i].cycle})
                this.realizingNativeMarketDilutionRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value6, cycle: this.unrealizedNativeRewards[i].cycle})
                this.realizingNativeSupplyDepletionRewards.push({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value7, cycle: this.unrealizedNativeRewards[i].cycle})

                //multiple the three scalars by the newValue2 for unrealized and use quantity for the realizing
                this.unrealizedNativeFMVRewards.unshift({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value5, cycle: this.unrealizedNativeRewards[i].cycle})
                this.unrealizedNativeMarketDilutionRewards.unshift({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value6, cycle: this.unrealizedNativeRewards[i].cycle})
                this.unrealizedNativeFMVRewards.unshift({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value7, cycle: this.unrealizedNativeRewards[i].cycle})
                this.unrealizedNativeRewards.unshift({date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2, cycle: this.unrealizedNativeRewards[i].cycle})
                quantity = 0
            
            }
        }
    }    

   async aggregates(): Promise<any> {
        //from the unrealized and realized arrays
        //prepare unrealized aggreagte figures and attach to object for more quantity selection information (25%, 50%, 75%, 100%)  
        //4 parsed up agg values for native rewards unrealized array for quantity fill purposes 

        let mainValue1: any = 0
        this.unrealizedNativeRewards.forEach((value) => {
            if(value.rewardAmount !== undefined){
                mainValue1 += value.rewardAmount
            }
        })
        this.aggregateUnrealizedNativeReward25p = mainValue1 * 0.25
        this.aggregateUnrealizedNativeReward50p = mainValue1 * 0.5
        this.aggregateUnrealizedNativeReward75p = mainValue1 * 0.75
        this.aggregateUnrealizedNativeReward100p = mainValue1

        let mainValue2: any = 0
        this.realizingNativeFMVRewards.forEach((value) => {
            if(value.rewardAmount !== undefined){
                mainValue2 += value.rewardAmount
            }
        })
        this.aggregateRealizedNativeFMVReward100p = mainValue2
        this.aggregateRealizedNativeFMVReward50p = mainValue2 * 0.5

        let mainValue3: any = 0
        this.realizingNativeMarketDilutionRewards.forEach((value)=> {
            if(value.rewardAmount !== undefined){
                mainValue3 += value.rewardAmount
            }
        })
        this.aggregateRealizedNativeMarketDilution100p = mainValue3
        this.aggregateRealizedNativeMarketDilution50p = mainValue3 * 0.5
        
        let mainValue4: any = 0
        this.realizingNativeSupplyDepletionRewards.forEach((value)=>{
            if(value.rewardAmount !== undefined){
                mainValue4 += value.rewardAmount
            }
        })
        this.aggregateRealizedNativeSupplyDepletion100p = mainValue4
        this.aggregateRealizedNativeSupplyDepletion50p = mainValue4 * 0.5
    
        let mainValue5: any = 0
        this.realizingNativeRewards.forEach((value)=>{
            if(value.rewardAmount !== undefined){
                mainValue5 += value.rewardAmount
            }
        })
        this.aggregateRealizedNativeReward100p = mainValue5
        this.aggregateRealizedNativeReward50p = mainValue5 * 0.5
    
   }

   async saveRealization(): Promise<any>{
   
    this.realizedNativeRewards = []
    this.realizedNativeFMVRewards = []
    this.realizedNativeMaketDilutionRewards = []
    this.realizedNativeSupplyDepletionRewards = []

   }

   async updateSets(): Promise<any>{

   }

   async basisInvestmentCosts(): Promise<void>{

    //for any domain in netTransactions
    //unaccountedNetTransactions
    //priceByDay
    //pos and price value
    //fifo go down 
    //recaluclations?
    //for unaccounted negative 
    //underlying basis 
    //realize out of first in net positive
    //recalculate weighted average
    //set as basis cost for the domain until nexxt negative or positive transaction

    
    }

    async pointOfSaleCosts(): Promise<void>{
        //add todays price to this 

        //add realized native rewards agg by todays price to this 

        //need to better the update blockchains2 db program 
    }

    calculateNativeRewardFMVByCycle(): Array<RewardsByDay> {
        //rewards by day by price that day
        return this.rewardsByCycle.map(reward => {
            return {date: reward.date, rewardAmount: reward.rewardAmount*this.pricesAndMarketCapsByDay[reward.date].price, cycle:reward.cycle}
        })
    }

   async calculateNativeMarketDilutionRewards(scaledBVByDomain:Array<BVbyDomain>): Promise<void> {

    let mappedBV: Map<string, number> = new Map(); 

    scaledBVByDomain.forEach(bvDomain => {
    // iterate over the date range (inclusive)
    let startDate: Date = new Date(bvDomain.startDate);
    let endDate: Date = new Date(bvDomain.endDate);
    while(startDate<=endDate){
        mappedBV[startDate.toISOString().slice(0,10)] = bvDomain.scaledBookValue;
        startDate.setDate(startDate.getDate() + 1);
        if(startDate.toISOString().slice(11)!=="00:00:00.000Z"){
            startDate.setDate(startDate.getDate() + 1);
            startDate = new Date(startDate.toISOString().slice(0,10));
            }
        }
    })

    let nativeMarketDilutionByDay: Array<DilutionByDay>
    let filteredMarketByDay: Array<DilutionByDay> = this.marketByDay.filter(markets => {
        return markets.date >= this.firstRewardDate
    }); 

    let filtereredPriceByDay: Array<DilutionByDay> = this.priceByDay.filter(prices => {
        return prices.date >= this.firstRewardDate
    })


    //make the prices a dict so you can put a date in and get the price amount
    let dictionaryPriceByDay = Object.assign({}, ...filtereredPriceByDay.map((x) => ({[x.date]: x.amount})));

    
    let lastMarket: DilutionByDay = filteredMarketByDay[0];
    let lastPrice = filtereredPriceByDay[0].amount; 
    nativeMarketDilutionByDay = filteredMarketByDay.slice(1).map(market => {
        let ratio1: number = ((market.amount - lastMarket.amount) / lastMarket.amount) 
        let ratio2: number = ((dictionaryPriceByDay[market.date] - lastPrice) / lastPrice); 
        let ratio3: number = ratio1 - ratio2

        if (lastMarket.date === market.date){
            return
        }
        lastMarket = market;
        lastPrice = dictionaryPriceByDay[market.date]
        return {date: market.date, amount: (ratio3) * mappedBV[market.date]}
    });


    let nativeFilteredMarketDilutionByDay: Array<DilutionByDay>


    //filter for existing dilution 
    nativeFilteredMarketDilutionByDay = nativeMarketDilutionByDay.map(element => {
        if(element.amount <= 0){
            return {date: element.date, amount: 0}
        }
        else{
            return element
        }
    })

  
 
    let mappedFMV: Map<number, RewardsByDay> = new Map();
    this.nativeRewardsFMVByCycle.forEach(fmvReward=> {
        mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
    });

    let mappedCyclesToFirstCycleDate: Map<number, string> = new Map();
    this.cyclesMappedToDays.forEach((key,value) => {
        mappedCyclesToFirstCycleDate[value] = key;
    })

    let nativeMarketDilutionRewards: Array<RewardsByDay> = [];
    let currentDate: string = nativeFilteredMarketDilutionByDay[0].date;
    let currentDilutionCycle: number = mappedCyclesToFirstCycleDate[currentDate];
    let aggDilutionAmount: number = nativeFilteredMarketDilutionByDay[0].amount;
    let endDate: string = nativeFilteredMarketDilutionByDay[nativeFilteredMarketDilutionByDay.length - 1].date


    nativeFilteredMarketDilutionByDay.forEach(nativeFilteredMarketDilutionByDay => {
        if(this.cyclesMappedToDays.get(nativeFilteredMarketDilutionByDay.date)!==currentDilutionCycle){
            nativeMarketDilutionRewards.push({date: currentDate, 
                rewardAmount: mappedFMV[currentDilutionCycle] - aggDilutionAmount, 
                cycle: currentDilutionCycle})

            currentDate = nativeFilteredMarketDilutionByDay.date;
            currentDilutionCycle = mappedCyclesToFirstCycleDate[currentDate];
            aggDilutionAmount = nativeFilteredMarketDilutionByDay.amount;
        }
        else if(nativeFilteredMarketDilutionByDay.date===endDate){
            aggDilutionAmount+=nativeFilteredMarketDilutionByDay.amount;
            nativeMarketDilutionRewards.push({date: currentDate, 
                rewardAmount: mappedFMV[currentDilutionCycle] - aggDilutionAmount, 
                cycle: currentDilutionCycle})
        }
        else{
            aggDilutionAmount+=nativeFilteredMarketDilutionByDay.amount;
        }

    })
    

    //filter the rewards for positive ones here
    let nativeFilteredDilutionRewards: Array<RewardsByDay>

    nativeFilteredDilutionRewards = nativeMarketDilutionRewards.map(element => {
            if(element.rewardAmount <= 0){
                return {date: element.date, rewardAmount: 0, cycle: element.cycle}
            }
            else{
                return element
            }
        })

    this.nativeMarketDilutionRewards = nativeFilteredDilutionRewards;




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
                if(startDate.toISOString().slice(11)!=="00:00:00.000Z"){
                    startDate.setDate(startDate.getDate() + 1);
                    startDate = new Date(startDate.toISOString().slice(0,10));
                }
            }
        })
        

        // for each day in our supply db documents - mark the change in supply (ie change in supply for date [i] = 1-(supply[i-1]/supply[i]))
        // find the scaledbv that represents the range the date [i] is in and mulitply that scaledbv value to the value above
        // ex: end up with a day associated with that value
        let nativeSupplyDepletionByDay: Array<DepletionByDay> 
        let filteredSupplyByDay: Array<CurrencySupplyAndDate> = this.supplyByDay.filter(supply => {
            return supply.dateString >= this.firstRewardDate
        }
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


        let mappedFMV: Map<number, RewardsByDay> = new Map();
        this.nativeRewardsFMVByCycle.forEach(fmvReward=> {
            mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
        });

        let mappedCyclesToFirstCycleDate: Map<number, string> = new Map();
        this.cyclesMappedToDays.forEach((key,value) => {
            mappedCyclesToFirstCycleDate[value] = key;
        })

        let nativeSupplyDepletionRewards: Array<RewardsByDay> = [];
        let currentDate: string = nativeSupplyDepletionByDay[0].date;
        let currentSupplyCycle: number = mappedCyclesToFirstCycleDate[currentDate];
        let aggSupplyAmount: number = nativeSupplyDepletionByDay[0].amount;



        nativeSupplyDepletionByDay.forEach(nativeSupplyDepletion => {
            if(this.cyclesMappedToDays.get(nativeSupplyDepletion.date)!==currentSupplyCycle){
                let rewAmount = mappedFMV[currentSupplyCycle] - aggSupplyAmount
                if(rewAmount >= 0){
                    nativeSupplyDepletionRewards.push({date: currentDate, 
                        rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount, 
                        cycle: currentSupplyCycle})
                }
                else{ nativeSupplyDepletionRewards.push({date: currentDate, 
                    rewardAmount: 0, 
                    cycle: currentSupplyCycle})}
                currentDate = nativeSupplyDepletion.date;
                currentSupplyCycle = mappedCyclesToFirstCycleDate[currentDate];
                aggSupplyAmount = nativeSupplyDepletion.amount;
            }
            else if(nativeSupplyDepletion.date===nativeSupplyDepletionByDay[nativeSupplyDepletionByDay.length-1].date){
                aggSupplyAmount+=nativeSupplyDepletion.amount;
                let rewAmount = mappedFMV[currentSupplyCycle] - aggSupplyAmount
                if(rewAmount >= 0){
                    nativeSupplyDepletionRewards.push({date: currentDate, 
                        rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount, 
                        cycle: currentSupplyCycle})
                }
                else{ nativeSupplyDepletionRewards.push({date: currentDate, 
                    rewardAmount: 0, 
                    cycle: currentSupplyCycle})}
                
            }
            else{
                aggSupplyAmount+=nativeSupplyDepletion.amount;
            }

        })
        this.nativeSupplyDepletionRewards = nativeSupplyDepletionRewards;

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
            }
            let endDate: string = ""; 
            // if the next transactions date is the day after the current transaction 
            // the end date for the current transaction will be the same as the start
            if(nextDay.toISOString().slice(0,10).localeCompare(nextDate.toISOString().slice(0,10))===0){
                endDate = startDate;
            }
            else{
                // endDate is the day before the nextdate 
                nextDate.setDate(nextDate.getDate() - 1);
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


    //retreive methods
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

    async retrieveBakerRewards(): Promise<void>{

        //first url
        //get the reults from first url 
        // let url: string = `https://api.tzkt.io/v1/accounts/${this.walletAddress}/operations?type=endorsement,endorsing_rewards,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&limit=1000&sort=0`;
        // let response: AxiosResponse = await axios.get(url);
        // this.nextTimeStamp = response.data[response.data.length - 1].timestamp
        // //map the response and push to array
        // let operations: Array<{type: string, amount: number, rewards: number, reward: number, bakerRewards: number, accuserRewards: number, accuser: {address: string}, offenderLostDeposits: number, offenderLostRewards: number, offenderLostFees: number, bakerFee: number, storageFee: number, allocationFee: number, sender: {address: string}, lostReward: number, lostFees: number, timestamp: string}> = 
        //     response.data.map(({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender, lostReward, lostFees, timestamp}) => ({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender,lostReward, lostFees, timestamp}));       
        // let totalOperations: any = []
        // console.log(this.nextTimeStamp)
        // //while the timestamp is not within 3 days of today
        // let a: any = new Date(this.nextTimeStamp)
        // let c: any = new Date()
        // c.setDate(c.getDate() - 5);

        // console.log(operations)
        // while(a.getTime()<c.getTime()){
        //     let urlNext: string = `https://api.tzkt.io/v1/accounts/${this.walletAddress}/operations?timestamp.ge=${this.nextTimeStamp}&limit=1000&sort=0`;
        //     let response2: AxiosResponse = await axios.get(urlNext);
        //     console.log(response2)
        //     this.nextTimeStamp = response2.data[response2.data.length - 1].timestamp
        //     let nextOperations: Array<{type: string, amount: number, rewards: number, reward: number, bakerRewards: number, accuserRewards: number, accuser: {address: string}, offenderLostDeposits: number, offenderLostRewards: number, offenderLostFees: number, bakerFee: number, storageFee: number, allocationFee: number, sender: {address: string}, lostReward: number, lostFees: number, timestamp: string}> = response2.data.map(({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender, lostReward, lostFees, timestamp}) => ({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender,lostReward, lostFees, timestamp}));
        //     totalOperations.push(nextOperations)
        //     let now: any = new Date(this.nextTimeStamp)
        //     if(now.getTime() == a.getTime()){
        //         break
        //     }else{
        //         a = new Date(this.nextTimeStamp)
        //     }
        // }

        // console.log(totalOperations)
        // this.totalOperations = totalOperations



        
        let urlr= `https://api.tzkt.io/v1/rewards/bakers/${this.walletAddress}?limit=10000`
        let resp1: AxiosResponse = await axios.get(urlr);
       // this.nextTimeStamp = resp1.data[resp1.data.length - 1].timestamp
        //map the response and push to array
        console.log(resp1)
        //let cycle: number = 0
        if(resp1 !== undefined){
            // if(resp1.data[0].cycle !== undefined){
            //     cycle = resp1.data[0].cycle
            // }
            let bak: Array<{cycle: number, endorsementRewards: number, blockRewards: number}> = 
            resp1.data.map(({cycle, endorsementRewards, blockRewards}) => ({cycle, endorsementRewards, blockRewards}));       
            this.totalOperations.push(bak)
          
        }
        
        // console.log(cycle)
        // //get the last cycle
        // let url2= `https://api.tzkt.io/v1/rewards/bakers/${this.walletAddress}?cycle.lt=${cycle}`
        // let resp2: AxiosResponse = await axios.get(url2);
        // if(resp2 !== undefined){
        // // this.nextTimeStamp = resp1.data[resp1.data.length - 1].timestamp
        //     //map the response and push to array
        //     let bak2: Array<{cycle: number, endorsementRewards: number, blockRewards: number}> = 
        //     resp2.data.map(({cycle, endorsementRewards, blockRewards}) => ({cycle, endorsementRewards, blockRewards}));       
        //     this.totalOperations.push(bak2)
        // }
   
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
            else if(transaction?.sender?.alias === "EcoTez Payouts")
                this.bakerAddresses.add("tz1QS7N8HnRBG2RNh3Kjty58XFXuLFVdnKGY")
        })
        this.isCustodial = false;
    }

    async getBakerRewardsAndTransactions(): Promise<void> {
        await Promise.all([this.retrieveBakerRewards(), this.retrieveCyclesAndDates(), this.getRawWalletTransactions()])
        this.processBakerRewards()
        //uncomment these 3
        this.getNetTransactions();
    }

    async getDelegatorRewardsAndTransactions(): Promise<void> {
        await Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates() ,this.getRawWalletTransactions()]);
        if(this.isCustodial){
            this.processIntermediaryTransactions();
            this.getNetTransactions();
        } 
        else{
            await this.retrieveBakersPayouts();
            this.getNetTransactions();
        }
        this.firstRewardDate = this.rewardsByDay[0].date;
        this.filterPayouts();

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

        //filter the map type for date and market cap 
        //this.priceAndMarketCapsByDay.sometypefunction(element => {return elementstuff})
        //log the element
        //extraction method from element
        //add date reformatting 
    
        //console.log(this.marketByDay)
        priceAndMarketCapData.forEach(element => {
            let dateSplit: string[] = element.date.toString().split("-");
            dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
            let correctedDate: string = dateSplit.join("-");
            this.marketByDay.push({date: correctedDate, amount: element[marketCap]})
        })

        
        priceAndMarketCapData.forEach(element => {
            let dateSplit: string[] = element.date.toString().split("-");
            dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
            let correctedDate: string = dateSplit.join("-");
            this.priceByDay.push({date: correctedDate, amount: element[price]})
        })

        return
    }

    //processing methods
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

    async processBakerRewards(): Promise<void> {

         // map cycles to reward amounts
         //expand record for every type and re make the record at the end for by day /cycle
        let rewards: Record<number, number> = {};
        this.totalOperations.forEach(array => {
            array.forEach(operation => {
                if (operation.cycle === undefined){
                    console.log("No payout data found in a response");
                }
                else{
                 
                //    if('endorsement' === operation.type){
                //        let date: string = this.formatDate(operation.timestamp)
                //        let amount: number = operation.rewards / 1000000
                //        if(amount !== undefined) {
                //            if(rewards[date] !== undefined){
                //                let value: number = rewards[date]
                //                rewards[date] = value + amount
                //            }
                //            else{
                //                rewards[date] = amount
                //            }
                //        }   
                //    }
                   
                if(operation.endorsementRewards !== undefined){
                    let cycle: number = (operation.cycle)
                    let amount: number = operation.endorsementRewards / 1000000
                    if(amount !== undefined) {
                        if(rewards[cycle] !== undefined){
                            let value: number = rewards[cycle]
                            rewards[cycle] = value + amount
                        }
                        else{
                            rewards[cycle] = amount
                        }
                        }   
                     }

                    else if(operation.blockRewards !== undefined){
                        let cycle: number = (operation.cycle)
                        let amount: number = operation.blockRewards / 1000000
                        if(amount !== undefined) {
                            if(rewards[cycle] !== undefined){
                                let value: number = rewards[cycle]
                                rewards[cycle] = value + amount
                            }
                            else{
                                rewards[cycle] = amount
                            }
                        }   
                    }
                //    else if("baking" === operation.type){
                //        let date: string = this.formatDate(operation.timestamp)
                //        let amount: number = operation.reward / 1000000
                //        if(amount !== undefined) {
                //            if(rewards[date] !== undefined){
                //                let value: number = rewards[date]
                //                rewards[date] = value + amount
                //            }
                //            else{
                //                rewards[date] = amount
                //            }
                //        }   
                //    }
                //    else if("endorsing_rewards" === operation.type){
                //     let date: string = this.formatDate(operation.timestamp)
                //     let amount: number = operation.received / 1000000
                //     if(amount !== undefined) {
                //         if(rewards[date] !== undefined){
                //             let value: number = rewards[date]
                //             rewards[date] = value + amount
                //         }
                //         else{
                //             rewards[date] = amount
                //         }
                //     } 
                //    }
                //    else if('nonce_revelation' === operation.type){
                //        let date: string = this.formatDate(operation.timestamp)
                //        let amount: number = operation.bakerRewards / 1000000
                //        if(amount !== undefined) {
                //            if(rewards[date] !== undefined){
                //                let value: number = rewards[date]
                //                rewards[date] = value + amount
                //            }
                //            else{
                //                rewards[date] = amount
                //            }
                //        }   
                //    }
                //    else if('double_baking' === operation.type){
                //        let isAccuser = operation.accuser.address === this.walletAddress;
                //        if(isAccuser){
                //            let date: string = this.formatDate(operation.timestamp)
                //            let amount: number = operation.accuserRewards / 1000000
                //            if(amount !== undefined) {
                //                if(rewards[date] !== undefined){
                //                    let value: number = rewards[date]
                //                    rewards[date] = value + amount
                //                }
                //                else{
                //                    rewards[date] = amount
                //                }
                //            }   
                //        }
                //        else{
                //            let date: string = this.formatDate(operation.timestamp)
                //            let amount: number = -(operation.offenderLostDeposits + operation.offenderLostRewards + operation.offenderLostFees) / 1000000
                //            if(amount !== undefined) {
                //                if(rewards[date] !== undefined){
                //                    let value: number = rewards[date]
                //                    rewards[date] = value + amount
                //                }
                //                else{
                //                    rewards[date] = amount
                //                }
                //            }   
                //        }
                //    }
                //    else if("origination" === operation.type){
                //            let date: string = this.formatDate(operation.timestamp)
                //            let amount: number = -(operation.bakerFee + operation.storageFee + operation.allocationFee) / 1000000
                //            if(amount !== undefined) {
                //                if(rewards[date] !== undefined){
                //                    let value: number = rewards[date]
                //                    rewards[date] = value + amount
                //                }
                //                else{
                //                    rewards[date] = amount
                //                }
                //            }   
                //    }
                //    else if("delegation" === operation.type){
                //        let date: string = this.formatDate(operation.timestamp)
                //        let isSender = operation.sender.address === this.walletAddress;
                //        if (isSender) {
                //            let amount: number = -1 * operation.bakerFee / 1000000
                //            if(amount !== undefined) {
                //                if(rewards[date] !== undefined){
                //                    let value: number = rewards[date]
                //                    rewards[date] = value + amount
                //                }
                //                else{
                //                    rewards[date] = amount
                //                }
                //            }   
                //        }
                //    }
                //    else if("reveal"){
                //        let date: string = this.formatDate(operation.timestamp)
                //        let amount: number = -1 * operation.bakerFee / 1000000
                //        if(amount !== undefined) {
                //            if(rewards[date] !== undefined){
                //                let value: number = rewards[date]
                //                rewards[date] = value + amount
                //            }
                //            else{
                //                rewards[date] = amount
                //            }
                //        }   
   
   
                //    }
                //    else if("revelation_penalty"){
                //        let date: string = this.formatDate(operation.timestamp)
                //        let amount: number = -1 * (operation.lostReward + operation.lostFees) / 1000000
                //        if(amount !== undefined) {
                //            if(rewards[date] !== undefined){
                //                let value: number = rewards[date]
                //                rewards[date] = value + amount
                //            }
                //            else{
                //                rewards[date] = amount
                //            }
                //        }   
                //    }
               }
            });
        })
        console.log(rewards)

            //flip this to get the cycles
            //this.rewardsByCycle = 
            // this.rewardsByDay = this.cyclesByDay.filter(cycleAndDateDoc => cycleAndDateDoc.cycleNumber in rewards).map(cycleAndDateDoc => {
            //     return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber};
            // });
            if(Object.keys(rewards).length <= 1){
                this.noRewards = true
            }
            else{
                let prevVal: any = {}
                for (let i=0; i< this.cyclesByDay.length; i++){
                    if (this.cyclesByDay[i].cycleNumber !== prevVal.cycleNumber){
                        if(rewards[this.cyclesByDay[i].cycleNumber] !== undefined){
                            this.rewardsByCycle.push({date: this.formatDate(this.cyclesByDay[i].dateString), rewardAmount: rewards[this.cyclesByDay[i].cycleNumber], cycle: this.cyclesByDay[i].cycleNumber})
                            prevVal = this.cyclesByDay[i] 
                        }
                       
                }}
    
                this.rewardsByDay = this.rewardsByCycle.map(value => value)
                this.noRewards = false
            }
            

            //this.rewardsByDay = this.cyclesByDay.filter(cyclesAndDays => )

      
         return
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

    filterPayoutsBaker(): void { //depreication threaten , are rewards by day necaarry if by cycle is done? prob not

        //this converts the rewaard by day map to reward by day and reward by cycle

        
        let currentItem = this.rewardsByDay[0]
        // this.rewardsByCycle = this.rewardsByDay.forEach((value) => {
        //     if(value.cycle == currentItem.cycle) {
        //         currentItem.rewardAmount += value.rewardAmount 
        //     }

        // })



        for (const reward of this.rewardsByDay.slice().reverse()){
            if (reward.cycle == currentItem.cycle){
                let value: number = reward.rewardAmount + currentItem.rewardAmount
                currentItem.rewardAmount = value           
            }
            else {
                this.rewardsByCycle.push(currentItem);
                currentItem = reward;
            }
            
        }
        if(this.rewardsByDay[0].date===currentItem.date){
            this.rewardsByCycle.push(currentItem);
        }



        // this.rewardsByCycle = this.cyclesByDay.filter(cycleAndDateDoc => cycleAndDateDoc.cycleNumber in rewards).map(cycleAndDateDoc => {
        //     return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber};
        // });


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

    // utility methods:
    setRewardsUrls(bakerData: BakerCycle): void{ 
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.baking-bad.org/v2/rewards/${bakerData.bakerAddress}?cycle=${i}`);
        }
    }

    formatDate(date: string): string {
        var d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
    
        return [year, month, day].join("-");
    }

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
    
}

let ts: TezosSet = new TezosSet();
ts.init("USD","tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM", "Baker").then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + "test.json");
    }
})});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
//baker tz1fJHFn6sWEd3NnBPngACuw2dggTv6nQZ7g, tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM, tz1TwVimQy3BywXoSszdFXjT9bSTQrsZYo2u, tz1WMoJivTbf62hWLC5e4QvRwk9dps2r6tNs, tz1aegBunu8NFDNm7wPHNyuMmteMD3S3Liuj
//delegator tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH, get more bad delegator strings




// other payloads blockchain operation types into baker processing 
//active documentation https://api.tzkt.io/#operation/Rewards_GetBakerRewards
