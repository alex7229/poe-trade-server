import {JsonValidator} from "../Helpers/JsonValidator"
import * as Ajv from 'ajv';

class ApiValidator {

    public static validate (rawData: any) : boolean {
        //account name sometimes can be null instead of string
        //url format of icon sometimes is invalid for  some reason (but url seems fine)

        const colourSchema = {
            type: 'string',
            pattern: '^[SGID]$'
            //s -> str -> red, d -> dex -> green, i -> int -> blue, d -> white
        };

        const valuesSchema = {
            type: 'array',
            items: {
                type: 'array',
                items: [{
                    type: 'string'
                }, {
                    type: 'number'
                }]
            }
        };

        const regularArraySchema = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    displayMode: {
                        type: 'number'
                    },
                    name: {
                        type: 'string'
                    },
                    progress: {
                        type: 'number'
                    },
                    values: valuesSchema
                }
            }
        };

        const socketedItemSchema = {
            type: 'object',
            properties: {
                verified: {
                    type: 'boolean'
                },
                colour: colourSchema,
                socket: {
                    type: 'number'
                },
                //colour and socket are specific only to socketed item
                isRelic: {
                    type: 'boolean'
                },
                artFilename : {
                    type: 'string'
                },
                corrupted: {
                    type: 'boolean'
                },
                descrText : {
                    type: 'string'
                },
                secDescrText: {
                    type: 'string'
                },
                duplicated: {
                    type: 'boolean'
                },
                nextLevelRequirements: regularArraySchema,
                    explicitMods: {
                    type: 'array',
                        items: {
                        type: 'string'
                    }
                },
                socketedItems : {
                    type: 'array',
                    maxItems: 0
                },
                craftedMods: {
                    type: 'array',
                        items: {
                        type: 'string'
                    }
                },
                enchantMods: {
                    type: 'array',
                        items: {
                        type: 'string'
                    }
                },
                utilityMods: {
                    type: 'array',
                        items: {
                        type: 'string'
                    }
                },
                prophecyText: {
                    type: 'string'
                },
                support: {
                    type: 'boolean'
                },
                additionalProperties: regularArraySchema,
                    stackSize: {
                    type: 'integer'
                },
                maxStackSize: {
                    type: 'integer'
                },
                flavourText: {
                    type: 'array',
                        items : {
                        type: 'string'
                    }
                },
                frameType: {
                    type: 'number'
                },
                icon : {
                    type: 'string'
                },
                talismanTier: {
                    type: 'number'
                },
                id : {
                    type: 'string'
                },
                identified: {
                    type: 'boolean'
                },
                ilvl : {
                    type: 'integer'
                },
                inventoryId : {
                    type: 'string'
                },
                league : {
                    type: 'string',
                    //harbinger, hc, standard, ssf and else
                },
                lockedToCharacter : {
                    type: 'boolean'
                },
                name: {
                    type: 'string'
                },
                properties : regularArraySchema,
                requirements: regularArraySchema,
                implicitMods: {
                    type: 'array',
                        items: {
                        type: 'string'
                    }
                },
                sockets: {
                    type : 'array',
                        items: {
                        type: 'object',
                            properties: {
                            attr: colourSchema,
                            group: {
                                type: 'integer'
                            }
                        }
                    }
                },
                typeLine: {
                    type: 'string'
                },
                w: {
                    //item width
                    type: 'number'
                },
                h: {
                    //item height
                    type: 'number'
                },
                x: {
                    //position x
                    type: 'number'
                },
                y: {
                    //position y
                    type: 'number'
                },
                note : {
                    type: 'string'
                    //that's buyout property
                },
                cosmeticMods: {
                    //irrelevant
                    type: 'array',
                        items: {
                        type: 'string'
                    }
                }
            },
            additionalProperties : false,
            patternProperties: {
                "^[\\s]*RaceReward$": {
                    type: "boolean"
                }
            },
        };

        const socketedItemSchemaJson = JSON.stringify(socketedItemSchema);
        let regularItemSchema = JSON.parse(socketedItemSchemaJson);
        //temp. solution for deep copy of object
        delete regularItemSchema['properties']['socketedItems']['maxItems'];
        regularItemSchema['properties']['socketedItems'] = {
            type: 'array',
            items: socketedItemSchema
        };
        //regular item can contain array of socketed items inside

        let schema = {
            type: 'object',
            properties: {
                'next_change_id': {
                    type: 'string'
                },
                stashes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            accountName: {
                                oneOf: [{
                                    type: 'string'
                                }, {
                                    type: 'null'
                                }]
                            },
                            id : {
                                type: 'string'
                            },
                            lastCharacterName : {
                                type: 'string'
                            },
                            'public' : {
                                type: 'boolean'
                            },
                            stash : {
                                type: 'string'
                            },
                            stashType : {
                                type: 'string'
                            },
                            items: {
                                type: 'array',
                                items: regularItemSchema
                            }
                        }
                    }
                }
            }
        };
        console.time('parse');
        //"http://web.poecdn.com/image/Art/2DItems/Weapons/TwoHandWeapons/Staves/Rage Staff.png?scale=1&w=2&h=4&v=85aeb112091552131f20ccdaaa3be4203"
        //this uri is not matched like url
        let validator  = new Ajv();
        let parsedData : object;
        try {
            parsedData = JSON.parse(rawData);
            console.timeEnd('parse');
        } catch(err) {
            return false;
        }
        console.time('validation');
        const valid = validator.validate(schema, parsedData);
        const errors = validator.errors;
        console.timeEnd('validation');
        //debugger;
        if (errors!== null) {
            debugger;
        }
        return errors === null;


    }
}

export {ApiValidator}