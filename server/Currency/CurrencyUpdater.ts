import { PoeNinja } from './api/PoeNinja';
import { DatabaseApi } from './api/DatabaseApi';
import * as moment from 'moment';

export class CurrencyUpdater {

    public static run(): void {
        this.update();
        const sixHours = 6 * 60 * 60 * 1000;
        setInterval(CurrencyUpdater.update, sixHours);
    }

    private static async update(): Promise<boolean> {
        const dbInstance = new DatabaseApi();
        let list;
        try {
            list = await dbInstance.fetchLatestListFromDb();
        } catch (err) {
            return await this.fetchAndSaveList();
        }
        if (list && !this.isListOutdated(list)) {
            return true;
        }
        return await this.fetchAndSaveList();
    }

    private static async fetchAndSaveList (): Promise<boolean> {
        try {
            const listFromApi: CurrencyEquivalent[] = await PoeNinja.fetchList();
            const db = new DatabaseApi();
            await db.saveListToDb({
                exchangeRates: listFromApi,
                updateTime: moment.now()
            });
        } catch (err) {
            return false;
        }
        return true;
    }

    private static isListOutdated(list: CurrencyList): boolean {
        const now = moment();
        return now.diff(list.updateTime, 'hours') >= 3;
    }
}