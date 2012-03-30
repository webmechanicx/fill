(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }


  describe("fill", function() {

    xit("should provide reference to original data", function() {
      var data;

      var doc = jQuery('<div>\
        <div class="person">\
          <span class="name"></span>\
          <span class="email"></span>\
        </div>\
      </div>');

      var person = {
        name: 'Jasmine Taylor',
        email: 'jasmine.tailor@example.com'
      };

      doc.find('.person').fill(person);
      data = doc.find('.name').data('data');

      return expect(data).toEqual(person);
    });


    xit("should allow updating original data", function() {
      var data;

      var doc = jQuery('<div>\
        <div class="person">\
          <span class="name"></span>\
          <span class="email"></span>\
        </div>\
      </div>');

      var person = {
        name: 'Jasmine Taylor',
        email: 'jasmine.tailor@example.com'
      };

      doc.find('.person').fill(person);
      data = doc.find('.person .name').data('data');
      data.name = 'Frank Sinatra';

      return expect(data.name).toEqual(person.name);
    });
  });


}).call(this);
