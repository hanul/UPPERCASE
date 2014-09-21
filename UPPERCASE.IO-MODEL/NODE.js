FOR_BOX(function(o){"use strict";OVERRIDE(o.MODEL,function(){o.MODEL=CLASS({init:function(e,t,i){var r,n,s,a,c,d,u,v,E,f,C,l,O,A,N,R,S,I,D,m,g,_,h,L,H,M,T,x,P,p,K,U,b,k,B,y,V,W,X,F=i.name,Y=i.initData,G=i.methodConfig,j=i.isNotUsingObjectId,$=[],q=[],w=[],z=[],J=[],Q=[],Z=[],oe=[],ee=[],te=[],ie=o.DB({name:F,isNotUsingObjectId:j});void 0!==G&&(r=G.create,n=G.get,s=G.update,a=G.remove,c=G.find,d=G.count,u=G.checkIsExists,void 0!==r&&(v=r.valid,f=r.role,S=r.authKey),void 0!==n&&(C=n.role),void 0!==s&&(E=s.valid,l=s.role,I=s.authKey),void 0!==a&&(O=a.role,D=a.authKey),void 0!==c&&(A=c.role),void 0!==d&&(N=d.role),void 0!==u&&(R=u.role)),void 0!==CPU_CLUSTERING.getWorkerId()&&1!==CPU_CLUSTERING.getWorkerId()||void 0===Y||RUN(function(){var o=[];EACH(Y,function(e,t){var i={};i[t]=TO_DELETE,o.push(i)}),ie.find({filter:{$or:o},isFindAll:!0},EACH(function(o){console.log(o),EACH(Y,function(e,t){void 0===o[t]&&(o[t]=e)}),ie.update(o)}))}),t.getName=m=function(){return F},e.getInitData=g=function(){return Y},e.getCreateValid=_=function(){return v},e.getUpdateValid=h=function(){return E},t.getDB=L=function(){return ie},e.on=H=function(o,e){"create"===o?(void 0!==e.before&&$.push(e.before),void 0!==e.after&&q.push(e.after)):"get"===o?w.push(e):"update"===o?(void 0!==e.before&&z.push(e.before),void 0!==e.after&&J.push(e.after)):"remove"===o?(void 0!==e.before&&Q.push(e.before),void 0!==e.after&&Z.push(e.after)):"find"===o?oe.push(e):"count"===o?ee.push(e):"checkIsExists"===o&&te.push(e)},M=function(e,t,i){var r,n;void 0!==Y&&EACH(Y,function(o,t){e[t]=o}),void 0!==v&&(r=v.check(e)),void 0!==r&&r.checkHasError()===!0?t({validErrors:r.getErrors()}):NEXT([function(o){EACH($,function(r){var s=r(e,t,o,i);n!==!0&&s===!1&&(n=!0)}),n!==!0&&o()},function(){return function(){ie.create(e,{error:function(o){t({errorMsg:o})},success:function(e){EACH(q,function(o){o(e,i)}),o.BROADCAST({roomName:F+"/create",methodName:"create",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:F+"/"+i+"/"+t+"/create",methodName:"create",data:e})}),t({savedData:e})}})}}])},T=function(o,e,t){var i,r,n,s,a;CHECK_IS_DATA(o)!==!0?i=o:(i=o.id,r=o.filter,n=o.sort,s=o.isRandom),ie.get({id:i,filter:r,sort:n,isRandom:s},{error:function(o){e({errorMsg:o})},notExists:function(){e()},success:function(o){EACH(w,function(i){var r=i(o,e,t);a!==!0&&r===!1&&(a=!0)}),a!==!0&&e({savedData:o})}})},x=function(e,t,i){var r,n,s=e.id;void 0!==E&&(r=E.checkExceptUndefined(e)),e.id=s,void 0!==r&&r.checkHasError()===!0?t({validErrors:r.getErrors()}):NEXT([function(o){EACH(z,function(r){var s=r(e,t,o,i);n!==!0&&s===!1&&(n=!0)}),n!==!0&&o()},function(){return function(){ie.update(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(e){void 0!==e&&(EACH(J,function(o){o(e,i)}),o.BROADCAST({roomName:F+"/"+e.id,methodName:"update",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:F+"/"+i+"/"+t+"/update",methodName:"update",data:e})})),t({savedData:e})}})}}])},P=function(e,t,i){var r;NEXT([function(o){EACH(Q,function(n){var s=n(e,t,o,i);r!==!0&&s===!1&&(r=!0)}),r!==!0&&o()},function(){return function(){ie.remove(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(e){void 0!==e&&(EACH(Z,function(o){o(e,i)}),o.BROADCAST({roomName:F+"/"+e.id,methodName:"remove",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:F+"/"+i+"/"+t+"/remove",methodName:"remove",data:e})})),t({savedData:e})}})}}])},p=function(o,e,t){var i,r,n,s,a,c;void 0!==o&&(i=o.filter,r=o.sort,n=INTEGER(o.start),s=INTEGER(o.count),a=o.isFindAll),ie.find({filter:i,sort:r,start:n,count:s,isFindAll:a},{error:function(o){e({errorMsg:o})},success:function(o){EACH(oe,function(i){var r=i(o,e,t);c!==!0&&r===!1&&(c=!0)}),c!==!0&&e({savedDataSet:o})}})},K=function(o,e,t){var i,r;void 0!==o&&(i=o.filter),ie.count({filter:i},{error:function(o){e({errorMsg:o})},success:function(o){EACH(ee,function(i){var n=i(o,e,t);r!==!0&&n===!1&&(r=!0)}),r!==!0&&e({count:o})}})},U=function(o,e,t){var i,r;void 0!==o&&(i=o.filter),ie.checkIsExists({filter:i},{error:function(o){e({errorMsg:o})},success:function(o){EACH(te,function(){var i=te(o,e,t);r!==!0&&i===!1&&(r=!0)}),r!==!0&&e({isExists:o})}})},t.create=b=function(e,t){var i,r,n;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notValid,n=t.error)),M(e,function(e){var t,s,a;void 0!==e?(t=e.errorMsg,s=e.validErrors,a=e.savedData,void 0!==t?void 0!==n?n(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/create` ERROR: "+t)):void 0!==s?void 0!==r?r(s):console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/create` NOT VALID."),s):void 0!==i&&i(a)):void 0!==i&&i()})},t.get=k=function(e,t){var i,r,n;CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.error),T(e,function(t){var s,a;void 0!==t&&(s=t.errorMsg,a=t.savedData),void 0!==s?void 0!==n?n(s):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/get` ERROR: "+s)):void 0===a?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/get` NOT EXISTS."),e):i(a)})},t.update=B=function(e,t){var i,r,n,s;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.notValid,s=t.error)),x(e,function(t){var a,c,d;void 0!==t&&(a=t.errorMsg,c=t.validErrors,d=t.savedData),void 0!==a?void 0!==s?s(a):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/update` ERROR: "+a)):void 0!==c?void 0!==n?n(c):console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/update` NOT VALID."),c):void 0===d?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/update` NOT EXISTS."),e):void 0!==i&&i(d)})},j!==!0&&(t.remove=y=function(e,t){var i,r,n;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.error)),P(e,function(t){var s,a;void 0!==t&&(s=t.errorMsg,a=t.savedData),void 0!==s?void 0!==n?n(s):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/remove` ERROR: "+s)):void 0===a?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/remove` NOT EXISTS."),e):void 0!==i&&i(a)})}),t.find=V=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),p(e,function(e){var t=e.errorMsg,n=e.savedDataSet;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/find` ERROR: "+t)):i(n)})},t.count=W=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),K(e,function(e){var t=e.errorMsg,n=e.count;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/count` ERROR: "+t)):i(n)})},t.checkIsExists=X=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),U(e,function(e){var t=e.errorMsg,n=e.isExists;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+F+"/checkIsExists` ERROR: "+t)):i(n)})},o.ROOM(F,function(o,e){r!==!1&&e("create",function(e,t){void 0===f||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:f})===!0?(void 0!==S&&(e[S]=o.authKey),M(e,t,o)):t({isNotAuthed:!0})}),n!==!1&&e("get",function(e,t){void 0===C||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:C})===!0?T(e,t,o):t({isNotAuthed:!0})}),s!==!1&&e("update",function(e,t){void 0===l||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:l})===!0?void 0!==I?ie.get(e.id,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(i){i[I]===o.authKey?(e[I]=o.authKey,x(e,t,o)):t({isNotAuthed:!0})}}):x(e,t,o):t({isNotAuthed:!0})}),a!==!1&&j!==!0&&e("remove",function(e,t){void 0===O||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:O})===!0?void 0!==D?ie.get(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(i){i[D]===o.authKey?P(e,t,o):t({isNotAuthed:!0})}}):P(e,t,o):t({isNotAuthed:!0})}),c!==!1&&e("find",function(e,t){void 0===A||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:A})===!0?(void 0!==e&&delete e.isFindAll,p(e,t,o)):t({isNotAuthed:!0})}),d!==!1&&e("count",function(e,t){void 0===N||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:N})===!0?K(e,t,o):t({isNotAuthed:!0})}),u!==!1&&e("checkIsExists",function(e,t){void 0===R||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:R})===!0?U(e,t,o):t({isNotAuthed:!0})})})}})})});