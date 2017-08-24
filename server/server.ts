/*
import {UpdateDemon} from "./OfficialApi/UpdateDemon"

let demon = new UpdateDemon();
demon.officialApiUpdate();
*/

import {CurrencyManager} from "./Currency/Currency"
CurrencyManager.getExchangeRate({name: 'exalted', value: 4}, 'chaos');