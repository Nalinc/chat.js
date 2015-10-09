(function() {
'use strict';

  var _createClass, Messenger, BuildHTML, init;

  _createClass = (function () { 
        function defineProperties(target, props) { 
            for (var i = 0; i < props.length; i++) { 
              var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; 
              descriptor.configurable = true; 
              if ('value' in descriptor) descriptor.writable = true; 
              Object.defineProperty(target, descriptor.key, descriptor); 
            } 
        } 
        return function (Constructor, protoProps, staticProps) { 
              if (protoProps) 
                defineProperties(Constructor.prototype, protoProps); 
              if (staticProps) 
                defineProperties(Constructor, staticProps); 
              return Constructor; 
          }; 
      })();

  function _classCallCheck(instance, Constructor) { 
      if (!(instance instanceof Constructor)) { 
        throw new TypeError('Cannot call a class as a function'); 
      } 
    }

  Messenger = (function () {
    function Messenger() {
      _classCallCheck(this, Messenger);

      this.messageList = [];
      this.deletedList = [];

      this.me = 1; // completely arbitrary id
      this.them = 5; // and another one

      this.onRecieve = function (message) {
        return console.log('Recieved: ' + message.text);
      };
      this.onSend = function (message) {
        return console.log('Sent: ' + message.text);
      };
      this.onDelete = function (message) {
        return console.log('Deleted: ' + message.text);
      };
    }

    _createClass(Messenger, [{
      key: 'send',
      value: function send() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        text = this.filter(text);

        if (this.validate(text)) {
          var message = {
            user: this.me,
            text: text,
            time: new Date().getTime()
          };

          this.messageList.push(message);

          this.onSend(message);
        }
      }
    }, {
      key: 'recieve',
      value: function recieve() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        text = this.filter(text);

        if (this.validate(text)) {
          var message = {
            user: this.them,
            text: text,
            time: new Date().getTime()
          };

          this.messageList.push(message);

          this.onRecieve(message);
        }
      }
    }, {
      key: 'delete',
      value: function _delete(index) {
        index = index || this.messageLength - 1;

        var deleted = this.messageLength.pop();

        this.deletedList.push(deleted);
        this.onDelete(deleted);
      }
    }, {
      key: 'filter',
      value: function filter(input) {
        var output = input.replace('bad input', 'good output'); // such amazing filter there right?
        return output;
      }
    }, {
      key: 'validate',
      value: function validate(input) {
        return !!input.length; // an amazing example of validation I swear.
      }
    }]);

    return Messenger;
  })();

  BuildHTML = (function () {
    function BuildHTML() {
      _classCallCheck(this, BuildHTML);

      this.messageWrapper = 'message-wrapper';
      this.circleWrapper = 'circle-wrapper';
      this.textWrapper = 'text-wrapper';

      this.meClass = 'me';
      this.themClass = 'them';
    }

    _createClass(BuildHTML, [{
      key: '_build',
      value: function _build(text, who) {
        var node = document.createElement("div");
        node.className= this.messageWrapper + ' ' + this[who + 'Class']
        node.innerHTML =  '<div class="' + this.circleWrapper + ' animated bounceIn"></div>\n              <div class="' + this.textWrapper + '">...</div>';
        return node;
      }
    }, {
      key: 'me',
      value: function me(text) {
        return this._build(text, 'me');
      }
    }, {
      key: 'them',
      value: function them(text) {
        return this._build(text, 'them');
      }
    }]);

    return BuildHTML;
  })();

  init = function(){
              var messenger = new nudge_messenger.Messenger();
              var buildHTML = new nudge_messenger.BuildHTML();

              var input = document.getElementById("input");
              var send = document.getElementById("send");
              var content = document.getElementById("content");
              var inner = document.getElementById("inner");
              var options = document.getElementById("nudge-options");

              function safeText(text) {
                var ele = content.querySelector('.message-wrapper:last-child').querySelector('.text-wrapper');
                ele.innerHTML = text;
              }

              function animateText() {
                setTimeout(function () {
                  var ele = content.querySelector('.message-wrapper:last-child').querySelector('.text-wrapper');
                  ele.className += ' animated fadeIn ';
                }, 350);
              }

              function scrollBottom() {
                inner.scrollTop = inner.scrollHeight;
              }

              function buildSent(message) {
                console.log('sending: ', message.text);

              content.appendChild(buildHTML.me(message.text))
                safeText(message.text);
                animateText();

                scrollBottom();
              }

              function buildRecieved(message) {
                console.log('recieving: ', message.text);

                content.appendChild(buildHTML.them(message.text))
                safeText(message.text);
                animateText();

                scrollBottom();
              }

              function sendMessage() {
                var text = input.value;
                messenger.send(text);

                input.value = '';
                input.focus();
              }

              messenger.onSend = buildSent;
              messenger.onRecieve = buildRecieved;

              setTimeout(function () {
                messenger.recieve('Hello there!');
              }, 1500);

              setTimeout(function () {
                messenger.recieve('Do you like this? If so check out more on my page...');
              }, 5000);

              setTimeout(function () {
                messenger.recieve('Or maybe just give it a like!');
              }, 7500);

              input.focus();

              send.addEventListener('click', function (e) {
                sendMessage();
              });
              options.addEventListener('click',function(e){
                document.getElementById('wrapper').classList.toggle('minified-wrapper');
                document.getElementById('default-nav').classList.toggle('minified-nav');                
              })

              input.addEventListener('keydown', function(e) {
                var key = e.which || e.keyCode;

                if (key === 13) {
                  // enter key
                  e.preventDefault();

                  sendMessage();
                }
             });    
  }

  var nudge_messenger = {
    _createClass: _createClass,
    Messenger: Messenger,
    BuildHTML: BuildHTML,
    init: init
  }

  window.nudgeMessenger = nudge_messenger;

  if (typeof window.define === "function" && window.define.amd) {
    window.define("openudge", [], function() {
      return window.openudge;
    });
  }

}).call(this);