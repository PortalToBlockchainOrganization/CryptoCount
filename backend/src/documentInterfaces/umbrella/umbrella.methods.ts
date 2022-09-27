//instances of model

import { Document } from "mongoose";
import { IUmbrellaDocument } from "./umbrella.types";
export async function setLastUpdated(this: IUmbrellaDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    await this.save();
  }
}
export async function sameLastName(this: IUmbrellaDocument): Promise<Document[]> {
  return this.$model("umbrella").find({ lastName: this.lastName });
}