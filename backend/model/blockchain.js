let mongoose = require("mongoose");

let blockchainSchema = new mongoose.Schema({
	date: {
		type: String,
		required: true,
		unique: true,
	},
	priceAED: {
		type: Number,
	},
	marketCapAED: {
		type: Number,
	},
	priceARS: {
		type: Number,
	},
	marketCapARS: {
		type: Number,
	},
	priceAUD: {
		type: Number,
	},
	marketCapAUD: {
		type: Number,
	},
	priceBDT: {
		type: Number,
	},
	marketCapBDT: {
		type: Number,
	},
	priceBRL: {
		type: Number,
	},
	marketCapBRL: {
		type: Number,
	},
	priceCAD: {
		type: Number,
	},
	marketCapCAD: {
		type: Number,
	},
	priceCHF: {
		type: Number,
	},
	marketCapCHF: {
		type: Number,
	},
	priceCLP: {
		type: Number,
	},
	marketCapCLP: {
		type: Number,
	},
	priceCNY: {
		type: Number,
	},
	marketCapCNY: {
		type: Number,
	},
	priceCZK: {
		type: Number,
	},
	marketCapCZK: {
		type: Number,
	},
	priceDKK: {
		type: Number,
	},
	marketCapDKK: {
		type: Number,
	},
	priceEUR: {
		type: Number,
	},
	marketCapEUR: {
		type: Number,
	},
	priceGBP: {
		type: Number,
	},
	marketCapGBP: {
		type: Number,
	},
	priceHKD: {
		type: Number,
	},
	marketCapHKD: {
		type: Number,
	},
	priceHUF: {
		type: Number,
	},
	marketCapHUF: {
		type: Number,
	},
	priceIDR: {
		type: Number,
	},
	marketCapIDR: {
		type: Number,
	},
	priceILS: {
		type: Number,
	},
	marketCapILS: {
		type: Number,
	},
	priceINR: {
		type: Number,
	},
	marketCapINR: {
		type: Number,
	},
	priceJPY: {
		type: Number,
	},
	marketCapJPY: {
		type: Number,
	},
	priceKRW: {
		type: Number,
	},
	marketCapKRW: {
		type: Number,
	},
	priceMMK: {
		type: Number,
	},
	marketCapMMK: {
		type: Number,
	},
	priceMXN: {
		type: Number,
	},
	marketCapMXN: {
		type: Number,
	},
	priceIKR: {
		type: Number,
	},
	marketCapIKR: {
		type: Number,
	},
	priceMYR: {
		type: Number,
	},
	marketCapMYR: {
		type: Number,
	},
	priceNGN: {
		type: Number,
	},
	marketCapNGN: {
		type: Number,
	},
	priceNOK: {
		type: Number,
	},
	marketCapNOK: {
		type: Number,
	},
	priceNZD: {
		type: Number,
	},
	marketCapNZD: {
		type: Number,
	},
	pricePHP: {
		type: Number,
	},
	marketCapPHP: {
		type: Number,
	},
	pricePKR: {
		type: Number,
	},
	marketCapPKR: {
		type: Number,
	},
	pricePLN: {
		type: Number,
	},
	marketCapPLN: {
		type: Number,
	},
	priceRUB: {
		type: Number,
	},
	marketCapRUB: {
		type: Number,
	},
	priceSEK: {
		type: Number,
	},
	marketCapSEK: {
		type: Number,
	},
	priceSGD: {
		type: Number,
	},
	marketCapSGD: {
		type: Number,
	},
	priceTHB: {
		type: Number,
	},
	marketCapTHB: {
		type: Number,
	},
	priceTRY: {
		type: Number,
	},
	marketCapTRY: {
		type: Number,
	},
	priceTWD: {
		type: Number,
	},
	marketCapTWD: {
		type: Number,
	},
	priceUAH: {
		type: Number,
	},
	marketCapUAH: {
		type: Number,
	},
	priceUSD: {
		type: Number,
	},
	marketCapUSD: {
		type: Number,
	},
	priceVEF: {
		type: Number,
	},
	marketCapVEF: {
		type: Number,
	},
	priceVND: {
		type: Number,
	},
	marketCapVND: {
		type: Number,
	},
	priceZAR: {
		type: Number,
	},
	marketCapZAR: {
		type: Number,
	},
});

module.exports = mongoose.model("Blockchains", blockchainSchema);
