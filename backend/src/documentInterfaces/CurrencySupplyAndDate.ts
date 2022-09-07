import { ObjectId } from "mongodb";

export default class CurrencySupplyAndDate {
    constructor(public dateString: string, public totalSupply: number, public id?: ObjectId) {}
}