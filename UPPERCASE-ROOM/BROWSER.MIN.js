global.CONNECT_TO_ROOM_SERVER=METHOD(function(o){"use strict";var e,t,d,a,r,m,i="__",n={},v={},u={},c={},E={},N={},h={};return o.checkIsConnected=e=function(o){return void 0===o&&(o=i),void 0===c[o]&&(c[o]=!1),c[o]},o.enterRoom=t=function(o){var e,t=o.roomServerName,d=o.roomName;void 0===t&&(t=i),e=n[t],void 0===e&&(e=n[t]=[]),e.push(d),void 0!==h[t]&&h[t]({methodName:"__ENTER_ROOM",data:d})},o.on=d=function(o,e){var t,d=o.roomServerName,a=o.methodName;void 0===d&&(d=i),t=v[d],void 0===t&&(t=v[d]=[]),t.push({methodName:a,method:e}),void 0!==E[d]&&E[d](a,e)},o.off=a=function(o,e){var t,d=o.roomServerName,a=o.methodName;void 0===d&&(d=i),t=v[d],void 0!==N[d]&&N[d](a,e),void 0!==t&&(void 0!==e?REMOVE(t,function(o){return o.methodName===a&&o.method===e}):REMOVE(t,function(o){return o.methodName===a}),0===t.length&&delete v[d])},o.send=r=function(o,e){var t,d=o.roomServerName,a=o.methodName,r=o.data;void 0===d&&(d=i),void 0===h[d]?(t=u[d],void 0===t&&(t=u[d]=[]),t.push({params:{methodName:a,data:r},callback:e})):h[d]({methodName:a,data:r},e)},o.exitRoom=m=function(o){var e,t=o.roomServerName,d=o.roomName;void 0===t&&(t=i),e=n[t],void 0===e&&(e=n[t]=[]),void 0!==h[t]&&h[t]({methodName:"__EXIT_ROOM",data:d}),EACH(e,function(o,t){return o===d?(REMOVE({array:e,key:t}),!1):void 0})},{run:function(o,e){var t,d,a=o.name;void 0===a&&(a=i),void 0!==e&&(CHECK_IS_DATA(e)!==!0?t=e:(t=e.success,d=e.error)),CONNECT_TO_WEB_SOCKET_SERVER({host:o.host,port:o.port,fixRequestURI:o.fixRequestURI},{error:d,success:function(o,e,d){var r=n[a],m=v[a],i=u[a];E[a]=o,N[a]=e,h[a]=d,void 0!==r&&EACH(r,function(o){d({methodName:"__ENTER_ROOM",data:o})}),void 0!==m&&EACH(m,function(e){o(e.methodName,e.method)}),void 0!==i&&EACH(i,function(o){d(o.params,o.callback)}),delete u[a],void 0!==t&&t(o,e,d),c[a]=!0,o("__DISCONNECTED",function(){delete E[a],delete N[a],delete h[a],c[a]=!1})}})}}});