(function() {


  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
    fill = require('../src/fill');
  }


  describe("fill forms", function() {
    it("should fill values in form inputs and textarea elements", function() {
      return testFill(

        '<input name="name" type="text" />\
        <input name="job"  type="text" value="Worker"/>\
        <input name="age"  type="text" value="Default"/>\
        <input name="skill"  type="text" value="Laser Vision"/>\
        <textarea name="resume"></textarea>',

        {
          name:    'John',
          job:     null,
          age:     undefined,
          resume:  "Jack of all trades"
        },

        '<input name="name" type="text" value="John" />\
        <input name="job"  type="text" value="" />\
        <input name="age"  type="text" value=""/>\
        <input name="skill"  type="text" value="Laser Vision"/>\
        <textarea name="resume">Jack of all trades</textarea>'

      );
    });


    it("should fill values in option elements", function() {

      return testFill(

        '<form>\
          <select id="states">\
            <option class="state"></option>\
          </select>\
        </form>',

        {
          option: [
            { _value: 1, _text: 'Alabama' },
            { _value: 2, _text: 'Alaska'  },
            { _value: 3, _text: 'Arizona' }
          ]
        },

        '<form>\
          <select id="states">\
            <option class="state" value="1">Alabama</option>\
            <option class="state" value="2">Alaska</option>\
            <option class="state" value="3">Arizona</option>\
          </select>\
        </form>'
      );

    });
  });

}).call(this);
