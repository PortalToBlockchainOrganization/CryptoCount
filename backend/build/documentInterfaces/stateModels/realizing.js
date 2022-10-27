"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transform(umbrella) {
    var generateModel = {
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
    };
    return generateModel;
}
exports.default = transform;
