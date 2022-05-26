let mongoose = require("mongoose");

let cycleSchema = new mongoose.Schema({
	dateString: {
		type: String,
		required: true,
		unique: true,
	},
	cycleNumber: {
		type: Number,
		required: true,
	},
});

export default mongoose.model('TezosCycles', cycleSchema);