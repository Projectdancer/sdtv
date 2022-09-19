/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/aos/dist/aos.js":
/*!**************************************!*\
  !*** ./node_modules/aos/dist/aos.js ***!
  \**************************************/
/***/ (function(module) {

eval("!function(e,t){ true?module.exports=t():0}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p=\"dist/\",t(0)}([function(e,t,n){\"use strict\";function o(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=n(1),a=(o(r),n(6)),u=o(a),c=n(7),s=o(c),f=n(8),d=o(f),l=n(9),p=o(l),m=n(10),b=o(m),v=n(11),y=o(v),g=n(14),h=o(g),w=[],k=!1,x={offset:120,delay:0,easing:\"ease\",duration:400,disable:!1,once:!1,startEvent:\"DOMContentLoaded\",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},j=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e&&(k=!0),k)return w=(0,y.default)(w,x),(0,b.default)(w,x.once),w},O=function(){w=(0,h.default)(),j()},M=function(){w.forEach(function(e,t){e.node.removeAttribute(\"data-aos\"),e.node.removeAttribute(\"data-aos-easing\"),e.node.removeAttribute(\"data-aos-duration\"),e.node.removeAttribute(\"data-aos-delay\")})},S=function(e){return e===!0||\"mobile\"===e&&p.default.mobile()||\"phone\"===e&&p.default.phone()||\"tablet\"===e&&p.default.tablet()||\"function\"==typeof e&&e()===!0},_=function(e){x=i(x,e),w=(0,h.default)();var t=document.all&&!window.atob;return S(x.disable)||t?M():(x.disableMutationObserver||d.default.isSupported()||(console.info('\\n      aos: MutationObserver is not supported on this browser,\\n      code mutations observing has been disabled.\\n      You may have to call \"refreshHard()\" by yourself.\\n    '),x.disableMutationObserver=!0),document.querySelector(\"body\").setAttribute(\"data-aos-easing\",x.easing),document.querySelector(\"body\").setAttribute(\"data-aos-duration\",x.duration),document.querySelector(\"body\").setAttribute(\"data-aos-delay\",x.delay),\"DOMContentLoaded\"===x.startEvent&&[\"complete\",\"interactive\"].indexOf(document.readyState)>-1?j(!0):\"load\"===x.startEvent?window.addEventListener(x.startEvent,function(){j(!0)}):document.addEventListener(x.startEvent,function(){j(!0)}),window.addEventListener(\"resize\",(0,s.default)(j,x.debounceDelay,!0)),window.addEventListener(\"orientationchange\",(0,s.default)(j,x.debounceDelay,!0)),window.addEventListener(\"scroll\",(0,u.default)(function(){(0,b.default)(w,x.once)},x.throttleDelay)),x.disableMutationObserver||d.default.ready(\"[data-aos]\",O),w)};e.exports={init:_,refresh:j,refreshHard:O}},function(e,t){},,,,,function(e,t){(function(t){\"use strict\";function n(e,t,n){function o(t){var n=b,o=v;return b=v=void 0,k=t,g=e.apply(o,n)}function r(e){return k=e,h=setTimeout(f,t),M?o(e):g}function a(e){var n=e-w,o=e-k,i=t-n;return S?j(i,y-o):i}function c(e){var n=e-w,o=e-k;return void 0===w||n>=t||n<0||S&&o>=y}function f(){var e=O();return c(e)?d(e):void(h=setTimeout(f,a(e)))}function d(e){return h=void 0,_&&b?o(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),k=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(O())}function m(){var e=O(),n=c(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(f,t),o(w)}return void 0===h&&(h=setTimeout(f,t)),g}var b,v,y,g,h,w,k=0,M=!1,S=!1,_=!0;if(\"function\"!=typeof e)throw new TypeError(s);return t=u(t)||0,i(n)&&(M=!!n.leading,S=\"maxWait\"in n,y=S?x(u(n.maxWait)||0,t):y,_=\"trailing\"in n?!!n.trailing:_),m.cancel=l,m.flush=p,m}function o(e,t,o){var r=!0,a=!0;if(\"function\"!=typeof e)throw new TypeError(s);return i(o)&&(r=\"leading\"in o?!!o.leading:r,a=\"trailing\"in o?!!o.trailing:a),n(e,t,{leading:r,maxWait:t,trailing:a})}function i(e){var t=\"undefined\"==typeof e?\"undefined\":c(e);return!!e&&(\"object\"==t||\"function\"==t)}function r(e){return!!e&&\"object\"==(\"undefined\"==typeof e?\"undefined\":c(e))}function a(e){return\"symbol\"==(\"undefined\"==typeof e?\"undefined\":c(e))||r(e)&&k.call(e)==d}function u(e){if(\"number\"==typeof e)return e;if(a(e))return f;if(i(e)){var t=\"function\"==typeof e.valueOf?e.valueOf():e;e=i(t)?t+\"\":t}if(\"string\"!=typeof e)return 0===e?e:+e;e=e.replace(l,\"\");var n=m.test(e);return n||b.test(e)?v(e.slice(2),n?2:8):p.test(e)?f:+e}var c=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},s=\"Expected a function\",f=NaN,d=\"[object Symbol]\",l=/^\\s+|\\s+$/g,p=/^[-+]0x[0-9a-f]+$/i,m=/^0b[01]+$/i,b=/^0o[0-7]+$/i,v=parseInt,y=\"object\"==(\"undefined\"==typeof t?\"undefined\":c(t))&&t&&t.Object===Object&&t,g=\"object\"==(\"undefined\"==typeof self?\"undefined\":c(self))&&self&&self.Object===Object&&self,h=y||g||Function(\"return this\")(),w=Object.prototype,k=w.toString,x=Math.max,j=Math.min,O=function(){return h.Date.now()};e.exports=o}).call(t,function(){return this}())},function(e,t){(function(t){\"use strict\";function n(e,t,n){function i(t){var n=b,o=v;return b=v=void 0,O=t,g=e.apply(o,n)}function r(e){return O=e,h=setTimeout(f,t),M?i(e):g}function u(e){var n=e-w,o=e-O,i=t-n;return S?x(i,y-o):i}function s(e){var n=e-w,o=e-O;return void 0===w||n>=t||n<0||S&&o>=y}function f(){var e=j();return s(e)?d(e):void(h=setTimeout(f,u(e)))}function d(e){return h=void 0,_&&b?i(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),O=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(j())}function m(){var e=j(),n=s(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(f,t),i(w)}return void 0===h&&(h=setTimeout(f,t)),g}var b,v,y,g,h,w,O=0,M=!1,S=!1,_=!0;if(\"function\"!=typeof e)throw new TypeError(c);return t=a(t)||0,o(n)&&(M=!!n.leading,S=\"maxWait\"in n,y=S?k(a(n.maxWait)||0,t):y,_=\"trailing\"in n?!!n.trailing:_),m.cancel=l,m.flush=p,m}function o(e){var t=\"undefined\"==typeof e?\"undefined\":u(e);return!!e&&(\"object\"==t||\"function\"==t)}function i(e){return!!e&&\"object\"==(\"undefined\"==typeof e?\"undefined\":u(e))}function r(e){return\"symbol\"==(\"undefined\"==typeof e?\"undefined\":u(e))||i(e)&&w.call(e)==f}function a(e){if(\"number\"==typeof e)return e;if(r(e))return s;if(o(e)){var t=\"function\"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+\"\":t}if(\"string\"!=typeof e)return 0===e?e:+e;e=e.replace(d,\"\");var n=p.test(e);return n||m.test(e)?b(e.slice(2),n?2:8):l.test(e)?s:+e}var u=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},c=\"Expected a function\",s=NaN,f=\"[object Symbol]\",d=/^\\s+|\\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,m=/^0o[0-7]+$/i,b=parseInt,v=\"object\"==(\"undefined\"==typeof t?\"undefined\":u(t))&&t&&t.Object===Object&&t,y=\"object\"==(\"undefined\"==typeof self?\"undefined\":u(self))&&self&&self.Object===Object&&self,g=v||y||Function(\"return this\")(),h=Object.prototype,w=h.toString,k=Math.max,x=Math.min,j=function(){return g.Date.now()};e.exports=n}).call(t,function(){return this}())},function(e,t){\"use strict\";function n(e){var t=void 0,o=void 0,i=void 0;for(t=0;t<e.length;t+=1){if(o=e[t],o.dataset&&o.dataset.aos)return!0;if(i=o.children&&n(o.children))return!0}return!1}function o(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function i(){return!!o()}function r(e,t){var n=window.document,i=o(),r=new i(a);u=t,r.observe(n.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}function a(e){e&&e.forEach(function(e){var t=Array.prototype.slice.call(e.addedNodes),o=Array.prototype.slice.call(e.removedNodes),i=t.concat(o);if(n(i))return u()})}Object.defineProperty(t,\"__esModule\",{value:!0});var u=function(){};t.default={isSupported:i,ready:r}},function(e,t){\"use strict\";function n(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function o(){return navigator.userAgent||navigator.vendor||window.opera||\"\"}Object.defineProperty(t,\"__esModule\",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,\"value\"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,a=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i,u=/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,c=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i,s=function(){function e(){n(this,e)}return i(e,[{key:\"phone\",value:function(){var e=o();return!(!r.test(e)&&!a.test(e.substr(0,4)))}},{key:\"mobile\",value:function(){var e=o();return!(!u.test(e)&&!c.test(e.substr(0,4)))}},{key:\"tablet\",value:function(){return this.mobile()&&!this.phone()}}]),e}();t.default=new s},function(e,t){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var n=function(e,t,n){var o=e.node.getAttribute(\"data-aos-once\");t>e.position?e.node.classList.add(\"aos-animate\"):\"undefined\"!=typeof o&&(\"false\"===o||!n&&\"true\"!==o)&&e.node.classList.remove(\"aos-animate\")},o=function(e,t){var o=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,r){n(e,i+o,t)})};t.default=o},function(e,t,n){\"use strict\";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,\"__esModule\",{value:!0});var i=n(12),r=o(i),a=function(e,t){return e.forEach(function(e,n){e.node.classList.add(\"aos-init\"),e.position=(0,r.default)(e.node,t.offset)}),e};t.default=a},function(e,t,n){\"use strict\";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,\"__esModule\",{value:!0});var i=n(13),r=o(i),a=function(e,t){var n=0,o=0,i=window.innerHeight,a={offset:e.getAttribute(\"data-aos-offset\"),anchor:e.getAttribute(\"data-aos-anchor\"),anchorPlacement:e.getAttribute(\"data-aos-anchor-placement\")};switch(a.offset&&!isNaN(a.offset)&&(o=parseInt(a.offset)),a.anchor&&document.querySelectorAll(a.anchor)&&(e=document.querySelectorAll(a.anchor)[0]),n=(0,r.default)(e).top,a.anchorPlacement){case\"top-bottom\":break;case\"center-bottom\":n+=e.offsetHeight/2;break;case\"bottom-bottom\":n+=e.offsetHeight;break;case\"top-center\":n+=i/2;break;case\"bottom-center\":n+=i/2+e.offsetHeight;break;case\"center-center\":n+=i/2+e.offsetHeight/2;break;case\"top-top\":n+=i;break;case\"bottom-top\":n+=e.offsetHeight+i;break;case\"center-top\":n+=e.offsetHeight/2+i}return a.anchorPlacement||a.offset||isNaN(t)||(o=t),n+o};t.default=a},function(e,t){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var n=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-(\"BODY\"!=e.tagName?e.scrollLeft:0),n+=e.offsetTop-(\"BODY\"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:n,left:t}};t.default=n},function(e,t){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var n=function(e){return e=e||document.querySelectorAll(\"[data-aos]\"),Array.prototype.map.call(e,function(e){return{node:e}})};t.default=n}])});\n\n//# sourceURL=webpack://sdtv/./node_modules/aos/dist/aos.js?");

/***/ }),

