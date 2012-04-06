(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }


  describe("fill", function(){

    it("will set the text with _text", function(){
      return testFill(
        '\
          <div>\
            <div class="container">\
              <div class="firstName"></div>\
              <div class="lastName"></div>\
            </div>\
          </div>\
        ',

        {
          firstName: { _text: 'Fred' },
          lastName:  'Smith'
        },

        '\
          <div>\
            <div class="container">\
              <div class="firstName">Fred</div>\
              <div class="lastName">Smith</div>\
            </div>\
          </div>\
        '
      );
    });


    it("will set the html with _html", function(){
      return testFill(
        '\
          <div>\
            <div class="container">\
              <div class="firstName"></div>\
              <div class="lastName"></div>\
            </div>\
          </div>\
        ',

        {
          firstName: { _html: '<b>Dave</b>' },
          lastName:  null
        },

        '\
          <div>\
            <div class="container">\
              <div class="firstName"><b>Dave</b></div>\
              <div class="lastName"></div>\
            </div>\
          </div>\
        '
      );
    });


    it("will set attributes using a underscore prefix", function(){
      return testFill(
        '\
          <div>\
            <div class="container">\
              <a class="name"></a>\
            </div>\
          </div>\
        ',

        {
          name:  {
            _text: 'Linkity Link',
            _href: 'http://example.com',
            _name: 'link1'
          },
        },

        '\
          <div>\
            <div class="container">\
              <a class="name" href="http://example.com" name="link1">Linkity Link</a>\
            </div>\
          </div>\
        '
      );
    });


    it("can set attributes on nested elements", function(){
      return testFill(
        '\
          <div>\
            <div class="container">\
              <div class="person">\
                <div class="name"></div>\
                <div class="age"></div>\
              </div>\
            </div>\
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
          <div>\
            <div class="container">\
              <div class="person" name="john">\
                <div class="name">John Doe</div>\
                <div class="age" style="border:1px solid red; color: blue">22</div>\
              </div>\
            </div>\
          </div>\
        '
      );
    });

  });

}).call(this);
