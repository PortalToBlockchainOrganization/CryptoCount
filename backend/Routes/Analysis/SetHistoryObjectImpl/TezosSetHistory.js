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
exports.__esModule = true;
var axios_1 = require("axios");
var database_service_1 = require("../../../documentInterfaces/database.service");
var fs_1 = require("fs");
// tezos specific constants
var REWARDADJUSTMENTDENOMINATOR = 1000000;
var BAKINGBADBATCHSIZE = 16;
var UNSCALEDAMOUNTTHRESHOLD = 0.0001;
var AMOUNTSCALER = 10000;
var TezosSet = /** @class */ (function () {
    function TezosSet() {
    }
    TezosSet.prototype.init = function (fiat, address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.walletAddress = address;
                        this.rewardsByDay = [];
                        this.balancesByDay = {};
                        this.unaccountedNetTransactions = [];
                        this.bakerCycles = [];
                        this.cyclesByDay = [];
                        this.cyclesMappedToDays = new Map();
                        this.bakerAddresses = new Set();
                        this.transactionsUrl = "https://api.tzkt.io/v1/operations/transactions?anyof.sender.target=".concat(this.walletAddress);
                        this.delegatorRewardsUrl = "https://api.tzkt.io/v1/rewards/delegators/".concat(this.walletAddress, "?cycle.ge=0&limit=10000");
                        return [4 /*yield*/, this.getBalances()];
                    case 1:
                        _a.sent();
                        // await Promise.all([this.setRewardsAndTransactions(), this.getBalances()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    // async retrieval methods
    TezosSet.prototype.retrieveBakers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delegatorRewardsResponse, filteredResponse, curBaker, _i, _a, cycleData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get(this.delegatorRewardsUrl)];
                    case 1:
                        delegatorRewardsResponse = _b.sent();
                        filteredResponse = delegatorRewardsResponse.data.map(function (_a) {
                            var cycle = _a.cycle, balance = _a.balance, baker = _a.baker;
                            return ({ cycle: cycle, balance: balance, baker: baker });
                        });
                        curBaker = undefined;
                        for (_i = 0, _a = filteredResponse.reverse(); _i < _a.length; _i++) {
                            cycleData = _a[_i];
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
                    return [4 /*yield*/, (0, database_service_1.connectToDatabase)()];
                    case 1:
                        // 2. retrieveCyclesAndDates: retrieve the cycle data we have in our database and store it // get mapping of cycles to dates
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, database_service_1.collections.cycleAndDate.find().sort({ dateString: 1 }).toArray()];
                    case 2:
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
                        responses.push.apply(responses, response);
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
                        this.rewardsByDay = this.cyclesByDay.map(function (cycleAndDateDoc) {
                            return { date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber };
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getNetTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // 4. getNetTransactions: retrieve the transactions that this wallet was a part of that exclude reward transactions
                // + Melange Payouts. add a rewardByDay to the rewardsByDay list   
                this.unaccountedNetTransactions = this.rawWalletTransactions.filter(function (transaction) {
                    var _a, _b;
                    return (!(_this.bakerAddresses.has((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.address) || _this.bakerAddresses.has((_b = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _b === void 0 ? void 0 : _b.address)));
                }).map(function (transaction) {
                    var _a, _b;
                    var transactionDate = new Date(transaction.timestamp);
                    var adjustedAmount = transaction.amount / REWARDADJUSTMENTDENOMINATOR;
                    var reward = { date: transactionDate, rewardAmount: adjustedAmount };
                    if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _a === void 0 ? void 0 : _a.address) === _this.walletAddress) {
                        reward = { date: transactionDate, rewardAmount: adjustedAmount };
                    }
                    else if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _b === void 0 ? void 0 : _b.address) === _this.walletAddress) {
                        reward.rewardAmount = adjustedAmount * -1;
                    }
                    return reward;
                });
                return [2 /*return*/];
            });
        });
    };
    TezosSet.prototype.getRawWalletTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transactionsResponse;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get(this.transactionsUrl)];
                    case 1:
                        transactionsResponse = _a.sent();
                        this.rawWalletTransactions = transactionsResponse.data.map(function (_a) {
                            var target = _a.target, sender = _a.sender, amount = _a.amount, timestamp = _a.timestamp;
                            return ({ target: target, sender: sender, amount: amount, timestamp: timestamp });
                        });
                        this.rawWalletTransactions.forEach(function (transaction) {
                            var _a;
                            if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.alias) === "Melange Payouts")
                                _this.isCustodial = true;
                        });
                        this.isCustodial = false;
                        return [2 /*return*/];
                }
            });
        });
    };
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
        (_a = this.rewardsByDay).push.apply(_a, intermediaryRewards);
        return;
    };
    TezosSet.prototype.setRewardsAndTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.retrieveBakers(), this.retrieveCyclesAndDates(), this.getRawWalletTransactions()])];
                    case 1:
                        _a.sent();
                        if (!this.isCustodial) return [3 /*break*/, 3];
                        this.processIntermediaryTransactions();
                        return [4 /*yield*/, this.getNetTransactions()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, Promise.all([this.retrieveBakersPayouts(), this.getNetTransactions()])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.filterPayouts();
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.filterPayouts = function () {
        // group "rewardsByDay", by cycle and only keep the item with the earliest date in each group -> save to rewardsByCycle
        this.rewardsByCycle = [];
        var currentItem = this.rewardsByDay[this.rewardsByDay.length - 1];
        for (var _i = 0, _a = this.rewardsByDay.slice().reverse(); _i < _a.length; _i++) {
            var reward = _a[_i];
            if (reward.cycle !== currentItem.cycle) {
                this.rewardsByCycle.push(currentItem);
            }
            currentItem = reward;
        }
        if (this.rewardsByDay[0].date === currentItem.date) {
            this.rewardsByCycle.push(currentItem);
        }
        return;
    };
    ;
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
    TezosSet.prototype.getBalances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balances, offset, resp_len, currentDay, latestBalance, url, response, _i, _a, day, fillerDays, _b, fillerDays_1, fillerDay;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        balances = {};
                        offset = 0;
                        resp_len = 10000;
                        currentDay = null;
                        latestBalance = null;
                        _c.label = 1;
                    case 1:
                        if (!(resp_len === 10000)) return [3 /*break*/, 3];
                        url = "https://api.tzkt.io/v1/accounts/".concat(this.walletAddress, "/balance_history?offset=").concat(offset, "&limit=10000");
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 2:
                        response = _c.sent();
                        // update the response length to indicate when we've reached the end of the balance history
                        resp_len = response.data.length;
                        offset += response.data.length;
                        // for each day, have the balance equal the latest balance of that day
                        if (currentDay === null) {
                            currentDay = response.data[0].timestamp.substring(0, 10);
                        }
                        if (latestBalance === null) {
                            latestBalance = response.data[0].balance;
                        }
                        for (_i = 0, _a = response.data; _i < _a.length; _i++) {
                            day = _a[_i];
                            // update the latestBalance since we're on the currently marked day
                            if (day.timestamp.substring(0, 10) === currentDay) {
                                latestBalance = day.balance;
                            }
                            else {
                                // push the day and its last balance to our map since we're now on a new day
                                balances[currentDay] = latestBalance;
                                fillerDays = this.getNonInclusiveDateRange(currentDay, day.timestamp.substring(0, 10));
                                // for these days, add the currentDays balance
                                for (_b = 0, fillerDays_1 = fillerDays; _b < fillerDays_1.length; _b++) {
                                    fillerDay = fillerDays_1[_b];
                                    balances[fillerDay] = latestBalance;
                                }
                                currentDay = day.timestamp.substring(0, 10);
                                latestBalance = day.balance;
                            }
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        // push the last day
                        balances[currentDay] = latestBalance;
                        this.balancesByDay = balances;
                        return [2 /*return*/];
                }
            });
        });
    };
    TezosSet.prototype.getRewards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delegatorRewardsResponse, filteredResponse, bakerCylcles, bakers, curBakerIndex, curBaker, _i, _a, cycleData, completeRewardsRequests, j, temporary, chunk, responses, i, j_2, response, rewards, cyclesAndDates, rewardsByDay, transactionsResponse, transactions, filteredTransactions;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: // depricated
                    return [4 /*yield*/, (0, database_service_1.connectToDatabase)()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, axios_1["default"].get(this.delegatorRewardsUrl)];
                    case 2:
                        delegatorRewardsResponse = _b.sent();
                        filteredResponse = delegatorRewardsResponse.data.map(function (_a) {
                            var cycle = _a.cycle, balance = _a.balance, baker = _a.baker;
                            return ({ cycle: cycle, balance: balance, baker: baker });
                        });
                        bakerCylcles = [];
                        bakers = new Set();
                        curBakerIndex = bakerCylcles.length;
                        curBaker = undefined;
                        for (_i = 0, _a = filteredResponse.reverse(); _i < _a.length; _i++) {
                            cycleData = _a[_i];
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
                                bakerCylcles.push(curBaker);
                                bakers.add(cycleData.baker.address);
                                curBaker = { bakerAddress: cycleData.baker.address, cycleStart: cycleData.cycle, cycleEnd: cycleData.cycle, rewardsRequests: [] };
                            }
                        }
                        this.setRewardsUrls(curBaker);
                        bakerCylcles.push(curBaker);
                        bakers.add(curBaker.bakerAddress);
                        completeRewardsRequests = bakerCylcles.map(function (bakerCylcle) { return bakerCylcle.rewardsRequests; }).flat();
                        chunk = 16;
                        responses = [];
                        i = 0, j_2 = completeRewardsRequests.length;
                        _b.label = 3;
                    case 3:
                        if (!(i < j_2)) return [3 /*break*/, 6];
                        temporary = completeRewardsRequests.slice(i, i + chunk);
                        return [4 /*yield*/, axios_1["default"].all(temporary.map(function (url) { return axios_1["default"].get(url); }))];
                    case 4:
                        response = _b.sent();
                        responses.push.apply(responses, response);
                        _b.label = 5;
                    case 5:
                        i += chunk;
                        return [3 /*break*/, 3];
                    case 6:
                        rewards = {};
                        responses.forEach(function (response) {
                            var _a;
                            if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.payouts) === undefined) {
                                console.log("NO PAYOUT DATA ", response.data);
                            }
                            else {
                                response.data.payouts.forEach(function (payout) {
                                    if (payout.address === _this.walletAddress) {
                                        var amount = payout["amount"];
                                        if (amount < 0.0001 && amount > 0) {
                                            amount = amount * 10000;
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
                        return [4 /*yield*/, database_service_1.collections.cycleAndDate.find({}).toArray()];
                    case 7:
                        cyclesAndDates = (_b.sent());
                        rewardsByDay = cyclesAndDates.map(function (cycleAndDateDoc) {
                            return { date: cycleAndDateDoc.dateString, rewardAmount: rewards[cycleAndDateDoc.cycleNumber], cycle: cycleAndDateDoc.cycleNumber };
                        });
                        return [4 /*yield*/, axios_1["default"].get(this.transactionsUrl)];
                    case 8:
                        transactionsResponse = _b.sent();
                        transactions = transactionsResponse.data.map(function (_a) {
                            var target = _a.target, sender = _a.sender, amount = _a.amount, timestamp = _a.timestamp;
                            return ({ target: target, sender: sender, amount: amount, timestamp: timestamp });
                        });
                        filteredTransactions = transactions.filter(function (transaction) {
                            var _a, _b;
                            (!(bakers.has((_a = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _a === void 0 ? void 0 : _a.address) || bakers.has((_b = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _b === void 0 ? void 0 : _b.address)));
                        }).map(function (transaction) {
                            var _a, _b;
                            var transactionDate = new Date(transaction.timestamp);
                            var adjustedAmount = transaction.amount / 1000000;
                            var reward = { date: transactionDate, rewardAmount: adjustedAmount };
                            if (((_a = transaction === null || transaction === void 0 ? void 0 : transaction.target) === null || _a === void 0 ? void 0 : _a.address) === _this.walletAddress) {
                                reward = { date: transactionDate, rewardAmount: adjustedAmount };
                            }
                            else if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.sender) === null || _b === void 0 ? void 0 : _b.address) === _this.walletAddress) {
                                reward.rewardAmount = adjustedAmount * -1;
                            }
                            return reward;
                        });
                        return [2 /*return*/, [rewardsByDay, filteredTransactions]];
                }
            });
        });
    };
    // utility methods:
    TezosSet.prototype.setRewardsUrls = function (bakerData) {
        for (var i = bakerData.cycleStart; i <= bakerData.cycleEnd; i++) {
            bakerData.rewardsRequests.push("https://api.baking-bad.org/v2/rewards/".concat(bakerData.bakerAddress, "?cycle=").concat(i));
        }
    };
    return TezosSet;
}());
var ts = new TezosSet();
ts.init("", "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH").then(function (x) {
    (0, fs_1.writeFile)("test.json", JSON.stringify(ts.balancesByDay, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("JSON saved to " + "test.json");
        }
    });
});
// ts.setRewardsAndTransactions().then(x => {console.log(ts.rewardsByDay, ts.unaccountedNetTransactions)});
