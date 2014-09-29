FOR_BOX(function(box) {
	'use strict';

	/**
	 * Model(include CRUD functions) class
	 */
	box.MODEL = CLASS({

		init : function(inner, self, params) {
			//REQUIRED: params
			//REQUIRED: params.name
			//OPTIONAL: params.initData
			//OPTIONAL: params.methodConfig
			//OPTIONAL: params.isNotUsingObjectId

			var
			// name
			name = params.name,

			// init data.
			initData = params.initData,

			// method config
			methodConfig = params.methodConfig,

			// is not using object id
			isNotUsingObjectId = params.isNotUsingObjectId,

			// create config
			createConfig,

			// get config
			getConfig,

			// update config
			updateConfig,

			// remove config
			removeConfig,

			// find config
			findConfig,

			// count conifg
			countConfig,

			// check is exists conifg
			checkIsExistsConfig,

			// create valid
			createValid,

			// update valid
			updateValid,

			// is _id assignable
			is_idAssignable,

			// room
			room = box.ROOM(name),

			// room for create
			roomForCreate,

			// rooms for create
			roomsForCreate = {},

			// room for remove
			roomForRemove,

			// rooms for remove
			roomsForRemove = {},

			// sub rooms
			subRooms = [],

			// sub rooms for create
			subRoomsForCreate = [],

			// sub room map for create
			subRoomMapForCreate = {},

			// get name.
			getName,

			// get init data.
			getInitData,

			// get create valid.
			getCreateValid,

			// get update valid.
			getUpdateValid,

			// get room.
			getRoom,

			// create.
			create,

			// get.
			get,

			// get watching.
			getWatching,

			// update.
			update,

			// remove.
			remove,

			// find.
			find,

			// find watching.
			findWatching,

			// count.
			count,

			// check is exists.
			checkIsExists,

			// on new.
			onNew,

			// on new watching.
			onNewWatching,

			// close on new.
			closeOnNew,

			// on remove.
			onRemove,

			// close on remove.
			closeOnRemove;

			// init method config.
			if (methodConfig !== undefined) {

				createConfig = methodConfig.create;
				getConfig = methodConfig.get;
				updateConfig = methodConfig.update;
				removeConfig = methodConfig.remove;
				findConfig = methodConfig.find;
				countConfig = methodConfig.count;
				checkIsExistsConfig = methodConfig.checkIsExists;

				if (createConfig !== undefined) {
					createValid = createConfig.valid;
				}

				if (updateConfig !== undefined) {
					updateValid = updateConfig.valid;
				}
			}

			self.getName = getName = function() {
				return name;
			};

			inner.getInitData = getInitData = function() {
				return initData;
			};

			inner.getCreateValid = getCreateValid = function() {
				return createValid;
			};

			inner.getUpdateValid = getUpdateValid = function() {
				return updateValid;
			};

			self.getRoom = getRoom = function() {
				return room;
			};

			// create.
			if (createConfig !== false) {

				self.create = create = function(data, callbackOrHandlers) {
					//REQUIRED: data
					//OPTIONAL: callbackOrHandlers
					//OPTIONAL: callbackOrHandlers.success
					//OPTIONAL: callbackOrHandlers.notValid
					//OPTIONAL: callbackOrHandlers.notAuthed
					//OPTIONAL: callbackOrHandlers.error

					var
					// callback.
					callback,

					// not valid handler.
					notValidHandler,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler,

					// valid result
					validResult;

					if (callbackOrHandlers !== undefined) {
						if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
							callback = callbackOrHandlers;
						} else {
							callback = callbackOrHandlers.success;
							notValidHandler = callbackOrHandlers.notValid;
							notAuthedHandler = callbackOrHandlers.notAuthed;
							errorHandler = callbackOrHandlers.error;
						}
					}

					if (createValid !== undefined) {
						validResult = createValid.check(data);
					}

					if (validResult !== undefined && validResult.checkHasError() === true) {

						if (notValidHandler !== undefined) {
							notValidHandler(validResult.getErrors());
						} else {
							console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/create` NOT VALID!: ', validResult.getErrors());
						}

					} else {

						// init data.
						if (initData !== undefined) {
							EACH(initData, function(value, name) {
								data[name] = value;
							});
						}

						room.send({
							methodName : 'create',
							data : data
						}, function(result) {

							var
							// error msg
							errorMsg,

							// valid errors
							validErrors,

							// is not authed
							isNotAuthed,

							// saved data
							savedData;

							if (result !== undefined) {

								errorMsg = result.errorMsg;
								validErrors = result.validErrors;
								isNotAuthed = result.isNotAuthed;
								savedData = result.savedData;

								if (errorMsg !== undefined) {
									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/create` ERROR: ' + errorMsg);
									}
								} else if (validErrors !== undefined) {
									if (notValidHandler !== undefined) {
										notValidHandler(validErrors);
									} else {
										console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/create` NOT VALID!: ', validErrors);
									}
								} else if (isNotAuthed === true) {
									if (notAuthedHandler !== undefined) {
										notAuthedHandler();
									} else {
										console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/create` NOT AUTHED!');
									}
								} else if (callback !== undefined) {
									callback(savedData);
								}

							} else if (callback !== undefined) {
								callback();
							}
						});
					}
				};
			}

			// get.
			if (getConfig !== false) {

				self.get = get = function(idOrParams, callbackOrHandlers) {
					//REQUIRED: idOrParams
					//OPTIONAL: idOrParams.id
					//OPTIONAL: idOrParams.filter
					//OPTIONAL: idOrParams.sort
					//OPTIONAL: idOrParams.isRandom
					//REQUIRED: callbackOrHandlers

					var
					// callback
					callback,

					// not exists handler
					notExistsHandler,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler;

					if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
						callback = callbackOrHandlers;
					} else {
						callback = callbackOrHandlers.success;
						notExistsHandler = callbackOrHandlers.notExists;
						notAuthedHandler = callbackOrHandlers.notAuthed;
						errorHandler = callbackOrHandlers.error;
					}

					room.send({
						methodName : 'get',
						data : idOrParams
					}, function(result) {

						var
						// error msg
						errorMsg,

						// is not authed
						isNotAuthed,

						// saved data
						savedData;

						if (result !== undefined) {
							errorMsg = result.errorMsg;
							isNotAuthed = result.isNotAuthed;
							savedData = result.savedData;
						}

						if (errorMsg !== undefined) {
							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/get` ERROR: ' + errorMsg);
							}
						} else if (isNotAuthed === true) {
							if (notAuthedHandler !== undefined) {
								notAuthedHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/get` NOT AUTHED!');
							}
						} else if (savedData === undefined) {
							if (notExistsHandler !== undefined) {
								notExistsHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/get` NOT EXISTS!');
							}
						} else if (callback !== undefined) {
							callback(savedData);
						}
					});
				};

				self.getWatching = getWatching = function(idOrParams, callbackOrHandlers) {
					//REQUIRED: idOrParams
					//OPTIONAL: idOrParams.id
					//OPTIONAL: idOrParams.filter
					//OPTIONAL: idOrParams.sort
					//OPTIONAL: idOrParams.isRandom
					//REQUIRED: callbackOrHandlers

					var
					// callback
					callback,

					// not exists handler
					notExistsHandler,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler;

					if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
						callback = callbackOrHandlers;
					} else {
						callback = callbackOrHandlers.success;
						notExistsHandler = callbackOrHandlers.notExists;
						notAuthedHandler = callbackOrHandlers.notAuthed;
						errorHandler = callbackOrHandlers.error;
					}

					self.get(idOrParams, {

						success : function(savedData) {

							var
							// sub room
							subRoom,

							// close watching.
							closeWatching;

							if (callback !== undefined) {

								subRooms.push( subRoom = box.ROOM(name + '/' + savedData.id));

								callback(savedData,

								// add update handler.
								function(callback) {
									subRoom.on('update', callback);
								},

								// add remove handler.
								function(callback) {
									subRoom.on('remove', function(result) {
										callback(result);
										closeWatching();
									});
								},

								// close watching.
								closeWatching = function() {

									REMOVE({
										array : subRooms,
										value : subRoom
									});

									subRoom.exit();
								});
							}
						},

						notExists : notExistsHandler,
						notAuthed : notAuthedHandler,
						error : errorHandler
					});
				};
			}

			// update.
			if (updateConfig !== false) {

				self.update = update = function(data, callbackOrHandlers) {
					//REQUIRED: data
					//REQUIRED: data.id
					//OPTIONAL: callbackOrHandlers

					var
					// id
					id = data.id,

					// callback
					callback,

					// not valid handler.
					notValidHandler,

					// not exists handler
					notExistsHandler,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler,

					// valid result
					validResult;

					if (callbackOrHandlers !== undefined) {
						if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
							callback = callbackOrHandlers;
						} else {
							callback = callbackOrHandlers.success;
							notValidHandler = callbackOrHandlers.notValid;
							notExistsHandler = callbackOrHandlers.notExists;
							notAuthedHandler = callbackOrHandlers.notAuthed;
							errorHandler = callbackOrHandlers.error;
						}
					}

					if (updateValid !== undefined) {
						validResult = updateValid.checkExceptUndefined(data);
					}

					data.id = id;

					if (updateValid !== undefined && validResult.checkHasError() === true) {

						if (notValidHandler !== undefined) {
							notValidHandler(validResult.getErrors());
						} else {
							console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/update` NOT VALID!: ', validResult.getErrors());
						}

					} else {

						room.send({
							methodName : 'update',
							data : data
						}, function(result) {

							var
							// error msg
							errorMsg,

							// valid errors
							validErrors,

							// is not authed
							isNotAuthed,

							// saved data
							savedData;

							if (result !== undefined) {
								errorMsg = result.errorMsg;
								validErrors = result.validErrors;
								isNotAuthed = result.isNotAuthed;
								savedData = result.savedData;
							}

							if (errorMsg !== undefined) {
								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/update` ERROR: ' + errorMsg);
								}
							} else if (validErrors !== undefined) {
								if (notValidHandler !== undefined) {
									notValidHandler(validErrors);
								} else {
									console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/update` NOT VALID!: ', validErrors);
								}
							} else if (isNotAuthed === true) {
								if (notAuthedHandler !== undefined) {
									notAuthedHandler();
								} else {
									console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/update` NOT AUTHED!');
								}
							} else if (savedData === undefined) {
								if (notExistsHandler !== undefined) {
									notExistsHandler();
								} else {
									console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/update` NOT EXISTS!');
								}
							} else if (callback !== undefined) {
								callback(savedData);
							}
						});
					}
				};
			}

			// remove.
			if (removeConfig !== false && isNotUsingObjectId !== true) {

				self.remove = remove = function(id, callbackOrHandlers) {
					//REQUIRED: id
					//OPTIONAL: callbackOrHandlers

					var
					// callback
					callback,

					// not exists handler
					notExistsHandler,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler;

					if (callbackOrHandlers !== undefined) {
						if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
							callback = callbackOrHandlers;
						} else {
							callback = callbackOrHandlers.success;
							notExistsHandler = callbackOrHandlers.notExists;
							notAuthedHandler = callbackOrHandlers.notAuthed;
							errorHandler = callbackOrHandlers.error;
						}
					}

					room.send({
						methodName : 'remove',
						data : id
					}, function(result) {

						var
						// error msg
						errorMsg,

						// is not authed
						isNotAuthed,

						// saved data
						savedData;

						if (result !== undefined) {
							errorMsg = result.errorMsg;
							isNotAuthed = result.isNotAuthed;
							savedData = result.savedData;
						}

						if (errorMsg !== undefined) {
							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/remove` ERROR: ' + errorMsg);
							}
						} else if (isNotAuthed === true) {
							if (notAuthedHandler !== undefined) {
								notAuthedHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/remove` NOT AUTHED!');
							}
						} else if (savedData === undefined) {
							if (notExistsHandler !== undefined) {
								notExistsHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/remove` NOT EXISTS!');
							}
						} else if (callback !== undefined) {
							callback(savedData);
						}
					});
				};
			}

			// find.
			if (findConfig !== false) {

				self.find = find = function(params, callbackOrHandlers) {
					//OPTIONAL: params
					//OPTIONAL: params.filter
					//OPTIONAL: params.sort
					//OPTIONAL: params.start
					//OPTIONAL: params.count
					//REQUIRED: callbackOrHandlers

					var
					// callback
					callback,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler;

					// init params.
					if (callbackOrHandlers === undefined) {
						callbackOrHandlers = params;
						params = undefined;
					}

					if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
						callback = callbackOrHandlers;
					} else {
						callback = callbackOrHandlers.success;
						notAuthedHandler = callbackOrHandlers.notAuthed;
						errorHandler = callbackOrHandlers.error;
					}

					room.send({
						methodName : 'find',
						data : params
					}, function(result) {

						var
						// error msg
						errorMsg = result.errorMsg,

						// is not authed
						isNotAuthed = result.isNotAuthed,

						// saved data set
						savedDataSet = result.savedDataSet;

						if (errorMsg !== undefined) {
							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/find` ERROR: ' + errorMsg);
							}
						} else if (isNotAuthed === true) {
							if (notAuthedHandler !== undefined) {
								notAuthedHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/find` NOT AUTHED!');
							}
						} else if (callback !== undefined) {
							callback(savedDataSet);
						}
					});
				};

				self.findWatching = findWatching = function(params, callbackOrHandlers) {
					//OPTIONAL: params
					//OPTIONAL: params.filter
					//OPTIONAL: params.sort
					//OPTIONAL: params.start
					//OPTIONAL: params.count
					//REQUIRED: callbackOrHandlers

					var
					// callback
					callback,

					// not valid handler.
					notAuthedHandler,

					// error handler.
					errorHandler;

					// init params.
					if (callbackOrHandlers === undefined) {
						callbackOrHandlers = params;
						params = undefined;
					}

					if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
						callback = callbackOrHandlers;
					} else {
						callback = callbackOrHandlers.success;
						notAuthedHandler = callbackOrHandlers.notAuthed;
						errorHandler = callbackOrHandlers.error;
					}

					self.find(params, {

						success : function(savedDataSet) {

							var
							// inner sub rooms
							innerSubRooms = {},

							// close watching.
							closeWatching;

							if (callback !== undefined) {

								EACH(savedDataSet, function(savedData, i) {

									var
									// id
									id = savedData.id;

									subRooms.push(innerSubRooms[id] = box.ROOM(name + '/' + id));
								});

								callback(savedDataSet,

								// add update handler.
								function(id, callback) {
									innerSubRooms[id].on('update', callback);
								},

								// add remove handler.
								function(id, callback) {
									innerSubRooms[id].on('remove', function(result) {
										callback(result);
										closeWatching(id);
									});
								},

								// close watching.
								closeWatching = function(id) {

									if (innerSubRooms[id] !== undefined) {

										REMOVE({
											array : subRooms,
											value : innerSubRooms[id]
										});

										innerSubRooms[id].exit();
										delete innerSubRooms[id];
									}
								});
							}
						},

						notAuthed : notAuthedHandler,
						error : errorHandler
					});
				};
			}

			if (countConfig !== false) {

				self.count = count = function(params, callbackOrHandlers) {
					//OPTIONAL: params
					//OPTIONAL: params.filter
					//REQUIRED: callbackOrHandlers

					var
					// callback
					callback,

					// not valid handler.
					notAuthedHandler,

					// error handler
					errorHandler;

					// init params.
					if (callbackOrHandlers === undefined) {
						callbackOrHandlers = params;
						params = undefined;
					}

					if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
						callback = callbackOrHandlers;
					} else {
						callback = callbackOrHandlers.success;
						notAuthedHandler = callbackOrHandlers.notAuthed;
						errorHandler = callbackOrHandlers.error;
					}

					room.send({
						methodName : 'count',
						data : params
					}, function(result) {

						var
						// error msg
						errorMsg = result.errorMsg,

						// is not authed
						isNotAuthed = result.isNotAuthed,

						// count
						count = result.count;

						if (errorMsg !== undefined) {
							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/count` ERROR: ' + errorMsg);
							}
						} else if (isNotAuthed === true) {
							if (notAuthedHandler !== undefined) {
								notAuthedHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/count` NOT AUTHED!');
							}
						} else if (callback !== undefined) {
							callback(count);
						}
					});
				};
			}

			if (checkIsExistsConfig !== false) {

				self.checkIsExists = checkIsExists = function(params, callbackOrHandlers) {
					//OPTIONAL: params
					//OPTIONAL: params.filter
					//REQUIRED: callbackOrHandlers

					var
					// callback
					callback,

					// not valid handler.
					notAuthedHandler,

					// error handler
					errorHandler;

					// init params.
					if (callbackOrHandlers === undefined) {
						callbackOrHandlers = params;
						params = undefined;
					}

					if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
						callback = callbackOrHandlers;
					} else {
						callback = callbackOrHandlers.success;
						notAuthedHandler = callbackOrHandlers.notAuthed;
						errorHandler = callbackOrHandlers.error;
					}

					room.send({
						methodName : 'checkIsExists',
						data : params
					}, function(result) {

						var
						// error msg
						errorMsg = result.errorMsg,

						// is not authed
						isNotAuthed = result.isNotAuthed,

						// is exists
						isExists = result.isExists;

						if (errorMsg !== undefined) {
							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/checkIsExists` ERROR: ' + errorMsg);
							}
						} else if (isNotAuthed === true) {
							if (notAuthedHandler !== undefined) {
								notAuthedHandler();
							} else {
								console.log('[UPPERCASE.IO-MODEL] `' + box.boxName + '.' + name + '/checkIsExists` NOT AUTHED!');
							}
						} else if (callback !== undefined) {
							callback(isExists);
						}
					});
				};
			}

			self.onNew = onNew = function(properties, func) {
				//OPTIONAL: properties
				//REQUIRED: func

				if (func === undefined) {
					func = properties;

					if (roomForCreate === undefined) {
						roomForCreate = box.ROOM(name + '/create');
					}

					roomForCreate.on('create', func);

				} else {

					EACH(properties, function(value, propertyName) {

						var
						// room
						room = roomsForCreate[propertyName + '/' + value];

						if (room === undefined) {
							room = roomsForCreate[propertyName + '/' + value] = box.ROOM(name + '/' + propertyName + '/' + value + '/create');
						}

						room.on('create', func);
					});
				}
			};

			self.onNewWatching = onNewWatching = function(properties, func) {
				//OPTIONAL: properties
				//REQUIRED: func

				var
				// f.
				f = function(savedData, subRoomsForCreate) {

					var
					// id
					id = savedData.id,

					// sub room
					subRoom,

					// close watching.
					closeWatching;

					subRooms.push( subRoom = box.ROOM(name + '/' + id));
					subRoomsForCreate.push(subRoom);

					func(savedData,

					// add update handler.
					function(callback) {
						subRoom.on('update', callback);
					},

					// add remove handler.
					function(callback) {
						subRoom.on('remove', function(result) {
							callback(result);
							closeWatching();
						});
					},

					// close watching.
					closeWatching = function() {

						subRoom.exit();

						REMOVE({
							array : subRooms,
							value : subRoom
						});
					});
				};

				if (func === undefined) {
					func = properties;

					if (roomForCreate === undefined) {
						roomForCreate = box.ROOM(name + '/create');
					}

					roomForCreate.on('create', function(savedData) {
						f(savedData, subRoomsForCreate);
					});

				} else {

					EACH(properties, function(value, propertyName) {

						var
						// room
						room = roomsForCreate[propertyName + '/' + value],

						// sub rooms for create
						subRoomsForCreate = subRoomMapForCreate[propertyName + '/' + value];

						if (room === undefined) {
							room = roomsForCreate[propertyName + '/' + value] = box.ROOM(name + '/' + propertyName + '/' + value + '/create');
						}

						if (subRoomsForCreate === undefined) {
							subRoomsForCreate = subRoomMapForCreate[propertyName + '/' + value] = [];
						}

						room.on('create', function(savedData) {
							f(savedData, subRoomsForCreate);
						});
					});
				}
			};

			self.closeOnNew = closeOnNew = function(properties) {
				//OPTIONAL: properties

				if (properties === undefined) {

					if (roomForCreate !== undefined) {
						roomForCreate.exit();
						roomForCreate = undefined;
					}

					EACH(subRoomsForCreate, function(subRoom) {

						subRoom.exit();

						REMOVE({
							array : subRooms,
							value : subRoom
						});
					});

					subRoomsForCreate = [];

				} else {

					EACH(properties, function(value, propertyName) {

						if (roomsForCreate[propertyName + '/' + value] !== undefined) {
							roomsForCreate[propertyName + '/' + value].exit();
							delete roomsForCreate[propertyName + '/' + value];
						}

						EACH(subRoomMapForCreate[propertyName + '/' + value], function(subRoom) {

							subRoom.exit();

							REMOVE({
								array : subRooms,
								value : subRoom
							});
						});
						delete subRoomMapForCreate[propertyName + '/' + value];
					});
				}
			};

			self.onRemove = onRemove = function(properties, func) {
				//OPTIONAL: properties
				//REQUIRED: func

				var
				// f.
				f = function(savedData) {

					var
					// id
					id = savedData.id;

					func(savedData);
				};

				if (func === undefined) {
					func = properties;

					if (roomForRemove === undefined) {
						roomForRemove = box.ROOM(name + '/remove');
					}

					roomForRemove.on('remove', f);

				} else {

					EACH(properties, function(value, propertyName) {

						var
						// room
						room = roomsForRemove[propertyName + '/' + value];

						if (room === undefined) {
							room = roomsForRemove[propertyName + '/' + value] = box.ROOM(name + '/' + propertyName + '/' + value + '/remove');
						}

						room.on('remove', f);
					});
				}
			};

			self.closeOnRemove = closeOnRemove = function(properties) {
				//OPTIONAL: properties

				if (properties === undefined) {

					if (roomForRemove !== undefined) {
						roomForRemove.exit();
						roomForRemove = undefined;
					}

				} else {

					EACH(properties, function(value, propertyName) {

						if (roomsForRemove[propertyName + '/' + value] !== undefined) {
							roomsForRemove[propertyName + '/' + value].exit();
							delete roomsForRemove[propertyName + '/' + value];
						}
					});
				}
			};
		}
	});
});
