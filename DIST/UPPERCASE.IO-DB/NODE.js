global.CONNECT_TO_DB_SERVER=CONNECT_TO_DB_SERVER=METHOD(function(t){var o,i,n=[];return t.addInitDBFunc=i=function(t){void 0===o?n.push(t):t(o)},{run:function(t,i){"use strict";var r=t.username,e=t.password,c=void 0===t.host?"127.0.0.1":t.host,a=void 0===t.port?27017:t.port,d=t.name;require("mongodb").MongoClient.connect("mongodb://"+(void 0!==r&&void 0!==e?r+":"+e+"@":"")+c+":"+a+"/"+d,function(t,r){t!==TO_DELETE?console.log(CONSOLE_RED("[UPPERCASE.IO-DB] CONNECT TO DB SERVER FAILED: "+t.toString())):(o=r,EACH(n,function(t){t(o)}),n=void 0,void 0!==i&&i())})}}}),FOR_BOX(function(t){"use strict";var o=require("mongodb").ObjectID,i=function(t){return new o(t)},n=function(t){return void 0!==t._id&&(t.id=t._id.toString()),delete t._id,delete t.__IS_ENABLED,delete t.__RANDOM_KEY,t},r=function(t){EACH(t,function(o,i){o===TO_DELETE?REMOVE({data:t,key:i}):(CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0)&&r(o)})},e=function(t){var o=function(t){void 0!==t.id&&(CHECK_IS_DATA(t.id)===!0?(EACH(t.id,function(o,n){CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0?EACH(o,function(t,n){o[n]=i(t)}):t.id[n]=i(o)}),t._id=t.id):t._id=i(id),delete t.id),t.__IS_ENABLED=!0,EACH(t,function(o,i){void 0===o&&delete t[i]})};void 0!==t.$and?EACH(t.$and,function(t){o(t)}):void 0!==t.$or?EACH(t.$or,function(t){o(t)}):o(t)};t.DB=CLASS({init:function(o,c,a){var d,E,u,s,_,f,v,l=[],D=[],A=[],C=[],O=[],m=[],T=[];c.create=d=function(t,o){l.push({data:t,callbackOrHandlers:o})},c.get=E=function(t,o){D.push({idOrParams:t,callbackOrHandlers:o})},c.update=u=function(t,o){A.push({data:t,callbackOrHandlers:o})},c.remove=s=function(t,o){C.push({id:t,callbackOrHandlers:o})},c.find=_=function(t,o){O.push({params:t,callbackOrHandlers:o})},c.count=f=function(t,o){m.push({filter:t,callbackOrHandlers:o})},c.checkIsExists=v=function(t,o){T.push({filter:t,callbackOrHandlers:o})},CONNECT_TO_DB_SERVER.addInitDBFunc(function(o){var g,S=o.collection(t.boxName+"."+a),N=o.collection(t.boxName+"."+a+"__BACKUP"),h=o.collection(t.boxName+"."+a+"__ERROR"),I=function(o){var i=o.method,n=o.data,r=new Date,e={method:i,time:r,data:n};N.save(e,function(){}),NODE_CONFIG.isDBLogMode===!0&&console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+"` DATA SAVED:",e)},H=function(o){o.time=new Date,h.save(o,function(){}),console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+"` ERROR:",o)};c.create=d=function(t,o){var i,e,c;try{t.__IS_ENABLED=!0,t.__RANDOM_KEY=Math.random(),t.createTime=new Date,r(t),void 0!==o&&(CHECK_IS_DATA(o)!==!0?i=o:(i=o.success,e=o.error)),S.save(t,function(o,r){o===TO_DELETE?(I({method:"create",data:r}),n(r),void 0!==i&&i(r)):(c=o.toString(),H({method:"create",data:t,errorMsg:c}),void 0!==e&&e(c))})}catch(a){c=a.toString(),H({method:"create",data:t,errorMsg:c}),void 0!==e&&e(c)}},g=function(t,o){var i,r,c,a=t.filter,d=t.sort;try{e(a),CHECK_IS_DATA(o)!==!0?i=o:(i=o.success,r=o.error),S.find(a).sort(d).limit(1).toArray(function(o,e){var a;o===TO_DELETE?(e!==TO_DELETE&&e.length>0&&(a=e[0],n(a)),i(a)):(c=o.toString(),H({method:"get",params:t,errorMsg:c}),r(c))})}catch(E){c=E.toString(),H({method:"get",params:t,errorMsg:c}),r(c)}},c.get=E=function(t,o){var n,r,e,c,a,d,E;void 0===o&&(o=t,t=void 0),CHECK_IS_DATA(o)!==!0?c=o:(c=o.success,a=o.error);try{CHECK_IS_DATA(t)===!0?(n=t.filter,r=t.sort,e=t.isRandom):n=void 0!==t?{_id:i(t)}:{},void 0===n&&(n={}),void 0===r&&(r={createTime:-1}),e===!0?(n.__RANDOM_KEY={$gte:d=Math.random()},r.__RANDOM_KEY=1,g({filter:n,sort:r},{error:a,success:function(t){void 0===t?(n.__RANDOM_KEY={$lte:d},g({filter:n,sort:r},o)):c(t)}})):g({filter:n,sort:r},o)}catch(u){E=u.toString(),H({method:"get",idOrParams:t,errorMsg:E}),a(E)}},c.update=u=function(t,o){var e,c,a,d,E=t.id,u=t.$inc;try{e={_id:i(E),__IS_ENABLED:!0},void 0!==o&&(CHECK_IS_DATA(o)!==!0?c=o:(c=o.success,a=o.error)),NEXT([function(t){S.findOne(e,t)},function(o){return function(i,n){i===TO_DELETE?n===TO_DELETE?void 0!==c&&c():(EACH(t,function(t,o){"id"!==o&&"_id"!==o&&"__IS_ENABLED"!==o&&"createTime"!==o&&"$inc"!==o&&(n[o]=t)}),r(n),n.lastUpdateTime=new Date,void 0!==u?S.save(n,function(t){o(n,t)}):S.save(n,function(t){o.next(n,t)})):(d=i.toString(),H({method:"update",data:t,errorMsg:d}),void 0!==a&&a(d))}},function(t){return function(o){S.update(e,{$inc:u},function(i){EACH(u,function(t,i){o[i]+=t}),t(o,i)})}},function(){return function(o,i){i===TO_DELETE?(I({method:"update",data:o}),n(o),void 0!==c&&c(o)):(d=i.toString(),H({method:"update",data:t,errorMsg:d}),void 0!==a&&a(d))}}])}catch(s){d=s.toString(),H({method:"update",data:t,errorMsg:d}),void 0!==a&&a(d)}},c.remove=s=function(t,o){var r,e,c,a;try{r={_id:i(t),__IS_ENABLED:!0},void 0!==o&&(CHECK_IS_DATA(o)!==!0?e=o:(e=o.success,c=o.error)),S.findOne(r,function(o,i){o===TO_DELETE?i===TO_DELETE?void 0!==e&&e():(i.__IS_ENABLED=!1,i.removeTime=new Date,S.save(i,function(o){o===TO_DELETE?(I({method:"remove",data:i}),n(i),void 0!==e&&e(i)):(a=o.toString(),H({method:"remove",id:t,errorMsg:a}),void 0!==c&&c(a))})):(a=o.toString(),H({method:"remove",id:t,errorMsg:a}),void 0!==c&&c(a))})}catch(d){a=d.toString(),H({method:"remove",id:t,errorMsg:a}),void 0!==c&&c(a)}},c.find=_=function(t,o){var i,r,c,a,d,E,u,s,_;try{void 0===o&&(o=t,t=void 0),void 0!==t&&(i=t.filter,r=t.sort,c=INTEGER(t.start),a=INTEGER(t.count),d=t.isFindAll),CHECK_IS_DATA(o)!==!0?E=o:(E=o.success,u=o.error),void 0===i&&(i={}),void 0===r&&(r={createTime:-1}),void 0===c&&(c=0),d!==!0&&(void 0===a||a>NODE_CONFIG.maxDataCount||isNaN(a)===!0?a=NODE_CONFIG.maxDataCount:1>a&&(a=1)),e(i),_=function(o,i){o===TO_DELETE?(i!==TO_DELETE&&EACH(i,function(t){n(t)}),E(i)):(s=o.toString(),H({method:"find",params:t,errorMsg:s}),u(s))},d===!0?S.find(i).sort(r).skip(c).toArray(_):S.find(i).sort(r).skip(c).limit(a).toArray(_)}catch(f){s=f.toString(),H({method:"find",params:t,errorMsg:s}),u(s)}},c.count=f=function(t,o){var i,n,r;try{void 0===o&&(o=t,t=void 0),void 0===t&&(t={}),CHECK_IS_DATA(o)!==!0?i=o:(i=o.success,n=o.error),e(t),S.find(t).count(function(o,e){o===TO_DELETE?i(e):(r=o.toString(),H({method:"count",filter:t,errorMsg:r}),n(r))})}catch(c){r=c.toString(),H({method:"count",filter:t,errorMsg:r}),n(r)}},c.checkIsExists=v=function(t,o){var n,r,c;try{void 0===o&&(o=t,t=void 0),void 0===t?t={}:CHECK_IS_DATA(t)!==!0&&(t={_id:i(t)}),CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,r=o.error),e(t),S.find(t).count(function(o,i){o===TO_DELETE?n(void 0!==i&&i>0):(c=o.toString(),H({method:"checkIsExists",filter:t,errorMsg:c}),r(c))})}catch(a){c=a.toString(),H({method:"checkIsExists",filter:t,errorMsg:c}),r(c)}},EACH(l,function(t){d(t.data,t.callback)}),l=void 0,EACH(D,function(t){E(t.idOrParams,t.callback)}),D=void 0,EACH(A,function(t){u(t.data,t.callback)}),A=void 0,EACH(C,function(t){s(t.id,t.callback)}),C=void 0,EACH(O,function(t){_(t.params,t.callback)}),O=void 0,EACH(m,function(t){f(t.filter,t.callback)}),m=void 0,EACH(T,function(t){v(t.filter,t.callback)}),T=void 0})}})}),FOR_BOX(function(t){"use strict";t.LOG_DB=CLASS({init:function(o,i,n){var r,e=CONNECT_TO_DB_SERVER.getNativeDB(),c=e.collection(t.boxName+"."+n);i.log=r=function(t){t.time=new Date,c.save(t,function(){})}}})}),OVERRIDE(NODE_CONFIG,function(t){global.NODE_CONFIG=NODE_CONFIG=COMBINE_DATA({origin:t,extend:{isDBLogMode:!1,maxDataCount:1e3}})});