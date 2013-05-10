/**
 *
 */
var enml = require("enml-js");
var postscribe = require("postscribe/postscribe");
var gistHTMLPrinter = require("../lib/gistHTMLPrinter");
var fs = require("fs");
var _ = require("underscore");
var gistTagParser = require("../lib/gistTagParser");
var utils = require("./utils");


exports['render plain test'] = function(test) {
    var output = enml.ENMLOfPlainText("Hello");
    console.log(output);
    test.done();
};

exports['render ENML with no esacpe then unescape'] = function(test) {
    var output = enml.ENMLOfPlainText("<a href=\"www.google.com\">test</a>");
    output = _.unescape(output);
    //dirty-quick, problem: unescape also intentionally escaped HTML
    console.log(output);
    test.done();
};

exports['render ENML will esacpe HTML (By XML writer)'] = function(test) {
    var output = enml.ENMLOfPlainText("<a href=\"www.google.com\">test</a>");
    console.log(output);
    test.done();
};
exports['test ENML escape'] = function(test) {
    var input = '&';
    //become &amp with div tags. when show in Evernote is & itself, just HTMLofENML wont?
    var expected = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">\n<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><div>&amp;</div>\n</en-note>';
    var output = enml.ENMLOfPlainText(input);
    console.log(output);
    test.equals(output,expected);
    test.done();
    
};
exports['render HTML again wont unescape html using original'] = function(test) {
    var output = enml.ENMLOfPlainText("<a href=\"www.google.com\">test</a>");
    var htmlOutput = enml.HTMLOfENML(output);
    console.log(htmlOutput);
    //TODO assert there is >&lt;
    //do unescape after code change on eml-js
    test.done();
};
exports['render ENML'] = function(test) {
    var input = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><div>Hello</div></en-note>';
    var htmlOutput = enml.HTMLOfENML(input);
    //render html from sever in browser
    //how to input? hardcode / input box
    console.log(htmlOutput);
    test.done();
};
exports['regex for remove document.write'] = function(test) {
    var regex = /document\.write\(\'(.*)\'\)/g;
    var gistJsInput = 'document.write(\'<link href=\"https://gist.github.com/assets/embed-17ab34a51711628d8f5449c4663a9318.css\" media=\"screen\" rel=\"stylesheet\" />\')';
    var output = gistJsInput.replace(regex, '$1');
    console.log(gistJsInput);
    console.log(output);
    //refer to https://gist.github.com/vincentlaucy/800d49c23e0a46d07556.js
    test.equals(output, '<link href=\"https://gist.github.com/assets/embed-17ab34a51711628d8f5449c4663a9318.css\" media=\"screen\" rel=\"stylesheet\" />');
    gistJsInput2 = 'document.write(\'<div>document.write(&#39;test&#39;);<\/div>\')';
    output2 = gistJsInput2.replace(regex, '$1');
    test.equals(output2, '<div>document.write(&#39;test&#39;);<\/div>');
    test.done();
    // test.expect(1);

    //TODO test case against \n char inside document write
};
exports['renderGistAsHTML test'] = function(test) {
    var input = fs.readFileSync("test/gist_test_input.js").toString();
    var output = gistHTMLPrinter.renderGistAsHTML(input);
    output = _.unescape(output).replace(/\&#39;/g, '\'');
    //unescape didnt work as looking for Hex &#x27;
    var expected = fs.readFileSync("test/gist_test_expected.html").toString();
    expected = expected.replace(/\n/g, '');
    console.log("===output===");
    console.log(output);
    console.log("===expected===");
    console.log(expected);
    //TODO equals ignore space between tags and control chars
    test.equals(output, expected);
    test.done();
};

exports['render gist HTML from gist Id'] = function(test) {
    gistHTMLPrinter.renderByUrl("https://gist.github.com/vincentlaucy/5517133.js", function(err, result) {
        console.log(result);
        test.ok(!err);
        test.done();
    });

    // console.log(postscribe);
    // console.log(gistHTMLPrinter.render(gistJsInput));

    // postscribe(null, gistJsInput);
    //
    // var vm = require('vm');
    // var script = vm.createScript(gistJsInput, 'myfile.vm');
    // script.runInThisContext();
    // var input = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><div>Hello</div>' + gistJsInput + '</en-note>';
    // var htmlOutput = enml.HTMLOfENML(input);
    //render html from sever in browser
    //how to input? hardcode / input box
    // console.log(output);
};

exports['render gist not exist'] = function(test) {
    gistHTMLPrinter.renderByUrl("https://gist.github.com/vincentlaucy/1234.js", function(err, cb) {
        console.log(err);
        test.ok( err instanceof Error);
        // test.ok(err.message=="shits");
        test.done();
    });

};

/* TODO
 * Randomly pick some gist , run it in different browser with selenium, compare the html with those render by printer
 */
exports['printer output should be same as embeded'] = function(test) {
    test.done();
};

exports['render ENML as HTML, with cpmpiled gist inside as HTML'] = function(test) {
    var input = fs.readFileSync("test/gist_test_input.js").toString();
    var output = gistHTMLPrinter.renderGistAsHTML(input);
    // var output = enml.ENMLOfPlainText("Hello");
    console.log(output);
    var ENMLwithGist = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">\n<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">' + output + '</en-note>';
    var htmlOutput = enml.HTMLOfENML(ENMLwithGist);
    console.log(htmlOutput);
    //TODO assert
    test.done();
};
exports['render compiled Gist to ENML will add unnecessary \n'] = function(test) {
    var compiledGist = fs.readFileSync("test/gist_test_expected.html").toString();
    var output = enml.ENMLOfPlainText(compiledGist);
    // compiledGist
    console.log(output);
    // var output = gistHTMLPrinter.renderGistAsHTML(input);

    test.done();
    // engInput
};
//Conclusion: should add HTML of gist into ENML afterwards
//add to HTML afterwards? ok in preview, but not sotred

/*
 * gist output are subset of ENML!
 * using the parser
 */
exports['render gist tags inside ENML'] = function(test) {
    var engInput = fs.readFileSync('test/ENML_with_gist.xhtml').toString();

    gistTagParser.renderGistTag(engInput, function(renderedGist) {
        console.log("rendered");
        console.log(renderedGist);
        //test.equals()
        //TODO assert equals to expected gist output
        test.done();
    });
    // console.log(output);

    // var output = gistHTMLPrinter.renderGistAsHTML(input);
    // engInput
};
// chars like \n will faile enml-js
//enml-js will also put ' into ""
//should render ENML first?
exports['render gist tags inside ENML and put it back'] = function(test) {
    var enmlInput = fs.readFileSync('test/ENML_with_gist.xhtml').toString();
    var compiledENML = enml.HTMLOfENML(enmlInput);
    console.log("compiledENML");
    console.log(compiledENML);
    var expected = fs.readFileSync('test/ENML_with_gist_expected.html').toString();
    gistTagParser.renderGistTag(compiledENML, function(output) {
        console.log("rendered");
        // accoridng to index of matches
        console.log(output);
        test.equals(output, expected);
        test.done();
    });
    // console.log(output);

    // var output = gistHTMLPrinter.renderGistAsHTML(input);
    // engInput
};

exports['render gist tag inside HTML and put it back '] = function(test) {
    var input = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;" style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><gist user="vincentlaucy" id="5548010"/><div>Test1</div><gist user="vincentlaucy" id="123"/><div>Test2</div></body></html>';
    var expected = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;" style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><link href="https://gist.github.com/assets/embed-17ab34a51711628d8f5449c4663a9318.css" media="screen" rel="stylesheet" /><div id="gist5548010" class="gist">      <div class="gist-file">        <div class="gist-data gist-syntax">  <div class="file-data">    <table cellpadding="0" cellspacing="0" class="lines highlight">      <tr>        <td class="line-numbers">          <span class="line-number" id="file-gistfile1-js-L1" rel="file-gistfile1-js-L1">1</span>        </td>        <td class="line-data">          <pre class="line-pre"><div class="line" id="file-gistfile1-js-LC1"><span class="nb">document</span><span class="p">.</span><span class="nx">write</span><span class="p">(</span><span class="s1">&#39;test&#39;</span><span class="p">);</span></div></pre>        </td>      </tr>    </table>  </div>        </div>        <div class="gist-meta">          <a href="https://gist.github.com/vincentlaucy/5548010/raw/094a3e07ef9196894df510e6c1b7add8c3ae3c64/gistfile1.js" style="float:right">view raw</a>          <a href="https://gist.github.com/vincentlaucy/5548010#file-gistfile1-js" style="float:right; margin-right:10px; color:#666;">gistfile1.js</a>          <a href="https://gist.github.com/vincentlaucy/5548010">This Gist</a> brought to you by <a href="http://github.com">GitHub</a>.        </div>      </div></div><div>Test1</div><gist user="vincentlaucy" id="123"/><div>Test2</div></body></html><div><em>Sorry This Gist render failed!</em></div><div>Test2</div></body></html>';
    gistTagParser.renderGistTag(input, function(output) {
        utils.printResults(expected, output);
        test.equals(output, expected);
        test.done();
    });
}



/*
 *
 */

