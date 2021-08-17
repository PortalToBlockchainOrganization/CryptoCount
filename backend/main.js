var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var bodyParser = require("body-parser");
var { Session, router } = require("./Routes/Session.js");
var Validator = require("./Routes/Validator.js");
var async = require("async");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

// Initiate Express (this) Server
var app = express();
app.use(cors({
	origin: "https://cryptocount.co", credentials: true, methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
}));

// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
	  const allowedOrigins = ['http://127.0.0.1:80', 'http://localhost:80', 'http://54.201.255.116', 'http://54.201.255.116:1', 'http://54.201.255.116:80', 'http://cryptocount.co', 'https://cryptocount.co'];
	  const origin = req.headers.origin;
	  if (allowedOrigins.includes(origin)) {
	       res.setHeader('Access-Control-Allow-Origin', origin);
	  }
	res.header("Access-Control-Allow-Headers", "Content-Type, Location");
	res.header("Access-Control-Expose-Headers", "Content-Type, Location");
	res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, OPTIONS");
	next();
});

// No further processing needed for options calls.
app.options("/*", function (req, res) {
	res.status(200).end();
});

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json());

// No messing w/db ids
app.use(function (req, res, next) {
	delete req.body.id;
	next();
});

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(router);

// Check general login.  If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function (req, res, next) {
    console.log(req.path);
    console.log(req.method)
    console.log(req.session)
	if (
        req.path === "/Anal/Cal" ||
        req.method === "GET"  ||
		req.session ||
		(req.method === "POST" &&
			(req.path === "/Prss" || req.path === "/Ssns"))
	) {
		req.validator = new Validator(req, res);
		next();
	} else {
        console.log('is this really happening')
        res.status(401).end();
}});
// Add DB connection, with smart chkQry method, to |req|
// app.use(CnnPool.router);

// Load all subroutes
app.use("/Prss", require("./Routes/Account/Prss.js"));
app.use("/Ssns", require("./Routes/Account/Ssns.js"));
app.use("/Anal", require("./Routes/Analysis/Anal.js"));

// Anchor handler for general 404 cases.
app.use(function (req, res) {
	res.status(404).end();
	req.cnn.release();
});

// Handler of last resort.  Send a 500 response with stacktrace as the body.
app.use(function (err, req, res, next) {
	res.status(500).json(err.stack);
	req.cnn && req.cnn.release();
});

var args = process.argv.slice(2);
var portnum = args[args.indexOf("-p") + 1];

app.listen(portnum, function () {
	console.log("App Listening on port " + portnum);
});
