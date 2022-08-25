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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var axios_1 = require("axios");
var database_service_1 = require("../../../documentInterfaces/database.service");
var fs_1 = require("fs");
// tezos specific constants
var REWARDADJUSTMENTDENOMINATOR = 1000000;
var BAKINGBADBATCHSIZE = 16;
var UNSCALEDAMOUNTTHRESHOLD = 0.0001;
var AMOUNTSCALER = 10000;
var TRANSACTIONURLLIMIT = 10000;
var MUTEZ = 1000000;
//create superclass History Object State Holder
var TezosSet = /** @class */ (function () {
    function TezosSet() {
    }
    TezosSet.prototype.init = function (fiat, address, consensusRole) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        this.transactionsUrl = "https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=".concat(this.walletAddress, "&limit=10000");
                        this.delegatorRewardsUrl = "https://api.tzkt.io/v1/rewards/delegators/".concat(this.walletAddress, "?cycle.ge=0&limit=10000");
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
                        this.realizedNativeMaketDilutionRewards = [];
                        this.realizedNativeSupplyDepletionRewards = [];
                        this.weightedAverageInvestmentCost = 0;
                        this.nextTimeStamp = "";
                        this.totalOperations = [];
                        return [4 /*yield*/, (0, database_service_1.connectToDatabase)()];
                    case 1:
                        _a.sent();
                        if (!(this.consensusRole == "Baker")) return [3 /*break*/, 3];
                        console.log("Baker processing");
                        return [4 /*yield*/, Promise.all([this.getBakerRewardsAndTransactions(), this.getPricesAndMarketCap()])
                            //make returenve baker rewards output equal to the pre unrealized data arrays
                            //this.getBalances()
                        ];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: 
                    //delegator route
                    return [4 /*yield*/, Promise.all([this.getDelegatorRewardsAndTransactions(), this.getBalances(), this.getPricesAndMarketCap()])];
                    case 4:
                        //delegator route
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        // conduct analysis
                        this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
                        this.investmentsScaledBVByDomain = this.calculateInvestmentBVByDomain();
                        return [4 /*yield*/, this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.calculateNativeMarketDilutionRewards(this.investmentsScaledBVByDomain)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.analysis()];
                    case 8:
                        _a.sent();
                        console.log("this");
                        console.log(this);
                        return [2 /*return*/];
                }
            });
        });
    };
    //product methods
    TezosSet.prototype.analysis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // //data packages
                // this.nativeRewardsFMVByCycle = this.calculateNativeRewardFMVByCycle();
                // await this.calculateNativeSupplyDepletionRewards(this.investmentsScaledBVByDomain);
                // await this.calculateNativeMarketDilutionRewards(this.investmentsScaledBVByDomain);
                //convert
                this.rewardsByCycle.forEach(function (value) { _this.unrealizedNativeRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle }); });
                this.nativeRewardsFMVByCycle.forEach(function (value) { _this.unrealizedNativeFMVRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle }); });
                this.nativeMarketDilutionRewards.forEach(function (value) { _this.unrealizedNativeMarketDilutionRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle }); });
                this.nativeSupplyDepletionRewards.forEach(function (value) { _this.unrealizedNativeSupplyDepletionRewards.push({ date: value.date, rewardAmount: value.rewardAmount, cycle: value.cycle }); });
                //valuea -valueb gives a LIFO behavior
                //valueb - valuea gives FIFO behavior
                this.unrealizedNativeRewards.sort(function (a, b) {
                    var valuea = new Date(b.date).getTime();
                    var valueb = new Date(a.date).getTime();
                    var value = valueb - valuea;
                    return value;
                });
                this.unrealizedNativeFMVRewards.sort(function (a, b) {
                    var valuea = new Date(b.date).getTime();
                    var valueb = new Date(a.date).getTime();
                    var value = valueb - valuea;
                    return value;
                });
                this.unrealizedNativeMarketDilutionRewards.sort(function (a, b) {
                    var valuea = new Date(b.date).getTime();
                    var valueb = new Date(a.date).getTime();
                    var value = valueb - valuea;
                    return value;
                });
                this.unrealizedNativeSupplyDepletionRewards.sort(function (a, b) {
                    var valuea = new Date(b.date).getTime();
                    var valueb = new Date(a.date).getTime();
                    var value = valueb - valuea;
                    return value;
                });
                //filter the unrealized arrays to put in chronolgoical order
                this.realizeReward();
                this.aggregates();
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.realizeReward = function () {
        return __awaiter(this, void 0, void 0, function () {
            var quantity, unrealizedNativeFMVRewardsMap, unrealizedNativeMarketDilutionRewardsMap, unrealizedNativeSupplyDepletionRewardsMap, i, newValue1, newValue2, value1, value2, value3, value4, _a, value5, value6, value7;
            return __generator(this, function (_b) {
                quantity = 30;
                unrealizedNativeFMVRewardsMap = Object.assign.apply(Object, __spreadArray([{}], __read(this.unrealizedNativeFMVRewards.map(function (x) {
                    var _a;
                    return (_a = {}, _a[x.date] = x.rewardAmount, _a);
                })), false));
                unrealizedNativeMarketDilutionRewardsMap = Object.assign.apply(Object, __spreadArray([{}], __read(this.unrealizedNativeMarketDilutionRewards.map(function (x) {
                    var _a;
                    return (_a = {}, _a[x.date] = x.rewardAmount, _a);
                })), false));
                unrealizedNativeSupplyDepletionRewardsMap = Object.assign.apply(Object, __spreadArray([{}], __read(this.unrealizedNativeSupplyDepletionRewards.map(function (x) {
                    var _a;
                    return (_a = {}, _a[x.date] = x.rewardAmount, _a);
                })), false));
                //let splicelist = []
                for (i = 0; i < this.unrealizedNativeRewards.length; i++) {
                    if (this.unrealizedNativeRewards[i].rewardAmount <= quantity) {
                        this.realizingNativeRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: this.unrealizedNativeRewards[i].rewardAmount, cycle: this.unrealizedNativeRewards[i].cycle });
                        this.realizingNativeFMVRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeFMVRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle });
                        this.realizingNativeMarketDilutionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle });
                        this.realizingNativeSupplyDepletionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: unrealizedNativeSupplyDepletionRewardsMap[this.unrealizedNativeRewards[i].date], cycle: this.unrealizedNativeRewards[i].cycle });
                        //splicelist.push(index)
                        this.unrealizedNativeRewards.splice(0, 1);
                        this.unrealizedNativeFMVRewards.splice(0, 1);
                        this.unrealizedNativeMarketDilutionRewards.splice(0, 1);
                        this.unrealizedNativeSupplyDepletionRewards.splice(0, 1);
                        quantity = quantity - this.unrealizedNativeRewards[i].rewardAmount;
                    }
                    else if (this.unrealizedNativeRewards[i].rewardAmount > quantity && quantity != 0) {
                        newValue1 = quantity;
                        newValue2 = this.unrealizedNativeRewards[i].rewardAmount - quantity;
                        this.realizingNativeRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1, cycle: this.unrealizedNativeRewards[i].cycle });
                        value1 = unrealizedNativeFMVRewardsMap[this.unrealizedNativeRewards[i].date];
                        value2 = this.unrealizedNativeRewards[i].rewardAmount;
                        value3 = unrealizedNativeMarketDilutionRewardsMap[this.unrealizedNativeRewards[i].date];
                        value4 = unrealizedNativeSupplyDepletionRewardsMap[this.unrealizedNativeRewards[i].date];
                        _a = __read([value1 / value2, value3 / value2, value4 / value2], 3), value5 = _a[0], value6 = _a[1], value7 = _a[2];
                        this.realizingNativeFMVRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value5, cycle: this.unrealizedNativeRewards[i].cycle });
                        this.realizingNativeMarketDilutionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value6, cycle: this.unrealizedNativeRewards[i].cycle });
                        this.realizingNativeSupplyDepletionRewards.push({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue1 * value7, cycle: this.unrealizedNativeRewards[i].cycle });
                        //multiple the three scalars by the newValue2 for unrealized and use quantity for the realizing
                        this.unrealizedNativeFMVRewards.unshift({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value5, cycle: this.unrealizedNativeRewards[i].cycle });
                        this.unrealizedNativeMarketDilutionRewards.unshift({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value6, cycle: this.unrealizedNativeRewards[i].cycle });
                        this.unrealizedNativeFMVRewards.unshift({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2 * value7, cycle: this.unrealizedNativeRewards[i].cycle });
                        this.unrealizedNativeRewards.unshift({ date: this.unrealizedNativeRewards[i].date, rewardAmount: newValue2, cycle: this.unrealizedNativeRewards[i].cycle });
                        quantity = 0;
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.aggregates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mainValue1, mainValue2, mainValue3, mainValue4, mainValue5;
            return __generator(this, function (_a) {
                mainValue1 = 0;
                this.unrealizedNativeRewards.forEach(function (value) {
                    if (value.rewardAmount !== undefined) {
                        mainValue1 += value.rewardAmount;
                    }
                });
                this.aggregateUnrealizedNativeReward25p = mainValue1 * 0.25;
                this.aggregateUnrealizedNativeReward50p = mainValue1 * 0.5;
                this.aggregateUnrealizedNativeReward75p = mainValue1 * 0.75;
                this.aggregateUnrealizedNativeReward100p = mainValue1;
                mainValue2 = 0;
                this.realizingNativeFMVRewards.forEach(function (value) {
                    if (value.rewardAmount !== undefined) {
                        mainValue2 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeFMVReward100p = mainValue2;
                this.aggregateRealizedNativeFMVReward50p = mainValue2 * 0.5;
                mainValue3 = 0;
                this.realizingNativeMarketDilutionRewards.forEach(function (value) {
                    if (value.rewardAmount !== undefined) {
                        mainValue3 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeMarketDilution100p = mainValue3;
                this.aggregateRealizedNativeMarketDilution50p = mainValue3 * 0.5;
                mainValue4 = 0;
                this.realizingNativeSupplyDepletionRewards.forEach(function (value) {
                    if (value.rewardAmount !== undefined) {
                        mainValue4 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeSupplyDepletion100p = mainValue4;
                this.aggregateRealizedNativeSupplyDepletion50p = mainValue4 * 0.5;
                mainValue5 = 0;
                this.realizingNativeRewards.forEach(function (value) {
                    if (value.rewardAmount !== undefined) {
                        mainValue5 += value.rewardAmount;
                    }
                });
                this.aggregateRealizedNativeReward100p = mainValue5;
                this.aggregateRealizedNativeReward50p = mainValue5 * 0.5;
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.saveRealization = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.realizedNativeRewards = [];
                this.realizedNativeFMVRewards = [];
                this.realizedNativeMaketDilutionRewards = [];
                this.realizedNativeSupplyDepletionRewards = [];
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.updateSets = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.calculateNativeRewardFMVByCycle = function () {
        var _this = this;
        //rewards by day by price that day
        return this.rewardsByCycle.map(function (reward) {
            return { date: reward.date, rewardAmount: reward.rewardAmount * _this.pricesAndMarketCapsByDay[reward.date].price, cycle: reward.cycle };
        });
    };
    TezosSet.prototype.calculateNativeMarketDilutionRewards = function (scaledBVByDomain) {
        return __awaiter(this, void 0, void 0, function () {
            var mappedBV, nativeMarketDilutionByDay, filteredMarketByDay, filtereredPriceByDay, dictionaryPriceByDay, lastMarket, lastPrice, nativeFilteredMarketDilutionByDay, mappedFMV, mappedCyclesToFirstCycleDate, nativeMarketDilutionRewards, currentDate, currentDilutionCycle, aggDilutionAmount, endDate, nativeFilteredDilutionRewards;
            var _this = this;
            return __generator(this, function (_a) {
                mappedBV = new Map();
                scaledBVByDomain.forEach(function (bvDomain) {
                    // iterate over the date range (inclusive)
                    var startDate = new Date(bvDomain.startDate);
                    var endDate = new Date(bvDomain.endDate);
                    while (startDate <= endDate) {
                        mappedBV[startDate.toISOString().slice(0, 10)] = bvDomain.scaledBookValue;
                        startDate.setDate(startDate.getDate() + 1);
                        if (startDate.toISOString().slice(11) !== "00:00:00.000Z") {
                            startDate.setDate(startDate.getDate() + 1);
                            startDate = new Date(startDate.toISOString().slice(0, 10));
                        }
                    }
                });
                filteredMarketByDay = this.marketByDay.filter(function (markets) {
                    return markets.date >= _this.firstRewardDate;
                });
                filtereredPriceByDay = this.priceByDay.filter(function (prices) {
                    return prices.date >= _this.firstRewardDate;
                });
                dictionaryPriceByDay = Object.assign.apply(Object, __spreadArray([{}], __read(filtereredPriceByDay.map(function (x) {
                    var _a;
                    return (_a = {}, _a[x.date] = x.amount, _a);
                })), false));
                lastMarket = filteredMarketByDay[0];
                lastPrice = filtereredPriceByDay[0].amount;
                nativeMarketDilutionByDay = filteredMarketByDay.slice(1).map(function (market) {
                    var ratio1 = ((market.amount - lastMarket.amount) / lastMarket.amount);
                    var ratio2 = ((dictionaryPriceByDay[market.date] - lastPrice) / lastPrice);
                    var ratio3 = ratio1 - ratio2;
                    if (lastMarket.date === market.date) {
                        return;
                    }
                    lastMarket = market;
                    lastPrice = dictionaryPriceByDay[market.date];
                    return { date: market.date, amount: (ratio3) * mappedBV[market.date] };
                });
                //filter for existing dilution 
                nativeFilteredMarketDilutionByDay = nativeMarketDilutionByDay.map(function (element) {
                    if (element.amount <= 0) {
                        return { date: element.date, amount: 0 };
                    }
                    else {
                        return element;
                    }
                });
                mappedFMV = new Map();
                this.nativeRewardsFMVByCycle.forEach(function (fmvReward) {
                    mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
                });
                mappedCyclesToFirstCycleDate = new Map();
                this.cyclesMappedToDays.forEach(function (key, value) {
                    mappedCyclesToFirstCycleDate[value] = key;
                });
                nativeMarketDilutionRewards = [];
                currentDate = nativeFilteredMarketDilutionByDay[0].date;
                currentDilutionCycle = mappedCyclesToFirstCycleDate[currentDate];
                aggDilutionAmount = nativeFilteredMarketDilutionByDay[0].amount;
                endDate = nativeFilteredMarketDilutionByDay[nativeFilteredMarketDilutionByDay.length - 1].date;
                nativeFilteredMarketDilutionByDay.forEach(function (nativeFilteredMarketDilutionByDay) {
                    if (_this.cyclesMappedToDays.get(nativeFilteredMarketDilutionByDay.date) !== currentDilutionCycle) {
                        nativeMarketDilutionRewards.push({ date: currentDate,
                            rewardAmount: mappedFMV[currentDilutionCycle] - aggDilutionAmount,
                            cycle: currentDilutionCycle });
                        currentDate = nativeFilteredMarketDilutionByDay.date;
                        currentDilutionCycle = mappedCyclesToFirstCycleDate[currentDate];
                        aggDilutionAmount = nativeFilteredMarketDilutionByDay.amount;
                    }
                    else if (nativeFilteredMarketDilutionByDay.date === endDate) {
                        aggDilutionAmount += nativeFilteredMarketDilutionByDay.amount;
                        nativeMarketDilutionRewards.push({ date: currentDate,
                            rewardAmount: mappedFMV[currentDilutionCycle] - aggDilutionAmount,
                            cycle: currentDilutionCycle });
                    }
                    else {
                        aggDilutionAmount += nativeFilteredMarketDilutionByDay.amount;
                    }
                });
                nativeFilteredDilutionRewards = nativeMarketDilutionRewards.map(function (element) {
                    if (element.rewardAmount <= 0) {
                        return { date: element.date, rewardAmount: 0, cycle: element.cycle };
                    }
                    else {
                        return element;
                    }
                });
                this.nativeMarketDilutionRewards = nativeFilteredDilutionRewards;
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.calculateNativeSupplyDepletionRewards = function (scaledBVByDomain) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mappedBV, nativeSupplyDepletionByDay, filteredSupplyByDay, lastSupply, mappedFMV, mappedCyclesToFirstCycleDate, nativeSupplyDepletionRewards, currentDate, currentSupplyCycle, aggSupplyAmount;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // do this in some earlier method
                        _a = this;
                        return [4 /*yield*/, database_service_1.collections.tezosSupply.find().sort({ dateString: 1 }).toArray()];
                    case 1:
                        // do this in some earlier method
                        _a.supplyByDay = (_b.sent());
                        mappedBV = new Map();
                        scaledBVByDomain.forEach(function (bvDomain) {
                            // iterate over the date range (inclusive)
                            var startDate = new Date(bvDomain.startDate);
                            var endDate = new Date(bvDomain.endDate);
                            while (startDate <= endDate) {
                                mappedBV[startDate.toISOString().slice(0, 10)] = bvDomain.scaledBookValue;
                                startDate.setDate(startDate.getDate() + 1);
                                if (startDate.toISOString().slice(11) !== "00:00:00.000Z") {
                                    startDate.setDate(startDate.getDate() + 1);
                                    startDate = new Date(startDate.toISOString().slice(0, 10));
                                }
                            }
                        });
                        filteredSupplyByDay = this.supplyByDay.filter(function (supply) {
                            return supply.dateString >= _this.firstRewardDate;
                        });
                        lastSupply = filteredSupplyByDay[0];
                        nativeSupplyDepletionByDay = filteredSupplyByDay.slice(1).map(function (supply) {
                            var ratio = lastSupply.totalSupply / supply.totalSupply;
                            if (lastSupply.dateString === supply.dateString) {
                                return;
                            }
                            lastSupply = supply;
                            return { date: supply.dateString, amount: (1 - ratio) * mappedBV[supply.dateString] };
                        });
                        mappedFMV = new Map();
                        this.nativeRewardsFMVByCycle.forEach(function (fmvReward) {
                            mappedFMV[fmvReward.cycle] = fmvReward.rewardAmount;
                        });
                        mappedCyclesToFirstCycleDate = new Map();
                        this.cyclesMappedToDays.forEach(function (key, value) {
                            mappedCyclesToFirstCycleDate[value] = key;
                        });
                        nativeSupplyDepletionRewards = [];
                        currentDate = nativeSupplyDepletionByDay[0].date;
                        currentSupplyCycle = mappedCyclesToFirstCycleDate[currentDate];
                        aggSupplyAmount = nativeSupplyDepletionByDay[0].amount;
                        nativeSupplyDepletionByDay.forEach(function (nativeSupplyDepletion) {
                            if (_this.cyclesMappedToDays.get(nativeSupplyDepletion.date) !== currentSupplyCycle) {
                                nativeSupplyDepletionRewards.push({ date: currentDate,
                                    rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount,
                                    cycle: currentSupplyCycle });
                                currentDate = nativeSupplyDepletion.date;
                                currentSupplyCycle = mappedCyclesToFirstCycleDate[currentDate];
                                aggSupplyAmount = nativeSupplyDepletion.amount;
                            }
                            else if (nativeSupplyDepletion.date === nativeSupplyDepletionByDay[nativeSupplyDepletionByDay.length - 1].date) {
                                aggSupplyAmount += nativeSupplyDepletion.amount;
                                nativeSupplyDepletionRewards.push({ date: currentDate,
                                    rewardAmount: mappedFMV[currentSupplyCycle] - aggSupplyAmount,
                                    cycle: currentSupplyCycle });
                            }
                            else {
                                aggSupplyAmount += nativeSupplyDepletion.amount;
                            }
                        });
                        this.nativeSupplyDepletionRewards = nativeSupplyDepletionRewards;
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.calculateInvestmentBVByDomain = function () {
        //i. scale transactions by fiat + add investment book value
        //  - first investment book value is value of first transactiosn
        //  - every subsequent bv is the the last bv + the current transaction amount 
        //  - startDate is the day of the current transaction
        //  - endDate is the day before the next transaction 
        // group by date
        var groupedTransactions = new Map();
        this.unaccountedNetTransactions.forEach(function (transaction) {
            groupedTransactions[transaction.date] = { date: transaction.date, amount: transaction.date in groupedTransactions ? groupedTransactions[transaction.date].amount + transaction.amount : transaction.amount };
        });
        var groupedTransactionsArray = Object.values(groupedTransactions);
        // create array of date ranges inclusive mapped to the scaledbookvalues
        var scaledBVByDomain = [];
        for (var i = 0; i < groupedTransactionsArray.length; i++) {
            // determine the date range
            var startDate = groupedTransactionsArray[i].date;
            var nextDay = new Date(groupedTransactionsArray[i].date);
            nextDay.setDate(nextDay.getDate() + 1);
            var nextDate = undefined;
            // if the current transaction is the last one in our array 
            // we'll bound the end with todays date
            if (i === groupedTransactionsArray.length - 1) {
                nextDate = new Date();
            }
            else {
                nextDate = new Date(groupedTransactionsArray[i + 1].date);
            }
            var endDate = "";
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
            var bvValue = groupedTransactionsArray[i].amount;
            if (i !== 0) {
                bvValue += scaledBVByDomain[scaledBVByDomain.length - 1].scaledBookValue;
            }
            scaledBVByDomain.push({ startDate: startDate, endDate: endDate, scaledBookValue: bvValue });
        }
        return scaledBVByDomain;
    };
    //retreive methods
    TezosSet.prototype.retrieveBakers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delegatorRewardsResponse, filteredResponse, curBaker, _a, _b, cycleData;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get(this.delegatorRewardsUrl)];
                    case 1:
                        delegatorRewardsResponse = _d.sent();
                        filteredResponse = delegatorRewardsResponse.data.map(function (_a) {
                            var cycle = _a.cycle, balance = _a.balance, baker = _a.baker;
                            return ({ cycle: cycle, balance: balance, baker: baker });
                        });
                        curBaker = undefined;
                        try {
                            for (_a = __values(filteredResponse.reverse()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                cycleData = _b.value;
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
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        this.setRewardsUrls(curBaker);
                        this.bakerCycles.push(curBaker);
                        this.bakerAddresses.add(curBaker.bakerAddress);
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.retrieveBakerRewards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, operations, totalOperations, a, c, urlNext, response2, nextOperations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "https://api.tzkt.io/v1/accounts/".concat(this.walletAddress, "/operations?type=endorsement,baking,nonce_revelation,double_baking,double_endorsing,transaction,origination,delegation,reveal,revelation_penalty&limit=1000&sort=0");
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 1:
                        response = _a.sent();
                        this.nextTimeStamp = response.data[response.data.length - 1].timestamp;
                        operations = response.data.map(function (_a) {
                            var type = _a.type, amount = _a.amount, rewards = _a.rewards, reward = _a.reward, bakerRewards = _a.bakerRewards, accuserRewards = _a.accuserRewards, accuser = _a.accuser, offenderLostDeposits = _a.offenderLostDeposits, offenderLostRewards = _a.offenderLostRewards, offenderLostFees = _a.offenderLostFees, storageFee = _a.storageFee, allocationFee = _a.allocationFee, sender = _a.sender, lostReward = _a.lostReward, lostFees = _a.lostFees, timestamp = _a.timestamp;
                            return ({ type: type, amount: amount, rewards: rewards, reward: reward, bakerRewards: bakerRewards, accuserRewards: accuserRewards, accuser: accuser, offenderLostDeposits: offenderLostDeposits, offenderLostRewards: offenderLostRewards, offenderLostFees: offenderLostFees, storageFee: storageFee, allocationFee: allocationFee, sender: sender, lostReward: lostReward, lostFees: lostFees, timestamp: timestamp });
                        });
                        totalOperations = [];
                        console.log(this.nextTimeStamp);
                        a = new Date(this.nextTimeStamp);
                        c = new Date();
                        c.setDate(c.getDate() - 5);
                        console.log(operations);
                        _a.label = 2;
                    case 2:
                        if (!(a.getTime() < c.getTime())) return [3 /*break*/, 4];
                        urlNext = "https://api.tzkt.io/v1/accounts/".concat(this.walletAddress, "/operations?timestamp.ge=").concat(this.nextTimeStamp, "&limit=1000&sort=0");
                        return [4 /*yield*/, axios_1["default"].get(urlNext)];
                    case 3:
                        response2 = _a.sent();
                        console.log(response2);
                        this.nextTimeStamp = response2.data[response2.data.length - 1].timestamp;
                        nextOperations = response2.data.map(function (_a) {
                            var type = _a.type, amount = _a.amount, rewards = _a.rewards, reward = _a.reward, bakerRewards = _a.bakerRewards, accuserRewards = _a.accuserRewards, accuser = _a.accuser, offenderLostDeposits = _a.offenderLostDeposits, offenderLostRewards = _a.offenderLostRewards, offenderLostFees = _a.offenderLostFees, storageFee = _a.storageFee, allocationFee = _a.allocationFee, sender = _a.sender, lostReward = _a.lostReward, lostFees = _a.lostFees, timestamp = _a.timestamp;
                            return ({ type: type, amount: amount, rewards: rewards, reward: reward, bakerRewards: bakerRewards, accuserRewards: accuserRewards, accuser: accuser, offenderLostDeposits: offenderLostDeposits, offenderLostRewards: offenderLostRewards, offenderLostFees: offenderLostFees, storageFee: storageFee, allocationFee: allocationFee, sender: sender, lostReward: lostReward, lostFees: lostFees, timestamp: timestamp });
                        });
                        totalOperations.push(nextOperations);
                        a = new Date(this.nextTimeStamp);
                        return [3 /*break*/, 2];
                    case 4:
                        console.log(totalOperations);
                        this.totalOperations = totalOperations;
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.retrieveCyclesAndDates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // 2. retrieveCyclesAndDates: retrieve the cycle data we have in our database and store it // get mapping of cycles to dates
                        _a = this;
                        return [4 /*yield*/, database_service_1.collections.cycleAndDate.find().sort({ dateString: 1 }).toArray()];
                    case 1:
                        // 2. retrieveCyclesAndDates: retrieve the cycle data we have in our database and store it // get mapping of cycles to dates
                        _a.cyclesByDay = (_b.sent());
                        this.cyclesByDay.forEach(function (cycleByDay) { return (_this.cyclesMappedToDays.set(cycleByDay.dateString, cycleByDay.cycleNumber)); });
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.retrieveBakersPayouts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var completeRewardsRequests, j, temporary, chunk, responses, i, j_1, response, rewards;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        completeRewardsRequests = this.bakerCycles.map(function (bakerCycle) { return bakerCycle.rewardsRequests; }).flat();
                        chunk = BAKINGBADBATCHSIZE;
                        responses = [];
                        i = 0, j_1 = completeRewardsRequests.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < j_1)) return [3 /*break*/, 4];
                        temporary = completeRewardsRequests.slice(i, i + chunk);
                        return [4 /*yield*/, axios_1["default"].all(temporary.map(function (url) { return axios_1["default"].get(url); }))];
                    case 2:
                        response = _a.sent();
                        responses.push.apply(responses, __spreadArray([], __read(response), false));
                        _a.label = 3;
                    case 3:
                        i += chunk;
                        return [3 /*break*/, 1];
                    case 4:
                        rewards = {};
                        responses.forEach(function (response) {
                            var _a;
                            if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.payouts) === undefined) {
                                console.log("No payout data found in a response");
                            }
                            else {
                                response.data.payouts.forEach(function (payout) {
                                    if (payout.address === _this.walletAddress) {
                                        var amount = payout["amount"];
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
                        this.rewardsByDay = this.cyclesByDay.filter(function (cycleAndDateDoc) { return cycleAndDateDoc.cycleNumber.toString() in rewards; }).map(function (cycleAndDateDoc) {
                            return { date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber.toString()], cycle: cycleAndDateDoc.cycleNumber };
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getRawWalletTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transactionsLength, transactionsResponse, transactionsResponseArray;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transactionsLength = TRANSACTIONURLLIMIT;
                        _b.label = 1;
                    case 1:
                        if (!(transactionsLength === TRANSACTIONURLLIMIT)) return [3 /*break*/, 3];
                        return [4 /*yield*/, axios_1["default"].get(this.transactionsUrl)];
                    case 2:
                        transactionsResponse = _b.sent();
                        transactionsResponseArray = transactionsResponse.data.map(function (_a) {
                            var target = _a.target, sender = _a.sender, amount = _a.amount, timestamp = _a.timestamp;
                            return ({ target: target, sender: sender, amount: amount, timestamp: timestamp });
                        });
                        (_a = this.rawWalletTransactions).push.apply(_a, __spreadArray([], __read(transactionsResponseArray), false));
                        transactionsLength = transactionsResponseArray.length;
                        return [3 /*break*/, 1];
                    case 3:
                        this.rawWalletTransactions.forEach(function (transaction) {
                            var _a, _b;
                            if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.alias) === "Melange Payouts")
                                _this.isCustodial = true;
                            else if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _b === void 0 ? void 0 : _b.alias) === "EcoTez Payouts")
                                _this.bakerAddresses.add("tz1QS7N8HnRBG2RNh3Kjty58XFXuLFVdnKGY");
                        });
                        this.isCustodial = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getBakerRewardsAndTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.retrieveBakerRewards(), this.processBakerRewards(), this.retrieveCyclesAndDates(), this.getRawWalletTransactions()])
                        //uncomment these 3
                    ];
                    case 1:
                        _a.sent();
                        //uncomment these 3
                        this.getNetTransactions();
                        this.firstRewardDate = this.rewardsByDay[0].date;
                        this.filterPayoutsBaker();
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getDelegatorRewardsAndTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates(), this.getRawWalletTransactions()])];
                    case 1:
                        _a.sent();
                        if (!this.isCustodial) return [3 /*break*/, 2];
                        this.processIntermediaryTransactions();
                        this.getNetTransactions();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.retrieveBakersPayouts()];
                    case 3:
                        _a.sent();
                        this.getNetTransactions();
                        _a.label = 4;
                    case 4:
                        this.firstRewardDate = this.rewardsByDay[0].date;
                        this.filterPayouts();
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getBalances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balances, offset, resp_len, currentDay, latestBalance, url, response, _a, _b, day, fillerDays, fillerDays_1, fillerDays_1_1, fillerDay;
            var e_2, _c, e_3, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        balances = {};
                        offset = 0;
                        resp_len = 10000;
                        currentDay = null;
                        latestBalance = null;
                        _e.label = 1;
                    case 1:
                        if (!(resp_len === 10000)) return [3 /*break*/, 3];
                        url = "https://api.tzkt.io/v1/accounts/".concat(this.walletAddress, "/balance_history?offset=").concat(offset, "&limit=10000");
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 2:
                        response = _e.sent();
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
                        try {
                            for (_a = (e_2 = void 0, __values(response.data)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                day = _b.value;
                                // update the latestBalance since we're on the currently marked day
                                if (day.timestamp.substring(0, 10) === currentDay) {
                                    latestBalance = day.balance / MUTEZ;
                                }
                                else {
                                    // push the day and its last balance to our map since we're now on a new day
                                    balances[currentDay] = latestBalance / MUTEZ;
                                    fillerDays = this.getNonInclusiveDateRange(currentDay, day.timestamp.substring(0, 10));
                                    try {
                                        // for these days, add the currentDays balance
                                        for (fillerDays_1 = (e_3 = void 0, __values(fillerDays)), fillerDays_1_1 = fillerDays_1.next(); !fillerDays_1_1.done; fillerDays_1_1 = fillerDays_1.next()) {
                                            fillerDay = fillerDays_1_1.value;
                                            balances[fillerDay] = latestBalance / MUTEZ;
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (fillerDays_1_1 && !fillerDays_1_1.done && (_d = fillerDays_1["return"])) _d.call(fillerDays_1);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                    currentDay = day.timestamp.substring(0, 10);
                                    latestBalance = day.balance / MUTEZ;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        // push the last day
                        balances[currentDay] = latestBalance / MUTEZ;
                        this.balancesByDay = balances;
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getPricesAndMarketCap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var price, marketCap, priceAndMarketCapData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = "price".concat(this.fiat);
                        marketCap = "marketCap".concat(this.fiat);
                        return [4 /*yield*/, database_service_1.collections.priceAndMarketCap.find().sort({ date: 1 }).toArray()];
                    case 1:
                        priceAndMarketCapData = (_a.sent());
                        priceAndMarketCapData.forEach(function (priceAndMarketCap) {
                            // date reformatting
                            var dateSplit = priceAndMarketCap.date.toString().split("-");
                            dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                            var correctedDate = dateSplit.join("-");
                            _this.pricesAndMarketCapsByDay[correctedDate] = { date: correctedDate, price: priceAndMarketCap[price], marketCap: priceAndMarketCap[marketCap] };
                        });
                        //filter the map type for date and market cap 
                        //this.priceAndMarketCapsByDay.sometypefunction(element => {return elementstuff})
                        //log the element
                        //extraction method from element
                        //add date reformatting 
                        //console.log(this.marketByDay)
                        priceAndMarketCapData.forEach(function (element) {
                            var dateSplit = element.date.toString().split("-");
                            dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                            var correctedDate = dateSplit.join("-");
                            _this.marketByDay.push({ date: correctedDate, amount: element[marketCap] });
                        });
                        priceAndMarketCapData.forEach(function (element) {
                            var dateSplit = element.date.toString().split("-");
                            dateSplit = [dateSplit[0], dateSplit[1], dateSplit[2]];
                            var correctedDate = dateSplit.join("-");
                            _this.priceByDay.push({ date: correctedDate, amount: element[price] });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    //processing methods
    TezosSet.prototype.processIntermediaryTransactions = function () {
        var _a;
        var _this = this;
        var intermediaryTransactions = this.rawWalletTransactions.filter(function (transaction) {
            var _a;
            (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.alias) === "Melange Payouts");
        });
        var intermediaryRewards = intermediaryTransactions.map(function (transaction) {
            var transactionDate = transaction.timestamp.slice(0, 10);
            var adjustedAmount = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
            var cycleNumber = _this.cyclesMappedToDays.get(transactionDate);
            var reward = { date: transactionDate, rewardAmount: adjustedAmount, cycle: cycleNumber };
            return reward;
        });
        (_a = this.rewardsByDay).push.apply(_a, __spreadArray([], __read(intermediaryRewards), false));
        return;
    };
    TezosSet.prototype.processBakerRewards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rewards;
            var _this = this;
            return __generator(this, function (_a) {
                rewards = {};
                this.totalOperations.forEach(function (array) {
                    array.forEach(function (operation) {
                        if (operation.type === undefined) {
                            console.log("No payout data found in a response");
                        }
                        else {
                            if ('endorsement' === operation.type) {
                                var date = _this.formatDate(operation.timestamp);
                                var amount = operation.rewards / 1000000;
                                if (amount !== undefined) {
                                    if (rewards[date] !== undefined) {
                                        var value = rewards[date];
                                        rewards[date] = value + amount;
                                    }
                                    else {
                                        rewards[date] = amount;
                                    }
                                }
                            }
                            else if ("baking" === operation.type) {
                                var date = _this.formatDate(operation.timestamp);
                                var amount = operation.reward / 1000000;
                                if (amount !== undefined) {
                                    if (rewards[date] !== undefined) {
                                        var value = rewards[date];
                                        rewards[date] = value + amount;
                                    }
                                    else {
                                        rewards[date] = amount;
                                    }
                                }
                            }
                            else if ('nonce_revelation' === operation.type) {
                                var date = _this.formatDate(operation.timestamp);
                                var amount = operation.bakerRewards / 1000000;
                                if (amount !== undefined) {
                                    if (rewards[date] !== undefined) {
                                        var value = rewards[date];
                                        rewards[date] = value + amount;
                                    }
                                    else {
                                        rewards[date] = amount;
                                    }
                                }
                            }
                            else if ('double_baking' === operation.type) {
                                var isAccuser = operation.accuser.address === _this.walletAddress;
                                if (isAccuser) {
                                    var date = _this.formatDate(operation.timestamp);
                                    var amount = operation.accuserRewards / 1000000;
                                    if (amount !== undefined) {
                                        if (rewards[date] !== undefined) {
                                            var value = rewards[date];
                                            rewards[date] = value + amount;
                                        }
                                        else {
                                            rewards[date] = amount;
                                        }
                                    }
                                }
                                else {
                                    var date = _this.formatDate(operation.timestamp);
                                    var amount = -(operation.offenderLostDeposits + operation.offenderLostRewards + operation.offenderLostFees) / 1000000;
                                    if (amount !== undefined) {
                                        if (rewards[date] !== undefined) {
                                            var value = rewards[date];
                                            rewards[date] = value + amount;
                                        }
                                        else {
                                            rewards[date] = amount;
                                        }
                                    }
                                }
                            }
                            else if ("origination" === operation.type) {
                                var date = _this.formatDate(operation.timestamp);
                                var amount = -(operation.bakerFee + operation.storageFee + operation.allocationFee) / 1000000;
                                if (amount !== undefined) {
                                    if (rewards[date] !== undefined) {
                                        var value = rewards[date];
                                        rewards[date] = value + amount;
                                    }
                                    else {
                                        rewards[date] = amount;
                                    }
                                }
                            }
                            else if ("delegation" === operation.type) {
                                var date = _this.formatDate(operation.timestamp);
                                var isSender = operation.sender.address === _this.walletAddress;
                                if (isSender) {
                                    var amount = -1 * operation.bakerFee / 1000000;
                                    if (amount !== undefined) {
                                        if (rewards[date] !== undefined) {
                                            var value = rewards[date];
                                            rewards[date] = value + amount;
                                        }
                                        else {
                                            rewards[date] = amount;
                                        }
                                    }
                                }
                            }
                            else if ("reveal") {
                                var date = _this.formatDate(operation.timestamp);
                                var amount = -1 * operation.bakerFee / 1000000;
                                if (amount !== undefined) {
                                    if (rewards[date] !== undefined) {
                                        var value = rewards[date];
                                        rewards[date] = value + amount;
                                    }
                                    else {
                                        rewards[date] = amount;
                                    }
                                }
                            }
                            else if ("revelation_penalty") {
                                var date = _this.formatDate(operation.timestamp);
                                var amount = -1 * (operation.lostReward + operation.lostFees) / 1000000;
                                if (amount !== undefined) {
                                    if (rewards[date] !== undefined) {
                                        var value = rewards[date];
                                        rewards[date] = value + amount;
                                    }
                                    else {
                                        rewards[date] = amount;
                                    }
                                }
                            }
                        }
                    });
                });
                console.log(rewards);
                //flip this to get the cycles
                this.rewardsByDay = this.cyclesByDay.filter(function (cycleAndDateDoc) { return cycleAndDateDoc.dateString.toString() in rewards; }).map(function (cycleAndDateDoc) {
                    return { date: cycleAndDateDoc.dateString, rewardAmount: rewards[_this.formatDate(cycleAndDateDoc.dateString.toString())], cycle: cycleAndDateDoc.cycleNumber };
                });
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.filterPayouts = function () {
        var e_4, _a;
        // group "rewardsByDay", by cycle and only keep the item with the earliest date in each group -> save to rewardsByCycle
        var currentItem = this.rewardsByDay[this.rewardsByDay.length - 1];
        try {
            for (var _b = __values(this.rewardsByDay.slice().reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var reward = _c.value;
                if (reward.cycle !== currentItem.cycle) {
                    this.rewardsByCycle.push(currentItem);
                }
                currentItem = reward;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (this.rewardsByDay[0].date === currentItem.date) {
            this.rewardsByCycle.push(currentItem);
        }
        return;
    };
    ;
    TezosSet.prototype.filterPayoutsBaker = function () {
        var e_5, _a;
        var currentItem = this.rewardsByDay[0];
        try {
            // this.rewardsByCycle = this.rewardsByDay.forEach((value) => {
            //     if(value.cycle == currentItem.cycle) {
            //         currentItem.rewardAmount += value.rewardAmount 
            //     }
            // })
            for (var _b = __values(this.rewardsByDay.slice().reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var reward = _c.value;
                if (reward.cycle == currentItem.cycle) {
                    var value = reward.rewardAmount + currentItem.rewardAmount;
                    currentItem.rewardAmount = value;
                }
                else {
                    this.rewardsByCycle.push(currentItem);
                    currentItem = reward;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (this.rewardsByDay[0].date === currentItem.date) {
            this.rewardsByCycle.push(currentItem);
        }
        return;
    };
    TezosSet.prototype.getNetTransactions = function () {
        // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude reward transactions
        // + Melange Payouts. add a rewardByDay to the rewardsByDay list   
        var _this = this;
        this.unaccountedNetTransactions = this.rawWalletTransactions.filter(function (transaction) {
            var _a, _b;
            return (!(_this.bakerAddresses.has((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.address) || _this.bakerAddresses.has((_b = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _b === void 0 ? void 0 : _b.address)));
        }).map(function (transaction) {
            var _a, _b;
            var transactionDate = new Date(transaction.timestamp).toISOString().slice(0, 10);
            var adjustedAmount = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
            var amount = { date: transactionDate, amount: adjustedAmount };
            if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _a === void 0 ? void 0 : _a.address) === _this.walletAddress) {
                amount = { date: transactionDate, amount: adjustedAmount };
            }
            else if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _b === void 0 ? void 0 : _b.address) === _this.walletAddress) {
                amount.amount = adjustedAmount * -1;
            }
            return amount;
        });
        return;
    };
    // utility methods:
    TezosSet.prototype.setRewardsUrls = function (bakerData) {
        for (var i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push("https://api.baking-bad.org/v2/rewards/".concat(bakerData.bakerAddress, "?cycle=").concat(i));
        }
    };
    TezosSet.prototype.formatDate = function (date) {
        var d = new Date(date), month = "" + (d.getMonth() + 1), day = "" + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = "0" + month;
        if (day.length < 2)
            day = "0" + day;
        return [year, month, day].join("-");
    };
    TezosSet.prototype.getNonInclusiveDateRange = function (startDateString, endDateString) {
        // non inclusive on both sides
        var dates = [];
        var now = new Date();
        var endDate = new Date(endDateString);
        // start on next day following startDate
        var startDate = new Date(startDateString);
        startDate.setDate(startDate.getDate() + 1);
        var daysOfYear = [];
        // end on day before endDate
        for (startDate; startDate < endDate; startDate.setDate(startDate.getDate() + 1)) {
            dates.push(startDate.toISOString().split('T')[0]);
        }
        return dates;
    };
    return TezosSet;
}());
var ts = new TezosSet();
ts.init("USD", "tz1PWCDnz783NNGGQjEFFsHtrcK5yBW4E2rm", "Baker").then(function (x) {
    (0, fs_1.writeFile)("test.json", JSON.stringify(ts, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("JSON saved to " + "test.json");
        }
    });
});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
//baker tz1fJHFn6sWEd3NnBPngACuw2dggTv6nQZ7g, tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM
//delegator tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH
