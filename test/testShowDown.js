/**
 * 
 */

 var Showdown = require('showdown');
 var cheeatzMd = require('../lib/cheeatzMd');
 var converter_noex = new Showdown.converter();
 var converter_cheeatz = new Showdown.converter({extensions: [cheeatzMd] });

 var fs = require("fs");

 exports['normal shown down'] = function(test) {
 	var output = converter_noex.makeHtml('#hello, markdown');
 	console.log(output);
 	test.equals(output, '<h1 id="hellomarkdown">hello, markdown</h1>');
 	test.done();
 };


 exports['shown down with cheeatz'] = function(test) {
 	var cheeatzInput = fs.readFileSync('test/eng_compiled_test_input.md').toString();
 	var output = converter_cheeatz.makeHtml(cheeatzInput);
 	console.log(output);
 	test.equals(output, '<h1 id="hellomarkdown">hello, markdown</h1>');
 	test.done();
 };


 exports['shown down wont do anything to gist tag'] = function(test) {
 	var cheeatzInput = fs.readFileSync('test/eng_compiled_test_input.md').toString();
 	var output = converter_noex.makeHtml(cheeatzInput);
 	console.log(output);
 	test.equals(output, '<h2 id="title">Title</h2>\n\n<h3 id="listprocessrunningonports">List process running on ports</h3>\n\n<p><gist user=\'vincentlaucy\' id=\'5517133\'></p>\n\n<p></gist></p>\n\n<h3 id="moredetails">More Details</h3>\n\n<h4 id="testedin">Tested in</h4>\n\n<h3 id="listallprocessrunningonports">List all process running on ports</h3>\n\n<p><gist user=\'vincentlaucy\' id=\'123\'></p>\n\n<p></gist></p>');
 	test.done();
 };
 
