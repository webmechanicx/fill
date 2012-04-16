(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
  }

  describe("fill lists", function() {

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

      doc.find('.comment').fill(data);
      expect(doc.html()).htmlToBeEqual(expected.html());
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

      doc.find('.comment').fill(data);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });


    it("should fill list with simple values", function() {
      var doc = jQuery(
        '<div>\
          <div class="comment">\
            <span></span><label>blah</label>\
          </div>\
        </div>'
      );

      var data = [
        { span: "That rules" },
        { span: "Great post!" }
      ];

      var expected = jQuery(
        '<div>\
          <div class="comment">\
            <span>That rules</span><label>blah</label>\
          </div>\
          <div class="comment">\
            <span>Great post!</span><label>blah</label>\
          </div>\
        </div>'
      );

      doc.find('.comment').fill(data);
      expect(doc.html()).htmlToBeEqual(expected.html());
    });


    it("should place simple value into element with class", function() {
      var doc = jQuery(
        '<div>\
          <div class="comment">\
            <label>comment</label><span class="body"></span>\
          </div>\
        </div>'
      );

      var data = [
        { body: "That rules" },
        { body: "Great post!" }
      ];

      var expected = jQuery(
        '<div>\
          <div class="comment">\
            <label>comment</label><span class="body">That rules</span>\
          </div>\
          <div class="comment">\
            <label>comment</label><span class="body">Great post!</span>\
          </div>\
        </div>'
      );

      doc.find('.comment').fill(data);
      expect(doc.html()).htmlToBeEqual(expected.html());
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

      doc.find('.comment').fill(data);
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

      doc.find("tr").fill([
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

      doc.find("tr").fill([
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

      doc.find("tr").fill([
        { username: 'user1' },
        { username: 'user2' },
        { username: 'user3' },
        { username: 'user4' }
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
            <tr>\
              <td class="username">user3</td>\
            </tr>\
            <tr>\
              <td class="username">user4</td>\
            </tr>\
          </tbody>\
        </table>\
      </div>').html());

      doc.find("tr").fill([
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
      </div').html());
    });


  });


}).call(this);
