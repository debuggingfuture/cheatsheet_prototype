/**
 *
 */
var _ = require("underscore");
var gistHTMLPrinter = require('./gistHTMLPrinter');

function GistTagParser() {
    console.log("EngistchPrinter init");
    // XMLWriter.prototype = {
}

var header = 'This CheatSheet\'s link';

function addHeader() {
    return header;
};

//regex helper. 
function matchAll(regex, source, cb) {
    while( match = regex.exec(source)) {
        cb(match);
        // avoid an infinite loop on zero-length matches
        if(regex.lastIndex == match.index) {
            regex.lastIndex++;
        }
    }
};

/*
* Simple: just keep replacing
* render markdown by part or skip markdown for inside git tag.
*
* Since async, replace with dummy tag first
*
* http://blog.stevenlevithan.com/archives/javascript-match-recursive-regexp
*/
//TODO id/ name order may be different inside gist, later..
function renderGistTag(source, cb) {
    //use original to replace vs put chunk by chunk
    var output = '';
    var regex = new RegExp("<gist *user=['\"]([^'\"]*)['\"] *id=['\"]([^'\"]*)['\"] */+>", "g");
    //TODO must match all before render?
    var matches = [], match;
    var renderedGist = {};
    var handled = 0;
    var matchIndex = 0;
    function renderGistTagMatch(index, match, renderedGist) {
        var name = match[1];
        var id = match[2];
        gistHTMLPrinter.renderByNameAndId(name, id, function(err, result) {
            console.log("renderByNameId");
            if(!err) {
                renderedGist[index] = result;
            }
            handled++;
            onRenderComplete(cb);
        });

        //TODO use EVENT of all rendered
        // require("events").EventEmitter;
        //put that back whenever one rendered? will break exisitng lenght, but no problem if write to new file
        function onRenderComplete(cb) {
            if(matches.length == handled) {
                console.log("all rendered");
                var output = printNewOutput();
                cb(output, renderedGist);
            }
        }

        function printNewOutput() {
            var lastEnd = 0;
            _.each(matches, function(tagMeta, index) {
                output += source.substr(lastEnd, tagMeta.start);
                var gistHTML = renderedGist[tagMeta.key];

                if(gistHTML) {
                    output += gistHTML;
                } else {
                    //remove existing tag
                    var failed = "<div><em>Sorry This Gist render failed!</em></div>";
                    output += failed;
                }
                    lastEnd = tagMeta.end;
            });
            //render the rest
            output += source.substr(lastEnd, source.length);
            return output;
        }
    }

    matchAll(regex, source, function(match) {
        var tagMeta = {};
        tagMeta['start'] = match.index;
        tagMeta['end'] = regex.lastIndex;
        tagMeta['key'] = matchIndex;
        matches.push(tagMeta);
        console.log(match);
        renderGistTagMatch(matchIndex++, match, renderedGist);
    });
    console.log("gists found: " + matches.length);
};

GistTagParser.renderGistTag = renderGistTag;
// EngistchPrinter.renderById = renderById;
// EngistchPrinter.renderGistAsHTML = renderGistAsHTML;

if( typeof module != 'undefined')
    module.exports = GistTagParser;
else
    window.GistTagParser = GistTagParser;

