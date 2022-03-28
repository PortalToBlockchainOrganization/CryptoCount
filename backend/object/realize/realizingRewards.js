realizing of rewards //refactor for domain

                        var qSell = realizedQuantity

                        //get the realizehistoryobject from the db
                        let foundRealizeHistory = await RealizeSet.findOne({ _id: setId });


                        let basisPrice = foundRealizeHistory.basisPrice;

                        let unrealrewards = foundRealizeHistory.unrealizedRewards;
                        unrealizedBasisRewards = foundRealizeHistory.unrealizedBasisRewards;
                        unrealizedBasisRewardsDep = foundRealizeHistory.unrealizedBasisRewardsDep;
                        unrealizedBasisRewardsMVDep =
                            foundRealizeHistory.unrealizedBasisRewardsMVDep;
                        // console.log(unrealizedBasisRewardsMVDep.length)

                        //making realizing set
                        realizingRewardQ = [];
                        realzingRewardBasis = [];
                        realzingRewardBasisDep = [];
                        realzingRewardBasisMVDep = [];

                        let iter1length = unrealrewards.length;

                        //REWARDS BUCKET
                        for (i = 0; i < iter1length; i++) {
                            //quantity of unrealized rewward
                            let currentQuantity = unrealrewards[i].rewardQuantity;
                            //CONDITION 1, if the rewards is less than the realizing q
                            if (currentQuantity < realizedQuantity) {
                                let realizingObj = unrealrewards[i];
                                realizingRewardQ.push(realizingObj);
                                let realizingObj2 = unrealizedBasisRewards[i];
                                realzingRewardBasis.push(realizingObj2);
                                let realizingObj3 = unrealizedBasisRewardsDep[i];
                                realzingRewardBasisDep.push(realizingObj3);
                                let realizingObj4 = unrealizedBasisRewardsMVDep[i];
                                realzingRewardBasisMVDep.push(realizingObj4);
                                realizedQuantity = realizedQuantity - currentQuantity;
                            }
                        }

                        for (i = 0; i < realizingRewardQ.length; i++) {
                            unrealrewards.shift();
                            unrealizedBasisRewards.shift();
                            unrealizedBasisRewardsDep.shift();
                            unrealizedBasisRewardsMVDep.shift();
                        }

                        let iter2length = unrealrewards.length;

                        for (i = 0; i < iter2length; i++) {
                            try{
                                //CONDITION 2, if realizng q is greater than realized q and thats not zero
                                //unreal rewards has been shifted back so all index must be lowered 1
                                //technically i would need to recalculate the depletion to make this perfect using bv? or by scaling with proportions of proportions
                                let q = unrealrewards[i].rewardQuantity;

                                if (q > realizedQuantity && realizedQuantity != 0) {
                                    //ADD TO REALIZING
                                    newrealizngObj = {
                                        date: unrealrewards[0].date,
                                        rewardQuantity: realizedQuantity,
                                    };
                                    realizingRewardQ.push(newrealizngObj);

                                    newrealizngObj = {
                                        date: unrealizedBasisRewards[0].date,
                                        basisReward: realizedQuantity * basisPrice,
                                    };
                                    realzingRewardBasis.push(newrealizngObj);

                                    //dep = unrealizedBasisRewardsDep[0].rewBasisDepletion - (unrealrewards[0].rewardQuantity * basisPrice)
                                    newrealizngObj = {
                                        date: unrealizedBasisRewardsDep[0].date,
                                        rewBasisDepletion: realizedQuantity * basisPrice, //+ dep
                                    };
                                    realzingRewardBasisDep.push(newrealizngObj);

                                    //dep = unrealizedBasisRewardsMVDep[0].rewBasisMVDepletion - (unrealrewards[0].rewardQuantity * basisPrice)
                                    newrealizngObj = {
                                        date: unrealizedBasisRewardsMVDep[0].date,
                                        rewBasisMVDepletion: realizedQuantity * basisPrice, //+ dep
                                    };
                                    realzingRewardBasisMVDep.push(newrealizngObj);

                                    //MOD UNREAL
                                    unrealObj = {
                                        date: unrealrewards[0].date,
                                        rewardQuantity:
                                            unrealrewards[0].rewardQuantity - realizedQuantity,
                                    };
                                    unrealrewards.shift();
                                    unrealrewards.unshift(unrealObj);

                                    unrealObj = {
                                        date: unrealizedBasisRewards[0].date,
                                        basisReward:
                                            unrealizedBasisRewards[0].basisReward -
                                            realizedQuantity * basisPrice,
                                    };
                                    unrealizedBasisRewards.shift();
                                    unrealizedBasisRewards.unshift(unrealObj);

                                    //dep = unrealrewards[i-1].q * basisPrice - unrealizedBasisRewardsDep[i-1].rewBasisDepletion
                                    unrealObj = {
                                        date: unrealizedBasisRewardsDep[0].date,
                                        rewBasisDepletion:
                                            unrealizedBasisRewardsDep[0].rewBasisDepletion -
                                            realizedQuantity * basisPrice, // + dep
                                    };
                                    unrealizedBasisRewardsDep.shift();
                                    unrealizedBasisRewardsDep.unshift(unrealObj);
                                    //dep = unrealizedBasisRewardsMVDep[i-1].rewBasisMVDepletion - (unrealrewards[i-1].q * basisPrice)
                                    unrealObj = {
                                        date: unrealizedBasisRewardsMVDep[0].date,
                                        rewBasisMVDepletion:
                                            unrealizedBasisRewardsMVDep[0].rewBasisMVDepletion -
                                            realizedQuantity * basisPrice, // + dep
                                    };
                                    unrealizedBasisRewardsMVDep.shift();
                                    unrealizedBasisRewardsMVDep.unshift(unrealObj);

                                    //end reward realzing
                                    break;
                                }
                            } catch(e){
                                break
                                }
                            
                            }

                        //re aggregate
                        let realizingRewardAgg = 0;
                        let realizingBasisAgg = 0;
                        let realizingDepAgg = 0;
                        let realizingMVdAgg = 0;
                        for (i = 0; i < realizingRewardQ.length; i++) {
                            try{
                                realizingRewardAgg += realizingRewardQ[i].rewardQuantity;
                                realizingBasisAgg += realzingRewardBasis[i].basisReward;
                                realizingDepAgg += realzingRewardBasisDep[i].rewBasisDepletion;
                                realizingMVdAgg += realzingRewardBasisMVDep[i].rewBasisMVDepletion;
                            }
                            catch(e){
                                break
                            }
                        }

                            //re aggregate
                            let unrealizedRewardAgg = 0;
                            let unrealizedBasisAgg = 0;
                            let unrealizedDepAgg = 0;
                            let unrealizedMVDAgg = 0;
                            for (i = 0; i < unrealrewards.length; i++) {
                                try{
                                    unrealizedRewardAgg += unrealrewards[i].rewardQuantity;
                                    unrealizedBasisAgg += unrealizedBasisRewards[i].basisReward;
                                    unrealizedDepAgg += unrealizedBasisRewardsDep[i].rewBasisDepletion;
                                    unrealizedMVDAgg += unrealizedBasisRewardsMVDep[i].rewBasisMVDepletion;
                                }
                            
                                catch(e){
                                    break
                                }
                            }


                            return all the values should be 
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