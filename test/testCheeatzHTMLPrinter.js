/**
 *
 */

var Showdown = require('showdown');
var cheeatzMd = require('../lib/cheeatzMd');
var converter_noex = new Showdown.converter();
var converter_cheeatz = new Showdown.converter({
    extensions : [cheeatzMd]
});

var enml = require("enml-js");
var postscribe = require("postscribe/postscribe");
var gistHTMLPrinter = require("../lib/gistHTMLPrinter");
var fs = require("fs");
var _ = require("underscore");
var gistTagParser = require("../lib/gistTagParser");
var utils = require("./utils");



exports['compile from md and render as HTML'] = function(test) {
    var cheeatzInput = fs.readFileSync('test/eng_compiled_test_input.md').toString();
    var showDownCheeatz = converter_noex.makeHtml(cheeatzInput);
    var compiledENML = enml.ENMLOfPlainText(showDownCheeatz);
    var htmlOutput = enml.HTMLOfENML(compiledENML);
    console.log(htmlOutput);
    var expected ='';
    gistTagParser.renderGistTag(htmlOutput, function(output) {
        utils.printResults(output,expected);
        test.equals(output, expected);
        test.done();
    });
}