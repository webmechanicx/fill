# Synopsis

fill is a (client-side) template engine which binds data to DOM with zero configuration. Just call `.fill(data)`.

```html
<div id="template">
  <span class="greeting"></span>
  <a class="name"></a>
</div>
```
```js
var hello = {
  greeting: 'Hello',
  name:     { _text: 'world!', _href: 'http://example.com/people/2' }
};

$('#template').fill(hello);
```
```html
<div id="template">
  <span class="greeting">Hello</span>
  <a class="name" href="http://example.com/people/2">world!</a>
</div>
```

## Features

* Data binding by convention - No extra markup in the views
* Collection rendering - No loops and partials
* Nested objects and collections - No configuration, just conventions
* Template caching - No manual template lookup/compilation/rendering
* Fast - In most real-world cases, it's faster than other template engine or hand-crafted bindings
* Compatible - Tested on IE6+, Chrome and Firefox

## Use it

Install with `npm install fill` or get the
[compiled and minified version](https://raw.github.com/profit-strategies/fill/master/lib/fill.min.js)
and include it to your application. jQuery is optional, but if you happen to use it, fill registers itself
as a plugin.

```html
<script src="js/jquery-1.7.1.min.js"></script>
<script src="js/fill.min.js"></script>
```

For server-side use, see `spec` folder and the awesome [jsdom](https://github.com/tmpvar/jsdom) for the details.

## Examples

### Assigning values

fill binds JavaScript objects to DOM a element by `id`, `class`,`element name`, `name` attribute and
`data-bind` attribute. Values are escaped before rendering. Any keys that are
prefixed with an underscore are treated as attributes.

Template:

```html
<div id="container">
  <div id="hello"></div>
  <div class="goodbye"></div>
  <span></span>
  <input type="text" name="greeting" />
  <button class="hi-button" data-bind="hi-label"></button>
</div>
```

Javascript:

```js
var hello = {
  _class:     'message',
  hello:      'Hello',
  goodbye:    'Goodbye!',
  span:       '<i>See Ya!</i>',
  greeting:   'Howdy!',
  'hi-label': 'Terve!' // Finnish i18n
};

// with jQuery
$('#container').fill(hello);

// ..or without
fill(document.getElementById('container'), hello);
```

Result:

```html
<div id="container" class="message">
  <div id="hello">Hello</div>
  <div class="goodbye">Goodbye!</div>
  <span>lt;i&gt;See Ya!&lt;/i&gt;</span>
  <input type="text" name="greeting" value="Howdy!" />
  <button class="hi-button" data-bind="hi-label">Terve!</button>
</div>
```

### Iterating over a list

Template:

```html
<ul id="activities">
  <li class="activity"></li>
</ul>
```

Javascript:

```js
var activities = [
  {activity: 'Jogging'},
  {activity: 'Gym'},
  {activity: 'Sky Diving'},
];

$('#activities').fill(activities);

// or
fill(document.getElementById('activities'), activities);
```

Result:

```html
<ul id="activities">
  <li class="activity">Jogging</li>
  <li class="activity">Gym</li>
  <li class="activity">Sky Diving</li>
</ul>
```

#### Iterating over a list with plain values

Template:

```html
<div>
  <div class="comments">
    <span></span>
  </div>
</div>
```

Javascript:

```js
var comments = ["That rules", "Great post!"]

$('.comments').fill(comments);
```

Result:

```html
<div>
  <div class="comments">
    <span>That rules</span>
    <span>Great post!</span>
  </div>
</div>
```

#### Iterating over a list with plain values, using `listElement` class

Template:

```html
<div>
  <div class="comments">
    <label>comment</label><span class="listElement"></span>
  </div>
</div>
```

Javascript:

```js
var comments = ["That rules", "Great post!"]

$('.comments').fill(comments);
```

Result:

```html
<div>
  <div class="comments">
    <label>comment</label><span class="listElement">That rules</span>
    <label>comment</label><span class="listElement">Great post!</span>
  </div>
</div>
```

### Nested lists

Template:

```html
<div class="container">
  <h1 class="title"></h1>
  <p class="post"></p>
  <div class="comments">
    <div class="comment">
      <span class="name"></span>
      <span class="text"></span>
    </div>
  </div>
</div>
```

Javascript:

```js
var post = {
  title:    'Hello World',
  post:     'Hi there it is me',
  comments: [ {
      name: 'John',
      text: 'That rules'
    }, {
      name: 'Arnold',
      text: 'Great post!'
    }
  ]
};

$('.container').fill(post);
```

Result:

```html
<div class="container">
  <h1 class="title">Hello World</h1>
  <p class="post">Hi there it is me</p>
  <div class="comments">
    <div class="comment">
      <span class="name">John</span>
      <span class="text">That rules</span>
    </div>
    <div class="comment">
      <span class="name">Arnold</span>
      <span class="text">Great post!</span>
    </div>
  </div>
</div>
```

### Nested objects

Template:

```html
<div class="person">
  <div class="firstname"></div>
  <div class="lastname"></div>
  <div class="address">
    <div class="street"></div>
    <div class="zip"><span class="city"></span></div>
  </div>
</div>
```

Javascript:

```js
var person = {
  firstname: 'John',
  lastname:  'Wayne',
  address: {
    street: '4th Street',
    city:   'San Francisco',
    zip:    '94199'
  }
};

$('.person').fill(person);
```

Result:

```html
<div class="container">
  <div class="firstname">John</div>
  <div class="lastname">Wayne</div>
  <div class="address">
    <div class="street">4th Street</div>
    <div class="zip">94199<span class="city">San Francisco</span></div>
  </div>
</div>
```

## Development environment

You need node.js 0.6.x and npm.

Install dependencies:

    npm install
    npm install -g uglify-js

Run tests

    npm test

Run tests during development for more verbose assertion output

    node_modules/jasmine-node/bin/jasmine-node --verbose spec

Generate Javascript libs

    node build

## Contributing

All the following are appreciated, in an asceding order of preference

1. A feature request or a bug report
2. Pull request with a failing unit test
3. Pull request with unit tests and corresponding implementation

In case the contribution is going to change fill API, please create a ticket first in order to discuss and
agree on design.

## Origins and Alternatives

This project was forked from the very impressive
[Transparency project](https://github.com/leonidas/transparency)
to attempt the following:

* allow the setting of attributes (without needing to use directives)
  * eventually phasing out directives completely
* add support for manipulating strings of HTML (without jsdom)
  * for superfast rendering of html on server (running node.js)

### Similar projects:

* [Transparency.js](https://github.com/leonidas/transparency)
  * from which this project was spawned
* [Plates.js](https://github.com/flatiron/plates)
  * successor of [Weld.js](https://github.com/hij1nx/weld)
