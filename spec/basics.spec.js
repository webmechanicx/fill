(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }


  describe("fill basics", function() {


    it("should work with the example from the readme", function() {


      return testFill(

        '<div id="template">\
          <h2 class="project"></h2>\
          <div data-bind="details">\
            <a name="githubLink"></a>\
            <ul class="features">\
              <li></li>\
            </ul>\
          </div>\
        </div>',

        {
          project: 'Fill',
          details: {
            githubLink: { _text: 'Fill', _href: 'https://github.com/profit-strategies/fill' },
            ul: {
              _style: 'color:green',
              li: [
                'Uses plain HTML with no extra templating markup',
                'Runs on the client or server (with jsdom)',
                'Render arrays without loops or partials',
                'Nested objects and collections',
                'Compatible (tested on IE6+, Chrome and Firefox)',
              ]
            }
          }
        },

        '<div id="template">\
          <h2 class="project">Fill</h2>\
          <div data-bind="details">\
            <a name="githubLink" href="https://github.com/profit-strategies/fill">Fill</a>\
            <ul class="features" style="color:green">\
              <li>Uses plain HTML with no extra templating markup</li>\
              <li>Runs on the client or server (with jsdom)</li>\
              <li>Render arrays without loops or partials</li>\
              <li>Nested objects and collections</li>\
              <li>Compatible (tested on IE6+, Chrome and Firefox)</li>\
            </ul>\
          </div>\
        </div>'
      );
    })


    it("should ignore null context", function() {
      return testFill(

        '<div></div>',

        { hello: 'Hello' },

        '<div></div>'

      );
    });


    it("should work with null data on a container", function() {
      return testFill(

        '<div class="hello"></div>\
         <div class="goodbye"></div>',

        null,

        ''

      );
    });


    it("should work with null values", function() {
      return testFill(

        '<div class="hello"></div>\
         <div class="goodbye"></div>',

        {
          hello: 'Hello'
        },

        '<div class="hello">Hello</div>\
         <div class="goodbye"></div>'

      );
    });


    it("should work with null values", function() {
      return testFill(

        '<div class="hello"></div>\
         <div class="goodbye"></div>',

        {
          hello: 'Hello',
          goodbye: null
        },

        '<div class="hello">Hello</div>\
         <div class="goodbye"></div>'

      );
    });


    it("should assing data values to template via CSS", function() {
      return testFill(

        '<div class="hello"></div>\
         <div class="goodbye"></div>',

        {
          hello: 'Hello',
          goodbye: 'Goodbye!'
        },

        '<div class="hello">Hello</div>\
         <div class="goodbye">Goodbye!</div>'

      );
    });


    it("should stop at the first match on nested templates", function() {
      return testFill(

        '<div class="greeting">\
          <span class="name"></span>\
          <div class="greeting"></div>\
        </div>',

        {
          greeting: 'Hello',
          name: 'World'
        },

        '<div class="greeting">Hello<span class="name">World</span>\
          <div class="greeting"></div>\
        </div>'

      );
    });


    it("should work with numeric values", function() {
      return testFill(

        '<div class="hello"></div>\
        <div class="goodbye"></div>',

        {
          hello: 'Hello',
          goodbye: 5
        },

        '<div class="hello">Hello</div>\
        <div class="goodbye">5</div>'

      );
    });


    it("should work with multiple matching elements", function() {
      return testFill(

        '<div class="hello"></div>\
        <div class="hello"></div>',

        {
          hello: 'Hello',
        },

        '<div class="hello">Hello</div>\
        <div class="hello">Hello</div>'

      );
    });


    it("should match by element id, class, name and data-bind", function() {
      return testFill(

        '<div id="my-id"></div>\
        <div class="my-class"></div>\
        <span></span>\
        <div data-bind="my-data"></div>',

        {
          'my-id': 'id-data',
          'my-class': 'class-data',
          span: 'name-data',
          'my-data': 'data-bind'
        },

        '<div id="my-id">id-data</div>\
        <div class="my-class">class-data</div>\
        <span>name-data</span>\
        <div data-bind="my-data">data-bind</div>'

      );
    });


    it("should ignore functions in objects", function() {
      return testFill(

        '<div class="hello"></div>\
        <div class="goodbye"></div>\
        <div class="skipped"></div>',

        {
          hello: 'Hello',
          goodbye: 5,
          skipped: function() {
            return "hello";
          }
        },

        '<div class="hello">Hello</div>\
        <div class="goodbye">5</div>\
        <div class="skipped"></div>'

      );
    });


  });


}).call(this);
