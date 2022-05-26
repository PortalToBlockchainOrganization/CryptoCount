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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class TezosSet {
    constructor() {
    }
    // FIX ME: implement in child class
    init(fiat, address) {
        return __awaiter(this, void 0, void 0, function* () {
            this.walletAddress = address;
        });
    }
    getRewards() {
        return __awaiter(this, void 0, void 0, function* () {
            // get history of delegators bakers 
            let url = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0`;
            let response = yield axios_1.default.get(url);
            // let filteredResponse: Array<{cycle: number, balance: number, baker: {address: string}}>
            let filteredResponse = response.data.map(({ cycle, balance, baker }) => ({ cycle, balance, baker }));
            console.log(filteredResponse);
            // let cycles = await  TezosCycles.find();
        });
    }
}
let ts = new TezosSet();
ts.init("", "tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH");
ts.getRewards();
