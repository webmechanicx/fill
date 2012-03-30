(function() {
  var fill;


  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
    fill = require('../src/fill');
  }


  describe("fill", function() {
    it("should fill values in form inputs and textarea elements", function() {
      return testFill(

        '<input name="name" type="text" />\
        <input name="job"  type="text" />\
        <textarea name="resume"></textarea>',

        {
          name:    'John',
          job:     'Milkman',
          resume:  "Jack of all trades"
        },

        '<input name="name" type="text" value="John" />\
        <input name="job"  type="text" value="Milkman" />\
        <textarea name="resume">Jack of all trades</textarea>'

      );
    });


    it("should fill values in option elements", function() {

      var doc = jQuery(
        '<form>\
          <select id="states">\
            <option class="state"></option>\
          </select>\
        </form>'
      );

      var data = {
        states: [
          {
            id: 1,
            state: 'Alabama'
          }, {
            id: 2,
            state: 'Alaska'
          }, {
            id: 3,
            state: 'Arizona'
          }
        ]
      };

      var directives = {
        states: {
          state: function() {
            return {
              value: this.id
            };
          }
        }
      };

      var expected = jQuery(
        '<form\
          <select id="states">\
            <option class="state" value="1">Alabama</option>\
            <option class="state" value="2">Alaska</option>\
            <option class="state" value="3">Arizona</option>\
          </select>\
        </form>'
      );

      fill(doc, data, directives);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });
  });

}).call(this);
