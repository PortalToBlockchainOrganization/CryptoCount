import { ObjectId } from "mongodb";
import umbrella from "./umbrella"

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
   
  function printLabel(labeledObj: LabeledValue) {
    console.log(labeledObj.label);
  }

  interface generateModel{
    objectId: string,
    publicfiat: string,
    walletAddress: string,
    bakerCycles: Array<BakerCycle>,
    bakerAddresses: Set<string>,
    consensusRole: string,
    unaccountedNetTransactions: Array<TransactionsByDay>,
    balancesByDay: Record<string, number>,
    investmentsScaledBVByDomain: Array<BVbyDomain>,
    unrealizedNativeRewards: Array<AccountingSetEntry>,
    unrealizedNativeFMVRewards: Array<AccountingSetEntry>,
    unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
    unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
    aggregateUnrealizedNativeReward25p: number,
    aggregateUnrealizedNativeReward50p: number,
    aggregateUnrealizedNativeReward75p: number,
    aggregateUnrealizedNativeReward100p: number,
    weightedAverageTotalDomainInvestmentCost: number,
    TezosPriceOnDateObjectGenerated: number;
  }


  export default function transform(umbrella: umbrella){
 
   var generateModel: generateModel = {
        objectId: umbrella.objectId,
        publicfiat: umbrella.fiat,
        walletAddress: umbrella.walletAddress,
        bakerCycles: umbrella.bakerCycles, 
        bakerAddresses: umbrella.bakerAddresses,
        consensusRole: umbrella.consensusRole,
        unaccountedNetTransactions: umbrella.unaccountedNetTransactions,
        balancesByDay: umbrella.balancesByDay,
        investmentsScaledBVByDomain: umbrella.investmentsScaledBVByDomain,
        unrealizedNativeRewards: umbrella.unrealizedNativeRewards,
        unrealizedNativeFMVRewards: umbrella.unrealizedNativeFMVRewards,
        unrealizedNativeMarketDilutionRewards: umbrella.unrealizedNativeMarketDilutionRewards,
        unrealizedNativeSupplyDepletionRewards: umbrella.unrealizedNativeSupplyDepletionRewards,
        aggregateUnrealizedNativeReward25p: umbrella.aggregateUnrealizedNativeReward25p,
        aggregateUnrealizedNativeReward50p: umbrella.aggregateUnrealizedNativeReward50p,
        aggregateUnrealizedNativeReward75p: umbrella.aggregateUnrealizedNativeReward75p,
        aggregateUnrealizedNativeReward100p: umbrella.aggregateUnrealizedNativeReward100p,
        weightedAverageTotalDomainInvestmentCost: umbrella.weightedAverageTotalDomainInvestmentCost,
        TezosPriceOnDateObjectGenerated: umbrella.TezosPriceOnDateObjectGenerated,


   }

   return generateModel

  }
   
  let myObj = { size: 10, label: "Size 10 Object" };
  
  printLabel(myObj);


//   export default class generate {
  
//         public publicfiat: string,
//         public walletAddress: string,
//         public bakerCycles: Array<BakerCycle>,
//         public bakerAddresses: Set<string>,
//         public consensusRole: string,
//         public unaccountedNetTransactions: Array<TransactionsByDay>,
//         public balancesByDay: Record<string, number>,
//         public investmentsScaledBVByDomain: Array<BVbyDomain>,
//         public unrealizedNativeRewards: Array<AccountingSetEntry>,
//         public unrealizedNativeFMVRewards: Array<AccountingSetEntry>,
//         public unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
//         public unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
//         public aggregateUnrealizedNativeReward25p: number,
//         public aggregateUnrealizedNativeReward50p: number,
//         public aggregateUnrealizedNativeReward75p: number,
//         public aggregateUnrealizedNativeReward100p: number,
//         public weightedAverageTotalDomainInvestmentCost: number,


//      constructor(){

//      }

//      asycn init()

    //global type defs

    // constructor(){

    // }

    //async init(fiat: string, address: string, consensusRole: string): Promise<void>{ 
        //this vars defined from passed in ts object
