'use strict';

/*

Welcome to UPPERCASE-BOOT! (http://uppercase.io)

*/

/*
 * Configuration
 */
OVERRIDE(CONFIG, (origin) => {

	global.CONFIG = COMBINE([{
		
		defaultBoxName : 'UPPERCASE',
		
		title : 'UPPERCASE PROJECT'
		
		// description
		
		// maxThumbWidth
		// or
		// maxThumbHeight
		
	}, origin]);
});

/*
 * UPPERCASE를 실행합니다.
 */
global.BOOT = (params) => {
	//OPTIONAL: params
	//OPTIONAL: params.CONFIG
	//OPTIONAL: params.NODE_CONFIG
	//OPTIONAL: params.BROWSER_CONFIG
	
	const UPPERCASE_PATH = __dirname + '/..';
	const BOX_SITE_URL = 'https://box.uppercase.io';

	let version = 'V' + Date.now();
	let rootPath = process.cwd();
	
	let browserScriptContents = [];
	let browserScript = '';
	let boxBrowserScripts = {};
	
	let _404PageContent;
	let indexPageContent;
	
	let addContentToBrowserScript = (content) => {
		browserScript += content + '\n';
		browserScriptContents.push(content);
	};

	let loadForBrowser = (path, boxName) => {
		
		let content = READ_FILE({
			path : path,
			isSync : true
		}).toString();
		
		if (boxName === undefined) {
			addContentToBrowserScript(content);
		} else {

			browserScript += content + '\n';
			
			if (boxBrowserScripts[boxName] === undefined) {
				boxBrowserScripts[boxName] = '';
			}
			
			boxBrowserScripts[boxName] += content;
		}
		
		return content;
	};
	
	let loadBrowserInit = () => {
		
		let content = READ_FILE({
			path : UPPERCASE_PATH + '/UPPERCASE-BOOT/BROWSER_INIT' + (CONFIG.isDevMode === true ? '' : '.MIN') + '.js',
			isSync : true
		}).toString();
		
		browserScript += content + '\n';
		
		return content;
	};
	
	let reloadBrowserScript = () => {

		browserScript = '';
		boxBrowserScripts = {};

		EACH(browserScriptContents, (browserScriptContent) => {
			browserScript += browserScriptContent + '\n';
		});
		
		LOAD_ALL_SCRIPTS({
			rootPath : rootPath,
			env : 'BROWSER'
		}, loadForBrowser);
		
		loadBrowserInit();
	};
	
	let configuration = () => {

		let _CONFIG;
		let _NODE_CONFIG;
		let _BROWSER_CONFIG;

		let stringifyJSONWithFunction = (data) => {

			return JSON.stringify(data, (key, value) => {
				if (typeof value === 'function') {
					return '__FUNCTION_START__' + value.toString() + '__FUNCTION_END__';
				}
				return value;
			}, '\t').replace(/("__FUNCTION_START__(.*)__FUNCTION_END__")/g, (match, content) => {
				return eval('(' + eval('"' + content.substring('"__FUNCTION_START__'.length, content.length - '__FUNCTION_END__"'.length) + '"') + ')').toString();
			});
		};

		// set root path.
		NODE_CONFIG.rootPath = rootPath;

		if (params !== undefined) {
			_CONFIG = params.CONFIG;
			_NODE_CONFIG = params.NODE_CONFIG;
			_BROWSER_CONFIG = params.BROWSER_CONFIG;
		}

		// override CONFIG.
		if (_CONFIG !== undefined) {

			// extend CONFIG.
			EXTEND({
				origin : CONFIG,
				extend : _CONFIG
			});

			// add CONFIG to browser script.
			addContentToBrowserScript('EXTEND({ origin : CONFIG, extend : ' + stringifyJSONWithFunction(_CONFIG) + ' });\n');
		}
		
		if (CONFIG.isDevMode !== true) {
			
			READ_FILE({
				path : rootPath + '/VERSION',
				isSync : true
			}, {
				
				notExists : () => {
					SHOW_ERROR('BOOT', MSG({
						ko : 'VERSION 파일이 존재하지 않습니다.'
					}));
				},
				
				success : (buffer) => {
					version = buffer.toString();
				}
			});
		}

		// set version.
		CONFIG.version = version;
		addContentToBrowserScript('CONFIG.version = \'' + version + '\';\n');
		
		if (CONFIG.isUsingProxy === true) {
			addContentToBrowserScript('CONFIG.webServerPort = BROWSER_CONFIG.port;\n');
		}

		// override NODE_CONFIG.
		if (_NODE_CONFIG !== undefined) {

			// extend NODE_CONFIG.
			EXTEND({
				origin : NODE_CONFIG,
				extend : _NODE_CONFIG
			});
		}

		// override BROWSER_CONFIG.
		if (_BROWSER_CONFIG !== undefined) {

			// add BROWSER_CONFIG to browser script.
			addContentToBrowserScript('EXTEND({ origin : BROWSER_CONFIG, extend : ' + stringifyJSONWithFunction(_BROWSER_CONFIG) + ' });\n');
		}
	};
	
	let clustering = (work) => {
		
		let innerWork = () => {

			if (NODE_CONFIG.clusteringServerHosts !== undefined && NODE_CONFIG.thisServerName !== undefined && NODE_CONFIG.clusteringPort !== undefined) {

				SERVER_CLUSTERING({
					hosts : NODE_CONFIG.clusteringServerHosts,
					thisServerName : NODE_CONFIG.thisServerName,
					port : NODE_CONFIG.clusteringPort
				}, work);

			} else {
				work();
			}
		};

		if (NODE_CONFIG.isNotUsingCPUClustering !== true) {
			CPU_CLUSTERING(innerWork);
		} else {
			RUN(innerWork);
		}
	};

	let connectToDatabase = () => {
		
		if (NODE_CONFIG.dbName !== undefined) {

			CONNECT_TO_DB_SERVER({
				name : NODE_CONFIG.dbName,
				host : NODE_CONFIG.dbHost,
				port : NODE_CONFIG.dbPort,
				username : NODE_CONFIG.dbUsername,
				password : NODE_CONFIG.dbPassword,
				
				backupHost : NODE_CONFIG.backupDBHost,
				backupPort : NODE_CONFIG.backupDBPort,
				backupName : NODE_CONFIG.backupDBName,
				backupUsername : NODE_CONFIG.backupDBUsername,
				backupPassword : NODE_CONFIG.backupDBPassword
			});
		}
	};
	
	let generate404Page = () => {
		
		let custom404Path = rootPath + '/' + CHECK_IS_IN({
			array : INIT_BOXES.getBoxNamesInBOXFolder(),
			value : CONFIG.defaultBoxName
		}) === true ? 'BOX/' + CONFIG.defaultBoxName + '/404.html' : CONFIG.defaultBoxName + '/404.html';
		
		if (CHECK_FILE_EXISTS({
			path : custom404Path,
			isSync : true
		}) === true) {
			
			_404PageContent = READ_FILE({
				path : custom404Path,
				isSync : true
			}).toString();
			
		} else {

			_404PageContent = '<!DOCTYPE html>';
			_404PageContent += '<html>';
			_404PageContent += '<head>';
			_404PageContent += '<meta charset="utf-8">';
			_404PageContent += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">';
			
			_404PageContent += '<meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">';
			
			// icons
			_404PageContent += '<link rel="shortcut icon" href="/R/favicon.ico?version=' + CONFIG.version + '" />';
			_404PageContent += '<link rel="apple-touch-icon-precomposed" href="/R/apple-touch-icon.png?version=' + CONFIG.version + '" />';
			
			_404PageContent += '<title>Page not found</title>';
	
			// load css.
			_404PageContent += '<link rel="stylesheet" type="text/css" href="/__CSS?version=' + CONFIG.version + '" />';
			
			_404PageContent += '</head>';
			_404PageContent += '<body>';
			
			// show please enable JavaScript msg.
			_404PageContent += '<noscript>';
			_404PageContent += '<p style="padding:15px;">';
			_404PageContent += 'JavaScript is disabled. Please enable JavaScript in your browser.';
			_404PageContent += '</p>';
			_404PageContent += '</noscript>';
			
			// load script.
			_404PageContent += '<script src="/__SCRIPT?version=' + CONFIG.version + '"></script>';
			_404PageContent += '<script>' + READ_FILE({
				path : UPPERCASE_PATH + '/UPPERCASE-BOOT/404.js',
				isSync : true
			}).toString() + '</script>';
			_404PageContent += '</body>';
			_404PageContent += '</html>';
		}
	};

	let generateIndexPage = () => {
		
		let customIndexPath = rootPath + '/' + CHECK_IS_IN({
			array : INIT_BOXES.getBoxNamesInBOXFolder(),
			value : CONFIG.defaultBoxName
		}) === true ? 'BOX/' + CONFIG.defaultBoxName + '/index.html' : CONFIG.defaultBoxName + '/index.html';
		
		if (CHECK_FILE_EXISTS({
			path : customIndexPath,
			isSync : true
		}) === true) {
			
			indexPageContent = READ_FILE({
				path : customIndexPath,
				isSync : true
			}).toString();
			
		} else {

			indexPageContent = '<!DOCTYPE html>';
			indexPageContent += '<html>';
			indexPageContent += '<head>';
			indexPageContent += '<meta charset="utf-8">';
			indexPageContent += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">';
			
			if (CONFIG.description !== undefined) {
				indexPageContent += '<meta name="description" content="' + CONFIG.description + '">';
			}
			
			indexPageContent += '<meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">';
			
			// icons
			indexPageContent += '<link rel="shortcut icon" href="/R/favicon.ico?version=' + CONFIG.version + '" />';
			indexPageContent += '<link rel="apple-touch-icon-precomposed" href="/R/apple-touch-icon.png?version=' + CONFIG.version + '" />';
			
			indexPageContent += '<title>' + CONFIG.title + '</title>';
	
			// load css.
			indexPageContent += '<link rel="stylesheet" type="text/css" href="/__CSS?version=' + CONFIG.version + '" />';
			
			indexPageContent += '</head>';
			indexPageContent += '<body>';
			
			// show please enable JavaScript msg.
			indexPageContent += '<p id="__ES6_NOT_SUPPORTED" style="padding:15px;">';
			indexPageContent += 'JavaScript is disabled or ECMAScript 6 is not supported in your web browser.<br>Please update your web browser or use the latest version of any web browser.';
			indexPageContent += '</p>';
			indexPageContent += '<script>const __ES6_NOT_SUPPORTED_SENTENCE=document.querySelector(\'#__ES6_NOT_SUPPORTED\');(()=>{__ES6_NOT_SUPPORTED_SENTENCE.remove();})()</script>';
			
			// load script.
			indexPageContent += '<script src="/__SCRIPT?version=' + CONFIG.version + '"></script>';
			indexPageContent += '</body>';
			indexPageContent += '</html>';
		}
	};

	let run = () => {

		let uploadServerHosts;
		let socketServerHosts;
		let webSocketServerHosts;
		
		let nextUploadServerHostIndex;
		let nextSocketServerHostIndex;
		let nextWebSocketServerHostIndex;
		
		let boxRequestListeners = {};
		let boxPreprocessors = {};
		
		let webServer;

		if (NODE_CONFIG.uploadServerHosts !== undefined) {

			uploadServerHosts = [];
			nextUploadServerHostIndex = 0;

			EACH(NODE_CONFIG.uploadServerHosts, (host) => {
				uploadServerHosts.push(host);
			});
		}

		if (NODE_CONFIG.socketServerHosts !== undefined) {

			socketServerHosts = [];
			nextSocketServerHostIndex = 0;

			EACH(NODE_CONFIG.socketServerHosts, (host) => {
				socketServerHosts.push(host);
			});
		}

		if (NODE_CONFIG.webSocketServerHosts !== undefined) {

			webSocketServerHosts = [];
			nextWebSocketServerHostIndex = 0;

			EACH(NODE_CONFIG.webSocketServerHosts, (host) => {
				webSocketServerHosts.push(host);
			});
		}
		
		INIT_OBJECTS();

		if (CONFIG.webServerPort !== undefined || CONFIG.securedWebServerPort !== undefined) {
			
			webServer = WEB_SERVER({

				port : CONFIG.webServerPort,

				securedPort : CONFIG.securedWebServerPort,
				securedKeyFilePath : NODE_CONFIG.securedKeyFilePath,
				securedCertFilePath : NODE_CONFIG.securedCertFilePath,
				
				uploadURI : '__UPLOAD',
				uploadPath : rootPath + '/__RF/__TEMP',
				maxUploadFileMB : NODE_CONFIG.maxUploadFileMB,
				
				rootPath : rootPath,

				version : version
			}, {
				
				uploadProgress : (uriParams, bytesRecieved, bytesExpected, requestInfo) => {
					
					// broadcast.
					if (uriParams.uploadKey !== undefined) {
						
						let boxName = uriParams.boxName;
						let box = BOX.getAllBoxes()[boxName === undefined ? CONFIG.defaultBoxName : boxName];
						
						box.BROADCAST({
							roomName : 'uploadProgressRoom/' + uriParams.uploadKey,
							methodName : 'progress',
							data : {
								bytesRecieved : bytesRecieved,
								bytesExpected : bytesExpected
							}
						});
					}
				},
				
				uploadOverFileSize : (params, maxUploadFileMB, requestInfo, response) => {
					
					response({
						statusCode : 302,
						headers : {
							'Location' : params.callbackURL + '?maxUploadFileMB=' + encodeURIComponent(maxUploadFileMB)
						}
					});
				},
				
				uploadSuccess : (params, fileDataSet, requestInfo, response) => {
					
					let boxName = params.boxName;
					let box = BOX.getAllBoxes()[boxName === undefined ? CONFIG.defaultBoxName : boxName];

					if (box !== undefined) {

						let uploadFileDB = box.DB('__UPLOAD_FILE');

						NEXT(fileDataSet, [
						(fileData, next) => {

							let tempPath = fileData.path;

							// delete temp path.
							delete fileData.path;

							fileData.serverName = NODE_CONFIG.thisServerName;
							fileData.downloadCount = 0;

							uploadFileDB.create(fileData, (savedData) => {
								
								let toPath = rootPath + '/__RF/' + boxName + '/' + savedData.id;

								MOVE_FILE({
									from : tempPath,
									to : toPath
								}, () => {
									
									// create thumbnail.
									if (
									// check is image
									savedData.type !== undefined && savedData.type.substring(0, 6) === 'image/' &&
									// check config exists
									(CONFIG.maxThumbWidth !== undefined || CONFIG.maxThumbHeight !== undefined)) {
										
										let distPath = rootPath + '/__RF/' + boxName + '/THUMB/' + savedData.id;
										
										IMAGEMAGICK_IDENTIFY(toPath, {
											
											// when error, just copy.
											error : () => {
												COPY_FILE({
													from : toPath,
													to : distPath
												}, next);
											},
											
											success : (features) => {
												
												if (CONFIG.maxThumbWidth !== undefined && features.width !== undefined && features.width > CONFIG.maxThumbWidth) {
					
													IMAGEMAGICK_RESIZE({
														srcPath : toPath,
														distPath : distPath,
														width : CONFIG.maxThumbWidth
													}, next);
					
												} else if (CONFIG.maxThumbHeight !== undefined && features.height !== undefined && features.height > CONFIG.maxThumbHeight) {
					
													IMAGEMAGICK_RESIZE({
														srcPath : toPath,
														distPath : distPath,
														height : CONFIG.maxThumbHeight
													}, next);
					
												} else {
					
													COPY_FILE({
														from : toPath,
														to : distPath
													}, next);
												}
											}
										});
										
									} else {
										next();
									}
								});
							});
						},

						() => {
							return () => {

								let fileDataSetStr = STRINGIFY(fileDataSet);

								response(params.callbackURL === undefined ? fileDataSetStr : {
									statusCode : 302,
									headers : {
										'Location' : params.callbackURL + '?fileDataSetStr=' + encodeURIComponent(fileDataSetStr)
									}
								});
							};
						}]);
					}
				},
				
				notExistsResource : (resourcePath, requestInfo, response) => {
					
					// when dev mode, re-generate 404 page.
					if (CONFIG.isDevMode === true) {
						generate404Page();
					}
					
					response({
						statusCode : 404,
						content : _404PageContent
					});
				},

				requestListener : (requestInfo, response, replaceRootPath, next) => {

					let isSecure = requestInfo.isSecure;
					let uri = requestInfo.uri;
					let method = requestInfo.method;
					let headers = requestInfo.headers;
					let params = requestInfo.params;

					let wrapCallback = (str) => {
						return params.callback !== undefined ? params.callback + '(\'' + str + '\')' : str;
					};
					
					if (uri === '__CHECK_ALIVE') {

						response({
							content : '',
							headers : {
								'Access-Control-Allow-Origin' : '*'
							}
						});

						return false;
					}
					
					// serve version.
					else if (uri === '__VERSION') {

						response({
							content : CONFIG.version,
							headers : {
								'Access-Control-Allow-Origin' : '*'
							}
						});

						return false;
					}

					// serve browser script.
					else if (uri === '__SCRIPT') {
						
						let boxName = params.boxName;

						if (CONFIG.isDevMode === true) {

							reloadBrowserScript();
							
							response({
								contentType : 'application/javascript',
								content : boxName === undefined ? browserScript : boxBrowserScripts[boxName]
							});

						} else {

							// check ETag.
							if (headers['if-none-match'] === version) {

								// response cached.
								response({
									statusCode : 304
								});
							}

							// redirect correct version uri.
							else if (params.version !== version) {

								response({
									statusCode : 302,
									headers : {
										'Location' : '/__SCRIPT?version=' + version + (boxName === undefined ? '' : '&boxName=' + boxName)
									}
								});
							}

							// response browser script.
							else {

								response({
									contentType : 'application/javascript',
									content : boxName === undefined ? browserScript : boxBrowserScripts[boxName],
									version : version
								});
							}
						}

						return false;
					}

					// serve base style css.
					else if (uri === '__CSS') {
						replaceRootPath(UPPERCASE_PATH);
						requestInfo.uri = CONFIG.isDevMode === true ? 'UPPERCASE-BOOT/R/BASE_STYLE.css' : 'UPPERCASE-BOOT/R/BASE_STYLE.MIN.css';
					}

					// serve upload server host.
					else if (uri === '__UPLOAD_SERVER_HOST') {

						if (uploadServerHosts === undefined) {

							response({
								content : wrapCallback(params.defaultHost),
								headers : {
									'Access-Control-Allow-Origin' : '*'
								}
							});

						} else {

							response({
								content : wrapCallback(uploadServerHosts[nextUploadServerHostIndex]),
								headers : {
									'Access-Control-Allow-Origin' : '*'
								}
							});

							nextUploadServerHostIndex += 1;

							if (nextUploadServerHostIndex === uploadServerHosts.length) {
								nextUploadServerHostIndex = 0;
							}
						}

						return false;
					}

					// serve uploaded final resource.
					else if (uri.substring(0, 5) === '__RF/') {

						uri = uri.substring(5);

						let i = uri.indexOf('/');

						if (i !== -1) {

							let boxName = uri.substring(0, i);

							if (boxName === 'UPPERCASE' || BOX.getAllBoxes()[boxName] !== undefined) {
								uri = uri.substring(i + 1);
							} else {
								boxName = CONFIG.defaultBoxName;
							}

							let uploadFileDB = BOX.getAllBoxes()[boxName].DB('__UPLOAD_FILE');

							uploadFileDB.get(uri.lastIndexOf('/') === -1 ? uri : uri.substring(uri.lastIndexOf('/') + 1), {

								error : () => {

									next({
										isFinal : true
									});
								},

								notExists : () => {

									next({
										isFinal : true
									});
								},

								success : (savedData) => {

									if (savedData.serverName === NODE_CONFIG.thisServerName) {

										next({
											contentType : savedData.type,
											headers : {
												'Content-Disposition' : 'filename="' + encodeURIComponent(savedData.name) + '"',
												'Access-Control-Allow-Origin' : '*'
											},
											isFinal : true
										});

										uploadFileDB.updateNoHistory({
											id : savedData.id,
											$inc : {
												downloadCount : 1
											}
										});

									} else if (NODE_CONFIG.uploadServerHosts !== undefined) {

										response({
											statusCode : 302,
											headers : {
												'Location' : isSecure === true ?
													'https://' + NODE_CONFIG.uploadServerHosts[savedData.serverName] + ':' + CONFIG.securedWebServerPort + '/__RF/' + boxName + '/' + uri :
													'http://' + NODE_CONFIG.uploadServerHosts[savedData.serverName] + ':' + CONFIG.webServerPort + '/__RF/' + boxName + '/' + uri
											}
										});
									}
								}
							});
						}

						return false;
					}

					// serve cors callback.
					else if (uri === '__CORS_CALLBACK') {
						replaceRootPath(UPPERCASE_PATH + '/UPPERCASE-BOOT/R');
						requestInfo.uri = 'CORS_CALLBACK.html';
					}

					// serve socket server host.
					else if (uri === '__SOCKET_SERVER_HOST') {

						if (socketServerHosts === undefined) {

							response({
								content : wrapCallback(params.defaultHost),
								headers : {
									'Access-Control-Allow-Origin' : '*'
								}
							});

						} else {

							response({
								content : wrapCallback(socketServerHosts[nextSocketServerHostIndex]),
								headers : {
									'Access-Control-Allow-Origin' : '*'
								}
							});

							nextSocketServerHostIndex += 1;

							if (nextSocketServerHostIndex === socketServerHosts.length) {
								nextSocketServerHostIndex = 0;
							}
						}

						return false;
					}

					// serve web socket server host.
					else if (uri === '__WEB_SOCKET_SERVER_HOST') {

						if (webSocketServerHosts === undefined) {

							response({
								content : wrapCallback(params.defaultHost),
								headers : {
									'Access-Control-Allow-Origin' : '*'
								}
							});

						} else {

							response({
								content : wrapCallback(webSocketServerHosts[nextWebSocketServerHostIndex]),
								headers : {
									'Access-Control-Allow-Origin' : '*'
								}
							});

							nextWebSocketServerHostIndex += 1;

							if (nextWebSocketServerHostIndex === webSocketServerHosts.length) {
								nextWebSocketServerHostIndex = 0;
							}
						}

						return false;
					}
					
					// serve others.
					else {

						let i = uri.indexOf('/');
						
						let boxName;

						if (i === -1) {
							boxName = CONFIG.defaultBoxName;
						} else {
							boxName = uri.substring(0, i);

							if (BOX.getAllBoxes()[boxName] !== undefined) {
								uri = uri.substring(i + 1);
							} else {
								boxName = CONFIG.defaultBoxName;
							}
						}
						
						if (uri === 'favicon.ico' || uri.substring(0, 12) === '.well-known/') {
							uri = 'R/' + uri;
						}
						
						// serve resource.
						if (uri.substring(0, 2) === 'R/') {
							
							requestInfo.uri = CHECK_IS_IN({
								array : INIT_BOXES.getBoxNamesInBOXFolder(),
								value : boxName
							}) === true ? 'BOX/' + boxName + '/' + uri : boxName + '/' + uri;
						}
						
						// response index page.
						else {
							
							let isGoingOn;

							if (boxRequestListeners[boxName] !== undefined) {
								isGoingOn = boxRequestListeners[boxName](requestInfo, response, replaceRootPath, next);
							}
							
							if (isGoingOn !== false) {
								
								// when dev mode, re-generate index page.
								if (CONFIG.isDevMode === true) {
									generateIndexPage();
								}
								
								response({
									contentType : 'text/html',
									content : indexPageContent
								});
							}
							
							return false;
						}
					}
				}
			});
		}

		LAUNCH_ROOM_SERVER({
			socketServerPort : CONFIG.socketServerPort,
			webServer : webServer
		});
		
		// run all MAINs.
		FOR_BOX((box) => {
			if (box.MAIN !== undefined) {
				box.MAIN((requestListener) => {
					boxRequestListeners[box.boxName] = requestListener;
				}, (params) => {
					if (webServer !== undefined) {
						webServer.addPreprocessor(params);
					}
				});
			}
		});
		
		let cal = CALENDAR();
		
		console.log(CONSOLE_GREEN('[BOOT] ' + MSG({
			ko : '<' + cal.getYear() + '-' + cal.getMonth() + '-' + cal.getDate() + ' ' + cal.getHour() + ':' + cal.getMinute() + ':' + cal.getSecond() + '> [' + CONFIG.title + '] 부팅 완료' + (NODE_CONFIG.isNotUsingCPUClustering !== true ? ' (워커 ID:' + CPU_CLUSTERING.getWorkerId() + ')' : '') + (CONFIG.webServerPort === undefined ? '' : (' => http://localhost:' + CONFIG.webServerPort)) + (CONFIG.securedWebServerPort === undefined ? '' : (' => https://localhost:' + CONFIG.securedWebServerPort))
		})));
	};
	
	// load all UPPERCASE modules for browser.
	EACH(['CORE', 'ROOM', 'MODEL', 'BOOT'], (name, i) => {
		
		let isDevMode = (CONFIG.isDevMode === true || (params !== undefined && params.CONFIG !== undefined && params.CONFIG.isDevMode === true));
		
		if (isDevMode === true && i > 0) {
			addContentToBrowserScript('\n\n');
		}
		
		loadForBrowser(UPPERCASE_PATH + '/UPPERCASE-' + name + '/BROWSER' + (isDevMode === true ? '' : '.MIN') + '.js');
	});
	
	configuration();
	
	NEXT([
	(next) => {
		
		if (NODE_CONFIG.isNotUsingCPUClustering === true || CPU_CLUSTERING.checkIsMaster() === true) {
			
			READ_FILE(rootPath + '/DEPENDENCY', {
				
				notExists : () => {
					next();
				},
				
				success : (content) => {
					
					let ubm = require('ubm')();
					
					NEXT(content.toString().split('\n'), [
					
					(box, next) => {
						
						box = box.trim();
						
						if (box !== '' && box[0] !== '/' && box.indexOf('/') !== -1) {
							
							let username = box.substring(0, box.indexOf('/'));
							let boxName = box.substring(box.indexOf('/') + 1);
							
							GET({
								url : BOX_SITE_URL + '/_/info',
								data : {
									username : username,
									boxName : boxName
								}
							}, {
								error : next,
								
								success : (result) => {
									
									result = PARSE_STR(result);
									
									if (result.boxData === undefined) {
										next();
									} else {
										
										let boxData = result.boxData;
										
										NEXT([
										(next) => {
											
											READ_FILE(rootPath + '/BOX/' + boxName + '/VERSION', {
												
												error : () => {
													next(undefined, boxData.version);
												},
												
												notExists : () => {
													next(undefined, boxData.version);
												},
												
												success : (versionContent) => {
													
													let nowVersion = versionContent.toString();
													
													if (boxData.version !== nowVersion) {
														next(nowVersion, boxData.version);
													} else {
														next();
													}
												}
											});
										},
										
										() => {
											return (nowVersion, newVersion) => {
												
												// 새 버전 존재
												if (newVersion !== undefined) {
													
													if (nowVersion === undefined) {
														console.log(CONSOLE_YELLOW(MSG({
															ko : '[' + boxName + '] BOX를 설치합니다. (v' + newVersion + ')'
														})));
													}
													
													else {
														console.log(CONSOLE_YELLOW(MSG({
															ko : '[' + boxName + '] BOX를 업데이트합니다. (v' + nowVersion + ' -> v' + newVersion + ')'
														})));
													}
													
													ubm.installBox(username, boxName, next);
												}
												
												else {
													next();
												}
											};
										}]);
									}
								}
							});
						}
						
						else {
							next();
						}
					},
					
					() => {
						return () => {
							next();
						};
					}]);
				}
			});
		}
		
		else {
			next();
		}
	},
	
	() => {
		return () => {
			
			INIT_BOXES(rootPath, addContentToBrowserScript);
			
			// clustering cpus and servers.
			clustering(() => {
				
				console.log('[BOOT] ' + MSG({
					ko : '부팅중...' + (NODE_CONFIG.isNotUsingCPUClustering !== true ? ' (워커 ID:' + CPU_CLUSTERING.getWorkerId() + ')' : '')
				}));
				
				connectToDatabase();
				
				LOAD_ALL_SCRIPTS({
					rootPath : rootPath,
					env : 'NODE'
				}, require);
				
				LOAD_ALL_SCRIPTS({
					rootPath : rootPath,
					env : 'BROWSER'
				}, loadForBrowser);
				
				loadBrowserInit();
				
				generate404Page();
				
				generateIndexPage();
				
				run();
			});
		};
	}]);
};

