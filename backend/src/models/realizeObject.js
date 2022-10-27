const mongoose = require("mongoose");

const realizeSchema = mongoose.Schema({
	userid: {
		type: String,
		required: true,
	},
	version: {
		// to keep track of mulitple versions of similar sets (fiat, basisPrice, address)
		type: Number,
		required: true,
	},
	unrealizedRewards: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	unrealizedBasisRewards: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	unrealizedBasisRewardsDep: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	unrealizedBasisRewardsMVDep: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	realizedRewards: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	realizedBasisRewards: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	realizedBasisRewardsDep: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	realizedBasisRewardsMVDep: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	fiat: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	basisDate: {
		type: Date,
		required: false,
	},
	basisPrice: {
		type: Number,
		required: false,
	},
	unrealizedBasisAgg: {
		type: Number,
		required: false,
	},
	unrealizedBasisDepAgg: {
		type: Number,
		required: false,
	},
	unrealizedBasisMVDepAgg: {
		type: Number,
		required: false,
	},
	unrealizedRewardAgg: {
		type: Number,
		required: false,
	},
	realizedBasisAgg: {
		type: Number,
		required: false,
	},
	realizedDepAgg: {
		type: Number,
		required: false,
	},
	realizedMVdAgg: {
		type: Number,
		required: false,
	},
	unrealXTZBasis: {
		type: Number,
		required: false,
	},
	unrealBasisP: {
		type: Number,
		required: false,
	},
	unrealBasisDep: {
		type: Number,
		required: false,
	},
	unrealBasisMVDep: {
		type: Number,
		required: false,
	},
	realizingxtzBasis: {
		type: Number,
		required: false,
	},
	realizingBasisP: {
		type: Number,
		required: false,
	},
	realizingBasisDep: {
		type: Number,
		required: false,
	},
	realizingBasisMVDep: {
		type: Number,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
    },
	consensusRole: {
		type: String,
		required: true,
	},
},
{
    timestamps: true
  });

// export model user with UserSchema
module.exports = mongoose.model("realize", realizeSchema);