/***/ "./source/js/legacy.js":
/*!*****************************!*\
  !*** ./source/js/legacy.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* $(document).ready(function () {\n    var mob_moving = false;\n    $(window).scroll(function() {\n\n        if(!mob_moving && $('.block-mod-description-title').offset().top - 50 < pos_x*10){\n            mob_moving = true;\n            $('#block-mod-description-text').animate({'height': '100px'}, 500);\n        }\n\n        var block_fides = $('.block-fide');\n        var h = screen.height;\n        console.log(h);\n        for(var i=0; i<block_fides.length; i++){\n            var block_fide = block_fides.get(i);\n            if($(block_fide).offset().top < pos_x*10+h){\n                $(block_fide).animate({'opacity': 1}, 1000);\n            }\n        }\n    });\n})\n\n$('.block-mod-description-menu-link').click(function(){\n    $('.block-mod-description-menu-link').attr('class', 'block-mod-description-menu-link');\n    $(this).attr('class', 'block-mod-description-menu-link active');\n})\nvar block_styles_left = 0;\n\n\nfunction resize() {\n    if($(window).width() <= 768){\n        $('.block-style-item').width($(window).width());\n        $('.block-styles').css('left', block_styles_left*$(window).width());\n    }else{\n        $('.block-style-item').width(\"\");\n    }\n}\nresize();\n$(window).resize(function(){\n    resize();\n})\n\n$('.block-style-left').click(function () {\n    block_styles_left ++;\n    if(block_styles_left > 0){\n        block_styles_left = $('.block-style-item').length*-1+1;\n    }\n    $('.block-styles').animate({left: block_styles_left*$(window).width()}, 500);\n})\n\n$('.block-style-right').click(function () {\n    block_styles_left --;\n    var count = $('.block-style-item').length*-1+1;\n    if(block_styles_left < count){\n        block_styles_left = 0;\n    }\n    $('.block-styles').animate({left: block_styles_left*$(window).width()}, 500);\n})\n */\n\n//# sourceURL=webpack://sdtv/./source/js/legacy.js?");

