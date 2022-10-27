import { ObjectId } from "mongodb";

export default class CycleAndDate {
    constructor(public dateString: string, public cycleNumber: number, public id?: ObjectId) {}
}