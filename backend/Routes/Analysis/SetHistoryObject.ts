class SetHistoryObject {
    aos: Array<AnalysisObject> = new Array();

    constructor(){

    }

    // FIX ME: implement in child class
    async init(fiat: string, address: string){
        // TODO HERE: for each basis price date create an analysis object for that basis price
        let rewards: Map<Date, number>; // TODO HERE: get rewards 
        let balances: Map<Date, number>; // TODO HERE: get balances
        let prices: Map<Date, number>; // TODO HERE: get prices
        let marketCap: Map<Date, number>; // TODO HERE: get marketCap
        // TODO HERE: do get true additions work and get basisPrices ...
        let basisPrices: Map<Date, Number>;
        for (const [date, basisPrice] of basisPrice.entries()) {
            let analysisObject = new AnalysisObject();
            await analysisObject.analyze(rewards, balances, prices, marketCap);
            this.aos.push(analysisObject);
        } 


    }
}