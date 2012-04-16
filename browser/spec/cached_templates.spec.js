(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }

  describe("fill caching", function() {

    it("mutlple passes on templates", function() {
      var data, doc, expected;

      doc = jQuery('<div>\
        <div class="container">\
          <div class="message">\
            <span class="hello"></span>\
            <span class="world"></span>\
          </div>\
        </div>\
      </div>');

      data = {
        message: [
          {
            hello: "Hello",
            world: "World!"
          }, {
            hello: "Goodbye",
            world: "Canada!"
          }
        ]
      };

      expected = jQuery('<div>\
        <div class="container">\
          <div class="message">\
            <span class="hello">Hello</span>\
            <span class="world">World!</span>\
          </div>\
          <div class="message">\
            <span class="hello">Goodbye</span>\
            <span class="world">Canada!</span>\
          </div>\
        </div>\
      </div>');

      doc.find('.container').fill(data);
      doc.find('.container').fill(data);

      return expect(doc.html()).htmlToBeEqual(expected.html());
    });
  });

}).call(this);
