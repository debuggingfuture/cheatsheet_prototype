var _ = require("underscore");

var regex = /document\.write\(\'(.*)\'\)/g;
var EOLregex = /\\n|\n/g

var https = require('https');
var rest = require('restler');
/**
 * Take the gist script as input
 */
 function renderGistAsHTML(scriptContent) {
    //TODO perf tuning with 1 single regex
    //TODO potentially keep it let render engine decide
    // var escapedForEOL = escapedDocumentWrite.replace(EOLregex,'');
    var output = scriptContent.replace(regex, '$1').replace(EOLregex, '').replace(/<\\\//g, '</').replace(/\\"/g, '"');
    return output;
}

/*
* No need this extra wrap?
* handle the logic according to events
*/
// function renderOrErr(noErr,cb,result) {
// if(noErr) {
// cb(null, result);
// } else {
// console.log("fail");
// cb(new Error("connection failed"));
// }
// }

function renderByNameAndId(gistName, gistId,cb) {
     console.log(gistName,gistId);
    renderByUrl('https://gist.github.com/' + gistName + '/' + gistId + '.js',cb);
};
function renderByUrl(scriptUrl, cb) {
    var noErr = false;
    rest.get(scriptUrl).on('success', function(result) {
        console.log("result");
        // sys.puts('Error: ' + result.message);
        // this.retry(5000);
        // try again after 5 sec
        //TODO max retrial

        //TODO success including 301?

        console.log('Error:' + result.message);
        // cb(result);
        // renderOrErr(noErr,cb,result);

        cb(null, renderGistAsHTML(result));

    }).on('fail', function(data, res) {
        //4xx status code returned
        console.log('Error');
        // renderOrErr(noErr,cb);
        cb(new Error("failed"), res);
    }).on('error', cb);

    // cb(null, renderGistAsHTML(result));

    //TODO combine exception & cb for Error/fail/301 etc
}

function gistHTMLPrinter() {
    console.log("Gist Printer init");
    // XMLWriter.prototype = {
    }

    gistHTMLPrinter.renderByUrl = renderByUrl;
    gistHTMLPrinter.renderByNameAndId = renderByNameAndId;
    gistHTMLPrinter.renderGistAsHTML = renderGistAsHTML;

    if( typeof module != 'undefined')
        module.exports = gistHTMLPrinter;
    else
        window.gistHTMLPrinter = gistHTMLPrinter;
