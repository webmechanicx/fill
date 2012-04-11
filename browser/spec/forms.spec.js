(function() {


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

      return testFill(

        '<div>\
          <div class="container">\
            <form>\
              <select id="states">\
                <option class="state"></option>\
              </select>\
            </form>\
          </div>\
        </div>',

        {
          states: [
            {
              state: {
                _value: 1,
                _text: 'Alabama'
              }
            }, {
              state: {
                _value: 2,
                _text: 'Alaska'
              }
            }, {
              state: {
                _value: 3,
                _text: 'Arizona'
              }
            }
          ]
        },

        '<div>\
          <div class="container">\
            <form>\
              <select id="states">\
                <option class="state" value="1">Alabama</option>\
                <option class="state" value="2">Alaska</option>\
                <option class="state" value="3">Arizona</option>\
              </select>\
            </form>\
          </div>\
        </div>'
      );

    });
  });

}).call(this);
