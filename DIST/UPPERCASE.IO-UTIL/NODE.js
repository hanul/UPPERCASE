global.IMAGEMAGICK_CONVERT=IMAGEMAGICK_CONVERT=METHOD(function(){"use strict";require("imagemagick");return{run:function(r,n){var e,i;CHECK_IS_DATA(n)!==!0?e=n:(e=n.success,i=n.error),imagemagick.convert(r,function(r){r!==TO_DELETE?i(r.toString()):e()})}}}),global.IMAGEMAGICK_EXPORT_METADATA=IMAGEMAGICK_EXPORT_METADATA=METHOD(function(){"use strict";require("imagemagick");return{run:function(r,n){var n,e;CHECK_IS_DATA(callbackOrHandlers)!==!0?n=callbackOrHandlers:(n=callbackOrHandlers.success,e=callbackOrHandlers.error),imagemagick.readMetadata(r,function(r,i){r!==TO_DELETE?e(r.toString()):n(i)})}}}),global.MINIFY_CSS=MINIFY_CSS=METHOD(function(){"use strict";var r=require("sqwish");return{run:function(n){return r.minify(n)}}}),global.MINIFY_JS=MINIFY_JS=METHOD(function(){"use strict";var r=require("uglify-js");return{run:function(n){return r.minify(n,{fromString:!0,mangle:!0}).code}}});