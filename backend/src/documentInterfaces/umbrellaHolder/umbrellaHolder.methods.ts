
import { Document } from "mongoose";
import { IUmbrellaHolderDocument } from "./umbrellaHolder.types";
export async function setLastUpdated(this: IUmbrellaHolderDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    console.log(this)
    await this.save();
  }
}
