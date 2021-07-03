var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var {Session} = require('../Session.js');
let axios = require('axios');
const {analysis, realizeRew, saveRealize, autoAnalysis} = require("./tzdelpre.js");

router.baseURL = '/Anal';

const RealizeHistObj = require('../../model/realize.js');
const BlockchainModel = require('../../model/blockchain.js');
const User = require("../../model/User.js");

// beta auto basis price calculation
router.post('/Auto', function(req,res){
    var body = req.body;
    async.waterfall([
        async function(cb){
            try{
                rel_obj = await autoAnalysis(body["address"],body["fiat"])
                return rel_obj;
            }
            catch(error){
                return error;
            }
        },
        function(rel_obj, cb){
            if(rel_obj && rel_obj.stack && rel_obj.message){
                cb(rel_obj, null)
            }
            console.log('rel_obj')
            console.log(rel_obj)
            res.status(200).json(rel_obj);
            cb();
        }],
        function(err){
            if(err) console.log(err);
        });

})

// beta save realize function (needs proper route handling)
router.post('/Save', function(req,res){
    var body = req.body;
    async.waterfall([
        async function(cb){
            try{
                rel_obj = await saveRealize(body["conf_quantity"])
                return rel_obj;
            }
            catch(error){
                return error;
            }
        },
        function(rel_obj, cb){
            if(rel_obj && rel_obj.stack && rel_obj.message){
                cb(rel_obj, null)
            }
            console.log('rel_obj')
            console.log(rel_obj)
            res.status(200).json(rel_obj);
            cb();
        }],
        function(err){
            if(err) console.log(err);
        });
})

// beta realize function (needs proper route handling)
router.post('/Realize', function(req,res){
    var body = req.body;
    async.waterfall([
        async function(cb){
            try{
                rel_obj = await realizeRew(body["realizedQuantity"],body["setId"])
                return rel_obj;
            }
            catch(error){
                return error;
            }
        },
        function(rel_obj, cb){
            if(rel_obj && rel_obj.stack && rel_obj.message){
                cb(rel_obj, null)
            }
            console.log('rel_obj')
            console.log(rel_obj)
            res.status(200).json(rel_obj);
            cb();
        }],
        function(err){
            if(err) console.log(err);
        });
    });

router.post('/Unrel', function(req, res){
    var vld = req.validator;
    var body = req.body;
    var unrel_obj = {}
    const {address, fiat, basisDate} = body;
    console.log(address)
    console.log(fiat)
    console.log(basisDate)
    async.waterfall([
        async function(cb){
            if(vld.hasFields(body, ["address","fiat","basisDate","histObjId"]))
                try{
                    unrel_obj = await analysis(address, basisDate, fiat);
                    console.log(unrel_obj)
                    return unrel_obj;
                }
                catch (error) {
                    console.log('analysis error')
                    console.log(error)
                    return error;
                }
        },
        function(unrel_obj,cb){
            // here we check to see if our previous function returned a 
            // error in the catch block and we instantly jump to the callback
            // by passing the error in
            if(unrel_obj && unrel_obj.stack && unrel_obj.message){
                cb(unrel_obj, null)
            }
            // create new realizehistobj
            // rel_obj = new RealizeHistObj({
            //     unrealizedBasisRewards: unrel_obj.basisRewards,
            //     unrealizedBasisRewardsDep: unrel_obj.basisRewardsDep,
            //     unrealizedBasisRewardsMVdep: unrel_obj.basisRewardsMVDep,
            //     fiat: unrel_obj.fiat,
            //     address: unrel_obj.address,
            //     basisDate: unrel_obj.basisDate,
            //     basisPrice: unrel_obj.basisPrice
            // });
            console.log(body["histObjId"])
            RealizeHistObj.findOneAndUpdate({_id: body["histObjId"]}, {$set: {
                "unrealizedRewards" : unrel_obj.unrealizedRewards,
                "unrealizedBasisRewards": unrel_obj.unrealizedBasisRewards,
                "unrealizedBasisRewardsDep" : unrel_obj.unrealizedBasisRewardsDep,
                "unrealizedBasisRewardsMVDep" : unrel_obj.unrealizedBasisRewardsMVDep,
            }},{new: true}, 
            function(err, doc){
                if(err) cb(err);
                cb(null, doc);
            })
        },
        function(result, cb){ //after creating new rel db obj, 
            // add the send unrel to FE
            // console.log(result)
            // console.log('results')
            console.log(result)
            res.status(200).json(result);
            cb();
        }
        ],
        function(err){
            if(err) console.log(err);
        });
});

