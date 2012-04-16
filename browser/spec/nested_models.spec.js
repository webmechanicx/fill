(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }

  describe("fill nested", function() {


    it("should handle nested lists", function() {
      return testFill(

        '\
          <h1 class="title"></h1>\
          <p class="post"></p>\
          <div class="comments">\
            <div class="comment">\
              <span class="name"></span>\
              <span class="text"></span>\
            </div>\
          </div>\
        ',

        {
          title: 'Hello World',
          post: 'Hi there it is me',
          comment: [
            {
              name: 'John',
              text: 'That rules'
            },
            {
              name: 'Arnold',
              text: 'Great post!'
            }
          ]
        },

        '\
          <h1 class="title">Hello World</h1>\
          <p class="post">Hi there it is me</p>\
          <div class="comments">\
            <div class="comment">\
              <span class="name">John</span>\
              <span class="text">That rules</span>\
            </div>\
            <div class="comment">\
              <span class="name">Arnold</span>\
              <span class="text">Great post!</span>\
            </div>\
          </div>\
        '

      );
    });


    it("should handle nested lists with overlapping attributes", function() {
      return testFill(

        '\
          <p class="tweet"></p>\
          <div class="responses">\
            <p class="tweet"></p>\
          </div>\
        ',

        {
          responses: {
            tweet: [
              'It truly is!',
              'I prefer JsUnit'
            ],
          },
          tweet: 'Jasmine is great!'
        },

        '\
          <p class="tweet">Jasmine is great!</p>\
          <div class="responses">\
            <p class="tweet">It truly is!</p>\
            <p class="tweet">I prefer JsUnit</p>\
          </div>\
        '

      );
    });


    it("searches breadth-first and stop at the first match", function() {
      return testFill(

        '<div class="marco"></div>\
        <div>\
          <div class="marco"></div>\
        </div>',

        { marco: 'polo' },

        '<div class="marco">polo</div>\
        <div>\
          <div class="marco"></div>\
        </div>'

      );
    });


    it("searches breadth-first and finds all matches at the top level", function() {
      return testFill(

        '<div class="marco"></div>\
        <div>\
          <div class="marco"></div>\
        </div>\
        <div class="marco"></div>',

        { marco: 'polo' },

        '<div class="marco">polo</div>\
        <div>\
          <div class="marco"></div>\
        </div>\
        <div class="marco">polo</div>'

      );
    });


    it("searches breadth-first and finds all matches at the same level", function() {
      return testFill(

        '<div>\
          <div>\
            <div>\
              <div class="marco"></div>\
              <div>\
                <div class="marco"></div>\
              </div>\
              <div class="marco"></div>\
            </div>\
          </div>\
        </div>',

        { marco: 'polo' },

        '<div>\
          <div>\
            <div>\
              <div class="marco">polo</div>\
              <div>\
                <div class="marco"></div>\
              </div>\
              <div class="marco">polo</div>\
            </div>\
          </div>\
        </div>'

      );
    });


    it("should handle nested objects", function() {
      return testFill(
        '\
          <div class="firstname"></div>\
          <div class="lastname"></div>\
          <div class="address">\
            <div class="street"></div>\
            <div class="zip"><span class="city"></span></div>\
          </div>\
        ',

        {
          firstname: 'John',
          lastname: 'Wayne',
          address: {
            street: '4th Street',
            city: 'San Francisco',
            zip: '94199'
          }
        },

        '\
          <div class="firstname">John</div>\
          <div class="lastname">Wayne</div>\
          <div class="address">\
            <div class="street">4th Street</div>\
            <div class="zip">94199<span class="city">San Francisco</span></div>\
          </div>\
        '
      )

    });


    it("should handle tables with dynamic headers", function() {
      var doc = jQuery('\
        <div>\
          <table class="test_reports">\
            <thead>\
              <tr class="profiles">\
                <th>\
                  <a class="name" href="#"></a>\
                </th>\
              </tr>\
            </thead>\
            <tbody>\
              <tr class="profiles">\
                <td class="testsets">\
                  <div class="testset">\
                    <a class="name" href="#"></a>\
                    <ul class="products">\
                      <li>\
                        <a class="name" href="#"></a>\
                      </li>\
                    </ul>\
                  </div>\
                </td>\
              </tr>\
            </tbody>\
          </table>\
        </div>\
      ');

      var data = {
        release: "1.2",
        thead: {
          th: [
            { a: { _text: 'Core',    _href: '/Core' }    },
            { a: { _text: 'Handset', _href: '/Handset' } }
          ],
        },
        tbody: {
          testsets: [
            {
              testset: [
                {
                  a: { _text: 'Sanity', _href: '/Sanity' },
                  products: {
                    li: [
                      { name: { _text: "N900",   _href: '/N900'}    },
                      { name: { _text: "Lenovo", _href: '/Lenovo' } }
                    ]
                  }
                },
                {
                  a: { _text: 'Acceptance', _href: '/Acceptance' },
                  products: {
                    li: [
                      { name: { _text: "Netbook",   _href: '/Netbook' } },
                      { name: { _text: "Pinetrail", _href: '/Pinetrail' } }
                    ]
                  }
                }
              ],
            },
            {
              testset: [
                {
                  a: { _text: 'Feature', _href: '/Feature' },
                  products: {
                    li: [
                      { name: { _text: "N900",   _href: '/N900' } },
                      { name: { _text: "Lenovo", _href: '/Lenovo' } }
                    ]
                  }
                },
                {
                  a: { _text: 'NFT', _href: '/NFT' },
                  products: {
                    li: [
                      { name: { _text: "Netbook", _href: '/Netbook' } },
                      { name: { _text: "iCDK",    _href: '/iCDK' } }
                    ]
                  }
                }
              ]
            }
          ]
        }
      };

      var expected = jQuery('\
        <div>\
          <table class="test_reports">\
            <thead>\
              <tr class="profiles">\
                <th>\
                  <a class="name" href="/Core">Core</a>\
                </th>\
                <th>\
                  <a class="name" href="/Handset">Handset</a>\
                </th>\
              </tr>\
            </thead>\
            <tbody>\
              <tr class="profiles">\
                <td class="testsets">\
                  <div class="testset">\
                    <a class="name" href="/Sanity">Sanity</a>\
                    <ul class="products">\
                      <li>\
                        <a class="name" href="/N900">N900</a>\
                      </li>\
                      <li>\
                        <a class="name" href="/Lenovo">Lenovo</a>\
                      </li>\
                    </ul>\
                  </div>\
                  <div class="testset">\
                    <a class="name" href="/Acceptance">Acceptance</a>\
                    <ul class="products">\
                      <li>\
                        <a class="name" href="/Netbook">Netbook</a>\
                      </li>\
                      <li>\
                        <a class="name" href="/Pinetrail">Pinetrail</a>\
                      </li>\
                    </ul>\
                  </div>\
                </td>\
                <td class="testsets">\
                  <div class="testset">\
                    <a class="name" href="/Feature">Feature</a>\
                    <ul class="products">\
                      <li>\
                        <a class="name" href="/N900">N900</a>\
                      </li>\
                      <li>\
                        <a class="name" href="/Lenovo">Lenovo</a>\
                      </li>\
                    </ul>\
                  </div>\
                  <div class="testset">\
                    <a class="name" href="/NFT">NFT</a>\
                    <ul class="products">\
                      <li>\
                        <a class="name" href="/Netbook">Netbook</a>\
                      </li>\
                      <li>\
                        <a class="name" href="/iCDK">iCDK</a>\
                      </li>\
                    </ul>\
                  </div>\
                </td>\
              </tr>\
            </tbody>\
          </table>\
        </div>\
      ');

      doc.find('.test_reports').fill(data);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });
  });

}).call(this);
