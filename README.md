chat.js [![npm version](https://badge.fury.io/js/chat.js.svg)](http://badge.fury.io/js/chat.js)
=====
*Simple chat plugin for your web-apps.*
***

### [DEMO](http://nalinc.github.io/chat.js)

Installation
-----

```
bower install chat.js
```
*or*

```
npm install chat.js
```

*or* [download from Github](https://github.com/nalinc/chat.js/archive/master.zip).

*or* simply use the [cdn](https://rawgit.com/Nalinc/chat.js/master/dist/chat.js).

**Note**: **chat.js** supports AMD module pattern.

Usage
-----
Initialise the library after the HTML document(optionally the content) has been loaded
```js
window.onload = function () {
		var chat = chatMessenger.init()
}
```
Display incoming messages with
```js
chat.recieve('Hello there!');
```

More documentation coming soon.

Browser Support
-----

**chat.js** works on all modern browsers.
- Firefox 41.0.2+
- Chrome 46.0.2+
- Safari 5.1.7+
- Internet Explorer 11+

Contributing
-----

Interested in contributing features and fixes?

[Read more on contributing](./CONTRIBUTING.md).

License
-----

Copyright (c) 2015 [Nalin Chhibber](http://nalinc.github.io)
Licensed under the [MIT license](http://opensource.org/licenses/MIT).
