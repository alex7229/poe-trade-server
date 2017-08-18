class JsonValidator {
    static validate (json : string) : boolean {
        try {
            JSON.parse(json)
        } catch (err) {
            return false;
        }
        return true;
    }
}

export {JsonValidator}