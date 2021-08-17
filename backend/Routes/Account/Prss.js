var Express = require('express');
var Tags = require('../Validator.js').Tags;
var { check, validationResult} = require("express-validator/check");
var async = require('async');
var mysql = require('mysql');
var {Session} = require('../Session.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var router = Express.Router({caseSensitive: true});
router.baseURL = '/Prss';

const User = require("../../model/User.js");

// new get prss/:id + mongodb
router.get('/:id', function(req, res) {
    var vld = req.validator;
    console.log('asscheecks')
 
    async.waterfall([
    function(cb) {
      if (vld.checkPrsOK(req.params.id, cb))
         // req.cnn.chkQry('select * from Person where id = ?', [req.params.id],cb);
         User.find({_id: req.params.id}, function(err, docs) {
             if(err) cb(err);
             cb(null, docs)
         } )
    },
    function(prsArr, cb) {
       if (vld.check(prsArr.length, Tags.notFound, null, cb)) {

        // create a new copy to remove password
        let userCopy = ({...prsArr[0]}._doc); 
        delete userCopy.password; 
        res.json(userCopy);
        cb();
       }
    }],
    function(err) {
        if(err) console.log(err);
    });
 });

// new signup v2 + mongodb
router.post('/', function(req, res) {
   var vld = req.validator;   // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();

   if (admin && !body.password)
      body.password = "*"; // Blocking password
   body.whenRegistered = new Date();

   console.log(body)
    
   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates
      if (vld.hasFields(body, ["email", "password", "lastName", "role"], cb) &&
       vld.valueCheck(body, cb) && 
       vld.chain(body.termsAccepted || admin, Tags.noTerms, null)
       .chain(body.role === 0 || admin, Tags.forbiddenRole, null)) {
        User.find({email: body.email}, function(err, docs) {
            console.log(cb)
            if(err) cb(err);
            cb(null, docs);
        })
      }
   },
    function(existingPrss, cb) {  // If no duplicates, encrypt password 
                                        // then add user
        console.log(cb)
        if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
            body.termsAccepted = body.termsAccepted && new Date();
            body.termsAccepted = body.termsAccepted || null;
            bcrypt.genSalt(10, cb); // generate salt for our hash
        }
   },
   function(salt, cb){
       bcrypt.hash(body.password, salt, cb); // hash our password (encrypt)
   },
   function(hashedpass, cb){
        const {
            firstName, lastName, email, password, termsAccepted, role
        } = body;
        
        user = new User({
            firstName, lastName, email, password, role
        });

        user.password = hashedpass;

        user.save(function(err, doc){
            if(err) cb(err);
            cb(null,doc);
        })
   },
   function(result, cb) { // Return location of inserted Person
        console.log(result)
      res.location(router.baseURL + '/' + result._id).end();
   }],
   function(err) {
      if(err) console.log(err);
   });
});

module.exports = router;