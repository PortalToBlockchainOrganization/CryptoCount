
import { Document, Model } from "mongoose";
import CycleAndDate from "../CycleAndDate";
import CurrencySupplyAndDate from "../CurrencySupplyAndDate";
import PriceAndMarketCap from "../PriceAndMarketCap";



export default interface IUmbrella {
    objectId: string;
    user_id: string;
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
    realizedNativeMarketDilutionRewards: Array<AccountingSetEntry>;
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
    dateOfEntry?: Date;
    lastUpdated?: Date;
    realizingDomainStartDate: string;
    realizingDomainEndDate: string;

}
export interface IUmbrellaDocument extends IUmbrella, Document {}
export interface IUmbrellaModel extends Model<IUmbrellaDocument> {}

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
  

// export default interface umbrella {
//     objectId: string,
//     fiat: string;
//     walletAddress: string;
//     firstRewardDate: string;
//     priceByDay: Array<PriceByDay>
//     bakerCycles: Array<BakerCycle>;
//     rewardsByDay: Array<RewardsByDay>;
//     bakerAddresses: Set<string>;
//     consensusRole: string;
//     cyclesByDay: Array<CycleAndDate>;
//     supplyByDay: Array<CurrencySupplyAndDate>;
//     unaccountedNetTransactions: Array<TransactionsByDay>;
//     transactionsUrl: string;
//     delegatorRewardsUrl: string;
//     balanceHistoryUrl: string;
//     rawWalletTransactions: Array<{target: {address: string}, sender: {address: string, alias: string}, amount: number, timestamp: string}>;
//     cyclesMappedToDays: Map<string, number>;
//     isCustodial: boolean;
//     rewardsByCycle: Array<RewardsByDay>;
//     balancesByDay: Record<string, number>;
//     pricesAndMarketCapsByDay: Map<string, PriceAndMarketCapByDay>;
//     nativeRewardsFMVByCycle: Array<RewardsByDay>;
//     investmentsScaledBVByDomain: Array<BVbyDomain>;
//     nativeSupplyDepletion: Array<DepletionByDay>;
//     nativeMarketDilutionRewards: Array<RewardsByDay>;
//     nativeSupplyDepletionRewards: Array<RewardsByDay>;
//     marketByDay: Array<MarketByDay>;
//     unrealizedNativeRewards: Array<AccountingSetEntry>;
//     unrealizedNativeFMVRewards: Array<AccountingSetEntry>;
//     unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>;
//     unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
//     realizingNativeRewards: Array<AccountingSetEntry>;
//     realizingNativeFMVRewards: Array<AccountingSetEntry>;
//     realizingNativeMarketDilutionRewards: Array<AccountingSetEntry>;
//     realizingNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
//     realizedNativeRewards: Array<AccountingSetEntry>;
//     realizedNativeFMVRewards: Array<AccountingSetEntry>;
//     realizedNativeMarketDilutionRewards: Array<AccountingSetEntry>;
//     realizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>;
//     aggregateUnrealizedNativeReward25p: number;
//     aggregateUnrealizedNativeReward50p: number;
//     aggregateUnrealizedNativeReward75p: number;
//     aggregateUnrealizedNativeReward100p: number;
//     aggregateRealizedNativeReward100p: number;
//     aggregateRealizedNativeReward50p: number;
//     aggregateRealizedNativeFMVReward100p: number;
//     aggregateRealizedNativeFMVReward50p: number;
//     aggregateRealizedNativeMarketDilution100p: number;
//     aggregateRealizedNativeMarketDilution50p: number;
//     aggregateRealizedNativeSupplyDepletion100p: number;
//     aggregateRealizedNativeSupplyDepletion50p: number;
//     weightedAverageTotalDomainInvestmentCost: number;
//     nextTimeStamp: any;
//     totalOperations: any;
//     noRewards: any;
//     TezosPriceOnDateObjectGenerated: number;
//     pointOfSaleAggValue: number;
//     netDiffFMV: number;
//     netDiffDilution: number;
//     netDiffSupplyDepletion: number;
//     investmentBasisCostArray: any;
// }

// export default function transformTSToUmbrella(){
//     export default function transform(umbrella: umbrella){

//     var generateModel: generateModel = {
//         objectId: umbrella.objectId,
//          publicfiat: umbrella.fiat,
//          walletAddress: umbrella.walletAddress,
//          bakerCycles: umbrella.bakerCycles, 
//          bakerAddresses: umbrella.bakerAddresses,
//          consensusRole: umbrella.consensusRole,
//          unaccountedNetTransactions: umbrella.unaccountedNetTransactions,
//          balancesByDay: umbrella.balancesByDay,
//          investmentsScaledBVByDomain: umbrella.investmentsScaledBVByDomain,
//          unrealizedNativeRewards: umbrella.unrealizedNativeRewards,
//          unrealizedNativeFMVRewards: umbrella.unrealizedNativeFMVRewards,
//          unrealizedNativeMarketDilutionRewards: umbrella.unrealizedNativeMarketDilutionRewards,
//          unrealizedNativeSupplyDepletionRewards: umbrella.unrealizedNativeSupplyDepletionRewards,
//          aggregateUnrealizedNativeReward25p: umbrella.aggregateUnrealizedNativeReward25p,
//          aggregateUnrealizedNativeReward50p: umbrella.aggregateUnrealizedNativeReward50p,
//          aggregateUnrealizedNativeReward75p: umbrella.aggregateUnrealizedNativeReward75p,
//          aggregateUnrealizedNativeReward100p: umbrella.aggregateUnrealizedNativeReward100p,
//          weightedAverageTotalDomainInvestmentCost: umbrella.weightedAverageTotalDomainInvestmentCost,
//         realizingNativeRewards: umbrella.realizingNativeRewards,
//         realizingNativeFMVRewards: umbrella.realizingNativeFMVRewards,
//         realizingNativeMarketDilutionRewards: umbrella.realizingNativeMarketDilutionRewards,
//         realizingNativeSupplyDepletionRewards: umbrella.realizingNativeSupplyDepletionRewards,
//         aggregateRealizedNativeReward100p: umbrella.aggregateRealizedNativeReward100p,
//         aggregateRealizedNativeReward50p: umbrella.aggregateRealizedNativeReward50p,
//         aggregateRealizedNativeFMVReward100p: umbrella.aggregateRealizedNativeFMVReward100p,
//         aggregateRealizedNativeFMVReward50p: umbrella.aggregateRealizedNativeFMVReward50p,
//         aggregateRealizedNativeMarketDilution100p: umbrella.aggregateRealizedNativeMarketDilution100p,
//         aggregateRealizedNativeMarketDilution50p: umbrella.aggregateRealizedNativeMarketDilution50p,
//         aggregateRealizedNativeSupplyDepletion100p: umbrella.aggregateRealizedNativeSupplyDepletion100p,
//         aggregateRealizedNativeSupplyDepletion50p: umbrella.aggregateRealizedNativeSupplyDepletion50p,
//         TezosPriceOnDateObjectGenerated: umbrella.TezosPriceOnDateObjectGenerated,
//         pointOfSaleAggValue: umbrella.pointOfSaleAggValue,
//         netDiffFMV: umbrella.netDiffFMV,
//         netDiffDilution: umbrella.netDiffDilution,
//         netDiffSupplyDepletion: umbrella.netDiffSupplyDepletion,
 
//     }
 
//     return generateModel
 
//    }
// }