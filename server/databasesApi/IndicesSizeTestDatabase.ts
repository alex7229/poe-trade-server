import { Database } from './Database';

export class IndicesSizeTestDatabase extends Database {
    constructor() {
        super('indices_test');
    }

    public async update(data: object[]): Promise<void> {
        return await this.write(data, {ordered: false});
    }
}
