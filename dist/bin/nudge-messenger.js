(function() {
'use strict';

  var _createClass, Messenger, BuildHTML, init, createDOMstructure, addStyleSheets;

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

  createDOMstructure =function(){
    /*
      <!-- this is what it creates -->
      <div class="wrapper" id="wrapper">
        <nav id="nav" class="nav">
          <div class="default-nav" id="default-nav">
            <div class="main-nav">
              <div class="nudgeOptions" id="nudgeOptions"></div>
            </div>
          </div>
        </nav>
        <div id="inner" class="inner">
          <div id="content" class="content"></div>
        </div>
        <div id="bottom" class="bottom">
          <textarea id="input" class="input"></textarea>
          <div id="send" class="send"></div>
        </div>
      </div>
     */

      // create and append warpper div to body
      var wrapperDiv = document.createElement('div');
      wrapperDiv.id = 'wrapper';  wrapperDiv.className = 'wrapper';
        /*--Now create and append nav to wrapperDiv--*/
        var nav = document.createElement('nav');
        nav.id = 'nav'; nav.className = 'nav';
          // Now create and append default_navDiv to nav
          var default_navDiv = document.createElement('div');
          default_navDiv.id='default-nav'; default_navDiv.className='default-nav';
            // Now create and append main_navDiv to default_navDiv
            var main_navDiv = document.createElement('div');
            main_navDiv.className='main-nav';
              // Now create and append nudge_optionsDiv to main_navDiv
              var nudge_optionsDiv = document.createElement('div');
              nudge_optionsDiv.id='nudgeOptions'; nudge_optionsDiv.className='nudgeOptions';
              main_navDiv.appendChild(nudge_optionsDiv);
            default_navDiv.appendChild(main_navDiv)  
          nav.appendChild(default_navDiv)
        wrapperDiv.appendChild(nav);
        /*--now create and append innerDiv to wrapperDiv--*/
        var innerDiv = document.createElement('div');
        innerDiv.id='inner';  innerDiv.className='inner';
          //Now create and append contentDiv to innerDiv
          var contentDiv = document.createElement('div');
          contentDiv.id='content'; contentDiv.className='content';
          innerDiv.appendChild(contentDiv);  
        wrapperDiv.appendChild(innerDiv);
        /*--Now create and append bottomDiv to wrapperDiv--*/
        var bottomDiv = document.createElement('div');
        bottomDiv.id='bottom';  bottomDiv.className='bottom';
          //Now create and append textarea to bottomDiv
          var textarea =  document.createElement('textarea');
          textarea.id='input'; textarea.className='input';
          bottomDiv.appendChild(textarea);
          //Now create and append sendDiv to bottomDiv
          var sendDiv =  document.createElement('div');
          sendDiv.id='send'; sendDiv.className='send';
          bottomDiv.appendChild(sendDiv);
        wrapperDiv.appendChild(bottomDiv)
      document.getElementsByTagName('body')[0].appendChild(wrapperDiv);
  }
  addStyleSheets = function(){

      //array containg nudge styles
      var nudgeStyles = ['.minified-wrapper{\
                                          right:10px!important;\
                                          width: 60px!important;\
                                          height: 60px!important;\
                                          border-radius: 50px!important}',
                          '.bottom .input:focus,.bottom .send:focus {\
                                            outline: 0;}',
                          '*{ box-sizing: border-box }',
                          '.bottom .send:hover,.nav .default-nav .main-nav .options:hover,.nav .default-nav .main-nav .toggle:hover{\
                                            cursor: pointer;}',
                          '.wrapper{\
                                          height: 520px;\
                                          width: 320px;\
                                          overflow: hidden;\
                                          background-color: #fff;\
                                          position: fixed;\
                                          bottom: 10px;\
                                          right: -100px;\
                                          transform: translateX(-50%);\
                                          box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .5);\
                                          transition: .3s ease}',
                          '.wrapper .inner {\
                                          height: 520px;\
                                          padding-top: 64px;\
                                          overflow:auto;\
                                          background: #f2f2f2;\
                                          -ms-overflow-style: none;\
                                          overflow: -moz-scrollbars-none}',                
                          '.wrapper .inner::-webkit-scrollbar {\
                                          width: 0!important}',
                          '.nav .default-nav,.nav .default-nav .main-nav {\
                                          left: 0;\
                                          width: 100%;height: 64px;\
                                          transition: .3s ease;\
                                          top: 0}',
                          '.wrapper .inner .content {\
                                          padding: 10.66666667px;\
                                          position: relative;\
                                          margin-bottom: 42px}',
                          '.nav {\
                                          position: fixed;\
                                          top: 0;\
                                          left: 0;\
                                          right: 0;\
                                          height: 64px;\
                                          z-index: 100;\
                                          transition: .3s ease}',
                          '.nav .minified-nav {\
                                          border-radius: 50px}',
                          '.nav .default-nav {\
                                          position: absolute;\
                                          z-index: 110;\
                                          background-color: #f44336;\
                                          border-bottom: 3px solid #ea1c0d;\
                                          color: #fff;\
                                          -webkit-box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1);\
                                          -moz-box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1);\
                                          box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1)}',
                          '.nav .default-nav .main-nav {\
                                          position: absolute;\
                                          margin: 0;\
                                          padding: 0;\
                                          list-style: none}',
                          '.nudgeOptions {\
                                          width: 25px;\
                                          height: 20px;\
                                          background-size: contain;\
                                          margin: 16px;\
                                          position: absolute;\
                                          right: 12px;\
                                          top:5px;\
                                          margin-right: 0.3em;\
                                          border-top: 0.2em solid #fff;\
                                          border-bottom: 0.2em solid #fff;}',
                          '.nudgeOptions:before {\
                                          content: "";\
                                          position: absolute;\
                                          top: 0.3em;\
                                          left: 0px;\
                                          width: 100%;\
                                          border-top: 0.2em solid #fff;}',
                          '.bottom,.bottom .input {\
                                        height: 64px;\
                                        background: #fff;\
                                        left: 0}',
                          '.nav .default-nav .main-nav .main-nav-item {\
                                        float: left;\
                                        height: 64px;\
                                        margin-right: 50px;\
                                        position: relative;\
                                        line-height: 64px;\
                                        transition: .3s ease}',
                          '.nav .default-nav .main-nav .main-nav-item .main-nav-item-link {\
                                        display: block;\
                                        position: relative;\
                                        height: 64px;\
                                        width: 100%;\
                                        text-align: center;\
                                        line-height: 64px;\
                                        text-decoration: none;\
                                        color: inherit;\
                                        transition: .3s ease}',
                          '.bottom {\
                                        position: fixed;\
                                        bottom: 0;\
                                        right: 0}',
                          '.bottom .input {\
                                        border: none;\
                                        width: 80%;\
                                        position: absolute;\
                                        top: 0;\
                                        padding: 0 5%;\
                                        resize: none;\
                                        padding-top: 24px;\
                                        font-weight: 300;\
                                        -ms-overflow-style: none;\
                                        overflow: -moz-scrollbars-none}',
                          '.bottom .input::-webkit-scrollbar {\
                                        width: 0!important}',
                          '.bottom .send {\
                                      position: fixed;\
                                      height: 42.66666667px;\
                                      width: 42.66666667px;\
                                      border-radius: 50%;\
                                      border: 0;\
                                      background: #f44336;\
                                      color: #fff;\
                                      bottom: 10.66666667px;\
                                      right: 10.66666667px}',
                          '.bottom .send:before {\
                                      content: "";\
                                      background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/104946/ic_send_white_48dp.png) center center no-repeat;\
                                      background-size: 25.6px;\
                                      position: absolute;\
                                      top: 0;\
                                      left: 0;\
                                      right: 0;\
                                      bottom: 0}',
                          '.message-wrapper {\
                                      position: relative;\
                                      overflow: hidden;\
                                      width: 100%;\
                                      margin: 10.66666667px 0;\
                                      padding: 10.66666667px 0}',
                          '.message-wrapper .circle-wrapper {\
                                      height: 42.66666667px;\
                                      width: 42.66666667px;\
                                      border-radius: 50%}',
                          '.message-wrapper .text-wrapper {\
                                      padding: 10.66666667px;\
                                      min-height: 42.66666667px;\
                                      width: 60%;\
                                      margin: 0 10.66666667px;\
                                      box-shadow: 0 1px 0 0 rgba(50, 50, 50, .3);\
                                      border-radius: 2px;\
                                      font-weight: 300;\
                                      position: relative;\
                                      opacity: 0}',
                          '.message-wrapper .text-wrapper:before {\
                                      content: "";\
                                      width: 0;\
                                      height: 0;\
                                      border-style: solid}',
                          '.message-wrapper.them .circle-wrapper,.message-wrapper.them .text-wrapper {\
                                      background: #f44336;\
                                      float: left;\
                                      color: #fff}',
                          '.message-wrapper.them .text-wrapper:before {\
                                      border-width: 0 10px 10px 0;\
                                      border-color: transparent #f44336 transparent transparent;\
                                      position: absolute;\
                                      top: 0;\
                                      left: -9px}',
                          '.message-wrapper.me .circle-wrapper,.message-wrapper.me .text-wrapper {\
                                      background: #ff5722;\
                                      float: right;\
                                      color: #333}',
                          '.message-wrapper.me .text-wrapper {\
                                      background: #fff !important;\
                                      word-wrap: break-word;}',
                          '.message-wrapper.me .text-wrapper:before {\
                                      border-width: 10px 10px 0 0;\
                                      border-color: #fff transparent transparent;\
                                      position: absolute;\
                                      top: 0;\
                                      right: -9px}',
                          '.animated {\
                                      -webkit-animation-duration: 1s;\
                                      animation-duration: 1s;\
                                      -webkit-animation-fill-mode: both;\
                                      animation-fill-mode: both}',
                          '.fadeIn {\
                                      -webkit-animation-name: fadeIn;\
                                      animation-name: fadeIn}',
                          '@-webkit-keyframes fadeIn {\
                                      0% {  opacity: 0 }\
                                      100% { opacity: 1 }}',
                          '@keyframes fadeIn {\
                                      0% {  opacity: 0 }\
                                      100% {  opacity: 1 }}'            

                          ]; 
      /*
        @media (max-width: 560px) {
            .wrapper {
                width: 100%;
                height: 100%;
                height: 100vh;
                top: 0;
                left: 0;
                transform: translateX(0)
            }
            .wrapper .inner {
                height: 100%;
                height: 100vh
            }
        }
      */

      //if there's no style tag or external stylesheet attached, create one
      if(document.styleSheets.length == 0){
        var style = document.createElement('style');
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);        
      }

      for(var i=0; i<nudgeStyles.length;i++)
        document.styleSheets[0].insertRule(nudgeStyles[i],0);
      
  }

  var selected = null, // Object of the element to be moved
      x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
      x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

  // Will be called when user starts dragging an element
  function _drag_init(elem) {
      // Store the object of the element which needs to be moved
      selected = elem;
      x_elem = x_pos - selected.offsetLeft;
      y_elem = y_pos - selected.offsetTop;
  }

  // Will be called when user dragging an element
  function _move_elem(e) {
      x_pos = document.all ? window.event.clientX : e.pageX;
      y_pos = document.all ? window.event.clientY : e.pageY;
      if (selected !== null) {
          selected.style.left = (x_pos - x_elem) + 'px';
          selected.style.top = (y_pos - y_elem) + 'px';
      }
  }

  // Destroy the object when we are done
  function _destroy() {
      selected = null;
  }



  document.onmousemove = _move_elem;
  document.onmouseup = _destroy;


  init = function(){

              createDOMstructure();
              addStyleSheets();

              console.log(document.getElementById('wrapper'))
              // Bind the functions...
 /*             document.getElementById('wrapper').onmousedown = function () {
                  _drag_init(this);
                  return false;
              };
*/
              var messenger = new nudge_messenger.Messenger();
              var buildHTML = new nudge_messenger.BuildHTML();

              var input = document.getElementById("input");
              var send = document.getElementById("send");
              var content = document.getElementById("content");
              var inner = document.getElementById("inner");
              var options = document.getElementById("nudgeOptions");

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
define("main", function(){});

