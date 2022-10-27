//instances of model

import { Document } from "mongoose";
import { IUmbrellaDocument } from "./umbrella.types";
export async function setLastUpdated(this: IUmbrellaDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    console.log(this)
    await this.save();
  }
}
