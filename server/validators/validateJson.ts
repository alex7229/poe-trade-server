export const validate = (possibleJson: string ): boolean => {
    try {
        JSON.parse(possibleJson);
        return true;
    } catch (err) {
        return false;
    }
};