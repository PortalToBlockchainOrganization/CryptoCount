import { ObjectId } from "mongodb";
import mongoose, {Document, Schema, Model, Types, model} from 'mongoose';
//const mongoose = require('mongoose')
//import umbrellaInterface from './umbrella.types'
import CycleAndDate from "../CycleAndDate";
import CurrencySupplyAndDate from "../CurrencySupplyAndDate";
import PriceAndMarketCap from "../PriceAndMarketCap";

//import { Schema } from "mongoose";
import { findOneOrCreate, findByAge } from "./umbrella.statics";
import { setLastUpdated } from "./umbrella.methods";
const UmbrellaSchema = new Schema({
    objectId: String,
    user_id: String,
    fiat: String,
    walletAddress: String,
    firstRewardDate: String,
    priceByDay: Array<PriceByDay>,
    bakerCycles: Array<BakerCycle>,
    rewardsByDay: Array<RewardsByDay>,
    bakerAddresses: Array,
    consensusRole: String,
    cyclesByDay: Array<CycleAndDate>,
    supplyByDay: Array<CurrencySupplyAndDate>,
    unaccountedNetTransactions: Array<TransactionsByDay>,
    transactionsUrl: String,
    delegatorRewardsUrl: String,
    balanceHistoryUrl: String,
    rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>,
    cyclesMappedToDays: Map<string, number>,
    isCustodial: Boolean,
    rewardsByCycle: Array<RewardsByDay>,
    balancesByDay: Array,
    pricesAndMarketCapsByDay: Map<string, PriceAndMarketCapByDay>,
    nativeRewardsFMVByCycle: Array<RewardsByDay>,
    investmentsScaledBVByDomain: Array<BVbyDomain>,
    nativeSupplyDepletion: Array<DepletionByDay>,
    nativeMarketDilutionRewards: Array<RewardsByDay>,
    nativeSupplyDepletionRewards: Array<RewardsByDay>,
    marketByDay: Array<MarketByDay>,
    unrealizedNativeRewards: Array<AccountingSetEntry>,
    unrealizedNativeFMVRewards: Array<AccountingSetEntry>,
    unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
    unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
    realizingNativeRewards: Array<AccountingSetEntry>,
    realizingNativeFMVRewards: Array<AccountingSetEntry>,
    realizingNativeMarketDilutionRewards: Array<AccountingSetEntry>,
    realizingNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
    realizedNativeRewards: Array<AccountingSetEntry>,
    realizedNativeFMVRewards: Array<AccountingSetEntry>,
    realizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
    realizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
    aggregateUnrealizedNativeReward25p: Number,
    aggregateUnrealizedNativeReward50p: Number,
    aggregateUnrealizedNativeReward75p: Number,
    aggregateUnrealizedNativeReward100p: Number,
    aggregateRealizedNativeReward100p: Number,
    aggregateRealizedNativeReward50p: Number,
    aggregateRealizedNativeFMVReward100p: Number,
    aggregateRealizedNativeFMVReward50p: Number,
    aggregateRealizedNativeMarketDilution100p: Number,
    aggregateRealizedNativeMarketDilution50p: Number,
    aggregateRealizedNativeSupplyDepletion100p: Number,
    aggregateRealizedNativeSupplyDepletion50p: Number,
    weightedAverageTotalDomainInvestmentCost: Number,
    nextTimeStamp: String,
    totalOperations: Array,
    noRewards: Boolean,
    TezosPriceOnDateObjectGenerated: Number,
    pointOfSaleAggValue: Number,
    netDiffFMV: Number,
    netDiffDilution: Number,
    netDiffSupplyDepletion: Number,
    investmentBasisCostArray: Array,
    realizingDomainStartDate: String,
    realizingDomainEndDate:String,
    dateOfEntry: {type: Date,default: new Date()},
    lastUpdated: {type: Date,default: new Date()}
});
UmbrellaSchema.statics.findOneOrCreate = findOneOrCreate;
UmbrellaSchema.statics.findByAge = findByAge;
UmbrellaSchema.methods.setLastUpdated = setLastUpdated;
export default UmbrellaSchema;