router.post('/Cal', function(req, res) {
    var vld = req.validator;
    var body = req.body;
    
    async.waterfall([
        async function(cb){
            if (vld.hasFields(body, ["address","fiat"]))
                prices = await getPrices(body["fiat"])
                cal_vals = await getBalances(body["address"],prices);
                res.status(200).json({cal_vals});
        }],
        function(err){
            if(err) console.log(err);
        });
});

router.post('/', function(req, res) {
    var vld = req.validator;
    var body = req.body;
    var prsId = req.session.prsId;
    
    async.waterfall([
        function(cb){
            if (vld.hasFields(body, ["address","fiat","basisDate"]))
                User.find({_id: prsId}, function(err, docs){
                    if(err) cb(err);
                    cb(null, docs)
                })
        },
        function(userInfo, cb){
            // if a dup exists send a body with 'dup check' to indicate to the
            // front end that they should prompt the user with a dialogue to manage
            // duplicates
            userInfo = userInfo[0]
            if(userInfo.setIds.length !== 0){
                res.status(200).json({'dup check':userInfo.setIds.length})
                cb(null,null);
            }
            // if no dups exist, create a new realize history object
            else{
                rel_obj = new RealizeHistObj({
                    userid: userInfo._id,
                    version: 0,
                    fiat: body["fiat"],
                    address: body["address"],
                    basisDate: body["basisDate"]
                })
                rel_obj.save(function(err, doc){
                    if(err) cb(err);
                    cb(null,doc);
                })
            }
        },
        function(rel_doc, cb){
            // associate the new realize history obj with the user
            if(rel_doc){
                User.findOneAndUpdate({_id: prsId}, {$addToSet: {"setIds": rel_doc._id}}, 
                    function(err, doc){
                        if(err) cb(err);
                        cb(null, rel_doc._id);
                })
            }
        },
        function(doc, cb){
            res.location(router.baseURL + '/' + doc).end();
            cb();
        }],
        function(err){
            if(err) console.log(err);
        });
});

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function getBalances(address, price) {
    let balances = {};
    //offset from index
    let offset = 0;
    let resp_lens = 10000
    while(resp_lens===10000){
        let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
        const response = await axios.get(url);
        resp_lens = response.data.length
        offset += response.data.length  // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query 
        // api returns only changes
        // for each date, check date ahead and fill all dates upto that date
        for (let i = 0; i < response.data.length-1; i++) {
            const element = response.data[i];
            //make this into normal date
            var d1 = element.timestamp.substring(0,10)
            var d2 = response.data[i+1].timestamp.substring(0,10)

            if (d1===d2){
                balances[d1] = element.balance;
            }
            else{        
                d1 = new Date(d1);
                d2 = new Date(d2);
                date_itr = d1
                while (date_itr < d2) {
                    date_key = date_itr.toISOString().slice(0, 10);
                    balances[date_key] = {'balance': response.data[i].balance, 'price': price[date_key]}
                    date_itr = date_itr.addDays(1);
                };
            }
        }
    }
    return balances
}

async function getPrices(fiat){
    let price = `price${fiat}`
    let marketCap = `marketCap${fiat}`
    // console.log(price, marketCap)
    let priceAndMarketCapData = await BlockchainModel.find()
    let finalData = {}
    for(i=0; i < priceAndMarketCapData.length; i++){
        let date = priceAndMarketCapData[i].date
        //why cant identifier at end be var?
        let priceN = priceAndMarketCapData[i][price]
        let marketCapN = priceAndMarketCapData[i][marketCap]
        date_iso_str = date.toISOString().slice(0, 10)
        finalData[date_iso_str] = priceN
    }
    return finalData 
}

module.exports = router;
