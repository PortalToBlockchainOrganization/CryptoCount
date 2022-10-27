import { model } from "mongoose";
import { IUmbrellaDocument } from "./umbrella.types";
import UmbrellaSchema from "./umbrella.schema";
export const UmbrellaModel = model<IUmbrellaDocument>("umbrella", UmbrellaSchema);