FOR_BOX(function(box) {'use strict';

	/**
	 * ajax request.
	 */
	box.REQUEST = METHOD({

		run : function(params, responseListenerOrListeners) {
			//REQUIRED: params
			//OPTIONAL: params.host
			//OPTIONAL: params.port
			//OPTIONAL: params.isSecure
			//REQUIRED: params.method
			//REQUIRED: params.uri
			//OPTIONAL: params.paramstr
			//OPTIONAL: params.data
			//REQUIRED: responseListenerOrListeners

			REQUEST(COMBINE_DATA({
				origin : params,
				extend : {
					uri : box.boxName + '/' + params.uri
				}
			}), responseListenerOrListeners);
		}
	});
});
