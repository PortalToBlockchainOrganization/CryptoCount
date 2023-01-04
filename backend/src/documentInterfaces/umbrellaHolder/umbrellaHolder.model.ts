import { model } from "mongoose";
import { IUmbrellaHolderDocument } from "./umbrellaHolder.types";
import UmbrellaHolderSchema from "./umbrellaHolder.schema";
export const UmbrellaHolderModel = model<IUmbrellaHolderDocument>("umbrellaHolder", UmbrellaHolderSchema);