/***/ }),

/***/ "./source/js/main.js":
/*!***************************!*\
  !*** ./source/js/main.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/initSomething.js */ \"./source/js/utils/initSomething.js\");\n/* harmony import */ var _utils_initSlider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/initSlider.js */ \"./source/js/utils/initSlider.js\");\n/* harmony import */ var _utils_initTabList_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/initTabList.js */ \"./source/js/utils/initTabList.js\");\n/* harmony import */ var _utils_navInit_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/navInit.js */ \"./source/js/utils/navInit.js\");\n/* harmony import */ var _utils_animateWhenOnView_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/animateWhenOnView.js */ \"./source/js/utils/animateWhenOnView.js\");\n/* harmony import */ var _utils_initModalToggler_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/initModalToggler.js */ \"./source/js/utils/initModalToggler.js\");\n/* harmony import */ var _utils_initClassForm_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/initClassForm.js */ \"./source/js/utils/initClassForm.js\");\n/* harmony import */ var _utils_initVideoOnHover_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/initVideoOnHover.js */ \"./source/js/utils/initVideoOnHover.js\");\n/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! aos */ \"./node_modules/aos/dist/aos.js\");\n\n\n\n\n\n\n\n\n\naos__WEBPACK_IMPORTED_MODULE_8__.init(); // document.addEventListener('aos:in', ({ detail }) => {\n//     console.log('animated in', detail);\n//   });\n\n(0,_utils_navInit_js__WEBPACK_IMPORTED_MODULE_3__.navInit)();\n(0,_utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__.initSomething)(\".slider\", _utils_initSlider_js__WEBPACK_IMPORTED_MODULE_1__.initSlider);\n(0,_utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__.initSomething)(\".tablist\", _utils_initTabList_js__WEBPACK_IMPORTED_MODULE_2__.initTabList);\n(0,_utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__.initSomething)(\"[data-animation]\", _utils_animateWhenOnView_js__WEBPACK_IMPORTED_MODULE_4__.animateWhenOnView);\n(0,_utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__.initSomething)(\".modal-link\", _utils_initModalToggler_js__WEBPACK_IMPORTED_MODULE_5__.initModalToggler);\n(0,_utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__.initSomething)(\".classes-item[href]\", _utils_initClassForm_js__WEBPACK_IMPORTED_MODULE_6__.initClassForm);\n(0,_utils_initSomething_js__WEBPACK_IMPORTED_MODULE_0__.initSomething)(\".figure--video\", _utils_initVideoOnHover_js__WEBPACK_IMPORTED_MODULE_7__.default);\ndocument.addEventListener(\"scroll\", moveClasses);\n\nfunction moveClasses() {\n  var pos_x = window.scrollY / 10;\n  var row1 = document.querySelector(\"#classes-row-first\");\n  var row2 = document.querySelector(\"#classes-row-second\"); // const tarrifs = document.querySelector(\"#tariffs\");\n\n  row1.style.left = \"\".concat(pos_x - 700, \"px\");\n  row2.style.left = \"\".concat(-pos_x - 700, \"px\"); // console.log(pos_x)\n  // tarrifs.style.backgroundPositionX = `${pos_x}px`;\n}\n\n//# sourceURL=webpack://sdtv/./source/js/main.js?");

