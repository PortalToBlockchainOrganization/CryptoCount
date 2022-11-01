"use strict";
// TODO: non relative imports
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import {AnalysisObject} from "../AnalysisObject";
const axios_1 = __importDefault(require("axios"));
const database_service_1 = require("../documentInterfaces/database.service");
// tezos specific constants
const REWARDADJUSTMENTDENOMINATOR = 1000000;
const BAKINGBADBATCHSIZE = 16;
const UNSCALEDAMOUNTTHRESHOLD = 0.0001;
const AMOUNTSCALER = 10000;
const TRANSACTIONURLLIMIT = 10000;
const MUTEZ = 1000000;
//sub interfaces for routing responses 
//gernerate 
//unrealized shit
//realize 
//realizing shit
//saved
//realized
//create superclass History Object State Holder
class TezosSet {
    constructor() {
    }
    init(fiat, address, consensusRole) {
        return __awaiter(this, void 0, void 0, function* () {
            this.objectId = ""; //generate object id in one line
            this.user_id = "";
            this.walletAddress = address;
            this.fiat = fiat;
            this.consensusRole = consensusRole;
            this.firstRewardDate = "";
            this.pricesAndMarketCapsByDay = new Map();
            this.rewardsByDay = [];
            this.balancesByDay = {};
            this.unaccountedNetTransactions = [];
            this.bakerCycles = [];
            this.marketByDay = [];
            this.priceByDay = [];
            this.cyclesByDay = [];
            this.nativeMarketDilutionRewards = [];
            this.supplyByDay = [];
            this.rawWalletTransactions = [];
            this.nativeSupplyDepletion = [];
            this.rewardsByCycle = [];
            this.cyclesMappedToDays = new Map();
            this.bakerAddresses = new Set();
            this.transactionsUrl = `https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=${this.walletAddress}&limit=10000`;
            this.delegatorRewardsUrl = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0&limit=10000`;
            this.nativeRewardsFMVByCycle = new Array();
            this.nativeSupplyDepletionRewards = new Array();
            this.unrealizedNativeRewards = [];
            this.unrealizedNativeFMVRewards = [];
            this.unrealizedNativeMarketDilutionRewards = [];
            this.unrealizedNativeSupplyDepletionRewards = [];
            this.realizingNativeRewards = [];
            this.realizingNativeFMVRewards = [];
            this.realizingNativeMarketDilutionRewards = [];
            this.realizingNativeSupplyDepletionRewards = [];
            this.aggregateUnrealizedNativeReward25p = 0;
            this.aggregateUnrealizedNativeReward50p = 0;
            this.aggregateUnrealizedNativeReward75p = 0;
            this.aggregateUnrealizedNativeReward100p = 0;
            this.aggregateRealizedNativeReward100p = 0;
            this.aggregateRealizedNativeReward50p = 0;
            this.aggregateRealizedNativeFMVReward100p = 0;
            this.aggregateRealizedNativeFMVReward50p = 0;
            this.aggregateRealizedNativeMarketDilution100p = 0;
            this.aggregateRealizedNativeMarketDilution50p = 0;
            this.aggregateRealizedNativeSupplyDepletion100p = 0;
            this.aggregateRealizedNativeSupplyDepletion50p = 0;
            this.realizedNativeRewards = [];
            this.realizedNativeFMVRewards = [];
            this.realizedNativeMarketDilutionRewards = [];
            this.realizedNativeSupplyDepletionRewards = [];
            this.weightedAverageTotalDomainInvestmentCost = 0;
            this.nextTimeStamp = "";
            this.totalOperations = [];
            this.noRewards = "";
            this.TezosPriceOnDateObjectGenerated = 0;
            this.pointOfSaleAggValue = 0;
            this.netDiffFMV = 0;
            this.netDiffDilution = 0;
            this.netDiffSupplyDepletion = 0;
            this.investmentBasisCostArray = [];
            this.lastUpdated = new Date();
            this.realizingDomainStartDate = "";
            this.realizingDomainEndDate = "";
            console.log('hyp1');
            yield (0, database_service_1.connectToDatabase)();
            // get data from apis + db
            console.log('hyp2');
            //check for baker consensus Role
            if (this.consensusRole == "Baker") {
                console.log("Baker processing");
                yield Promise.all([this.getBakerRewardsAndTransactions(), this.getPricesAndMarketCap()]);
                //make returenve baker rewards output equal to the pre unrealized data arrays
                //this.getBalances()
            }
            else {
                //delegator route
                yield Promise.all([this.getDelegatorRewardsAndTransactions(), this.getBalances(), this.getPricesAndMarketCap()]);
                if (this.rewardsByDay.length > 0) {
                    this.noRewards = false;
                }
                else {
                    this.noRewards = true;
                }
            }
            if (this.noRewards === false) {
                // conduct analysis
                this.firstRewardDate = this.rewardsByDay[0].date;
                this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
                this.investmentsScaledBVByDomain = this.calculateInvestmentBVByDomain();
                yield this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain);
                yield this.calculateNativeMarketDilutionRewards(this.investmentsScaledBVByDomain);
                yield this.analysis();
                console.log("this");
                //console.log(this)
            }
            else {
                //console.log(this)
            }
            return;
        });
    }
    //init functions for realizing state
    //import the umbrella db and write to the this.(s)
    initRealizing(object) {
        return __awaiter(this, void 0, void 0, function* () {
            //transform the js object into this
            this.walletAddress = object.walletAddress;
            this.fiat = object.fiat;
            this.consensusRole = object.consensusRole;
            this.firstRewardDate = object.firstRewardDate;
            this.pricesAndMarketCapsByDay = object.pricesAndMarketCapsByDay;
            this.rewardsByDay = object.rewardsByDay;
            this.balancesByDay = object.balancesByDay;
            this.unaccountedNetTransactions = object.unaccountedNetTransactions;
            this.bakerCycles = object.bakerCycles;
            this.marketByDay = object.marketByDay;
            this.priceByDay = object.priceByDay;
            this.cyclesByDay = object.cyclesByDay;
            this.nativeMarketDilutionRewards = object.nativeMarketDilutionRewards;
            this.supplyByDay = object.supplyByDay;
            this.rawWalletTransactions = object.rawWalletTransactions;
            this.nativeSupplyDepletion = object.nativeSupplyDepletion;
            this.rewardsByCycle = object.rewardsByCycle;
            this.cyclesMappedToDays = object.cyclesMappedToDays;
            this.bakerAddresses = object.bakerAddresses;
            this.transactionsUrl = object.transactionsUrl;
            this.delegatorRewardsUrl = object.delegatorRewardsUrl;
            this.nativeRewardsFMVByCycle = object.nativeRewardsFMVByCycle;
            this.nativeSupplyDepletionRewards = object.nativeSupplyDepletionRewards;
            this.unrealizedNativeRewards = object.unrealizedNativeRewards;
            this.unrealizedNativeFMVRewards = object.unrealizedNativeFMVRewards;
            this.unrealizedNativeMarketDilutionRewards = object.unrealizedNativeMarketDilutionRewards;
            this.unrealizedNativeSupplyDepletionRewards = object.unrealizedNativeSupplyDepletionRewards;
            this.realizingNativeRewards = object.realizingNativeRewards;
            this.realizingNativeFMVRewards = object.realizingNativeFMVRewards;
            this.realizingNativeMarketDilutionRewards = object.realizingNativeMarketDilutionRewards;
            this.realizingNativeSupplyDepletionRewards = object.realizingNativeSupplyDepletionRewards;
            this.aggregateUnrealizedNativeReward25p = object.aggregateUnrealizedNativeReward25p;
            this.aggregateUnrealizedNativeReward50p = object.aggregateUnrealizedNativeReward50p;
            this.aggregateUnrealizedNativeReward75p = object.aggregateUnrealizedNativeReward75p;
            this.aggregateUnrealizedNativeReward100p = object.aggregateUnrealizedNativeReward100p;
            this.aggregateRealizedNativeReward100p = object.aggregateRealizedNativeReward100p;
            this.aggregateRealizedNativeReward50p = object.aggregateRealizedNativeReward50p;
            this.aggregateRealizedNativeFMVReward100p = object.aggregateRealizedNativeFMVReward100p;
            this.aggregateRealizedNativeFMVReward50p = object.aggregateRealizedNativeFMVReward50p;
            this.aggregateRealizedNativeMarketDilution100p = object.aggregateRealizedNativeMarketDilution100p;
            this.aggregateRealizedNativeMarketDilution50p = object.aggregateRealizedNativeMarketDilution50p;
            this.aggregateRealizedNativeSupplyDepletion100p = object.aggregateRealizedNativeSupplyDepletion100p;
            this.aggregateRealizedNativeSupplyDepletion50p = object.aggregateRealizedNativeSupplyDepletion50p;
            this.realizedNativeRewards = object.realizedNativeRewards;
            this.realizedNativeFMVRewards = object.realizedNativeFMVRewards;
            this.realizedNativeMarketDilutionRewards = object.realizedNativeMarketDilutionRewards;
            this.realizedNativeSupplyDepletionRewards = object.realizedNativeSupplyDepletionRewards;
            this.weightedAverageTotalDomainInvestmentCost = object.weightedAverageTotalDomainInvestmentCost;
            this.nextTimeStamp = object.nextTimeStamp;
            this.totalOperations = object.totalOperations;
            this.noRewards = object.noRewards;
            this.TezosPriceOnDateObjectGenerated = object.TezosPriceOnDateObjectGenerated;
            this.pointOfSaleAggValue = object.pointOfSaleAggValue;
            this.netDiffFMV = object.netDiffFMV;
            this.netDiffDilution = object.netDiffDilution;
            this.netDiffSupplyDepletion = object.netDiffSupplyDepletion;
            this.investmentBasisCostArray = object.investmentBasisCostArray;
            this.isCustodial = object.isCustodial;
            this.investmentsScaledBVByDomain = object.investmentsScaledBVByDomain;
        });
    }
    //init function for save state
    initSave(object) {
        return __awaiter(this, void 0, void 0, function* () {
            // writeFile("bbbeBoob.json", JSON.stringify(object, null, 4), function(err) {
            //     if(err) {
            //       console.log(err);
            //     } else {
            //       console.log("JSON saved to " + "test.json");
            //     console.log(ts)
            // }})
            this.walletAddress = object.walletAddress;
            this.fiat = object.fiat;
            this.consensusRole = object.consensusRole;
            this.firstRewardDate = object.firstRewardDate;
            this.pricesAndMarketCapsByDay = object.pricesAndMarketCapsByDay;
            this.rewardsByDay = object.rewardsByDay;
            this.balancesByDay = object.balancesByDay;
            this.unaccountedNetTransactions = object.unaccountedNetTransactions;
            this.bakerCycles = object.bakerCycles;
            this.marketByDay = object.marketByDay;
            this.priceByDay = object.priceByDay;
            this.cyclesByDay = object.cyclesByDay;
            this.nativeMarketDilutionRewards = object.nativeMarketDilutionRewards;
            this.supplyByDay = object.supplyByDay;
            this.rawWalletTransactions = object.rawWalletTransactions;
            this.nativeSupplyDepletion = object.nativeSupplyDepletion;
            this.rewardsByCycle = object.rewardsByCycle;
            this.cyclesMappedToDays = object.cyclesMappedToDays;
            this.bakerAddresses = object.bakerAddresses;
            this.transactionsUrl = object.transactionsUrl;
            this.delegatorRewardsUrl = object.delegatorRewardsUrl;
            this.nativeRewardsFMVByCycle = object.nativeRewardsFMVByCycle;
            this.nativeSupplyDepletionRewards = object.nativeSupplyDepletionRewards;
            this.unrealizedNativeRewards = object.unrealizedNativeRewards;
            this.unrealizedNativeFMVRewards = object.unrealizedNativeFMVRewards;
            this.unrealizedNativeMarketDilutionRewards = object.unrealizedNativeMarketDilutionRewards;
            this.unrealizedNativeSupplyDepletionRewards = object.unrealizedNativeSupplyDepletionRewards;
            this.realizingNativeRewards = object.realizingNativeRewards;
            this.realizingNativeFMVRewards = object.realizingNativeFMVRewards;
            this.realizingNativeMarketDilutionRewards = object.realizingNativeMarketDilutionRewards;
            this.realizingNativeSupplyDepletionRewards = object.realizingNativeSupplyDepletionRewards;
            this.aggregateUnrealizedNativeReward25p = object.aggregateUnrealizedNativeReward25p;
            this.aggregateUnrealizedNativeReward50p = object.aggregateUnrealizedNativeReward50p;
            this.aggregateUnrealizedNativeReward75p = object.aggregateUnrealizedNativeReward75p;
            this.aggregateUnrealizedNativeReward100p = object.aggregateUnrealizedNativeReward100p;
            this.aggregateRealizedNativeReward100p = object.aggregateRealizedNativeReward100p;
            this.aggregateRealizedNativeReward50p = object.aggregateRealizedNativeReward50p;
            this.aggregateRealizedNativeFMVReward100p = object.aggregateRealizedNativeFMVReward100p;
            this.aggregateRealizedNativeFMVReward50p = object.aggregateRealizedNativeFMVReward50p;
            this.aggregateRealizedNativeMarketDilution100p = object.aggregateRealizedNativeMarketDilution100p;
            this.aggregateRealizedNativeMarketDilution50p = object.aggregateRealizedNativeMarketDilution50p;
            this.aggregateRealizedNativeSupplyDepletion100p = object.aggregateRealizedNativeSupplyDepletion100p;
            this.aggregateRealizedNativeSupplyDepletion50p = object.aggregateRealizedNativeSupplyDepletion50p;
            this.realizedNativeRewards = object.realizedNativeRewards;
            this.realizedNativeFMVRewards = object.realizedNativeFMVRewards;
            this.realizedNativeMarketDilutionRewards = object.realizedNativeMarketDilutionRewards;
            this.realizedNativeSupplyDepletionRewards = object.realizedNativeSupplyDepletionRewards;
            this.weightedAverageTotalDomainInvestmentCost = object.weightedAverageTotalDomainInvestmentCost;
            this.nextTimeStamp = object.nextTimeStamp;
            this.totalOperations = object.totalOperations;
            this.noRewards = object.noRewards;
            this.TezosPriceOnDateObjectGenerated = object.TezosPriceOnDateObjectGenerated;
            this.pointOfSaleAggValue = object.pointOfSaleAggValue;
            this.netDiffFMV = object.netDiffFMV;
            this.netDiffDilution = object.netDiffDilution;
            this.netDiffSupplyDepletion = object.netDiffSupplyDepletion;
            this.investmentBasisCostArray = object.investmentBasisCostArray;
            this.isCustodial = object.isCustodial;
            this.investmentsScaledBVByDomain = object.investmentsScaledBVByDomain;
            // writeFile("abbeBoob.json", JSON.stringify(object, null, 4), function(err) {
            //     if(err) {
            //       console.log(err);
            //     } else {
            //       console.log("JSON saved to " + "test.json");
            //     console.log(ts)
            // }})
        });
    }
    combineUpdate(object, objectUpdated) {
        return __awaiter(this, void 0, void 0, function* () {
            //append the new unrealized values and overwrite the bv domains and other values
            //overwrites
            this.walletAddress = object.walletAddress;
            this.fiat = object.fiat;
            this.consensusRole = object.consensusRole;
            this.firstRewardDate = object.firstRewardDate;
            this.pricesAndMarketCapsByDay = objectUpdated.pricesAndMarketCapsByDay;
            this.rewardsByDay = objectUpdated.rewardsByDay;
            this.balancesByDay = objectUpdated.balancesByDay;
            this.unaccountedNetTransactions = objectUpdated.unaccountedNetTransactions;
            this.bakerCycles = objectUpdated.bakerCycles;
            this.marketByDay = objectUpdated.marketByDay;
            this.priceByDay = objectUpdated.priceByDay;
            this.cyclesByDay = objectUpdated.cyclesByDay;
            this.nativeMarketDilutionRewards = objectUpdated.nativeMarketDilutionRewards;
            this.supplyByDay = objectUpdated.supplyByDay;
            this.rawWalletTransactions = objectUpdated.rawWalletTransactions;
            this.nativeSupplyDepletion = objectUpdated.nativeSupplyDepletion;
            this.rewardsByCycle = objectUpdated.rewardsByCycle;
            this.cyclesMappedToDays = objectUpdated.cyclesMappedToDays;
            this.bakerAddresses = objectUpdated.bakerAddresses;
            this.transactionsUrl = objectUpdated.transactionsUrl;
            this.delegatorRewardsUrl = objectUpdated.delegatorRewardsUrl;
            this.nativeRewardsFMVByCycle = objectUpdated.nativeRewardsFMVByCycle;
            this.nativeSupplyDepletionRewards = objectUpdated.nativeSupplyDepletionRewards;
            this.weightedAverageTotalDomainInvestmentCost = objectUpdated.weightedAverageTotalDomainInvestmentCost;
            this.nextTimeStamp = objectUpdated.nextTimeStamp;
            this.totalOperations = objectUpdated.totalOperations;
            this.noRewards = objectUpdated.noRewards;
            this.TezosPriceOnDateObjectGenerated = objectUpdated.TezosPriceOnDateObjectGenerated;
            this.pointOfSaleAggValue = 0;
            this.netDiffFMV = 0;
            this.netDiffDilution = 0;
            this.netDiffSupplyDepletion = 0;
            this.investmentBasisCostArray = objectUpdated.investmentBasisCostArray;
            this.isCustodial = object.isCustodial;
            this.investmentsScaledBVByDomain = objectUpdated.investmentsScaledBVByDomain;
            //re agg
            this.aggregateUnrealizedNativeReward25p = object.aggregateUnrealizedNativeReward25p;
            this.aggregateUnrealizedNativeReward50p = object.aggregateUnrealizedNativeReward50p;
            this.aggregateUnrealizedNativeReward75p = object.aggregateUnrealizedNativeReward75p;
            this.aggregateUnrealizedNativeReward100p = object.aggregateUnrealizedNativeReward100p;
            //the same 
            this.aggregateRealizedNativeReward100p = object.aggregateRealizedNativeReward100p;
            this.aggregateRealizedNativeReward50p = object.aggregateRealizedNativeReward50p;
            this.aggregateRealizedNativeFMVReward100p = object.aggregateRealizedNativeFMVReward100p;
            this.aggregateRealizedNativeFMVReward50p = object.aggregateRealizedNativeFMVReward50p;
            this.aggregateRealizedNativeMarketDilution100p = object.aggregateRealizedNativeMarketDilution100p;
            this.aggregateRealizedNativeMarketDilution50p = object.aggregateRealizedNativeMarketDilution50p;
            this.aggregateRealizedNativeSupplyDepletion100p = object.aggregateRealizedNativeSupplyDepletion100p;
            this.aggregateRealizedNativeSupplyDepletion50p = object.aggregateRealizedNativeSupplyDepletion50p;
            // the same
            this.realizedNativeRewards = object.realizedNativeRewards;
            this.realizedNativeFMVRewards = object.realizedNativeFMVRewards;
            this.realizedNativeMarketDilutionRewards = object.realizedNativeMarketDilutionRewards;
            this.realizedNativeSupplyDepletionRewards = object.realizedNativeSupplyDepletionRewards;
            //should be empty
            this.realizingNativeRewards = [];
            this.realizingNativeFMVRewards = [];
            this.realizingNativeMarketDilutionRewards = [];
            this.realizingNativeSupplyDepletionRewards = [];
            //initing
            this.unrealizedNativeRewards = object.unrealizedNativeRewards;
            this.unrealizedNativeFMVRewards = object.unrealizedNativeFMVRewards;
            this.unrealizedNativeMarketDilutionRewards = object.unrealizedNativeMarketDilutionRewards;
            this.unrealizedNativeSupplyDepletionRewards = object.unrealizedNativeSupplyDepletionRewards;
        });
    }
    //product methods
    analysis() {
        return __awaiter(this, void 0, void 0, function* () {
            // //data packages
            // this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
            // await this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain);
            // await this.calculateNativeMarketDilutionRewards(this.investmentsScaledBVByDomain);
            //convert
            this.rewardsByCycle.forEach((value) => { this.unrealizedNativeRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: 0 }); });
            this.nativeRewardsFMVByCycle.forEach((value) => { this.unrealizedNativeFMVRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: 0 }); });
            this.nativeMarketDilutionRewards.forEach((value) => { this.unrealizedNativeMarketDilutionRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: 0 }); });
            this.nativeSupplyDepletionRewards.forEach((value) => { this.unrealizedNativeSupplyDepletionRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: 0 }); });
            //console.log('before ordering and basis')
            // console.log(this.unrealizedNativeRewards[0])
            // console.log(this.unrealizedNativeFMVRewards[0])
            // console.log(this.unrealizedNativeMarketDilutionRewards[0])
            // console.log(this.unrealizedNativeSupplyDepletionRewards[0])
            this.orderAccountingSets();
            //console.log('after ordering')
            // console.log(this.unrealizedNativeRewards[7])
            // console.log(this.unrealizedNativeFMVRewards)
            // console.log(this.unrealizedNativeMarketDilutionRewards[7])
            // console.log(this.unrealizedNativeSupplyDepletionRewards[7])
            yield this.basisInvestmentCosts();
            yield this.basisInvestmentCostsToNativeRewards();
            // console.log('before second ordering')
            // console.log(this.unrealizedNativeRewards[0])
            // console.log(this.unrealizedNativeFMVRewards[0])
            // console.log(this.unrealizedNativeMarketDilutionRewards[0])
            // console.log(this.unrealizedNativeSupplyDepletionRewards[0])
            //valuea -valueb gives a LIFO behavior
            //valueb - valuea gives FIFO behavior
            this.orderAccountingSets();
            //filter the unrealized arrays to put in chronolgoical order
            // console.log('after ordering and basis')
            // console.log(this.unrealizedNativeRewards[0])
            // console.log(this.unrealizedNativeFMVRewards[0])
            // console.log(this.unrealizedNativeMarketDilutionRewards[0])
            // console.log(this.unrealizedNativeSupplyDepletionRewards[0])
            //set mod -behaviors
            //this.realizeReward()
            this.aggregates();
            //this.saveRealization()
            // this.pointOfSaleCosts()
            //move this above the realizing
        });
    }
    realizeProcess(quantity, object) {
        return __awaiter(this, void 0, void 0, function* () {
            //object is mutated after one save and while in the save route
            this.initRealizing(object); //.then(x => {writeFile("yurtesticl.json", JSON.stringify(this, null, 4), function(err) {
            //     if(err) {
            //       console.log(err);
            //     } else {
            //       console.log("JSON saved to " + "test.json");
            //     console.log(ts)
            //     }
            // })})
            this.realizeReward(quantity)
                // .then(x => {writeFile("testicl.json", JSON.stringify(this, null, 4), function(err) {
                //     if(err) {
                //       console.log(err);
                //     } else {
                //       console.log("JSON saved to " + "test.json");
                //     console.log(ts)
                //     }
                // })})
                .then(() => {
                this.aggregates();
            }).then(() => {
                this.getRealizingAssetDomain();
            });
            yield this.pointOfSaleCosts();
            console.log("here4");
        });
    }
    saveProcess(object) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initSave(object);
            // writeFile("boob.json", JSON.stringify(this, null, 4), function(err) {
            //     if(err) {
            //       console.log(err);
            //     } else {
            //       console.log("JSON saved to " + "test.json");
            //     console.log(ts)
            // }})
            this.saveRealization();
            this.aggregates();
            // await this.pointOfSaleCosts()
        });
    }
    updateProcess(object, updatedObject) {
        return __awaiter(this, void 0, void 0, function* () {
            //less sensisitve overwrite
            console.log("updatedObj");
            // console.log(updatedObject)
            this.combineUpdate(object, updatedObject);
            //realized and unrealized preservation
            this.sensitiveProps(object, updatedObject);
            this.aggregates();
            this.lastUpdated = new Date();
            //re agg? //need unrealized re agg
        });
    }
    getRealizingAssetDomain() {
        return __awaiter(this, void 0, void 0, function* () {
            this.realizingDomainStartDate = this.realizingNativeRewards[0].date;
            this.realizingDomainEndDate = this.realizingNativeRewards[this.realizingNativeRewards.length - 1].date;
        });
    }
    sensitiveProps(object, updatedObject) {
        return __awaiter(this, void 0, void 0, function* () {
            var lastDate = new Date(object.unrealizedNativeRewards[object.unrealizedNativeRewards.length - 1].date); //last unrealized rewqard date
            var newUnrealizedNativeRewards = [];
            var newUnrealizedNativeFMVRewards = [];
            var newUnrealizedNativeMarketDilutionRewards = [];
            var newUnrealizedNativeSupplyDepletionRewards = [];
            //push to new unrealized rewards
            updatedObject.unrealizedNativeRewards.forEach((obj) => {
                var date = new Date(obj.date);
                if (date > lastDate) {
                    newUnrealizedNativeRewards.push(obj); //pushes unrealized native entry to new entries
                }
            });
            updatedObject.unrealizedNativeFMVRewards.forEach((obj) => {
                var date = new Date(obj.date);
                if (date > lastDate) {
                    newUnrealizedNativeFMVRewards.push(obj); //pushes unrealized native entry to new entries
                }
            });
            updatedObject.unrealizedNativeMarketDilutionRewards.forEach((obj) => {
                var date = new Date(obj.date);
                if (date > lastDate) {
                    newUnrealizedNativeMarketDilutionRewards.push(obj); //pushes unrealized native entry to new entries
                }
            });
            updatedObject.unrealizedNativeSupplyDepletionRewards.forEach((obj) => {
                var date = new Date(obj.date);
                if (date > lastDate) {
                    newUnrealizedNativeSupplyDepletionRewards.push(obj); //pushes unrealized native entry to new entries
                }
            });
            //add / append to this
            newUnrealizedNativeRewards.forEach((obj) => {
                //console.log(obj)
                this.unrealizedNativeRewards.push({ date: obj.date, rewardAmount: obj.rewardAmount, cycle: obj.cycle, basisCost: obj.basisCost });
            });
            newUnrealizedNativeFMVRewards.forEach((obj) => {
                //console.log(obj)
                this.unrealizedNativeFMVRewards.push({ date: obj.date, rewardAmount: obj.rewardAmount, cycle: obj.cycle, basisCost: obj.basisCost });
            });
            newUnrealizedNativeMarketDilutionRewards.forEach((obj) => {
                //console.log(obj)
                this.unrealizedNativeMarketDilutionRewards.push({ date: obj.date, rewardAmount: obj.rewardAmount, cycle: obj.cycle, basisCost: obj.basisCost });
            });
            newUnrealizedNativeSupplyDepletionRewards.forEach((obj) => {
                //console.log(obj)
                this.unrealizedNativeSupplyDepletionRewards.push({ date: obj.date, rewardAmount: obj.rewardAmount, cycle: obj.cycle, basisCost: obj.basisCost });
            });
        });
    }
    realizeReward(quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            //add the basis cost per reward onto these translations
            //define argument here, the depletion quantity 
            //let quantity: number = 30;
            //convert the fmv arrays into maps to get the reward value by date
            let unrealizedNativeRewardsMap = Object.assign({}, ...this.unrealizedNativeRewards.map((x) => ({ [x.date]: x.rewardAmount })));
            let unrealizedNativeFMVRewardsMap = Object.assign({}, ...this.unrealizedNativeFMVRewards.map((x) => ({ [x.date]: x.rewardAmount })));
            let unrealizedNativeMarketDilutionRewardsMap = Object.assign({}, ...this.unrealizedNativeMarketDilutionRewards.map((x) => ({ [x.date]: x.rewardAmount })));
            let unrealizedNativeSupplyDepletionRewardsMap = Object.assign({}, ...this.unrealizedNativeSupplyDepletionRewards.map((x) => ({ [x.date]: x.rewardAmount })));
            // console.log('unrealizedNativeFMVrewardMAp')
            // console.log(unrealizedNativeFMVRewardsMap)
            //let splicelist = []
            let object1 = {};
            let object2 = {};
            let object3 = {};
            let object4 = {};
            for (let i = 0; i < this.unrealizedNativeRewards.length; i++) {
                if (this.unrealizedNativeRewards[i].rewardAmount > quantity && quantity != 0) {
                    let newValue1 = quantity;
                    let newValue2 = this.unrealizedNativeRewards[i].rewardAmount - quantity;
                    let value1 = unrealizedNativeFMVRewardsMap[this.unrealizedNativeRewards[i].date];
                    console.log("value1");
                    console.log(value1);
                    let value2 = this.unrealizedNativeRewards[i].rewardAmount;
                    console.log("value2");
                    console.log(value2);
                    //add check if value 2 (native reward q) is 0 and make it
                    let value3 = 0;
                    let value4 = 0;
                    let value5 = 0;
                    let value6 = 0;
                    let value7 = 0;
                    //add date if the baker off by one to cycles error is detected
                    if (unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date] === undefined) {
                        console.log('inpatch');
                        let date = this.unrealizedNativeMarketDilutionRewards[i].date;
                        // let newDate: any
                        // let date = new Date(this.unrealizedNativeMarketDilutionRewards[i].date)
                        // date.setDate(date.getDate() + 1);
                        // let year = date.getFullYear();
                        // let month = date.getMonth();
                        // let dt2: any
                        // dt2 = date.getDate();
                        // let month1: any
                        // if (dt2 < 10) {
                        //     dt2 = '0' + dt2;
                        // }
                        // if (month < 10) {
                        //     month1 = '0' + month;
                        // }
                        // newDate = (year+ '-' + month1 + '-' + dt2);
                        //console.log(newDate)
                        value3 = unrealizedNativeMarketDilutionRewardsMap[date];
                        value4 = unrealizedNativeSupplyDepletionRewardsMap[date];
                    }
                    else {
                        value3 = unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date];
                        value4 = unrealizedNativeSupplyDepletionRewardsMap[this.unrealizedNativeRewards[i].date];
                    }
                    value5 = value1 / value2; // yields price on day
                    value6 = value3 / value2;
                    // console.log("value")
                    // console.log(value3)
                    value7 = value4 / value2;
                    //console.log("value4")
                    // console.log(value4)
                    // console.log('value6'+" "+ value6)
                    // console.log("newVal1"+ ' '+ newValue1)
                    // console.log('literally it' + newValue1 * value6)
                    // if(isNaN(value6)) {
                    //     value6 =0 
                    // }
                    // if(isNaN(value7)){
                    //     value7 = 0
                    // }
                    this.realizingNativeRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1, cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    this.realizingNativeFMVRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value5, cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    this.realizingNativeMarketDilutionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value6, cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    this.realizingNativeSupplyDepletionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value7, cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    //multiple the three scalars by the newValue2 for unrealized and use quantity for the realizing
                    //we wanna change this from unshift to just overwriting that prev object bc otherwise it gonna double stack
                    //store the unshift objects
                    //then 
                    object1 = { date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value5, cycle: this.unrealizedNativeRewards[i].cycle };
                    object2 = { date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value6, cycle: this.unrealizedNativeRewards[i].cycle };
                    object3 = { date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value7, cycle: this.unrealizedNativeRewards[i].cycle };
                    object4 = { date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2, cycle: this.unrealizedNativeRewards[i].cycle };
                    quantity = 0;
                }
                //this hits first and unshifts our for loop by one so we have go back one in the logic above, this works bc its fifo and we wont need to track other indexes that are taken 
                else if (this.unrealizedNativeRewards[i].rewardAmount <= quantity && quantity != 0) {
                    //this is the zero one
                    //the market and supply depletion dates r off by one fucking this up
                    this.realizingNativeRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    this.realizingNativeFMVRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeFMVRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    console.log(unrealizedNativeMarketDilutionRewardsMap["2018-"]);
                    //patch for baker being off by one date
                    if (unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date] === undefined) {
                        console.log('inpatch');
                        let date = this.unrealizedNativeMarketDilutionRewards[i].date;
                        // let date = new Date(this.unrealizedNativeMarketDilutionRewards[i].date)
                        // date.setDate(date.getDate() + 1);
                        // let year = date.getFullYear();
                        // let month = date.getMonth();
                        // let dt2: any
                        // dt2 = date.getDate();
                        // let month1: any
                        // if (dt2 < 10) {
                        //     dt2 = '0' + dt2;
                        // }
                        // if (month < 10) {
                        //     month1 = '0' + month;
                        // }
                        // var newDate = (year+ '-' + month1 + '-' + dt2);
                        console.log(unrealizedNativeMarketDilutionRewardsMap[date]);
                        this.realizingNativeMarketDilutionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeMarketDilutionRewardsMap[date], cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                        this.realizingNativeSupplyDepletionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeSupplyDepletionRewardsMap[date], cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    }
                    else {
                        this.realizingNativeMarketDilutionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                        this.realizingNativeSupplyDepletionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeSupplyDepletionRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle, basisCost: this.unrealizedNativeRewards[i].basisCost });
                    }
                    //splicelist.push(index)
                    quantity = quantity - unrealizedNativeRewardsMap[this.unrealizedNativeRewards[i].date];
                    if (quantity < 0) {
                        quantity = 0;
                    }
                }
            }
            this.unrealizedNativeRewards.splice(0, this.realizingNativeRewards.length);
            this.unrealizedNativeFMVRewards.splice(0, this.realizingNativeRewards.length);
            this.unrealizedNativeMarketDilutionRewards.splice(0, this.realizingNativeRewards.length);
            this.unrealizedNativeSupplyDepletionRewards.splice(0, this.realizingNativeRewards.length);
            //then we unshift here
            this.unrealizedNativeFMVRewards.unshift(object1);
            this.unrealizedNativeMarketDilutionRewards.unshift(object2);
            this.unrealizedNativeSupplyDepletionRewards.unshift(object3);
            this.unrealizedNativeRewards.unshift(object4);
        });
    }
    aggregates() {
        return __awaiter(this, void 0, void 0, function* () {
            //from the unrealized and realized arrays
            //prepare unrealized aggreagte figures and attach to object for more quantity selection information (25%, 50%, 75%, 100%)  
            //4 parsed up agg values for native rewards unrealized array for quantity fill purposes 
            let mainValue1 = 0;
            this.unrealizedNativeRewards.forEach((value) => {
                if (value.rewardAmount !== undefined) {
                    mainValue1 += value.rewardAmount;
                }
            });
            this.aggregateUnrealizedNativeReward25p = mainValue1 * 0.25;
            this.aggregateUnrealizedNativeReward50p = mainValue1 * 0.5;
            this.aggregateUnrealizedNativeReward75p = mainValue1 * 0.75;
            this.aggregateUnrealizedNativeReward100p = mainValue1;
            try {
                let mainValue2 = 0;
                this.realizingNativeFMVRewards.forEach((value) => {
                    if (value.rewardAmount !== undefined) {
                        mainValue2 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeFMVReward100p = mainValue2;
                this.aggregateRealizedNativeFMVReward50p = mainValue2 * 0.5;
                let mainValue3 = 0;
                this.realizingNativeMarketDilutionRewards.forEach((value) => {
                    if (value.rewardAmount !== undefined) {
                        mainValue3 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeMarketDilution100p = mainValue3;
                this.aggregateRealizedNativeMarketDilution50p = mainValue3 * 0.5;
                let mainValue4 = 0;
                this.realizingNativeSupplyDepletionRewards.forEach((value) => {
                    if (value.rewardAmount !== undefined) {
                        mainValue4 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeSupplyDepletion100p = mainValue4;
                this.aggregateRealizedNativeSupplyDepletion50p = mainValue4 * 0.5;
                let mainValue5 = 0;
                this.realizingNativeRewards.forEach((value) => {
                    if (value.rewardAmount !== undefined) {
                        mainValue5 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeReward100p = mainValue5;
                this.aggregateRealizedNativeReward50p = mainValue5 * 0.5;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    saveRealization() {
        return __awaiter(this, void 0, void 0, function* () {
            //make so they append to the old realized values
            if (this.realizedNativeRewards.length > 0) {
                this.realizedNativeRewards = this.realizedNativeRewards.concat(this.realizingNativeRewards);
                this.realizedNativeFMVRewards = this.realizedNativeFMVRewards.concat(this.realizingNativeFMVRewards);
                this.realizedNativeMarketDilutionRewards = this.realizedNativeMarketDilutionRewards.concat(this.realizingNativeMarketDilutionRewards);
                this.realizedNativeSupplyDepletionRewards = this.realizedNativeSupplyDepletionRewards.concat(this.realizingNativeSupplyDepletionRewards);
            }
            else {
                this.realizedNativeRewards = this.realizingNativeRewards.map((value) => value);
                this.realizedNativeFMVRewards = this.realizingNativeFMVRewards.map((value) => value);
                this.realizedNativeMarketDilutionRewards = this.realizingNativeMarketDilutionRewards.map((value) => value);
                this.realizedNativeSupplyDepletionRewards = this.realizingNativeSupplyDepletionRewards.map((value) => value);
            }
            //console.log(this.realizedNativeFMVRewards)    
            //or just overwrite the array to empty values
            this.realizingNativeRewards = [];
            this.realizingNativeFMVRewards = [];
            this.realizingNativeMarketDilutionRewards = [];
            this.realizingNativeSupplyDepletionRewards = [];
            // this.realizingNativeFMVRewards.splice(0, this.realizingNativeFMVRewards.length)
            // this.realizingNativeRewards.splice(0,this.realizingNativeRewards.length)
            // this.realizingNativeSupplyDepletionRewards.splice(0, this.realizingNativeSupplyDepletionRewards.length)
            // this.realizingNativeMarketDilutionRewards.splice(0,this.realizingNativeMarketDilutionRewards.length)
        });
    }
    basisInvestmentCosts() {
        return __awaiter(this, void 0, void 0, function* () {
            // this.priceByDay
            // this.investmentsScaledBVByDomain
            // this.unaccountedNetTransactions
            //for length of dates in domains, take the avergae of the pirces from the domain
            //domain with avergae 
            //for a change 
            let lastValue = 0;
            let ratioBank = [];
            let filtereredPriceByDay = this.priceByDay.filter((prices) => {
                return prices;
            });
            let dictionaryPriceByDay = Object.assign({}, ...filtereredPriceByDay.map((x) => ({ [x.date]: x.amount })));
            this.investmentsScaledBVByDomain.forEach((value) => {
                if (lastValue !== 0) {
                    let difference = value.scaledBookValue - lastValue;
                    let price = dictionaryPriceByDay[value.startDate];
                    ratioBank.push({ difference: difference, price: price, date: value.startDate });
                }
                lastValue = value.scaledBookValue;
            });
            //take the native difference in change and scale by price that day in a ratio 12 /1   13/ 2 sum  => value of average basis investment for up to that one. 
            //store taht value with its date which the domain change start 
            //rerun for each change
            //take the average calculation for all other domains (pirce and native) and add this one
            let basisArray = [];
            let scaledValsWithPrice = 0;
            let scaledVals = 0;
            console.log(ratioBank);
            ratioBank.forEach((value) => {
                scaledValsWithPrice = value.difference * value.price;
                scaledVals = value.difference;
                //agg up to this change
                let basisCost = scaledValsWithPrice / scaledVals;
                basisArray.push({ cost: basisCost, date: value.date });
                //add to other scaled vals and divide by number of scaled vals
            });
            this.investmentBasisCostArray = basisArray;
            //for each basisArray
            let agg = 0;
            basisArray.forEach((element) => {
                agg += element.cost;
            });
            console.log(basisArray);
            this.weightedAverageTotalDomainInvestmentCost = agg / basisArray.length;
            console.log(this.weightedAverageTotalDomainInvestmentCost);
            if (Number.isNaN(this.weightedAverageTotalDomainInvestmentCost) || this.weightedAverageTotalDomainInvestmentCost === null || this.weightedAverageTotalDomainInvestmentCost === undefined || this.weightedAverageTotalDomainInvestmentCost === Infinity) {
                this.weightedAverageTotalDomainInvestmentCost = 0;
            }
        });
    }
    basisInvestmentCostsToNativeRewards() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("start");
            //console.log(this.unrealizedNativeFMVRewards)
            let basisCost = 0;
            let basisDate = "";
            let prevTopObj = {};
            let unrealizedNativeMockup = [];
            let unrealizedFMVMockup = [];
            let unrealizedMarketMockup = [];
            let unrealizedSupplyMockup = [];
            //let mockupArray: any = []
            //shit is getting fucked at the end of this iteration at the first values
            this.investmentBasisCostArray.slice().reverse().forEach((value) => {
                basisCost = value.cost;
                basisDate = value.date;
                this.unrealizedNativeRewards.map((value) => {
                    if (value.date >= basisDate && value.date < prevTopObj.date) {
                        unrealizedNativeMockup.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: basisCost });
                    }
                });
                this.unrealizedNativeFMVRewards.map((value) => {
                    if (value.date >= basisDate && value.date < prevTopObj.date) {
                        unrealizedFMVMockup.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: basisCost });
                    }
                });
                this.unrealizedNativeMarketDilutionRewards.map((value) => {
                    if (value.date >= basisDate && value.date < prevTopObj.date) {
                        unrealizedMarketMockup.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: basisCost });
                    }
                });
                this.unrealizedNativeSupplyDepletionRewards.map((value) => {
                    if (value.date >= basisDate && value.date < prevTopObj.date) {
                        unrealizedSupplyMockup.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle, basisCost: basisCost });
                    }
                });
                //scale the next unrealizedArrays
                prevTopObj = value;
            });
            //console.log(mockupArray)
            unrealizedNativeMockup.reverse();
            unrealizedFMVMockup.reverse();
            unrealizedMarketMockup.reverse();
            unrealizedSupplyMockup.reverse();
            console.log("start");
            this.unrealizedNativeRewards = unrealizedNativeMockup;
            this.unrealizedNativeFMVRewards = unrealizedFMVMockup;
            this.unrealizedNativeMarketDilutionRewards = unrealizedMarketMockup;
            this.unrealizedNativeSupplyDepletionRewards = unrealizedSupplyMockup;
            // let firstValue = [{date:  unrealizedNativeMockup[0].date, rewardAmount:  unrealizedNativeMockup[0].rewardAmount, cycle:  unrealizedNativeMockup[0].cycle, basisCost: 0}]
            // unrealizedNativeMockup.splice(0, 1, firstValue)
            // unrealizedNativeMockup.join()
            // this.unrealizedNativeRewards = unrealizedNativeMockup
            // console.log(unrealizedNativeMockup)
            //go thru the costs, take the value down, 
            //go thru rewards, if the date of the reward is eq or greater than the date of the invesment basiscost && the invesment date val is not greater than the reward dte
            //attach the cost to the reward entry
        });
    }
    pointOfSaleCosts() {
        return __awaiter(this, void 0, void 0, function* () {
            //add todays price to this 
            yield this.retrieveTezosPriceToday();
            this.pointOfSaleAggValue = this.TezosPriceOnDateObjectGenerated * this.aggregateRealizedNativeReward100p;
            //add realized native rewards agg by todays price to this 
            this.netDiffFMV = this.pointOfSaleAggValue - this.aggregateRealizedNativeFMVReward100p; //positive is good negative is bad
            this.netDiffDilution = this.pointOfSaleAggValue - this.aggregateRealizedNativeMarketDilution100p;
            this.netDiffSupplyDepletion = this.pointOfSaleAggValue - this.aggregateRealizedNativeSupplyDepletion100p;
        });
    }
    calculateNativeRewardFMVByCycle() {
        //make this so if one day fails they all wont fails
        //rewards by day by price that day
        //console.log(this.pricesAndMarketCapsByDay['2022-09-20'].price)
        //console.log(this.rewardsByCycle)
        //console.log(this.rewardsByCycle)
        return this.rewardsByCycle.map((reward) => {
            //console.log(reward.date)
            //console.log(this.pricesAndMarketCapsByDay)
            //console.log(this.pricesAndMarketCapsByDay)
            //get the object type
            //conditional patch for missing early launch of tezos prices
            if (new Date(reward.date) < new Date("2018-07-04")) {
                return { date: reward.date, rewardAmount: reward.rewardAmount, cycle: reward.cycle };
            }
            else {
                return { date: reward.date, rewardAmount: reward.rewardAmount * this.pricesAndMarketCapsByDay[reward.date].price, cycle: reward.cycle };
            }
        });
    }
    calculateNativeMarketDilutionRewards(scaledBVByDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            let mappedBV = {};
            scaledBVByDomain.forEach(bvDomain => {
                // iterate over the date range (inclusive)
                let startDate = new Date(bvDomain.startDate);
                let endDate = new Date(bvDomain.endDate);
                while (startDate <= endDate) {
                    mappedBV[startDate.toISOString().slice(0, 10)] = bvDomain.scaledBookValue;
                    startDate.setDate(startDate.getDate() + 1);
                    if (startDate.toISOString().slice(11) !== "00:00:00.000Z") {
                        startDate.setDate(startDate.getDate() + 1);
                        startDate = new Date(startDate.toISOString().slice(0, 10));
                    }
                }
            });
            //console.log('mappedBV')
            if (new Date(this.firstRewardDate) <= new Date("2018-07-04")) {
                this.firstRewardDate = "2018-07-04";
            }
            console.log(this.firstRewardDate);
            //console.log(scaledBVByDomain)
            let nativeMarketDilutionByDay;
            let filteredMarketByDay = this.marketByDay.filter((markets) => {
                // if(new Date(this.firstRewardDate) < new Date("2018-07-03")){
                //     return markets
                // }
                return markets.date >= this.firstRewardDate;
            });
            //console.log(filteredMarketByDay)
            let filtereredPriceByDay = this.priceByDay.filter((prices) => {
                return prices.date >= this.firstRewardDate;
            });
            //make the prices a dict so you can put a date in and get the price amount
            let dictionaryPriceByDay = Object.assign({}, ...filtereredPriceByDay.map((x) => ({ [x.date]: x.amount })));
            let lastMarket = filteredMarketByDay[0];
            let lastPrice = filtereredPriceByDay[0].amount;
            //nativeMarketDilutionByDay[0] = {date: filteredMarketByDay[0].date, amount: 0}
            nativeMarketDilutionByDay = filteredMarketByDay.slice(1).map(market => {
                let ratio1 = ((market.amount - lastMarket.amount) / lastMarket.amount);
                let ratio2 = ((dictionaryPriceByDay[market.date] - lastPrice) / lastPrice);
                let ratio3 = ratio1 - ratio2;
                if (isNaN(ratio3) || ratio3 === Infinity || ratio3 === undefined) {
                    ratio3 = 0;
                }
                if (lastMarket.date === market.date) {
                    return;
                }
                lastMarket = market;
                lastPrice = dictionaryPriceByDay[market.date];
                return { date: market.date, amount: (ratio3) * mappedBV[market.date] };
            });
            //this cuts the almost the whole first month out //PATCH 10/22/2022, gets the native market on the same level as FMV 
            nativeMarketDilutionByDay.unshift({ date: filteredMarketByDay[0].date, amount: 0 });
            let nativeFilteredMarketDilutionByDay;
            console.log(nativeMarketDilutionByDay[0].date);
            //console.log(nativeMarketDilutionByDay[nativeMarketDilutionByDay.length-1].amount)
            //filter for existing dilution 
            nativeFilteredMarketDilutionByDay = nativeMarketDilutionByDay.map((element) => {
                if (element.amount === null) {
                    return { date: element.date, amount: 0 };
                }
                if (element.amount <= 0) {
                    return { date: element.date, amount: 0 };
                }
                else {
                    return element;
                }
            });
            // writeFile("marketDilutionDailyFilt.json", JSON.stringify(nativeFilteredMarketDilutionByDay, null, 4), async function(err) {console.log('the')})
            //let mappedFMV: Map<number, RewardsByDay> = new Map();
            let mappedFMV = {};
            this.nativeRewardsFMVByCycle.forEach((fmvReward) => {
                mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
            });
            //let mappedCyclesToFirstCycleDate: Map<number, string> = new Map();
            let mappedCyclesToFirstCycleDate = {};
            this.cyclesMappedToDays.forEach((key, value) => {
                mappedCyclesToFirstCycleDate[value] = key;
            });
            //first element of market rewards is different than native rewards
            let nativeMarketDilutionRewards = [];
            //say if native reward[0].date < market dilution by day, do that one
            let currentDate = nativeFilteredMarketDilutionByDay[0].date;
            let currentDilutionCycle = mappedCyclesToFirstCycleDate[currentDate];
            //check if fmv first date is less than market dilution first date
            if (new Date(this.nativeRewardsFMVByCycle[0].date) < new Date(nativeFilteredMarketDilutionByDay[0].date)) {
                console.log('reassingin fist date');
                currentDate = this.nativeRewardsFMVByCycle[1].date;
                currentDilutionCycle = mappedCyclesToFirstCycleDate['2018-07-05'];
            }
            let aggDilutionAmount = nativeFilteredMarketDilutionByDay[0].amount;
            let endDate = nativeFilteredMarketDilutionByDay[nativeFilteredMarketDilutionByDay.length - 1].date;
            console.log(nativeFilteredMarketDilutionByDay[0].date);
            //console.log(nativeFilteredMarketDilutionByDay)
            console.log(this.cyclesMappedToDays.get("2018-07-18"));
            //for each dilution date, if the cycle of that date is not the current dilution cycle, do this then set it to current diltuion cycle
            nativeFilteredMarketDilutionByDay.forEach(nativeFilteredMarketDilutionByDay => {
                if (this.cyclesMappedToDays.get(nativeFilteredMarketDilutionByDay.date) !== currentDilutionCycle) {
                    //date is one in front of desired date for foundation baker
                    // //date mod back one here
                    // let date: any
                    // date = new Date(currentDate)
                    // date.setDate(date.getDate() )
                    // let year = date.getFullYear();
                    // let month = date.getMonth();
                    // let dt = date.getDate();
                    // if (dt < 10) {
                    //     dt = '0' + dt;
                    // }
                    // if (month < 10) {
                    //     month = '0' + month;
                    // }
                    // let dateCorrespondingToRewards = (year+ '-' + month + '-'+dt);
                    // currentDate = dateCorrespondingToRewards
                    console.log('made it to todays patch');
                    if (aggDilutionAmount === null || aggDilutionAmount === undefined || isNaN(aggDilutionAmount)) {
                        aggDilutionAmount = 0;
                    }
                    if (mappedFMV[currentDilutionCycle] === null || mappedFMV[currentDilutionCycle] === undefined) {
                        console.log('made it to error handle');
                        nativeMarketDilutionRewards.push({ date: currentDate,
                            rewardAmount: 0,
                            cycle: currentDilutionCycle });
                    }
                    else {
                        nativeMarketDilutionRewards.push({ date: currentDate,
                            rewardAmount: mappedFMV[currentDilutionCycle] - aggDilutionAmount,
                            cycle: currentDilutionCycle });
                    }
                    currentDate = nativeFilteredMarketDilutionByDay.date;
                    currentDilutionCycle = mappedCyclesToFirstCycleDate[currentDate];
                    aggDilutionAmount = nativeFilteredMarketDilutionByDay.amount;
                }
                //if we've reached the end
                else if (nativeFilteredMarketDilutionByDay.date === endDate) {
                    aggDilutionAmount += nativeFilteredMarketDilutionByDay.amount;
                    //date mod back one here
                    // let date: any
                    // date = new Date(currentDate)
                    // date.setDate(date.getDate())
                    // let year = date.getFullYear();
                    // let month = date.getMonth();
                    // let dt = date.getDate();
                    // if (dt < 10) {
                    //     dt = '0' + dt;
                    // }
                    // if (month < 10) {
                    //     month = '0' + month;
                    // }
                    // let dateCorrespondingToRewards = (year+ '-' + month + '-'+dt);
                    //currentDate = dateCorrespondingToRewards
                    if (aggDilutionAmount === null || aggDilutionAmount === undefined || isNaN(aggDilutionAmount)) {
                        aggDilutionAmount = 0;
                    }
                    if (mappedFMV[currentDilutionCycle] === null || mappedFMV[currentDilutionCycle] === undefined) {
                        console.log('error');
                        nativeMarketDilutionRewards.push({ date: currentDate,
                            rewardAmount: 0,
                            cycle: currentDilutionCycle });
                    }
                    else {
                        nativeMarketDilutionRewards.push({ date: currentDate,
                            rewardAmount: mappedFMV[currentDilutionCycle] - aggDilutionAmount,
                            cycle: currentDilutionCycle });
                    }
                }
                //otherwise just add the dilution values
                else {
                    if (aggDilutionAmount === null || aggDilutionAmount === undefined || isNaN(aggDilutionAmount)) {
                        aggDilutionAmount = 0;
                    }
                    else {
                        aggDilutionAmount += nativeFilteredMarketDilutionByDay.amount;
                    }
                }
            });
            //filter the rewards for positive ones here
            let nativeFilteredDilutionRewards;
            nativeFilteredDilutionRewards = nativeMarketDilutionRewards.map(element => {
                if (element.rewardAmount <= 0) {
                    return { date: element.date, rewardAmount: 0, cycle: element.cycle };
                }
                else {
                    return element;
                }
            });
            this.nativeMarketDilutionRewards = nativeFilteredDilutionRewards;
            console.log('first market reward');
            console.log(this.nativeMarketDilutionRewards[0]);
        });
    }
    calculateNativeSupplyDepletionRewards(scaledBVByDomain) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // do this in some earlier method
            this.supplyByDay = (yield ((_a = database_service_1.collections.tezosSupply) === null || _a === void 0 ? void 0 : _a.find().sort({ dateString: 1 }).toArray()));
            // expand date ranges of bvinvestments to a mapping of single dates to bv values
            //let mappedBV: Map<string, number> = new Map(); 
            let mappedBV = {};
            scaledBVByDomain.forEach(bvDomain => {
                // iterate over the date range (inclusive)
                let startDate = new Date(bvDomain.startDate);
                let endDate = new Date(bvDomain.endDate);
                while (startDate <= endDate) {
                    mappedBV[startDate.toISOString().slice(0, 10)] = bvDomain.scaledBookValue;
                    startDate.setDate(startDate.getDate() + 1);
                    if (startDate.toISOString().slice(11) !== "00:00:00.000Z") {
                        startDate.setDate(startDate.getDate() + 1);
                        startDate = new Date(startDate.toISOString().slice(0, 10));
                    }
                }
            });
            // for each day in our supply db documents - mark the change in supply (ie change in supply for date [i] = 1-(supply[i-1]/supply[i]))
            // find the scaledbv that represents the range the date [i] is in and mulitply that scaledbv value to the value above
            // ex: end up with a day associated with that value
            let nativeSupplyDepletionByDay;
            let filteredSupplyByDay = this.supplyByDay.filter((supply) => {
                return supply.dateString >= this.firstRewardDate;
            });
            let lastSupply = filteredSupplyByDay[0];
            nativeSupplyDepletionByDay = filteredSupplyByDay.slice(1).map(supply => {
                let ratio = lastSupply.totalSupply / supply.totalSupply;
                // if (lastSupply.dateString === supply.dateString){
                //     return
                // }
                lastSupply = supply;
                return { date: supply.dateString, amount: (1 - ratio) * mappedBV[supply.dateString] };
            });
            console.log("nativeSupplyDepletionByDay");
            //  writeFile("supplyDepletionDaily.json", JSON.stringify(nativeSupplyDepletionByDay, null, 4), async function(err) {console.log('the')})
            //console.log(nativeSupplyDepletionByDay)
            //let mappedFMV: Map<number, RewardsByDay> = new Map();
            let mappedFMV = {};
            this.nativeRewardsFMVByCycle.forEach((fmvReward) => {
                mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
            });
            //let mappedCyclesToFirstCycleDate: Map<number, string> = new Map();
            let mappedCyclesToFirstCycleDate = {};
            this.cyclesMappedToDays.forEach((key, value) => {
                mappedCyclesToFirstCycleDate[value] = key;
            });
            console.log(this.cyclesMappedToDays.get('2018-07-04'));
            let nativeSupplyDepletionRewards = [];
            let currentDate = nativeSupplyDepletionByDay[0].date;
            let currentSupplyCycle = mappedCyclesToFirstCycleDate[currentDate];
            if (new Date(this.nativeRewardsFMVByCycle[0].date) < new Date(nativeSupplyDepletionByDay[0].date)) {
                currentDate = this.nativeRewardsFMVByCycle[0].date;
                currentSupplyCycle = mappedCyclesToFirstCycleDate['2018-07-04'];
            }
            let aggSupplyAmount = nativeSupplyDepletionByDay[0].amount;
            //chop the front of the depletion off
            nativeSupplyDepletionByDay.forEach(nativeSupplyDepletion => {
                if (this.cyclesMappedToDays.get(nativeSupplyDepletion.date) !== currentSupplyCycle) {
                    let rewAmount = mappedFMV[currentSupplyCycle] - aggSupplyAmount;
                    if (rewAmount >= 0) {
                        nativeSupplyDepletionRewards.push({ date: currentDate,
                            rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount,
                            cycle: currentSupplyCycle });
                    }
                    else {
                        nativeSupplyDepletionRewards.push({ date: currentDate,
                            rewardAmount: 0,
                            cycle: currentSupplyCycle });
                    }
                    currentDate = nativeSupplyDepletion.date;
                    currentSupplyCycle = mappedCyclesToFirstCycleDate[currentDate];
                    aggSupplyAmount = nativeSupplyDepletion.amount;
                }
                else if (nativeSupplyDepletion.date === nativeSupplyDepletionByDay[nativeSupplyDepletionByDay.length - 1].date) {
                    aggSupplyAmount += nativeSupplyDepletion.amount;
                    let rewAmount = mappedFMV[currentSupplyCycle] - aggSupplyAmount;
                    if (rewAmount >= 0) {
                        nativeSupplyDepletionRewards.push({ date: currentDate,
                            rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount,
                            cycle: currentSupplyCycle });
                    }
                    else {
                        nativeSupplyDepletionRewards.push({ date: currentDate,
                            rewardAmount: 0,
                            cycle: currentSupplyCycle });
                    }
                }
                else {
                    aggSupplyAmount += nativeSupplyDepletion.amount;
                }
            });
            this.nativeSupplyDepletionRewards = nativeSupplyDepletionRewards;
        });
    }
    calculateInvestmentBVByDomain() {
        //i. scale transactions by fiat + add investment book value
        //  - first investment book value is value of first transactiosn
        //  - every subsequent bv is the the last bv + the current transaction amount 
        //  - startDate is the day of the current transaction
        //  - endDate is the day before the next transaction 
        // group by date
        //let groupedTransactions: Map<string, TransactionsByDay> = new Map<string, TransactionsByDay>();
        let groupedTransactions = {};
        this.unaccountedNetTransactions.forEach((transaction) => {
            groupedTransactions[transaction.date] = { date: transaction.date, amount: transaction.date in groupedTransactions ? groupedTransactions[transaction.date].amount + transaction.amount : transaction.amount };
        });
        let groupedTransactionsArray = Object.values(groupedTransactions);
        console.log(groupedTransactionsArray);
        // create array of date ranges inclusive mapped to the scaledbookvalues
        let scaledBVByDomain = [];
        for (let i = 0; i < groupedTransactionsArray.length; i++) {
            // determine the date range
            let startDate = groupedTransactionsArray[i].date;
            let nextDay = new Date(groupedTransactionsArray[i].date);
            nextDay.setDate(nextDay.getDate() + 1);
            let nextDate = undefined;
            // if the current transaction is the last one in our array 
            // we'll bound the end with todays date
            if (i === groupedTransactionsArray.length - 1) {
                nextDate = new Date();
            }
            else {
                nextDate = new Date(groupedTransactionsArray[i + 1].date);
            }
            let endDate = "";
            // if the next transactions date is the day after the current transaction 
            // the end date for the current transaction will be the same as the start
            if (nextDay.toISOString().slice(0, 10).localeCompare(nextDate.toISOString().slice(0, 10)) === 0) {
                endDate = startDate;
            }
            else {
                // endDate is the day before the nextdate 
                nextDate.setDate(nextDate.getDate() - 1);
                endDate = nextDate.toISOString().slice(0, 10);
            }
            let bvValue = groupedTransactionsArray[i].amount;
            if (i !== 0) {
                bvValue += scaledBVByDomain[scaledBVByDomain.length - 1].scaledBookValue;
            }
            scaledBVByDomain.push({ startDate: startDate, endDate: endDate, scaledBookValue: bvValue });
        }
        return scaledBVByDomain;
    }
    //retreive methods
    retrieveTezosPriceToday() {
        return __awaiter(this, void 0, void 0, function* () {
            let tezosTodayUrl = `https://api.coingecko.com/api/v3/simple/price?ids=Tezos&vs_currencies=${this.fiat}`;
            yield axios_1.default.get(tezosTodayUrl).then((response) => {
                //console.log(response)
                let value = response.data.tezos;
                let lowercase = this.fiat.toLowerCase();
                this.TezosPriceOnDateObjectGenerated = value[lowercase];
                console.log(this.TezosPriceOnDateObjectGenerated);
            });
        });
    }
    retrieveBakers() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. retrieveBakers: retrieve bakers and the cycles associated with this delegator mainly, 
            // set the set of bakerAddresses and the mapping of bakers to the cycles which this delegator recieved rewards from
            // get history of delegators bakers 
            let delegatorRewardsResponse = yield axios_1.default.get(this.delegatorRewardsUrl);
            let filteredResponse = delegatorRewardsResponse.data.map(({ cycle, balance, baker }) => ({ cycle, balance, baker }));
            // map bakers to their start and end cycles
            let curBaker = undefined;
            for (let cycleData of filteredResponse.reverse()) {
                // initial baker
                if (curBaker === undefined) {
                    curBaker = { bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: [] };
                }
                // extend cycle end
                if (curBaker.bakerAddress === cycleData.baker.address) {
                    curBaker.cycleEnd = cycleData.cycle;
                }
                // push curBaker, start new baker
                else {
                    this.setRewardsUrls(curBaker);
                    this.bakerCycles.push(curBaker);
                    this.bakerAddresses.add(cycleData.baker.address);
                    curBaker = { bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: [] };
                }
            }
            this.setRewardsUrls(curBaker);
            this.bakerCycles.push(curBaker);
            this.bakerAddresses.add(curBaker.bakerAddress);
            return;
        });
    }
    retrieveBakerRewards() {
        return __awaiter(this, void 0, void 0, function* () {
            //first url
            //get the reults from first url 
            // let url: string = `https://api.tzkt.io/v1/accounts/${this.walletAddress}/operations?type=endorsement,endorsing_rewards,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&limit=1000&sort=0`;
            // let response: AxiosResponse = await axios.get(url);
            // this.nextTimeStamp = response.data[response.data.length - 1].timestamp
            // //map the response and push to array
            // let operations: Array<{type: string, amount: number, rewards: number, reward: number, bakerRewards: number, accuserRewards: number, accuser: {address: string}, offenderLostDeposits: number, offenderLostRewards: number, offenderLostFees: number, bakerFee: number, storageFee: number, allocationFee: number, sender: {address: string}, lostReward: number, lostFees: number, timestamp: string}> = 
            //     response.data.map(({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender, lostReward, lostFees, timestamp}) => ({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender,lostReward, lostFees, timestamp}));       
            // let totalOperations: any = []
            // console.log(this.nextTimeStamp)
            // //while the timestamp is not within 3 days of today
            // let a: any = new Date(this.nextTimeStamp)
            // let c: any = new Date()
            // c.setDate(c.getDate() - 5);
            // console.log(operations)
            // while(a.getTime()<c.getTime()){
            //     let urlNext: string = `https://api.tzkt.io/v1/accounts/${this.walletAddress}/operations?timestamp.ge=${this.nextTimeStamp}&limit=1000&sort=0`;
            //     let response2: AxiosResponse = await axios.get(urlNext);
            //     console.log(response2)
            //     this.nextTimeStamp = response2.data[response2.data.length - 1].timestamp
            //     let nextOperations: Array<{type: string, amount: number, rewards: number, reward: number, bakerRewards: number, accuserRewards: number, accuser: {address: string}, offenderLostDeposits: number, offenderLostRewards: number, offenderLostFees: number, bakerFee: number, storageFee: number, allocationFee: number, sender: {address: string}, lostReward: number, lostFees: number, timestamp: string}> = response2.data.map(({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender, lostReward, lostFees, timestamp}) => ({type, amount, rewards, reward, bakerRewards, accuserRewards, accuser, offenderLostDeposits, offenderLostRewards, offenderLostFees, storageFee, allocationFee, sender,lostReward, lostFees, timestamp}));
            //     totalOperations.push(nextOperations)
            //     let now: any = new Date(this.nextTimeStamp)
            //     if(now.getTime() == a.getTime()){
            //         break
            //     }else{
            //         a = new Date(this.nextTimeStamp)
            //     }
            // }
            // console.log(totalOperations)
            // this.totalOperations = totalOperations
            let urlr = `https://api.tzkt.io/v1/rewards/bakers/${this.walletAddress}?limit=10000`;
            let resp1 = yield axios_1.default.get(urlr);
            // this.nextTimeStamp = resp1.data[resp1.data.length - 1].timestamp
            //map the response and push to array
            //.log(resp1)
            //let cycle: number = 0
            if (resp1 !== undefined) {
                // if(resp1.data[0].cycle !== undefined){
                //     cycle = resp1.data[0].cycle
                // }
                let bak = resp1.data.map(({ cycle, endorsementRewards, blockRewards }) => ({ cycle, endorsementRewards, blockRewards }));
                this.totalOperations.push(bak);
            }
            // console.log(cycle)
            // //get the last cycle
            // let url2= `https://api.tzkt.io/v1/rewards/bakers/${this.walletAddress}?cycle.lt=${cycle}`
            // let resp2: AxiosResponse = await axios.get(url2);
            // if(resp2 !== undefined){
            // // this.nextTimeStamp = resp1.data[resp1.data.length - 1].timestamp
            //     //map the response and push to array
            //     let bak2: Array<{cycle: number, endorsementRewards: number, blockRewards: number}> = 
            //     resp2.data.map(({cycle, endorsementRewards, blockRewards}) => ({cycle, endorsementRewards, blockRewards}));       
            //     this.totalOperations.push(bak2)
            // }
        });
    }
    retrieveCyclesAndDates() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // 2. retrieveCyclesAndDates: retrieve the cycle data we have in our database and store it // get mapping of cycles to dates
            this.cyclesByDay = (yield ((_a = database_service_1.collections.cycleAndDate) === null || _a === void 0 ? void 0 : _a.find().sort({ dateString: 1 }).toArray()));
            this.cyclesByDay.forEach((cycleByDay) => (this.cyclesMappedToDays.set(cycleByDay.dateString, cycleByDay.cycleNumber)));
            return;
        });
    }
    retrieveBakersPayouts() {
        return __awaiter(this, void 0, void 0, function* () {
            // put together all baker reward request urls and call api to get payoutArrays
            // NOTE: requests are chunked in groups of 16 to prevent rate limiting issues
            let completeRewardsRequests = this.bakerCycles.map((bakerCycle) => { return bakerCycle.rewardsRequests; }).flat();
            let j, temporary, chunk = BAKINGBADBATCHSIZE;
            let responses = [];
            //need 400 handling for requests that any request that bounces
            for (let i = 0, j = completeRewardsRequests.length; i < j; i += chunk) {
                temporary = completeRewardsRequests.slice(i, i + chunk);
                try {
                    let response = yield axios_1.default.all(temporary.map(url => axios_1.default.get(url)));
                    responses.push(...response);
                }
                catch (e) {
                    console.log(e);
                }
            }
            // map cycles to reward amounts
            let rewards = {};
            responses.forEach(response => {
                var _a;
                if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.payouts) === undefined) {
                    console.log("No payout data found in a response");
                }
                else {
                    response.data.payouts.forEach((payout) => {
                        if (payout.address === this.walletAddress) {
                            let amount = payout["amount"];
                            if (amount < UNSCALEDAMOUNTTHRESHOLD && amount > 0) {
                                amount = amount * AMOUNTSCALER;
                            }
                            if (rewards[response.data.cycle] === undefined) {
                                rewards[response.data.cycle] = amount;
                            }
                            else {
                                rewards[response.data.cycle] += amount;
                            }
                        }
                    });
                }
            });
            this.rewardsByDay = this.cyclesByDay.filter((cycleAndDateDoc) => cycleAndDateDoc.cycleNumber in rewards).map((cycleAndDateDoc) => {
                return { date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber };
            });
            return;
        });
    }
    getRawWalletTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionsLength = TRANSACTIONURLLIMIT;
            while (transactionsLength === TRANSACTIONURLLIMIT) {
                let transactionsResponse = yield axios_1.default.get(this.transactionsUrl);
                let transactionsResponseArray = transactionsResponse.data.map(({ target, sender, amount, timestamp }) => ({ target, sender, amount, timestamp }));
                this.rawWalletTransactions.push(...transactionsResponseArray);
                transactionsLength = transactionsResponseArray.length;
            }
            this.rawWalletTransactions.forEach((transaction) => {
                var _a, _b;
                if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.alias) === "Melange Payouts")
                    this.isCustodial = true;
                else if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _b === void 0 ? void 0 : _b.alias) === "EcoTez Payouts")
                    this.bakerAddresses.add("tz1QS7N8HnRBG2RNh3Kjty58XFXuLFVdnKGY");
            });
            this.isCustodial = false;
        });
    }
    getBakerRewardsAndTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([this.retrieveBakerRewards(), this.retrieveCyclesAndDates(), this.getRawWalletTransactions()]);
            this.processBakerRewards();
            //uncomment these 3
            this.getNetTransactions();
        });
    }
    getDelegatorRewardsAndTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates(), this.getRawWalletTransactions()]);
            if (this.isCustodial) {
                this.processIntermediaryTransactions();
                this.getNetTransactions();
            }
            else {
                yield this.retrieveBakersPayouts();
                this.getNetTransactions();
            }
            if (this.rewardsByDay.length < 1) {
                console.log('no rewards');
            }
            else {
                this.firstRewardDate = this.rewardsByDay[0].date;
            }
            this.filterPayouts();
        });
    }
    getBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            // this method will retrieve the balances associated with the user wallet
            // for each day present in the returned api body, we will associate that day with the
            // latest available balance of that day
            // for the days not present, we will associate those
            // days with the balance of the last available day's last available balance
            let balances = {};
            //offset from index
            let offset = 0;
            let resp_len = 10000;
            let currentDay = null;
            let latestBalance = null;
            while (resp_len === 10000) {
                let url = `https://api.tzkt.io/v1/accounts/${this.walletAddress}/balance_history?offset=${offset}&limit=10000`;
                let response = yield axios_1.default.get(url);
                // update the response length to indicate when we've reached the end of the balance history
                resp_len = response.data.length;
                offset += response.data.length;
                // for each day, have the balance equal the latest balance of that day
                if (currentDay === null) {
                    currentDay = response.data[0].timestamp.substring(0, 10);
                }
                if (latestBalance === null) {
                    latestBalance = response.data[0].balance / MUTEZ;
                }
                for (let day of response.data) {
                    // update the latestBalance since we're on the currently marked day
                    if (day.timestamp.substring(0, 10) === currentDay) {
                        latestBalance = day.balance / MUTEZ;
                    }
                    else {
                        // push the day and its last balance to our map since we're now on a new day
                        balances[currentDay] = latestBalance / MUTEZ;
                        // get the range of dates from the currentDay to the day we are cheking on
                        let fillerDays = this.getNonInclusiveDateRange(currentDay, day.timestamp.substring(0, 10));
                        // for these days, add the currentDays balance
                        for (let fillerDay of fillerDays) {
                            balances[fillerDay] = latestBalance / MUTEZ;
                        }
                        currentDay = day.timestamp.substring(0, 10);
                        latestBalance = day.balance / MUTEZ;
                    }
                }
            }
            // push the last day
            balances[currentDay] = latestBalance / MUTEZ;
            this.balancesByDay = balances;
            return;
        });
    }
    getPricesAndMarketCap() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let price = `price${this.fiat}`;
            let marketCap = `marketCap${this.fiat}`;
            let priceAndMarketCapData = (yield ((_a = database_service_1.collections.priceAndMarketCap) === null || _a === void 0 ? void 0 : _a.find().sort({ date: 1 }).toArray()));
            priceAndMarketCapData.forEach((priceAndMarketCap) => {
                // date reformatting
                let dateSplit = priceAndMarketCap.date.toString().split("-");
                dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                let correctedDate = dateSplit.join("-");
                this.pricesAndMarketCapsByDay[correctedDate] = { date: correctedDate, price: priceAndMarketCap[price], marketCap: priceAndMarketCap[marketCap] };
            });
            //filter the map type for date and market cap 
            //this.priceAndMarketCapsByDay.sometypefunction(element => {return elementstuff})
            //log the element
            //extraction method from element
            //add date reformatting 
            //console.log(this.marketByDay)
            priceAndMarketCapData.forEach((element) => {
                let dateSplit = element.date.toString().split("-");
                dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                let correctedDate = dateSplit.join("-");
                this.marketByDay.push({ date: correctedDate, amount: element[marketCap] });
            });
            priceAndMarketCapData.forEach((element) => {
                let dateSplit = element.date.toString().split("-");
                dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                let correctedDate = dateSplit.join("-");
                this.priceByDay.push({ date: correctedDate, amount: element[price] });
            });
            return;
        });
    }
    //processing methods
    processIntermediaryTransactions() {
        let intermediaryTransactions = this.rawWalletTransactions.filter((transaction) => {
            var _a;
            (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.alias) === "Melange Payouts");
        });
        let intermediaryRewards = intermediaryTransactions.map(transaction => {
            let transactionDate = transaction.timestamp.slice(0, 10);
            let adjustedAmount = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
            let cycleNumber = this.cyclesMappedToDays.get(transactionDate);
            let reward = { date: transactionDate, rewardAmount: adjustedAmount, cycle: cycleNumber };
            return reward;
        });
        this.rewardsByDay.push(...intermediaryRewards);
        return;
    }
    processBakerRewards() {
        return __awaiter(this, void 0, void 0, function* () {
            // map cycles to reward amounts
            //expand record for every type and re make the record at the end for by day /cycle
            let rewards = {};
            this.totalOperations.forEach((array) => {
                array.forEach(operation => {
                    if (operation.cycle === undefined) {
                        console.log("No payout data found in a response");
                    }
                    else {
                        //    if('endorsement' === operation.type){
                        //        let date: string = this.formatDate(operation.timestamp)
                        //        let amount: number = operation.rewards / 1000000
                        //        if(amount !== undefined) {
                        //            if(rewards[date] !== undefined){
                        //                let value: number = rewards[date]
                        //                rewards[date] = value + amount
                        //            }
                        //            else{
                        //                rewards[date] = amount
                        //            }
                        //        }   
                        //    }
                        if (operation.endorsementRewards !== undefined) {
                            let cycle = (operation.cycle + 1); //add plus one because the reward came in the next cycle not the one the operatoin took place in
                            let amount = operation.endorsementRewards / 1000000;
                            if (amount !== undefined) {
                                if (rewards[cycle] !== undefined) {
                                    let value = rewards[cycle];
                                    rewards[cycle] = value + amount;
                                }
                                else {
                                    rewards[cycle] = amount;
                                }
                            }
                        }
                        else if (operation.blockRewards !== undefined) {
                            let cycle = (operation.cycle + 1);
                            let amount = operation.blockRewards / 1000000;
                            if (amount !== undefined) {
                                if (rewards[cycle] !== undefined) {
                                    let value = rewards[cycle];
                                    rewards[cycle] = value + amount;
                                }
                                else {
                                    rewards[cycle] = amount;
                                }
                            }
                        }
                        //    else if("baking" === operation.type){
                        //        let date: string = this.formatDate(operation.timestamp)
                        //        let amount: number = operation.reward / 1000000
                        //        if(amount !== undefined) {
                        //            if(rewards[date] !== undefined){
                        //                let value: number = rewards[date]
                        //                rewards[date] = value + amount
                        //            }
                        //            else{
                        //                rewards[date] = amount
                        //            }
                        //        }   
                        //    }
                        //    else if("endorsing_rewards" === operation.type){
                        //     let date: string = this.formatDate(operation.timestamp)
                        //     let amount: number = operation.received / 1000000
                        //     if(amount !== undefined) {
                        //         if(rewards[date] !== undefined){
                        //             let value: number = rewards[date]
                        //             rewards[date] = value + amount
                        //         }
                        //         else{
                        //             rewards[date] = amount
                        //         }
                        //     } 
                        //    }
                        //    else if('nonce_revelation' === operation.type){
                        //        let date: string = this.formatDate(operation.timestamp)
                        //        let amount: number = operation.bakerRewards / 1000000
                        //        if(amount !== undefined) {
                        //            if(rewards[date] !== undefined){
                        //                let value: number = rewards[date]
                        //                rewards[date] = value + amount
                        //            }
                        //            else{
                        //                rewards[date] = amount
                        //            }
                        //        }   
                        //    }
                        //    else if('double_baking' === operation.type){
                        //        let isAccuser = operation.accuser.address === this.walletAddress;
                        //        if(isAccuser){
                        //            let date: string = this.formatDate(operation.timestamp)
                        //            let amount: number = operation.accuserRewards / 1000000
                        //            if(amount !== undefined) {
                        //                if(rewards[date] !== undefined){
                        //                    let value: number = rewards[date]
                        //                    rewards[date] = value + amount
                        //                }
                        //                else{
                        //                    rewards[date] = amount
                        //                }
                        //            }   
                        //        }
                        //        else{
                        //            let date: string = this.formatDate(operation.timestamp)
                        //            let amount: number = -(operation.offenderLostDeposits + operation.offenderLostRewards + operation.offenderLostFees) / 1000000
                        //            if(amount !== undefined) {
                        //                if(rewards[date] !== undefined){
                        //                    let value: number = rewards[date]
                        //                    rewards[date] = value + amount
                        //                }
                        //                else{
                        //                    rewards[date] = amount
                        //                }
                        //            }   
                        //        }
                        //    }
                        //    else if("origination" === operation.type){
                        //            let date: string = this.formatDate(operation.timestamp)
                        //            let amount: number = -(operation.bakerFee + operation.storageFee + operation.allocationFee) / 1000000
                        //            if(amount !== undefined) {
                        //                if(rewards[date] !== undefined){
                        //                    let value: number = rewards[date]
                        //                    rewards[date] = value + amount
                        //                }
                        //                else{
                        //                    rewards[date] = amount
                        //                }
                        //            }   
                        //    }
                        //    else if("delegation" === operation.type){
                        //        let date: string = this.formatDate(operation.timestamp)
                        //        let isSender = operation.sender.address === this.walletAddress;
                        //        if (isSender) {
                        //            let amount: number = -1 * operation.bakerFee / 1000000
                        //            if(amount !== undefined) {
                        //                if(rewards[date] !== undefined){
                        //                    let value: number = rewards[date]
                        //                    rewards[date] = value + amount
                        //                }
                        //                else{
                        //                    rewards[date] = amount
                        //                }
                        //            }   
                        //        }
                        //    }
                        //    else if("reveal"){
                        //        let date: string = this.formatDate(operation.timestamp)
                        //        let amount: number = -1 * operation.bakerFee / 1000000
                        //        if(amount !== undefined) {
                        //            if(rewards[date] !== undefined){
                        //                let value: number = rewards[date]
                        //                rewards[date] = value + amount
                        //            }
                        //            else{
                        //                rewards[date] = amount
                        //            }
                        //        }   
                        //    }
                        //    else if("revelation_penalty"){
                        //        let date: string = this.formatDate(operation.timestamp)
                        //        let amount: number = -1 * (operation.lostReward + operation.lostFees) / 1000000
                        //        if(amount !== undefined) {
                        //            if(rewards[date] !== undefined){
                        //                let value: number = rewards[date]
                        //                rewards[date] = value + amount
                        //            }
                        //            else{
                        //                rewards[date] = amount
                        //            }
                        //        }   
                        //    }
                    }
                });
            });
            //console.log(rewards)
            //flip this to get the cycles
            //this.rewardsByCycle = 
            // this.rewardsByDay = this.cyclesByDay.filter(cycleAndDateDoc => cycleAndDateDoc.cycleNumber in rewards).map(cycleAndDateDoc => {
            //     return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber};
            // });
            if (Object.keys(rewards).length <= 1) {
                this.noRewards = true;
            }
            else {
                let prevVal = {};
                for (let i = 0; i < this.cyclesByDay.length; i++) {
                    if (this.cyclesByDay[i].cycleNumber !== prevVal.cycleNumber) {
                        if (rewards[this.cyclesByDay[i].cycleNumber] !== undefined) {
                            this.rewardsByCycle.push({ date: this.formatDate(this.cyclesByDay[i].dateString), rewardAmount: rewards[this.cyclesByDay[i].cycleNumber], cycle: this.cyclesByDay[i].cycleNumber });
                            prevVal = this.cyclesByDay[i];
                        }
                    }
                }
                this.rewardsByDay = this.rewardsByCycle.map((value) => value);
                this.noRewards = false;
            }
            //this.rewardsByDay = this.cyclesByDay.filter(cyclesAndDays => )
            return;
        });
    }
    filterPayouts() {
        // group "rewardsByDay", by cycle and only keep the item with the earliest date in each group -> save to rewardsByCycle
        let currentItem = this.rewardsByDay[this.rewardsByDay.length - 1];
        for (const reward of this.rewardsByDay.slice().reverse()) {
            if (reward.cycle !== currentItem.cycle) {
                this.rewardsByCycle.push(currentItem);
            }
            currentItem = reward;
        }
        if (this.rewardsByDay.length > 0) {
            if (this.rewardsByDay[0].date === currentItem.date) {
                this.rewardsByCycle.push(currentItem);
            }
        }
        return;
    }
    ;
    filterPayoutsBaker() {
        //this converts the rewaard by day map to reward by day and reward by cycle
        let currentItem = this.rewardsByDay[0];
        // this.rewardsByCycle = this.rewardsByDay.forEach((value) => {
        //     if(value.cycle == currentItem.cycle) {
        //         currentItem.rewardAmount += value.rewardAmount 
        //     }
        // })
        for (const reward of this.rewardsByDay.slice().reverse()) {
            if (reward.cycle == currentItem.cycle) {
                let value = reward.rewardAmount + currentItem.rewardAmount;
                currentItem.rewardAmount = value;
            }
            else {
                this.rewardsByCycle.push(currentItem);
                currentItem = reward;
            }
        }
        if (this.rewardsByDay[0].date === currentItem.date) {
            this.rewardsByCycle.push(currentItem);
        }
        // this.rewardsByCycle = this.cyclesByDay.filter(cycleAndDateDoc => cycleAndDateDoc.cycleNumber in rewards).map(cycleAndDateDoc => {
        //     return {date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber};
        // });
        return;
    }
    getNetTransactions() {
        // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude reward transactions
        // + Melange Payouts. add a rewardByDay to the rewardsByDay list   
        this.unaccountedNetTransactions = this.rawWalletTransactions.filter((transaction) => {
            var _a, _b;
            return (!(this.bakerAddresses.has((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.address) || this.bakerAddresses.has((_b = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _b === void 0 ? void 0 : _b.address)));
        }).map((transaction) => {
            var _a, _b;
            let transactionDate = new Date(transaction.timestamp).toISOString().slice(0, 10);
            let adjustedAmount = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
            let amount = { date: transactionDate, amount: adjustedAmount };
            if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _a === void 0 ? void 0 : _a.address) === this.walletAddress) {
                amount = { date: transactionDate, amount: adjustedAmount };
            }
            else if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _b === void 0 ? void 0 : _b.address) === this.walletAddress) {
                amount.amount = adjustedAmount * -1;
            }
            return amount;
        });
        return;
    }
    // utility methods:
    setRewardsUrls(bakerData) {
        for (let i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push(`https://api.baking-bad.org/v2/rewards/${bakerData.bakerAddress}?cycle=${i}`);
        }
    }
    formatDate(date) {
        var d = new Date(date), month = "" + (d.getMonth() + 1), day = "" + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = "0" + month;
        if (day.length < 2)
            day = "0" + day;
        return [year, month, day].join("-");
    }
    getNonInclusiveDateRange(startDateString, endDateString) {
        // non inclusive on both sides
        let dates = [];
        var now = new Date();
        let endDate = new Date(endDateString);
        // start on next day following startDate
        let startDate = new Date(startDateString);
        startDate.setDate(startDate.getDate() + 1);
        var daysOfYear = [];
        // end on day before endDate
        for (startDate; startDate < endDate; startDate.setDate(startDate.getDate() + 1)) {
            dates.push(startDate.toISOString().split('T')[0]);
        }
        return dates;
    }
    orderAccountingSets() {
        //valuea -valueb gives a LIFO behavior
        //valueb - valuea gives FIFO behavior
        this.unrealizedNativeRewards.sort((a, b) => {
            let valuea = new Date(b.date).getTime();
            let valueb = new Date(a.date).getTime();
            let value = valueb - valuea;
            return value;
        });
        this.unrealizedNativeFMVRewards.sort((a, b) => {
            let valuea = new Date(b.date).getTime();
            let valueb = new Date(a.date).getTime();
            let value = valueb - valuea;
            return value;
        });
        this.unrealizedNativeMarketDilutionRewards.sort((a, b) => {
            let valuea = new Date(b.date).getTime();
            let valueb = new Date(a.date).getTime();
            let value = valueb - valuea;
            return value;
        });
        this.unrealizedNativeSupplyDepletionRewards.sort((a, b) => {
            let valuea = new Date(b.date).getTime();
            let valueb = new Date(a.date).getTime();
            let value = valueb - valuea;
            return value;
        });
    }
}
exports.default = TezosSet;
let ts = new TezosSet();
// ts.init("USD","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH", "Delegator").then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("JSON saved to " + "test.json");
//     }
// })});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
//baker tz1fJHFn6sWEd3NnBPngACuw2dggTv6nQZ7g, tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM, tz1TwVimQy3BywXoSszdFXjT9bSTQrsZYo2u, tz1WMoJivTbf62hWLC5e4QvRwk9dps2r6tNs, tz1aegBunu8NFDNm7wPHNyuMmteMD3S3Liuj
//delegator tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH, get more bad delegator strings, tz1WNk2o2hJvzjuZRNmZQwjLQuv24wDv1zjU, tz1cPYtkTTTkTQSFdxUuLbLfU2n7s8sUixC3 tz1heiihbfKE4J4etuU9rXvbQknXnkszNugA
//payout model and supported payout models on this one above, make handling for bad baker payout data requests
// other payloads blockchain operation types into baker processing 
//active documentation https://api.tzkt.io/#operation/Rewards_GetBakerRewards
