const mongoose = require("mongoose");

const realizeSchema = mongoose.Schema({
	unrealizedBasisRewards: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	unrealizedBasisRewardsDep: {
		type: [mongoose.Schema.Types.Mixed],
		default: [],
	},
	unrealizedBasisRewardsMVdep: {
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
	realizedBasisRewardsMVdep: {
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
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

// export model user with UserSchema
module.exports = mongoose.model("realize", realizeSchema);
