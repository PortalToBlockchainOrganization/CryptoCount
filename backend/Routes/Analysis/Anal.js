var Express = require("express");
var Tags = require("../Validator.js").Tags;
var router = Express.Router({ caseSensitive: true });
var async = require("async");
var { Session } = require("../Session.js");
let axios = require("axios");
const {
	analysis,
	realizeRew,
	saveRealize,
	autoAnalysis,
} = require("./tzdelpre.js");
const {updateSet} = require("./setUpdater.js")

router.baseURL = "/Anal";

const RealizeHistObj = require("../../model/realize.js");
const BlockchainModel = require("../../model/blockchain.js");
const User = require("../../model/User.js");

// given a set id to delete check if user is assoc to it then remove it from db
router.delete("/:setId", function(req,res) {
    var setId = req.params.setId
    var ssn = req.session;
    async.waterfall(
        [
            function(cb){
                // pull user's set ids and confirm the requested set is present
                User.find({_id: ssn.prsId}, function(err, docs){
                    if(err) cb(err);
                    cb(null, docs[0].setIds)
                })
            },
            function(setIds, cb){
                if(setIds.includes(setId)){
                    // delete the set from the realize database
                    RealizeHistObj.deleteOne({_id: setId}, function(err, docs){
                        if (err) cb(err);
                        cb(null, docs)
                    })
                }
                else{
                    // return a 404 with the error set to set not found
                    res.status(404).json({error: 'Set Not Found'})
                    cb('Set Not Found')
                }
            },
            function(docs, cb){
                // delete the set from the users set ids
                User.findOneAndUpdate(
                    {_id: ssn.prsId}, 
                    {$pull: { setIds: setId}},
                    function (err, doc) {
                        if (err) cb(err);
                        cb(null, doc);
                    });
            },
            function(doc, cb){
                res.status(200).json(doc[0])
                cb()
            }],
            function(err){
                if(err) console.log(err);
            }
    );
});

