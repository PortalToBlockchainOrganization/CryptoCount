var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { forEach } = require("async");
const { analysis, autoAnalysis, } = require("./tzdelpre.js");
function updateSet(set) {
    return __awaiter(this, void 0, void 0, function* () {
        var object = set;
        var newObject = yield autoAnalysis(object.address, object.fiat);
        var lastVal = object.unrealizedRewards[object.unrealizedRewards.length - 1];
        //var lastVal =  newObject.unrealizedRewards[unrealizedRewards.length - 1]
        console.log("lastVal");
        console.log(lastVal);
        //hits this condish if theres no unrealized rewards left
        if (lastVal == undefined) {
            lastVal = object.realizedRewards[object.realizedRewards.length - 1];
            for (i = 0; i < newObject.unrealizedRewards.length; i++) {
                if (newObject.unrealizedRewards[i].date <= lastVal.date) {
                    console.log('let time pass / last val undefined');
                }
                else {
                    console.log("new additoins");
                    object.unrealizedRewards.push(newObject.unrealizedRewards[i]);
                    object.unrealizedBasisRewards.push(newObject.unrealizedBasisRewards[i]);
                    if (newObject.unrealizedBasisRewardsDep[i] != null && newObject.unrealizedBasisRewardsMVDep[i] != null) {
                        object.unrealizedBasisRewardsDep.push(newObject.unrealizedBasisRewardsDep[i]);
                        object.unrealizedBasisRewardsMVDep.push(newObject.unrealizedBasisRewardsMVDep[i]);
                    }
                    object.basisPrice = newObject.basisPrice;
                }
            }
        }
        else {
            for (i = 0; i < newObject.unrealizedRewards.length; i++) {
                if (newObject.unrealizedRewards[i].date <= lastVal.date) {
                    console.log('let time pass / last val defined');
                }
                else {
                    console.log("new additions to unrealized sets");
                    object.unrealizedRewards.push(newObject.unrealizedRewards[i]);
                    object.unrealizedBasisRewards.push(newObject.unrealizedBasisRewards[i]);
                    if (newObject.unrealizedBasisRewardsDep[i] != null && newObject.unrealizedBasisRewardsMVDep[i] != null) {
                        object.unrealizedBasisRewardsDep.push(newObject.unrealizedBasisRewardsDep[i]);
                        object.unrealizedBasisRewardsMVDep.push(newObject.unrealizedBasisRewardsMVDep[i]);
                    }
                    object.basisPrice = newObject.basisPrice;
                }
            }
        }
        return object;
    });
}
module.exports = { updateSet };
