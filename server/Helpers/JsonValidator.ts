class JsonValidator {
    static validate (possibleJson : any) : possibleJson is string {
        try {
            JSON.parse(possibleJson)
        } catch (err) {
            return false;
        }
        return true;
    }
}

export {JsonValidator}