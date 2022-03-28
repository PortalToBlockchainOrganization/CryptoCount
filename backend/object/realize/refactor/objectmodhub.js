realizing 

    passes date 1 date 2 // from date domain selection by user


    get the Object


    pass to realizingRewards()
        return object

        
    assets for time date domain 
            assets filter by date domain


    object recompilation
                    unrealized set after all rewards in domain realizing:
                [{unrealrewardBasisVal: y, cycle: x, date: z}],
                [{unrealrewFMV: y, cycle: x, date: z}],
                [{unrealrewFMVdep: y, cycle: x, date: z}],
                [{unrealrewFMVmvDep: y, cycle: x, date: z}],
                [{unrealrewardQ: y, cycle: x, date: z}],

                realizing reward set
                [{realrewardBasisVal: y, cycle: x, date: z}],
                [{realrewFMV: y, cycle: x, date: z}],
                [{realrewFMVdep: y, cycle: x, date: z}],
                [{realrewFMVmvDep: y, cycle: x, date: z}],
                [{realrewardQ: y, cycle: x, date: z}],


                positive transaction array for the date domain 
                [{+tranQ: y, date (within t):x}],

                negative tran array with all negative tran values
                [{-tranQ: y, date (all time): x}], - begin in table with the date domain values but the user can scroll beyond the date domain 

                asset history
                {assetID: string, from: x, until: y, basisCost: price[d] * -tranQ, saleValue: price[d] * +tranqQ},


cap gains 

    passes inputs outputs  // from user who has done the mapping expereience 

    cap gains of i and os process 

            prices n doing

            {{input: x, date: y}, {output: realizingMHbasisQuantity, date: x}, capitalGains: z}
            {{input: x, date: y}, {output: x, date: y}, capitalGains: z}
            {{input: aggRewQInDomain, date1: x, date2: y}, {output: y, date:x}}, capitalGains: z}