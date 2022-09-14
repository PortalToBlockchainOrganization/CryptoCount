

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

export default interface umbrella {
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
    unrealizedNativeRewards: Array<AccountingSetEntry>;
    unrealizedNativeFMVRewards: Array<AccountingSetEntry>;
    unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>;
    unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
    realizingNativeRewards: Array<AccountingSetEntry>;
    realizingNativeFMVRewards: Array<AccountingSetEntry>;
    realizingNativeMarketDilutionRewards: Array<AccountingSetEntry>;
    realizingNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
    realizedNativeRewards: Array<AccountingSetEntry>;
    realizedNativeFMVRewards: Array<AccountingSetEntry>;
    realizedNativeMaketDilutionRewards: Array<AccountingSetEntry>;
    realizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
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
    weightedAverageTotalDomainInvestmentCost: number;
    nextTimeStamp: any;
    totalOperations: any;
    noRewards: any;
    TezosPriceOnDateObjectGenerated: number;
    pointOfSaleAggValue: number;
    netDiffFMV: number;
    netDiffDilution: number;
    netDiffSupplyDepletion: number;
    investmentBasisCostArray: any;
}

