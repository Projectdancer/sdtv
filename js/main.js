(()=>{var e={711:function(e){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="dist/",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=(o(n(1)),n(6)),a=o(r),c=o(n(7)),u=o(n(8)),s=o(n(9)),d=o(n(10)),l=o(n(11)),f=o(n(14)),m=[],p=!1,v={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},b=function(){if(arguments.length>0&&void 0!==arguments[0]&&arguments[0]&&(p=!0),p)return m=(0,l.default)(m,v),(0,d.default)(m,v.once),m},y=function(){m=(0,f.default)(),b()};e.exports={init:function(e){v=i(v,e),m=(0,f.default)();var t=document.all&&!window.atob;return function(e){return!0===e||"mobile"===e&&s.default.mobile()||"phone"===e&&s.default.phone()||"tablet"===e&&s.default.tablet()||"function"==typeof e&&!0===e()}(v.disable)||t?void m.forEach((function(e,t){e.node.removeAttribute("data-aos"),e.node.removeAttribute("data-aos-easing"),e.node.removeAttribute("data-aos-duration"),e.node.removeAttribute("data-aos-delay")})):(v.disableMutationObserver||u.default.isSupported()||(console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '),v.disableMutationObserver=!0),document.querySelector("body").setAttribute("data-aos-easing",v.easing),document.querySelector("body").setAttribute("data-aos-duration",v.duration),document.querySelector("body").setAttribute("data-aos-delay",v.delay),"DOMContentLoaded"===v.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?b(!0):"load"===v.startEvent?window.addEventListener(v.startEvent,(function(){b(!0)})):document.addEventListener(v.startEvent,(function(){b(!0)})),window.addEventListener("resize",(0,c.default)(b,v.debounceDelay,!0)),window.addEventListener("orientationchange",(0,c.default)(b,v.debounceDelay,!0)),window.addEventListener("scroll",(0,a.default)((function(){(0,d.default)(m,v.once)}),v.throttleDelay)),v.disableMutationObserver||u.default.ready("[data-aos]",y),m)},refresh:b,refreshHard:y}},function(e,t){},,,,,function(e,t){(function(t){"use strict";function n(e,t,n){function i(t){var n=f,o=m;return f=m=void 0,h=t,v=e.apply(o,n)}function a(e){return h=e,b=setTimeout(s,t),x?i(e):v}function u(e){var n=e-y;return void 0===y||n>=t||n<0||_&&e-h>=p}function s(){var e=k();return u(e)?d(e):void(b=setTimeout(s,function(e){var n=t-(e-y);return _?w(n,p-(e-h)):n}(e)))}function d(e){return b=void 0,E&&f?i(e):(f=m=void 0,v)}function l(){var e=k(),n=u(e);if(f=arguments,m=this,y=e,n){if(void 0===b)return a(y);if(_)return b=setTimeout(s,t),i(y)}return void 0===b&&(b=setTimeout(s,t)),v}var f,m,p,v,b,y,h=0,x=!1,_=!1,E=!0;if("function"!=typeof e)throw new TypeError(c);return t=r(t)||0,o(n)&&(x=!!n.leading,p=(_="maxWait"in n)?g(r(n.maxWait)||0,t):p,E="trailing"in n?!!n.trailing:E),l.cancel=function(){void 0!==b&&clearTimeout(b),h=0,f=y=m=b=void 0},l.flush=function(){return void 0===b?v:d(k())},l}function o(e){var t=void 0===e?"undefined":a(e);return!!e&&("object"==t||"function"==t)}function i(e){return"symbol"==(void 0===e?"undefined":a(e))||function(e){return!!e&&"object"==(void 0===e?"undefined":a(e))}(e)&&h.call(e)==s}function r(e){if("number"==typeof e)return e;if(i(e))return u;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(d,"");var n=f.test(e);return n||m.test(e)?p(e.slice(2),n?2:8):l.test(e)?u:+e}var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c="Expected a function",u=NaN,s="[object Symbol]",d=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,f=/^0b[01]+$/i,m=/^0o[0-7]+$/i,p=parseInt,v="object"==(void 0===t?"undefined":a(t))&&t&&t.Object===Object&&t,b="object"==("undefined"==typeof self?"undefined":a(self))&&self&&self.Object===Object&&self,y=v||b||Function("return this")(),h=Object.prototype.toString,g=Math.max,w=Math.min,k=function(){return y.Date.now()};e.exports=function(e,t,i){var r=!0,a=!0;if("function"!=typeof e)throw new TypeError(c);return o(i)&&(r="leading"in i?!!i.leading:r,a="trailing"in i?!!i.trailing:a),n(e,t,{leading:r,maxWait:t,trailing:a})}}).call(t,function(){return this}())},function(e,t){(function(t){"use strict";function n(e){var t=void 0===e?"undefined":r(e);return!!e&&("object"==t||"function"==t)}function o(e){return"symbol"==(void 0===e?"undefined":r(e))||function(e){return!!e&&"object"==(void 0===e?"undefined":r(e))}(e)&&y.call(e)==u}function i(e){if("number"==typeof e)return e;if(o(e))return c;if(n(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=n(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(s,"");var i=l.test(e);return i||f.test(e)?m(e.slice(2),i?2:8):d.test(e)?c:+e}var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a="Expected a function",c=NaN,u="[object Symbol]",s=/^\s+|\s+$/g,d=/^[-+]0x[0-9a-f]+$/i,l=/^0b[01]+$/i,f=/^0o[0-7]+$/i,m=parseInt,p="object"==(void 0===t?"undefined":r(t))&&t&&t.Object===Object&&t,v="object"==("undefined"==typeof self?"undefined":r(self))&&self&&self.Object===Object&&self,b=p||v||Function("return this")(),y=Object.prototype.toString,h=Math.max,g=Math.min,w=function(){return b.Date.now()};e.exports=function(e,t,o){function r(t){var n=f,o=m;return f=m=void 0,k=t,v=e.apply(o,n)}function c(e){return k=e,b=setTimeout(s,t),x?r(e):v}function u(e){var n=e-y;return void 0===y||n>=t||n<0||_&&e-k>=p}function s(){var e=w();return u(e)?d(e):void(b=setTimeout(s,function(e){var n=t-(e-y);return _?g(n,p-(e-k)):n}(e)))}function d(e){return b=void 0,E&&f?r(e):(f=m=void 0,v)}function l(){var e=w(),n=u(e);if(f=arguments,m=this,y=e,n){if(void 0===b)return c(y);if(_)return b=setTimeout(s,t),r(y)}return void 0===b&&(b=setTimeout(s,t)),v}var f,m,p,v,b,y,k=0,x=!1,_=!1,E=!0;if("function"!=typeof e)throw new TypeError(a);return t=i(t)||0,n(o)&&(x=!!o.leading,p=(_="maxWait"in o)?h(i(o.maxWait)||0,t):p,E="trailing"in o?!!o.trailing:E),l.cancel=function(){void 0!==b&&clearTimeout(b),k=0,f=y=m=b=void 0},l.flush=function(){return void 0===b?v:d(w())},l}}).call(t,function(){return this}())},function(e,t){"use strict";function n(e){var t=void 0,o=void 0;for(t=0;t<e.length;t+=1){if((o=e[t]).dataset&&o.dataset.aos)return!0;if(o.children&&n(o.children))return!0}return!1}function o(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function i(e){e&&e.forEach((function(e){var t=Array.prototype.slice.call(e.addedNodes),o=Array.prototype.slice.call(e.removedNodes);if(n(t.concat(o)))return r()}))}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){};t.default={isSupported:function(){return!!o()},ready:function(e,t){var n=window.document,a=new(o())(i);r=t,a.observe(n.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}}},function(e,t){"use strict";function n(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,r=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,a=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,c=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return o(e,[{key:"phone",value:function(){var e=n();return!(!i.test(e)&&!r.test(e.substr(0,4)))}},{key:"mobile",value:function(){var e=n();return!(!a.test(e)&&!c.test(e.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}();t.default=new u},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e,t){var n=window.pageYOffset,o=window.innerHeight;e.forEach((function(e,i){!function(e,t,n){var o=e.node.getAttribute("data-aos-once");t>e.position?e.node.classList.add("aos-animate"):void 0!==o&&("false"===o||!n&&"true"!==o)&&e.node.classList.remove("aos-animate")}(e,o+n,t)}))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){return e&&e.__esModule?e:{default:e}}(n(12));t.default=function(e,t){return e.forEach((function(e,n){e.node.classList.add("aos-init"),e.position=(0,o.default)(e.node,t.offset)})),e}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){return e&&e.__esModule?e:{default:e}}(n(13));t.default=function(e,t){var n=0,i=0,r=window.innerHeight,a={offset:e.getAttribute("data-aos-offset"),anchor:e.getAttribute("data-aos-anchor"),anchorPlacement:e.getAttribute("data-aos-anchor-placement")};switch(a.offset&&!isNaN(a.offset)&&(i=parseInt(a.offset)),a.anchor&&document.querySelectorAll(a.anchor)&&(e=document.querySelectorAll(a.anchor)[0]),n=(0,o.default)(e).top,a.anchorPlacement){case"top-bottom":break;case"center-bottom":n+=e.offsetHeight/2;break;case"bottom-bottom":n+=e.offsetHeight;break;case"top-center":n+=r/2;break;case"bottom-center":n+=r/2+e.offsetHeight;break;case"center-center":n+=r/2+e.offsetHeight/2;break;case"top-top":n+=r;break;case"bottom-top":n+=e.offsetHeight+r;break;case"center-top":n+=e.offsetHeight/2+r}return a.anchorPlacement||a.offset||isNaN(t)||(i=t),n+i}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-("BODY"!=e.tagName?e.scrollLeft:0),n+=e.offsetTop-("BODY"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:n,left:t}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e){return e=e||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(e,(function(e){return{node:e}}))}}])}},t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,n),i.exports}(()=>{"use strict";function e(e,t){var n=document.querySelectorAll(e);n.length&&n.forEach((function(e){t(e)}))}var t=document.querySelector(".page-header__toggler"),o=document.querySelector(".main-nav"),i=o.querySelectorAll(".main-nav__link");function r(){var e="true"===t.getAttribute("aria-expanded");t.setAttribute("aria-expanded",!e),t.classList.toggle("page-header__toggler--opened"),o.classList.toggle("main-nav--hide"),document.body.classList.toggle("scroll-lock")}function a(e){var t=document.querySelector(".overlay");e.hidden=!1,t.hidden=!1;var n=e.querySelector("input");function o(n){n.preventDefault(),e.hidden=!0,t.hidden=!0,function(){var e=window.location.toString();if(e.indexOf("#")>0){var t=e.substring(0,e.indexOf("#"));window.history.replaceState({},document.title,t)}}()}n&&n.focus(),e.querySelector(".modal__close").addEventListener("click",(function(e){o(e)})),document.addEventListener("keydown",(function(t){"Escape"!==t.key&&"Esc"!==t.key||!1===e.hidden&&o(t)})),t.addEventListener("click",o)}n(711).init(),t.addEventListener("click",r),i.forEach((function(e){e.addEventListener("click",(function(){window.innerWidth<950&&r()}))})),e(".slider",(function(e){var t=e.querySelector(".slider__wrapper"),n=e.querySelectorAll(".slider__slide"),o=!0,i=0,r=function(){var e=[],o=t.getBoundingClientRect().x,i=t.scrollWidth-t.offsetWidth;return n.forEach((function(t){var n=t.getBoundingClientRect().x-o;n<i&&e.push(n)})),e.push(i),e}(),a=e.querySelectorAll(".slider__tab"),c=Boolean(a.length),u=e.querySelectorAll(".slider__button");function s(e){t.scrollLeft=r[e],d(e)}function d(e){c&&!o&&(a[i].removeAttribute("aria-selected"),a[i].classList.remove("slider__tab--active"),a[i].blur()),i=e,c&&(a[i].classList.add("slider__tab--active"),a[i].setAttribute("aria-selected","true"),o?o=!1:a[i].focus())}Boolean(u.length)&&u.forEach((function(e){e.addEventListener("click",(function(t){switch(t.preventDefault(),e.dataset.direction){case"prev":s(0===i?r.length-1:i-1);break;case"next":i===r.length-1?s(0):s(i+1)}}))})),d(i),c&&a.forEach((function(e,t){e.addEventListener("click",(function(e){e.preventDefault(),s(t)}))})),t.addEventListener("scroll",(function(){if(r.includes(t.scrollLeft)){var e=r.indexOf(t.scrollLeft);e!==i&&d(e)}}))})),e(".tablist",(function(e){var t=e.querySelectorAll(".tablist__tab"),n=0;t.forEach((function(e,o){e.addEventListener("click",(function(i){i.preventDefault();var r=document.querySelector(t[n].getAttribute("href"));t[n].removeAttribute("aria-selected"),t[n].classList.remove("tablist__tab--active"),r.hidden=!0,document.querySelector(e.getAttribute("href")).hidden=!1,e.classList.add("tablist__tab--active"),e.setAttribute("aria-selected","true"),n=o}))}))})),e("[data-animation]",(function(e){var t,n=e.dataset.animation,o=e.clientHeight;switch(n){case"increase-number":t=e.innerText}document.addEventListener("scroll",(function i(){if(r=window.innerHeight,(a=window.scrollY||window.pageYOffset)+r>e.getBoundingClientRect().top+a+o/2)switch(n){case"increase-number":!function(e,t,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5e3,i=null,r=function r(a){i||(i=a);var c=Math.min((a-i)/o,1);e.innerHTML=Math.floor(c*(n-t)+t),c<1&&window.requestAnimationFrame(r)};window.requestAnimationFrame(r)}(e,0,t,t/90*4e3),document.removeEventListener("scroll",i)}var r,a}))})),e(".modal-link",(function(e){var t=document.querySelector(e.getAttribute("href"));t&&(t.classList.remove("modal--no-js"),window.location.hash==="#".concat(t.id)&&a(t),e.addEventListener("click",(function(e){e.preventDefault(),a(t)})))})),e(".classes-item[href]",(function(e){e.addEventListener("click",(function(){document.querySelector(".payment__side .classes-item").innerHTML=e.innerHTML}))})),e(".figure--video",(function(e){var t=e.querySelector("video");function n(e){e.preventDefault(),t.play(),t.style.opacity=1,t.addEventListener("ended",o)}function o(){t.load(),t.style.opacity=0}e.querySelector(".figure__caption"),e.addEventListener("mouseover",n),e.addEventListener("touch",n)})),document.addEventListener("scroll",(function(){var e=window.scrollY/10,t=document.querySelector("#classes-row-first"),n=document.querySelector("#classes-row-second");t.style.left="".concat(e-700,"px"),n.style.left="".concat(-e-700,"px")}))})()})();