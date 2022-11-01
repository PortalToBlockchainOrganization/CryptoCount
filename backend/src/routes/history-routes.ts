const router = require('express').Router()
//const RealizeHistObj = require("../models/realizeObject")
import {UmbrellaModel} from "../documentInterfaces/umbrella/umbrella.model"
//const User = require('../models/user-model')
 


// router.get('/', (req,res)=>{
//     console.log(req.user)
//     res.render('profile', {user: req.user});
// });


router.post("/", async function (req: any, res: any) {
	//var user_id = "60df960c5562110dc0753d3d"
    // var user_id = req.body.userId
    //get the user id out of the session cookie
    //req.session.prsId;
	console.log('userid'+ req.body.user_id)
    console.log("getting all ser sets");
    console.log(req.body.user_id)
    var user_id = req.body.user_id
    
    console.log(UmbrellaModel)
    
    //we want to get every user_id
    await UmbrellaModel.find({user_id: user_id}, function (err: any, docs: any) {
        console.log("result")
        console.log(docs.length)
        if (err){
            console.log(err);
        }
        else{
            if(docs == null){
                //grandfather objects
                console.log('here')
                // RealizeHistObj.find({ userid: user_id }, function (err: any, doc: any) {
                //             if (err) {
                //                 console.log(err)
                //             }else{
                //                 res.status(200).json(doc)
                //             }
                //         })
            }else{
                
                res.status(200).json(docs)
            }
        }
    }).clone()
    
    // try{
    //     RealizeHistObj.find({ userid: user_id }, function (err, doc) {
    //         if (err) {
    //             console.log(err)
    //         }else{
    //             res.status(200).json(doc)
    //         }
    //     })
    // }catch(e){console.log(e)}
   
        

//asdf
    //  try{
    //     getSetsGrandfather()
    //  }catch(e){
    //     console.log(e)
    //  }
    //  try{
    //     getSetsUmbrella()
    //  }catch(e){
    //     console.log(e)
    //  }
      
    
  
 
		// function (err) {
		// 	if (err) console.log(err);
		// }
}); 


router.post("/delete/", async function (req: any, res: any){
    console.log(req.body.setId)
    console.log('in delete')
    var setId = req.body.setId
    //var user_id = req.body.user_id
    //get umbrella object
    //remove set id from user object
    //delete id from models
    await UmbrellaModel.deleteOne({_id: setId});
    console.log('deleted')
    res.status(200).json()
});

module.exports = router