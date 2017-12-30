import * as Ajv from 'ajv';
import { OfficialApi } from '../types';
import GeneralResponse = OfficialApi.GeneralResponse;

export class OfficialApiResponseValidator {

    public static validate(response: object): response is GeneralResponse {
        const booleanType = {type: 'boolean'};
        const stringType = {type: 'string'};
        const numberType = {type: 'number'};

        const stringArrayType = {
            type: 'array',
            items: {
                type: 'string'
            }
        };

        const itemPropertiesSchema = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: stringType,
                    values: {
                        type: 'array',
                        items: [numberType, numberType]
                    },
                    displayMode: numberType,
                    type: numberType,
                    progress: numberType
                },
                additionalProperties: false
            }
        };

        const categorySchema = {
            oneOf: [
                stringType,
                {
                    type: 'object',
                    properties: {
                        accessories: stringArrayType
                    },
                    additionalProperties: false
                }
            ]
        };

        const socketsSchema = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    group: numberType,
                    sColour: {
                        type: 'string',
                        pattern: '^[GWRBA]$'
                    },
                    attr: {
                        oneof: [
                            booleanType,
                            {
                                type: 'string',
                                pattern: '^[SDIG]$'
                            }
                        ]
                    }
                },
                additionalProperties: false
            }
        };

        const itemSchema = {
            type: 'object',
            properties: {
                abyssJewel: booleanType,
                additionalProperties: itemPropertiesSchema,
                artFilename: stringType,
                category: categorySchema,
                corrupted: booleanType,
                cosmeticMods: stringArrayType,
                craftedMods: stringArrayType,
                descrText: stringType,
                duplicated: booleanType,
                enchantMods: stringArrayType,
                explicitMods: stringArrayType,
                flavourText: stringArrayType,
                frameType: numberType,
                h: numberType,
                icon: stringType,
                id: stringType,
                identified: booleanType,
                ilvl: numberType,
                implicitMods: stringArrayType,
                inventoryId: stringType,
                isRelic: booleanType,
                league: stringType,
                lockedToCharacter: booleanType,
                maxStackSize: numberType,
                name: stringType,
                nextLevelRequirements: itemPropertiesSchema,
                note: stringType,
                properties: itemPropertiesSchema,
                prophecyDiffText: stringType,
                prophecyText: stringType,
                requirements: itemPropertiesSchema,
                secDescrText: stringType,
                socketedItems: {type: 'array'},
                sockets: socketsSchema,
                stackSize: numberType,
                support: booleanType,
                talismanTier: booleanType,
                typeLine: stringType,
                utilityMods: stringArrayType,
                verified: booleanType,
                w: numberType,
                x: numberType,
                y: numberType
            },
            additionalProperties: false,
            patternProperties: {
                '^[\\s]*RaceReward$': {
                    type: 'boolean'
                }
            },
        };

        const stashSchema = {
            type: 'object',
            properties: {
                accountName: stringType,
                id: stringType,
                items: {
                    type: 'array',
                    items: itemSchema
                },
                lastCharacterName: stringType,
                public: booleanType,
                stash: stringType,
                stashType: stringType
            },
            additionalProperties: false
        };

        const responseSchema = {
            type: 'object',
            properties: {
                next_change_id: stringType,
                stashes: {
                    type: 'array',
                    items: stashSchema
                }
            },
            additionalProperties: false
        };

        const ajv = new Ajv();
        const valid = ajv.validate(responseSchema, response);
        // const errors = ajv.errors;
        if (valid) {
            return true;
        }
        return false;
    }
}