/***/ }),

/***/ "./source/js/utils/animateWhenOnView.js":
/*!**********************************************!*\
  !*** ./source/js/utils/animateWhenOnView.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"animateWhenOnView\": () => (/* binding */ animateWhenOnView)\n/* harmony export */ });\n// get the element to animate\nfunction animateWhenOnView(element) {\n  var animation = element.dataset.animation;\n  var elementHeight = element.clientHeight;\n  var endVal;\n\n  switch (animation) {\n    case \"increase-number\":\n      endVal = element.innerText;\n      break;\n\n    default:\n      break;\n  }\n\n  document.addEventListener(\"scroll\", animate);\n\n  function animate() {\n    // is element in view?\n    if (inView(animation)) {\n      // console.log(`Element ${element.className} in vie at ${scrollY}`);\n      switch (animation) {\n        case \"increase-number\":\n          animateValue(element, 0, endVal, endVal / 90 * 4000);\n          document.removeEventListener(\"scroll\", animate);\n          break;\n\n        default:\n          break;\n      }\n    }\n  }\n\n  function inView() {\n    // get window height\n    var windowHeight = window.innerHeight; // get number of pixels that the document is scrolled\n\n    var scrollY = window.scrollY || window.pageYOffset; // get current scroll position (distance from the top of the page to the bottom of the current viewport)\n\n    var scrollPosition = scrollY + windowHeight; // get element position (distance from the top of the page to the bottom of the element)\n\n    var elementPosition = element.getBoundingClientRect().top + scrollY + elementHeight / 2; // is scroll position greater than element position? (is element in view?)\n\n    if (scrollPosition > elementPosition) {\n      return true;\n    }\n\n    return false;\n  }\n}\n\nfunction animateValue(obj, start, end) {\n  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;\n  var startTimestamp = null;\n\n  var step = function step(timestamp) {\n    if (!startTimestamp) startTimestamp = timestamp;\n    var progress = Math.min((timestamp - startTimestamp) / duration, 1);\n    obj.innerHTML = Math.floor(progress * (end - start) + start);\n\n    if (progress < 1) {\n      window.requestAnimationFrame(step);\n    }\n  };\n\n  window.requestAnimationFrame(step);\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/animateWhenOnView.js?");

