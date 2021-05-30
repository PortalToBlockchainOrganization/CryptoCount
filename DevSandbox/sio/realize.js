//write function to realize unrealized accounting entries

//use the inputted interal id to match with db schema and mod the schema with new sets

//apply this function in dialogue in app.js and client/main.js
/*

            //QUANTITY REALIZED 

            //FIFO LIFO OPITMIZED




           // tzdelanalysis through:

           get rewards:
            https://api.tzkt.io/v1/rewards/delegators/${address}
            del: tz1cgrzpsB43pBppH6mJzrHnFqxU8RUce991
            https://api.tzkt.io/v1/rewards/delegators/tz1cgrzpsB43pBppH6mJzrHnFqxU8RUce991
            for payload
                if baker.address == address[i-1] 
                    move on
                else 
                    address[i] = baker.address 
                    cyclechange[i] = data.cycle



            baker -> tz1VQnqCCqX4K5sP3FNkVSNKTdCAMJDd3E1n
            iterate for each baker change and for each cycle 
            https://api.baking-bad.org/v2/rewards/tz1VQnqCCqX4K5sP3FNkVSNKTdCAMJDd3E1n?cycle=323
                for.each -> .match(${delAddress}) 

                reward[i] = data.amount


            get balances:
            https://api.tzkt.io/v1/accounts/tz1cgrzpsB43pBppH6mJzrHnFqxU8RUce991/balance_history
                return {d: balance}



            analysis:
            basisRewardsUnrealizedSet[i] = rewards[d] * basis price 

            depletion[i] = bookvalue[d] -> (basis price * balance) + (1 - totalSupplys[d - 1] / totalSupplys[d])

            mvdilution[i] = -(marketCaps[d] / marketCaps[d - 1] - prices[d] / prices[d - 1]) * bookvalue[d]

            depUnrealizedSet[i] = basisRewards[i] + depletion[i]

            mvdUnrealizedSet[i] = basisRewards[i] + mvdilutoin[i]


            then a new route to do this continuosly in the background to update users accounting sets
*/