interface PriceByDay{
  date: string,
  amount: number
}

interface RewardsByDay {
  date: string,
  rewardAmount: number,
  cycle: number,
}

interface MarketByDay{
  date: string,
  amount: number
}

interface DepletionByDay{
  date: string,
  amount: number
}

interface BakerCycle {
  bakerAddress: string;
  cycleStart: number;
  cycleEnd: number;
  rewardsRequests: Array<string>;
}

interface TransactionsByDay {
  date: string,
  amount: number
}

interface BVbyDomain {
  startDate: string,
  endDate: string,
  scaledBookValue: number
}

interface AccountingSetEntry{
  date: string,
  rewardAmount: number,
  cycle: number,
  basisCost: number
}

interface LabeledValue {
  label: string;
}

interface PriceAndMarketCapByDay {
  date: string,
  price: number,
  marketCap: number
}





//   interface Parent {
//     child?: Types.ObjectId,
//     name?: string
//   }
//   const ParentModel = model<Parent>('Parent', new Schema({
//     child: { type: Schema.Types.ObjectId, ref: 'Child' },
//     name: String
//   }));
  
//   interface Child {
//     name: string;
//   }
//   const childSchema: Schema = new Schema({ name: String });
//   const ChildModel = model<Child>('Child', childSchema);
  
//   // Populate with `Paths` generic `{ child: Child }` to override `child` path
//   ParentModel.findOne({}).populate<{ child: Child }>('child').orFail().then(doc => {
//     // Works
//     const t: string = doc.child.name;
//   });


// export const mbrellaSchema = new mongoose.Schema({
//     fiat: String,
//     walletAddress: String,
//     firstRewardDate: String,
//     priceByDay: Array<PriceByDay>,
//     bakerCycles: Array<BakerCycle>,
//     rewardsByDay: Array<RewardsByDay>,
//     bakerAddresses: Array<Set>,
//     consensusRole: String,
//     cyclesByDay: Array<CycleAndDate>,
//     supplyByDay: Array<CurrencySupplyAndDate>,
//     unaccountedNetTransactions: Array<TransactionsByDay>,
//     transactionsUrl: String,
//     delegatorRewardsUrl: String,
//     balanceHistoryUrl: String,
//     rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>,
//     cyclesMappedToDays: Map<string, number>,
//     isCustodial: Boolean,
//     rewardsByCycle: Array<RewardsByDay>,
//     balancesByDay: Array,
//     pricesAndMarketCapsByDay: Map<string, PriceAndMarketCapByDay>,
//     nativeRewardsFMVByCycle: Array<RewardsByDay>,
//     investmentsScaledBVByDomain: Array<BVbyDomain>,
//     nativeSupplyDepletion: Array<DepletionByDay>,
//     nativeMarketDilutionRewards: Array<RewardsByDay>,
//     nativeSupplyDepletionRewards: Array<RewardsByDay>,
//     marketByDay: Array<MarketByDay>,
//     unrealizedNativeRewards: Array<AccountingSetEntry>,
//     unrealizedNativeFMVRewards: Array<AccountingSetEntry>,
//     unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//     unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//     realizingNativeRewards: Array<AccountingSetEntry>,
//     realizingNativeFMVRewards: Array<AccountingSetEntry>,
//     realizingNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//     realizingNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//     realizedNativeRewards: Array<AccountingSetEntry>,
//     realizedNativeFMVRewards: Array<AccountingSetEntry>,
//     realizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//     realizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//     aggregateUnrealizedNativeReward25p: Number,
//     aggregateUnrealizedNativeReward50p: Number,
//     aggregateUnrealizedNativeReward75p: Number,
//     aggregateUnrealizedNativeReward100p: Number,
//     aggregateRealizedNativeReward100p: Number,
//     aggregateRealizedNativeReward50p: Number,
//     aggregateRealizedNativeFMVReward100p: Number,
//     aggregateRealizedNativeFMVReward50p: Number,
//     aggregateRealizedNativeMarketDilution100p: Number,
//     aggregateRealizedNativeMarketDilution50p: Number,
//     aggregateRealizedNativeSupplyDepletion100p: Number,
//     aggregateRealizedNativeSupplyDepletion50p: Number,
//     weightedAverageTotalDomainInvestmentCost: Number,
//     nextTimeStamp: String,
//     totalOperations: Array,
//     noRewards: Boolean,
//     TezosPriceOnDateObjectGenerated: Number,
//     pointOfSaleAggValue: Number,
//     netDiffFMV: Number,
//     netDiffDilution: Number,
//     netDiffSupplyDepletion: Number,
//     investmentBasisCostArray: Array,
//   });

