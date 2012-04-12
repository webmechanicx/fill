(function() {

  var ELEMENT_NODE = 1;

  var setHtml;
  var setText;

  // helper method to detect arrays, silly javascript
  var _isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };


  // this is the entry point for this module, to fill the data into the dom
  function fill(contexts, models) {
    var context;
    var instance;
    var model;
    var parent;
    var sibling;

    if (!contexts) return;

    // if the models are null, use an empty array to remove the child elements
    if (!models) {
      models = [];
    }

    // wrap the models in an array for iterating over them
    if (!_isArray(models)) models = [models];

    contexts = nodeListToArray(contexts);

    for (var i = 0; i < contexts.length; i += 1) {
      context = contexts[i];

      // save the original position for reattching it later
      sibling = context.nextSibling;
      parent = context.parentNode;

      // dom manipulation is a lot faster when elements are detached
      if (parent != null) parent.removeChild(context);

      // make sure we have the correct amount of template instances available
      prepareContext(context, models);

      for (var j = 0; j < models.length; j += 1) {
        model = models[j];
        instance = context.fill.instances[j];

        // associate model with instance elements
        for (var k = 0; k < instance.elements.length; k += 1) {
          instance.elements[k].fill.model = model;
        }

        fillValues(instance, model);
        fillChildren(instance, model);
      }

      // put the context element back to it's original place in the dom
      if (sibling) {
        if (parent != null) parent.insertBefore(context, sibling);
      } else {
        if (parent != null) parent.appendChild(context);
      }
    }
    return contexts;
  }


  // TODO: Is freezing necessary? Maybe for lists. If so, add tests.

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


  function prepareContext(context, models) {
    var element;
    var instance;
    var template;

    // extend context element to store template elements and cached instances
    if (!context.fill) context.fill = {};
    if (!context.fill.template) {
      context.fill.template = [];
      while (context.firstChild) {
        context.fill.template.push(context.removeChild(context.firstChild));
      }
    }
    if (!context.fill.templateCache) context.fill.templateCache = [];
    if (!context.fill.instances) context.fill.instances = [];

    // get templates from the cache or clone new ones if the cache is empty
    while (models.length > context.fill.instances.length) {
      template = [];
      for (var i = 0; i < context.fill.template.length; i += 1) {
        element = context.fill.template[i].cloneNode(true);
        template.push(element);
      }

      instance = context.fill.templateCache.pop() || {
        queryCache:  {},
        template:    template,
        elements:    elementNodes(template)
      };

      for (var i = 0; i < instance.template.length; i += 1) {
        context.appendChild(instance.template[i]);
      }
      context.fill.instances.push(instance);
    }

    // remove leftover templates from dom and save them to cache for later
    while (models.length < context.fill.instances.length) {
      instance = context.fill.instances.pop();
      context.fill.templateCache.push(instance);

      for (var i = 0; i < instance.template.length; i += 1) {
        template = instance.template[i];
        template.parentNode.removeChild(template);
      }
    }

  }


  function fillValues(instance, model) {
    var attr;
    var attrValue;
    var key;
    var value;
    var element;
    var elements;

    if (typeof model === 'object') {

      for (key in model) {
        value = model[key];

        if (value == null) {
          value = '';
        }

        // wrap text in an object
        if (typeof value === 'string' || typeof value === 'number') {
          value = { _text: value };
        }

        // don't search for elements if this was an attribute
        if (key[0] === '_') continue;

        elements = matchingElements(instance, key);
        for (var i = 0; i < elements.length; i += 1) {
          element = elements[i];

          // set html after text because it has higher precedence
          setText(element, value._text);
          setHtml(element, value._html);

          // set all other attributes
          for (attr in value) {
            // text and html have already been set
            if (attr === '_text' || attr === '_html') continue;

            // only attributes that start with an underscore are applied
            if (attr[0] !== '_') continue;

            // only string and numbers can be stuffed in
            attrValue = value[attr];
            if (typeof attrValue !== 'string' && typeof attrValue !== 'number') {
              continue;
            }

            // chop off then underscore for the sake of talking to the dom
            attr = attr.substr(1);

            // Save the original attribute value for the instance reuse
            element.fill.attributes = element.fill.attributes || {};
            element.fill.attributes[attr] = element.getAttribute(attr);
            element.setAttribute(attr, attrValue);
          }

        }

      }
    } else {
      element = matchingElements(instance, 'listElement')[0] || instance.elements[0];
      if (element) setText(element, model);
    }
  }


  function fillChildren(instance, model) {
    var key;
    var value;
    var elements;

    for (key in model) {
      value = model[key];

      if (typeof value !== 'object') continue;

      elements = matchingElements(instance, key);
      for (var i = 0; i < elements.length; i += 1) {
        fill(elements[i], value);
      }
    }
  }


  // function factory for creating setHtml and setText functions
  function setContent(callback) {
    return function(element, content) {
      var child;

      // make sure that we have an element and content to insert
      if (!element || content == null) return;

      // make sure that this hasn't already been done
      if (element.fill.content === content) return;
      element.fill.content = content;

      // cache all of the child nodes
      if (!element.fill.children) {
        element.fill.children = [];
        for (i = 0; i < element.childNodes.length; i += 1) {
          child = element.childNodes[i];
          if (child.nodeType === ELEMENT_NODE) {
            element.fill.children.push(child);
          }
        }
      }

      // remove all of the children
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

      // fire the callback that was passed in to this factory
      callback(element, content);

      // reattach all the child nodes
      for (i = 0; i < element.fill.children.length; i += 1) {
        element.appendChild(element.fill.children[i]);
      }
    }
  }


  setHtml = setContent(function(element, html) {
    return element.innerHTML = html;
  });


  setText = setContent(function(element, text) {
    // special case for input elements
    if (element.nodeName.toLowerCase() === 'input') {
      return element.setAttribute('value', text);
    }

    return element.appendChild(element.ownerDocument.createTextNode(text));
  });


  // find all of the matching elements
  function matchingElements(instance, key) {
    var element;

    // check to see if this search has alredy been performed
    if (!instance.queryCache[key]) {
      // search for matching elements and cache the results
      instance.queryCache[key] = [];
      for (i = 0; i < instance.elements.length; i += 1) {
        element = instance.elements[i];
        if (elementMatcher(element, key)) {
          instance.queryCache[key].push(element);
        }
      }
    }

    return instance.queryCache[key];
  }


  function elementNodes(template) {
    var child;
    var children;
    var element;
    var elements = [];

    for (var i = 0; i < template.length; i += 1) {
      element = template[i];

      if (element.nodeType !== ELEMENT_NODE) continue;

      if(!element.fill) element.fill = {};
      elements.push(element);

      children = element.getElementsByTagName('*');
      for (var j = 0; j < children.length; j += 1) {
        child = children[j];
        if(!child.fill) child.fill = {};
        elements.push(child);
      }
    }

    return elements;
  }


  // match elements on id, classname, name, etc.
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
