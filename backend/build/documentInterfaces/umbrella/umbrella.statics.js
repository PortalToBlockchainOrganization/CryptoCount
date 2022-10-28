"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByAge = exports.findOneOrCreate = void 0;
var Umbrella = require("./umbrella.schema");
function findOneOrCreate(setId) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield this.findOne({ setId });
        if (record) {
            return record;
        }
        else {
            return this.create({ setId });
        }
    });
}
exports.findOneOrCreate = findOneOrCreate;
function findByAge(min, max) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
    });
}
exports.findByAge = findByAge;
// db.createCollection(
//     "Umbrella",
//     {
//     }
// )
function transform(ts) {
    var object = {};
    //class ts to umbrella class
    new Umbrella({
        objectId: ts.objectId,
        user_id: ts.user_id,
        fiat: ts.fiat,
        walletAddres: ts.walletAddress,
        firstRewardDate: ts.firstRewardDate,
        priceByDay: ts.priceByDay,
        bakerCycles: ts.bakerCycles,
        rewardsByDay: ts.rewardsByDay,
        bakerAddresses: ts.bakerAddresses,
        consensusRole: ts.consensusRole,
        cyclesByDay: ts.cyclesByDay,
        supplyByDay: ts.supplyByDay,
        unaccountedNetTransactions: ts.unaccountedNetTransactions,
        transactionsUrl: ts.transactionsUrl,
        delegatorRewardsUrl: ts.delegatorRewardsUrl,
        balanceHistoryUrl: ts.balanceHistoryUrl,
        rawWalletTransactions: ts.rawWalletTransactions,
        cyclesMappedToDays: ts.cyclesMappedToDays,
        isCustodial: ts.isCustodial,
        rewardsByCycle: ts.rewardsByCycle,
        balancesByDay: ts.balancesByDay,
        pricesAndMarketCapsByDay: ts.pricesAndMarketCapsByDay,
        nativeRewardsFMVByCycle: ts.nativeRewardsFMVByCycle,
        investmentsScaledBVByDomain: ts.investmentsScaledBVByDomain,
        nativeSupplyDepletion: ts.nativeSupplyDepletion,
        nativeMarketDilutionRewards: ts.nativeMarketDilutionRewards,
        nativeSupplyDepletionRewards: ts.nativeSupplyDepletionRewards,
        marketByDay: ts.marketByDay,
        unrealizedNativeRewards: ts.unrealizedNativeRewards,
        unrealizedNativeFMVRewards: ts.unrealizedNativeFMVRewards,
        unrealizedNativeMarketDilutionRewards: ts.unrealizedNativeMarketDilutionRewards,
        unrealizedNativeSupplyDepletionRewards: ts.unrealizedNativeSupplyDepletionRewards,
        realizingNativeRewards: ts.realizingNativeRewards,
        realizingNativeFMVRewards: ts.realizingNativeFMVRewards,
        realizingNativeMarketDilutionRewards: ts.realizingNativeMarketDilutionRewards,
        realizingNativeSupplyDepletionRewards: ts.realizingNativeSupplyDepletionRewards,
        realizedNativeRewards: ts.realizedNativeRewards,
        realizedNativeFMVRewards: ts.realizedNativeFMVRewards,
        realizedNativeMarketDilutionRewards: ts.realizedNativeMarketDilutionRewards,
        realizedNativeSupplyDepletionRewards: ts.realizedNativeSupplyDepletionRewards,
        aggregateUnrealizedNativeReward25p: ts.aggregateUnrealizedNativeReward25p,
        aggregateUnrealizedNativeReward50p: ts.aggregateUnrealizedNativeReward50p,
        aggregateUnrealizedNativeReward75p: ts.aggregateUnrealizedNativeReward75p,
        aggregateUnrealizedNativeReward100p: ts.aggregateUnrealizedNativeReward100p,
        aggregateRealizedNativeReward100p: ts.aggregateRealizedNativeReward100p,
        aggregateRealizedNativeReward50p: ts.aggregateRealizedNativeReward50p,
        aggregateRealizedNativeFMVReward100p: ts.aggregateRealizedNativeFMVReward100p,
        aggregateRealizedNativeFMVReward50p: ts.aggregateRealizedNativeFMVReward50p,
        aggregateRealizedNativeMarketDilution100p: ts.aggregateRealizedNativeMarketDilution100p,
        aggregateRealizedNativeMarketDilution50p: ts.aggregateRealizedNativeMarketDilution50p,
        aggregateRealizedNativeSupplyDepletion100p: ts.aggregateRealizedNativeSupplyDepletion100p,
        aggregateRealizedNativeSupplyDepletion50p: ts.aggregateRealizedNativeSupplyDepletion50p,
        weightedAverageTotalDomainInvestmentCost: ts.weightedAverageTotalDomainInvestmentCost,
        nextTimeStamp: ts.nextTimeStamp,
        totalOperations: ts.totalOperations,
        noRewards: ts.noRewards,
        TezosPriceOnDateObjectGenerated: ts.TezosPriceOnDateObjectGenerated,
        pointOfSaleAggValue: ts.pointOfSaleAggValue,
        netDiffFMV: ts.netDiffFMV,
        netDiffDilution: ts.netDiffDilution,
        netDiffSupplyDepletion: ts.netDiffSupplyDepletion,
        investmentBasisCostArray: ts.investmentBasisCostArray,
        realizingDomainStartDate: ts.realizingDomainStartDate,
        realizingDomainEndDate: ts.realizingDomainEndDate,
        dateOfEntry: ts.dateOfEntry,
        lastUpdated: ts.lastUpdated,
    })
        .save().then((newObj) => {
        console.log('newObject created' + newObj._id);
        object = newObj;
    });
    return object;
}
exports.default = transform;
