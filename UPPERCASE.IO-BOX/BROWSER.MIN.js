FOR_BOX(function(O){"use strict";O.GO=METHOD({run:function(e){GO((O.boxName===CONFIG.defaultBoxName?"":O.boxName+"/")+e)}})});FOR_BOX(function(N){"use strict";N.GO_NEW_WIN=METHOD({run:function(O){GO_NEW_WIN((N.boxName===CONFIG.defaultBoxName?"":N.boxName+"/")+O)}})});FOR_BOX(function(e){"use strict";e.HREF=METHOD({run:function(n){return HREF((e.boxName===CONFIG.defaultBoxName?"":e.boxName+"/")+(void 0===n?"":n))}})});FOR_BOX(function(t){"use strict";t.MATCH_VIEW=METHOD({run:function(u){var a=u.uri,e=u.target,n=[],r=function(u){t.boxName===CONFIG.defaultBoxName&&n.push(u),n.push(t.boxName+"/"+u)};CHECK_IS_ARRAY(a)===!0?EACH(a,r):r(a),MATCH_VIEW({uri:n,target:e})}})});FOR_BOX(function(o){"use strict";o.REFRESH=METHOD({run:function(e){REFRESH((o.boxName===CONFIG.defaultBoxName?"":o.boxName+"/")+(void 0===e?"":e))}})});