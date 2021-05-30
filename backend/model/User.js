const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	addresses: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
	},
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
