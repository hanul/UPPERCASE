OVERRIDE(PACK_DATA,function(){"use strict";global.PACK_DATA=PACK_DATA=METHOD({run:function(A){var n=function(A){var _=COPY_DATA(A),t=[];return EACH(_,function(A,C){A instanceof Date==1?(_[C]=parseInt(A.getTime()),t.push(C)):CHECK_IS_DATA(A)===!0?_[C]=n(A):CHECK_IS_ARRAY(A)===!0&&EACH(A,function(_,t){CHECK_IS_DATA(_)===!0&&(A[t]=n(_))})}),_.__DATE_ATTR_NAMES=t,_};return n(A)}})});