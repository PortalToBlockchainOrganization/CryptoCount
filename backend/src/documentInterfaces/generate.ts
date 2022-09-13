import { ObjectId } from "mongodb";

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

export default class generate {
    constructor(
        public publicfiat: string,
        public walletAddress: string,
        public bakerCycles: Array<BakerCycle>,
        public bakerAddresses: Set<string>,
        public consensusRole: string,
        public unaccountedNetTransactions: Array<TransactionsByDay>,
        public balancesByDay: Record<string, number>,
        public investmentsScaledBVByDomain: Array<BVbyDomain>,
        public unrealizedNativeRewards: Array<AccountingSetEntry>,
        public unrealizedNativeFMVRewards: Array<AccountingSetEntry>,
        public unrealizedNativeMarketDilutionRewards: Array<AccountingSetEntry>,
        public unrealizedNativeSupplyDepletionRewards: Array<AccountingSetEntry>,
        public aggregateUnrealizedNativeReward25p: number,
        public aggregateUnrealizedNativeReward50p: number,
        public aggregateUnrealizedNativeReward75p: number,
        public aggregateUnrealizedNativeReward100p: number,
        public weightedAverageTotalDomainInvestmentCost: number,


        ) {}
} 