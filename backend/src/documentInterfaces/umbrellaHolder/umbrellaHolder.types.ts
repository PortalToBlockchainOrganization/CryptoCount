
import { Document, Model } from "mongoose";

export default interface IUmbrellaHolder {
    user_id: string;
    objectId: string;
    umbrellaHolder: Array<UmbrellaHolder>;
    dateOfEntry?: Date;
    lastUpdated?: Date;
   

}
export interface IUmbrellaHolderDocument extends IUmbrellaHolder, Document {}
export interface IUmbrellaHolderModel extends Model<IUmbrellaHolderDocument> {}

interface UmbrellaHolder{
    id: string,
}
