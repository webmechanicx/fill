(function() {
  var expectModelObjects;

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }

  describe("fill", function() {

    it("should handle list of objects", function() {
      var doc = jQuery(
        '<div>\
          <div class="comments">\
            <div class="comment">\
              <span class="name"></span><span class="text"></span></div>\
          </div>\
        </div>'
      );

      var data = [
        {
          name: 'John',
          text: 'That rules'
        },
        {
          name: 'Arnold',
          text: 'Great post!'
        }
      ];

      var expected = jQuery(
        '<div>\
          <div class="comments">\
            <div class="comment">\
              <span class="name">John</span><span class="text">That rules</span>\
            </div><div class="comment">\
              <span class="name">Arnold</span><span class="text">Great post!</span>\
            </div>\
          </div>\
        </div>'
      );

      doc.find('.comments').fill(data);
      expect(doc.html()).htmlToBeEqual(expected.html());
      expect(doc.find('.comment').get(0).fill.model).toEqual(data[0]);
      return expectModelObjects(doc.find('.comment'), data);
    });


    it("should handle empty lists", function() {
      var doc = jQuery(
        '<div>\
          <div class="comments">\
            <div class="comment">\
              <span class="name"></span>\
              <span class="text"></span>\
            </div>\
          </div>\
        </div>'
      );

      var data = [];

      var expected = jQuery(
        '<div>\
          <div class="comments">\
          </div>\
        </div>\
      ');

      doc.find('.comments').fill(data);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });


    it("should fill list with simple values", function() {
      var doc = jQuery(
        '<div>\
          <div class="comments">\
            <span></span>\
            <label>blah</label>\
          </div>\
        </div>'
      );

      var data = ["That rules", "Great post!"];

      var expected = jQuery(
        '<div>\
          <div class="comments">\
            <span>That rules</span><label>blah</label><span>Great post!</span><label>blah</label>\
          </div>\
        </div>'
      );

      doc.find('.comments').fill(data);
      expect(doc.html()).htmlToBeEqual(expected.html());
      return expectModelObjects(doc.find('span'), data);
    });


    it("should place simple value into element with listElement class if found", function() {
      var doc = jQuery(
        '<div>\
          <div class="comments">\
            <label>comment</label><span class="listElement"></span>\
          </div>\
        </div>'
      );

      var data = ["That rules", "Great post!"];

      var expected = jQuery(
        '<div>\
          <div class="comments">\
            <label>comment</label><span class="listElement">That rules</span>\
            <label>comment</label><span class="listElement">Great post!</span>\
          </div>\
        </div>'
      );

      doc.find('.comments').fill(data);
      expect(doc.html()).htmlToBeEqual(expected.html());
      return expectModelObjects(doc.find('.listElement'), data);
    });


    it("should not fail when there's no child node in the simple list template", function() {
      var doc = jQuery(
        '<div>\
          <div class="comments">\
          </div>\
        </div>'
      );

      var data = ["That rules", "Great post!"];

      var expected = jQuery(
        '<div>\
          <div class="comments">\
          </div>\
        </div>'
      );

      doc.find('.comments').fill(data);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });


    it("should match table rows to the number of model objects", function() {
      var doc = jQuery(
        '<div>\
          <table>\
            <tbody class="users">\
              <tr>\
                <td class="username"></td>\
              </tr>\
            </tbody>\
          </table>\
        </div>'
      );

      doc.find("tbody.users").fill([
        { username: 'user1' },
        { username: 'user2' }
      ]);

      expect(doc.html()).htmlToBeEqual(jQuery('\
      <div>\
        <table>\
          <tbody class="users">\
            <tr>\
              <td class="username">user1</td>\
            </tr>\
            <tr>\
              <td class="username">user2</td>\
            </tr>\
          </tbody>\
        </table>\
      </div>').html());

      doc.find("tbody.users").fill([
        { username: 'user1' }
      ]);

      expect(doc.html()).htmlToBeEqual(jQuery('\
      <div>\
        <table>\
          <tbody class="users">\
            <tr>\
              <td class="username">user1</td>\
            </tr>\
          </tbody>\
        </table>\
      </div>').html());

      doc.find("tbody.users").fill([
        { username: 'user1' },
        { username: 'user3' }
      ]);

      expect(doc.html()).htmlToBeEqual(jQuery('\
      <div>\
        <table>\
          <tbody class="users">\
            <tr>\
              <td class="username">user1</td>\
            </tr>\
            <tr>\
              <td class="username">user3</td>\
            </tr>\
          </tbody>\
        </table>\
      </div>').html());

      doc.find("tbody.users").fill([
        { username: 'user4' },
        { username: 'user3' }
      ]);

      return expect(doc.html()).htmlToBeEqual(jQuery('\
      <div>\
        <table>\
          <tbody class="users">\
            <tr>\
              <td class="username">user4</td>\
            </tr>\
            <tr>\
              <td class="username">user3</td>\
            </tr>\
          </tbody>\
        </table>\
      </div').html());
    });
  });


  expectModelObjects = function(elements, data) {
    var i, object, _len, _results;
    _results = [];
    for (i = 0, _len = data.length; i < _len; i++) {
      object = data[i];
      _results.push(expect(elements.get(i).fill.model).toEqual(object));
    }
    return _results;
  };

}).call(this);
