interface AttrFinder {
    attrFound: boolean;
    attrValue?: string;
}

interface Attribute {
    name: string;
    value?: string;
}

interface TagPosition {
    start: number;
    end: number;
}

interface WholeTagPosition {
    openingStart: number;
    openingEnd: number;
    closingStart: number;
    closingEnd: number;
}

interface TagData extends WholeTagPosition {
    tagBody: string;
    innerHtml: string;
}

class Tag {
    static findAttr (html: string,   attr: string, tag: string): AttrFinder {
        // find all calls to this method and refactor correspondingly
        // make similar to findTag method
        // refactor in future
        html = Tag.removeBreakLines(html);
        const regExp: RegExp = new RegExp(`<${tag}[^>]* ${attr}="([^"]*)"[^>]*>`, 'i');
        const match: null | string[] = html.match(regExp);
        let result: AttrFinder = {
            attrFound: false
        };
        if (match !== null) {
            result.attrFound = true;
            result.attrValue = match[1];
        }
        return result;
    }

    static findTag (html: string, tag: string, tagAttributes: Attribute[] = [], unique?: boolean): TagData[] {
        html = Tag.removeBreakLines(html);
        const openingTagsPositions: TagPosition[] = Tag.findTagsPositions(html, tag, true);
        const closingTagsPositions: TagPosition[] = Tag.findTagsPositions(html, tag, false);
        let tagsPositions = Tag.sortNestedTags(openingTagsPositions, closingTagsPositions);
        let tagsData = Tag.findTagsHtml(tagsPositions, html);
        const tagsDataFiltered =  tagsData.filter(currentTag => {
            return tagAttributes.every(attrData => {
                const foundedAttr: AttrFinder = Tag.findAttr(currentTag.tagBody, attrData.name, tag);
                if (!foundedAttr.attrFound) {
                    return false;
                }
                if (attrData.value && attrData.value !== foundedAttr.attrValue) {
                    return false;
                }
                return true;
            });
        });
        if (unique && tagsDataFiltered.length !== 1) {
            throw new Error(`total tags count is ${tagsData.length} -> more than 1. This  tag should be unique`);
        }
        return tagsDataFiltered;
    }

    private static removeBreakLines(html: string) {
        return html.replace(/<br>/ig, '');
    }

    private static sortNestedTags (
        openingTagsPositions: TagPosition[],
        closingTagsPosition: TagPosition[]
    ): WholeTagPosition[] {
        if (
            openingTagsPositions.length !== closingTagsPosition.length ||
            openingTagsPositions[0].start > closingTagsPosition[closingTagsPosition.length - 1].end
        ) {
            throw new Error('Something wrong with tags positions');
        }
        if (openingTagsPositions.length === 1) {
            // only one tag left
            return [{
                openingStart: openingTagsPositions[0].start,
                openingEnd: openingTagsPositions[0].end,
                closingStart: closingTagsPosition[0].start,
                closingEnd: closingTagsPosition[0].end
            }];
        }
        // need to find what tag closes first (first close tag position should be the most close to that opening tag)
        let firstClosingTag: number | undefined;
        for (let i = 0; i < openingTagsPositions.length - 1; i++) {
            if (openingTagsPositions[i + 1].start > closingTagsPosition[0].end) {
                firstClosingTag = i;
                break;
            }
        }
        if (firstClosingTag === undefined) {
            // every opening tag starts earlier than first closing tag starts ->
            // the first closing tag refers to last opening
            firstClosingTag = openingTagsPositions.length - 1;
        }
        let tags: WholeTagPosition[] = [];
        tags.push({
            openingStart: openingTagsPositions[firstClosingTag].start,
            openingEnd: openingTagsPositions[firstClosingTag].end,
            closingStart: closingTagsPosition[0].start,
            closingEnd: closingTagsPosition[0].end
        });
        openingTagsPositions.splice(firstClosingTag, 1);
        closingTagsPosition.shift();
        tags = tags.concat(Tag.sortNestedTags(openingTagsPositions, closingTagsPosition));
        return tags;
    }

    private static findTagsHtml (tagsPositions: WholeTagPosition[], html: string): TagData[]  {
        return tagsPositions.map(tagData => {
            return Object.assign(tagData, {
                tagBody:  html.slice(tagData.openingStart, tagData.openingEnd),
                innerHtml: html.slice(tagData.openingEnd, tagData.closingStart)
            });
        });
    }

    private static findTagsPositions (html: string, tag: string, openingTag: boolean = true): TagPosition[] {
        let regExp: RegExp;
        if (openingTag) {
            regExp = new RegExp(`<${tag}[^>]*>`, 'ig');
        } else {
            regExp =  new RegExp(`<\/${tag}>`, 'ig');
        }
        let match: RegExpExecArray | null;
        let results: TagPosition[] = [];
        while ((match = regExp.exec(html)) != null) {
            results.push({
                start: match.index,
                end: match.index + match[0].length
            });
        }
        return results;
    }
}

export {Tag, AttrFinder, Attribute, TagData};