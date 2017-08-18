import {Item} from "./Parsers/ItemParser";

class ItemManager {

    private items : Item[];
    private totalItemsCount : number;


    constructor (items : Item[], totalItemsCount : number) {
        this.items = items;
        this.totalItemsCount = totalItemsCount;
    }
}

export {ItemManager}