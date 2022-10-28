import umbrella from "../umbrella/umbrella.types"


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



interface generateModel{
    objectId: string,
    fiat: string,
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
    realizingNativeRewards: Array<AccountingSetEntry>;
    realizingNativeFMVRewards: Array<AccountingSetEntry>;
    realizingNativeMarketDilutionRewards: Array<AccountingSetEntry>;
    realizingNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
    realizedNativeRewards: Array<AccountingSetEntry>;
        realizedNativeFMVRewards:  Array<AccountingSetEntry>;
        realizedNativeMarketDilutionRewards:  Array<AccountingSetEntry>;
        realizedNativeSupplyDepletionRewards:  Array<AccountingSetEntry>;
    aggregateRealizedNativeReward100p: number;
    aggregateRealizedNativeReward50p: number;
    aggregateRealizedNativeFMVReward100p: number;
    aggregateRealizedNativeFMVReward50p: number;
    aggregateRealizedNativeMarketDilution100p: number;
    aggregateRealizedNativeMarketDilution50p: number;
    aggregateRealizedNativeSupplyDepletion100p: number;
    aggregateRealizedNativeSupplyDepletion50p: number;
    TezosPriceOnDateObjectGenerated: number;
    pointOfSaleAggValue: number;
    netDiffFMV: number;
    netDiffDilution: number;
    netDiffSupplyDepletion: number;
    realizingDomainStartDate: string;
    realizingDomainEndDate: string;
  }


export default function transform(umbrella: umbrella){

    var generateModel: generateModel = {
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
        TezosPriceOnDateObjectGenerated: umbrella.TezosPriceOnDateObjectGenerated,
        pointOfSaleAggValue: umbrella.pointOfSaleAggValue,
        netDiffFMV: umbrella.netDiffFMV,
        netDiffDilution: umbrella.netDiffDilution,
        netDiffSupplyDepletion: umbrella.netDiffSupplyDepletion,
        realizingDomainStartDate: umbrella.realizingDomainStartDate,
        realizingDomainEndDate: umbrella.realizingDomainEndDate
 
    }
 
    return generateModel
 
   }