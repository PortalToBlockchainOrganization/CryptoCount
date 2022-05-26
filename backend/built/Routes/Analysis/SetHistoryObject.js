var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SetHistoryObject {
    constructor() {
        this.aos = new Array();
    }
    // FIX ME: implement in child class
    init(fiat, address) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO HERE: for each basis price date create an analysis object for that basis price
            let rewards; // TODO HERE: get rewards 
            let balances; // TODO HERE: get balances
            let prices; // TODO HERE: get prices
            let marketCap; // TODO HERE: get marketCap
            // TODO HERE: do get true additions work and get basisPrices ...
            let basisPrices;
            for (const [date, basisPrice] of basisPrice.entries()) {
                let analysisObject = new AnalysisObject();
                yield analysisObject.analyze(rewards, balances, prices, marketCap);
                this.aos.push(analysisObject);
            }
        });
    }
}
