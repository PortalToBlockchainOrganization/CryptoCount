var Express = require("express");
var Tags = require("../Validator.js").Tags;
var { check, validationResult } = require("express-validator/check");
var async = require("async");
var mysql = require("mysql");
var { Session } = require("../Session.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const { sendEmail } = require("../../utils/email.js");

var router = Express.Router({ caseSensitive: true });
router.baseURL = "/Prss";

const User = require("../../model/User.js");
const Temp_Pw = require("../../model/temp_pw.js");

// forgot password
router.post("/forgotpw", function (req, res) {
	// if found - check to see if temp pw already made
	//          - if more than three valid temps are made
	//              - reject
	//          - if less than three -> create a temp pw
	//              - store hashed temp pw
	//              - send unhashed pw in email
	// if not found - reject
	var vld = req.validator;
	console.log(req);
	async.waterfall(
		[
			function (cb) {
				// find email in db
				if (vld.hasFields(req.body, ["email"], cb))
					User.find({ email: req.body.email }, function (err, docs) {
						if (err) cb(err);
						cb(null, docs);
					});
			},
			function (result, cb) {
				// check if too many attempts
				if (vld.check(result.length, "email not found", null, cb))
					Temp_Pw.find(
						{ email: req.body.email },
						function (err, docs) {
							if (err) cb(err);
							cb(null, docs);
						}
					);
			},
			function (result, cb) {
				if (
					vld.check(
						result.length < 3,
						"Too many forgot password requests",
						null,
						cb
					)
				)
					bcrypt.genSalt(10, cb);
			},
			function (salt, cb) {
				// create temp pwr
				var temp_pw = "temp_" + Math.random().toString(36).substr(2, 8);
				// send email with temp_pw
				// TODO: send_email(temp_pw, email)
				bcrypt.hash(temp_pw, salt, cb); // hash our password (encrypt)
			},
			function (hashed_temp_pw, cb) {
				cur_temp_pw = new Temp_Pw({
					email: req.body.email,
					temp_pw: hashed_temp_pw,
				});
				//store hashed temp pw
				cur_temp_pw.save(function (err, doc) {
					if (err) cb(err);
					cb(null, doc);
				});
			},
			function (result, cb) {
				console.log(result);
				res.status(200).json({});
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

// new get prss/:id + mongodb
router.get("/:id", function (req, res) {
	var vld = req.validator;

	async.waterfall(
		[
			function (cb) {
				if (vld.checkPrsOK(req.params.id, cb))
					// req.cnn.chkQry('select * from Person where id = ?', [req.params.id],cb);
					User.find({ _id: req.params.id }, function (err, docs) {
						if (err) cb(err);
						cb(null, docs);
					});
			},
			function (prsArr, cb) {
				if (vld.check(prsArr.length, Tags.notFound, null, cb)) {
					// create a new copy to remove password
					let userCopy = { ...prsArr[0] }._doc;
					delete userCopy.password;
					res.json(userCopy);
					cb();
				}
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

// new signup v2 + mongodb
router.post("/", function (req, res) {
	var vld = req.validator; // Shorthands
	var body = req.body;
	var admin = req.session && req.session.isAdmin();

	if (admin && !body.password) body.password = "*"; // Blocking password
	body.whenRegistered = new Date();

	console.log(body);

	async.waterfall(
		[
			function (cb) {
				// Check properties and search for Email duplicates
				if (
					vld.hasFields(
						body,
						["email", "password", "lastName", "role"],
						cb
					) &&
					vld.valueCheck(body, cb) &&
					vld
						.chain(body.termsAccepted || admin, Tags.noTerms, null)
						.chain(
							body.role === 0 || admin,
							Tags.forbiddenRole,
							null
						)
				) {
					User.find({ email: body.email }, function (err, docs) {
						console.log(cb);
						if (err) cb(err);
						cb(null, docs);
					});
				}
			},
			function (existingPrss, cb) {
				// If no duplicates, encrypt password
				// then add user
				console.log(cb);
				if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
					body.termsAccepted = body.termsAccepted && new Date();
					body.termsAccepted = body.termsAccepted || null;
					bcrypt.genSalt(10, cb); // generate salt for our hash
				}
			},
			function (salt, cb) {
				bcrypt.hash(body.password, salt, cb); // hash our password (encrypt)
			},
			function (hashedpass, cb) {
				const {
					firstName,
					lastName,
					email,
					password,
					termsAccepted,
					role,
				} = body;

				user = new User({
					firstName,
					lastName,
					email,
					password,
					role,
				});

				user.password = hashedpass;

				user.save(function (err, doc) {
					if (err) cb(err);
					cb(null, doc);
				});
			},
			function (result, cb) {
				// Return location of inserted Person
				console.log(result);
				res.location(router.baseURL + "/" + result._id).end();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});

module.exports = router;
