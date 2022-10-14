const router = require('express').Router()
const RealizeHistObj = require("../models/realizeObject")
import {UmbrellaModel} from "../documentInterfaces/umbrella/umbrella.model"



// router.get('/', (req,res)=>{
//     console.log(req.user)
//     res.render('profile', {user: req.user});
// });


router.get("/", async function (req, res) {
	var user_id = "60df960c5562110dc0753d3d"
    //get the user id out of the session cookie
    //req.session.prsId;
	
    console.log("getting all user sets");
    console.log(user_id);
    
    console.log(UmbrellaModel)
    try{
        UmbrellaModel.findById({_id: user_id}, function (err: any, docs: any) {
            if (err){
                console.log(err);
            }
            else{
                if(docs == null){
                    //grandfather objects
                    RealizeHistObj.find({ userid: user_id }, function (err, doc) {
                                if (err) {
                                    console.log(err)
                                }else{
                                    res.status(200).json(doc)
                                }
                            })
                }else{
                    res.status(200).json(docs)
                }
            }
        })
    }catch(e){console.log(e)}
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

module.exports = router