global.CHECK_IS_ALLOWED_FOLDER_NAME = METHOD({
	
	run : (name) => {
		//REQUIRED: name
		
		return (
			name !== 'BOX' &&
			name !== 'node_modules' &&
			name !== '__NOT_LOAD' &&
			name !== '__RF' &&
			name !== '__PACK' &&
			name !== '__OLD'
		);
	}
});
/*
 * Check still alive object
 */
global.CHECK_STILL_ALIVE = OBJECT({

	init : () => {
		
		if (global.UPPERCASE !== undefined) {
			
			global.UPPERCASE.ROOM('checkStillAliveRoom', (clientInfo, on, off, send) => {
				
				// I'm still alive!!
				on('check', (notUsing, ret) => {
					ret('__ALIVE');
				});
				
				// I'm still alive!! (string mode)
				on('checkStr', (notUsing, ret) => {
					send({
						str : '__ALIVE'
					});
				});
			});
		}
	}
});

global.INIT_BOXES = METHOD((m) => {
	
	let boxNamesInBOXFolder = [];
	
	let getBoxNamesInBOXFolder = m.getBoxNamesInBOXFolder = () => {
		return boxNamesInBOXFolder;
	};
	
	return {
		
		run : (rootPath, addContent) => {
			//REQUIRED: rootPath
			//OPTIONAL: addContent
			
			// create UPPERCASE box.
			BOX('UPPERCASE');
			
			if (addContent !== undefined) {
				addContent('BOX(\'UPPERCASE\');\n');
			}
			
			// init boxes in root folder.
			FIND_FOLDER_NAMES({
				path : rootPath,
				isSync : true
			}, (folderNames) => {
	
				EACH(folderNames, (folderName) => {
	
					if (CHECK_IS_ALLOWED_FOLDER_NAME(folderName) === true) {
	
						// create box.
						BOX(folderName);
	
						if (addContent !== undefined) {
							addContent('BOX(\'' + folderName + '\');\n');
						}
					}
				});
			});
	
			if (CHECK_FILE_EXISTS({
				path : rootPath + '/BOX',
				isSync : true
			}) === true) {
	
				// init boxes is BOX folder.
				FIND_FOLDER_NAMES({
					path : rootPath + '/BOX',
					isSync : true
				}, (folderNames) => {
	
					EACH(folderNames, (folderName) => {
	
						if (CHECK_IS_ALLOWED_FOLDER_NAME(folderName) === true) {
	
							// create box.
							BOX(folderName);
	
							if (addContent !== undefined) {
								addContent('BOX(\'' + folderName + '\');\n');
							}
							
							// save box name.
							boxNamesInBOXFolder.push(folderName);
						}
					});
				});
			}
		}
	};
});
global.LOAD_ALL_SCRIPTS = METHOD((m) => {
	
	let Path = require('path');
	
	return {
		
		run : (params, load) => {
			//REQUIRED: params
			//REQUIRED: params.rootPath
			//REQUIRED: params.env
			//REQUIRED: load
			
			let rootPath = params.rootPath;
			let env = params.env;
			
			let scanFolder = (folderPath, boxName) => {
	
				FIND_FILE_NAMES({
					path : folderPath,
					isSync : true
				}, {
	
					notExists : () => {
						// ignore.
					},
	
					success : (fileNames) => {
	
						EACH(fileNames, (fileName) => {
	
							let fullPath = folderPath + '/' + fileName;
							
							let extname = Path.extname(fileName).toLowerCase();
	
							if (extname === '.js') {
								load(fullPath, boxName);
							}
						});
					}
				});
	
				FIND_FOLDER_NAMES({
					path : folderPath,
					isSync : true
				}, {
	
					notExists : () => {
						// ignore.
					},
	
					success : (folderNames) => {
	
						EACH(folderNames, (folderName) => {
							if (CHECK_IS_ALLOWED_FOLDER_NAME(folderName) === true) {
								scanFolder(folderPath + '/' + folderName, boxName);
							}
						});
					}
				});
			};
			
			FOR_BOX((box) => {
	
				let boxRootPath = CHECK_IS_IN({
					array : INIT_BOXES.getBoxNamesInBOXFolder(),
					value : box.boxName
				}) === true ? rootPath + '/BOX' : rootPath;
				
				scanFolder(boxRootPath + '/' + box.boxName + '/COMMON', box.boxName);
				scanFolder(boxRootPath + '/' + box.boxName + '/' + env, box.boxName);
			});
			
			FOR_BOX((box) => {
				
				let boxRootPath = CHECK_IS_IN({
					array : INIT_BOXES.getBoxNamesInBOXFolder(),
					value : box.boxName
				}) === true ? rootPath + '/BOX' : rootPath;
				
				FIND_FILE_NAMES({
					path : boxRootPath + '/' + box.boxName,
					isSync : true
				}, {
	
					notExists : () => {
						// ignore.
					},
	
					success : (fileNames) => {
	
						EACH(fileNames, (fileName) => {
	
							let fullPath = boxRootPath + '/' + box.boxName + '/' + fileName;
							
							let extname = Path.extname(fileName).toLowerCase();
	
							if (fileName === env + extname) {
								if (extname === '.js') {
									load(fullPath, box.boxName);
								}
							}
						});
					}
				});
			});
		}
	};
});
FOR_BOX((box) => {

	OVERRIDE(box.MODEL, (origin) => {

		/*
		 * MODEL 클래스
		 */
		box.MODEL = CLASS({
			
			preset : () => {
				return origin;
			},
			
			params : () => {
				return {
					isNotToInitialize : NODE_CONFIG.isNotToModelInitialize
				};
			}
		});
	});
});

/*
 * Node-side Configuration
 */
OVERRIDE(NODE_CONFIG, (origin) => {

	global.NODE_CONFIG = COMBINE([{
		isNotUsingCPUClustering : false
		// maxUploadFileMB
		// isNotToModelInitialize
	}, origin]);
});

/*
 * Sync time object (Server-side)
 */
global.SYNC_TIME = OBJECT({

	init : () => {
		
		if (global.UPPERCASE !== undefined) {
			
			global.UPPERCASE.ROOM('timeSyncRoom', (clientInfo, on) => {

				// return diff. (diff: client time - server time)
				on('sync', (clientNow, ret) => {
					ret(clientNow - new Date());
				});
			});
		}
	}
});
