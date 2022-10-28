import umbrella from "./umbrella.types"
var Umbrella = require("./umbrella.schema")
// const db = require('mongoose')
import { IUmbrellaDocument, IUmbrellaModel } from "./umbrella.types";
export async function findOneOrCreate(this: any, 
  setId: string
): Promise<IUmbrellaDocument> {
  const record = await this.findOne({ setId });
  if (record) {
    return record;
  } else {
    return this.create({ setId });
  }
}
export async function findByAge(this: any, 
  min?: number,
  max?: number
): Promise<IUmbrellaDocument[]> {
  return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
}

// db.createCollection(
//     "Umbrella",
//     {

//     }
// )

export default function transform(ts: umbrella){
    var object: any = {}
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
        .save().then((newObj: any)=>{
                console.log('newObject created' + newObj._id)
            object = newObj
        })
        return object

}