/***/ }),

/***/ "./source/js/utils/initClassForm.js":
/*!******************************************!*\
  !*** ./source/js/utils/initClassForm.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initClassForm\": () => (/* binding */ initClassForm)\n/* harmony export */ });\n/* harmony import */ var _initModalToggler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initModalToggler.js */ \"./source/js/utils/initModalToggler.js\");\n\nfunction initClassForm(classItem) {\n  classItem.addEventListener(\"click\", function () {\n    var classInModal = document.querySelector('.payment__side .classes-item');\n    classInModal.innerHTML = classItem.innerHTML;\n  });\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/initClassForm.js?");

/***/ }),

/***/ "./source/js/utils/initModalToggler.js":
/*!*********************************************!*\
  !*** ./source/js/utils/initModalToggler.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initModalToggler\": () => (/* binding */ initModalToggler),\n/* harmony export */   \"showModal\": () => (/* binding */ showModal)\n/* harmony export */ });\n/* harmony import */ var _removeHashfromURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./removeHashfromURL.js */ \"./source/js/utils/removeHashfromURL.js\");\n\nfunction initModalToggler(modalToggler) {\n  var modal = document.querySelector(modalToggler.getAttribute(\"href\"));\n\n  if (!modal) {\n    return;\n    \"\";\n  }\n\n  modal.classList.remove(\"modal--no-js\");\n\n  if (window.location.hash === \"#\".concat(modal.id)) {\n    showModal(modal);\n  }\n\n  modalToggler.addEventListener(\"click\", function (evt) {\n    evt.preventDefault();\n    showModal(modal);\n  });\n}\nfunction showModal(modal) {\n  var overlay = document.querySelector(\".overlay\");\n  modal.hidden = false;\n  overlay.hidden = false;\n  var firstInput = modal.querySelector(\"input\");\n\n  if (firstInput) {\n    firstInput.focus();\n  }\n\n  var closeButton = modal.querySelector(\".modal__close\");\n  closeButton.addEventListener(\"click\", function (event) {\n    hideModal(event);\n  });\n  document.addEventListener(\"keydown\", function (event) {\n    if (event.key === \"Escape\" || event.key === \"Esc\") {\n      if (modal.hidden === false) {\n        hideModal(event);\n      }\n    }\n  });\n  overlay.addEventListener(\"click\", hideModal);\n\n  function hideModal(evt) {\n    evt.preventDefault();\n    modal.hidden = true;\n    overlay.hidden = true;\n    (0,_removeHashfromURL_js__WEBPACK_IMPORTED_MODULE_0__.removeHashFromUrl)();\n  }\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/initModalToggler.js?");

