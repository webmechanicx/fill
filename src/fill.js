(function() {

  var ELEMENT_NODE = 1


  // helper method to detect arrays -- silly javascript
  function _isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }


  // this is the entry point for this module, to fill the dom with data
  function fill(nodeList, data) {
    var node
    var parent
    var dataIsArray

    // there is nothing to do if there is nothing to fill
    if (!nodeList) return

    // remove all child nodes if there is no data
    if (data == null) data = { _text: '' }

    // nodeList updates as the dom changes, so freeze it in an array
    var elements = nodeListToArray(nodeList)

    dataIsArray = _isArray(data)

    // match the number of nodes to the number of data elements
    if (dataIsArray) {
      if (elements.length === 0) {

        //=====================================================================
        // Warning: the following is a case where we could end up here: A page
        // that returns search results as the user is typing. If the results
        // are empty, then the child nodes that display the results will all
        // be removed. Then a subsequent attempt to fill in the search results
        // with data won't have any dom elements to clone.
        //=====================================================================

        // cannot fill empty nodeList with an array of data
        return
      }

      // clone the first node if more nodes are needed
      parent = elements[0].parentNode
      while (elements.length < data.length) {
        node = elements[0].cloneNode(true)
        elements.push(node)
        if (parent) parent.appendChild(node)
      }

      // remove the last node until the number of nodes matches the data
      while (elements.length > data.length) {
        node = elements.pop()
        parent = node.parentNode
        if (parent) parent.removeChild(node)
      }
    }


    // now fill each node with the data
    for (var i = 0; i < elements.length; i++) {
      if (dataIsArray) {
        fill(elements[i], data[i])
      } else {
        fillNode(elements[i], data)
      }
    }

    // return the original nodeList for jQuery chaining
    return nodeList
  }


  // TODO: Detatch just the top node? or do we have to do it on all nodes?


  function fillNode(node, data) {
    // dom manipulation is a lot faster when elements are detached
    whileDetatched(node, function() {

      var attributes;
      var attrName;
      var attrValue;

      var element;
      var elements;

      // ignore functions
      if (typeof data === 'function') return

      // if the value is a simple property wrap it in the attributes hash
      if (typeof data !== 'object') return fillNode(node, { _text: data })

      // find all the attributes
      for (var key in data) {
        var value = data[key]

        // null values are treated like empty strings
        if (value == null) value = ''

        // anything that starts with an underscore is an attribute
        if (key[0] === '_') {
          // store the properties to set them all at once
          if (typeof value === 'string' || typeof value === 'number') {
            attributes = attributes || {}
            attributes[key.substr(1)] = value;
          } else {
            throw new Error('Expected a string or number for "' + key +
                            '", got: "' + JSON.stringify(value) + '"');
          }
        }
      }

      // fill in all the attributes
      if (attributes) {
        fillAttributes(node, attributes)
      }


      // look for non-attribute keys and recurse into those elements
      for (var key in data) {
        var value = data[key]

        // only attributes start with an underscore
        if (key[0] !== '_') {
          elements = matchingElements(node, key);
          fill(elements, value);
        }
      }


    }) // reattach the node
  }



  // detach the node, run the callback, and reattach it
  function whileDetatched(node, callback) {
    // save the original position of the node for reattaching later
    var sibling = node.nextSibling;
    var parent  = node.parentNode;

    if (parent != null) parent.removeChild(node);

    callback();

    // put the context element back to it's original place in the dom
    if ( parent != null ) {
      if (sibling) {
        parent.insertBefore(node, sibling);
      } else {
        parent.appendChild(node);
      }
    }
  }


  // freeze the NodeList into a real Array so it can't update as DOM changes
  function nodeListToArray(nodeList) {
    var temp;

    // wrap single item into an array for iteration
    // NOTE: can't use _isArray here, because it could be a NodeList (array-ish)
    if (nodeList.length == null) {
      nodeList = [nodeList];
    }

    // convert array-like object into a real array
    if (!_isArray(nodeList)) {
      temp = [];
      for (var i = 0; i < nodeList.length; i += 1) {
        // Note: occassionaly jsdom returns undefined elements in the NodeList
        if (nodeList[i]){
          temp.push(nodeList[i]);
        }
      }
      nodeList = temp;
    }

    return nodeList;
  }


  // fill in the attributes on an element (setting text and html first)
  function fillAttributes(node, attributes){

    // set html after setting text because html overrides text
    setText(node, attributes.text)
    setHtml(node, attributes.html)

    // set the rest of the attributes
    for (attrName in attributes) {

      // skip text and html, they've already been set
      if (attrName === 'text' || attrName === 'html') continue

      node.setAttribute(attrName, attributes[attrName])
    }
  }



  function setText(node, text) {
    var child
    var children

    // make sure that we have an node and text to insert
    if (!node || text == null) return;

    // cache all of the child nodes
    if (!children) {
      children = [];
      for (i = 0; i < node.childNodes.length; i += 1) {
        child = node.childNodes[i];
        if (child.nodeType === ELEMENT_NODE) {
          children.push(child);
        }
      }
    }

    // remove all of the children
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    // now add the text
    if (node.nodeName.toLowerCase() === 'input') {
      // special case for input elements
      node.setAttribute('value', text);
    } else {
      // create a new text node and stuff in the value
      node.appendChild(node.ownerDocument.createTextNode(text));
    }

    // reattach all the child nodes
    for (i = 0; i < children.length; i += 1) {
      node.appendChild(children[i]);
    }
  }


  function setHtml(node, html) {
    if (!node || html == null) return;
    node.innerHTML = html;
  };


  //===========================================================================
  // TODO: Decide if the caching of element matching should be reintroduced.
  // The original implementation cached the lookup of elements, but it seems
  // like this will only be useful in cases where the same DOM elements are
  // getting filled mutliple times -- that seems like it would only happen
  // when someone is running performance benchmarks.
  //===========================================================================


  // find all of the matching elements (breadth-first)
  function matchingElements(node, key) {
    var elements = childElements(node)
    var matches = []

    // search all child elements for a match
    for (i = 0; i < elements.length; i += 1) {
      if (elementMatcher(elements[i], key)) {
        matches.push(elements[i]);
      }
    }

    // if there is no match, recursively search the childNodes
    if (!matches.length && elements.length){
      for (var i = 0; i < elements.length; i++) {
        matches = matchingElements(elements[i], key)
        if (matches.length) break
      }
    }

    // if (!matches.length) console.log('Warning: no matches for ' + key);

    return matches
  }


  // return just the child nodes that are elements
  function childElements(node) {
    var children = node.childNodes
    var elements = []

    for (i = 0; i < children.length; i += 1) {
      if (children[i].nodeType === ELEMENT_NODE) {
        elements.push(children[i])
      }
    }

    return elements
  }


  // match elements on tag, id, name, class name, data-bind, etc.
  function elementMatcher(element, key) {
    var paddedClass = ' ' + element.className + ' ';

    return (
      element.id === key                                    ||
      paddedClass.indexOf(' ' + key + ' ') > -1             ||
      element.name === key                                  ||
      element.nodeName.toLowerCase() === key.toLowerCase()  ||
      element.getAttribute('data-bind') === key
    );
  }


  // add the fill method to jQuery if it exists
  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.fill = function(models) {
      fill(this.get(), models);
      return this;
    };
  }


  // export fill, if this is an environment that supports modules
  if (typeof module !== "undefined" && module !== null) {
    module.exports = fill;
  }


  // attach fill to current context (in the browser this will be window.fill)
  this.fill = fill;


}).call(this);
