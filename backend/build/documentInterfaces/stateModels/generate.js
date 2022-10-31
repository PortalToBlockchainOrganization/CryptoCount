"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printLabel(labeledObj) {
    console.log(labeledObj.label);
}
function transform(umbrella) {
    var generateModel = {
        objectId: umbrella.objectId,
        fiat: umbrella.fiat,
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
        pointOfSaleAggValue: umbrella.pointOfSaleAggValue,
        netDiffFMV: umbrella.netDiffFMV,
        netDiffDilution: umbrella.netDiffDilution,
        netDiffSupplyDepletion: umbrella.netDiffSupplyDepletion,
        realizingNativeRewards: umbrella.realizingNativeRewards,
        realizingNativeFMVRewards: umbrella.realizingNativeFMVRewards,
        realizingNativeMarketDilutionRewards: umbrella.realizingNativeMarketDilutionRewards,
        realizingNativeSupplyDepletionRewards: umbrella.realizingNativeSupplyDepletionRewards,
        realizedNativeRewards: umbrella.realizedNativeRewards,
        realizedNativeFMVRewards: umbrella.realizedNativeFMVRewards,
        realizedNativeMarketDilutionRewards: umbrella.realizedNativeMarketDilutionRewards,
        realizedNativeSupplyDepletionRewards: umbrella.realizedNativeSupplyDepletionRewards,
        aggregateRealizedNativeReward100p: umbrella.aggregateRealizedNativeReward100p,
        aggregateRealizedNativeReward50p: umbrella.aggregateRealizedNativeReward50p,
        aggregateRealizedNativeFMVReward100p: umbrella.aggregateRealizedNativeFMVReward100p,
        aggregateRealizedNativeFMVReward50p: umbrella.aggregateRealizedNativeFMVReward50p,
        aggregateRealizedNativeMarketDilution100p: umbrella.aggregateRealizedNativeMarketDilution100p,
        aggregateRealizedNativeMarketDilution50p: umbrella.aggregateRealizedNativeMarketDilution50p,
        aggregateRealizedNativeSupplyDepletion100p: umbrella.aggregateRealizedNativeSupplyDepletion100p,
        aggregateRealizedNativeSupplyDepletion50p: umbrella.aggregateRealizedNativeSupplyDepletion50p,
    };
    return generateModel;
}
exports.default = transform;
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
