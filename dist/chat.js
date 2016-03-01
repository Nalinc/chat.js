(function() {
'use strict';

  var _createClass, Messenger, BuildHTML, init, createDOMstructure, addStyleSheets, remotehost, socket, nsp, soc;

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
        node.className = (who=='notification')?who:(this.messageWrapper + ' ' + who);
          var circleWrapperDiv = document.createElement("div");
          circleWrapperDiv.className= this.circleWrapper + ' animated bounceIn';
            var textWrapperDiv = document.createElement("div");
            textWrapperDiv.className = this.textWrapper;
            textWrapperDiv.innerHTML = text;
        node.appendChild(circleWrapperDiv)
        node.appendChild(textWrapperDiv)
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
    }, {
      key: 'notification',
      value: function notification(text) {
        return this._build(text, 'notification');
      }
    }]);

    return BuildHTML;
  })();

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
    chat_messenger.self.send(text)
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
      var dotsDiv = document.getElementById("menudots");
      var miniWrapper = document.getElementById("minified-wrapper").querySelector('#chatjsicon');
      var resetChatBox = function(){
        window.oldOffsetLeft = document.getElementById('minified-wrapper').offsetLeft;
        window.oldOffsetTop = document.getElementById('minified-wrapper').offsetTop;
        var ele = document.getElementById('wrapper');
        ele.style.left = (window.oldOffsetLeft) + 'px'
        ele.style.top = (window.oldOffsetTop) + 'px'
 
        if(window.oldOffsetLeft>window.innerWidth-320){
          ele.style.left = (window.innerWidth - 180) + 'px'
        }
        if(window.oldOffsetLeft<160){
          ele.style.left = 180 + 'px'
        }
        if(window.oldOffsetTop>window.innerHeight-520){
          ele.style.top = (window.innerHeight - 540) + 'px'
        }
        if(window.oldOffsetTop<60){
          ele.style.top = 40 + 'px' 
        }
        chatMessenger.collapseToggle();        
      }

      var buildHTML = new BuildHTML();

      this.messageList = [];
      this.deletedList = [];

      this.me = 1; // completely arbitrary id
      this.them = 5; // and another one

      this.onReceive = function (message) {
        content.appendChild(buildHTML.them(message.text))
        animateText(content);

        scrollBottom(inner);
        return console.log('Received: ' + message.text);
      };
      this.onSend = function (message) {
        content.appendChild(buildHTML.me(message.text))
        animateText(content);

        scrollBottom(inner);
        socket.emit("messageOut", {text: message.text, nsp:"/"+window.location.hostname});

        return console.log('Sent: ' + message.text);
      };
      this.onNotify = function (message) {
        content.appendChild(buildHTML.notification(message.text))
        scrollBottom(inner);
      };

      this.onConnect = function(host){
        remotehost = host;

        socket = io.connect(remotehost);
        socket.emit('namespaceConnect',window.location.hostname)
        //Socket connection
        socket.on("connect",onSocketConnect)
      }
      //Socket Connected
      function onSocketConnect(){
        setTimeout(function(){
          // Overiding default with custom namespace
          soc = io.connect(remotehost+"/"+window.location.hostname);
          // New player message received
          soc.on("messageIn", onMessageIn);
          // When a user leaves within same nsp
          soc.on("userLeft", onUserDisconnect);
        },1000)
      }
      // Socket disconnected
      function onUserDisconnect(user) {
        chat_messenger.self.notify("Anonymous has left")
      };
      // On incoming Message
      function onMessageIn(message) {
        if(message.source!=socket.id)
        chat_messenger.self.receive(message.text)
      };

      send.addEventListener('click', function (e) {
        sendMessage(input);
      });
      nav.addEventListener('click',function(e){       
          var eleMini = document.getElementById('minified-wrapper');
          eleMini.style.left = window.oldOffsetLeft + 'px';
          eleMini.style.top = window.oldOffsetTop + 'px';
          chatMessenger.collapseToggle();
          input.focus();
      })
      miniWrapper.addEventListener('click',function(e){
        resetChatBox();
      })

      miniWrapper.addEventListener('touchend',function(){
        resetChatBox();       
      })
      dotsDiv.addEventListener('click',function(e){
        e.stopPropagation();
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
      key: 'receive',
      value: function receive() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        text = this.filter(text);

        if (this.validate(text)) {
          var message = {
            user: this.them,
            text: text,
            time: new Date().getTime()
          };

          this.messageList.push(message);

          this.onReceive(message);
        }
      }
    }, {
      key: 'notify',
      value: function _notify() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        text = this.filter(text);

        if (this.validate(text)) {
          var message = {
            user: this.me,
            text: text,
            time: new Date().getTime()
          };

          this.onNotify(message);
        }
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
    },{
      key: 'connect',
      value: function connect(host){
        if(io)
          this.onConnect(host||"//chatjs-server.herokuapp.com");
        else
          alert('socket-io not available')  
      }
    }]);

    return Messenger;
  })();


  createDOMstructure =function(){
      //
      var chatjsContainer = document.createElement('div');
      chatjsContainer.className = 'chatjsContainer'; 

      // create and append warpper div to body
      var minifiedWrapperDiv = document.createElement('div');
      minifiedWrapperDiv.id= 'minified-wrapper';
      minifiedWrapperDiv.className = 'minified-wrapper';

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
              nudge_optionsDiv.id='nudgeOptions'; nudge_optionsDiv.className='nudgeOptions';
                // Now create and append label to nudge_optionsDiv
                var label = document.createElement('label');
                label.htmlFor = 'menucheckbox';
                  // Now create and append spanEle to label
                  var spanEle = document.createElement('span');
                    // Now create and append menuDiv to spanEle
                    var menuDiv = document.createElement('div');
                    menuDiv.id='menudots'; menuDiv.className='menuButton';
                    spanEle.appendChild(menuDiv)
                  label.appendChild(spanEle) 
                nudge_optionsDiv.appendChild(label)

              main_navDiv.appendChild(nudge_optionsDiv);

              var nudge_chatDiv = document.createElement('div');
              nudge_chatDiv.id='chatjsicon'; nudge_chatDiv.className='chatjsicon chatjsi';
              minifiedWrapperDiv.appendChild(nudge_chatDiv);

            default_navDiv.appendChild(main_navDiv)  
          nav.appendChild(default_navDiv)
        wrapperDiv.appendChild(nav);
        
        /*--now create and append innerDiv to wrapperDiv--*/
        var innerDiv = document.createElement('div');
        innerDiv.id='inner';  innerDiv.className='inner';

          //Now create and append sidenav to sidebarDiv
          var menuBox = document.createElement('input');
          menuBox.id='menucheckbox'; menuBox.type = "checkbox";
          innerDiv.appendChild(menuBox);

          //Now create and append sidebarDiv to innerDiv
          var sidebarDiv = document.createElement('div');
          sidebarDiv.id='sidebar'; sidebarDiv.className='sidebar';

            //Now create and append menuBox to sidebarDiv
            var sidenav = document.createElement('ul');
            sidenav.id='sidenav'; sidenav.className='sidenav';
              var menuItems = ["Lobby","About"];
              //Now create and item li to sidenav
              for(var i=0;i<menuItems.length;i++){
                var liItem = document.createElement('li');
                  var aTag = document.createElement('a');
                  aTag.href='#'; aTag.innerHTML = "<b>"+menuItems[i]+"</b>"
                  liItem.appendChild(aTag)
                sidenav.appendChild(liItem)       
              }

            sidebarDiv.appendChild(sidenav);

          //Now create and append contentDiv to innerDiv
          var contentDiv = document.createElement('div');
          contentDiv.id='content'; contentDiv.className='content';
          innerDiv.appendChild(sidebarDiv); 

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
        wrapperDiv.appendChild(bottomDiv);
        chatjsContainer.appendChild(wrapperDiv);
        chatjsContainer.appendChild(minifiedWrapperDiv);
      document.getElementsByTagName('body')[0].appendChild(chatjsContainer);
  }
  addStyleSheets = function(){

      //string containg nudge styles
      var nudgeStyles = '.chatjsContainer .minified-wrapper{\
                                          background-color: #b7170b;\
                                          width: 60px;\
                                          height: 60px;\
                                          position: fixed;\
                                          bottom: 30px;\
                                          display:block;\
                                          left: 48%;\
                                          cursor: move;\
                                          border-radius: 50px}' + 
                          '.chatjsContainer .bottom .input:focus,.chatjsContainer .bottom .send:focus {\
                                          outline: 0;}' + 
                          '*{ box-sizing: border-box }' + 
                          '.chatjsContainer .bottom .send:hover,.chatjsContainer .nav .default-nav .main-nav .options:hover,.chatjsContainer .nav .default-nav .main-nav .toggle:hover{\
                                          cursor: pointer;}' +
                          '.chatjsContainer .wrapper{\
                                          height: 520px;\
                                          width: 320px;\
                                          background-color: #fff;\
                                          position: fixed;\
                                          display:none;\
                                          bottom: 10px;\
                                          left: 50%;\
                                          -ms-transform: translateX(-50%);\
                                          -moz-transform: translateX(-50%);\
                                          -webkit-transform: translateX(-50%);\
                                          transform: translateX(-50%);\
                                          box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .5);\
                                          transition: .3s ease}' + 
                          '.chatjsContainer .wrapper .inner {\
                                          height: 390px;\
                                          overflow:auto;\
                                          background: #f2f2f2;\
                                          -ms-overflow-style: none;\
                                          overflow: -moz-scrollbars-none}' + 
                          '.chatjsContainer .minified-wrapper .inner,.chatjsContainer .minified-wrapper .bottom{ display:none}'+
                          '.chatjsContainer .nav .default-nav,.chatjsContainer .nav .default-nav .main-nav {\
                                          left: 0;\
                                          width: 100%;height: 64px;\
                                          transition: .3s ease;\
                                          top: 0}' + 
                          '.chatjsContainer .wrapper .inner .content {\
                                          padding: 10.66666667px;\
                                          position: relative;\
                                          margin-bottom: 50px}' + 
                          '.chatjsContainer .nav {\
                                          position: relative;\
                                          top: 0;\
                                          left: 0;\
                                          right: 0;\
                                          cursor:pointer;\
                                          height: 64px;\
                                          z-index: 100;\
                                          transition: .3s ease}' + 
                          '.chatjsContainer .nav .default-nav {\
                                          position: absolute;\
                                          z-index: 110;\
                                          background-color: #b7170b;\
                                          border-bottom: 3px solid #b7170b;\
                                          color: #fff;\
                                          -webkit-box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1);\
                                          -moz-box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1);\
                                          box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .1)}' + 
                          '.chatjsContainer .nav .default-nav .main-nav {\
                                          position: absolute;\
                                          margin: 0;\
                                          padding: 0;\
                                          list-style: none}' + 
                          '.chatjsContainer .menuButton {\
                                          position: relative;\
                                          display: inline-block;\
                                          cursor: pointer;\
                                          border: 2px solid #fff;\
                                          border-radius: 2px;\
                                          height: 40px;\
                                          width: 40px;\
                                          top:15px;\
                                          left:15px;}' +
                          '.chatjsContainer #menudots:before {\
                                          position: absolute;\
                                          content:"";\
                                          border-top: 6px solid #fff; \
                                          border-bottom: 17px double #fff;\
                                          height: 5px;\
                                          width:30px;\
                                          top: 4px;\
                                          right:3px;}' +
                          '.chatjsContainer #menudots:after {\
                                          position: absolute;\
                                          content:"";\
                                          border-left: 6px solid #b7170b;\
                                          border-right: 6px solid #b7170b;\
                                          height: 28px;\
                                          width:6px;\
                                          top: 4px;\
                                          left:9px;}' +
                          '.chatjsContainer #menucheckbox { display: none; }' +
                          '.chatjsContainer .sidenav {\
                                          width: 150px;\
                                          z-index:10;\
                                          padding: 70px 0 0 10px;\
                                          position: absolute;\
                                          left: 0;\
                                          top: 0;\
                                          bottom: 0;}' +
                          '.chatjsContainer .sidenav li {\
                                          display: none;\
                                          list-style-type: none;\
                                          transition: all .5s;\
                                          padding-left:20px;}' +
                          '.chatjsContainer #menucheckbox:checked ~ .sidebar .sidenav li:hover { background: #ff5722; }' +
                          '.chatjsContainer #menucheckbox:checked ~ .content {\
                                          -ms-transform: translateX(150px);\
                                          -moz-transform: translateX(150px);\
                                          -webkit-transform: translateX(150px);\
                                          transform: translateX(150px);}' +
                          '.chatjsContainer .sidenav a { color: white; text-decoration: none; }'+
                          '.chatjsContainer .sidenav b {\
                                          font: bold 12px/48px Roboto;\
                                          display: block;\
                                          opacity: 0;\
                                          transform: translateX(50px);\
                                          transition: all 0.4s;}'+
                          '.chatjsContainer #menucheckbox:checked + .sidebar .sidenav{\
                                          background-color: #b7170b;}'+
                          '.chatjsContainer #menucheckbox:checked + .sidebar .sidenav li {\
                                          display: block;}'+
                          '.chatjsContainer #menucheckbox:checked ~ .sidebar .sidenav b { opacity: 1; transform: translateX(0); }'+
                          '.chatjsContainer .chatjsicon {\
                                          position: absolute;\
                                          width: 25px;\
                                          height: 20px;\
                                          border-radius: 50%;\
                                          background: #ECECEC;\
                                          cursor:pointer;\
                                          border: 1px solid rgba(0,0,0,0.1);\
                                          box-shadow:\
                                            inset 0 5px 0 rgba(255,255,255,0.3),\
                                            inset 0 -5px 0 rgba(180,180,180,0.1),\
                                            0 0 10px rgba(0,0,0,0.1),\
                                            0 3px 3px rgba(0,0,0,0.2);}' + 
                          '.chatjsContainer .chatjsicon:after {\
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
                          '.chatjsContainer .chatjsi {\
                                          background: #EFEFEF;\
                                          left: 17px;\
                                          top: 19px;}'+ 
                          '.chatjsContainer .bottom,.chatjsContainer .bottom .input {\
                                          height: 64px;\
                                          background: #fff;\
                                          left: 0}' + 
                          '.chatjsContainer .nav .default-nav .main-nav .main-nav-item {\
                                          float: left;\
                                          height: 64px;\
                                          margin-right: 50px;\
                                          position: relative;\
                                          line-height: 64px;\
                                          transition: .3s ease}' + 
                          '.chatjsContainer .nav .default-nav .main-nav .main-nav-item .main-nav-item-link {\
                                          display: block;\
                                          position: relative;\
                                          height: 64px;\
                                          width: 100%;\
                                          text-align: center;\
                                          line-height: 64px;\
                                          text-decoration: none;\
                                          color: inherit;\
                                          transition: .3s ease}' + 
                          '.chatjsContainer .bottom {\
                                          position: relative;\
                                          bottom: 0;\
                                          left: 0;\
                                          background-color: rgba(0,0,0,0.2);\
                                          right: 0;\
                                          height: 64px;\
                                          z-index: 100;}' + 
                          '.chatjsContainer .bottom .input {\
                                          border: none;\
                                          width: 80%;\
                                          position: absolute;\
                                          background: transparent;\
                                          top: 0;\
                                          padding: 0 5%;\
                                          resize: none;\
                                          padding-top: 24px;\
                                          font-weight: 300;\
                                          -ms-overflow-style: none;\
                                          overflow: -moz-scrollbars-none}' + 
                          '.chatjsContainer .bottom .send {\
                                          position: absolute;\
                                          height: 42.66666667px;\
                                          width: 42.66666667px;\
                                          border-radius: 50%;\
                                          border: 0;\
                                          background: #b7170b;\
                                          color: #fff;\
                                          bottom: 10.66666667px;\
                                          right: 10.66666667px}' + 
                          '.chatjsContainer .bottom .send:before {\
                                          content: "";\
                                          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/104946/ic_send_white_48dp.png) center center no-repeat;\
                                          background-size: 25.6px;\
                                          position: absolute;\
                                          top: 0;\
                                          left: 0;\
                                          right: 0;\
                                          bottom: 0}' + 
                          '.chatjsContainer .message-wrapper {\
                                          position: relative;\
                                          overflow: hidden;\
                                          width: 100%;\
                                          margin: 10.66666667px 0;\
                                          padding: 10.66666667px 0}' + 
                          '.chatjsContainer .message-wrapper .circle-wrapper {\
                                          height: 42.66666667px;\
                                          width: 42.66666667px;\
                                          border-radius: 50%}' + 
                          '.chatjsContainer .message-wrapper .text-wrapper {\
                                          padding: 10.66666667px;\
                                          min-height: 42.66666667px;\
                                          width: 60%;\
                                          margin: 0 10.66666667px;\
                                          box-shadow: 0 1px 0 0 rgba(50, 50, 50, .3);\
                                          border-radius: 2px;\
                                          font-weight: 300;\
                                          position: relative;\
                                          opacity: 0}' +
                          '.chatjsContainer .notification {text-align:center}' +
                          '.chatjsContainer .message-wrapper .text-wrapper:before {\
                                          content: "";\
                                          width: 0;\
                                          height: 0;\
                                          border-style: solid}' + 
                          '.chatjsContainer .message-wrapper.them .circle-wrapper,.chatjsContainer .message-wrapper.them .text-wrapper {\
                                          background: #b7170b;\
                                          float: left;\
                                          color: #fff}' + 
                          '.chatjsContainer .message-wrapper.them .text-wrapper:before {\
                                          border-width: 0 10px 10px 0;\
                                          border-color: transparent #b7170b transparent transparent;\
                                          position: absolute;\
                                          top: 0;\
                                          left: -9px}' + 
                          '.chatjsContainer .message-wrapper.me .circle-wrapper,.chatjsContainer .message-wrapper.me .text-wrapper {\
                                          background: #ff5722;\
                                          float: right;\
                                          color: #333}' + 
                          '.chatjsContainer .message-wrapper.me .text-wrapper {\
                                          background: #fff ;\
                                          word-wrap: break-word;}' +
                          '.chatjsContainer .message-wrapper.them .text-wrapper {\
                                          background: #b7170b;\
                                          word-wrap: break-word;}'+                                           
                          '.chatjsContainer .message-wrapper.me .text-wrapper:before {\
                                          border-width: 10px 10px 0 0;\
                                          border-color: #fff transparent transparent;\
                                          position: absolute;\
                                          top: 0;\
                                          right: -9px}' + 
                          '.chatjsContainer .animated {\
                                          -webkit-animation-duration: 1s;\
                                          animation-duration: 1s;\
                                          -webkit-animation-fill-mode: both;\
                                          animation-fill-mode: both}' + 
                          '.chatjsContainer .fadeIn {\
                                          -webkit-animation-name: fadeIn;\
                                          animation-name: fadeIn}' + 
                          '@-webkit-keyframes fadeIn {0% {  opacity: 0 } 100% { opacity: 1 }}'+
                          '.chatjsContainer .wrapper .inner::-webkit-scrollbar { width: 0}' +
                          '.chatjsContainer .bottom .input::-webkit-scrollbar { width: 0}'+
                          '@keyframes fadeIn { 0% {  opacity: 0 } 100% {  opacity: 1 }}'+
                          '@media only screen and (min-device-width: 320px) and (max-device-width: 640px){\
                                      .chatjsContainer .wrapper{\
                                          width:100%;\
                                          height:100%;\
                                          top:0 !important;\
                                          left:50% !important}\
                                      .chatjsContainer .nav {width:100%}\
                                      .chatjsContainer .wrapper .inner, .chatjsContainer .wrapper .sidenav{\
                                          height:80%;}\
                                      .chatjsContainer .wrapper .bottom {\
                                          bottom:70px;}}';

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
      x_pos = document.all ? parseInt(e.clientX) : parseInt(e.pageX);
      y_pos = document.all ? parseInt(e.clientY) : parseInt(e.pageY);
      if (selected !== null && x_pos<(window.innerWidth-40) && x_pos>40 && y_pos<(window.innerHeight-40) && y_pos > 40) {
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
  document.ontouchend = _destroy;

  init = function(){

      createDOMstructure();
      addStyleSheets();
      var ele = document.getElementById('minified-wrapper')

      ele.addEventListener('mousedown',function(e){
        if(e.target.id !== 'chatjsicon'){
            _drag_init(e.target);
        }
        return false;
      },false);

    var touchobj = null // Touch object holder
 
    ele.addEventListener('touchstart', function(e){
        touchobj = e.changedTouches[0] // reference first touch point
        if(touchobj.target.id !== 'chatjsicon'){
          _drag_init(touchobj.target)
        }
        return false;
    }, false)
 
    ele.addEventListener('touchmove', function(e){
        touchobj = e.changedTouches[0] // reference first touch point for this event
        if(touchobj.target.id !== 'chatjsicon'){
          _move_elem(touchobj)
        }
        return false;
    }, false)      
      chat_messenger.self = new chat_messenger.Messenger()
      return chat_messenger.self;
  }

  var isVisible = function(element){
    return (element.currentStyle ? element.currentStyle.display :
                              getComputedStyle(element, null).display) !== 'none';    
  }
  var collapseToggle = function(){
      var ele = document.getElementById('wrapper')
      var eleMini = document.getElementById('minified-wrapper')
      ele.style.display=(isVisible(ele))?'none':'block';
      eleMini.style.display=(isVisible(eleMini))?'none':'block';
  }
  var chat_messenger = {
    _createClass: _createClass,
    Messenger: Messenger,
    BuildHTML: BuildHTML,
    init: init,
    self: self,
    collapseToggle:collapseToggle
  }

  window.chatMessenger = chat_messenger;

  if (typeof window.define === "function" && window.define.amd) {
    window.define("chatMessenger", [], function() {
      return window.chatMessenger;
    });
  }

}).call(this);