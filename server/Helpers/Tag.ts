import * as html_minifier from 'html-minifier'

interface AttrFinder {
    attrFound : boolean,
    attrValue? : string
}

interface TagAttribute {
    attribute : string,
    value? : string
}

interface TagPosition {
    start : number,
    end : number
}

interface WholeTagPosition {
    openingStart : number,
    openingEnd : number,
    closingStart : number,
    closingEnd : number,
    tagBody? : string,
    innerHtml? : string,
}

class Tag {
    static findAttr (html : string, attr : string, tag : string = 'tbody') : AttrFinder {
        html = Tag.minifyHtml(html);
        const regExp : RegExp = new RegExp(`<${tag}[^>]* ${attr}="([^"]*)"[^>]*>`, 'i');
        const match : null | string[] = html.match(regExp);
        let result : AttrFinder = {
            attrFound: false
        };
        if (match !== null) {
            result.attrFound = true;
            result.attrValue = match[1]
        }
        return result;
    }

    static findTag (html: string, tag : string, tagAttributes? : TagAttribute[]) {
        html = Tag.minifyHtml(html);
        const openingTagsPositions : TagPosition[] = Tag.findTagsPositions(html, tag, true);
        const closingTagsPositions : TagPosition[] = Tag.findTagsPositions(html, tag, false);
        let sortedTags = Tag.sortNestedTags(openingTagsPositions, closingTagsPositions);
        sortedTags = Tag.findTagsHtml(sortedTags, html);
    }

    private static minifyHtml(html : string) {
        return html_minifier.minify(html, {
            collapseInlineTagWhitespace: true,
            collapseWhiteSpace: true,
            quoteCharacter: `"`,
            removeComments: true,
        });
    }

    private static sortNestedTags (openingTagsPositions : TagPosition[], closingTagsPosition : TagPosition[]) : WholeTagPosition[] {
        if (
            openingTagsPositions.length !== closingTagsPosition.length ||
            closingTagsPosition[0].start < openingTagsPositions[openingTagsPositions.length - 1].end
        ) {
            console.log(openingTagsPositions, closingTagsPosition);
            throw new Error('Something wrong with tags positions');
        }
        if (openingTagsPositions.length === 1) {
            //only one tag left
            return [{
                openingStart: openingTagsPositions[0].start,
                openingEnd: openingTagsPositions[0].end,
                closingStart: closingTagsPosition[0].start,
                closingEnd: closingTagsPosition[0].end
            }]
        }
        //need to find what tag closes first (first close tag position should be the most close to that opening tag)
        let firstClosingTag : number = -1;
        for (let i=0; i<openingTagsPositions.length-1; i++) {
            if (openingTagsPositions[i+1].start > closingTagsPosition[0].end) {
                firstClosingTag = i;
                break;
            }
        }
        if (firstClosingTag === -1) {
            //every opening tag starts earlier than first closing tag starts ->
            // the first closing tag refers to last opening
            firstClosingTag = openingTagsPositions.length-1
        }
        let tags : WholeTagPosition[] = [];
        tags.push({
            openingStart: openingTagsPositions[firstClosingTag].start,
            openingEnd: openingTagsPositions[firstClosingTag].end,
            closingStart: closingTagsPosition[0].start,
            closingEnd: closingTagsPosition[0].end
        });
        openingTagsPositions.splice(firstClosingTag,1);
        closingTagsPosition.shift();
        tags = tags.concat(Tag.sortNestedTags(openingTagsPositions, closingTagsPosition));
        return tags;
    }

    private static findTagsHtml(tagsPositions: WholeTagPosition[], html: string) : WholeTagPosition[] {
        return tagsPositions.map(tagData => {
            tagData.tagBody = html.slice(tagData.openingStart, tagData.openingEnd);
            tagData.innerHtml = html.slice(tagData.openingEnd, tagData.closingStart);
            return tagData;
        })
    }

    private static logTagsPositionsError(openingTags : TagPosition[], closingTags : TagPosition[]) {
        console.log(openingTags, closingTags);
        throw new Error('Something wrong with tags positions');
    }

    private static findTagsPositions (html : string, tag : string, openingTag : boolean = true) : TagPosition[] {
        let regExp : RegExp;
        if (openingTag) {
            regExp = new RegExp(`<${tag}[^>]*>`, 'ig');
        } else {
            regExp =  new RegExp(`<\/${tag}>`, 'ig');
        }
        let match : RegExpExecArray | null;
        let results : TagPosition[] = [];
        while ((match = regExp.exec(html)) != null) {
            results.push({
                start : match.index,
                end: match.index + match[0].length
            })
        }
        return results;
    }
}

export {Tag}