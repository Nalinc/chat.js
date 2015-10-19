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

  function safeText(content, text) {
    var ele = content.querySelector('.message-wrapper:last-child').querySelector('.text-wrapper');
    ele.innerHTML = text;
  }

  function animateText(content) {
    setTimeout(function () {
      var ele = content.querySelector('.message-wrapper:last-child').querySelector('.text-wrapper');
      ele.className += ' animated fadeIn ';
    }, 150);
  }

  function scrollBottom(inner) {
    inner.scrollTop = inner.scrollHeight;
  }
  
  function sendMessage(input) {
    var text = input.value;
    window.messenger.send(text);

    input.value = '';
    input.focus();
  }  

  Messenger = (function () {
    function Messenger() {
      _classCallCheck(this, Messenger);

      var input = document.getElementById("input");
      var send = document.getElementById("send");
      var content = document.getElementById("content");
      var inner = document.getElementById("inner");
      var options = document.getElementById("chatjsicon");
      var nav = document.getElementById("nav");

      var buildHTML = new BuildHTML();

      input.focus();

      this.messageList = [];
      this.deletedList = [];

      this.me = 1; // completely arbitrary id
      this.them = 5; // and another one

      this.onRecieve = function (message) {
        console.log('recieving: ', message.text);

        content.appendChild(buildHTML.them(message.text))
        safeText(content, message.text);
        animateText(content);

        scrollBottom(inner);
        return console.log('Recieved: ' + message.text);
      };
      this.onSend = function (message) {
        console.log('sending: ', message.text);

        content.appendChild(buildHTML.me(message.text))
        safeText(content, message.text);
        animateText(content);

        scrollBottom(inner);
        return console.log('Sent: ' + message.text);
      };
      this.onDelete = function (message) {
        return console.log('Deleted: ' + message.text);
      };

      send.addEventListener('click', function (e) {
        sendMessage(input);
      });
      nav.addEventListener('click',function(e){
        document.getElementById('wrapper').classList.toggle('minified-wrapper');
        document.getElementById('default-nav').classList.toggle('minified-nav');                
      })

      input.addEventListener('keydown', function(e) {
        var key = e.which || e.keyCode;

        if (key === 13) {
          // enter key
          e.preventDefault();

          sendMessage(input);
        }
     });   

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


  createDOMstructure =function(){
      // create and append warpper div to body
      var wrapperDiv = document.createElement('div');
      wrapperDiv.id = 'wrapper';  wrapperDiv.className = 'wrapper';
      wrapperDiv.setAttribute('data-intro', 'Collaspable box');
      wrapperDiv.setAttribute('data-position', 'left');
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
              nudge_optionsDiv.id='chatjsicon'; nudge_optionsDiv.className='chatjsicon chatjsi';

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
          textarea.setAttribute('data-intro', 'Type your text here');
          textarea.setAttribute('data-position', 'top');

          bottomDiv.appendChild(textarea);
          //Now create and append sendDiv to bottomDiv
          var sendDiv =  document.createElement('div');
          sendDiv.id='send'; sendDiv.className='send';
          sendDiv.setAttribute('data-intro', 'Send your messages from here');
          sendDiv.setAttribute('data-position', 'right');

          bottomDiv.appendChild(sendDiv);
        wrapperDiv.appendChild(bottomDiv)
      document.getElementsByTagName('body')[0].appendChild(wrapperDiv);
  }
  addStyleSheets = function(){

      //string containg nudge styles
      var nudgeStyles = '.minified-wrapper{\
                                          right:10px!important;\
                                          width: 60px!important;\
                                          height: 60px!important;\
                                          border-radius: 50px!important}' + 
                          '.bottom .input:focus,.bottom .send:focus {\
                                            outline: 0;}' + 
                          '*{ box-sizing: border-box }' + 
                          '.bottom .send:hover,.nav .default-nav .main-nav .options:hover,.nav .default-nav .main-nav .toggle:hover{\
                                            cursor: pointer;}' + 
                          '.wrapper{\
                                          height: 520px;\
                                          width: 320px;\
                                          overflow: hidden;\
                                          background-color: #fff;\
                                          position: fixed;\
                                          bottom: 10px;\
                                          left: 50%;\
                                          -ms-transform: translateX(-50%);\
                                          -moz-transform: translateX(-50%);\
                                          -webkit-transform: translateX(-50%);\
                                          transform: translateX(-50%);\
                                          box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .5);\
                                          transition: .3s ease}' + 
                          '.wrapper .inner {\
                                          height: 390px;\
                                          overflow:auto;\
                                          background: #f2f2f2;\
                                          -ms-overflow-style: none;\
                                          overflow: -moz-scrollbars-none}' +                 
                          '.nav .default-nav,.nav .default-nav .main-nav {\
                                          left: 0;\
                                          width: 100%;height: 64px;\
                                          transition: .3s ease;\
                                          top: 0}' + 
                          '.wrapper .inner .content {\
                                          padding: 10.66666667px;\
                                          position: relative;\
                                          margin-bottom: 42px}' + 
                          '.nav {\
                                          position: relative;\
                                          top: 0;\
                                          left: 0;\
                                          right: 0;\
                                          height: 64px;\
                                          z-index: 100;\
                                          transition: .3s ease}' + 
                          '.nav .minified-nav {\
                                          border-radius: 50px}' + 
                          '.nav .default-nav {\
                                          position: absolute;\
                                          z-index: 110;\
                                          background-color: #b7170b;\
                                          border-bottom: 3px solid #b7170b;\
                                          color: #fff;\
                                          -webkit-box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1);\
                                          -moz-box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1);\
                                          box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1)}' + 
                          '.nav .default-nav .main-nav {\
                                          position: absolute;\
                                          margin: 0;\
                                          padding: 0;\
                                          list-style: none}' + 
                          '.chatjsicon {\
                                        position: absolute;\
                                        width: 25px;\
                                        height: 20px;\
                                        border-radius: 50%;\
                                        background: #ECECEC;\
                                        border: 1px solid rgba(0,0,0,0.1);\
                                        box-shadow:\
                                          inset 0 5px 0 rgba(255,255,255,0.3),\
                                          inset 0 -5px 0 rgba(180,180,180,0.1),\
                                          0 0 10px rgba(0,0,0,0.1),\
                                          0 3px 3px rgba(0,0,0,0.2);}' + 
                          '.chatjsicon:after {\
                                        content: "";\
                                        width: 4px;\
                                        height: 10px;\
                                        border: 1px solid rgba(0,0,0,0.1);\
                                        border-top: none;\
                                        border-left: none;\
                                        display: block;\
                                        position: absolute;\
                                        bottom: -4px;\
                                        left: 60%;\
                                        background: #E9E9E9;\
                                        box-shadow: 0 5px 2px rgba(0,0,0,0.2);\
                                        transform: skewY(35deg);\
                                        -ms-transform: skewY(35deg);\
                                        -moz-transform: skewY(35deg);\
                                        -webkit-transform: skewY(35deg);}' +
                            '.chatjsi {\
                                        background: #EFEFEF;\
                                        left: 17px;\
                                        top: 19px;}'+ 
                          '.bottom,.bottom .input {\
                                        height: 64px;\
                                        background: #fff;\
                                        left: 0}' + 
                          '.nav .default-nav .main-nav .main-nav-item {\
                                        float: left;\
                                        height: 64px;\
                                        margin-right: 50px;\
                                        position: relative;\
                                        line-height: 64px;\
                                        transition: .3s ease}' + 
                          '.nav .default-nav .main-nav .main-nav-item .main-nav-item-link {\
                                        display: block;\
                                        position: relative;\
                                        height: 64px;\
                                        width: 100%;\
                                        text-align: center;\
                                        line-height: 64px;\
                                        text-decoration: none;\
                                        color: inherit;\
                                        transition: .3s ease}' + 
                          '.bottom {\
                                          position: relative;\
                                          bottom: 0;\
                                          left: 0;\
                                          right: 0;\
                                          height: 64px;\
                                          z-index: 100;}' + 
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
                                        overflow: -moz-scrollbars-none}' + 
                          '.bottom .send {\
                                      position: absolute;\
                                      height: 42.66666667px;\
                                      width: 42.66666667px;\
                                      border-radius: 50%;\
                                      border: 0;\
                                      background: #b7170b;\
                                      color: #fff;\
                                      bottom: 10.66666667px;\
                                      right: 10.66666667px}' + 
                          '.bottom .send:before {\
                                      content: "";\
                                      background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/104946/ic_send_white_48dp.png) center center no-repeat;\
                                      background-size: 25.6px;\
                                      position: absolute;\
                                      top: 0;\
                                      left: 0;\
                                      right: 0;\
                                      bottom: 0}' + 
                          '.message-wrapper {\
                                      position: relative;\
                                      overflow: hidden;\
                                      width: 100%;\
                                      margin: 10.66666667px 0;\
                                      padding: 10.66666667px 0}' + 
                          '.message-wrapper .circle-wrapper {\
                                      height: 42.66666667px;\
                                      width: 42.66666667px;\
                                      border-radius: 50%}' + 
                          '.message-wrapper .text-wrapper {\
                                      padding: 10.66666667px;\
                                      min-height: 42.66666667px;\
                                      width: 60%;\
                                      margin: 0 10.66666667px;\
                                      box-shadow: 0 1px 0 0 rgba(50, 50, 50, .3);\
                                      border-radius: 2px;\
                                      font-weight: 300;\
                                      position: relative;\
                                      opacity: 0}' + 
                          '.message-wrapper .text-wrapper:before {\
                                      content: "";\
                                      width: 0;\
                                      height: 0;\
                                      border-style: solid}' + 
                          '.message-wrapper.them .circle-wrapper,.message-wrapper.them .text-wrapper {\
                                      background: #b7170b;\
                                      float: left;\
                                      color: #fff}' + 
                          '.message-wrapper.them .text-wrapper:before {\
                                      border-width: 0 10px 10px 0;\
                                      border-color: transparent #b7170b transparent transparent;\
                                      position: absolute;\
                                      top: 0;\
                                      left: -9px}' + 
                          '.message-wrapper.me .circle-wrapper,.message-wrapper.me .text-wrapper {\
                                      background: #ff5722;\
                                      float: right;\
                                      color: #333}' + 
                          '.message-wrapper.me .text-wrapper {\
                                      background: #fff !important;\
                                      word-wrap: break-word;}' + 
                          '.message-wrapper.me .text-wrapper:before {\
                                      border-width: 10px 10px 0 0;\
                                      border-color: #fff transparent transparent;\
                                      position: absolute;\
                                      top: 0;\
                                      right: -9px}' + 
                          '.animated {\
                                      -webkit-animation-duration: 1s;\
                                      animation-duration: 1s;\
                                      -webkit-animation-fill-mode: both;\
                                      animation-fill-mode: both}' + 
                          '.fadeIn {\
                                      -webkit-animation-name: fadeIn;\
                                      animation-name: fadeIn}' + 
                          '@-webkit-keyframes fadeIn {0% {  opacity: 0 } 100% { opacity: 1 }}'+
                          '.wrapper .inner::-webkit-scrollbar { width: 0!important}' +
                          '.bottom .input::-webkit-scrollbar { width: 0!important}'+
                          '@keyframes fadeIn { 0% {  opacity: 0 } 100% {  opacity: 1 }}';

      //create separate style tag for browser specific behaviour
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML =  nudgeStyles
      document.getElementsByTagName('head')[0].appendChild(style);        
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
      /*// Bind the function for drag and drop  --buggy
      document.getElementById('wrapper').onmousedown = function () {
          _drag_init(this);
          return false;
      };
      */
      window.messenger = new chat_messenger.Messenger();
      return messenger;
  }
  var minify = function(){
      document.getElementById('wrapper').className+=' minified-wrapper';
      document.getElementById('default-nav').className+=' minified-nav';    
  }

  var chat_messenger = {
    _createClass: _createClass,
    Messenger: Messenger,
    BuildHTML: BuildHTML,
    init: init,
    minify:minify
  }

  window.chatMessenger = chat_messenger;

  if (typeof window.define === "function" && window.define.amd) {
    window.define("chatMessenger", [], function() {
      return window.chatMessenger;
    });
  }

}).call(this);