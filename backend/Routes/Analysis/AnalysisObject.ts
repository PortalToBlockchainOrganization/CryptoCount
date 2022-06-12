class AnalysisObject {

    unrealizedRewards: Map<Date, number>;
    unrealizedBasisRewards: Map<Date, number>;
    unrealizedBasisRewardsDepletion: Map<Date, number>;
    unrealizedBasisRewardsMarketValueDilution: Map<Date, number>;
    unrealizedRewardAggregate: number;
    unrealizedBasisAggregate: number;
    unrealizedDepletionAggregate: number;
    unrealizedMarketValueDilutionAggregate: number;    
    cryptoBasis: number;
    basisPrice: number;
    basisDepletion: number;
    basisMarketValueDilution: number;
    fiat: string;
    address: string;
    consensusRole: string;
    

    constructor(){
    
    }

    async analyze(rewards: Map<Date, number>, 
        balances: Map<Date, number>, prices: Map<Date, number>, 
        marketCap: Map<Date, number>){
        // perform analysis and create analysis object
    }

}

export { AnalysisObject };