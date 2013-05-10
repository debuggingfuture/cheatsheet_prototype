/**
 * Written as extension to showdown.js
 * to accept <gist> tag
 * which is like <gist name="vincentlaucy" id="12345" />
 */

( function() {
        //results load in printer before here is reached
        //whenever makeHtml is called
        //dynamic extension?
        var gistPrinter = require('./gistHTMLPrinter');

        var cheeatzMd = function(converter) {

            var gistTag = {
                type : 'lang',
                regex : '<gist.*user=\'(.*)\' *id=\'(.*)\'.*/*>',
                replace : function(match, name, id, suffix) {

                    gistPrinter.renderById('vincentlaucy', '55', function(err, result) {

                    });
                    return '<link href="https://gist.github.com/assets/embed-17ab34a51711628d8f5449c4663a9318.css" media="screen" rel="stylesheet" /><div id="gist5520682" class="gist"><div></div>';
                }
            };

            return [gistTag];
        };

        // Client-side export
        if( typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
            window.Showdown.extensions.cheeatzMd = cheeatzMd;
        }
        // Server-side export
        if( typeof module !== 'undefined')
            module.exports = cheeatzMd;

    }());
