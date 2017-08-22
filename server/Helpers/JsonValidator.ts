class JsonValidator {
    static validate (possibleJson : any) : boolean {
        try {
            JSON.parse(possibleJson)
        } catch (err) {
            return false;
        }
        return true;
    }
}

export {JsonValidator}