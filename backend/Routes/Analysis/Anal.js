var Express = require("express");
var Tags = require("../Validator.js").Tags;
var router = Express.Router({ caseSensitive: true });
var async = require("async");
var { Session } = require("../Session.js");
let axios = require("axios");

router.baseURL = "/Anal";

const BlockchainModel = require("../../model/blockchain.js");
const User = require("../../model/User.js");

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
				if (vld.hasFields(body, ["address", "fiat", "basisDate"]))
					User.find({ _id: prsId }, function (err, docs) {
						if (err) cb(err);
						cb(null, docs);
					});
			},
			function (userInfo, cb) {
				// create a new copy and add the address to the users
				// address list/obj
				let oldAddresses = userInfo[0]["addresses"];
				oldAddresses[body["address"]] = {
					fiat: body["fiat"],
					basisDate: body["basisDate"],
				};
				let userCopy = { ...userInfo[0] }._doc;
				userCopy.addresses = oldAddresses;
				User.findOneAndUpdate(
					{ _id: userCopy._id },
					userCopy,
					function (err, doc) {
						if (err) cb(err);
						cb(null, doc);
					}
				);
			},
			function (doc, cb) {
				res.location(router.baseURL + "/" + body["address"]).end();
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
	console.log(price, marketCap);
	let priceAndMarketCapData = await BlockchainModel.find();
	let finalData = {};
	for (i = 0; i < priceAndMarketCapData.length; i++) {
		let date = priceAndMarketCapData[i].date;
		//why cant identifier at end be var?
		let priceN = priceAndMarketCapData[i][price];
		let marketCapN = priceAndMarketCapData[i][marketCap];
		date_iso_str = date.toISOString().slice(0, 10);
		finalData[date_iso_str] = priceN;
	}
	return finalData;
}

module.exports = router;
