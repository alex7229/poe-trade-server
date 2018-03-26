import { validateMods } from '../../../validators/officialApi/mods';

it ('array checking', () => {
    expect(validateMods({})).toBe(false);
    expect(validateMods([])).toBe(true);
});

it ('only array containing strings', () => {
    expect(validateMods(['abba', 'misha'])).toBe(true);
    expect(validateMods(['asd', 2])).toBe(false);
});