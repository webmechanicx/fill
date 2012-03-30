(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }


  describe("fill", function() {


    it("should ignore null context", function() {
      return testFill(

        '<div></div>',

        { hello: 'Hello' },

        '<div></div>'

      );
    });


    it("should work with null data on a container", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="hello"></div>\
            <div class="goodbye"></div>\
          </div>\
        </div>',

        null,

        '<div>\
          <div class="container">\
          </div>\
        </div>'

      );
    });


    it("should work with null values", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="hello"></div>\
            <div class="goodbye"></div>\
          </div>\
        </div>',

        {
          hello: 'Hello'
        },

        '<div>\
          <div class="container">\
            <div class="hello">Hello</div>\
            <div class="goodbye"></div>\
          </div>\
        </div>'

      );
    });


    it("should work with null values", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="hello"></div>\
            <div class="goodbye"></div>\
          </div>\
        </div>',

        {
          hello: 'Hello',
          goodbye: null
        },

        '<div>\
          <div class="container">\
            <div class="hello">Hello</div>\
            <div class="goodbye"></div>\
          </div>\
        </div>'

      );
    });


    it("should assing data values to template via CSS", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="hello"></div>\
            <div class="goodbye"></div>\
          </div>\
        </div>',

        {
          hello: 'Hello',
          goodbye: 'Goodbye!'
        },

        '<div>\
          <div class="container">\
            <div class="hello">Hello</div>\
            <div class="goodbye">Goodbye!</div>\
          </div>\
        </div>'

      );
    });


    it("should handle nested templates", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="greeting">\
              <span class="name"></span>\
              <div class="greeting"></div>\
            </div>\
          </div>\
        </div>',

        {
          greeting: 'Hello',
          name: 'World'
        },

        '<div>\
          <div class="container">\
            <div class="greeting">Hello<span class="name">World</span>\
              <div class="greeting">Hello</div>\
            </div>\
          </div>\
        </div>'

      );
    });


    it("should work with numeric values", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="hello"></div>\
            <div class="goodbye"></div>\
          </div>\
        </div>',

        {
          hello: 'Hello',
          goodbye: 5
        },

        '<div>\
          <div class="container">\
            <div class="hello">Hello</div>\
            <div class="goodbye">5</div>\
          </div>\
        </div>'

      );
    });


    it("should match by element id, class, name and data-bind", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div id="my-id"></div>\
            <div class="my-class"></div>\
            <span></span>\
            <div data-bind="my-data"></div>\
          </div>\
        </div>',

        {
          'my-id': 'id-data',
          'my-class': 'class-data',
          span: 'name-data',
          'my-data': 'data-bind'
        },

        '<div>\
          <div class="container">\
            <div id="my-id">id-data</div>\
            <div class="my-class">class-data</div>\
            <span>name-data</span>\
            <div data-bind="my-data">data-bind</div>\
          </div>\
        </div>'

      );
    });


    it("should ignore functions in objects", function() {
      return testFill(

        '<div>\
          <div class="container">\
            <div class="hello"></div>\
            <div class="goodbye"></div>\
            <div class="skipped"></div>\
          </div>\
        </div>',

        {
          hello: 'Hello',
          goodbye: 5,
          skipped: function() {
            return "hello";
          }
        },

        '<div>\
          <div class="container">\
            <div class="hello">Hello</div>\
            <div class="goodbye">5</div>\
            <div class="skipped"></div>\
          </div>\
        </div>'

      );
    });
  });


}).call(this);