// given obj id - get obj (BETA)
router.get("/:objId", function (req, res) {
	objId = req.params.objId;
	console.log(objId);
	async.waterfall(
		[
			function (cb) {
				RealizeHistObj.findOne({ _id: objId }, function (err, doc) {
					if (err) cb(err);
					cb(null, doc);
				});
            },
            async function(set){
                // check if date of the set is older than 2 days
                var twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                var lastModifiedDate = set.updatedAt
                if (lastModifiedDate < twoDaysAgo){
                    try{
                       var updatedSet = await updateSet(set)
                       return updatedSet
                    }
                    catch(error){
                        return error;
                    }
                }
                else{
                    return set
                }
            },
            function(unrel_obj, cb){
                RealizeHistObj.findOneAndUpdate({_id: objId}, {$set: {
                    unrealizedRewards: unrel_obj.unrealizedRewards,
                    unrealizedBasisRewards: unrel_obj.unrealizedBasisRewards,
                    unrealizedBasisRewardsDep:
                        unrel_obj.unrealizedBasisRewardsDep,
                    unrealizedBasisRewardsMVDep:
                        unrel_obj.unrealizedBasisRewardsMVDep,
                    unrealXTZBasis: unrel_obj.xtzBasis,
                    unrealBasisP: unrel_obj.basisP,
                    unrealBasisDep: unrel_obj.basisDep,
                    unrealBasisMVDep: unrel_obj.basisMVdep,
                    basisPrice: unrel_obj.basisPrice,
                    unrealizedRewardAgg: unrel_obj.unrealizedRewardAgg,
                    unrealizedBasisAgg: unrel_obj.unrealizedBasisAgg,
                    unrealizedDepAgg: unrel_obj.unrealizedDepAgg,
                    unrealizedMVDAgg: unrel_obj.unrealizedMVDAgg,
                }}, {new: true}, (err, doc) => {
					if (err) cb(err);
					cb(null, doc);                
                });
            },
			function (set, cb) {
				res.status(200).json(set);
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

// for history page - get all users objs (BETA)
router.get("/", function (req, res) {
	user_id = req.session.prsId;
	async.waterfall(
		[
			function (cb) {
                console.log('getting all user sets')
                console.log(user_id)
				RealizeHistObj.find({ userid: user_id }, function (err, doc) {
					if (err) cb(err);
					cb(null, doc);
				});
			},
			function (sets, cb) {
				res.status(200).json(sets);
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

// beta auto basis price calculation
router.post("/Noauth/Auto", function (req, res) {
	var vld = req.validator;
	var body = req.body;
	var unrel_obj = {};
	const { address, fiat } = body;
	console.log(address);
	console.log(fiat);
	async.waterfall(
		[
			async function (cb) {
                if (vld.hasFields(body, ["address", "fiat"])){
                    try{
                        let url = `https://api.tzkt.io/v1/delegates/${address}`;
                        let response = await axios.get(url);
                        return response
                    } catch(error){
                        return error
                    }
                }
            },
            async function(address_check){
                try {
                    if (address_check.isAxiosError) {
                        throw new Error('Bad Address')
                    }
                    unrel_obj = await autoAnalysis(address, fiat);
                    return unrel_obj;
                } catch (error) {
                    return error;
                }
            },
			function (unrel_obj, cb) {
				// here we check to see if our previous function returned a
				// error in the catch block and we instantly jump to the callback
                // by passing the error in
                console.log('unrel_obj - post auto', unrel_obj)
				if (unrel_obj && unrel_obj.stack && unrel_obj.message) {
					cb(unrel_obj, null);
                }
                else{
                    rel_obj = new RealizeHistObj({
                        userid: "NOAUTH",
                        version: 0,
                        fiat: body["fiat"],
                        address: body["address"],
                        basisDate: body["basisDate"],
                        unrealizedRewards: unrel_obj.unrealizedRewards,
                        unrealizedBasisRewards: unrel_obj.unrealizedBasisRewards,
                        unrealizedBasisRewardsDep:
                            unrel_obj.unrealizedBasisRewardsDep,
                        unrealizedBasisRewardsMVDep:
                            unrel_obj.unrealizedBasisRewardsMVDep,
                        unrealXTZBasis: unrel_obj.xtzBasis,
                        unrealBasisP: unrel_obj.basisP,
                        unrealBasisDep: unrel_obj.basisDep,
                        unrealBasisMVDep: unrel_obj.basisMVdep,
                        basisPrice: unrel_obj.basisPrice,
                        unrealizedRewardAgg: unrel_obj.unrealizedRewardAgg,
                        unrealizedBasisAgg: unrel_obj.unrealizedBasisAgg,
                        unrealizedDepAgg: unrel_obj.unrealizedDepAgg,
                        unrealizedMVDAgg: unrel_obj.unrealizedMVDAgg,
                    });
                    rel_obj.save(function (err, doc) {
                        if (err) cb(err);
                        cb(null, doc);
                    });
                }
            },
            // add set to user sets 
			function (result, cb) {
				//after creating new rel db obj,
				// add the send unrel to FE
				// console.log(result)
				// console.log('results')
				console.log(result);
				res.status(200).json(result);
				cb();
			},
		],
		function (err) {
			if (err){
                res.status(400).json([{tag: 'badAddress'}])
            } 
                
		}
	);
});

// beta auto basis price calculation
router.post("/Auto", function (req, res) {
	var vld = req.validator;
	var body = req.body;
	var unrel_obj = {};
	const { address, fiat } = body;
	console.log(address);
	console.log(fiat);
	var prsId = req.session.prsId;
	async.waterfall(
		[
			async function (cb) {
                if (vld.hasFields(body, ["address", "fiat"])){
                    try{
                        let url = `https://api.tzkt.io/v1/delegates/${address}`;
                        let response = await axios.get(url);
                        return response
                    } catch(error){
                        return error
                    }
                }
            },
            async function(address_check){
                try {
                    if (address_check.isAxiosError) {
                        throw new Error('Bad Address')
                    }
                    unrel_obj = await autoAnalysis(address, fiat);
                    return unrel_obj;
                } catch (error) {
                    return error;
                }
            },
			function (unrel_obj, cb) {
				// here we check to see if our previous function returned a
				// error in the catch block and we instantly jump to the callback
                // by passing the error in
                console.log('unrel_obj - post auto', unrel_obj)
				if (unrel_obj && unrel_obj.stack && unrel_obj.message) {
					cb(unrel_obj, null);
                }
                else{
                    rel_obj = new RealizeHistObj({
                        userid: prsId,
                        version: 0,
                        fiat: body["fiat"],
                        address: body["address"],
                        basisDate: body["basisDate"],
                        unrealizedRewards: unrel_obj.unrealizedRewards,
                        unrealizedBasisRewards: unrel_obj.unrealizedBasisRewards,
                        unrealizedBasisRewardsDep:
                            unrel_obj.unrealizedBasisRewardsDep,
                        unrealizedBasisRewardsMVDep:
                            unrel_obj.unrealizedBasisRewardsMVDep,
                        unrealXTZBasis: unrel_obj.xtzBasis,
                        unrealBasisP: unrel_obj.basisP,
                        unrealBasisDep: unrel_obj.basisDep,
                        unrealBasisMVDep: unrel_obj.basisMVdep,
                        basisPrice: unrel_obj.basisPrice,
                        unrealizedRewardAgg: unrel_obj.unrealizedRewardAgg,
                        unrealizedBasisAgg: unrel_obj.unrealizedBasisAgg,
                        unrealizedDepAgg: unrel_obj.unrealizedDepAgg,
                        unrealizedMVDAgg: unrel_obj.unrealizedMVDAgg,
                    });
                    rel_obj.save(function (err, doc) {
                        if (err) cb(err);
                        cb(null, doc);
                    });
                }
            },
            function (rel_doc, cb) {
				// associate the new realize history obj with the user
				if (rel_doc) {
					User.findOneAndUpdate(
						{ _id: prsId },
						{ $addToSet: { setIds: rel_doc._id } },
						function (err, doc) {
                            if (err) cb(err);
							cb(null, rel_doc);
						}
					);
				}
			},
            // add set to user sets 
			function (result, cb) {
				//after creating new rel db obj,
				// add the send unrel to FE
				// console.log(result)
				// console.log('results')
				console.log(result);
				res.status(200).json(result);
				cb();
			},
		],
		function (err) {
			if (err){
                res.status(400).json([{tag: 'badAddress'}])
            } 
                
		}
	);
});

// beta save realize function (needs proper route handling)
router.post("/Save", function (req, res) {
	var body = req.body;
	var ssn = req.session;
	var ssn_real = ssn.realizing;
	var updated_payload = {};
	async.waterfall(
		[
			// get realhistobj
			function (cb) {
				RealizeHistObj.find(
					{
						_id: body.setId,
					},
					function (err, docs) {
						if (err) cb(err);
						cb(null, docs);
					}
				);
			},
			function (realObj, cb) {
				// probably should add check to make sure realizing object equals
				// the session realizing object
                realObj = realObj[0];
                console.log('unrealiedRewards', ssn_real.unrealizedRewards)
                console.log('realizingRewards', ssn_real.realizingRewards)
				if (
					!(
						realObj.realizedRewards &&
						realObj.realizedRewards.length !== 0
					)
				) {
					// create new realized lists/value
					realizedRewardAgg = ssn_real.realizingRewardAgg;
					realizedDepAgg = ssn_real.realizingDepAgg;
					realizedMVDAgg = ssn_real.realizingMVDAgg;
					realizedXTZbasis = ssn_real.realizingXTZbasis;
					realizedBasisP = ssn_real.realizingBasisP;
					realizedBasisDep = ssn_real.realizingBasisDep;
					realizedBasisMVDep = ssn_real.realizingBasisMVDep;
					realizedRewards = ssn_real.realizingRewards;
					realizedBasisRewards = ssn_real.realizingRewardBasis;
					realizedBasisRewardsDep = ssn_real.realizingRewardBasisDep;
					realizedBasisRewardsMVDep = ssn_real.realizingRewardBasisMVDep;
					unrealizedRewards = ssn_real.unrealizedRewards;
					//unrealizedRewardAgg =  ssn_real.unrealizedRewardAgg;
					//unrealizedBasisAgg = ssn_real.unrealizedBasisAgg;
					//unrealizedDepAgg = ssn_real.unrealizedDepAgg;
					//unrealizedMVDAgg = ssn_real.unrealizedMVDAgg;
					//unrealizedXTZBasis: ssn_real.unrealizedXTZBasis,
					//unrealizedBasisP: ssn_real.unrealizedBasisP,
					//unrealizedBasisDep: ssn_real.unrealizedBasisDep,
					//unrealizedBasisMVDep: ssn_real.unrealizedBasisMVDep,
					unrealizedBasisRewards = ssn_real.unrealizedBasisRewards;
					unrealizedBasisRewardsDep = ssn_real.unrealizedBasisRewardsDep;
					unrealizedBasisRewardsMVDep = ssn_real.unrealizedBasisRewardsMVDep;
					
				} else {
                    // add and extend existing realized lists/values
                    unrealizedRewards = ssn_real.unrealizedRewards;
                    unrealizedBasisRewards = ssn_real.unrealizedBasisRewards;
					unrealizedBasisRewardsDep = ssn_real.unrealizedBasisRewardsDep;
					unrealizedBasisRewardsMVDep = ssn_real.unrealizedBasisRewardsMVDep;
					realizedRewardAgg =
						realObj.realizedRewardAgg + ssn_real.realizingRewardAgg;
					realizedDepAgg =
						realObj.realizedDepAgg + ssn_real.realizingDepAgg;
					realizedMVDAgg =
						realObj.realizedMVDAgg + ssn_real.realizingMVDAgg;
					realizedXTZbasis =
						realObj.realizedXTZbasis + ssn_real.realizingXTZbasis;
					realizedBasisP =
						realObj.realizedBasisP + ssn_real.realizingBasisP;
					realizedBasisDep =
						realObj.realizedBasisDep + ssn_real.realizingBasisDep;
					realizedBasisMVDep =
						realObj.realizedBasisMVDep +
						ssn_real.realizingBasisMVDep;
					realizedRewards = realObj.realizedRewards.concat(
						ssn_real.realizingRewards
					);
					realizedBasisRewards = realObj.realizedBasisRewards.concat(
						ssn_real.realizingRewardBasis
					);
					realizedBasisRewardsDep =
						realObj.realizedBasisRewardsDep.concat(
							ssn_real.realizingRewardBasisDep
						);
					realizedBasisRewardsMVDep =
						realObj.realizedBasisRewardsMVDep.concat(
							ssn_real.realizingRewardBasisMVDep
						);
				}

				
				// find obj and update unrealized values
				RealizeHistObj.findOneAndUpdate(
					{
						_id: body.setId,
					},
					{
						$set: {
							unrealizedRewardAgg: ssn_real.unrealizedRewardAgg,
							unrealizedBasisAgg: ssn_real.unrealizedBasisAgg,
							unrealizedDepAgg: ssn_real.unrealizedDepAgg,
							unrealizedMVDAgg: ssn_real.unrealizedMVDAgg,
							unrealizedXTZBasis: ssn_real.unrealizedXTZBasis,
							unrealizedBasisP: ssn_real.unrealizedBasisP,
							unrealizedBasisDep: ssn_real.unrealizedBasisDep,
							unrealizedBasisMVDep: ssn_real.unrealizedBasisMVDep,
							unrealizedBasisRewards: ssn_real.unrealizedBasisRewards,
							unrealizedBasisRewardsDep: ssn_real.unrealizedBasisRewardsDep,
							unrealizedBasisRewardsMVDep: ssn_real.unrealizedBasisRewardsMVDep,
							unrealizedRewards: ssn_real.unrealizedRewards,
							realizedRewardAgg: realizedRewardAgg,
							realizedDepAgg: realizedDepAgg,
							realizedMVDAgg: realizedMVDAgg,
							realizedXTZbasis: realizedXTZbasis,
							realizedBasisP: realizedBasisP,
							realizedBasisDep: realizedBasisDep,
							realizedBasisMVDep: realizedBasisMVDep,
							realizedRewards: realizedRewards,
							realizedBasisRewards: realizedBasisRewards,
							realizedBasisRewardsDep: realizedBasisRewardsDep,
							realizedBasisRewardsMVDep:
								realizedBasisRewardsMVDep,
						},
					},
					{
						new: true,
					},
					function (err, doc) {
                        if (err) cb(err);
                        else{
                            console.log(doc)
                            cb(null, doc);
                        }
					}
				);
			},
			function (real_obj, cb) {
				// clear session realize_value
				ssn.realizing = {};
				// send realObj to front end
				res.status(200).json(real_obj);
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

router.post("/Noauth/Realize", function (req, res) {
	var body = req.body;
	async.waterfall(
		[
			async function (cb) {
				try {
					rel_obj = await realizeRew(
						body["realizedQuantity"],
						body["setId"]
					);

					return rel_obj;
				} catch (error) {
					return error;
				}
			},
			function (rel_obj, cb) {
				if (rel_obj && rel_obj.stack && rel_obj.message) {
					cb(rel_obj, null);
				}
				rel_obj['email'] = "N/A"
				rel_obj['firstName'] = "N/A"
				rel_obj['lastName'] = "N/A"
				res.status(200).json(rel_obj);
				cb();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

// beta realize function (needs proper route handling)
router.post("/Realize", function (req, res) {
	var body = req.body;
	var ssn = req.session;
	async.waterfall(
		[
			async function (cb) {
				try {
					rel_obj = await realizeRew(
						body["realizedQuantity"],
						body["setId"]
					);

					return rel_obj;
				} catch (error) {
					return error;
				}
			},
			function (rel_obj, cb) {
				if (rel_obj && rel_obj.stack && rel_obj.message) {
					cb(rel_obj, null);
				}
				// ssn.realizing = { // save information on a session level
				//     "realizingRewards": rel_obj["realizingRewards"],
				//     "realizingBasisRewards": rel_obj["realizingRewardBasis"],
				//     "realizingBasisRewardsDep": rel_obj["realizingRewardBasisDep"],
				//     "realizingBasisRewardsMVDep": rel_obj["realizingRewardBasisMVDep"],
				//     "realizingRewardAgg": rel_obj["realizingRewardAgg"],
				//     "realizingBasisAgg": rel_obj["realizingBasisAgg"],
				//     "realizingDepAgg": rel_obj["realizingDepAgg"],
				//     "realizingMVDepAgg": rel_obj["realizingMVdAgg"],
				//     "realizingXTZBasis": rel_obj["realizingXTZbasis"],
				//     "realizingBasisP": rel_obj["realizingBasisP"],
				//     "realizingBasisDep": rel_obj["realizingBasisDep"],
				//     "realizingBasisMVDep": rel_obj["realizingBasisMVdep"]
				// }
				ssn.realizing = rel_obj;
				rel_obj['email'] = ssn.email 
				rel_obj['firstName'] = ssn.firstName
				rel_obj['lastName'] = ssn.lastName
				res.status(200).json(rel_obj);
				cb();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

router.post("/Unrel", function (req, res) {
	var vld = req.validator;
	var body = req.body;
	var unrel_obj = {};
	const { address, fiat, basisDate } = body;
	var prsId = req.session.prsId;

	console.log(address);
	console.log(fiat);
	console.log(basisDate);
	async.waterfall(
		[
			async function (cb) {
				if (
					vld.hasFields(body, [
						"address",
						"fiat",
						"basisDate",
						"histObjId",
					])
				)
					try {
						unrel_obj = await analysis(address, basisDate, fiat);
						return unrel_obj;
					} catch (error) {
						console.log("analysis error");
						console.log(error);
						return error;
					}
			},
			function (unrel_obj, cb) {
				// here we check to see if our previous function returned a
				// error in the catch block and we instantly jump to the callback
				// by passing the error in
				if (unrel_obj && unrel_obj.stack && unrel_obj.message) {
					cb(unrel_obj, null);
				}
				RealizeHistObj.findOneAndUpdate(
					{ _id: body["histObjId"] },
					{
						$set: {
							userid: prsId,
							version: 0,
							fiat: body["fiat"],
							address: body["address"],
							basisDate: body["basisDate"],
							unrealizedRewards: unrel_obj.unrealizedRewards,
							unrealizedBasisRewards:
								unrel_obj.unrealizedBasisRewards,
							unrealizedBasisRewardsDep:
								unrel_obj.unrealizedBasisRewardsDep,
							unrealizedBasisRewardsMVDep:
								unrel_obj.unrealizedBasisRewardsMVDep,
							unrealXTZBasis: unrel_obj.xtzBasis,
							unrealBasisP: unrel_obj.basisP,
							unrealBasisDep: unrel_obj.basisDep,
							unrealBasisMVDep: unrel_obj.basisMVdep,
							basisPrice: unrel_obj.basisPrice,
							unrealizedRewardAgg: unrel_obj.unrealizedRewardAgg,
							unrealizedBasisAgg: unrel_obj.unrealizedBasisAgg,
							unrealizedDepAgg: unrel_obj.unrealizedDepAgg,
							unrealizedMVDAgg: unrel_obj.unrealizedMVDAgg,
						},
					},
					{ new: true },
					function (err, doc) {
						if (err) cb(err);
						cb(null, doc);
					}
				);
			},
			function (result, cb) {
				//after creating new rel db obj,
				// add the send unrel to FE
				// console.log(result)
				// console.log('results')
				console.log(result);
				res.status(200).json(result);
				cb();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

router.post("/Cal", function (req, res) {
	var vld = req.validator;
	var body = req.body;

	async.waterfall(
		[
			async function (cb) {
				if (vld.hasFields(body, ["address", "fiat"]))
					prices = await getPrices(body["fiat"]);
				cal_vals = await getBalances(body["address"], prices);
				res.status(200).json({ cal_vals });
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

router.post("/", function (req, res) {
	var vld = req.validator;
	var body = req.body;
	var prsId = req.session.prsId;

	async.waterfall(
		[
			function (cb) {
				// given
				if (vld.hasFields(body, ["address", "fiat", "basisDate"]))
					RealizeHistObj.find(
						{
							fiat: body["fiat"],
							address: body["address"],
							basisDate: body["basisDate"],
							userid: prsId,
						},
						function (err, docs) {
							if (err) cb(err);
							cb(null, docs);
						}
					);
			},
			function (setCheck, cb) {
				// if a dup exists send a body with 'dup check' to indicate to the
				// front end that they should prompt the user with a dialogue to manage
				// duplicates
				if (setCheck.length !== 0) {
					res.status(200).json({
						"dup check": setCheck.length,
						"dup of": setCheck[0]._id,
					});
					cb(null, null);
				}
				// if no dups exist, create a new realize history object
				else {
					rel_obj = new RealizeHistObj({
						userid: prsId,
						version: 0,
						fiat: body["fiat"],
						address: body["address"],
						basisDate: body["basisDate"],
					});
					rel_obj.save(function (err, doc) {
						if (err) cb(err);
						cb(null, doc);
					});
				}
			},
			function (rel_doc, cb) {
				// associate the new realize history obj with the user
				if (rel_doc) {
					User.findOneAndUpdate(
						{ _id: prsId },
						{ $addToSet: { setIds: rel_doc._id } },
						function (err, doc) {
                            if (err) cb(err);
                            else{
                                console.log("THIS IS IT")
                                console.log(doc)
                            }
							cb(null, rel_doc._id);
						}
					);
				}
			},
			function (doc, cb) {
				res.json({ setId: doc });
				cb();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

async function getBalances(address, price) {
	let balances = {};
	//offset from index
	let offset = 0;
	let resp_lens = 10000;
	while (resp_lens === 10000) {
		let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
		const response = await axios.get(url);
		resp_lens = response.data.length;
		offset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
		// api returns only changes
		// for each date, check date ahead and fill all dates upto that date
		for (let i = 0; i < response.data.length - 1; i++) {
			const element = response.data[i];
			//make this into normal date
			var d1 = element.timestamp.substring(0, 10);
			var d2 = response.data[i + 1].timestamp.substring(0, 10);

			if (d1 === d2) {
				balances[d1] = element.balance;
			} else {
				d1 = new Date(d1);
				d2 = new Date(d2);
				date_itr = d1;
				while (date_itr < d2) {
					date_key = date_itr.toISOString().slice(0, 10);
					balances[date_key] = {
						balance: response.data[i].balance,
						price: price[date_key],
					};
					date_itr = date_itr.addDays(1);
				}
			}
		}
	}
	return balances;
}

async function getPrices(fiat) {
	let price = `price${fiat}`;
	let marketCap = `marketCap${fiat}`;
	// console.log(price, marketCap)
	let priceAndMarketCapData = await BlockchainModel.find();
	let finalData = {};
	for (i = 0; i < priceAndMarketCapData.length; i++) {
		let date = priceAndMarketCapData[i].date;
		// convert year month day to month day year
		var date_arr1 = date.toString().split("-");
		var date_arr2 = [date_arr1[1], date_arr1[2], date_arr1[0]];
		date = date_arr2.join("-");

		let priceN = priceAndMarketCapData[i][price];
		let marketCapN = priceAndMarketCapData[i][marketCap];
		finalData[date] = priceN;
	}
	return finalData;
}

module.exports = router;
