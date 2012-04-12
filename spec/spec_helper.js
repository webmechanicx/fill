(function() {


  if (typeof module !== 'undefined' && module.exports) {
    var jsdom = require('jsdom/lib/jsdom').jsdom;
    global.document = jsdom("<html><head></head><body>hello world</body></html>");
    global.window = document.createWindow();
    jsdom = require('jsdom');
    global.jQuery = require('jquery');

    // attach fill to the window object for testing in node
    window.fill = require('../src/fill');
  }


  // create a helper method to make it easier to test the fill method
  window.testFill = function(html, data, expected){
    var before = jQuery(html);
    var after = jQuery(expected);

    window.fill(before.find('.container'), data);
    return expect(before.html()).htmlToBeEqual(after.html());
  };


  // export the testFill method to the global scope for testing on node
  if (typeof global !== 'undefined') {
    global.testFill = window.testFill;
  }


  beforeEach(function() {
    return this.addMatchers({
      htmlToBeEqual: function(expected) {
        var actual, formatHtml;
        formatHtml = function(html) {
          return html.replace(/\s/g, '').toLowerCase();
        };
        actual = formatHtml(this.actual);
        expected = formatHtml(expected);
        this.message = function() {
          return actual + '\n\n' + expected;
        };
        return actual === expected;
      }
    });
  });

}).call(this);
