class JsonValidator {
    // workaround for 'no-any'
    static validate (possibleJson: string | object | undefined | number | null): possibleJson is string {
        if (typeof possibleJson !== 'string') {
            return false;
        }
        try {
            JSON.parse(possibleJson);
        } catch (err) {
            return false;
        }
        return true;
    }
}

export {JsonValidator};