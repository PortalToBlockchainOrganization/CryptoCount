const mongoose = require("mongoose");

const server = "127.0.0.1:27017";
const database = "cryptocount";

// Replace password with real password (ask shaheen)
const MONGOURI =
	"mongodb+srv://admin:lelloliar9876@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
	try {
		await mongoose.connect(MONGOURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			userFindAndModify: false,
		});
		console.log("Database connection successful");
	} catch (e) {
		console.log(`Database connection error ${e}`);
		throw e;
	}
};

module.exports = InitiateMongoServer;
