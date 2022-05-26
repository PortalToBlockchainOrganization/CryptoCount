// TODO: non relative imports

import {AnalysisObject} from "../AnalysisObject";
import axios from "axios"; 
import {AxiosResponse} from "axios";
// data imports
import TezosPricesAndMarketCap from "../../../model/blockchain.js";
import TezosCycles from "../../../model/cycle.js";

class TezosSet {
    walletAddress: string;

    constructor(){


    }

    // FIX ME: implement in child class
    async init(fiat: string, address: string){
        this.walletAddress = address;


    }

    async getRewards(){
        // get history of delegators bakers 
        let url: string = `https://api.tzkt.io/v1/rewards/delegators/${this.walletAddress}?cycle.ge=0`;
        let response:AxiosResponse = await axios.get(url);
        // let filteredResponse: Array<{cycle: number, balance: number, baker: {address: string}}>
        let filteredResponse:Array<{cycle: number, balance: number, bakerAddress: string}> =
            response.data.map(({cycle, balance, baker}) => ({cycle, balance, baker}));
        console.log(filteredResponse);
        // let cycles = await  TezosCycles.find();


    }
}

let ts: TezosSet = new TezosSet();
ts.init("","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH")
ts.getRewards();
