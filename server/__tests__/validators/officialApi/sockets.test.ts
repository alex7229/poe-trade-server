import { validateSockets } from '../../../validators/officialApi/sockets';

const createSocket = (
    group: string | number | null | boolean = 2,
    sColour: string | number | null | boolean = 'B',
    attr: string | number | null | boolean = 'S'
) => {
    return {
        group,
        sColour,
        attr,
    };
};

it('sockets contain group, attribute and colour', () => {
    const sockets = [{
        group: 0,
        attr: 'I',
        sColour: 'B'
    }];
    expect(validateSockets(sockets)).toBe(true);
});

it ('sockets properties number is not correct', () => {
    const notEnough = [{group: 2}];
    const moreThanEnough = [{
        group: 0,
        attr: 'b',
        sColour: 'c',
        uselessProp: 'asdf'
    }];
    expect(validateSockets(notEnough)).toBe(false);
    expect(validateSockets(moreThanEnough)).toBe(false);
});

it ('group is integer: inclusive min 0, inclusive max 5', () => {
    expect(validateSockets([createSocket(0)])).toBe(true);
    expect(validateSockets([createSocket(3)])).toBe(true);
    expect(validateSockets([createSocket(5)])).toBe(true);

    expect(validateSockets([createSocket('some string')])).toBe(false);
    expect(validateSockets([createSocket(null)])).toBe(false);
    expect(validateSockets([createSocket(-2)])).toBe(false);
    expect(validateSockets([createSocket(6)])).toBe(false);
    expect(validateSockets([createSocket(3.245)])).toBe(false);
    expect(validateSockets([createSocket(true)])).toBe(false);
});

it ('scolour is A, B, R, W or G only', () => {
    expect(validateSockets([createSocket(undefined, 'A')])).toBe(true);
    expect(validateSockets([createSocket(undefined, 'B')])).toBe(true);
    expect(validateSockets([createSocket(undefined, 'R')])).toBe(true);
    expect(validateSockets([createSocket(undefined, 'W')])).toBe(true);
    expect(validateSockets([createSocket(undefined, 'G')])).toBe(true);

    expect(validateSockets([createSocket(undefined, 2)])).toBe(false);
    expect(validateSockets([createSocket(undefined, 'Y')])).toBe(false);
    expect(validateSockets([createSocket(undefined, 'b')])).toBe(false);
    expect(validateSockets([createSocket(undefined, null)])).toBe(false);
    expect(validateSockets([createSocket(undefined, true)])).toBe(false);
});

it ('attr is S, D, I, G or boolean', () => {
    expect(validateSockets([createSocket(undefined, undefined, 'S')])).toBe(true);
    expect(validateSockets([createSocket(undefined, undefined, 'D')])).toBe(true);
    expect(validateSockets([createSocket(undefined, undefined, 'I')])).toBe(true);
    expect(validateSockets([createSocket(undefined, undefined, 'G')])).toBe(true);
    expect(validateSockets([createSocket(undefined, undefined, false)])).toBe(true);
    expect(validateSockets([createSocket(undefined, undefined, true)])).toBe(true);

    expect(validateSockets([createSocket(undefined, undefined, null)])).toBe(false);
    expect(validateSockets([createSocket(undefined, undefined, 'Y')])).toBe(false);
    expect(validateSockets([createSocket(undefined, undefined, 2)])).toBe(false);
    expect(validateSockets([createSocket(undefined, undefined, 'i')])).toBe(false);
});