/***/ }),

/***/ "./source/js/utils/initSlider.js":
/*!***************************************!*\
  !*** ./source/js/utils/initSlider.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initSlider\": () => (/* binding */ initSlider)\n/* harmony export */ });\nfunction initSlider(slider) {\n  var wrapper = slider.querySelector(\".slider__wrapper\");\n  var slides = slider.querySelectorAll(\".slider__slide\");\n  var firstInit = true;\n  var current = 0;\n  var startPoints = calcStartPoints();\n  var tabs = slider.querySelectorAll(\".slider__tab\");\n  var tabsMode = Boolean(tabs.length);\n  var controls = slider.querySelectorAll(\".slider__button\");\n  initControls();\n  updateCurrent(current);\n\n  if (tabsMode) {\n    tabs.forEach(initTab);\n  }\n\n  wrapper.addEventListener(\"scroll\", function () {\n    if (startPoints.includes(wrapper.scrollLeft)) {\n      var newIndex = startPoints.indexOf(wrapper.scrollLeft);\n\n      if (newIndex !== current) {\n        updateCurrent(newIndex);\n      }\n    }\n  });\n\n  function goToSlide(index) {\n    wrapper.scrollLeft = startPoints[index];\n    updateCurrent(index);\n  }\n\n  function updateCurrent(index) {\n    if (tabsMode && !firstInit) {\n      tabs[current].removeAttribute(\"aria-selected\");\n      tabs[current].classList.remove(\"slider__tab--active\");\n      tabs[current].blur();\n    }\n\n    current = index;\n\n    if (tabsMode) {\n      tabs[current].classList.add(\"slider__tab--active\");\n      tabs[current].setAttribute(\"aria-selected\", \"true\");\n      !firstInit ? tabs[current].focus() : firstInit = false;\n    }\n  }\n\n  function initTab(tab, index) {\n    tab.addEventListener(\"click\", function (evt) {\n      evt.preventDefault();\n      goToSlide(index);\n    });\n  }\n\n  function prevSlide() {\n    current === 0 ? goToSlide(startPoints.length - 1) : goToSlide(current - 1);\n  }\n\n  function nextSlide() {\n    current === startPoints.length - 1 ? goToSlide(0) : goToSlide(current + 1);\n  }\n\n  function calcStartPoints() {\n    var startPoints = [];\n    var wrapperStartPoint = wrapper.getBoundingClientRect().x;\n    var endPoint = wrapper.scrollWidth - wrapper.offsetWidth;\n    slides.forEach(function (slide) {\n      var currentSlideStart = slide.getBoundingClientRect().x - wrapperStartPoint;\n\n      if (currentSlideStart < endPoint) {\n        startPoints.push(currentSlideStart);\n      }\n    });\n    startPoints.push(endPoint);\n    return startPoints;\n  }\n\n  function initControls() {\n    if (Boolean(controls.length)) {\n      controls.forEach(function (control) {\n        control.addEventListener(\"click\", function (evt) {\n          evt.preventDefault();\n\n          switch (control.dataset.direction) {\n            case \"prev\":\n              prevSlide();\n              break;\n\n            case \"next\":\n              nextSlide();\n              break;\n          }\n        });\n      });\n    }\n  }\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/initSlider.js?");

/***/ }),

