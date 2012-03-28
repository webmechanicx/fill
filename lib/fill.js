(function() {

  var ELEMENT_NODE = 1;

  var setHtml;
  var setText;

  var Fill = this.Fill = {};

  // helper method to detect arrays, silly javascript
  var _isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  // add the render method to jQuery if it exists
  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.render = function(models, directives) {
      Fill.render(this.get(), models, directives);
      return this;
    };
  }

  // export Fill, if this is an environment that supports modules
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Fill;
  }


  // this is the entry point for this module, to render the data into the dom
  Fill.render = function(contexts, models, directives) {
    var context;
    var instance;
    var model;
    var parent;
    var sibling;
    var temp;

    if (!contexts) return;

    // assign default values
    models || (models = []);
    directives || (directives = {});

    // turn jQuery results into a real boy...or perhaps, a real array
    // note: don't use _isArray in case it is a jQuery node list
    if (contexts.length != null && contexts[0]) {
      temp = [];
      for (i = 0; i < contexts.length; i += 1) {
        temp.push(contexts[0]);
      }
      contexts = temp;
    } else {
      contexts = [contexts];
    }

    // wrap the models in an array for interating over them
    if (!_isArray(models)) models = [models];

    for (var i = 0; i < contexts.length; i += 1) {
      context = contexts[i];

      // save the original position for reattching it later
      sibling = context.nextSibling;
      parent = context.parentNode;

      // dom manipulation is a lot faster when elements are detached
      if (parent != null) parent.removeChild(context);

      // make sure we have the correct amount of template instances available
      prepareContext(context, models);

      for (var i = 0; i < models.length; i += 1) {
        model = models[i];
        instance = context.fill.instances[i];

        // associate model with instance elements
        for (var j = 0; j < instance.elements.length; j += 1) {
          instance.elements[j].fill.model = model;
        }

        renderValues(instance, model);
        renderDirectives(instance, model, directives, i);
        renderChildren(instance, model, directives);
      }

      // put the conext element back to it's original place in the dom
      if (sibling) {
        if (parent != null) parent.insertBefore(context, sibling);
      } else {
        if (parent != null) parent.appendChild(context);
      }
    }
    return contexts;
  };


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

    // return the original attribute values
    for (var i = 0; i < context.fill.instances.length; i += 1) {
      instance = context.fill.instances[i];
      for (var j = 0; j < instance.elements.length; j += 1) {
        element = instance.elements[j];
        for (var prop in element.fill.attributes){
          element.setAttribute(prop, element.fill.attributes[prop]);
        }
      }
    }

  };


  function renderValues(instance, model) {
    var key;
    var value;
    var element;
    var elements;

    if (typeof model === 'object') {
      for (key in model) {
        value = model[key];
        if (typeof value !== 'object' && typeof value !== 'function') {
          elements = matchingElements(instance, key);
          for (var i = 0; i < elements.length; i += 1) {
            setText(elements[i], value);
          }
        }
      }
    } else {
      element = matchingElements(instance, 'listElement')[0] || instance.elements[0];
      if (element) setText(element, model);
    }
  };


  function renderDirectives(instance, model, directives, index) {
    var attr;
    var directive;
    var fn;
    var element;
    var elements;
    var value;

    for (var key in directives) {
      fn = directives[key];

      // skip any that are not functions
      if (typeof fn !== 'function') continue;

      elements = matchingElements(instance, key);
      for (var i = 0; i < elements.length; i += 1) {
        element = elements[i];
        directive = fn.call(model, element, index);

        // if the directive function returns a string, wrap it in an object
        if (typeof directive === 'string') {
          directive = { text: directive };
        }

        // set html after text because it has higher precedence
        setText(element, directive.text);
        setHtml(element, directive.html);

        // set all other attributes
        for (attr in directive) {
          // text and html have already been set
          if (attr === 'text' || attr === 'html') continue;

          // Save the original attribute value for the instance reuse
          element.fill.attributes = element.fill.attributes || {};
          element.fill.attributes[attr] = element.getAttribute(attr);

          value = directive[attr];
          element.setAttribute(attr, value);
        }
      }
    }
  };


  function renderChildren(instance, model, directives) {
    var key;
    var value;
    var elements;

    for (key in model) {
      value = model[key];

      if (typeof value !== 'object') continue;

      elements = matchingElements(instance, key);
      for (var i = 0; i < elements.length; i += 1) {
        Fill.render(elements[i], value, directives[key]);
      }
    }
  };


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
  };


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
  };


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


}).call(this);
