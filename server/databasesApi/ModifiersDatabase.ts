import { Database } from './Database';
import { Modifiers } from '../../client/src/types';
import Modifier = Modifiers.Modifier;

// todo: implement next
// 1) when parsing all stashes, find all possible unique modifiers
// ...(! for non-unique items) (all implicit, explicit, crafted)
// 2) having this big list of modifiers add them to modifiers collection via the next command:
// ...probably should try regular write method of database (but one should be careful to check if it doesn't throw an
// ... error if the first modifier is already set in the collection). It should add only those which are not yet set.
// ... The other way around is to fetch all possible modifiers from db and check if there are any new ones in the list.
// ... and write only them.
// 3) While creating list of all modifiers, one should create different groups of items on which those modifiers
// ... are applied. For example, 'helmet': ['mod 1, 'mod 2'], 'boots': ['mod 1 for boots', 'next mod']
// 4) For every item type (helmet, boots, etc) run next update query (this one is for helmet)
// ...db.getCollection('modifiers').updateMany(
// {used_in: { $all: ["helmet"] }},
// {$addToSet: {used_in: {$each: ["helmet"]}}})
// 5) While creating list of modifiers treat unique items differently (their modifiers can be very 'unique')
// ... for every unique item create structure item copy, which should include item_name, item_type (helmet, etc),
// ..., modifiers links (to all modifiers objects _id), mb something else

// to find all modifiers for type (for example, 'helmet') use regular read method from database with next params
// queryObj = { used_in: { $all: ["helmet"] } }. Sorted object doesn't matter. Limit undefined
// searching modifiers for a unique should be different (find unique object by its name and then find modifiers ...
// ... by theit unique internal  _id, which should be stored in unique item object)

export class ModifiersDatabase extends Database {

    constructor() {
        super('modifiers');
    }

    public async addModifiers(modifiers: Modifier[]) {
        await this.write(modifiers);
        const result = this.getResult();
        if (result.error) {
            // check the error (it can either be duplicate insert  or some other error)
            throw new Error('There were some problems saving modifiers');
        }
    }

    public async fetchModifier(name: string, type: string): Promise<object> {
        const result = await this.fetchModifiers({name, type}, {}, 1);
        return result[0];
    }

    public async fetchModifiersByType (type: string): Promise<object[]> {
        return await this.fetchModifiers({type}, {name: 1}, undefined);
    }

    public async fetchAllModifiers(): Promise<object[]> {
        return await this.fetchModifiers({}, {name: 1}, undefined);
    }

    private async fetchModifiers(
        queryObject: object,
        sortObject: object,
        limit: number | undefined
    ): Promise<object[]> {
        await this.read(queryObject, sortObject, limit);
        const result = this.getResult();
        if (result.error || !result.data) {
            throw new Error(`cannot find modifiers`);
        }
        return result.data;
    }

}