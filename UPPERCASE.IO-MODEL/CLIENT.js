FOR_BOX(function(o){"use strict";o.MODEL=CLASS({init:function(e,n,t){var i,d,r,v,a,c,E,s,u,O,A,f,l,R,m,N,C,g,D,M,I,h,x,P,S,T,U,H,L,b,_=t.name,p=t.initData,V=t.methodConfig,k=o.ROOM(_),K={},y={},X=[],w=[],W={};void 0!==V&&(i=V.create,d=V.get,r=V.update,v=V.remove,a=V.find,c=V.count,E=V.checkIsExists,void 0!==i&&(s=i.valid),void 0!==r&&(u=r.valid)),n.getName=f=function(){return _},e.getInitData=l=function(){return p},e.getCreateValid=R=function(){return s},e.getUpdateValid=m=function(){return u},n.getRoom=N=function(){return k},i!==!1&&(n.create=C=function(e,n){var t,i,d,r,v,a;void 0!==p&&EACH(p,function(o,n){void 0===e[n]&&(e[n]=o)}),void 0!==n&&(CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notValid,d=n.notAuthed,r=n.error,v=n.done)),void 0!==s&&(a=s.check(e)),void 0!==a&&a.checkHasError()===!0?void 0!==i?i(a.getErrors()):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".create` NOT VALID!: ",a.getErrors()):k.send({methodName:"create",data:e},function(e){var n,a,c,E;void 0!==e?(n=e.errorMsg,a=e.validErrors,c=e.isNotAuthed,E=e.savedData,void 0!==n?void 0!==r?r(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".create` ERROR: "+n):void 0!==a?void 0!==i?i(a):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".create` NOT VALID!: ",a):c===!0?void 0!==d?d():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".create` NOT AUTHED!"):void 0!==t&&t(E)):void 0!==t&&t(),void 0!==v&&v()})}),d!==!1&&(n.get=g=function(e,n){var t,i,d,r,v;CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notExists,d=n.notAuthed,r=n.error,v=n.done),k.send({methodName:"get",data:e},function(e){var n,a,c;void 0!==e&&(n=e.errorMsg,a=e.isNotAuthed,c=e.savedData),void 0!==n?void 0!==r?r(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".get` ERROR: "+n):a===!0?void 0!==d?d():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".get` NOT AUTHED!"):void 0===c?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".get` NOT EXISTS!"):void 0!==t&&t(c),void 0!==v&&v()})},n.getWatching=D=function(e,t){var i,d,r,v,a;CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,d=t.notExists,r=t.notAuthed,v=t.error,a=t.done),n.get(e,{success:function(e){var n,t;void 0!==i&&(X.push(n=o.ROOM(_+"/"+e.id)),i(e,function(o){n.on("update",o)},function(o){n.on("remove",function(e){o(e),t()})},t=function(){REMOVE({array:X,value:n}),n.exit()}))},notExists:d,notAuthed:r,error:v,done:a})}),r!==!1&&(n.update=M=function(e,n){var t,i,d,r,v,a,c,E=e.id;void 0!==n&&(CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notValid,d=n.notExists,r=n.notAuthed,v=n.error,a=n.done)),void 0!==u&&(c=u.checkExceptUndefined(e)),e.id=E,void 0!==u&&c.checkHasError()===!0?void 0!==i?i(c.getErrors()):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".update` NOT VALID!: ",c.getErrors()):k.send({methodName:"update",data:e},function(e){var n,c,E,s;void 0!==e&&(n=e.errorMsg,c=e.validErrors,E=e.isNotAuthed,s=e.savedData),void 0!==n?void 0!==v?v(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".update` ERROR: "+n):void 0!==c?void 0!==i?i(c):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".update` NOT VALID!: ",c):E===!0?void 0!==r?r():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".update` NOT AUTHED!"):void 0===s?void 0!==d?d():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".update` NOT EXISTS!"):void 0!==t&&t(s),void 0!==a&&a()})}),v!==!1&&(n.remove=I=function(e,n){var t,i,d,r,v;void 0!==n&&(CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notExists,d=n.notAuthed,r=n.error,v=n.done)),k.send({methodName:"remove",data:e},function(e){var n,a,c;void 0!==e&&(n=e.errorMsg,a=e.isNotAuthed,c=e.savedData),void 0!==n?void 0!==r?r(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".remove` ERROR: "+n):a===!0?void 0!==d?d():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".remove` NOT AUTHED!"):void 0===c?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".remove` NOT EXISTS!"):void 0!==t&&t(c),void 0!==v&&v()})}),a!==!1&&(n.find=h=function(e,n){var t,i,d,r;void 0===n&&(n=e,e=void 0),CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notAuthed,d=n.error,r=n.done),k.send({methodName:"find",data:e},function(e){var n=e.errorMsg,v=e.isNotAuthed,a=e.savedDataSet;void 0!==n?void 0!==d?d(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".find` ERROR: "+n):v===!0?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".find` NOT AUTHED!"):void 0!==t&&t(a),void 0!==r&&r()})},n.findWatching=x=function(e,t){var i,d,r,v;void 0===t&&(t=e,e=void 0),CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,d=t.notAuthed,r=t.error,v=t.done),n.find(e,{success:function(e){var n,t={};void 0!==i&&(EACH(e,function(e){var n=e.id;X.push(t[n]=o.ROOM(_+"/"+n))}),i(e,function(o,e){t[o].on("update",e)},function(o,e){t[o].on("remove",function(t){e(t),n(o)})},n=function(o){void 0!==t[o]&&(REMOVE({array:X,value:t[o]}),t[o].exit(),delete t[o])}))},notAuthed:d,error:r,done:v})}),c!==!1&&(n.count=P=function(e,n){var t,i,d,r;void 0===n&&(n=e,e=void 0),CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notAuthed,d=n.error,r=n.done),k.send({methodName:"count",data:e},function(e){var n=e.errorMsg,v=e.isNotAuthed,a=e.count;void 0!==n?void 0!==d?d(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".count` ERROR: "+n):v===!0?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".count` NOT AUTHED!"):void 0!==t&&t(a),void 0!==r&&r()})}),E!==!1&&(n.checkIsExists=S=function(e,n){var t,i,d,r;void 0===n&&(n=e,e=void 0),CHECK_IS_DATA(n)!==!0?t=n:(t=n.success,i=n.notAuthed,d=n.error,r=n.done),k.send({methodName:"checkIsExists",data:e},function(e){var n=e.errorMsg,v=e.isNotAuthed,a=e.isExists;void 0!==n?void 0!==d?d(n):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".checkIsExists` ERROR: "+n):v===!0?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+_+".checkIsExists` NOT AUTHED!"):void 0!==t&&t(a),void 0!==r&&r()})}),n.onNew=T=function(e,n){var t=function(o){o.id;n(o)};void 0===n?(n=e,void 0===O&&(O=o.ROOM(_+"/create")),O.on("create",t)):EACH(e,function(e,n){var i=K[n+"/"+e];void 0===i&&(i=K[n+"/"+e]=o.ROOM(_+"/"+n+"/"+e+"/create")),i.on("create",t)})},n.onNewWatching=U=function(e,n){var t=function(e,t){var i,d,r=e.id;X.push(i=o.ROOM(_+"/"+r)),t.push(i),n(e,function(o){i.on("update",o)},function(o){i.on("remove",function(e){o(e),d()})},d=function(){i.exit(),REMOVE({array:X,value:i})})};void 0===n?(n=e,void 0===O&&(O=o.ROOM(_+"/create")),O.on("create",function(o){t(o,w)})):EACH(e,function(e,n){var i=K[n+"/"+e],d=W[n+"/"+e];void 0===i&&(i=K[n+"/"+e]=o.ROOM(_+"/"+n+"/"+e+"/create")),void 0===d&&(d=W[n+"/"+e]=[]),i.on("create",function(o){t(o,d)})})},n.closeOnNew=H=function(o){void 0===o?(void 0!==O&&(O.exit(),O=void 0),EACH(w,function(o){o.exit(),REMOVE({array:X,value:o})}),w=[]):EACH(o,function(o,e){void 0!==K[e+"/"+o]&&(K[e+"/"+o].exit(),delete K[e+"/"+o]),EACH(W[e+"/"+o],function(o){o.exit(),REMOVE({array:X,value:o})}),delete W[e+"/"+o]})},n.onRemove=L=function(e,n){var t=function(o){o.id;n(o)};void 0===n?(n=e,void 0===A&&(A=o.ROOM(_+"/remove")),A.on("remove",t)):EACH(e,function(e,n){var i=y[n+"/"+e];void 0===i&&(i=y[n+"/"+e]=o.ROOM(_+"/"+n+"/"+e+"/remove")),i.on("remove",t)})},n.closeOnRemove=b=function(o){void 0===o?void 0!==A&&(A.exit(),A=void 0):EACH(o,function(o,e){void 0!==y[e+"/"+o]&&(y[e+"/"+o].exit(),delete y[e+"/"+o])})}}})});