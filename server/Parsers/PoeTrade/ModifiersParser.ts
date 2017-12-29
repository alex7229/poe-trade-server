import { Filters } from '../../types';

interface OptGroup {
    label: string;
    groupBody: string;
}

export class ModifiersParser {
    public static parseScriptData(data: string): Filters.Modifier[] {
        const groups: OptGroup[] = this.divideOnGroups(data);
        let modifiers: Filters.Modifier[] = [];
        for (const group of groups) {
            const values = this
                .parseOptions(group.groupBody)
                .map((value) => {
                    return {
                        type: group.label,
                        name: value
                    };
                });
            modifiers = modifiers.concat(values);
        }
        return modifiers;
    }

    private static divideOnGroups(data: string): OptGroup[] {
        const regExp = /<optgroup label=\\"([^\\]*)\\">(.*?)<\/optgroup>/g;
        let groups = [];
        let match;
        while ((match = regExp.exec(data)) !== null) {
            groups.push({
                label: match[1],
                groupBody: match[2]
            });
        }
        return groups;
    }

    private static parseOptions(data: string): string[] {
        const valuesRegExp = /value=\\"(.*?)\\"/g;
        let values: string[] = [];
        let match;
        while ((match = valuesRegExp.exec(data)) !== null && match[1] !== '') {
            const regExp = /\([^)]+\) /g;
            const pureValue = match[1].replace(regExp, '');
            values.push(pureValue);
        }
        return values;
    }
}