import umbrella from "../umbrella/umbrella.types"
var UmbrellaHolder = require("./umbrellaHolder.schema")
// const db = require('mongoose')
import { IUmbrellaHolderDocument } from "./umbrellaHolder.types";
export async function findOneOrCreate(this: any, 
  setId: string
): Promise<IUmbrellaHolderDocument> {
  const record = await this.findOne({ setId });
  if (record) {
    return record;
  } else {
    return this.create({ setId });
  }
}

// db.createCollection(
//     "Umbrella",
//     {

//     }
// )

export default function transform(ts: umbrella){
    var object: any = {}
    var id = ts.objectId.toString()
    var obj = {id: id}
    var array = []
   // var array: new = []
        //class ts to umbrella class
      new UmbrellaHolder({
            user_id: ts.user_id,
            umbrellaHolder: array.push(obj),
            dateOfEntry: ts.dateOfEntry,
            lastUpdated: ts.lastUpdated,
        })
        .save().then((newObj: any)=>{
                console.log('newUmbrellaHolder created' + newObj._id)
            object = newObj
        })
        return object

}
