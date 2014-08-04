global.CONNECT_TO_DB_SERVER=CONNECT_TO_DB_SERVER=METHOD(function(t){var o,n,r=[];return t.addInitDBFunc=n=function(t){void 0===o?r.push(t):t(o)},{run:function(t,n){"use strict";var i=t.username,e=t.password,a=void 0===t.host?"127.0.0.1":t.host,c=void 0===t.port?27017:t.port,d=t.name;require("mongodb").MongoClient.connect("mongodb://"+(void 0!==i&&void 0!==e?i+":"+e+"@":"")+a+":"+c+"/"+d,function(t,i){t!==TO_DELETE?console.log(CONSOLE_RED("[UPPERCASE.IO-DB] CONNECT TO DB SERVER FAILED: "+t.toString())):(o=i,EACH(r,function(t){t(o)}),r=void 0,void 0!==n&&n())})}}}),FOR_BOX(function(t){"use strict";var o=require("mongodb").ObjectID,n=function(t){return new o(t)},r=function(t){return void 0!==t._id&&(t.id=t._id.toString()),delete t._id,delete t.__IS_ENABLED,delete t.__RANDOM_KEY,t},i=function(t){EACH(t,function(o,n){o===TO_DELETE?REMOVE({data:t,key:n}):(CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0)&&i(o)})},e=function(t){var o=function(t){void 0!==t.id&&(CHECK_IS_DATA(t.id)===!0?(EACH(t.id,function(o,r){CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0?EACH(o,function(t,r){o[r]=n(t)}):t.id[r]=n(o)}),t._id=t.id):t._id=n(id),delete t.id),t.__IS_ENABLED=!0,EACH(t,function(o,n){void 0===o&&delete t[n]})};void 0!==t.$and?EACH(t.$and,function(t){o(t)}):void 0!==t.$or?EACH(t.$or,function(t){o(t)}):o(t)};t.DB=CLASS({init:function(o,a,c){var d,E,s,u,_,f,l,v=[],O=[],D=[],C=[],A=[],m=[],T=[];a.create=d=function(t,o){v.push({data:t,callbackOrHandlers:o})},a.get=E=function(t,o){O.push({idOrParams:t,callbackOrHandlers:o})},a.update=s=function(t,o){D.push({data:t,callbackOrHandlers:o})},a.remove=u=function(t,o){C.push({id:t,callbackOrHandlers:o})},a.find=_=function(t,o){A.push({params:t,callbackOrHandlers:o})},a.count=f=function(t,o){m.push({filter:t,callbackOrHandlers:o})},a.checkIsExists=l=function(t,o){T.push({filter:t,callbackOrHandlers:o})},CONNECT_TO_DB_SERVER.addInitDBFunc(function(o){var g,S=o.collection(t.boxName+"."+c),N=o.collection(t.boxName+"."+c+"__BACKUP"),h=o.collection(t.boxName+"."+c+"__ERROR"),H=function(o){var n=o.method,r=o.data,i=new Date,e={method:n,time:i,data:r};N.save(e,{w:0}),NODE_CONFIG.isDBLogMode===!0&&console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+c+"` DATA SAVED:",e)},I=function(o,n){o.time=new Date,h.save(o,{w:0}),void 0!==n?n(o.errorMsg):console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+c+"` ERROR:",o)};a.create=d=function(t,o){var n,e;try{t.__IS_ENABLED=!0,t.__RANDOM_KEY=Math.random(),t.createTime=new Date,i(t),void 0!==o&&(CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,e=o.error)),S.save(t,{safe:!0},function(o,i){o===TO_DELETE?(H({method:"create",data:i}),r(i),void 0!==n&&n(i)):I({method:"create",data:t,errorMsg:o.toString()},e)})}catch(a){I({method:"create",data:t,errorMsg:a.toString()},e)}},g=function(t,o){var n,i,a,c=t.filter,d=t.sort;try{e(c),CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,i=o.notExists,a=o.error),S.find(c).sort(d).limit(1).toArray(function(o,e){var c;o===TO_DELETE?e!==TO_DELETE&&e.length>0?(c=e[0],r(c),n(c)):void 0!==i&&i():I({method:"get",params:t,errorMsg:o.toString()},a)})}catch(E){I({method:"get",params:t,errorMsg:E.toString()},a)}},a.get=E=function(t,o){var r,i,e,a,c,d,E;void 0===o&&(o=t,t=void 0),CHECK_IS_DATA(o)!==!0?a=o:(a=o.success,c=o.notExists,d=o.error);try{CHECK_IS_DATA(t)===!0?(r=t.filter,i=t.sort,e=t.isRandom):r=void 0!==t?{_id:n(t)}:{},void 0===r&&(r={}),void 0===i&&(i={createTime:-1}),e===!0?(r.__RANDOM_KEY={$gte:E=Math.random()},i.__RANDOM_KEY=1,g({filter:r,sort:i},{error:d,notExists:function(){r.__RANDOM_KEY={$lte:E},g({filter:r,sort:i},o)},success:a})):g({filter:r,sort:i},o)}catch(s){I({method:"get",idOrParams:t,errorMsg:s.toString()},d)}},a.update=s=function(t,o){var e,a,c,d,E=t.id,s=t.$inc;try{e={_id:n(E),__IS_ENABLED:!0},void 0!==o&&(CHECK_IS_DATA(o)!==!0?a=o:(a=o.success,c=o.notExists,d=o.error)),NEXT([function(t){S.findOne(e,t)},function(o){return function(n,r){n===TO_DELETE?r===TO_DELETE?c():(EACH(t,function(t,o){"id"!==o&&"_id"!==o&&"__IS_ENABLED"!==o&&"createTime"!==o&&"$inc"!==o&&(r[o]=t)}),i(r),r.lastUpdateTime=new Date,void 0!==s?S.save(r,function(t){o(r,t)}):S.save(r,function(t){o.next(r,t)})):I({method:"update",data:t,errorMsg:n.toString()},d)}},function(t){return function(o){S.update(e,{$inc:s},function(n){EACH(s,function(t,n){o[n]+=t}),t(o,n)})}},function(){return function(o,n){n===TO_DELETE?(H({method:"update",data:o}),r(o),void 0!==a&&a(o)):I({method:"update",data:t,errorMsg:n.toString()},d)}}])}catch(u){I({method:"update",data:t,errorMsg:u.toString()},d)}},a.remove=u=function(t,o){var i,e,a,c;try{i={_id:n(t),__IS_ENABLED:!0},void 0!==o&&(CHECK_IS_DATA(o)!==!0?e=o:(e=o.success,a=o.notExists,c=o.error)),S.findOne(i,function(o,n){o===TO_DELETE?n===TO_DELETE?a():(n.__IS_ENABLED=!1,n.removeTime=new Date,S.save(n,function(o){o===TO_DELETE?(H({method:"remove",data:n}),r(n),void 0!==e&&e(n)):I({method:"remove",id:t,errorMsg:o.toString()},c)})):I({method:"remove",id:t,errorMsg:o.toString()},c)})}catch(d){I({method:"remove",id:t,errorMsg:d.toString()},c)}},a.find=_=function(t,o){var n,i,a,c,d,E,s,u;try{void 0===o&&(o=t,t=void 0),void 0!==t&&(n=t.filter,i=t.sort,a=INTEGER(t.start),c=INTEGER(t.count),d=t.isFindAll),CHECK_IS_DATA(o)!==!0?E=o:(E=o.success,s=o.error),void 0===n&&(n={}),void 0===i&&(i={createTime:-1}),void 0===a&&(a=0),d!==!0&&(void 0===c||c>NODE_CONFIG.maxDataCount||isNaN(c)===!0?c=NODE_CONFIG.maxDataCount:1>c&&(c=1)),e(n),u=function(o,n){o===TO_DELETE?(n!==TO_DELETE&&EACH(n,function(t){r(t)}),E(n)):I({method:"find",params:t,errorMsg:o.toString()},s)},d===!0?S.find(n).sort(i).skip(a).toArray(u):S.find(n).sort(i).skip(a).limit(c).toArray(u)}catch(_){I({method:"find",params:t,errorMsg:_.toString()},s)}},a.count=f=function(t,o){var n,r;try{void 0===o&&(o=t,t=void 0),void 0===t&&(t={}),CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,r=o.error),e(t),S.find(t).count(function(o,i){o===TO_DELETE?n(i):I({method:"count",filter:t,errorMsg:o.toString()},r)})}catch(i){I({method:"count",filter:t,errorMsg:i.toString()},r)}},a.checkIsExists=l=function(t,o){var r,i;try{void 0===o&&(o=t,t=void 0),void 0===t?t={}:CHECK_IS_DATA(t)!==!0&&(t={_id:n(t)}),CHECK_IS_DATA(o)!==!0?r=o:(r=o.success,i=o.error),e(t),S.find(t).count(function(o,n){o===TO_DELETE?r(void 0!==n&&n>0):I({method:"checkIsExists",filter:t,errorMsg:o.toString()},i)})}catch(a){I({method:"checkIsExists",filter:t,errorMsg:a.toString()},i)}},EACH(v,function(t){d(t.data,t.callbackOrHandlers)}),v=void 0,EACH(O,function(t){E(t.idOrParams,t.callbackOrHandlers)}),O=void 0,EACH(D,function(t){s(t.data,t.callbackOrHandlers)}),D=void 0,EACH(C,function(t){u(t.id,t.callbackOrHandlers)}),C=void 0,EACH(A,function(t){_(t.params,t.callbackOrHandlers)}),A=void 0,EACH(m,function(t){f(t.filter,t.callbackOrHandlers)}),m=void 0,EACH(T,function(t){l(t.filter,t.callbackOrHandlers)}),T=void 0})}})}),FOR_BOX(function(t){"use strict";t.LOG_DB=CLASS({init:function(o,n,r){var i,e=CONNECT_TO_DB_SERVER.getNativeDB(),a=e.collection(t.boxName+"."+r);n.log=i=function(t){t.time=new Date,a.save(t,function(){})}}})}),OVERRIDE(NODE_CONFIG,function(t){global.NODE_CONFIG=NODE_CONFIG=COMBINE([t,{isDBLogMode:!1,maxDataCount:1e3}])});