/***/ "./source/js/utils/initSomething.js":
/*!******************************************!*\
  !*** ./source/js/utils/initSomething.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initSomething\": () => (/* binding */ initSomething)\n/* harmony export */ });\nfunction initSomething(selector, callback) {\n  var array = document.querySelectorAll(selector);\n\n  if (array.length) {\n    array.forEach(function (item) {\n      callback(item);\n    });\n  }\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/initSomething.js?");

/***/ }),

/***/ "./source/js/utils/initTabList.js":
/*!****************************************!*\
  !*** ./source/js/utils/initTabList.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initTabList\": () => (/* binding */ initTabList)\n/* harmony export */ });\nfunction initTabList(tablist) {\n  var tabs = tablist.querySelectorAll(\".tablist__tab\");\n  var current = 0;\n  tabs.forEach(function (tab, index) {\n    tab.addEventListener(\"click\", function (evt) {\n      evt.preventDefault();\n      var prevElement = document.querySelector(tabs[current].getAttribute(\"href\"));\n      tabs[current].removeAttribute(\"aria-selected\");\n      tabs[current].classList.remove(\"tablist__tab--active\");\n      prevElement.hidden = true;\n      var nextElement = document.querySelector(tab.getAttribute(\"href\"));\n      nextElement.hidden = false;\n      tab.classList.add(\"tablist__tab--active\");\n      tab.setAttribute(\"aria-selected\", \"true\");\n      current = index;\n    });\n  });\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/initTabList.js?");

/***/ }),

/***/ "./source/js/utils/initVideoOnHover.js":
/*!*********************************************!*\
  !*** ./source/js/utils/initVideoOnHover.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction initVideoOnHover(videoContainer) {\n  var video = videoContainer.querySelector(\"video\");\n  videoContainer.addEventListener(\"mouseover\", function () {\n    video.play();\n    video.style.opacity = 1;\n  });\n  videoContainer.addEventListener(\"mouseout\", function () {\n    video.load();\n    video.style.opacity = 0;\n  });\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initVideoOnHover);\n/*  */\n\n//# sourceURL=webpack://sdtv/./source/js/utils/initVideoOnHover.js?");

/***/ }),

/***/ "./source/js/utils/navInit.js":
/*!************************************!*\
  !*** ./source/js/utils/navInit.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"navInit\": () => (/* binding */ navInit)\n/* harmony export */ });\nvar menuButton = document.querySelector(\".page-header__toggler\");\nvar menuList = document.querySelector(\".main-nav\");\nvar links = menuList.querySelectorAll(\".main-nav__link\");\nfunction navInit() {\n  menuButton.addEventListener(\"click\", changeNavState);\n  links.forEach(function (link) {\n    link.addEventListener(\"click\", function () {\n      if (window.innerWidth < 950) {\n        changeNavState();\n      } // const target = link.getAttribute(\"href\");\n      // if (target[0] === \"#\") {\n      //     const element = document.querySelector(target);\n      //     element.scrollIntoView();\n      // }\n\n    });\n  });\n}\n\nfunction changeNavState() {\n  var expanded = menuButton.getAttribute(\"aria-expanded\") === \"true\";\n  menuButton.setAttribute(\"aria-expanded\", !expanded);\n  menuButton.classList.toggle(\"page-header__toggler--opened\");\n  menuList.classList.toggle(\"main-nav--hide\");\n  document.body.classList.toggle(\"scroll-lock\");\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/navInit.js?");

/***/ }),

/***/ "./source/js/utils/removeHashfromURL.js":
/*!**********************************************!*\
  !*** ./source/js/utils/removeHashfromURL.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"removeHashFromUrl\": () => (/* binding */ removeHashFromUrl)\n/* harmony export */ });\nfunction removeHashFromUrl() {\n  var uri = window.location.toString();\n\n  if (uri.indexOf(\"#\") > 0) {\n    var clean_uri = uri.substring(0, uri.indexOf(\"#\"));\n    window.history.replaceState({}, document.title, clean_uri);\n  }\n}\n\n//# sourceURL=webpack://sdtv/./source/js/utils/removeHashfromURL.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./source/js/legacy.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./source/js/main.js");
/******/ 	
/******/ })()
;