//   //const Umbrella = new Model<umbrellaInterface>;


// export default UmbrellaSchema;


// // export default class umbrella {
 
//     constructor(public date: string, 
//         public fiat: string,
//         public walletAddress: string,
//         public firstRewardDate: string,
//         public priceByDay: Array<PriceByDay>,
//         public bakerCycles: Array<BakerCycle>,
//         public rewardsByDay: Array<RewardsByDay>,
//         public bakerAddresses: Set<string>,
//         public consensusRole: string,
//         public cyclesByDay: Array<CycleAndDate>,
//         public supplyByDay: Array<CurrencySupplyAndDate>,
//         public unaccountedNetTransactions: Array<TransactionsByDay>,
//         public transactionsUrl: string,
//         public delegatorRewardsUrl: string,
//         public balanceHistoryUrl: string,
//         public rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>,
//         public cyclesMappedToDays: Map<string, number>,
//         public isCustodial: boolean,
//         public rewardsByCycle: Array<RewardsByDay>,
//         public balancesByDay: Record<string, number>,
//         public pricesAndMarketCapsByDay: Map<string, PriceAndMarketCapByDay>,
//         public nativeRewardsFMVByCycle: Array<RewardsByDay>,
//         public investmentsScaledBVByDomain: Array<BVbyDomain>,
//         public nativeSupplyDepletion: Array<DepletionByDay>,
//         public nativeMarketDilutionRewards: Array<RewardsByDay>,
//         public nativeSupplyDepletionRewards: Array<RewardsByDay>,
//         public marketByDay: Array<MarketByDay>,
//         public unrealizedNativeRewards: Array<AccountingSetEntry>,
//         public unrealizedNativeFMVRewards: Array<AccountingSetEntry>,
//         public unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//         public unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//         public realizingNativeRewards: Array<AccountingSetEntry>,
//         public realizingNativeFMVRewards: Array<AccountingSetEntry>,
//         public realizingNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//         public realizingNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//         public realizedNativeRewards: Array<AccountingSetEntry>,
//         public realizedNativeFMVRewards: Array<AccountingSetEntry>,
//         public realizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//         public realizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//         public aggregateUnrealizedNativeReward25p: number,
//         public aggregateUnrealizedNativeReward50p: number,
//         public aggregateUnrealizedNativeReward75p: number,
//         public aggregateUnrealizedNativeReward100p: number,
//         public aggregateRealizedNativeReward100p: number,
//         public aggregateRealizedNativeReward50p: number,
//         public aggregateRealizedNativeFMVReward100p: number,
//         public aggregateRealizedNativeFMVReward50p: number,
//         public aggregateRealizedNativeMarketDilution100p: number,
//         public aggregateRealizedNativeMarketDilution50p: number,
//         public aggregateRealizedNativeSupplyDepletion100p: number,
//         public aggregateRealizedNativeSupplyDepletion50p: number,
//         public weightedAverageTotalDomainInvestmentCost: number,
//         public nextTimeStamp: any,
//         public totalOperations: any,
//         public noRewards: any,
//         public TezosPriceOnDateObjectGenerated: number,
//         public pointOfSaleAggValue: number,
//         public netDiffFMV: number,
//         public netDiffDilution: number,
//         public netDiffSupplyDepletion: number,
//         public investmentBasisCostArray: any,
        
        
//         public id?: ObjectId) {}
//     }