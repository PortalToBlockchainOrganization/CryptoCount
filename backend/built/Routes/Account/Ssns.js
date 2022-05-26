var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');
var { check, validationResult } = require("express-validator/check");
var { Session, router } = require('../Session.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var router = Express.Router({ caseSensitive: true });
router.baseURL = '/Ssns';
const User = require("../../model/User.js");
// new login + mongodb v2
// /Ssns/
router.post('/', function (req, res) {
    var ssn;
    var vld = req.validator;
    async.waterfall([
        function (cb) {
            if (vld.hasFields(req.body, ["email", "password"], cb))
                User.find({ email: req.body.email }, function (err, docs) {
                    if (err)
                        cb(err);
                    cb(null, docs);
                });
        },
        function (result, cb) {
            return __awaiter(this, void 0, void 0, function* () {
                if (vld.check(result.length &&
                    (yield bcrypt.compare(req.body.password, result[0].password)), Tags.badLogin, null, cb)) {
                    ssn = new Session(result[0], res);
                    res.location(router.baseURL + '/' + ssn.id).end();
                }
            });
        }
    ], function (err) {
        if (err)
            console.log(err);
    });
});
// new get + mongodb
router.get('/:id', function (req, res) {
    console.log("in get ssns by id");
    var vld = req.validator;
    var ssn = Session.findById(req.params.id);
    console.log(ssn);
    var ssns = Session.getAllIds();
    console.log(ssns);
    var personId = ssn && ssn.prsId;
    async.waterfall([
        cb => {
            if (vld.checkPrsOK(personId, cb) && vld.check(ssn, Tags.notFound, null, cb)) {
                res.status(200).json({ id: ssn.id, prsId: ssn.prsId,
                    loginTime: ssn.loginTime });
                cb();
            }
        },
        cb => {
            res.end();
            cb();
        }
    ], function (err) {
        if (err)
            console.log(err);
    });
});
// new logout + mongodb
router.delete('/:id', function (req, res) {
    var vld = req.validator;
    var ssn = Session.findById(req.params.id);
    async.waterfall([
        cb => {
            if (vld.check(ssn, Tags.notFound, null, cb) &&
                vld.checkPrsOK(ssn.prsId, cb)) {
                ssn.logOut();
                res.status(200).end();
                cb();
            }
        }
    ], function (err) {
        if (err)
            console.log(err);
    });
});
module.exports = router;
