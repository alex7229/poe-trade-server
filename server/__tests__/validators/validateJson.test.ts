import { validate } from '../../validators/validateJson';

it('invalid json', () => {
    expect(validate('not json')).toBe(false);
});

it('valid json', () => {
    expect(validate('[{"abba":"batta"}]')).toBe(true);
});