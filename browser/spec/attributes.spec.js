(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }


  describe("fill attributes", function(){

    it("will set the text with _text", function(){
      return testFill(
        '\
          <div class="firstName"></div>\
          <div class="lastName"></div>\
        ',

        {
          firstName: { _text: 'Fred' },
          lastName:  'Smith'
        },

        '\
          <div class="firstName">Fred</div>\
          <div class="lastName">Smith</div>\
        '
      );
    });


    it("will set a zero value into an attribute", function(){
      return testFill(
        '\
          <div class="firstName"></div>\
        ',

        {
          firstName: { _id: 0 },
        },

        '\
          <div class="firstName" id="0"></div>\
        '
      );
    });


    it("will set the html with _html", function(){
      return testFill(
        '\
          <div class="firstName"></div>\
          <div class="lastName"></div>\
        ',

        {
          firstName: { _html: '<b>Dave</b>' },
          lastName:  null
        },

        '\
          <div class="firstName"><b>Dave</b></div>\
          <div class="lastName"></div>\
        '
      );
    });


    it("will set attributes using a underscore prefix", function(){
      return testFill(
        '\
          <a class="name"></a>\
        ',

        {
          name:  {
            _text: 'Linkity Link',
            _href: 'http://example.com',
            _name: 'link1'
          },
        },

        '\
          <a class="name" href="http://example.com" name="link1">Linkity Link</a>\
        '
      );
    });


    it("can set attributes on nested elements", function(){
      return testFill(
        '\
          <div class="person">\
            <div class="name"></div>\
            <div class="age"></div>\
          </div>\
        ',

        {
          person: {
            _name: 'john',
            name:  'John Doe',
            age: {
              _style: 'border:1px solid red; color: blue',
              _text:  22
            }
          },
        },

        '\
          <div class="person" name="john">\
            <div class="name">John Doe</div>\
            <div class="age" style="border:1px solid red; color: blue">22</div>\
          </div>\
        '
      );
    });

  });

}).call(this);
