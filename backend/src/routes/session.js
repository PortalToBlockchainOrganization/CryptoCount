// // This middleware assumes cookieParser has been "used" before this
// var crypto = require('crypto');

// var ssnsByCookie = {};  // All currently logged-in Sessions indexed by token
// var ssnsById = [];      // Same, but indexed by sequential session ID
// var duration = 7200000;     // Two hours in milliseconds
// var cookieName = 'CHSAuth'; // Cookie key for authentication tokens

// // Session-constructed objects represent an ongoing login session, including
// // user details, login time, and time of last use, the latter for the purpose
// // of timing out sessions that have been unused for too long.
// // 
// // Creating an authToken and register the relevant cookie.  Add the new session
// // to both |ssnsByCookie| indexed by the authToken and to |ssnsById| indexed
// // by session id.  Fill in session members from the supplied user object
// //
// // 1 Cookie is tagged by |cookieName|, times out on the client side after
// // |duration| (though the router, below, will check anyway to prevent hacking),
// // and will not be shown by the browser to the user, again to prevent hacking.
// var Session = function(user, res) {
//    var authToken = crypto.randomBytes(16).toString('hex');  // Make random token

//    res.cookie(cookieName, authToken, {maxAge: duration, httpOnly: true }); // 1
//    this.id = ssnsById.length;
//    this.authToken = authToken;
//    this.firstName = user.firstName;
//    this.lastName = user.lastName;
//    this.prsId = user._id;
//    this.email = user.email;
//    this.role = user.role;
//    this.loginTime = this.lastUsed = new Date().getTime();
//    this.realzing = 
//    {
//       "realizingRewards": [],
//       "realizingBasisRewards": [],
//       "realizingBasisRewardsDep": [],
//       "realizingBasisRewardsMVDep": [],
//       "realizingRewardAgg": null,
//       "realizingBasisAgg": null,
//       "realizingDepAgg": null,
//       "realizingMVDepAgg": null
//    }
//    ssnsByCookie[authToken] = this;
//    ssnsById.push(this);

// };

// Session.prototype.isAdmin = function() {
//    return this.role === 1;
// };

// // Log out a user by removing this Session
// Session.prototype.logOut = function() {
//    delete ssnsById[this.id];
//    delete ssnsByCookie[this.authToken];
// };

// Session.deleteSsns = function() {
//    ssnsById = [];
//    ssnsByCookie = {};
// }

// Session.getAllIds = () => Object.keys(ssnsById);
// Session.findById = id => ssnsById[id];

// // Logout a given prsId's Session(s)
// Session.removePrs = function(prsId) {
//    prsId = parseInt(prsId,10);

//    ssnsById.forEach(ssn => {
//       if(prsId === ssn.prsId){
//          ssn.logOut();
//       }
//    });

// }

// // Function router that will find any Session associated with |req|, based on
// // cookies, delete the Session if it has timed out, or attach the Session to
// // |req| if it's current If |req| has an attached Session after this process,
// // then down-chain routes will treat |req| as logged-in.
// var router = function(req, res, next) {
//    console.log('cookies')
//    var cookie = req.cookies[cookieName];
//    var session = cookie && ssnsByCookie[cookie];
   
//    if (session) {
//       // If the session was last used more than |duration| mS ago..
//       if (session.lastUsed < new Date().getTime() - duration) 
//          session.logOut();
//       else {
//          req.session = session;
//       }
//    }
//    next();
// };

// module.exports = {Session, router};