'use strict';

/*
 * Welcome to UPPERCASE! (http://uppercase.io)
 */

// 웹 브라우저 환경에서는 window가 global 객체 입니다.
let global = window;

/*
 * DB의 update 기능을 사용할 때, 데이터의 특정 값에 TO_DELETE를 지정하게 되면 해당 값이 삭제됩니다.
 * 자세한 것은 DB의 update 예제를 살펴보시기 바랍니다.
 *
 * 참고로 UPPERCASE 기반 프로젝트에서 이 TO_DELETE만이 null이 될 수 있는 유일한 변수입니다.
 * 다른 변수에서는 null을 사용하지 않고 undefined를 사용해 주시기 바랍니다.
 */
global.TO_DELETE = null;

/*
 * 메소드를 생성합니다.
 */
global.METHOD = (define) => {
	//REQUIRED: define		메소드 정의 구문
	//REQUIRED: define.run	메소드 실행 구문

	let funcs;
	let run;

	let m = (params, funcs) => {
		//OPTIONAL: params
		//OPTIONAL: funcs

		if (run !== undefined) {
			return run(params, funcs);
		}
	};

	m.type = METHOD;

	if (typeof define === 'function') {
		funcs = define(m);
	}

	// when define is function set
	else {
		funcs = define;
	}

	// init funcs.
	if (funcs !== undefined) {
		run = funcs.run;
	}

	return m;
};

/*
 * target이 데이터인지 확인합니다.
 */
global.CHECK_IS_DATA = METHOD({

	run: (target) => {
		//OPTIONAL: target

		if (
			target !== undefined &&
			target !== TO_DELETE &&
			CHECK_IS_ARRAY(target) !== true &&
			target instanceof Date !== true &&
			target instanceof RegExp !== true &&
			typeof target === 'object'
		) {
			return true;
		}

		return false;
	}
});

/*
 * target이 배열인지 확인합니다.
 */
global.CHECK_IS_ARRAY = METHOD({

	run: (target) => {
		//OPTIONAL: target

		if (
			target !== undefined &&
			target !== TO_DELETE &&
			typeof target === 'object' &&
			Object.prototype.toString.call(target) === '[object Array]'
		) {
			return true;
		}

		return false;
	}
});

/*
 * 데이터나 배열, 문자열의 각 요소를 순서대로 대입하여 주어진 함수를 실행합니다.
 */
global.EACH = METHOD({

	run: (dataOrArrayOrString, func) => {
		//OPTIONAL: dataOrArrayOrString
		//REQUIRED: func

		if (dataOrArrayOrString === undefined) {
			return false;
		}

		// when dataOrArrayOrString is data
		else if (CHECK_IS_DATA(dataOrArrayOrString) === true) {

			for (let name in dataOrArrayOrString) {
				if (dataOrArrayOrString.hasOwnProperty === undefined || dataOrArrayOrString.hasOwnProperty(name) === true) {
					if (func(dataOrArrayOrString[name], name) === false) {
						return false;
					}
				}
			}
		}

		// when dataOrArrayOrString is func
		else if (func === undefined) {

			func = dataOrArrayOrString;
			dataOrArrayOrString = undefined;

			return (dataOrArrayOrString) => {
				return EACH(dataOrArrayOrString, func);
			};
		}

		// when dataOrArrayOrString is array or string
		else {

			let length = dataOrArrayOrString.length;

			for (let i = 0; i < length; i += 1) {

				if (func(dataOrArrayOrString[i], i) === false) {
					return false;
				}

				// when shrink
				if (dataOrArrayOrString.length < length) {
					i -= length - dataOrArrayOrString.length;
					length -= length - dataOrArrayOrString.length;
				}

				// when stretch
				else if (dataOrArrayOrString.length > length) {
					length += dataOrArrayOrString.length - length;
				}
			}
		}

		return true;
	}
});

/*
 * BOX를 생성합니다.
 */
global.BOX = METHOD((m) => {

	let boxes = {};

	let getAllBoxes = m.getAllBoxes = () => {
		return boxes;
	};

	return {

		run: (boxName) => {
			//REQUIRED: boxName

			let box = (packName) => {
				//REQUIRED: packName

				let packNameSps = packName.split('.');

				let pack;

				EACH(packNameSps, (packNameSp) => {

					if (pack === undefined) {

						if (box[packNameSp] === undefined) {
							box[packNameSp] = {};
						}

						pack = box[packNameSp];
					}

					else {

						if (pack[packNameSp] === undefined) {
							pack[packNameSp] = {};
						}

						pack = pack[packNameSp];
					}
				});

				return pack;
			};

			box.type = BOX;
			box.boxName = boxName;

			global[boxName] = boxes[boxName] = box;

			if (CONFIG[boxName] === undefined) {
				CONFIG[boxName] = {};
			}

			FOR_BOX.inject(box);

			return box;
		}
	};
});

/*
 * 모든 박스를 대상으로 하는 메소드와 클래스, 싱글톤 객체를 선언할 때 사용합니다.
 */
global.FOR_BOX = METHOD((m) => {

	let funcs = [];

	let inject = m.inject = (box) => {
		EACH(funcs, (func) => {
			func(box);
		});
	};

	return {

		run: (func) => {
			//REQUIRED: func

			EACH(BOX.getAllBoxes(), (box) => {
				func(box);
			});

			funcs.push(func);
		}
	};
});

/*
 * 기본 설정
 */
global.CONFIG = {

	// 개발 모드 설정
	isDevMode: false
};

global.LANG_NAMES = {
	ach: 'Lwo',
	ady: 'Адыгэбзэ',
	af: 'Afrikaans',
	ak: 'Tɕɥi',
	ar: 'العربية',
	az: 'Azərbaycan dili',
	bg: 'Български',
	bn: 'বাংলা',
	ca: 'Català',
	cak: 'Maya Kaqchikel',
	cs: 'Čeština',
	cy: 'Cymraeg',
	da: 'Dansk',
	de: 'Deutsch',
	dsb: 'Dolnoserbšćina',
	el: 'Ελληνικά',
	en: 'English',
	eo: 'Esperanto',
	es: 'Español',
	et: 'eesti keel',
	eu: 'Euskara',
	fa: 'فارسی',
	ff: 'Fulah',
	fi: 'Suomi',
	fr: 'Français',
	ga: 'Gaeilge',
	gl: 'Galego',
	he: 'עברית‏',
	hi: 'हिन्दी',
	hr: 'Hrvatski',
	hsb: 'Hornjoserbšćina',
	ht: 'Kreyòl',
	hu: 'Magyar',
	id: 'Bahasa Indonesia',
	is: 'Íslenska',
	it: 'Italiano',
	ja: '日本語',
	km: 'ភាសាខ្មែរ',
	kab: 'Taqbaylit',
	kn: 'ಕನ್ನಡ',
	ko: '한국어',
	la: 'Latin',
	lb: 'Lëtzebuergesch',
	lt: 'Lietuvių',
	lv: 'Latviešu',
	mai: 'मैथिली, মৈথিলী',
	mk: 'Македонски',
	ml: 'മലയാളം',
	mr: 'मराठी',
	ms: 'Bahasa Melayu',
	mt: 'Malti',
	my: 'ဗမာစကာ',
	no: 'Norsk',
	nb: 'Norsk (bokmål)',
	ne: 'नेपाली',
	nl: 'Nederlands',
	oc: 'Occitan',
	pa: 'ਪੰਜਾਬੀ',
	pl: 'Polski',
	pt: 'Português',
	ro: 'Română',
	ru: 'Русский',
	sk: 'Slovenčina',
	sl: 'Slovenščina',
	sq: 'Shqip',
	sr: 'Српски',
	su: 'Basa Sunda',
	sv: 'Svenska',
	sw: 'Kiswahili',
	ta: 'தமிழ்',
	te: 'తెలుగు',
	tg: 'забо́ни тоҷикӣ́',
	th: 'ภาษาไทย',
	tl: 'Filipino',
	tlh: 'tlhIngan-Hol',
	tr: 'Türkçe',
	uk: 'Українська',
	ur: 'اردو',
	uz: 'O\'zbek',
	vi: 'Tiếng Việt',
	yi: 'ייִדיש',
	'zh-CN': '中文（中国）',
	'zh-TW': '中文（台灣）'
};

FOR_BOX((box) => {

	/*
	 * MODEL 클래스
	 */
	box.MODEL = CLASS({

		init: (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.name
			//OPTIONAL: params.initData
			//OPTIONAL: params.methodConfig
			//OPTIONAL: params.methodConfig.create
			//OPTIONAL: params.methodConfig.create.valid
			//OPTIONAL: params.methodConfig.create.role
			//OPTIONAL: params.methodConfig.create.authKey
			//OPTIONAL: params.methodConfig.create.adminRole
			//OPTIONAL: params.methodConfig.get
			//OPTIONAL: params.methodConfig.get.role
			//OPTIONAL: params.methodConfig.update
			//OPTIONAL: params.methodConfig.update.valid
			//OPTIONAL: params.methodConfig.update.role
			//OPTIONAL: params.methodConfig.update.authKey
			//OPTIONAL: params.methodConfig.update.adminRole
			//OPTIONAL: params.methodConfig.remove
			//OPTIONAL: params.methodConfig.remove.role
			//OPTIONAL: params.methodConfig.remove.authKey
			//OPTIONAL: params.methodConfig.remove.adminRole
			//OPTIONAL: params.methodConfig.find
			//OPTIONAL: params.methodConfig.find.role
			//OPTIONAL: params.methodConfig.count
			//OPTIONAL: params.methodConfig.count.role
			//OPTIONAL: params.methodConfig.checkExists
			//OPTIONAL: params.methodConfig.checkExists.role
			//OPTIONAL: params.isNotUsingObjectId
			//OPTIONAL: params.isNotUsingHistory
			//OPTIONAL: params.isNotToInitialize

			let getBoxName = self.getBoxName = () => {
				return box.boxName;
			};

			// to implement.
		}
	});
});

/*
 * BROWSER, NODE 에서 확장해서 사용해야 합니다.
 */
global.MSG = METHOD((m) => {
	
	let msgData = {};
	
	let addData = m.addData = (data) => {
		EXTEND({
			origin : msgData,
			extend : data
		});
	};
	
	return {
		
		run : (keyOrMsgs) => {
			//REQUIRED: keyOrMsgs
			
			let key;
			let msgs;
			
			if (CHECK_IS_DATA(keyOrMsgs) !== true) {
				key = keyOrMsgs;
			} else {
				msgs = keyOrMsgs;
			}
			
			if (key !== undefined) {
				msgs = msgData[key];
			}
			
			let msg;
			
			// get first msg.
			EACH(msgs, (_msg) => {
				msg = _msg;
				return false;
			});
			
			if (msg !== undefined && CHECK_IS_DATA(msg) === true) {
				
				// get first msg.
				EACH(msg, (_msg) => {
					msg = _msg;
					return false;
				});
			}
	
			return msg;
		}
	}
});

/*
 * BOX를 생성합니다.
 */
global.BOX = METHOD((m) => {

	let boxes = {};

	let getAllBoxes = m.getAllBoxes = () => {
		return boxes;
	};

	return {

		run: (boxName) => {
			//REQUIRED: boxName

			let box = (packName) => {
				//REQUIRED: packName

				let packNameSps = packName.split('.');

				let pack;

				EACH(packNameSps, (packNameSp) => {

					if (pack === undefined) {

						if (box[packNameSp] === undefined) {
							box[packNameSp] = {};
						}

						pack = box[packNameSp];
					}

					else {

						if (pack[packNameSp] === undefined) {
							pack[packNameSp] = {};
						}

						pack = pack[packNameSp];
					}
				});

				return pack;
			};

			box.type = BOX;
			box.boxName = boxName;

			global[boxName] = boxes[boxName] = box;

			if (CONFIG[boxName] === undefined) {
				CONFIG[boxName] = {};
			}

			FOR_BOX.inject(box);

			return box;
		}
	};
});

/*
 * 모든 박스를 대상으로 하는 메소드와 클래스, 싱글톤 객체를 선언할 때 사용합니다.
 */
global.FOR_BOX = METHOD((m) => {

	let funcs = [];

	let inject = m.inject = (box) => {
		EACH(funcs, (func) => {
			func(box);
		});
	};

	return {

		run: (func) => {
			//REQUIRED: func

			EACH(BOX.getAllBoxes(), (box) => {
				func(box);
			});

			funcs.push(func);
		}
	};
});

/*
 * 콘솔에 오류 메시지를 출력합니다.
 */
global.SHOW_ERROR = (tag, errorMsg, params) => {
	//REQUIRED: tag
	//REQUIRED: errorMsg
	//OPTIONAL: params

	let cal = CALENDAR();

	console.error(cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true) + ':' + cal.getSecond(true) + ' [' + tag + '] 오류가 발생했습니다. 오류 메시지: ' + errorMsg);

	if (params !== undefined) {
		console.error('다음은 오류를 발생시킨 파라미터입니다.');
		console.error(JSON.stringify(params, TO_DELETE, 4));
	}
};
/*
 * 콘솔에 경고 메시지를 출력합니다.
 */
global.SHOW_WARNING = (tag, warningMsg, params) => {
	//REQUIRED: tag
	//REQUIRED: warningMsg
	//OPTIONAL: params

	let cal = CALENDAR();

	console.warn(cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true) + ':' + cal.getSecond(true) + ' [' + tag + '] 경고가 발생했습니다. 경고 메시지: ' + warningMsg);

	if (params !== undefined) {
		console.warn('다음은 경고를 발생시킨 파라미터입니다.');
		console.warn(JSON.stringify(params, TO_DELETE, 4));
	}
};
/*@license
	Papa Parse
	v4.5.0
	https://github.com/mholt/PapaParse
	License: MIT
*/
(function(factory)
{
	global.__PAPA = factory();
}(function()
{
	'use strict';

	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously
	Papa.NODE_STREAM_INPUT = 1;

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;
	Papa.ReadableStreamStreamer = ReadableStreamStreamer;
	Papa.DuplexStreamStreamer = DuplexStreamStreamer;

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		};
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function() {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		var dynamicTyping = _config.dynamicTyping || false;
		if (isFunction(dynamicTyping)) {
			_config.dynamicTypingFunction = dynamicTyping;
			// Will be filled on first row call
			dynamicTyping = {};
		}
		_config.dynamicTyping = dynamicTyping;

		_config.transform = isFunction(_config.transform) ? _config.transform : false;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (_input === Papa.NODE_STREAM_INPUT)
		{
			// create a node Duplex stream for use
			// with .pipe
			streamer = new DuplexStreamStreamer(_config);
			return streamer.getStream();
		}
		else if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
		{
			streamer = new ReadableStreamStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		unpackConfig();

		var quoteCharRegex = new RegExp(_quoteChar, 'g');

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				return serialize(null, _input);
			else if (typeof _input[0] === 'object')
				return serialize(objectKeys(_input[0]), _input);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					_input.fields =  _input.meta && _input.meta.fields;

				if (!_input.fields)
					_input.fields =  _input.data[0] instanceof Array
						? _input.fields
						: objectKeys(_input.data[0]);

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw 'exception: Unable to serialize unrecognized input';


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length === 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				_quotes = _config.quotes;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;

			if (typeof _config.quoteChar === 'string')
				_quoteChar = _config.quoteChar;

			if (typeof _config.header === 'boolean')
				_writeHeader = _config.header;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = '';

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						csv += _delimiter;
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					csv += _newline;
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			if (str.constructor === Date)
				return JSON.stringify(str).slice(1, 25);

			str = str.toString().replace(quoteCharRegex, _quoteChar + _quoteChar);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? _quoteChar + str + _quoteChar : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._finished = false;
		this._completed = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk, isFakeChunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted())
				return;

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk) && !isFakeChunk)
			{
				this._config.chunk(results, this._handle);
				if (this._handle.paused() || this._handle.aborted())
					return;
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (!this._completed && finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted)) {
				this._config.complete(this._completeResults, this._input);
				this._completed = true;
			}

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open('GET', this._input, !IS_WORKER);
			// Headers can only be set when once the request state is OPENED
			if (this._config.downloadRequestHeaders)
			{
				var headers = this._config.downloadRequestHeaders;

				for (var headerName in headers)
				{
					xhr.setRequestHeader(headerName, headers[headerName]);
				}
			}

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes=' + this._start + '-' + end);
				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				this._chunkError();
			else
				this._start += this._config.chunkSize;
		};

		this._chunkLoaded = function()
		{
			if (xhr.readyState !== 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		};

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(new Error(errorText));
		};

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
				return -1;
			}
			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		};

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		};

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		};

		this._chunkError = function()
		{
			this._sendError(reader.error);
		};

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var remaining;
		this.stream = function(s)
		{
			remaining = s;
			return this._nextChunk();
		};
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		};
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;


	function ReadableStreamStreamer(config)
	{
		config = config || {};

		ChunkStreamer.call(this, config);

		var queue = [];
		var parseOnData = true;
		var streamHasEnded = false;

		this.pause = function()
		{
			ChunkStreamer.prototype.pause.apply(this, arguments);
			this._input.pause();
		};

		this.resume = function()
		{
			ChunkStreamer.prototype.resume.apply(this, arguments);
			this._input.resume();
		};

		this.stream = function(stream)
		{
			this._input = stream;

			this._input.on('data', this._streamData);
			this._input.on('end', this._streamEnd);
			this._input.on('error', this._streamError);
		};

		this._checkIsFinished = function()
		{
			if (streamHasEnded && queue.length === 1) {
				this._finished = true;
			}
		};

		this._nextChunk = function()
		{
			this._checkIsFinished();
			if (queue.length)
			{
				this.parseChunk(queue.shift());
			}
			else
			{
				parseOnData = true;
			}
		};

		this._streamData = bindFunction(function(chunk)
		{
			try
			{
				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

				if (parseOnData)
				{
					parseOnData = false;
					this._checkIsFinished();
					this.parseChunk(queue.shift());
				}
			}
			catch (error)
			{
				this._streamError(error);
			}
		}, this);

		this._streamError = bindFunction(function(error)
		{
			this._streamCleanUp();
			this._sendError(error);
		}, this);

		this._streamEnd = bindFunction(function()
		{
			this._streamCleanUp();
			streamHasEnded = true;
			this._streamData('');
		}, this);

		this._streamCleanUp = bindFunction(function()
		{
			this._input.removeListener('data', this._streamData);
			this._input.removeListener('end', this._streamEnd);
			this._input.removeListener('error', this._streamError);
		}, this);
	}
	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


	function DuplexStreamStreamer(_config) {
		var Duplex = require('stream').Duplex;
		var config = copy(_config);
		var parseOnWrite = true;
		var writeStreamHasFinished = false;
		var parseCallbackQueue = [];
		var stream = null;

		this._onCsvData = function(results)
		{
			var data = results.data;
			for (var i = 0; i < data.length; i++) {
				if (!stream.push(data[i]) && !this._handle.paused()) {
					// the writeable consumer buffer has filled up
					// so we need to pause until more items
					// can be processed
					this._handle.pause();
				}
			}
		};

		this._onCsvComplete = function()
		{
			// node will finish the read stream when
			// null is pushed
			stream.push(null);
		};

		config.step = bindFunction(this._onCsvData, this);
		config.complete = bindFunction(this._onCsvComplete, this);
		ChunkStreamer.call(this, config);

		this._nextChunk = function()
		{
			if (writeStreamHasFinished && parseCallbackQueue.length === 1) {
				this._finished = true;
			}
			if (parseCallbackQueue.length) {
				parseCallbackQueue.shift()();
			} else {
				parseOnWrite = true;
			}
		};

		this._addToParseQueue = function(chunk, callback)
		{
			// add to queue so that we can indicate
			// completion via callback
			// node will automatically pause the incoming stream
			// when too many items have been added without their
			// callback being invoked
			parseCallbackQueue.push(bindFunction(function() {
				this.parseChunk(typeof chunk === 'string' ? chunk : chunk.toString(config.encoding));
				if (isFunction(callback)) {
					return callback();
				}
			}, this));
			if (parseOnWrite) {
				parseOnWrite = false;
				this._nextChunk();
			}
		};

		this._onRead = function()
		{
			if (this._handle.paused()) {
				// the writeable consumer can handle more data
				// so resume the chunk parsing
				this._handle.resume();
			}
		};

		this._onWrite = function(chunk, encoding, callback)
		{
			this._addToParseQueue(chunk, callback);
		};

		this._onWriteComplete = function()
		{
			writeStreamHasFinished = true;
			// have to write empty string
			// so parser knows its done
			this._addToParseQueue('');
		};

		this.getStream = function()
		{
			return stream;
		};
		stream = new Duplex({
			readableObjectMode: true,
			decodeStrings: false,
			read: bindFunction(this._onRead, this),
			write: bindFunction(this._onWrite, this)
		});
		stream.once('finish', bindFunction(this._onWriteComplete, this));
	}
	DuplexStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	DuplexStreamStreamer.prototype.constructor = DuplexStreamStreamer;


	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
		var ISO_DATE = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _rowCounter = 0;	// Number of rows that have been parsed so far
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;	// Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else
						userStep(_results, self);
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				_config.newline = guessLineEndings(input);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines, _config.comments);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(isFunction(_config.delimiter))
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input, true);
		};

		this.aborted = function()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = '';
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \'' + Papa.DefaultDelimiter + '\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (_results.data[i].length === 1 && _results.data[i][0] === '')
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTypingAndTransformation();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				for (var j = 0; j < _results.data[i].length; j++)
				{
					var header = _results.data[i][j];

					if (_config.trimHeaders) {
						header = header.trim();
					}

					_fields.push(header);
				}
			_results.data.splice(0, 1);
		}

		function shouldApplyDynamicTyping(field) {
			// Cache function values to avoid calling it for each row
			if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
				_config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
			}
			return (_config.dynamicTyping[field] || _config.dynamicTyping) === true;
		}

		function parseDynamic(field, value)
		{
			if (shouldApplyDynamicTyping(field))
			{
				if (value === 'true' || value === 'TRUE')
					return true;
				else if (value === 'false' || value === 'FALSE')
					return false;
				else if (FLOAT.test(value))
					return parseFloat(value);
				else if (ISO_DATE.test(value))
					return new Date(value);
				else
					return (value === '' ? null : value);
			}
			return value;
		}

		function applyHeaderAndDynamicTypingAndTransformation()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping && !_config.transform))
				return _results;

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = _config.header ? {} : [];

				var j;
				for (j = 0; j < _results.data[i].length; j++)
				{
					var field = j;
					var value = _results.data[i][j];

					if (_config.header)
						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

					if (_config.transform)
						value = _config.transform(value,field);

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						row[field] = value;
				}

				_results.data[i] = row;

				if (_config.header)
				{
					if (j > _fields.length)
						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
					else if (j < _fields.length)
						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
				}
			}

			if (_config.header && _results.meta)
				_results.meta.fields = _fields;

			_rowCounter += _results.data.length;
			return _results;
		}

		function guessDelimiter(input, newline, skipEmptyLines, comments)
		{
			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					comments: comments,
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					if (skipEmptyLines && preview.data[j].length === 1 && preview.data[j][0].length === 0) {
						emptyLinesCount++;
						continue;
					}
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= (preview.data.length - emptyLinesCount);

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			};
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024 * 1024);	// max length 1 MB

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		var quoteChar;
		/** Allows for no quoteChar by setting quoteChar to undefined in config */
		if (config.quoteChar === undefined) {
			quoteChar = '"';
		} else {
			quoteChar = config.quoteChar;
		}
		var escapeChar = quoteChar;
		if (config.escapeChar !== undefined) {
			escapeChar = config.escapeChar;
		}

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ',';

		// Comment character must be valid
		if (comments === delim)
			throw 'Comment character same as delimiter';
		else if (comments === true)
			comments = '#';
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline !== '\n' && newline !== '\r' && newline !== '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw 'Input must be a string';

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = isFunction(step);

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substr(0, commentsLen) === comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(escapeChar.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&') + quoteChar, 'g');
			var quoteSearch;

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						quoteSearch = input.indexOf(quoteChar, quoteSearch + 1);

						//No other quotes are found - no other delimiters
						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						// Closing quote at EOF
						if (quoteSearch === inputLen - 1)
						{
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						// If the quote character is the escape character, then check if the next character is the escape character
						if (quoteChar === escapeChar &&  input[quoteSearch + 1] === escapeChar)
						{
							quoteSearch++;
							continue;
						}

						// If the quote character is not the escape character, then check if the previous character was the escape character
						if (quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar)
						{
							continue;
						}

						var spacesBetweenQuoteAndDelimiter = extraSpaces(nextDelim);

						// Closing quote followed by delimiter or 'unnecessary steps + delimiter'
						if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter] === delim)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);

						// Closing quote followed by newline or 'unnecessary spaces + newLine'
						if (input.substr(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, newlineLen) === newline)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}

							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}


						// Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
						errors.push({
							type: 'Quotes',
							code: 'InvalidQuotes',
							message: 'Trailing quote on quoted field is malformed',
							row: data.length,	// row has yet to be inserted
							index: cursor
						});

						quoteSearch++;
						continue;

					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
             * checks if there are extra spaces after closing quote and given index without any text
             * if Yes, returns the number of spaces
             */
			function extraSpaces(index) {
				var spaceLength = 0;
				if (index !== -1) {
					var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
					if (textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === '') {
						spaceLength = textBetweenClosingQuoteAndIndex.length;
					}
				}
				return spaceLength;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substr(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [];
				errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			);
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw 'Not implemented.';
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object' || obj === null)
			return obj;
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));

/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  /*if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }*/
  global.__SHA256_LIB = exports.sha256;
})();

/*
 * [js-sha512]{@link https://github.com/emn178/js-sha512}
 *
 * @version 0.7.1
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA512_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA512_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA512_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA512_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428A2F98, 0xD728AE22, 0x71374491, 0x23EF65CD,
    0xB5C0FBCF, 0xEC4D3B2F, 0xE9B5DBA5, 0x8189DBBC,
    0x3956C25B, 0xF348B538, 0x59F111F1, 0xB605D019,
    0x923F82A4, 0xAF194F9B, 0xAB1C5ED5, 0xDA6D8118,
    0xD807AA98, 0xA3030242, 0x12835B01, 0x45706FBE,
    0x243185BE, 0x4EE4B28C, 0x550C7DC3, 0xD5FFB4E2,
    0x72BE5D74, 0xF27B896F, 0x80DEB1FE, 0x3B1696B1,
    0x9BDC06A7, 0x25C71235, 0xC19BF174, 0xCF692694,
    0xE49B69C1, 0x9EF14AD2, 0xEFBE4786, 0x384F25E3,
    0x0FC19DC6, 0x8B8CD5B5, 0x240CA1CC, 0x77AC9C65,
    0x2DE92C6F, 0x592B0275, 0x4A7484AA, 0x6EA6E483,
    0x5CB0A9DC, 0xBD41FBD4, 0x76F988DA, 0x831153B5,
    0x983E5152, 0xEE66DFAB, 0xA831C66D, 0x2DB43210,
    0xB00327C8, 0x98FB213F, 0xBF597FC7, 0xBEEF0EE4,
    0xC6E00BF3, 0x3DA88FC2, 0xD5A79147, 0x930AA725,
    0x06CA6351, 0xE003826F, 0x14292967, 0x0A0E6E70,
    0x27B70A85, 0x46D22FFC, 0x2E1B2138, 0x5C26C926,
    0x4D2C6DFC, 0x5AC42AED, 0x53380D13, 0x9D95B3DF,
    0x650A7354, 0x8BAF63DE, 0x766A0ABB, 0x3C77B2A8,
    0x81C2C92E, 0x47EDAEE6, 0x92722C85, 0x1482353B,
    0xA2BFE8A1, 0x4CF10364, 0xA81A664B, 0xBC423001,
    0xC24B8B70, 0xD0F89791, 0xC76C51A3, 0x0654BE30,
    0xD192E819, 0xD6EF5218, 0xD6990624, 0x5565A910,
    0xF40E3585, 0x5771202A, 0x106AA070, 0x32BBD1B8,
    0x19A4C116, 0xB8D2D0C8, 0x1E376C08, 0x5141AB53,
    0x2748774C, 0xDF8EEB99, 0x34B0BCB5, 0xE19B48A8,
    0x391C0CB3, 0xC5C95A63, 0x4ED8AA4A, 0xE3418ACB,
    0x5B9CCA4F, 0x7763E373, 0x682E6FF3, 0xD6B2B8A3,
    0x748F82EE, 0x5DEFB2FC, 0x78A5636F, 0x43172F60,
    0x84C87814, 0xA1F0AB72, 0x8CC70208, 0x1A6439EC,
    0x90BEFFFA, 0x23631E28, 0xA4506CEB, 0xDE82BDE9,
    0xBEF9A3F7, 0xB2C67915, 0xC67178F2, 0xE372532B,
    0xCA273ECE, 0xEA26619C, 0xD186B8C7, 0x21C0C207,
    0xEADA7DD6, 0xCDE0EB1E, 0xF57D4F7F, 0xEE6ED178,
    0x06F067AA, 0x72176FBA, 0x0A637DC5, 0xA2C898A6,
    0x113F9804, 0xBEF90DAE, 0x1B710B35, 0x131C471B,
    0x28DB77F5, 0x23047D84, 0x32CAAB7B, 0x40C72493,
    0x3C9EBE0A, 0x15C9BEBC, 0x431D67C4, 0x9C100D4C,
    0x4CC5D4BE, 0xCB3E42B6, 0x597F299C, 0xFC657E2A,
    0x5FCB6FAB, 0x3AD6FAEC, 0x6C44198C, 0x4A475817
  ];

  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA512_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA512_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, bits) {
    return function (message) {
      return new Sha512(bits, true).update(message)[outputType]();
    };
  };

  var createMethod = function (bits) {
    var method = createOutputMethod('hex', bits);
    method.create = function () {
      return new Sha512(bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, bits);
    }
    return method;
  };

  var createHmacOutputMethod = function (outputType, bits) {
    return function (key, message) {
      return new HmacSha512(key, bits, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (bits) {
    var method = createHmacOutputMethod('hex', bits);
    method.create = function (key) {
      return new HmacSha512(key, bits);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, bits);
    }
    return method;
  };

  function Sha512(bits, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[1] = blocks[2] = blocks[3] = blocks[4] =
      blocks[5] = blocks[6] = blocks[7] = blocks[8] =
      blocks[9] = blocks[10] = blocks[11] = blocks[12] =
      blocks[13] = blocks[14] = blocks[15] = blocks[16] =
      blocks[17] = blocks[18] = blocks[19] = blocks[20] =
      blocks[21] = blocks[22] = blocks[23] = blocks[24] =
      blocks[25] = blocks[26] = blocks[27] = blocks[28] =
      blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (bits == 384) {
      this.h0h = 0xCBBB9D5D;
      this.h0l = 0xC1059ED8;
      this.h1h = 0x629A292A;
      this.h1l = 0x367CD507;
      this.h2h = 0x9159015A;
      this.h2l = 0x3070DD17;
      this.h3h = 0x152FECD8;
      this.h3l = 0xF70E5939;
      this.h4h = 0x67332667;
      this.h4l = 0xFFC00B31;
      this.h5h = 0x8EB44A87;
      this.h5l = 0x68581511;
      this.h6h = 0xDB0C2E0D;
      this.h6l = 0x64F98FA7;
      this.h7h = 0x47B5481D;
      this.h7l = 0xBEFA4FA4;
    } else if (bits == 256) {
      this.h0h = 0x22312194;
      this.h0l = 0xFC2BF72C;
      this.h1h = 0x9F555FA3;
      this.h1l = 0xC84C64C2;
      this.h2h = 0x2393B86B;
      this.h2l = 0x6F53B151;
      this.h3h = 0x96387719;
      this.h3l = 0x5940EABD;
      this.h4h = 0x96283EE2;
      this.h4l = 0xA88EFFE3;
      this.h5h = 0xBE5E1E25;
      this.h5l = 0x53863992;
      this.h6h = 0x2B0199FC;
      this.h6l = 0x2C85B8AA;
      this.h7h = 0x0EB72DDC;
      this.h7l = 0x81C52CA2;
    } else if (bits == 224) {
      this.h0h = 0x8C3D37C8;
      this.h0l = 0x19544DA2;
      this.h1h = 0x73E19966;
      this.h1l = 0x89DCD4D6;
      this.h2h = 0x1DFAB7AE;
      this.h2l = 0x32FF9C82;
      this.h3h = 0x679DD514;
      this.h3l = 0x582F9FCF;
      this.h4h = 0x0F6D2B69;
      this.h4l = 0x7BD44DA8;
      this.h5h = 0x77E36F73;
      this.h5l = 0x04C48942;
      this.h6h = 0x3F9D85A8;
      this.h6l = 0x6A1D36C8;
      this.h7h = 0x1112E6AD;
      this.h7l = 0x91D692A1;
    } else { // 512
      this.h0h = 0x6A09E667;
      this.h0l = 0xF3BCC908;
      this.h1h = 0xBB67AE85;
      this.h1l = 0x84CAA73B;
      this.h2h = 0x3C6EF372;
      this.h2l = 0xFE94F82B;
      this.h3h = 0xA54FF53A;
      this.h3l = 0x5F1D36F1;
      this.h4h = 0x510E527F;
      this.h4l = 0xADE682D1;
      this.h5h = 0x9B05688C;
      this.h5l = 0x2B3E6C1F;
      this.h6h = 0x1F83D9AB;
      this.h6l = 0xFB41BD6B;
      this.h7h = 0x5BE0CD19;
      this.h7l = 0x137E2179;
    }
    this.bits = bits;

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
  }

  Sha512.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw ERROR;
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw ERROR;
          }
        }
      } else {
        throw ERROR;
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[1] = blocks[2] = blocks[3] = blocks[4] =
        blocks[5] = blocks[6] = blocks[7] = blocks[8] =
        blocks[9] = blocks[10] = blocks[11] = blocks[12] =
        blocks[13] = blocks[14] = blocks[15] = blocks[16] =
        blocks[17] = blocks[18] = blocks[19] = blocks[20] =
        blocks[21] = blocks[22] = blocks[23] = blocks[24] =
        blocks[25] = blocks[26] = blocks[27] = blocks[28] =
        blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
      }

      if(notString) {
        for (i = this.start; index < length && i < 128; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 128; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 128) {
        this.block = blocks[32];
        this.start = i - 128;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha512.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[32] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[32];
    if (i >= 112) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[1] = blocks[2] = blocks[3] = blocks[4] =
      blocks[5] = blocks[6] = blocks[7] = blocks[8] =
      blocks[9] = blocks[10] = blocks[11] = blocks[12] =
      blocks[13] = blocks[14] = blocks[15] = blocks[16] =
      blocks[17] = blocks[18] = blocks[19] = blocks[20] =
      blocks[21] = blocks[22] = blocks[23] = blocks[24] =
      blocks[25] = blocks[26] = blocks[27] = blocks[28] =
      blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
    }
    blocks[30] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[31] = this.bytes << 3;
    this.hash();
  };

  Sha512.prototype.hash = function () {
    var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
      h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
      h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
      h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
      blocks = this.blocks, j, s0h, s0l, s1h, s1l, c1, c2, c3, c4,
      abh, abl, dah, dal, cdh, cdl, bch, bcl,
      majh, majl, t1h, t1l, t2h, t2l, chh, chl;

    for (j = 32; j < 160; j += 2) {
      t1h = blocks[j - 30];
      t1l = blocks[j - 29];
      s0h = ((t1h >>> 1) | (t1l << 31)) ^ ((t1h >>> 8) | (t1l << 24)) ^ (t1h >>> 7);
      s0l = ((t1l >>> 1) | (t1h << 31)) ^ ((t1l >>> 8) | (t1h << 24)) ^ ((t1l >>> 7) | t1h << 25);

      t1h = blocks[j - 4];
      t1l = blocks[j - 3];
      s1h = ((t1h >>> 19) | (t1l << 13)) ^ ((t1l >>> 29) | (t1h << 3)) ^ (t1h >>> 6);
      s1l = ((t1l >>> 19) | (t1h << 13)) ^ ((t1h >>> 29) | (t1l << 3)) ^ ((t1l >>> 6) | t1h << 26);

      t1h = blocks[j - 32];
      t1l = blocks[j - 31];
      t2h = blocks[j - 14];
      t2l = blocks[j - 13];

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (s0l & 0xFFFF) + (s1l & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (s0l >>> 16) + (s1l >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (s0h & 0xFFFF) + (s1h & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (s0h >>> 16) + (s1h >>> 16) + (c3 >>> 16);

      blocks[j] = (c4 << 16) | (c3 & 0xFFFF);
      blocks[j + 1] = (c2 << 16) | (c1 & 0xFFFF);
    }

    var ah = h0h, al = h0l, bh = h1h, bl = h1l, ch = h2h, cl = h2l, dh = h3h, dl = h3l, eh = h4h, el = h4l, fh = h5h, fl = h5l, gh = h6h, gl = h6l, hh = h7h, hl = h7l;
    bch = bh & ch;
    bcl = bl & cl;
    for (j = 0; j < 160; j += 8) {
      s0h = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
      s0l = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));

      s1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
      s1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));

      abh = ah & bh;
      abl = al & bl;
      majh = abh ^ (ah & ch) ^ bch;
      majl = abl ^ (al & cl) ^ bcl;

      chh = (eh & fh) ^ (~eh & gh);
      chl = (el & fl) ^ (~el & gl);

      t1h = blocks[j];
      t1l = blocks[j + 1];
      t2h = K[j];
      t2l = K[j + 1];

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (hl & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (hl >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (hh >>> 16) + (c3 >>> 16);

      t1h = (c4 << 16) | (c3 & 0xFFFF);
      t1l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

      t2h = (c4 << 16) | (c3 & 0xFFFF);
      t2l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (dl & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (dl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (dh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (dh >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      hh = (c4 << 16) | (c3 & 0xFFFF);
      hl = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      dh = (c4 << 16) | (c3 & 0xFFFF);
      dl = (c2 << 16) | (c1 & 0xFFFF);

      s0h = ((dh >>> 28) | (dl << 4)) ^ ((dl >>> 2) | (dh << 30)) ^ ((dl >>> 7) | (dh << 25));
      s0l = ((dl >>> 28) | (dh << 4)) ^ ((dh >>> 2) | (dl << 30)) ^ ((dh >>> 7) | (dl << 25));

      s1h = ((hh >>> 14) | (hl << 18)) ^ ((hh >>> 18) | (hl << 14)) ^ ((hl >>> 9) | (hh << 23));
      s1l = ((hl >>> 14) | (hh << 18)) ^ ((hl >>> 18) | (hh << 14)) ^ ((hh >>> 9) | (hl << 23));

      dah = dh & ah;
      dal = dl & al;
      majh = dah ^ (dh & bh) ^ abh;
      majl = dal ^ (dl & bl) ^ abl;

      chh = (hh & eh) ^ (~hh & fh);
      chl = (hl & el) ^ (~hl & fl);

      t1h = blocks[j + 2];
      t1l = blocks[j + 3];
      t2h = K[j + 2];
      t2l = K[j + 3];

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (gl & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (gl >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (gh >>> 16) + (c3 >>> 16);

      t1h = (c4 << 16) | (c3 & 0xFFFF);
      t1l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

      t2h = (c4 << 16) | (c3 & 0xFFFF);
      t2l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (cl & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (cl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (ch & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (ch >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      gh = (c4 << 16) | (c3 & 0xFFFF);
      gl = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      ch = (c4 << 16) | (c3 & 0xFFFF);
      cl = (c2 << 16) | (c1 & 0xFFFF);

      s0h = ((ch >>> 28) | (cl << 4)) ^ ((cl >>> 2) | (ch << 30)) ^ ((cl >>> 7) | (ch << 25));
      s0l = ((cl >>> 28) | (ch << 4)) ^ ((ch >>> 2) | (cl << 30)) ^ ((ch >>> 7) | (cl << 25));

      s1h = ((gh >>> 14) | (gl << 18)) ^ ((gh >>> 18) | (gl << 14)) ^ ((gl >>> 9) | (gh << 23));
      s1l = ((gl >>> 14) | (gh << 18)) ^ ((gl >>> 18) | (gh << 14)) ^ ((gh >>> 9) | (gl << 23));

      cdh = ch & dh;
      cdl = cl & dl;
      majh = cdh ^ (ch & ah) ^ dah;
      majl = cdl ^ (cl & al) ^ dal;

      chh = (gh & hh) ^ (~gh & eh);
      chl = (gl & hl) ^ (~gl & el);

      t1h = blocks[j + 4];
      t1l = blocks[j + 5];
      t2h = K[j + 4];
      t2l = K[j + 5];

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (fl & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (fl >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (fh >>> 16) + (c3 >>> 16);

      t1h = (c4 << 16) | (c3 & 0xFFFF);
      t1l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

      t2h = (c4 << 16) | (c3 & 0xFFFF);
      t2l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (bl & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (bl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (bh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (bh >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      fh = (c4 << 16) | (c3 & 0xFFFF);
      fl = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      bh = (c4 << 16) | (c3 & 0xFFFF);
      bl = (c2 << 16) | (c1 & 0xFFFF);

      s0h = ((bh >>> 28) | (bl << 4)) ^ ((bl >>> 2) | (bh << 30)) ^ ((bl >>> 7) | (bh << 25));
      s0l = ((bl >>> 28) | (bh << 4)) ^ ((bh >>> 2) | (bl << 30)) ^ ((bh >>> 7) | (bl << 25));

      s1h = ((fh >>> 14) | (fl << 18)) ^ ((fh >>> 18) | (fl << 14)) ^ ((fl >>> 9) | (fh << 23));
      s1l = ((fl >>> 14) | (fh << 18)) ^ ((fl >>> 18) | (fh << 14)) ^ ((fh >>> 9) | (fl << 23));

      bch = bh & ch;
      bcl = bl & cl;
      majh = bch ^ (bh & dh) ^ cdh;
      majl = bcl ^ (bl & dl) ^ cdl;

      chh = (fh & gh) ^ (~fh & hh);
      chl = (fl & gl) ^ (~fl & hl);

      t1h = blocks[j + 6];
      t1l = blocks[j + 7];
      t2h = K[j + 6];
      t2l = K[j + 7];

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (el & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (el >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (eh >>> 16) + (c3 >>> 16);

      t1h = (c4 << 16) | (c3 & 0xFFFF);
      t1l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

      t2h = (c4 << 16) | (c3 & 0xFFFF);
      t2l = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (al & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (al >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (ah & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (ah >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      eh = (c4 << 16) | (c3 & 0xFFFF);
      el = (c2 << 16) | (c1 & 0xFFFF);

      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

      ah = (c4 << 16) | (c3 & 0xFFFF);
      al = (c2 << 16) | (c1 & 0xFFFF);
    }

    c1 = (h0l & 0xFFFF) + (al & 0xFFFF);
    c2 = (h0l >>> 16) + (al >>> 16) + (c1 >>> 16);
    c3 = (h0h & 0xFFFF) + (ah & 0xFFFF) + (c2 >>> 16);
    c4 = (h0h >>> 16) + (ah >>> 16) + (c3 >>> 16);

    this.h0h = (c4 << 16) | (c3 & 0xFFFF);
    this.h0l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h1l & 0xFFFF) + (bl & 0xFFFF);
    c2 = (h1l >>> 16) + (bl >>> 16) + (c1 >>> 16);
    c3 = (h1h & 0xFFFF) + (bh & 0xFFFF) + (c2 >>> 16);
    c4 = (h1h >>> 16) + (bh >>> 16) + (c3 >>> 16);

    this.h1h = (c4 << 16) | (c3 & 0xFFFF);
    this.h1l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h2l & 0xFFFF) + (cl & 0xFFFF);
    c2 = (h2l >>> 16) + (cl >>> 16) + (c1 >>> 16);
    c3 = (h2h & 0xFFFF) + (ch & 0xFFFF) + (c2 >>> 16);
    c4 = (h2h >>> 16) + (ch >>> 16) + (c3 >>> 16);

    this.h2h = (c4 << 16) | (c3 & 0xFFFF);
    this.h2l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h3l & 0xFFFF) + (dl & 0xFFFF);
    c2 = (h3l >>> 16) + (dl >>> 16) + (c1 >>> 16);
    c3 = (h3h & 0xFFFF) + (dh & 0xFFFF) + (c2 >>> 16);
    c4 = (h3h >>> 16) + (dh >>> 16) + (c3 >>> 16);

    this.h3h = (c4 << 16) | (c3 & 0xFFFF);
    this.h3l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h4l & 0xFFFF) + (el & 0xFFFF);
    c2 = (h4l >>> 16) + (el >>> 16) + (c1 >>> 16);
    c3 = (h4h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
    c4 = (h4h >>> 16) + (eh >>> 16) + (c3 >>> 16);

    this.h4h = (c4 << 16) | (c3 & 0xFFFF);
    this.h4l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h5l & 0xFFFF) + (fl & 0xFFFF);
    c2 = (h5l >>> 16) + (fl >>> 16) + (c1 >>> 16);
    c3 = (h5h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
    c4 = (h5h >>> 16) + (fh >>> 16) + (c3 >>> 16);

    this.h5h = (c4 << 16) | (c3 & 0xFFFF);
    this.h5l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h6l & 0xFFFF) + (gl & 0xFFFF);
    c2 = (h6l >>> 16) + (gl >>> 16) + (c1 >>> 16);
    c3 = (h6h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
    c4 = (h6h >>> 16) + (gh >>> 16) + (c3 >>> 16);

    this.h6h = (c4 << 16) | (c3 & 0xFFFF);
    this.h6l = (c2 << 16) | (c1 & 0xFFFF);

    c1 = (h7l & 0xFFFF) + (hl & 0xFFFF);
    c2 = (h7l >>> 16) + (hl >>> 16) + (c1 >>> 16);
    c3 = (h7h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
    c4 = (h7h >>> 16) + (hh >>> 16) + (c3 >>> 16);

    this.h7h = (c4 << 16) | (c3 & 0xFFFF);
    this.h7l = (c2 << 16) | (c1 & 0xFFFF);
  };

  Sha512.prototype.hex = function () {
    this.finalize();

    var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
      h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
      h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
      h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
      bits = this.bits;

    var hex = HEX_CHARS[(h0h >> 28) & 0x0F] + HEX_CHARS[(h0h >> 24) & 0x0F] +
      HEX_CHARS[(h0h >> 20) & 0x0F] + HEX_CHARS[(h0h >> 16) & 0x0F] +
      HEX_CHARS[(h0h >> 12) & 0x0F] + HEX_CHARS[(h0h >> 8) & 0x0F] +
      HEX_CHARS[(h0h >> 4) & 0x0F] + HEX_CHARS[h0h & 0x0F] +
      HEX_CHARS[(h0l >> 28) & 0x0F] + HEX_CHARS[(h0l >> 24) & 0x0F] +
      HEX_CHARS[(h0l >> 20) & 0x0F] + HEX_CHARS[(h0l >> 16) & 0x0F] +
      HEX_CHARS[(h0l >> 12) & 0x0F] + HEX_CHARS[(h0l >> 8) & 0x0F] +
      HEX_CHARS[(h0l >> 4) & 0x0F] + HEX_CHARS[h0l & 0x0F] +
      HEX_CHARS[(h1h >> 28) & 0x0F] + HEX_CHARS[(h1h >> 24) & 0x0F] +
      HEX_CHARS[(h1h >> 20) & 0x0F] + HEX_CHARS[(h1h >> 16) & 0x0F] +
      HEX_CHARS[(h1h >> 12) & 0x0F] + HEX_CHARS[(h1h >> 8) & 0x0F] +
      HEX_CHARS[(h1h >> 4) & 0x0F] + HEX_CHARS[h1h & 0x0F] +
      HEX_CHARS[(h1l >> 28) & 0x0F] + HEX_CHARS[(h1l >> 24) & 0x0F] +
      HEX_CHARS[(h1l >> 20) & 0x0F] + HEX_CHARS[(h1l >> 16) & 0x0F] +
      HEX_CHARS[(h1l >> 12) & 0x0F] + HEX_CHARS[(h1l >> 8) & 0x0F] +
      HEX_CHARS[(h1l >> 4) & 0x0F] + HEX_CHARS[h1l & 0x0F] +
      HEX_CHARS[(h2h >> 28) & 0x0F] + HEX_CHARS[(h2h >> 24) & 0x0F] +
      HEX_CHARS[(h2h >> 20) & 0x0F] + HEX_CHARS[(h2h >> 16) & 0x0F] +
      HEX_CHARS[(h2h >> 12) & 0x0F] + HEX_CHARS[(h2h >> 8) & 0x0F] +
      HEX_CHARS[(h2h >> 4) & 0x0F] + HEX_CHARS[h2h & 0x0F] +
      HEX_CHARS[(h2l >> 28) & 0x0F] + HEX_CHARS[(h2l >> 24) & 0x0F] +
      HEX_CHARS[(h2l >> 20) & 0x0F] + HEX_CHARS[(h2l >> 16) & 0x0F] +
      HEX_CHARS[(h2l >> 12) & 0x0F] + HEX_CHARS[(h2l >> 8) & 0x0F] +
      HEX_CHARS[(h2l >> 4) & 0x0F] + HEX_CHARS[h2l & 0x0F] +
      HEX_CHARS[(h3h >> 28) & 0x0F] + HEX_CHARS[(h3h >> 24) & 0x0F] +
      HEX_CHARS[(h3h >> 20) & 0x0F] + HEX_CHARS[(h3h >> 16) & 0x0F] +
      HEX_CHARS[(h3h >> 12) & 0x0F] + HEX_CHARS[(h3h >> 8) & 0x0F] +
      HEX_CHARS[(h3h >> 4) & 0x0F] + HEX_CHARS[h3h & 0x0F];
    if (bits >= 256) {
      hex += HEX_CHARS[(h3l >> 28) & 0x0F] + HEX_CHARS[(h3l >> 24) & 0x0F] +
        HEX_CHARS[(h3l >> 20) & 0x0F] + HEX_CHARS[(h3l >> 16) & 0x0F] +
        HEX_CHARS[(h3l >> 12) & 0x0F] + HEX_CHARS[(h3l >> 8) & 0x0F] +
        HEX_CHARS[(h3l >> 4) & 0x0F] + HEX_CHARS[h3l & 0x0F];
    }
    if (bits >= 384) {
      hex += HEX_CHARS[(h4h >> 28) & 0x0F] + HEX_CHARS[(h4h >> 24) & 0x0F] +
        HEX_CHARS[(h4h >> 20) & 0x0F] + HEX_CHARS[(h4h >> 16) & 0x0F] +
        HEX_CHARS[(h4h >> 12) & 0x0F] + HEX_CHARS[(h4h >> 8) & 0x0F] +
        HEX_CHARS[(h4h >> 4) & 0x0F] + HEX_CHARS[h4h & 0x0F] +
        HEX_CHARS[(h4l >> 28) & 0x0F] + HEX_CHARS[(h4l >> 24) & 0x0F] +
        HEX_CHARS[(h4l >> 20) & 0x0F] + HEX_CHARS[(h4l >> 16) & 0x0F] +
        HEX_CHARS[(h4l >> 12) & 0x0F] + HEX_CHARS[(h4l >> 8) & 0x0F] +
        HEX_CHARS[(h4l >> 4) & 0x0F] + HEX_CHARS[h4l & 0x0F] +
        HEX_CHARS[(h5h >> 28) & 0x0F] + HEX_CHARS[(h5h >> 24) & 0x0F] +
        HEX_CHARS[(h5h >> 20) & 0x0F] + HEX_CHARS[(h5h >> 16) & 0x0F] +
        HEX_CHARS[(h5h >> 12) & 0x0F] + HEX_CHARS[(h5h >> 8) & 0x0F] +
        HEX_CHARS[(h5h >> 4) & 0x0F] + HEX_CHARS[h5h & 0x0F] +
        HEX_CHARS[(h5l >> 28) & 0x0F] + HEX_CHARS[(h5l >> 24) & 0x0F] +
        HEX_CHARS[(h5l >> 20) & 0x0F] + HEX_CHARS[(h5l >> 16) & 0x0F] +
        HEX_CHARS[(h5l >> 12) & 0x0F] + HEX_CHARS[(h5l >> 8) & 0x0F] +
        HEX_CHARS[(h5l >> 4) & 0x0F] + HEX_CHARS[h5l & 0x0F];
    }
    if (bits == 512) {
      hex += HEX_CHARS[(h6h >> 28) & 0x0F] + HEX_CHARS[(h6h >> 24) & 0x0F] +
        HEX_CHARS[(h6h >> 20) & 0x0F] + HEX_CHARS[(h6h >> 16) & 0x0F] +
        HEX_CHARS[(h6h >> 12) & 0x0F] + HEX_CHARS[(h6h >> 8) & 0x0F] +
        HEX_CHARS[(h6h >> 4) & 0x0F] + HEX_CHARS[h6h & 0x0F] +
        HEX_CHARS[(h6l >> 28) & 0x0F] + HEX_CHARS[(h6l >> 24) & 0x0F] +
        HEX_CHARS[(h6l >> 20) & 0x0F] + HEX_CHARS[(h6l >> 16) & 0x0F] +
        HEX_CHARS[(h6l >> 12) & 0x0F] + HEX_CHARS[(h6l >> 8) & 0x0F] +
        HEX_CHARS[(h6l >> 4) & 0x0F] + HEX_CHARS[h6l & 0x0F] +
        HEX_CHARS[(h7h >> 28) & 0x0F] + HEX_CHARS[(h7h >> 24) & 0x0F] +
        HEX_CHARS[(h7h >> 20) & 0x0F] + HEX_CHARS[(h7h >> 16) & 0x0F] +
        HEX_CHARS[(h7h >> 12) & 0x0F] + HEX_CHARS[(h7h >> 8) & 0x0F] +
        HEX_CHARS[(h7h >> 4) & 0x0F] + HEX_CHARS[h7h & 0x0F] +
        HEX_CHARS[(h7l >> 28) & 0x0F] + HEX_CHARS[(h7l >> 24) & 0x0F] +
        HEX_CHARS[(h7l >> 20) & 0x0F] + HEX_CHARS[(h7l >> 16) & 0x0F] +
        HEX_CHARS[(h7l >> 12) & 0x0F] + HEX_CHARS[(h7l >> 8) & 0x0F] +
        HEX_CHARS[(h7l >> 4) & 0x0F] + HEX_CHARS[h7l & 0x0F];
    }
    return hex;
  };

  Sha512.prototype.toString = Sha512.prototype.hex;

  Sha512.prototype.digest = function () {
    this.finalize();

    var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
      h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
      h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
      h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
      bits = this.bits;

    var arr = [
      (h0h >> 24) & 0xFF, (h0h >> 16) & 0xFF, (h0h >> 8) & 0xFF, h0h & 0xFF,
      (h0l >> 24) & 0xFF, (h0l >> 16) & 0xFF, (h0l >> 8) & 0xFF, h0l & 0xFF,
      (h1h >> 24) & 0xFF, (h1h >> 16) & 0xFF, (h1h >> 8) & 0xFF, h1h & 0xFF,
      (h1l >> 24) & 0xFF, (h1l >> 16) & 0xFF, (h1l >> 8) & 0xFF, h1l & 0xFF,
      (h2h >> 24) & 0xFF, (h2h >> 16) & 0xFF, (h2h >> 8) & 0xFF, h2h & 0xFF,
      (h2l >> 24) & 0xFF, (h2l >> 16) & 0xFF, (h2l >> 8) & 0xFF, h2l & 0xFF,
      (h3h >> 24) & 0xFF, (h3h >> 16) & 0xFF, (h3h >> 8) & 0xFF, h3h & 0xFF
    ];

    if (bits >= 256) {
      arr.push((h3l >> 24) & 0xFF, (h3l >> 16) & 0xFF, (h3l >> 8) & 0xFF, h3l & 0xFF);
    }
    if (bits >= 384) {
      arr.push(
        (h4h >> 24) & 0xFF, (h4h >> 16) & 0xFF, (h4h >> 8) & 0xFF, h4h & 0xFF,
        (h4l >> 24) & 0xFF, (h4l >> 16) & 0xFF, (h4l >> 8) & 0xFF, h4l & 0xFF,
        (h5h >> 24) & 0xFF, (h5h >> 16) & 0xFF, (h5h >> 8) & 0xFF, h5h & 0xFF,
        (h5l >> 24) & 0xFF, (h5l >> 16) & 0xFF, (h5l >> 8) & 0xFF, h5l & 0xFF
      );
    }
    if (bits == 512) {
      arr.push(
        (h6h >> 24) & 0xFF, (h6h >> 16) & 0xFF, (h6h >> 8) & 0xFF, h6h & 0xFF,
        (h6l >> 24) & 0xFF, (h6l >> 16) & 0xFF, (h6l >> 8) & 0xFF, h6l & 0xFF,
        (h7h >> 24) & 0xFF, (h7h >> 16) & 0xFF, (h7h >> 8) & 0xFF, h7h & 0xFF,
        (h7l >> 24) & 0xFF, (h7l >> 16) & 0xFF, (h7l >> 8) & 0xFF, h7l & 0xFF
      );
    }
    return arr;
  };

  Sha512.prototype.array = Sha512.prototype.digest;

  Sha512.prototype.arrayBuffer = function () {
    this.finalize();

    var bits = this.bits;
    var buffer = new ArrayBuffer(bits / 8);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0h);
    dataView.setUint32(4, this.h0l);
    dataView.setUint32(8, this.h1h);
    dataView.setUint32(12, this.h1l);
    dataView.setUint32(16, this.h2h);
    dataView.setUint32(20, this.h2l);
    dataView.setUint32(24, this.h3h);

    if (bits >= 256) {
      dataView.setUint32(28, this.h3l);
    }
    if (bits >= 384) {
      dataView.setUint32(32, this.h4h);
      dataView.setUint32(36, this.h4l);
      dataView.setUint32(40, this.h5h);
      dataView.setUint32(44, this.h5l);
    }
    if (bits == 512) {
      dataView.setUint32(48, this.h6h);
      dataView.setUint32(52, this.h6l);
      dataView.setUint32(56, this.h7h);
      dataView.setUint32(60, this.h7l);
    }
    return buffer;
  };

  function HmacSha512(key, bits, sharedMemory) {
    var notString, type = typeof key;
    if (type !== 'string') {
      if (type === 'object') {
        if (key === null) {
          throw ERROR;
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw ERROR;
          }
        }
      } else {
        throw ERROR;
      }
      notString = true;
    }
    var length = key.length;
    if (!notString) {
      var bytes = [], length = key.length, index = 0, code;
      for (var i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    }

    if (key.length > 128) {
      key = (new Sha512(bits, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (var i = 0; i < 128; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha512.call(this, bits, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha512.prototype = new Sha512();

  HmacSha512.prototype.finalize = function () {
    Sha512.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha512.call(this, this.bits, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha512.prototype.finalize.call(this);
    }
  };

  var exports = createMethod(512);
  exports.sha512 = exports;
  exports.sha384 = createMethod(384);
  exports.sha512_256 = createMethod(256);
  exports.sha512_224 = createMethod(224);
  exports.sha512.hmac = createHmacMethod(512);
  exports.sha384.hmac = createHmacMethod(384);
  exports.sha512_256.hmac = createHmacMethod(256);
  exports.sha512_224.hmac = createHmacMethod(224);

  /*if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha512 = exports.sha512;
    root.sha384 = exports.sha384;
    root.sha512_256 = exports.sha512_256;
    root.sha512_224 = exports.sha512_224;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }*/
  global.__SHA512_LIB = exports.sha512;
})();

/*
 * 클래스를 생성합니다.
 */
global.CLASS = METHOD((m) => {

	let instanceCount = 0;

	let getNextInstanceId = m.getNextInstanceId = () => {

		instanceCount += 1;

		return instanceCount - 1;
	};

	return {

		run: (define) => {
			//REQUIRED: define	클래스 정의 구문

			let funcs;

			let preset;
			let init;
			let _params;
			let afterInit;

			let cls = (params, funcs) => {
				//OPTIONAL: params
				//OPTIONAL: funcs

				// inner (protected)
				let inner = {};

				// self (public)
				let self = {

					type: cls,

					id: getNextInstanceId(),

					checkIsInstanceOf: (checkCls) => {

						let targetCls = cls;

						// check moms.
						while (targetCls !== undefined) {

							if (targetCls === checkCls) {
								return true;
							}

							targetCls = targetCls.mom;
						}

						return false;
					}
				};

				params = innerInit(inner, self, params, funcs);

				innerAfterInit(inner, self, params, funcs);

				return self;
			};

			if (typeof define === 'function') {
				funcs = define(cls);
			} else {
				funcs = define;
			}

			if (funcs !== undefined) {
				preset = funcs.preset;
				init = funcs.init;
				_params = funcs.params;
				afterInit = funcs.afterInit;
			}

			cls.type = CLASS;
			cls.id = getNextInstanceId();

			let innerInit = cls.innerInit = (inner, self, params, funcs) => {
				//REQUIRED: inner
				//REQUIRED: self
				//OPTIONAL: params
				//OPTIONAL: funcs

				// mom (parent class)
				let mom;

				let paramValue;

				let extend = (params, tempParams) => {

					EACH(tempParams, (value, name) => {

						if (params[name] === undefined) {
							params[name] = value;
						} else if (CHECK_IS_DATA(params[name]) === true && CHECK_IS_DATA(value) === true) {
							extend(params[name], value);
						}
					});
				};

				// init params.
				if (_params !== undefined) {

					if (params === undefined) {
						params = _params(cls);
					}

					else if (CHECK_IS_DATA(params) === true) {

						let tempParams = _params(cls);

						if (tempParams !== undefined) {
							extend(params, tempParams);
						}
					}

					else {
						paramValue = params;
						params = _params(cls);
					}
				}

				if (preset !== undefined) {

					mom = preset(params, funcs);

					if (mom !== undefined) {

						cls.mom = mom;

						// when mom's type is CLASS
						if (mom.type === CLASS) {
							mom.innerInit(inner, self, params, funcs);
						}

						// when mom's type is OBJECT
						else {
							mom.type.innerInit(inner, self, params, funcs);
						}
					}
				}

				if (init !== undefined) {
					init(inner, self, paramValue === undefined ? params : paramValue, funcs);
				}

				return params;
			};

			let innerAfterInit = cls.innerAfterInit = (inner, self, params, funcs) => {
				//REQUIRED: inner
				//REQUIRED: self
				//OPTIONAL: params
				//OPTIONAL: funcs

				let mom = cls.mom;

				// when mom exists, run mom's after init.
				if (mom !== undefined) {

					// when mom's type is CLASS
					if (mom.type === CLASS) {
						mom.innerAfterInit(inner, self, params, funcs);
					}

					// when mon's type is OBJECT
					else {
						mom.type.innerAfterInit(inner, self, params, funcs);
					}
				}

				if (afterInit !== undefined) {
					afterInit(inner, self, params, funcs);
				}
			};

			return cls;
		}
	};
});

/*
 * 모든 정의된 싱글톤 객체의 초기화를 수행합니다.
 */
global.INIT_OBJECTS = METHOD({

	run: () => {

		OBJECT.initObjects();
	}
});

/*
 * 싱글톤 객체를 생성합니다.
 */
global.OBJECT = METHOD((m) => {

	let readyObjects = [];
	let isInited = false;

	let initObject = (object) => {
		//REQUIRED: object	초기화 할 싱글톤 객체

		let cls = object.type;
		let inner = {};
		let params = {};

		// set id.
		object.id = CLASS.getNextInstanceId();

		cls.innerInit(inner, object, params);
		cls.innerAfterInit(inner, object, params);
	};

	let addReadyObject = (object) => {
		//REQUIRED: object	초기화를 대기시킬 싱글톤 객체

		if (isInited === true) {
			initObject(object);
		} else {
			readyObjects.push(object);
		}
	};

	let removeReadyObject = m.removeReadyObject = (object) => {
		//REQUIRED: object	대기열에서 삭제할 싱글톤 객체

		REMOVE({
			array: readyObjects,
			value: object
		});
	};

	let initObjects = m.initObjects = () => {

		// init all objects.
		EACH(readyObjects, (object) => {
			initObject(object);
		});

		isInited = true;
	};

	return {

		run: (define) => {
			//REQUIRED: define	클래스 정의 구문

			let cls = CLASS(define);

			let self = {

				type: cls,

				checkIsInstanceOf: (checkCls) => {

					let targetCls = cls;

					// check moms.
					while (targetCls !== undefined) {

						if (targetCls === checkCls) {
							return true;
						}

						targetCls = targetCls.mom;
					}

					return false;
				}
			};

			addReadyObject(self);

			return self;
		}
	};
});

/*
 * 주어진 비동기 함수들을 순서대로 실행합니다.
 */
global.NEXT = METHOD({

	run: (dataOrArrayOrCount, funcOrFuncs) => {
		//OPTIONAL: dataOrArrayOrCount
		//REQUIRED: funcOrFuncs

		let data;
		let dataKeys;
		let array;
		let count;

		let f;

		if (funcOrFuncs === undefined) {
			funcOrFuncs = dataOrArrayOrCount;
			dataOrArrayOrCount = undefined;
		}

		if (dataOrArrayOrCount !== undefined) {
			if (CHECK_IS_DATA(dataOrArrayOrCount) === true) {
				data = dataOrArrayOrCount;
			} else if (CHECK_IS_ARRAY(dataOrArrayOrCount) === true) {
				array = dataOrArrayOrCount;
			} else {
				count = dataOrArrayOrCount;
			}
		}

		if (data !== undefined) {
			dataKeys = [];

			EACH(data, (value, key) => {
				dataKeys.push(key);
			});
		}

		let funcs;
		if (CHECK_IS_ARRAY(funcOrFuncs) !== true) {
			funcs = [funcOrFuncs];
		} else {
			funcs = funcOrFuncs;
		}

		REPEAT({
			start: funcs.length - 1,
			end: 0
		}, (i) => {

			let next;

			// get last function.
			if (i !== 0 && f === undefined) {
				f = funcs[i]();
			}

			// pass next function.
			else if (i > 0) {

				next = f;

				f = funcs[i](next);

				f.next = next;
			}

			// run first function.
			else {

				next = f;

				// when next not exists, next is empty function.
				if (next === undefined) {
					next = () => {
						// ignore.
					};
				}

				f = funcs[i];

				if (count !== undefined) {

					let i = -1;

					RUN((self) => {

						i += 1;

						if (i + 1 < count) {
							f(i, self);
						} else {
							f(i, next);
						}
					});
				}

				else if (array !== undefined) {

					let length = array.length;

					if (length === 0) {
						next();
					}

					else {

						let i = -1;

						RUN((self) => {

							i += 1;

							if (i + 1 < length) {

								// if shrink
								if (array.length === length - 1) {
									i -= 1;
									length -= 1;
								}

								f(array[i], self, i);

							} else {
								f(array[i], next, i);
							}
						});
					}
				}

				else if (data !== undefined) {

					let length = dataKeys.length;

					if (length === 0) {
						next();
					}

					else {

						let i = -1;

						RUN((self) => {

							i += 1;

							if (i + 1 < length) {

								// if shrink
								if (dataKeys.length === length - 1) {
									i -= 1;
									length -= 1;
								}

								let key = dataKeys[i];

								f(data[key], self, key);

							} else {

								let key = dataKeys[i];

								f(data[key], next, key);
							}
						});
					}
				}

				else {
					f(next);
				}
			}
		});
	}
});

/*
 * 오버라이딩을 수행합니다.
 */
global.OVERRIDE = METHOD({

	run: (origin, func) => {
		//REQUIRED: origin	오버라이드 할 대상
		//REQUIRED: func

		// when origin is OBJECT.
		if (origin.type !== undefined && origin.type.type === CLASS) {

			// remove origin from init ready objects.
			OBJECT.removeReadyObject(origin);
		}

		func(origin);
	}
});

/*
 * 주어진 비동기 함수들을 병렬로 실행합니다.
 */
global.PARALLEL = METHOD({

	run: (dataOrArrayOrCount, funcs) => {
		//OPTIONAL: dataOrArrayOrCount
		//REQUIRED: funcs

		let doneCount = 0;

		// only funcs
		if (funcs === undefined) {
			funcs = dataOrArrayOrCount;

			let length = funcs.length - 1;

			EACH(funcs, (func, i) => {

				if (i < length) {

					func(() => {

						doneCount += 1;

						if (doneCount === length) {
							funcs[length]();
						}
					});
				}
			});
		}

		else if (dataOrArrayOrCount === undefined) {
			funcs[1]();
		}

		else if (CHECK_IS_DATA(dataOrArrayOrCount) === true) {

			let propertyCount = COUNT_PROPERTIES(dataOrArrayOrCount);

			if (propertyCount === 0) {
				funcs[1]();
			} else {

				EACH(dataOrArrayOrCount, (value, name) => {

					funcs[0](value, () => {

						doneCount += 1;

						if (doneCount === propertyCount) {
							funcs[1]();
						}
					}, name);
				});
			}
		}

		else if (CHECK_IS_ARRAY(dataOrArrayOrCount) === true) {

			if (dataOrArrayOrCount.length === 0) {
				funcs[1]();
			} else {

				EACH(dataOrArrayOrCount, (value, i) => {

					funcs[0](value, () => {

						doneCount += 1;

						if (doneCount === dataOrArrayOrCount.length) {
							funcs[1]();
						}
					}, i);
				});
			}
		}

		// when dataOrArrayOrCount is count
		else {

			if (dataOrArrayOrCount === 0) {
				funcs[1]();
			} else {

				REPEAT(dataOrArrayOrCount, (i) => {

					funcs[0](i, () => {

						doneCount += 1;

						if (doneCount === dataOrArrayOrCount) {
							funcs[1]();
						}
					});
				});
			}
		}
	}
});

/*
 * JSON 문자열을 원래 데이터나 배열, 값으로 변환합니다.
 */
global.PARSE_STR = METHOD({

	run: (dataStr) => {
		//REQUIRED: dataStr

		try {

			let data = JSON.parse(dataStr);

			if (CHECK_IS_DATA(data) === true) {
				return UNPACK_DATA(data);
			}

			else if (CHECK_IS_ARRAY(data) === true) {

				let array = [];

				EACH(data, (data) => {

					if (CHECK_IS_DATA(data) === true) {
						array.push(UNPACK_DATA(data));
					}

					else if (CHECK_IS_ARRAY(data) === true) {

						EACH(data, (v, i) => {

							if (CHECK_IS_DATA(v) === true) {
								data[i] = UNPACK_DATA(v);
							}
						});

						array.push(data);
					}

					else {
						array.push(data);
					}
				});

				return array;
			}

			else {
				return data;
			}

		} catch (e) {

			// when error, return undefined.
			return undefined;
		}
	}
});

/*
 * 알파벳 대, 소문자와 숫자로 이루어진 임의의 문자열을 생성합니다.
 */
global.RANDOM_STR = METHOD(() => {

	const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	return {

		run: (length) => {
			//REQUIRED: length

			let randomStr = '';

			REPEAT(length, () => {

				// add random character to random string.
				randomStr += CHARACTERS.charAt(RANDOM({
					limit: CHARACTERS.length
				}));
			});

			return randomStr;
		}
	};
});

/*
 * 데이터나 배열, 값을 JSON 문자열로 변환합니다.
 */
global.STRINGIFY = METHOD({

	run: (data) => {
		//REQUIRED: data

		if (CHECK_IS_DATA(data) === true) {
			return JSON.stringify(PACK_DATA(data));
		}

		else if (CHECK_IS_ARRAY(data) === true) {

			let f = (array) => {

				let newArray = [];

				EACH(array, (data) => {
					if (CHECK_IS_DATA(data) === true) {
						newArray.push(PACK_DATA(data));
					} else if (CHECK_IS_ARRAY(data) === true) {
						newArray.push(f(data));
					} else {
						newArray.push(data);
					}
				});

				return newArray;
			};

			return JSON.stringify(f(data));
		}

		else {
			return JSON.stringify(data);
		}
	}
});

/*
 * 메시지의 특정 부분들을 바꿀 수 있는 템플릿 클래스
 */
global.TEMPLATE = CLASS({

	init: (inner, self, originMessage) => {

		let messages = [originMessage];

		let replace = self.replace = (key, message) => {

			EACH(messages, (m, i) => {

				if (typeof m === 'string') {

					let keyIndex = m.indexOf(key);
					if (keyIndex !== -1) {

						let start = m.substring(0, keyIndex);
						let end = m.substring(keyIndex + key.length);

						messages.splice(i, 1, end);
						messages.splice(i, 0, message);
						messages.splice(i, 0, start);
					}
				}
			});
		};

		let getMessages = self.getMessages = () => {
			return messages;
		};
	}
});

/*
 * 테스트용 메소드입니다.
 * 
 * 테스트에 성공하거나 실패하면 콘솔에 메시지를 출력합니다.
 */
global.TEST = METHOD((m) => {

	let errorCount = 0;

	return {

		run: (name, test) => {
			//REQUIRED: name
			//REQUIRED: test

			test((bool) => {
				//REQUIRED: bool

				let temp = {};
				let line;

				if (bool === true) {
					console.log(MSG({
						ko: '[' + name + ' 테스트] 테스트를 통과하였습니다. 총 ' + errorCount + '개의 오류가 있습니다.'
					}));
				} else {

					temp.__THROW_ERROR_$$$ = () => {
						try {
							throw Error();
						} catch (error) {
							return error;
						}
					};

					line = temp.__THROW_ERROR_$$$().stack;

					if (line !== undefined) {
						line = line.substring(line.indexOf('__THROW_ERROR_$$$'));
						line = line.split('\n')[2];
						line = line.substring(line.indexOf('at '));
					}

					errorCount += 1;

					console.log(MSG({
						ko: '[' + name + ' 테스트] ' + line + '에서 오류가 발견되었습니다. 총 ' + errorCount + '개의 오류가 있습니다.'
					}));
				}
			});
		}
	};
});

/*
 * URI가 주어진 포맷에 맞는지 확인하는 URI_MATCHER 클래스
 * 
 * 포맷에 파라미터 구간을 지정할 수 있어 URI로부터 파라미터 값을 가져올 수 있습니다.
 */
global.URI_MATCHER = CLASS({

	init: (inner, self, format) => {
		//REQUIRED: format

		let Check = CLASS({

			init: (inner, self, uri) => {
				//REQUIRED: uri

				let uriParts = uri.split('/');

				let isMatched;
				let uriParams = {};

				let find = (format) => {

					let formatParts = format.split('/');

					return EACH(uriParts, (uriPart, i) => {

						let formatPart = formatParts[i];

						if (formatPart === '**') {
							isMatched = true;
							return false;
						}

						if (formatPart === undefined) {
							return false;
						}

						// find params.
						if (uriPart !== '' && formatPart.charAt(0) === '{' && formatPart.charAt(formatPart.length - 1) === '}') {
							uriParams[formatPart.substring(1, formatPart.length - 1)] = uriPart;
						} else if (formatPart !== '*' && formatPart !== uriPart) {
							return false;
						}

						if (i === uriParts.length - 1 && i < formatParts.length - 1 && formatParts[formatParts.length - 1] !== '') {
							return false;
						}

					}) === true || isMatched === true;
				};

				if (CHECK_IS_ARRAY(format) === true) {
					isMatched = EACH(format, (format) => {
						return find(format) !== true;
					}) !== true;
				} else {
					isMatched = find(format);
				}

				let checkIsMatched = self.checkIsMatched = () => {
					return isMatched;
				};

				let getURIParams = self.getURIParams = () => {
					return uriParams;
				};
			}
		});

		let check = self.check = (uri) => {
			return Check(uri);
		};
	}
});

/*
 * 범용 고유 식별자를 생성합니다.
 */
global.UUID = METHOD({

	run: () => {

		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
});

/*
 * 데이터를 검증하고, 어떤 부분이 잘못되었는지 오류를 확인할 수 있는 VALID 클래스
 */
global.VALID = CLASS((cls) => {

	let notEmpty = cls.notEmpty = (value) => {
		//REQUIRED: value

		let str = (value === undefined || value === TO_DELETE) ? '' : String(value);

		return CHECK_IS_ARRAY(value) === true || str.trim() !== '';
	};

	let regex = cls.regex = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.pattern

		let str = String(params.value);
		let pattern = params.pattern;

		let result = str.match(pattern);

		return result !== TO_DELETE && str === result[0];
	};

	let size = cls.size = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//OPTIONAL: params.min
		//REQUIRED: params.max

		let value = params.value;

		if (CHECK_IS_DATA(value) === true) {
			return false;
		}

		let str = String(value);
		let min = params.min;
		let max = params.max;

		if (min === undefined) {
			min = 0;
		}

		return min <= str.trim().length && (max === undefined || str.length <= max);
	};

	let integer = cls.integer = (value) => {
		//REQUIRED: value

		let str = String(value);

		return notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))$/) !== TO_DELETE;
	};

	let real = cls.real = (value) => {
		//REQUIRED: value

		let str = String(value);

		return notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/) !== TO_DELETE;
	};

	let bool = cls.bool = (value) => {
		//REQUIRED: value

		let str = String(value);

		return str === 'true' || str === 'false';
	};

	let date = cls.date = (value) => {
		//REQUIRED: value

		let str = String(value);
		let date = Date.parse(str);

		return isNaN(date) === false;
	};

	let min = cls.min = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.min

		let value = params.value;
		let min = params.min;

		return real(value) === true && min <= value;
	};

	let max = cls.max = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.max

		let value = params.value;
		let max = params.max;

		return real(value) === true && max >= value;
	};

	let email = cls.email = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/) !== TO_DELETE;
	};

	let png = cls.png = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^data:image\/png;base64,/) !== TO_DELETE;
	};

	let url = cls.url = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-a-z\u0080-\uffff\d{1-3}]+\.)+(?:[a-z\u0080-\uffff]+))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\u0000-\uffff~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\u0000-\uffff~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\u0000-\uffff~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\u0000-\uffff~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\u0000-\uffff~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\u0000-\uffff~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) !== TO_DELETE && value.length <= 2083;
	};

	let username = cls.username = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^[_a-zA-Z0-9\-]+$/) !== TO_DELETE;
	};

	// check is mongo id.
	let mongoId = cls.mongoId = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/[0-9a-f]{24}/) !== TO_DELETE && value.length === 24;
	};

	let one = cls.one = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.array

		let value = params.value;
		let array = params.array;

		return EACH(array, (_value) => {
			if (value === _value) {
				return false;
			}
		}) === false;
	};

	let array = cls.array = (value) => {
		//REQUIRED: value

		return CHECK_IS_ARRAY(value) === true;
	};

	let data = cls.data = (value) => {
		//REQUIRED: value

		return CHECK_IS_DATA(value) === true;
	};

	let element = cls.element = (params) => {
		//REQUIRED: params
		//REQUIRED: params.array
		//REQUIRED: params.validData
		//OPTIONAL: params.isToWash

		let array = params.array;

		let valid = VALID({
			_: params.validData
		});

		let isToWash = params.isToWash;

		return EACH(array, (value) => {
			if ((isToWash === true ? valid.checkAndWash : valid.check)({
				_: value
			}).checkHasError() === true) {
				return false;
			}
		}) === true;
	};

	let property = cls.property = (params) => {
		//REQUIRED: params
		//REQUIRED: params.data
		//REQUIRED: params.validData
		//OPTIONAL: params.isToWash

		let data = params.data;

		let valid = VALID({
			_: params.validData
		});

		let isToWash = params.isToWash;

		return EACH(data, (value) => {
			if ((isToWash === true ? valid.checkAndWash : valid.check)({
				_: value
			}).checkHasError() === true) {
				return false;
			}
		}) === true;
	};

	let detail = cls.detail = (params) => {
		//REQUIRED: params
		//REQUIRED: params.data
		//REQUIRED: params.validDataSet
		//OPTIONAL: params.isToWash
		//OPTIONAL: params.errors

		let data = params.data;
		let valid = VALID(params.validDataSet);
		let isToWash = params.isToWash;
		let errors = params.errors;

		let result = (isToWash === true ? valid.checkAndWash : valid.check)(data);

		EXTEND({
			origin: errors,
			extend: result.getErrors()
		});

		return result.checkHasError() !== true;
	};

	let equal = cls.equal = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.validValue

		let str = String(params.value);
		let validStr = String(params.validValue);

		return str === validStr;
	};

	return {

		init: (inner, self, validDataSet) => {
			//REQUIRED: validDataSet

			let Check = CLASS({

				init: (inner, self, params) => {
					//REQUIRED: params
					//REQUIRED: params.data
					//OPTIONAL: params.isToWash
					//OPTIONAL: params.isForUpdate

					let data = params.data;
					let isToWash = params.isToWash;
					let isForUpdate = params.isForUpdate;

					let hasError = false;
					let errors = {};

					EACH(validDataSet, (validData, attr) => {

						// when valid data is true, pass
						if (validData !== true) {

							EACH(validData, (validParams, name) => {

								let value = data[attr];

								if (isForUpdate === true && value === undefined) {

									// break.
									return false;
								}

								if (isToWash === true && name !== 'notEmpty' && notEmpty(value) !== true) {

									data[attr] = isForUpdate === true ? TO_DELETE : undefined;

									// continue.
									return true;
								}

								// one
								if (name === 'one') {

									if (one({
										array: validParams,
										value: value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											array: validParams,
											value: value
										};

										// break.
										return false;
									}
								}

								// element
								else if (name === 'element') {

									if (element({
										validData: validParams,
										array: value,
										isToWash: isToWash
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validData: validParams,
											array: value
										};

										// break.
										return false;
									}
								}

								// property
								else if (name === 'property') {

									if (property({
										validData: validParams,
										data: value,
										isToWash: isToWash
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validData: validParams,
											data: value
										};

										// break.
										return false;
									}
								}

								// detail
								else if (name === 'detail') {

									let subErrors = {};

									if (detail({
										validDataSet: validParams,
										data: value,
										isToWash: isToWash,
										errors: subErrors
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validDataSet: validParams,
											data: value
										};

										EACH(subErrors, (subError, subAttr) => {
											errors[attr + '.' + subAttr] = subError;
										});

										// break.
										return false;
									}
								}

								// need params
								else if (name === 'size') {

									if (cls[name](CHECK_IS_DATA(validParams) === true ? COMBINE([validParams, {
										value: value
									}]) : COMBINE([{
										min: validParams,
										max: validParams
									}, {
										value: value
									}])) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validParams: validParams,
											value: value
										};

										// break.
										return false;
									}
								}

								// regex
								else if (name === 'regex') {

									if (cls[name]({
										pattern: validParams,
										value: value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validParam: validParams,
											value: value
										};

										// break.
										return false;
									}
								}

								// min
								else if (name === 'min') {

									if (cls[name]({
										min: validParams,
										value: value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validParam: validParams,
											value: value
										};

										// break.
										return false;
									}
								}

								// max
								else if (name === 'max') {

									if (cls[name]({
										max: validParams,
										value: value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validParam: validParams,
											value: value
										};

										// break.
										return false;
									}
								}

								// equal
								else if (name === 'equal') {

									if (cls[name]({
										value: value,
										validValue: validParams
									}) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											validParam: validParams,
											value: value
										};

										// break.
										return false;
									}
								}

								// need value
								else if (validParams === true) {

									if (cls[name === 'id' ? 'mongoId' : name](value) === false) {

										hasError = true;
										errors[attr] = {
											type: name,
											value: value
										};

										// break.
										return false;
									}
								}

								if (typeof value === 'string') {

									value = value.trim();

									if (notEmpty(value) === true) {
										if (name === 'integer') {
											data[attr] = INTEGER(value);
										} else if (name === 'real') {
											data[attr] = REAL(value);
										} else if (name === 'bool') {
											data[attr] = value === 'true';
										} else if (name === 'date') {
											data[attr] = new Date(value);
										} else if (name === 'username') {
											data[attr] = value.toLowerCase();
										} else {
											data[attr] = value;
										}
									}

									else {
										data[attr] = value;
									}
								}
							});
						}
					});

					if (isToWash === true) {

						EACH(data, (value, attr) => {
							if (validDataSet[attr] === undefined) {
								delete data[attr];
							}
						});
					}

					let checkHasError = self.checkHasError = () => {
						return hasError;
					};

					let getErrors = self.getErrors = () => {
						return errors;
					};
				}
			});

			let check = self.check = (data) => {
				return Check({
					data: data
				});
			};

			let checkAndWash = self.checkAndWash = (data) => {
				return Check({
					data: data,
					isToWash: true
				});
			};

			let checkForUpdate = self.checkForUpdate = (data) => {
				return Check({
					data: data,
					isToWash: true,
					isForUpdate: true
				});
			};

			let getValidDataSet = self.getValidDataSet = () => {
				return validDataSet;
			};
		}
	};
});

/*
 * 배열 안의 모든 요소들이 동일한지 확인합니다.
 */
global.CHECK_ARE_SAME = METHOD({

	run: (array) => {
		//REQUIRED: array

		let areSame = false;

		let checkTwoSame = (a, b) => {

			if (a === b) {
				return true;
			}

			// when a, b are date
			if (a instanceof Date === true && b instanceof Date === true) {
				return a.getTime() === b.getTime();
			}

			// when a, b are regex
			else if (a instanceof RegExp === true && b instanceof RegExp === true) {
				return a.toString() === b.toString();
			}

			// when a, b are data (JS object)
			else if (CHECK_IS_DATA(a) === true && CHECK_IS_DATA(b) === true) {
				return EACH(a, (value, name) => {
					return checkTwoSame(value, b[name]);
				});
			}

			// when a, b are array
			else if (CHECK_IS_ARRAY(a) === true && CHECK_IS_ARRAY(b) === true) {
				return a.length === b.length && EACH(a, (value, i) => {
					return checkTwoSame(value, b[i]);
				});
			}

			return false;
		};

		if (array.length > 1) {

			areSame = REPEAT(array.length, (i) => {
				if (i < array.length - 1) {
					return checkTwoSame(array[i], array[i + 1]);
				} else {
					return checkTwoSame(array[i], array[0]);
				}
			});
		}

		return areSame;
	}
});

/*
 * target이 배열인지 확인합니다.
 */
global.CHECK_IS_ARRAY = METHOD({

	run: (target) => {
		//OPTIONAL: target

		if (
			target !== undefined &&
			target !== TO_DELETE &&
			typeof target === 'object' &&
			Object.prototype.toString.call(target) === '[object Array]'
		) {
			return true;
		}

		return false;
	}
});

/*
 * target이 데이터인지 확인합니다.
 */
global.CHECK_IS_DATA = METHOD({

	run: (target) => {
		//OPTIONAL: target

		if (
			target !== undefined &&
			target !== TO_DELETE &&
			CHECK_IS_ARRAY(target) !== true &&
			target instanceof Date !== true &&
			target instanceof RegExp !== true &&
			typeof target === 'object'
		) {
			return true;
		}

		return false;
	}
});

/*
 * 데이터가 아무런 값이 없는 빈 데이터({})인지 확인합니다.
 */
global.CHECK_IS_EMPTY_DATA = METHOD({

	run: (data) => {
		//REQUIRED: data

		return CHECK_ARE_SAME([data, {}]);
	}
});

/*
 * 데이터 내 값들의 개수를 반환합니다.
 */
global.COUNT_PROPERTIES = METHOD({

	run: (data) => {
		//OPTIONAL: data

		let count = 0;

		EACH(data, () => {
			count += 1;
		});

		return count;
	}
});

/*
 * 주어진 데이터의 값들 중 Date형은 정수형태로, RegExp형은 문자열 형태로 변환한 데이터를 반환합니다.
 */
global.PACK_DATA = METHOD({

	run: (data) => {
		//REQUIRED: data

		let result = COPY(data);
		let dateNames = [];
		let regexNames = [];

		EACH(result, (value, name) => {

			if (value instanceof Date === true) {

				// change to timestamp integer.
				result[name] = INTEGER(value.getTime());
				dateNames.push(name);
			}

			else if (value instanceof RegExp === true) {

				// change to string.
				result[name] = value.toString();
				regexNames.push(name);
			}

			else if (CHECK_IS_DATA(value) === true) {
				result[name] = PACK_DATA(value);
			}

			else if (CHECK_IS_ARRAY(value) === true) {

				EACH(value, (v, i) => {

					if (CHECK_IS_DATA(v) === true) {
						value[i] = PACK_DATA(v);
					}
				});
			}
		});

		result.__D = dateNames;
		result.__R = regexNames;

		return result;
	}
});

/*
 * PACK_DATA가 적용된 데이터의 값들 중 정수형태로 변환된 Date형과 문자열 형태로 변환된 RegExp형을 원래대로 되돌린 데이터를 반환합니다.
 */
global.UNPACK_DATA = METHOD({

	run: (packedData) => {
		//REQUIRED: packedData	PACK_DATA가 적용된 데이터

		let result = COPY(packedData);

		// when date property names exists
		if (result.__D !== undefined) {

			// change timestamp integer to Date type.
			EACH(result.__D, (dateName, i) => {
				result[dateName] = new Date(result[dateName]);
			});

			delete result.__D;
		}

		// when regex property names exists
		if (result.__R !== undefined) {

			// change string to RegExp type.
			EACH(result.__R, (regexName, i) => {

				let pattern = result[regexName];
				let flags;

				for (let j = pattern.length - 1; j >= 0; j -= 1) {
					if (pattern[j] === '/') {
						flags = pattern.substring(j + 1);
						pattern = pattern.substring(1, j);
						break;
					}
				}

				result[regexName] = new RegExp(pattern, flags);
			});

			delete result.__R;
		}

		EACH(result, (value, name) => {

			if (CHECK_IS_DATA(value) === true) {
				result[name] = UNPACK_DATA(value);
			}

			else if (CHECK_IS_ARRAY(value) === true) {

				EACH(value, (v, i) => {

					if (CHECK_IS_DATA(v) === true) {
						value[i] = UNPACK_DATA(v);
					}
				});
			}
		});

		return result;
	}
});

/*
 * 특정 값이 데이터나 배열에 존재하는지 확인합니다.
 */
global.CHECK_IS_IN = METHOD({

	run: (params) => {
		//REQUIRED: params
		//OPTIONAL: params.data
		//OPTIONAL: params.array
		//REQUIRED: params.value	존재하는지 확인 할 값

		let data = params.data;
		let array = params.array;
		let value = params.value;

		if (data !== undefined) {
			return EACH(data, (_value, name) => {
				if (CHECK_ARE_SAME([_value, value]) === true) {
					return false;
				}
			}) !== true;
		}

		if (array !== undefined) {
			return EACH(array, (_value, key) => {
				if (CHECK_ARE_SAME([_value, value]) === true) {
					return false;
				}
			}) !== true;
		}
	}
});

/*
 * 데이터들이나 배열들을 하나의 데이터나 배열로 합칩니다.
 */
global.COMBINE = METHOD({

	run: (dataSetOrArrays) => {
		//REQUIRED: dataSetOrArrays

		let result;

		if (dataSetOrArrays.length > 0) {

			let first = dataSetOrArrays[0];

			if (CHECK_IS_DATA(first) === true) {

				result = {};

				EACH(dataSetOrArrays, (data) => {
					EXTEND({
						origin: result,
						extend: data
					});
				});
			}

			else if (CHECK_IS_ARRAY(first) === true) {

				result = [];

				EACH(dataSetOrArrays, (array) => {
					EXTEND({
						origin: result,
						extend: array
					});
				});
			}
		}

		return result;
	}
});

/*
 * 데이터나 배열을 복제합니다.
 */
global.COPY = METHOD({

	run: (dataOrArray) => {
		//REQUIRED: dataOrArray

		let copy;

		if (CHECK_IS_DATA(dataOrArray) === true) {

			copy = {};

			EXTEND({
				origin: copy,
				extend: dataOrArray
			});
		}

		else if (CHECK_IS_ARRAY(dataOrArray) === true) {

			copy = [];

			EXTEND({
				origin: copy,
				extend: dataOrArray
			});
		}

		return copy;
	}
});

/*
 * 데이터나 배열을 덧붙혀 확장합니다.
 */
global.EXTEND = METHOD({

	run: (params) => {
		//REQUIRED: params
		//REQUIRED: params.origin	기존 데이터나 배열
		//REQUIRED: params.extend	덧붙힐 데이터나 배열

		let origin = params.origin;
		let extend = params.extend;

		if (CHECK_IS_DATA(origin) === true) {

			EACH(extend, (value, name) => {

				if (value instanceof Date === true) {
					origin[name] = new Date(value.getTime());
				}

				else if (value instanceof RegExp === true) {

					let pattern = value.toString();
					let flags;

					for (let i = pattern.length - 1; i >= 0; i -= 1) {
						if (pattern[i] === '/') {
							flags = pattern.substring(i + 1);
							pattern = pattern.substring(1, i);
							break;
						}
					}

					origin[name] = new RegExp(pattern, flags);
				}

				else if (CHECK_IS_DATA(value) === true || CHECK_IS_ARRAY(value) === true) {
					origin[name] = COPY(value);
				}

				else {
					origin[name] = value;
				}
			});
		}

		else if (CHECK_IS_ARRAY(origin) === true) {

			EACH(extend, (value) => {

				if (value instanceof Date === true) {
					origin.push(new Date(value.getTime()));
				}

				else if (value instanceof RegExp === true) {

					let pattern = value.toString();
					let flags;

					for (let i = pattern.length - 1; i >= 0; i -= 1) {
						if (pattern[i] === '/') {
							flags = pattern.substring(i + 1);
							pattern = pattern.substring(1, i);
							break;
						}
					}

					origin.push(new RegExp(pattern, flags));
				}

				else if (CHECK_IS_DATA(value) === true || CHECK_IS_ARRAY(value) === true) {
					origin.push(COPY(value));
				}

				else {
					origin.push(value);
				}
			});
		}

		return origin;
	}
});

/*
 * 데이터나 배열의 특정 값을 찾아, 데이터인 경우 그 값에 해당하는 이름을, 배열인 경우 그 값에 해당하는 키(index)를 반환합니다.
 */
global.FIND = METHOD({

	run: (dataOrArrayOrParams, filter) => {
		//REQUIRED: dataOrArrayOrParams
		//OPTIONAL: dataOrArrayOrParams.data
		//OPTIONAL: dataOrArrayOrParams.array
		//REQUIRED: dataOrArrayOrParams.value	찾을 값
		//OPTIONAL: filter

		let ret;

		if (filter !== undefined) {

			if (CHECK_IS_DATA(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, name) => {

					// value passed filter.
					if (filter(value, name) === true) {
						ret = value;
						return false;
					}
				});
			}

			else if (CHECK_IS_ARRAY(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, key) => {

					// value passed filter.
					if (filter(value, key) === true) {
						ret = value;
						return false;
					}
				});
			}
		}

		else {

			// init params.
			let data = dataOrArrayOrParams.data;
			let array = dataOrArrayOrParams.array;
			let value = dataOrArrayOrParams.value;

			if (data !== undefined) {

				EACH(data, (_value, name) => {
					if (_value === value) {
						ret = name;
						return false;
					}
				});
			}

			if (array !== undefined) {

				EACH(array, (_value, key) => {
					if (_value === value) {
						ret = key;
						return false;
					}
				});
			}
		}

		return ret;
	}
});

/*
 * 데이터나 배열의 특정 값을 삭제합니다.
 */
global.REMOVE = METHOD({

	run: (dataOrArrayOrParams, filter) => {
		//REQUIRED: dataOrArrayOrParams
		//OPTIONAL: dataOrArrayOrParams.data
		//OPTIONAL: dataOrArrayOrParams.array
		//OPTIONAL: dataOrArrayOrParams.name	데이터에서 삭제할 값의 이름
		//OPTIONAL: dataOrArrayOrParams.key		배열에서 삭제할 값의 키 (index)
		//OPTIONAL: dataOrArrayOrParams.value	삭제할 값, 이 값을 찾아 삭제합니다.
		//OPTIONAL: filter

		if (filter !== undefined) {

			if (CHECK_IS_DATA(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, name) => {

					// remove value passed filter.
					if (filter(value, name) === true) {

						REMOVE({
							data: dataOrArrayOrParams,
							name: name
						});
					}
				});
			}

			else if (CHECK_IS_ARRAY(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, key) => {

					// remove value passed filter.
					if (filter(value, key) === true) {

						REMOVE({
							array: dataOrArrayOrParams,
							key: key
						});
					}
				});
			}
		}

		else {

			// init params.
			let data = dataOrArrayOrParams.data;
			let array = dataOrArrayOrParams.array;
			let name = dataOrArrayOrParams.name;
			let key = dataOrArrayOrParams.key;
			let value = dataOrArrayOrParams.value;

			if (name !== undefined) {
				delete data[name];
			}

			if (key !== undefined) {
				array.splice(key, 1);
			}

			if (value !== undefined) {

				if (data !== undefined) {

					EACH(data, (_value, name) => {

						if (CHECK_ARE_SAME([_value, value]) === true) {

							REMOVE({
								data: data,
								name: name
							});
						}
					});
				}

				if (array !== undefined) {

					EACH(array, (_value, key) => {

						if (CHECK_ARE_SAME([_value, value]) === true) {

							REMOVE({
								array: array,
								key: key
							});
						}
					});
				}
			}
		}
	}
});

/*
 * 날짜를 처리할 때 Date형을 좀 더 쓰기 편하도록 개선한 CALENDAR 클래스
 */
global.CALENDAR = CLASS({

	init: (inner, self, date) => {
		//OPTIONAL: date	입력하지 않으면 현재 시각을 기준으로 생성합니다.

		if (date === undefined) {
			date = new Date();
		}

		let getYear = self.getYear = () => {
			return date.getFullYear();
		};

		let getMonth = self.getMonth = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09

			let month = date.getMonth() + 1;

			if (isFormal === true) {
				return month < 10 ? '0' + month : '' + month;
			} else {
				return month;
			}
		};

		let getDate = self.getDate = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09

			let d = date.getDate();

			if (isFormal === true) {
				return d < 10 ? '0' + d : '' + d;
			} else {
				return d;
			}
		};

		let getDay = self.getDay = () => {
			return date.getDay();
		};

		let getHour = self.getHour = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09

			let hour = date.getHours();

			if (isFormal === true) {
				return hour < 10 ? '0' + hour : '' + hour;
			} else {
				return hour;
			}
		};

		let getMinute = self.getMinute = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09

			let minute = date.getMinutes();

			if (isFormal === true) {
				return minute < 10 ? '0' + minute : '' + minute;
			} else {
				return minute;
			}
		};

		let getSecond = self.getSecond = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09

			let second = date.getSeconds();

			if (isFormal === true) {
				return second < 10 ? '0' + second : '' + second;
			} else {
				return second;
			}
		};
	}
});

/*
 * Date형 값을 생성합니다.
 */
global.CREATE_DATE = METHOD({

	run: (params) => {
		//REQUIRED: params
		//OPTIONAL: params.year		년
		//OPTIONAL: params.month	월
		//OPTIONAL: params.date		일
		//OPTIONAL: params.hour		시
		//OPTIONAL: params.minute	분
		//OPTIONAL: params.second	초

		let year = params.year;
		let month = params.month;
		let date = params.date;
		let hour = params.hour;
		let minute = params.minute;
		let second = params.second;

		let nowCal = CALENDAR(new Date());

		if (year === undefined) {
			year = nowCal.getYear();
		}

		if (month === undefined) {
			month = date === undefined ? 0 : nowCal.getMonth();
		}

		if (date === undefined) {
			date = hour === undefined ? 0 : nowCal.getDate();
		}

		if (hour === undefined) {
			hour = minute === undefined ? 0 : nowCal.getHour();
		}

		if (minute === undefined) {
			minute = second === undefined ? 0 : nowCal.getMinute();
		}

		if (second === undefined) {
			second = 0;
		}

		return new Date(year, month - 1, date, hour, minute, second);
	}
});

/*
 * 주어진 초가 흐른 뒤에 함수를 실행하는 DELAY 클래스
 */
global.DELAY = CLASS({

	init: (inner, self, seconds, func) => {
		//REQUIRED: seconds
		//OPTIONAL: func

		if (func === undefined) {
			func = seconds;
			seconds = 0;
		}

		let milliseconds;

		let startTime = Date.now();

		let remaining = milliseconds = seconds * 1000;

		let timeout;

		let resume = self.resume = RAR(() => {

			if (timeout === undefined) {

				timeout = setTimeout(() => {
					func();
					remove();
				}, remaining);
			}
		});

		let pause = self.pause = () => {

			remaining = milliseconds - (Date.now() - startTime);

			clearTimeout(timeout);
			timeout = undefined;
		};

		let remove = self.remove = () => {
			pause();
		};
	}
});

/*
 * 주어진 초 마다 함수를 반복해서 실행하는 INTERVAL 클래스
 */
global.INTERVAL = CLASS({

	init: (inner, self, seconds, func) => {
		//REQUIRED: seconds
		//OPTIONAL: func

		if (func === undefined) {
			func = seconds;
			seconds = 0;
		}

		let milliseconds;

		let startTime = Date.now();

		let remaining = milliseconds = seconds === 0 ? 1 : seconds * 1000;

		let interval;

		let count = 0;

		let resume = self.resume = RAR(() => {

			if (interval === undefined) {

				interval = setInterval(() => {

					count += 1;

					if (func(self, count) === false) {
						remove();
					}

					startTime = Date.now();

				}, remaining);
			}
		});

		let pause = self.pause = () => {

			remaining = milliseconds - (Date.now() - startTime);

			clearInterval(interval);
			interval = undefined;
		};

		let remove = self.remove = () => {
			pause();
		};
	}
});

/*
 * 아주 짧은 시간동안 반복해서 실행하는 로직을 작성할때 사용하는 LOOP 클래스
 */
global.LOOP = CLASS((cls) => {

	let animationInterval;

	let infos = [];

	let fire = () => {

		if (animationInterval === undefined) {

			let beforeTime = Date.now() / 1000;

			animationInterval = INTERVAL(() => {

				let time = Date.now() / 1000;
				let deltaTime = time - beforeTime;

				if (deltaTime > 0) {

					for (let i = 0; i < infos.length; i += 1) {

						let info = infos[i];

						if (info.fps !== undefined && info.fps > 0) {

							if (info.timeSigma === undefined) {
								info.timeSigma = 0;
							}

							info.timeSigma += deltaTime;

							let frameSecond = 1 / info.fps;

							if (info.timeSigma >= frameSecond) {

								info.run(frameSecond);

								info.timeSigma -= frameSecond;
							}
						}

						else {
							info.run(deltaTime);
						}
					}

					beforeTime = time;
				}
			});
		}
	};

	let stop = () => {

		if (infos.length <= 0) {

			animationInterval.remove();
			animationInterval = undefined;
		}
	};

	return {

		init: (inner, self, fps, run) => {
			//OPTIONAL: fps
			//REQUIRED: run

			if (run === undefined) {
				run = fps;
				fps = undefined;
			}

			let info;

			let resume = self.resume = RAR(() => {

				infos.push(info = {
					fps: fps,
					run: run
				});

				fire();
			});

			let pause = self.pause = () => {

				REMOVE({
					array: infos,
					value: info
				});

				stop();
			};

			let changeFPS = self.changeFPS = (fps) => {
				//REQUIRED: fps

				info.fps = fps;
			};

			let clearFPS = self.clearFPS = () => {
				delete info.fps;
			};

			let getFPS = self.getFPS = () => {
				return info.fps;
			};

			let remove = self.remove = () => {
				pause();
			};
		}
	};
});

/*
 * 비밀번호를 주어진 키를 암호화합니다. 같은 키로 한번 더 수행하면, 복호화됩니다.
 */
global.ENCRYPT = METHOD({

	run: (params) => {
		//REQUIRED: params
		//REQUIRED: params.password
		//REQUIRED: params.key

		let password = String(params.password);
		let key = String(params.key);

		let result = '';

		let keyLength = key.length;
		let keyCount = 0;
		for (let i = 0; i < password.length; i += 1) {
			result += String.fromCharCode(password.charCodeAt(i) ^ key.charCodeAt(keyCount));
			keyCount += 1;
			if (keyCount === keyLength) {
				keyCount = 0;
			}
		}

		return result;
	}
});

/*
 * 비밀번호를 주어진 키를 이용하여 HMAC SHA256 알고리즘으로 암호화합니다.
 */
global.SHA256 = METHOD({

	run: (params) => {
		//REQUIRED: params
		//REQUIRED: params.password
		//REQUIRED: params.key

		let password = String(params.password);
		let key = String(params.key);

		let hash = __SHA256_LIB.hmac.create(key);
		hash.update(password);

		return hash.hex();
	}
});

/*
 * 비밀번호를 주어진 키를 이용하여 HMAC SHA512 알고리즘으로 암호화합니다.
 */
global.SHA512 = METHOD({

	run: (params) => {
		//REQUIRED: params
		//REQUIRED: params.password
		//REQUIRED: params.key

		let password = String(params.password);
		let key = String(params.key);

		let hash = __SHA512_LIB.hmac.create(key);
		hash.update(password);

		return hash.hex();
	}
});

/*
 * 주어진 함수를 즉시 실행하고, 함수를 반환합니다.
 * 
 * 선언과 동시에 실행되어야 하는 함수를 선언할 때 유용합니다.
 */
global.RAR = METHOD({

	run: (params, func) => {
		//OPTIONAL: params
		//REQUIRED: func

		// if func is undefined, func is params.
		if (func === undefined) {
			func = params;
			params = undefined;
		}

		func(params);

		return func;
	}
});

/*
 * 주어진 함수를 즉시 실행합니다.
 */
global.RUN = METHOD({

	run: (func) => {
		//REQUIRED: func

		let f = () => {
			return func(f);
		};

		return f();
	}
});

/*
 * 정수 문자열을 정수 값으로 변환합니다.
 */
global.INTEGER = METHOD({

	run: (integerString) => {
		//OPTIONAL: integerString

		return integerString === undefined ? undefined : parseInt(integerString, 10);
	}
});

/*
 * 임의의 정수를 생성합니다.
 */
global.RANDOM = METHOD({

	run: (limitOrParams) => {
		//REQUIRED: limitOrParams
		//OPTIONAL: limitOrParams.min	생성할 정수 범위 최소값, 이 값 이상인 값만 생성합니다.
		//OPTIONAL: limitOrParams.max	생성할 정수 범위 최대값, 이 값 이하인 값만 생성합니다.
		//OPTIONAL: limitOrParams.limit	생성할 정수 범위 제한값, 이 값 미만인 값만 생성합니다.

		let min;
		let max
		let limit;

		// init limitOrParams.
		if (CHECK_IS_DATA(limitOrParams) !== true) {
			limit = limitOrParams;
		} else {
			min = limitOrParams.min;
			max = limitOrParams.max;
			limit = limitOrParams.limit;
		}

		if (min === undefined) {
			min = 0;
		}

		if (limit !== undefined) {
			max = limit - 1;
		}

		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});

/*
 * 실수 문자열을 실수 값으로 변환합니다.
 */
global.REAL = METHOD({

	run: (realNumberString) => {
		//OPTIONAL: realNumberString

		return realNumberString === undefined ? undefined : parseFloat(realNumberString);
	}
});

/*
 * 데이터나 배열, 문자열의 각 요소를 순서대로 대입하여 주어진 함수를 실행합니다.
 */
global.EACH = METHOD({

	run: (dataOrArrayOrString, func) => {
		//OPTIONAL: dataOrArrayOrString
		//REQUIRED: func

		if (dataOrArrayOrString === undefined) {
			return false;
		}

		// when dataOrArrayOrString is data
		else if (CHECK_IS_DATA(dataOrArrayOrString) === true) {

			for (let name in dataOrArrayOrString) {
				if (dataOrArrayOrString.hasOwnProperty === undefined || dataOrArrayOrString.hasOwnProperty(name) === true) {
					if (func(dataOrArrayOrString[name], name) === false) {
						return false;
					}
				}
			}
		}

		// when dataOrArrayOrString is func
		else if (func === undefined) {

			func = dataOrArrayOrString;
			dataOrArrayOrString = undefined;

			return (dataOrArrayOrString) => {
				return EACH(dataOrArrayOrString, func);
			};
		}

		// when dataOrArrayOrString is array or string
		else {

			let length = dataOrArrayOrString.length;

			for (let i = 0; i < length; i += 1) {

				if (func(dataOrArrayOrString[i], i) === false) {
					return false;
				}

				// when shrink
				if (dataOrArrayOrString.length < length) {
					i -= length - dataOrArrayOrString.length;
					length -= length - dataOrArrayOrString.length;
				}

				// when stretch
				else if (dataOrArrayOrString.length > length) {
					length += dataOrArrayOrString.length - length;
				}
			}
		}

		return true;
	}
});

/*
 * 주어진 함수를 주어진 횟수만큼 반복해서 실행합니다.
 */
global.REPEAT = METHOD({

	run: (countOrParams, func) => {
		//OPTIONAL: countOrParams
		//REQUIRED: countOrParams.start
		//OPTIONAL: countOrParams.end
		//OPTIONAL: countOrParams.limit
		//OPTIONAL: countOrParams.step
		//REQUIRED: func

		let count;
		let start;
		let end;
		let limit;
		let step;

		if (func === undefined) {
			func = countOrParams;
			countOrParams = undefined;
		}

		if (countOrParams !== undefined) {
			if (CHECK_IS_DATA(countOrParams) !== true) {
				count = countOrParams;
			} else {
				start = countOrParams.start;
				end = countOrParams.end;
				limit = countOrParams.limit;
				step = countOrParams.step;
			}
		}

		if (limit === undefined && end !== undefined) {
			limit = end + 1;
		}

		if (step === undefined) {
			step = 1;
		}

		// count mode
		if (count !== undefined) {

			for (let i = 0; i < parseInt(count, 10); i += 1) {
				if (func(i) === false) {
					return false;
				}
			}
		}

		// end mode
		else if (end !== undefined && start > end) {

			for (let i = start; i >= end; i -= step) {
				if (func(i) === false) {
					return false;
				}
			}

		}

		// limit mode
		else if (limit !== undefined) {

			for (let i = start; i < limit; i += step) {
				if (func(i) === false) {
					return false;
				}
			}
		}

		// func mode
		else {

			return (countOrParams) => {
				return REPEAT(countOrParams, func);
			};
		}

		return true;
	}
});

/*
 * 데이터나 배열, 문자열의 각 요소를 역순으로 대입하여 주어진 함수를 실행합니다.
 */
global.REVERSE_EACH = METHOD({

	run: (dataOrArrayOrString, func) => {
		//OPTIONAL: dataOrArrayOrString
		//REQUIRED: func

		if (dataOrArrayOrString === undefined) {
			return false;
		}

		// when dataOrArrayOrString is data
		else if (CHECK_IS_DATA(dataOrArrayOrString) === true) {

			let reverseNames = [];

			for (let name in dataOrArrayOrString) {
				reverseNames.push(name);
			}

			let length = reverseNames.length;

			for (let i = length - 1; i >= 0; i -= 1) {
				let name = reverseNames[i];

				if (dataOrArrayOrString.hasOwnProperty === undefined || dataOrArrayOrString.hasOwnProperty(name) === true) {
					if (func(dataOrArrayOrString[name], name) === false) {
						return false;
					}
				}
			}
		}

		// when dataOrArrayOrString is func
		else if (func === undefined) {

			func = dataOrArrayOrString;
			dataOrArrayOrString = undefined;

			return (dataOrArrayOrString) => {
				return REVERSE_EACH(dataOrArrayOrString, func);
			};
		}

		// when dataOrArrayOrString is array or string
		else {

			let length = dataOrArrayOrString.length;

			for (let i = length - 1; i >= 0; i -= 1) {

				if (func(dataOrArrayOrString[i], i) === false) {
					return false;
				}

				// when shrink
				if (dataOrArrayOrString.length < length) {
					i += length - dataOrArrayOrString.length;
				}
			}
		}

		return true;
	}
});

/*
 * 웹 폰트를 사용할 수 있도록 불러옵니다.
 */
global.ADD_FONT = METHOD({

	run: (params) => {
		//REQUIRED: params
		//REQUIRED: params.name
		//OPTIONAL: params.style
		//OPTIONAL: params.weight
		//OPTIONAL: params.woff2
		//OPTIONAL: params.woff
		//OPTIONAL: params.otf
		//OPTIONAL: params.ttf

		let name = params.name;
		let style = params.style;
		let weight = params.weight;
		let woff2 = params.woff2;
		let woff = params.woff;
		let otf = params.otf;
		let ttf = params.ttf;

		let src = '';
		if (woff2 !== undefined) {
			src += 'url(' + woff2 + ') format(\'woff2\'),';
		}
		if (woff !== undefined) {
			src += 'url(' + woff + ') format(\'woff\'),';
		}
		if (otf !== undefined) {
			src += 'url(' + otf + ') format(\'opentype\'),';
		}
		if (ttf !== undefined) {
			src += 'url(' + ttf + ') format(\'truetype\'),';
		}

		let content = '@font-face {';
		content += 'font-family:' + name + ';';

		if (style !== undefined) {
			content += 'font-style:' + style + ';';
		}
		if (weight !== undefined) {
			content += 'font-weight:' + weight + ';';
		}

		content += 'src:' + src.substring(0, src.length - 1) + ';';
		content += '}';

		// create font style element.
		let fontStyleEl = document.createElement('style');
		fontStyleEl.type = 'text/css';
		fontStyleEl.appendChild(document.createTextNode(content));
		document.getElementsByTagName('head')[0].appendChild(fontStyleEl);
	}
});

OVERRIDE(BOX, (origin) => {

	/*
	 * BOX를 생성합니다.
	 */
	global.BOX = METHOD((m) => {

		m.getAllBoxes = origin.getAllBoxes;

		return {

			run: (boxName) => {
				//REQUIRED: boxName

				if (BROWSER_CONFIG[boxName] === undefined) {
					BROWSER_CONFIG[boxName] = {};
				}

				return origin(boxName);
			}
		};
	});
});

/*
 * 웹 브라우저 환경에서의 기본 설정
 */
global.BROWSER_CONFIG = {

	isSecure: location.protocol === 'https:',

	host: location.hostname,

	port: location.port === '' ? (location.protocol === 'https:' ? 443 : 80) : INTEGER(location.port)
};

/*
 * 룸 서버에 접속합니다.
 */
global.CONNECT_TO_ROOM_SERVER = METHOD((m) => {

	const DEFAULT_ROOM_SERVER_NAME = '__';

	let enterRoomNameMap = {};
	let onInfoMap = {};
	let waitingSendInfoMap = {};
	let isConnecteds = {};
	let innerOns = {};
	let innerOffs = {};
	let innerSends = {};

	let checkIsConnected = m.checkIsConnected = (roomServerName) => {
		//OPTIONAL: roomServerName

		if (roomServerName === undefined) {
			roomServerName = DEFAULT_ROOM_SERVER_NAME;
		}

		if (isConnecteds[roomServerName] === undefined) {
			isConnecteds[roomServerName] = false;
		}

		return isConnecteds[roomServerName];
	};

	let enterRoom = m.enterRoom = (params) => {
		//REQUIRED: params
		//OPTIONAL: params.roomServerName
		//REQUIRED: params.roomName

		let roomServerName = params.roomServerName;
		let roomName = params.roomName;

		if (roomServerName === undefined) {
			roomServerName = DEFAULT_ROOM_SERVER_NAME;
		}

		let enterRoomNames = enterRoomNameMap[roomServerName];

		if (enterRoomNames === undefined) {
			enterRoomNames = enterRoomNameMap[roomServerName] = [];
		}

		enterRoomNames.push(roomName);

		if (innerSends[roomServerName] !== undefined) {
			innerSends[roomServerName]({
				methodName: '__ENTER_ROOM',
				data: roomName
			});
		}
	};

	let on = m.on = (params, method) => {
		//REQUIRED: params
		//OPTIONAL: params.roomServerName
		//REQUIRED: params.methodName
		//REQUIRED: method

		let roomServerName = params.roomServerName;
		let methodName = params.methodName;

		if (roomServerName === undefined) {
			roomServerName = DEFAULT_ROOM_SERVER_NAME;
		}

		let onInfos = onInfoMap[roomServerName];

		if (onInfos === undefined) {
			onInfos = onInfoMap[roomServerName] = [];
		}

		onInfos.push({
			methodName: methodName,
			method: method
		});

		if (innerOns[roomServerName] !== undefined) {
			innerOns[roomServerName](methodName, method);
		}
	};

	let off = m.off = (params, method) => {
		//REQUIRED: params
		//OPTIONAL: params.roomServerName
		//REQUIRED: params.methodName
		//OPTIONAL: method

		let roomServerName = params.roomServerName;
		let methodName = params.methodName;

		if (roomServerName === undefined) {
			roomServerName = DEFAULT_ROOM_SERVER_NAME;
		}

		let onInfos = onInfoMap[roomServerName];

		if (innerOffs[roomServerName] !== undefined) {
			innerOffs[roomServerName](methodName, method);
		}

		if (onInfos !== undefined) {

			if (method !== undefined) {

				REMOVE(onInfos, (onInfo) => {
					return onInfo.methodName === methodName && onInfo.method === method;
				});

			} else {

				REMOVE(onInfos, (onInfo) => {
					return onInfo.methodName === methodName;
				});
			}

			if (onInfos.length === 0) {
				delete onInfoMap[roomServerName];
			}
		}
	};

	let send = m.send = (params, callback) => {
		//REQUIRED: params
		//OPTIONAL: params.roomServerName
		//REQUIRED: params.methodName
		//REQUIRED: params.data
		//OPTIONAL: callback

		let roomServerName = params.roomServerName;
		let methodName = params.methodName;
		let data = params.data;

		if (roomServerName === undefined) {
			roomServerName = DEFAULT_ROOM_SERVER_NAME;
		}

		if (innerSends[roomServerName] === undefined) {

			let waitingSendInfos = waitingSendInfoMap[roomServerName];

			if (waitingSendInfos === undefined) {
				waitingSendInfos = waitingSendInfoMap[roomServerName] = [];
			}

			waitingSendInfos.push({
				params: {
					methodName: methodName,
					data: data
				},
				callback: callback
			});

		} else {

			innerSends[roomServerName]({
				methodName: methodName,
				data: data
			}, callback);
		}
	};

	let exitRoom = m.exitRoom = (params) => {
		//REQUIRED: params
		//OPTIONAL: params.roomServerName
		//REQUIRED: params.roomName

		let roomServerName = params.roomServerName;
		let roomName = params.roomName;

		if (roomServerName === undefined) {
			roomServerName = DEFAULT_ROOM_SERVER_NAME;
		}

		let enterRoomNames = enterRoomNameMap[roomServerName];

		if (enterRoomNames === undefined) {
			enterRoomNames = enterRoomNameMap[roomServerName] = [];
		}

		if (innerSends[roomServerName] !== undefined) {
			innerSends[roomServerName]({
				methodName: '__EXIT_ROOM',
				data: roomName
			});
		}

		EACH(enterRoomNames, (enterRoomName, key) => {

			if (enterRoomName === roomName) {

				REMOVE({
					array: enterRoomNames,
					key: key
				});

				return false;
			}
		});
	};

	return {

		run: (params, connectionListenerOrListeners) => {
			//REQUIRED: params
			//OPTIONAL: params.roomServerName
			//OPTIONAL: params.isSecure
			//OPTIONAL: params.host
			//REQUIRED: params.port
			//OPTIONAL: connectionListenerOrListeners
			//OPTIONAL: connectionListenerOrListeners.success
			//OPTIONAL: connectionListenerOrListeners.error

			let roomServerName = params.roomServerName;

			let connectionListener;
			let errorListener;

			if (roomServerName === undefined) {
				roomServerName = DEFAULT_ROOM_SERVER_NAME;
			}

			if (connectionListenerOrListeners !== undefined) {
				if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
					connectionListener = connectionListenerOrListeners;
				} else {
					connectionListener = connectionListenerOrListeners.success;
					errorListener = connectionListenerOrListeners.error;
				}
			}

			CONNECT_TO_WEB_SOCKET_SERVER({
				isSecure: params.isSecure,
				host: params.host,
				port: params.port
			}, {

				error: errorListener,

				success: (on, off, send) => {

					let enterRoomNames = enterRoomNameMap[roomServerName];
					let onInfos = onInfoMap[roomServerName];
					let waitingSendInfos = waitingSendInfoMap[roomServerName];

					innerOns[roomServerName] = on;
					innerOffs[roomServerName] = off;
					innerSends[roomServerName] = send;

					if (enterRoomNames !== undefined) {
						EACH(enterRoomNames, (roomName) => {
							send({
								methodName: '__ENTER_ROOM',
								data: roomName
							});
						});
					}

					if (onInfos !== undefined) {
						EACH(onInfos, (onInfo) => {
							on(onInfo.methodName, onInfo.method);
						});
					}

					if (waitingSendInfos !== undefined) {
						EACH(waitingSendInfos, (sendInfo) => {
							send(sendInfo.params, sendInfo.callback);
						});
					}
					delete waitingSendInfoMap[roomServerName];

					if (connectionListener !== undefined) {
						connectionListener(on, off, send);
					}

					isConnecteds[roomServerName] = true;

					// when disconnected, rewait.
					on('__DISCONNECTED', () => {

						delete innerOns[roomServerName];
						delete innerOffs[roomServerName];
						delete innerSends[roomServerName];

						isConnecteds[roomServerName] = false;
					});
				}
			});
		}
	};
});

/*
 * WEB_SOCKET_SERVER로 생성한 웹소켓 서버에 연결합니다.
 */
global.CONNECT_TO_WEB_SOCKET_SERVER = METHOD({

	run: (portOrParams, connectionListenerOrListeners) => {
		//OPTIONAL: portOrParams
		//OPTIONAL: portOrParams.isSecure
		//OPTIONAL: portOrParams.host
		//OPTIONAL: portOrParams.port
		//REQUIRED: connectionListenerOrListeners
		//REQUIRED: connectionListenerOrListeners.success
		//OPTIONAL: connectionListenerOrListeners.error

		let isSecure;
		let host;
		let port;

		let connectionListener;
		let errorListener;

		let isConnected;

		let methodMap = {};
		let sendKey = 0;

		let on;
		let off;
		let send;

		if (connectionListenerOrListeners === undefined) {
			connectionListenerOrListeners = portOrParams;
			portOrParams = undefined;
		}

		if (CHECK_IS_DATA(portOrParams) !== true) {
			port = portOrParams;
		} else {
			isSecure = portOrParams.isSecure;
			host = portOrParams.host;
			port = portOrParams.port;
		}

		if (isSecure === undefined) {
			isSecure = BROWSER_CONFIG.isSecure;
		}

		if (host === undefined) {
			host = BROWSER_CONFIG.host;
		}

		if (port === undefined) {
			port = BROWSER_CONFIG.port;
		}

		if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
			connectionListener = connectionListenerOrListeners;
		} else {
			connectionListener = connectionListenerOrListeners.success;
			errorListener = connectionListenerOrListeners.error;
		}

		let runMethods = (methodName, data, sendKey) => {

			let methods = methodMap[methodName];

			if (methods !== undefined) {

				EACH(methods, (method) => {

					// run method.
					method(data, (retData) => {

						if (send !== undefined && sendKey !== undefined) {

							send({
								methodName: '__CALLBACK_' + sendKey,
								data: retData
							});
						}
					});
				});
			}
		};

		let conn = new WebSocket((isSecure === true ? 'wss://' : 'ws://') + host + ':' + port);

		conn.onopen = () => {

			isConnected = true;

			connectionListener(

				// on.
				on = (methodName, method) => {
					//REQUIRED: methodName
					//REQUIRED: method

					let methods = methodMap[methodName];

					if (methods === undefined) {
						methods = methodMap[methodName] = [];
					}

					methods.push(method);
				},

				// off.
				off = (methodName, method) => {
					//REQUIRED: methodName
					//OPTIONAL: method

					let methods = methodMap[methodName];

					if (methods !== undefined) {

						if (method !== undefined) {

							REMOVE({
								array: methods,
								value: method
							});

						} else {
							delete methodMap[methodName];
						}
					}
				},

				// send to server.
				send = (methodNameOrParams, callback) => {
					//REQUIRED: methodNameOrParams
					//REQUIRED: methodNameOrParams.methodName
					//OPTIONAL: methodNameOrParams.data
					//OPTIONAL: callback

					let methodName;
					let data;
					let callbackName;

					if (CHECK_IS_DATA(methodNameOrParams) !== true) {
						methodName = methodNameOrParams;
					} else {
						methodName = methodNameOrParams.methodName;
						data = methodNameOrParams.data;
					}

					if (conn !== undefined) {

						conn.send(STRINGIFY({
							methodName: methodName,
							data: data,
							sendKey: sendKey
						}));

						if (callback !== undefined) {

							callbackName = '__CALLBACK_' + sendKey;

							// on callback.
							on(callbackName, (data) => {

								// run callback.
								callback(data);

								// off callback.
								off(callbackName);
							});
						}

						sendKey += 1;
					}
				},

				// disconnect.
				() => {
					if (conn !== undefined) {
						conn.close();
						conn = undefined;
					}
				});
		};

		// receive data.
		conn.onmessage = (e) => {

			let params = PARSE_STR(e.data);

			if (params !== undefined) {
				runMethods(params.methodName, params.data, params.sendKey);
			}
		};

		// when disconnected
		conn.onclose = () => {
			runMethods('__DISCONNECTED');
		};

		// when error
		conn.onerror = (error) => {

			let errorMsg = error.toString();

			if (isConnected !== true) {

				if (errorListener !== undefined) {
					errorListener(errorMsg);
				} else {
					SHOW_ERROR('CONNECT_TO_WEB_SOCKET_SERVER', errorMsg);
				}

			} else {
				runMethods('__ERROR', errorMsg);
			}
		};
	}
});

/*
 * 쿠키 저장소 클래스
 * 
 * 쿠키에 데이터를 저장할 수 있는 클래스 입니다.
 * domain 파라미터를 통해 쿠키를 불러 올 수 있는 도메인 범위를 지정할 수 있습니다.
 * 웹 브라우저가 종료되어도 저장된 값들이 보존됩니다.
 */
global.COOKIE_STORE = CLASS({

	init: (inner, self, storeNameOrParams) => {
		//REQUIRED: storeNameOrParams
		//REQUIRED: storeNameOrParams.storeName
		//OPTIONAL: storeNameOrParams.domain

		let storeName;
		let domain;

		if (CHECK_IS_DATA(storeNameOrParams) !== true) {
			storeName = storeNameOrParams;
		} else {
			storeName = storeNameOrParams.storeName;
			domain = storeNameOrParams.domain;
		}

		let genFullName = inner.genFullName = (name) => {
			//REQUIRED: name

			return storeName + '.' + name;
		};

		let save = self.save = (params) => {
			//REQUIRED: params
			//REQUIRED: params.name
			//REQUIRED: params.value
			//OPTIONAL: params.isToSession
			//OPTIONAL: params.expireTime

			let name = params.name;
			let value = params.value;
			let isToSession = params.isToSession;
			let expireTime = params.expireTime;

			if (isToSession === true) {
				expireTime = 0;
			} else if (expireTime === undefined) {
				// set expire time 1 year
				expireTime = new Date();
				expireTime.setDate(expireTime.getDate() + 356);
			}

			document.cookie = genFullName(name) + '=' + encodeURIComponent(JSON.stringify(value)) + '; expires=' + (expireTime === 0 ? expireTime : expireTime.toGMTString()) + '; path=/;' + (domain === undefined ? '' : ' domain=' + domain + ';');
		};

		let get = self.get = (name) => {
			//REQUIRED: name

			name = genFullName(name) + '=';

			let cookie = document.cookie;
			let i = cookie.indexOf(name);

			let pop;
			if (cookie && i >= 0) {
				let temp = cookie.substring(i, cookie.length);
				let d = temp.indexOf(';');
				if (d > 0) {
					pop = temp.substring(name.length, d);
				} else {
					pop = temp.substring(name.length);
				}
			}

			return pop === undefined ? undefined : JSON.parse(decodeURIComponent(pop));
		};

		let remove = self.remove = (name) => {
			//REQUIRED: name

			let expireTime = new Date();
			expireTime.setDate(expireTime.getDate() - 1);

			document.cookie = genFullName(name) + '=; expires=' + expireTime.toGMTString() + '; path=/;' + (domain === undefined ? '' : ' domain=' + domain + ';');
		};

		let all = self.all = () => {

			let all = {};

			EACH(document.cookie.split(';'), (str) => {

				let index = str.indexOf('=');
				let fullName = str.substring(0, index);

				if (fullName.indexOf(storeName + '.') === 0) {

					all[fullName.substring(storeName.length + 1)] = str.substring(index + 1);
				}
			});

			return all;
		};

		let count = self.count = () => {

			let count = 0;

			EACH(document.cookie.split(';'), (str) => {

				let index = str.indexOf('=');
				let fullName = str.substring(0, index);

				if (fullName.indexOf(storeName + '.') === 0) {
					count += 1;
				}
			});

			return count;
		};

		let clear = self.clear = () => {

			EACH(document.cookie.split(';'), (str) => {

				let index = str.indexOf('=');
				let fullName = str.substring(0, index);

				if (fullName.indexOf(storeName + '.') === 0) {

					remove(fullName.substring(storeName.length + 1));
				}
			});
		};
	}
});

FOR_BOX((box) => {

	box.COOKIE_STORE = CLASS({

		init: (inner, self, storeNameOrParams) => {
			//REQUIRED: storeNameOrParams
			//REQUIRED: storeNameOrParams.storeName
			//OPTIONAL: storeNameOrParams.domain

			let storeName;
			let domain;

			if (CHECK_IS_DATA(storeNameOrParams) !== true) {
				storeName = storeNameOrParams;
			} else {
				storeName = storeNameOrParams.storeName;
				domain = storeNameOrParams.domain;
			}

			let store = COOKIE_STORE({
				storeName: box.boxName + '.' + storeName,
				domain: domain
			});

			let save = self.save = store.save;

			let get = self.get = store.get;

			let remove = self.remove = store.remove;

			let all = self.all = store.all;

			let count = self.count = store.count;

			let clear = self.clear = store.clear;
		}
	});
});
/*
 * 웹 브라우저 정보를 담고 있는 객체
 */
global.INFO = OBJECT({

	init: (inner, self) => {

		let isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

		if (isTouchDevice === undefined) {
			isTouchDevice = false;
		}

		let bowserParser = bowser.getParser(window.navigator.userAgent);

		let getLang = self.getLang = () => {

			let lang = STORE('__INFO').get('lang');

			if (lang === undefined) {
				lang = navigator.language;
			}

			if (lang.indexOf('-') !== -1 && lang !== 'zh-TW' && lang !== 'zh-CN') {
				lang = lang.substring(0, lang.indexOf('-'));
			}

			return lang;
		};

		let setLang = self.setLang = (lang) => {
			//REQUIRED: lang

			STORE('__INFO').save({
				name: 'lang',
				value: lang
			});
		};

		let changeLang = self.changeLang = (lang) => {
			//REQUIRED: lang

			setLang(lang);

			REFRESH();
		};

		let checkIsTouchDevice = self.checkIsTouchDevice = () => {
			return isTouchDevice;
		};

		let getOSName = self.getOSName = () => {
			return bowserParser.getOSName();
		};

		let getBrowserName = self.getBrowserName = () => {
			return bowserParser.getBrowserName();
		};

		let getBrowserVersion = self.getBrowserVersion = () => {
			return REAL(bowserParser.getBrowserVersion());
		};
	}
});
OVERRIDE(LOOP, (origin) => {

	/*
	 * 아주 짧은 시간동안 반복해서 실행하는 로직을 작성할때 사용하는 LOOP 클래스
	 */
	global.LOOP = CLASS((cls) => {

		let animationInterval;

		let infos = [];

		let fire = () => {

			if (animationInterval === undefined) {

				let beforeTime = performance.now() / 1000;

				let step;
				animationInterval = requestAnimationFrame(step = (now) => {

					let time = now / 1000;
					let deltaTime = time - beforeTime;

					if (deltaTime > 0) {

						for (let i = 0; i < infos.length; i += 1) {

							let info = infos[i];

							if (info.fps !== undefined && info.fps > 0) {

								if (info.timeSigma === undefined) {
									info.timeSigma = 0;
								}

								info.timeSigma += deltaTime;

								let frameSecond = 1 / info.fps;

								if (info.timeSigma >= frameSecond) {

									info.run(frameSecond);

									info.timeSigma -= frameSecond;
								}
							}

							else {
								info.run(deltaTime);
							}
						}

						beforeTime = time;
					}

					animationInterval = requestAnimationFrame(step);
				});
			}
		};

		let stop = () => {

			if (infos.length <= 0) {

				cancelAnimationFrame(animationInterval);
				animationInterval = undefined;
			}
		};

		return {

			init: (inner, self, fps, run) => {
				//OPTIONAL: fps
				//REQUIRED: run

				if (run === undefined) {
					run = fps;
					fps = undefined;
				}

				let info;

				let resume = self.resume = RAR(() => {

					infos.push(info = {
						fps: fps,
						run: run
					});

					fire();
				});

				let pause = self.pause = () => {

					REMOVE({
						array: infos,
						value: info
					});

					stop();
				};

				let changeFPS = self.changeFPS = (fps) => {
					//REQUIRED: fps

					info.fps = fps;
				};

				let clearFPS = self.clearFPS = () => {
					delete info.fps;
				};

				let getFPS = self.getFPS = () => {
					return info.fps;
				};

				let remove = self.remove = () => {
					pause();
				};
			}
		};
	});
});

FOR_BOX((box) => {

	OVERRIDE(box.MODEL, (origin) => {

		/*
		 * MODEL 클래스
		 */
		box.MODEL = CLASS((cls) => {

			let onNewInfos = {};
			let onNewInfoCount = 0;

			let getOnNewInfos = cls.getOnNewInfos = () => {
				return onNewInfos;
			};

			return {

				preset: () => {
					return origin;
				},

				init: (inner, self, params) => {
					//REQUIRED: params
					//OPTIONAL: params.roomServerName
					//REQUIRED: params.name
					//OPTIONAL: params.initData
					//OPTIONAL: params.methodConfig
					//OPTIONAL: params.methodConfig.create
					//OPTIONAL: params.methodConfig.create.valid
					//OPTIONAL: params.methodConfig.get
					//OPTIONAL: params.methodConfig.update
					//OPTIONAL: params.methodConfig.update.valid
					//OPTIONAL: params.methodConfig.remove
					//OPTIONAL: params.methodConfig.find
					//OPTIONAL: params.methodConfig.count
					//OPTIONAL: params.methodConfig.checkExists
					//OPTIONAL: params.isNotUsingObjectId

					let roomServerName = params.roomServerName;
					let name = params.name;
					let initData = params.initData;
					let methodConfig = params.methodConfig;
					let isNotUsingObjectId = params.isNotUsingObjectId;

					let createConfig;
					let getConfig;
					let updateConfig;
					let removeConfig;
					let findConfig;
					let countConfig;
					let checkExistsConfig;

					let createValid;
					let updateValid;

					let room = box.ROOM({
						roomServerName: roomServerName,
						name: name
					});

					let create;
					let get;
					let getWatching;
					let update;
					let remove;
					let find;
					let findWatching;
					let count;
					let checkExists;
					let onNewAndFind;
					let onNewAndFindWatching;

					// init method config.
					if (methodConfig !== undefined) {

						createConfig = methodConfig.create;
						getConfig = methodConfig.get;
						updateConfig = methodConfig.update;
						removeConfig = methodConfig.remove;
						findConfig = methodConfig.find;
						countConfig = methodConfig.count;
						checkExistsConfig = methodConfig.checkExists;

						if (createConfig !== undefined) {
							createValid = createConfig.valid;
						}

						if (updateConfig !== undefined) {
							updateValid = updateConfig.valid;
						}
					}

					let getName = self.getName = () => {
						return name;
					};

					let getInitData = self.getInitData = () => {
						return initData;
					};

					let getCreateValid = self.getCreateValid = () => {
						return createValid;
					};

					let getUpdateValid = self.getUpdateValid = () => {
						return updateValid;
					};

					let getRoom = self.getRoom = () => {
						return room;
					};

					// create.
					if (createConfig !== false) {

						create = self.create = (data, callbackOrHandlers) => {
							//REQUIRED: data
							//OPTIONAL: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notValid
							//OPTIONAL: callbackOrHandlers.notAuthed
							//OPTIONAL: callbackOrHandlers.success

							let errorHandler;
							let notValidHandler;
							let notAuthedHandler;
							let callback;

							let validResult;

							if (callbackOrHandlers !== undefined) {
								if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
									callback = callbackOrHandlers;
								} else {
									errorHandler = callbackOrHandlers.error;
									notValidHandler = callbackOrHandlers.notValid;
									notAuthedHandler = callbackOrHandlers.notAuthed;
									callback = callbackOrHandlers.success;
								}
							}

							// init data.
							if (initData !== undefined) {
								EACH(initData, (value, name) => {
									data[name] = value;
								});
							}

							if (createValid !== undefined) {
								validResult = createValid.checkAndWash(data);
							}

							if (validResult !== undefined && validResult.checkHasError() === true) {

								if (notValidHandler !== undefined) {
									notValidHandler(validResult.getErrors());
								} else {
									SHOW_WARNING(box.boxName + '.' + name + 'Model.create', MSG({
										ko: '데이터가 유효하지 않습니다.'
									}), {
										data: data,
										validErrors: validResult.getErrors()
									});
								}

							} else {

								room.send({
									methodName: 'create',
									data: data
								}, (result) => {

									let errorMsg;
									let validErrors;
									let isNotAuthed;
									let savedData;

									if (result !== undefined) {

										errorMsg = result.errorMsg;
										validErrors = result.validErrors;
										isNotAuthed = result.isNotAuthed;
										savedData = result.savedData;

										if (errorMsg !== undefined) {
											if (errorHandler !== undefined) {
												errorHandler(errorMsg);
											} else {
												SHOW_ERROR(box.boxName + '.' + name + 'Model.create', errorMsg);
											}
										} else if (validErrors !== undefined) {
											if (notValidHandler !== undefined) {
												notValidHandler(validErrors);
											} else {
												SHOW_WARNING(box.boxName + '.' + name + 'Model.create', MSG({
													ko: '데이터가 유효하지 않습니다.'
												}), {
													data: data,
													validErrors: validErrors
												});
											}
										} else if (isNotAuthed === true) {
											if (notAuthedHandler !== undefined) {
												notAuthedHandler();
											} else {
												SHOW_WARNING(box.boxName + '.' + name + 'Model.create', MSG({
													ko: '인증되지 않았습니다.'
												}));
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

						get = self.get = (idOrParams, callbackOrHandlers) => {
							//OPTIONAL: idOrParams
							//OPTIONAL: idOrParams.id
							//OPTIONAL: idOrParams.filter
							//OPTIONAL: idOrParams.sort
							//OPTIONAL: idOrParams.isRandom
							//REQUIRED: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//OPTIONAL: callbackOrHandlers.notExists
							//OPTIONAL: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let notExistsHandler;
							let callback;

							// init params.
							if (callbackOrHandlers === undefined) {
								callbackOrHandlers = idOrParams;
								idOrParams = {};
							}

							if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
								callback = callbackOrHandlers;
							} else {
								errorHandler = callbackOrHandlers.error;
								notAuthedHandler = callbackOrHandlers.notAuthed;
								notExistsHandler = callbackOrHandlers.notExists;
								callback = callbackOrHandlers.success;
							}

							room.send({
								methodName: 'get',
								data: idOrParams
							}, (result) => {

								let errorMsg;
								let isNotAuthed;
								let savedData;

								if (result !== undefined) {
									errorMsg = result.errorMsg;
									isNotAuthed = result.isNotAuthed;
									savedData = result.savedData;
								}

								if (errorMsg !== undefined) {
									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR(box.boxName + '.' + name + 'Model.get', errorMsg);
									}
								} else if (isNotAuthed === true) {
									if (notAuthedHandler !== undefined) {
										notAuthedHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.get', MSG({
											ko: '인증되지 않았습니다.'
										}));
									}
								} else if (savedData === undefined) {
									if (notExistsHandler !== undefined) {
										notExistsHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.get', MSG({
											ko: '데이터가 존재하지 않습니다.'
										}), idOrParams);
									}
								} else if (callback !== undefined) {
									callback(savedData);
								}
							});
						};

						getWatching = self.getWatching = (idOrParams, callbackOrHandlers) => {
							//OPTIONAL: idOrParams
							//OPTIONAL: idOrParams.id
							//OPTIONAL: idOrParams.filter
							//OPTIONAL: idOrParams.sort
							//OPTIONAL: idOrParams.isRandom
							//REQUIRED: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//OPTIONAL: callbackOrHandlers.notExists
							//REQUIRED: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let notExistsHandler;
							let callback;

							let isExited;
							let subRoom;

							// init params.
							if (callbackOrHandlers === undefined) {
								callbackOrHandlers = idOrParams;
								idOrParams = {};
							}

							if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
								callback = callbackOrHandlers;
							} else {
								errorHandler = callbackOrHandlers.error;
								notAuthedHandler = callbackOrHandlers.notAuthed;
								notExistsHandler = callbackOrHandlers.notExists;
								callback = callbackOrHandlers.success;
							}

							self.get(idOrParams, {

								error: errorHandler,
								notAuthed: notAuthedHandler,
								notExists: notExistsHandler,

								success: (savedData) => {

									let exit;

									if (isExited !== true) {

										subRoom = box.ROOM({
											roomServerName: roomServerName,
											name: name + '/' + savedData.id
										});

										callback(savedData,

											// add update handler.
											(callback) => {
												subRoom.on('update', callback);
											},

											// add remove handler.
											(callback) => {
												subRoom.on('remove', (originData) => {
													callback(originData);
													exit();
												});
											},

											// exit.
											exit = () => {
												if (subRoom !== undefined) {
													subRoom.exit();
													subRoom = undefined;
												}
											}
										);
									}
								}
							});

							return () => {

								if (subRoom !== undefined) {
									subRoom.exit();
								}

								isExited = true;
							};
						};
					}

					// update.
					if (updateConfig !== false) {

						update = self.update = (data, callbackOrHandlers) => {
							//REQUIRED: data
							//REQUIRED: data.id
							//OPTIONAL: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notValid
							//OPTIONAL: callbackOrHandlers.notAuthed
							//OPTIONAL: callbackOrHandlers.notExists
							//OPTIONAL: callbackOrHandlers.success

							let id = data.id;
							let $inc = data.$inc;
							let $push = data.$push;
							let $pull = data.$pull;

							let errorHandler;
							let notValidHandler;
							let notAuthedHandler;
							let notExistsHandler;
							let callback;

							let validResult;
							let $incValidResult;
							let $pushValidResult;
							let $pullValidResult;
							let validErrors;

							if (callbackOrHandlers !== undefined) {
								if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
									callback = callbackOrHandlers;
								} else {
									errorHandler = callbackOrHandlers.error;
									notValidHandler = callbackOrHandlers.notValid;
									notAuthedHandler = callbackOrHandlers.notAuthed;
									notExistsHandler = callbackOrHandlers.notExists;
									callback = callbackOrHandlers.success;
								}
							}

							if (updateValid !== undefined) {

								validResult = updateValid.checkForUpdate(data);

								if ($inc !== undefined) {
									$incValidResult = updateValid.checkForUpdate($inc);
								}

								if ($push !== undefined) {

									$pushValidResult = updateValid.checkForUpdate(RUN(() => {

										let dataForValid = {};

										EACH($push, (value, attr) => {
											dataForValid[attr] = [value];
										});

										return dataForValid;
									}));
								}

								if ($pull !== undefined) {

									$pullValidResult = updateValid.checkForUpdate(RUN(() => {

										let dataForValid = {};

										EACH($pull, (value, attr) => {
											dataForValid[attr] = [value];
										});

										return dataForValid;
									}));
								}
							}

							data.id = id;
							data.$inc = $inc;
							data.$push = $push;
							data.$pull = $pull;

							if (updateValid !== undefined && (
								validResult.checkHasError() === true ||
								($incValidResult !== undefined && $incValidResult.checkHasError() === true) ||
								($pushValidResult !== undefined && $pushValidResult.checkHasError() === true) ||
								($pullValidResult !== undefined && $pullValidResult.checkHasError() === true)
							)) {

								validErrors = COMBINE([
									validResult.getErrors(),
									$incValidResult === undefined ? {} : $incValidResult.getErrors(),
									$pushValidResult === undefined ? {} : $pushValidResult.getErrors(),
									$pullValidResult === undefined ? {} : $pullValidResult.getErrors()
								]);

								if (notValidHandler !== undefined) {
									notValidHandler(validErrors);
								} else {
									SHOW_WARNING(box.boxName + '.' + name + 'Model.update', MSG({
										ko: '데이터가 유효하지 않습니다.'
									}), {
										data: data,
										validErrors: validErrors
									});
								}

							} else {

								room.send({
									methodName: 'update',
									data: data
								}, (result) => {

									let errorMsg;
									let validErrors;
									let isNotAuthed;
									let savedData;
									let originData;

									if (result !== undefined) {
										errorMsg = result.errorMsg;
										validErrors = result.validErrors;
										isNotAuthed = result.isNotAuthed;
										savedData = result.savedData;
										originData = result.originData;
									}

									if (errorMsg !== undefined) {
										if (errorHandler !== undefined) {
											errorHandler(errorMsg);
										} else {
											SHOW_ERROR(box.boxName + '.' + name + 'Model.update', errorMsg);
										}
									} else if (validErrors !== undefined) {
										if (notValidHandler !== undefined) {
											notValidHandler(validErrors);
										} else {
											SHOW_WARNING(box.boxName + '.' + name + 'Model.update', MSG({
												ko: '데이터가 유효하지 않습니다.'
											}), {
												data: data,
												validErrors: validErrors
											});
										}
									} else if (isNotAuthed === true) {
										if (notAuthedHandler !== undefined) {
											notAuthedHandler();
										} else {
											SHOW_WARNING(box.boxName + '.' + name + 'Model.update', MSG({
												ko: '인증되지 않았습니다.'
											}));
										}
									} else if (savedData === undefined) {
										if (notExistsHandler !== undefined) {
											notExistsHandler();
										} else {
											SHOW_WARNING(box.boxName + '.' + name + 'Model.update', MSG({
												ko: '수정할 데이터가 존재하지 않습니다.'
											}), data);
										}
									} else if (callback !== undefined) {
										callback(savedData, originData);
									}
								});
							}
						};
					}

					// remove.
					if (removeConfig !== false) {

						remove = self.remove = (id, callbackOrHandlers) => {
							//REQUIRED: id
							//OPTIONAL: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//OPTIONAL: callbackOrHandlers.notExists
							//OPTIONAL: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let notExistsHandler;
							let callback;

							if (callbackOrHandlers !== undefined) {
								if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
									callback = callbackOrHandlers;
								} else {
									errorHandler = callbackOrHandlers.error;
									notAuthedHandler = callbackOrHandlers.notAuthed;
									notExistsHandler = callbackOrHandlers.notExists;
									callback = callbackOrHandlers.success;
								}
							}

							room.send({
								methodName: 'remove',
								data: id
							}, (result) => {

								let errorMsg;
								let isNotAuthed;
								let originData;

								if (result !== undefined) {
									errorMsg = result.errorMsg;
									isNotAuthed = result.isNotAuthed;
									originData = result.originData;
								}

								if (errorMsg !== undefined) {
									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR(box.boxName + '.' + name + 'Model.remove', errorMsg);
									}
								} else if (isNotAuthed === true) {
									if (notAuthedHandler !== undefined) {
										notAuthedHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.remove', MSG({
											ko: '인증되지 않았습니다.'
										}));
									}
								} else if (originData === undefined) {
									if (notExistsHandler !== undefined) {
										notExistsHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.remove', MSG({
											ko: '삭제할 데이터가 존재하지 않습니다.'
										}), id);
									}
								} else if (callback !== undefined) {
									callback(originData);
								}
							});
						};
					}

					// find.
					if (findConfig !== false) {

						find = self.find = (params, callbackOrHandlers) => {
							//OPTIONAL: params
							//OPTIONAL: params.filter
							//OPTIONAL: params.sort
							//OPTIONAL: params.start
							//OPTIONAL: params.count
							//REQUIRED: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//REQUIRED: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let callback;

							// init params.
							if (callbackOrHandlers === undefined) {
								callbackOrHandlers = params;
								params = undefined;
							}

							if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
								callback = callbackOrHandlers;
							} else {
								errorHandler = callbackOrHandlers.error;
								notAuthedHandler = callbackOrHandlers.notAuthed;
								callback = callbackOrHandlers.success;
							}

							room.send({
								methodName: 'find',
								data: params
							}, (result) => {

								let errorMsg = result.errorMsg;
								let isNotAuthed = result.isNotAuthed;
								let savedDataSet = result.savedDataSet;

								if (errorMsg !== undefined) {
									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR(box.boxName + '.' + name + 'Model.find', errorMsg);
									}
								} else if (isNotAuthed === true) {
									if (notAuthedHandler !== undefined) {
										notAuthedHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.find', MSG({
											ko: '인증되지 않았습니다.'
										}));
									}
								} else {
									callback(savedDataSet);
								}
							});
						};

						findWatching = self.findWatching = (params, callbackOrHandlers) => {
							//OPTIONAL: params
							//OPTIONAL: params.filter
							//OPTIONAL: params.sort
							//OPTIONAL: params.start
							//OPTIONAL: params.count
							//REQUIRED: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//REQUIRED: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let callback;

							let isExited;
							let subRooms = {};

							// init params.
							if (callbackOrHandlers === undefined) {
								callbackOrHandlers = params;
								params = undefined;
							}

							if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
								callback = callbackOrHandlers;
							} else {
								errorHandler = callbackOrHandlers.error;
								notAuthedHandler = callbackOrHandlers.notAuthed;
								callback = callbackOrHandlers.success;
							}

							self.find(params, {

								success: (savedDataSet) => {

									let exit;

									if (isExited !== true) {

										EACH(savedDataSet, (savedData, i) => {

											let id = savedData.id;

											subRooms[id] = box.ROOM({
												roomServerName: roomServerName,
												name: name + '/' + id
											});
										});

										callback(savedDataSet,

											// add update handler.
											(id, callback) => {
												subRooms[id].on('update', callback);
											},

											// add remove handler.
											(id, callback) => {
												subRooms[id].on('remove', (originData) => {
													callback(originData);
													exit(id);
												});
											},

											// exit.
											exit = (id) => {
												if (subRooms[id] !== undefined) {
													subRooms[id].exit();
													delete subRooms[id];
												}
											}
										);
									}
								},

								notAuthed: notAuthedHandler,
								error: errorHandler
							});

							return () => {

								EACH(subRooms, (subRoom) => {
									subRoom.exit();
								});

								isExited = true;
							};
						};
					}

					if (countConfig !== false) {

						count = self.count = (params, callbackOrHandlers) => {
							//OPTIONAL: params
							//OPTIONAL: params.filter
							//REQUIRED: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//REQUIRED: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let callback;

							// init params.
							if (callbackOrHandlers === undefined) {
								callbackOrHandlers = params;
								params = undefined;
							}

							if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
								callback = callbackOrHandlers;
							} else {
								errorHandler = callbackOrHandlers.error;
								notAuthedHandler = callbackOrHandlers.notAuthed;
								callback = callbackOrHandlers.success;
							}

							room.send({
								methodName: 'count',
								data: params
							}, (result) => {

								let errorMsg = result.errorMsg;
								let isNotAuthed = result.isNotAuthed;
								let count = result.count;

								if (errorMsg !== undefined) {
									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR(box.boxName + '.' + name + 'Model.count', errorMsg);
									}
								} else if (isNotAuthed === true) {
									if (notAuthedHandler !== undefined) {
										notAuthedHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.count', MSG({
											ko: '인증되지 않았습니다.'
										}));
									}
								} else {
									callback(count);
								}
							});
						};
					}

					if (checkExistsConfig !== false) {

						checkExists = self.checkExists = (params, callbackOrHandlers) => {
							//OPTIONAL: params
							//OPTIONAL: params.filter
							//REQUIRED: callbackOrHandlers
							//OPTIONAL: callbackOrHandlers.error
							//OPTIONAL: callbackOrHandlers.notAuthed
							//REQUIRED: callbackOrHandlers.success

							let errorHandler;
							let notAuthedHandler;
							let callback;

							// init params.
							if (callbackOrHandlers === undefined) {
								callbackOrHandlers = params;
								params = undefined;
							}

							if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
								callback = callbackOrHandlers;
							} else {
								errorHandler = callbackOrHandlers.error;
								notAuthedHandler = callbackOrHandlers.notAuthed;
								callback = callbackOrHandlers.success;
							}

							room.send({
								methodName: 'checkExists',
								data: params
							}, (result) => {

								let errorMsg = result.errorMsg;
								let isNotAuthed = result.isNotAuthed;
								let exists = result.exists;

								if (errorMsg !== undefined) {
									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR(box.boxName + '.' + name + 'Model.checkExists', errorMsg);
									}
								} else if (isNotAuthed === true) {
									if (notAuthedHandler !== undefined) {
										notAuthedHandler();
									} else {
										SHOW_WARNING(box.boxName + '.' + name + 'Model.checkExists', MSG({
											ko: '인증되지 않았습니다.'
										}));
									}
								} else {
									callback(exists);
								}
							});
						};
					}

					let onNew = self.onNew = (properties, handler) => {
						//OPTIONAL: properties
						//REQUIRED: handler

						let roomForCreate;

						let infoId = onNewInfoCount;

						onNewInfoCount += 1;

						if (handler === undefined) {
							handler = properties;
							properties = undefined;

							(roomForCreate = box.ROOM({
								roomServerName: roomServerName,
								name: name + '/create'
							})).on('create', (savedData) => {

								onNewInfos[infoId].lastCreateTime = savedData.createTime;

								handler(savedData);
							});

						} else if (properties === undefined) {

							(roomForCreate = box.ROOM({
								roomServerName: roomServerName,
								name: name + '/create'
							})).on('create', (savedData) => {

								onNewInfos[infoId].lastCreateTime = savedData.createTime;

								handler(savedData);
							});

						} else {

							EACH(properties, (value, propertyName) => {

								if (value !== undefined) {

									(roomForCreate = box.ROOM({
										roomServerName: roomServerName,
										name: value === TO_DELETE ? (name + '/create') : (name + '/' + propertyName + '/' + value + '/create')
									})).on('create', (savedData) => {

										if (EACH(properties, (value, propertyName) => {

											if (value !== undefined) {

												if (value === TO_DELETE) {
													if (savedData[propertyName] !== undefined) {
														return false;
													}
												} else if (savedData[propertyName] !== value) {
													return false;
												}
											}

										}) === true) {

											onNewInfos[infoId].lastCreateTime = savedData.createTime;

											handler(savedData);
										}
									});

									return false;
								}
							});

							if (roomForCreate === undefined) {
								onNew(undefined, handler);
								return;
							}
						}

						onNewInfos[infoId] = {

							findMissingDataSet: () => {

								if (onNewInfos[infoId].lastCreateTime !== undefined && find !== undefined) {

									find({
										filter: properties !== undefined ? COMBINE([properties, {
											createTime: {
												$gt: onNewInfos[infoId].lastCreateTime
											}
										}]) : {
												createTime: {
													$gt: onNewInfos[infoId].lastCreateTime
												}
											},
										sort: {
											createTime: 1
										}
									}, EACH(handler));
								}
							}
						};

						return () => {

							delete onNewInfos[infoId];

							if (roomForCreate !== undefined) {
								roomForCreate.exit();
							}
						};
					};

					let onNewWatching = self.onNewWatching = (properties, handler) => {
						//OPTIONAL: properties
						//REQUIRED: handler

						let roomForCreate;

						let infoId = onNewInfoCount;

						let subRooms = [];

						let innerHandler = (savedData) => {

							let id = savedData.id;

							let subRoom;

							let exit;

							subRooms.push(subRoom = box.ROOM({
								roomServerName: roomServerName,
								name: name + '/' + id
							}));

							handler(savedData,

								// add update handler.
								(callback) => {
									subRoom.on('update', callback);
								},

								// add remove handler.
								(callback) => {
									subRoom.on('remove', (originData) => {
										callback(originData);
										exit();
									});
								},

								// exit.
								exit = () => {

									subRoom.exit();

									REMOVE({
										array: subRooms,
										value: subRoom
									});
								});
						};

						onNewInfoCount += 1;

						if (handler === undefined) {
							handler = properties;
							properties = undefined;

							(roomForCreate = box.ROOM({
								roomServerName: roomServerName,
								name: name + '/create'
							})).on('create', (savedData) => {

								onNewInfos[infoId].lastCreateTime = savedData.createTime;

								innerHandler(savedData);
							});

						} else if (properties === undefined) {

							(roomForCreate = box.ROOM({
								roomServerName: roomServerName,
								name: name + '/create'
							})).on('create', (savedData) => {

								onNewInfos[infoId].lastCreateTime = savedData.createTime;

								innerHandler(savedData);
							});

						} else {

							EACH(properties, (value, propertyName) => {

								if (value !== undefined) {

									(roomForCreate = box.ROOM({
										roomServerName: roomServerName,
										name: value === TO_DELETE ? (name + '/create') : (name + '/' + propertyName + '/' + value + '/create')
									})).on('create', (savedData) => {

										if (EACH(properties, (value, propertyName) => {

											if (value !== undefined) {

												if (value === TO_DELETE) {
													if (savedData[propertyName] !== undefined) {
														return false;
													}
												} else if (savedData[propertyName] !== value) {
													return false;
												}
											}

										}) === true) {

											onNewInfos[infoId].lastCreateTime = savedData.createTime;

											innerHandler(savedData);
										}
									});

									return false;
								}
							});

							if (roomForCreate === undefined) {
								onNewWatching(undefined, handler);
								return;
							}
						}

						onNewInfos[infoId] = {

							findMissingDataSet: () => {

								if (onNewInfos[infoId].lastCreateTime !== undefined && find !== undefined) {

									find({
										filter: properties !== undefined ? COMBINE([properties, {
											createTime: {
												$gt: onNewInfos[infoId].lastCreateTime
											}
										}]) : {
												createTime: {
													$gt: onNewInfos[infoId].lastCreateTime
												}
											},
										sort: {
											createTime: 1
										}
									}, EACH(innerHandler));
								}
							}
						};

						return () => {

							delete onNewInfos[infoId];

							if (roomForCreate !== undefined) {
								roomForCreate.exit();
							}

							EACH(subRooms, (subRoom) => {
								subRoom.exit();
							});
						};
					};

					// on new and find.
					if (findConfig !== false) {

						onNewAndFind = self.onNewAndFind = (params, handlerOrHandlers) => {
							//OPTIONAL: params
							//OPTIONAL: params.properties
							//OPTIONAL: params.filter
							//OPTIONAL: params.sort
							//OPTIONAL: params.start
							//OPTIONAL: params.count
							//OPTIONAL: params.isNotOnNew
							//REQUIRED: handlerOrHandlers
							//OPTIONAL: handlerOrHandlers.error
							//OPTIONAL: handlerOrHandlers.notAuthed
							//OPTIONAL: handlerOrHandlers.success
							//REQUIRED: handlerOrHandlers.handler

							let properties;
							let filter;
							let sort;
							let start;
							let count;
							let isNotOnNew;
							let exitOnNewRoom;

							let errorHandler;
							let notAuthedHandler;
							let callback;
							let handler;

							let isExited;

							// init params.
							if (handlerOrHandlers === undefined) {
								handlerOrHandlers = params;
								params = undefined;
							}

							if (params !== undefined) {
								properties = params.properties;
								filter = params.filter;
								sort = params.sort;
								start = params.start;
								count = params.count;
								isNotOnNew = params.isNotOnNew;
							}

							if (CHECK_IS_DATA(handlerOrHandlers) !== true) {
								handler = handlerOrHandlers;
							} else {
								errorHandler = handlerOrHandlers.error;
								notAuthedHandler = handlerOrHandlers.notAuthed;
								callback = handlerOrHandlers.success;
								handler = handlerOrHandlers.handler;
							}

							if (isNotOnNew !== true) {
								exitOnNewRoom = onNew(properties, (savedData) => {
									handler(savedData, true);
								});
							}

							find({
								filter: COMBINE([properties, filter]),
								sort: sort,
								start: start,
								count: count
							}, {
								success: (savedDataSet) => {

									if (isExited !== true) {

										if (callback !== undefined) {
											callback(savedDataSet);
										}

										EACH(savedDataSet, (savedData) => {
											handler(savedData, false);
										});
									}
								},
								notAuthed: notAuthedHandler,
								error: errorHandler
							});

							return () => {

								if (exitOnNewRoom !== undefined) {
									exitOnNewRoom();
								}

								isExited = true;
							};
						};

						onNewAndFindWatching = self.onNewAndFindWatching = (params, handlerOrHandlers) => {
							//OPTIONAL: params
							//OPTIONAL: params.properties
							//OPTIONAL: params.filter
							//OPTIONAL: params.sort
							//OPTIONAL: params.start
							//OPTIONAL: params.count
							//OPTIONAL: params.isNotOnNew
							//REQUIRED: handlerOrHandlers
							//OPTIONAL: handlerOrHandlers.error
							//OPTIONAL: handlerOrHandlers.notAuthed
							//OPTIONAL: handlerOrHandlers.success
							//REQUIRED: handlerOrHandlers.handler

							let properties;
							let filter;
							let sort;
							let start;
							let count;
							let isNotOnNew;

							let errorHandler;
							let notAuthedHandler;
							let callback;
							let handler;

							let exitOnNewWatchingRoom;
							let exitFindWatchingRoom;

							let isExited;

							// init params.
							if (handlerOrHandlers === undefined) {
								handlerOrHandlers = params;
								params = undefined;
							}

							if (params !== undefined) {
								properties = params.properties;
								filter = params.filter;
								sort = params.sort;
								start = params.start;
								count = params.count;
								isNotOnNew = params.isNotOnNew;
							}

							if (CHECK_IS_DATA(handlerOrHandlers) !== true) {
								handler = handlerOrHandlers;
							} else {
								errorHandler = handlerOrHandlers.error;
								notAuthedHandler = handlerOrHandlers.notAuthed;
								callback = handlerOrHandlers.success;
								handler = handlerOrHandlers.handler;
							}

							if (isNotOnNew !== true) {
								exitOnNewWatchingRoom = onNewWatching(properties, (savedData, addUpdateHandler, addRemoveHandler, exit) => {
									handler(savedData, addUpdateHandler, addRemoveHandler, exit, true);
								});
							}

							exitFindWatchingRoom = findWatching({
								filter: COMBINE([properties, filter]),
								sort: sort,
								start: start,
								count: count
							}, {
								success: (savedDataSet, addUpdateHandler, addRemoveHandler, exit) => {

									if (isExited !== true) {

										if (callback !== undefined) {
											callback(savedDataSet, addUpdateHandler, addRemoveHandler, exit);
										}

										EACH(savedDataSet, (savedData) => {

											handler(savedData,

												(handler) => {
													addUpdateHandler(savedData.id, handler);
												},

												(handler) => {
													addRemoveHandler(savedData.id, handler);
												},

												// exit.
												() => {
													exit(savedData.id);
												},

												// is new data
												false
											);
										});
									}
								},
								notAuthed: notAuthedHandler,
								error: errorHandler
							});

							return () => {

								if (exitOnNewWatchingRoom !== undefined) {
									exitOnNewWatchingRoom();
								}

								exitFindWatchingRoom();

								isExited = true;
							};
						};
					}

					let onRemove = self.onRemove = (properties, handler) => {
						//OPTIONAL: properties
						//REQUIRED: handler

						let roomForRemove;

						if (handler === undefined) {
							handler = properties;

							(roomForRemove = box.ROOM({
								roomServerName: roomServerName,
								name: name + '/remove'
							})).on('remove', handler);

						} else {

							EACH(properties, (value, propertyName) => {

								if (value !== undefined) {

									(roomForRemove = box.ROOM({
										roomServerName: roomServerName,
										name: name + '/' + propertyName + '/' + value + '/remove'
									})).on('remove', (originData) => {

										if (EACH(properties, (value, propertyName) => {

											if (value !== undefined) {

												if (value === TO_DELETE) {
													if (originData[propertyName] !== undefined) {
														return false;
													}
												} else if (originData[propertyName] !== value) {
													return false;
												}
											}

										}) === true) {
											handler(originData);
										}
									});

									return false;
								}
							});
						}

						return () => {

							if (roomForRemove !== undefined) {
								roomForRemove.exit();
							}
						};
					};
				}
			};
		});
	});
});

/*
 * INFO의 웹 애플리케이션 언어 설정 코드에 해당하는 문자열을 반환합니다.
 * 
 * 만약 알 수 없는 언어 설정 코드라면, 영어가 있는 경우에는 영어를, 아니라면 첫번째 문자열을 반환합니다.
 */
OVERRIDE(MSG, (origin) => {

	global.MSG = METHOD((m) => {

		let msgData = {};

		let addData = m.addData = (data) => {
			//REQUIRED: data

			EXTEND({
				origin: msgData,
				extend: data
			});
		};

		let loadCSV = m.loadCSV = (url, callback) => {
			//REQUIRED: url
			//REQUIRED: callback

			if (CHECK_IS_ARRAY(url) === true) {

				NEXT(url, [
					(url, next) => {
						loadCSV(url, next);
					},

					() => {
						return callback;
					}]);
			}

			else {

				GET(url, (content) => {

					let data = {};

					let langs;
					EACH(__PAPA.parse(content).data, (texts, i) => {

						// 첫번째 줄은 언어 설정
						if (i === 0) {
							langs = texts;
						}

						else {
							let subData = {};
							EACH(texts, (text, j) => {
								if (j > 0 && text !== '') {
									subData[langs[j]] = text.replace(/\\n/, '\n');
								}
							});
							data[texts[0]] = subData;
						}
					});

					addData(data);

					callback();
				});
			}
		};

		return {

			run: (keyOrMsgs) => {
				//REQUIRED: keyOrMsgs

				let key;
				let msgs;

				if (CHECK_IS_DATA(keyOrMsgs) !== true) {
					key = keyOrMsgs;
				} else {
					msgs = keyOrMsgs;
				}

				if (key !== undefined) {
					msgs = msgData[key];
				}

				if (msgs === undefined) {
					SHOW_ERROR('MSG', key + '에 해당하는 문자열을 찾을 수 없습니다.');
				}

				let msg = msgs[INFO.getLang()];

				if (msg === undefined) {

					let lang;
					let locale;

					if (INFO.getLang().length == 2) {
						lang = INFO.getLang().toLowerCase();
					} else {
						lang = INFO.getLang().substring(0, 2).toLowerCase();
						locale = INFO.getLang().substring(3).toLowerCase();
					}

					msg = msgs[lang];

					if (msg !== undefined) {

						if (CHECK_IS_DATA(msg) === true) {
							if (msg[locale] !== undefined) {
								msg = msg[locale];
							} else {

								// 못 찾은 경우 첫번째 문자열을 반환
								EACH(msg, (_msg) => {
									msg = _msg;
									return false;
								});
							}
						}
					}
				}

				if (msg === undefined) {

					// 영어가 있는 경우 영어를, 아닌 경우 첫번째 문자열을 반환
					if (msgs.en !== undefined) {
						msg = msgs.en;
					} else {
						EACH(msgs, (_msg) => {
							msg = _msg;
							return false;
						});
					}
				}

				if (msg !== undefined && CHECK_IS_DATA(msg) === true) {

					// 못 찾은 경우 첫번째 문자열을 반환
					EACH(msg, (_msg) => {
						msg = _msg;
						return false;
					});
				}

				return msg;
			}
		};
	});
});

FOR_BOX((box) => {

	/*
	 * 서버에 생성된 룸과 통신을 주고받는 ROOM 클래스
	 */
	box.ROOM = CLASS({

		init: (inner, self, nameOrParams) => {
			//REQUIRED: nameOrParams
			//OPTIONAL: nameOrParams.roomServerName
			//REQUIRED: nameOrParams.name

			let roomServerName;
			let roomName;

			let methodMap = {};

			let isExited;

			if (CHECK_IS_DATA(nameOrParams) !== true) {
				roomName = box.boxName + '/' + nameOrParams;
			} else {
				roomServerName = nameOrParams.roomServerName;
				roomName = box.boxName + '/' + nameOrParams.name;
			}

			CONNECT_TO_ROOM_SERVER.enterRoom({
				roomServerName: roomServerName,
				roomName: roomName
			});

			let getRoomName = inner.getRoomName = () => {
				return roomName;
			};

			let checkIsExited = inner.checkIsExited = () => {
				return isExited;
			};

			let on = self.on = (methodName, method) => {
				//REQUIRED: methodName
				//REQUIRED: method

				let methods = methodMap[methodName];

				CONNECT_TO_ROOM_SERVER.on({
					roomServerName: roomServerName,
					methodName: roomName + '/' + methodName
				}, method);

				if (methods === undefined) {
					methods = methodMap[methodName] = [];
				}

				methods.push(method);
			};

			let off = self.off = (methodName, method) => {
				//REQUIRED: methodName
				//OPTIONAL: method

				let methods = methodMap[methodName];

				if (methods !== undefined) {

					if (method !== undefined) {

						CONNECT_TO_ROOM_SERVER.off({
							roomServerName: roomServerName,
							methodName: roomName + '/' + methodName
						}, method);

						REMOVE({
							array: methods,
							value: method
						});

						if (methods.length === 0) {
							delete methodMap[methodName];
						}

					} else {

						EACH(methods, (method) => {
							CONNECT_TO_ROOM_SERVER.off({
								roomServerName: roomServerName,
								methodName: roomName + '/' + methodName
							}, method);
						});
						delete methodMap[methodName];
					}
				}
			};

			let send = self.send = (methodNameOrParams, callback) => {
				//REQUIRED: methodNameOrParams
				//REQUIRED: methodNameOrParams.methodName
				//OPTIONAL: methodNameOrParams.data
				//OPTIONAL: callback

				let methodName;
				let data;

				if (CHECK_IS_DATA(methodNameOrParams) !== true) {
					methodName = methodNameOrParams;
				} else {
					methodName = methodNameOrParams.methodName;
					data = methodNameOrParams.data;
				}

				if (isExited !== true) {

					CONNECT_TO_ROOM_SERVER.send({
						roomServerName: roomServerName,
						methodName: roomName + '/' + methodName,
						data: data
					}, callback);

				} else {
					SHOW_ERROR(box.boxName + '.' + roomName + 'Room.send', '이미 룸에서 나갔습니다.');
				}
			};

			let exit = self.exit = () => {

				if (isExited !== true) {

					CONNECT_TO_ROOM_SERVER.exitRoom({
						roomServerName: roomServerName,
						roomName: roomName
					});

					EACH(methodMap, (methods, methodName) => {
						off(methodName);
					});

					// free method map.
					methodMap = undefined;

					isExited = true;
				}
			};
		}
	});
});

/*
 * 세션 저장소 클래스
 * 
 * 웹 브라우저가 종료되면 저장된 값들이 삭제됩니다.
 */
global.SESSION_STORE = CLASS({

	init: (inner, self, storeName) => {
		//REQUIRED: storeName

		// gen full name.
		let genFullName = (name) => {
			//REQUIRED: name

			return storeName + '.' + name;
		};

		let save = self.save = (params) => {
			//REQUIRED: params
			//REQUIRED: params.name
			//REQUIRED: params.value

			let name = params.name;
			let value = params.value;

			sessionStorage.setItem(genFullName(name), STRINGIFY(value));
		};

		let get = self.get = (name) => {
			//REQUIRED: name

			let value = PARSE_STR(sessionStorage.getItem(genFullName(name)));

			if (value === TO_DELETE) {
				value = undefined;
			}

			return value;
		};

		let remove = self.remove = (name) => {
			//REQUIRED: name

			sessionStorage.removeItem(genFullName(name));
		};

		let all = self.all = () => {

			let all = {};

			EACH(sessionStorage, (value, fullName) => {

				if (fullName.indexOf(storeName + '.') === 0) {

					all[fullName.substring(storeName.length + 1)] = PARSE_STR(value);
				}
			});

			return all;
		};

		let count = self.count = () => {

			let count = 0;

			EACH(sessionStorage, (value, fullName) => {

				if (fullName.indexOf(storeName + '.') === 0) {
					count += 1;
				}
			});

			return count;
		};

		let clear = self.clear = () => {

			EACH(sessionStorage, (value, fullName) => {

				if (fullName.indexOf(storeName + '.') === 0) {

					remove(fullName.substring(storeName.length + 1));
				}
			});
		};
	}
});

FOR_BOX((box) => {

	box.SESSION_STORE = CLASS({

		init: (inner, self, storeName) => {
			//REQUIRED: storeName

			let store = SESSION_STORE(box.boxName + '.' + storeName);

			let save = self.save = store.save;

			let get = self.get = store.get;

			let remove = self.remove = store.remove;

			let all = self.all = store.all;

			let count = self.count = store.count;

			let clear = self.clear = store.clear;
		}
	});
});

/*
 * 사운드 파일을 재생하는 SOUND 클래스
 */
global.SOUND = CLASS((cls) => {

	let audioContext;
	let isCanPlayOGG = new Audio().canPlayType('audio/ogg') !== '';

	let bufferCache = {};

	let loadBuffer = (src, callback) => {

		if (bufferCache[src] !== undefined) {
			callback(bufferCache[src]);
		}

		else {

			let request = new XMLHttpRequest();
			request.open('GET', src, true);
			request.responseType = 'arraybuffer';

			request.onload = () => {

				audioContext.decodeAudioData(request.response, (buffer) => {

					bufferCache[src] = buffer;

					callback(buffer);
				});
			};

			request.send();
		}
	};

	return {

		init: (inner, self, params, onEndHandler) => {
			//REQUIRED: params
			//OPTIONAL: params.ogg
			//OPTIONAL: params.mp3
			//OPTIONAL: params.wav
			//OPTIONAL: params.isLoop
			//OPTIONAL: params.volume
			//OPTIONAL: onEndHandler

			let ogg = params.ogg;
			let mp3 = params.mp3;
			let wav = params.wav;
			let isLoop = params.isLoop;
			let volume = params.volume;

			if (volume === undefined) {
				volume = 0.8;
			}

			let buffer;
			let source;
			let gainNode;

			let isLoaded = false;

			let startedAt = 0;
			let pausedAt = 0;

			let duration;
			let isPlaying = false;

			let delayed;

			let fadeInSeconds;

			let eventMap = {};

			// init audioContext.
			if (audioContext === undefined) {
				audioContext = new AudioContext();
			}

			let src;
			if (ogg !== undefined && isCanPlayOGG === true) {
				src = ogg;
			} else if (mp3 !== undefined) {
				src = mp3;
			} else {
				src = wav;
			}

			let ready = () => {

				loadBuffer(src, (_buffer) => {

					if (buffer === undefined) {

						gainNode = audioContext.createGain();

						buffer = _buffer;

						duration = buffer.duration;

						gainNode.connect(audioContext.destination);

						if (fadeInSeconds === undefined) {
							gainNode.gain.setValueAtTime(volume, 0);
						} else {
							gainNode.gain.setValueAtTime(0, 0);
							gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeInSeconds);
							fadeInSeconds = undefined;
						}

						if (delayed !== undefined) {
							delayed();
						}

						fireEvent('load');
						off('load');

						isLoaded = true;
					}
				});
			};

			let play = self.play = (at) => {
				//OPTIONAL: at

				if (isPlaying !== true) {

					if (at !== undefined) {
						pausedAt = at;
					}

					delayed = () => {

						if (isPlaying !== true) {

							source = audioContext.createBufferSource();
							source.buffer = buffer;
							source.connect(gainNode);
							source.loop = isLoop;

							startedAt = Date.now() / 1000 - pausedAt;
							source.start(0, pausedAt % buffer.duration);

							delayed = undefined;

							if (isLoop !== true) {
								source.onended = () => {
									stop();
									if (onEndHandler !== undefined) {
										onEndHandler();
									}
								};
							}

							isPlaying = true;
						}
					};

					if (buffer === undefined) {
						ready();
					} else {
						delayed();
					}
				}

				return self;
			};

			let checkIsPlaying = self.checkIsPlaying = () => {
				return isPlaying;
			};

			let getStartAt = self.getStartAt = () => {
				return startedAt;
			};

			let pause = self.pause = () => {

				if (source !== undefined) {
					source.stop(0);
					source.disconnect();
					source = undefined;

					pausedAt = Date.now() / 1000 - startedAt;
				}

				delayed = undefined;

				isPlaying = false;
			};

			let stop = self.stop = () => {

				if (source !== undefined) {
					source.stop(0);
					source.disconnect();
					source = undefined;

					pausedAt = 0;
				}

				if (gainNode !== undefined) {
					gainNode.disconnect();
					gainNode = undefined;
				}

				buffer = undefined;
				delayed = undefined;

				isPlaying = false;
			};

			let setVolume = self.setVolume = (_volume) => {
				//REQUIRED: volume

				volume = _volume;

				if (gainNode !== undefined) {
					gainNode.gain.setValueAtTime(volume, 0);
				}
			};

			let getVolume = self.getVolume = () => {
				return volume;
			};

			let setPlaybackRate = self.setPlaybackRate = (playbackRate) => {
				//REQUIRED: playbackRate

				if (source !== undefined) {
					source.playbackRate.setValueAtTime(playbackRate, 0);
				}
			};

			let fadeIn = self.fadeIn = (seconds) => {
				//REQUIRED: seconds

				if (gainNode !== undefined) {
					gainNode.gain.setValueAtTime(0, 0);
					gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + seconds);
				}

				else {
					fadeInSeconds = seconds;
				}

				play();
			};

			let fadeOut = self.fadeOut = (seconds) => {
				//REQUIRED: seconds

				if (gainNode !== undefined) {
					gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + seconds);
				}

				DELAY(seconds, () => {
					stop();
				});
			};

			let getDuration = self.getDuration = () => {
				return duration;
			};

			let on = self.on = (eventName, eventHandler) => {
				//REQUIRED: eventName
				//REQUIRED: eventHandler

				if (eventMap[eventName] === undefined) {
					eventMap[eventName] = [];
				}

				eventMap[eventName].push(eventHandler);

				if (eventName === 'load' && isLoaded === true) {
					fireEvent('load');
					off('load');
				}
			};

			let checkIsEventExists = self.checkIsEventExists = (eventName) => {
				//REQUIRED: eventName

				return eventMap[eventName] !== undefined;
			};

			let off = self.off = (eventName, eventHandler) => {
				//REQUIRED: eventName
				//OPTIONAL: eventHandler

				if (eventMap[eventName] !== undefined) {

					if (eventHandler !== undefined) {

						REMOVE({
							array: eventMap[eventName],
							value: eventHandler
						});
					}

					if (eventHandler === undefined || eventMap[eventName].length === 0) {
						delete eventMap[eventName];
					}
				}
			};

			let fireEvent = self.fireEvent = (eventNameOrParams) => {
				//REQUIRED: eventNameOrParams
				//REQUIRED: eventNameOrParams.eventName
				//OPTIONAL: eventNameOrParams.e

				let eventName;
				let e;

				if (CHECK_IS_DATA(eventNameOrParams) !== true) {
					eventName = eventNameOrParams;
				} else {
					eventName = eventNameOrParams.eventName;
					e = eventNameOrParams.e;
				}

				let eventHandlers = eventMap[eventName];

				if (eventHandlers !== undefined) {

					for (let i = 0; i < eventHandlers.length; i += 1) {
						eventHandlers[i](e === undefined ? EMPTY_E() : e, self);
					}
				}
			};

			ready();
		}
	};
});

/*
 * 사운드 파일을 한번 재생하는 SOUND_ONCE 클래스
 */
global.SOUND_ONCE = CLASS({

	preset: () => {
		return SOUND;
	},

	init: (inner, self, params, onEndHandler) => {
		//REQUIRED: params
		//OPTIONAL: params.ogg
		//OPTIONAL: params.mp3
		//OPTIONAL: params.wav
		//OPTIONAL: params.isLoop
		//OPTIONAL: params.volume
		//OPTIONAL: onEndHandler

		self.play();
	}
});

/*
 * 저장소 클래스
 * 
 * 웹 브라우저가 종료되어도 저장된 값들이 보존됩니다.
 */
global.STORE = CLASS({

	init: (inner, self, storeName) => {
		//REQUIRED: storeName

		// gen full name.
		let genFullName = (name) => {
			//REQUIRED: name

			return storeName + '.' + name;
		};

		let save = self.save = (params) => {
			//REQUIRED: params
			//REQUIRED: params.name
			//REQUIRED: params.value

			let name = params.name;
			let value = params.value;

			localStorage.setItem(genFullName(name), STRINGIFY(value));
		};

		let get = self.get = (name) => {
			//REQUIRED: name

			let value = PARSE_STR(localStorage.getItem(genFullName(name)));

			if (value === TO_DELETE) {
				value = undefined;
			}

			return value;
		};

		let remove = self.remove = (name) => {
			//REQUIRED: name

			localStorage.removeItem(genFullName(name));
		};

		let all = self.all = () => {

			let all = {};

			EACH(localStorage, (value, fullName) => {

				if (fullName.indexOf(storeName + '.') === 0) {

					all[fullName.substring(storeName.length + 1)] = PARSE_STR(value);
				}
			});

			return all;
		};

		let count = self.count = () => {

			let count = 0;

			EACH(localStorage, (value, fullName) => {

				if (fullName.indexOf(storeName + '.') === 0) {
					count += 1;
				}
			});

			return count;
		};

		let clear = self.clear = () => {

			EACH(localStorage, (value, fullName) => {

				if (fullName.indexOf(storeName + '.') === 0) {

					remove(fullName.substring(storeName.length + 1));
				}
			});
		};
	}
});

FOR_BOX((box) => {

	box.STORE = CLASS({

		init: (inner, self, storeName) => {
			//REQUIRED: storeName

			let store = STORE(box.boxName + '.' + storeName);

			let save = self.save = store.save;

			let get = self.get = store.get;

			let remove = self.remove = store.remove;

			let all = self.all = store.all;

			let count = self.count = store.count;

			let clear = self.clear = store.clear;
		}
	});
});

/*
 * 웹 워커 클래스
 */
global.WORKER = CLASS({

	init: (inner, self, src) => {
		//REQUIRED: src

		let methodMap = {};
		let sendKey = 0;

		let worker = new Worker(src);

		let runMethods = (methodName, data, sendKey) => {

			let methods = methodMap[methodName];

			if (methods !== undefined) {

				EACH(methods, (method) => {

					// run method.
					method(data, (retData) => {

						if (send !== undefined && sendKey !== undefined) {

							send({
								methodName: '__CALLBACK_' + sendKey,
								data: retData
							});
						}
					});
				});
			}
		};

		let on = self.on = (methodName, method) => {
			//REQUIRED: methodName
			//REQUIRED: method

			let methods = methodMap[methodName];

			if (methods === undefined) {
				methods = methodMap[methodName] = [];
			}

			methods.push(method);
		};

		worker.onmessage = (e) => {
			runMethods(e.data.methodName, e.data.data, e.data.sendKey);
		};

		let off = self.off = (methodName, method) => {
			//REQUIRED: methodName
			//OPTIONAL: method

			let methods = methodMap[methodName];

			if (methods !== undefined) {

				if (method !== undefined) {

					REMOVE({
						array: methods,
						value: method
					});

				} else {
					delete methodMap[methodName];
				}
			}
		};

		let send = self.send = (methodNameOrParams, callback) => {
			//REQUIRED: methodNameOrParams
			//REQUIRED: methodNameOrParams.methodName
			//OPTIONAL: methodNameOrParams.data
			//OPTIONAL: callback

			let methodName;
			let data;

			if (CHECK_IS_DATA(methodNameOrParams) !== true) {
				methodName = methodNameOrParams;
			} else {
				methodName = methodNameOrParams.methodName;
				data = methodNameOrParams.data;
			}

			worker.postMessage({
				methodName: methodName,
				data: data,
				sendKey: sendKey
			});

			if (callback !== undefined) {

				let callbackName = '__CALLBACK_' + sendKey;

				// on callback.
				on(callbackName, (data) => {

					// run callback.
					callback(data);

					// off callback.
					off(callbackName);
				});
			}

			sendKey += 1;
		};

		let remove = self.remove = () => {
			worker.terminate();
			worker = undefined;
		};
	}
});
FOR_BOX((box) => {

	box.SHOW_ERROR = METHOD({

		run: (tag, errorMsg, params) => {
			//REQUIRED: tag
			//REQUIRED: errorMsg
			//OPTIONAL: params

			SHOW_ERROR(box.boxName + '.' + tag, errorMsg, params);
		}
	});
});
FOR_BOX((box) => {

	box.SHOW_WARNING = METHOD({

		run: (tag, warningMsg, params) => {
			//REQUIRED: tag
			//REQUIRED: warningMsg
			//OPTIONAL: params

			SHOW_WARNING(box.boxName + '.' + tag, warningMsg, params);
		}
	});
});
/*
 * 노드에 스타일을 지정합니다.
 */
global.ADD_STYLE = METHOD({
	
	run : (params) => {
		//REQUIRED: params
		//REQUIRED: params.node		스타일을 지정할 노드
		//REQUIRED: params.style	스타일 데이터

		let node = params.node;
		let style = params.style;
		
		if (CHECK_IS_ARRAY(style) === true) {
			
			EACH(style, (style) => {
				
				ADD_STYLE({
					node : node,
					style : style
				});
			});
		}
		
		else {
			
			let el = node.getWrapperEl();

			EACH(style, (value, name) => {
				
				if (value !== undefined) {
	
					// on display resize
					if (name === 'onDisplayResize') {
	
						let resizeEvent = EVENT({
							name : 'resize'
						}, RAR(() => {
	
							// when this, value is function.
							ADD_STYLE({
								node : node,
								style : value(WIN_WIDTH(), WIN_HEIGHT())
							});
							
							DELAY(() => {
								ADD_STYLE({
									node : node,
									style : value(WIN_WIDTH(), WIN_HEIGHT())
								});
							});
						}));
	
						// remove resize event when remove node.
						node.on('remove', () => {
							resizeEvent.remove();
						});
	
					} else if (el !== undefined) {
						
						// flt -> float
						if (name === 'flt') {
							el.style.cssFloat = value;
						}
	
						// assume number value is px value.
						else if (typeof value === 'number' && name !== 'zIndex' && name !== 'opacity') {
							el.style[name] = value + 'px';
						}
						
						// set background image. (not need url prefix.)
						else if (name === 'backgroundImage' && value !== 'none') {
							el.style[name] = 'url(' + value + ')';
						}
	
						// set normal style.
						else {
							el.style[name] = value;
						}
					}
				}
			});
		}
	}
});

/*
 * 노드에 애니메이션을 지정합니다.
 */
global.ANIMATE = METHOD((m) => {
	
	let keyframesCount = 0;
	
	return {
		
		run : (params, animationEndHandler) => {
			//REQUIRED: params
			//REQUIRED: params.node				애니메이션을 지정할 노드
			//REQUIRED: params.keyframes		애니메이션 키 프레임
			//OPTIONAL: params.duration			애니메이션 지속 시간 (입력하지 않으면 0.5)
			//OPTIONAL: params.timingFunction	애니메이션 작동 방식, 점점 빨라지거나, 점점 느려지거나, 점점 빨라졌다 끝에서 점점 느려지는 등의 처리 (입력하지 않으면 'ease', 'linear', 'ease', 'ease-in', 'ease-out' 사용 가능)
			//OPTIONAL: params.delay			애니메이션이 발동하기 전 지연 시간 (입력하지 않으면 0)
			//OPTIONAL: params.iterationCount	애니메이션을 몇번 발동시킬지 (입력하지 않으면 1, 계속 애니메이션이 발동되도록 하려면 'infinite' 지정)
			//OPTIONAL: params.direction		애니메이션의 방향 (입력하지 않으면 'normal', 'reverse', 'alternate', 'alternate-reverse' 사용 가능)
			//OPTIONAL: animationEndHandler		애니메이션이 끝날 때 호출될 핸들러
			
			let node = params.node;
			let keyframes = params.keyframes;
			let duration = params.duration === undefined ? 0.5 : params.duration;
			let timingFunction = params.timingFunction === undefined ? 'ease' : params.timingFunction;
			let delay = params.delay === undefined ? 0 : params.delay;
			let iterationCount = params.iterationCount === undefined ? 1 : params.iterationCount;
			let direction = params.direction === undefined ? 'normal' : params.direction;
			
			let keyframesName = '__KEYFRAMES_' + keyframesCount;
			let keyframesStr = '';
			
			let keyframesStartStyle;
			let keyframesFinalStyle;
			
			keyframesCount += 1;
			
			EACH(keyframes, (style, key) => {
				
				keyframesStr += key + '{';
	
				EACH(style, (value, name) => {
	
					if (typeof value === 'number' && name !== 'zIndex' && name !== 'opacity') {
						value = value + 'px';
					}
	
					keyframesStr += name.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + value + ';';
				});
	
				keyframesStr += '}';
	
				if (key === 'from' || key === '0%') {
					keyframesStartStyle = style;
				} else if (key === 'to' || key === '100%') {
					keyframesFinalStyle = style;
				}
			});
			
			// create keyframes style element.
			let keyframesStyleEl = document.createElement('style');
			keyframesStyleEl.type = 'text/css';
			keyframesStyleEl.appendChild(document.createTextNode('@keyframes ' + keyframesName + '{' + keyframesStr + '}'));
			document.getElementsByTagName('head')[0].appendChild(keyframesStyleEl);
			
			node.addStyle(keyframesStartStyle);
			
			node.addStyle({
				animation : keyframesName + ' ' + duration + 's ' + timingFunction + ' ' + delay + 's ' + iterationCount + ' ' + direction
			});
			
			node.addStyle(keyframesFinalStyle);
	
			if (animationEndHandler !== undefined && iterationCount === 1) {
				
				DELAY(duration, () => {
					if (node.checkIsRemoved() !== true) {
						animationEndHandler(node);
					}
				});
			}
		}
	};
});


/*
 * clear : 'both' 스타일이 지정된 div를 생성합니다.
 */
global.CLEAR_BOTH = CLASS({

	preset : () => {
		return DIV;
	},

	params : () => {
		return {
			style : {
				clear : 'both'
			}
		};
	}
});

/*
 * DOM 객체를 생성하고 다루는 클래스
 */
global.DOM = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.tag		생설할 DOM 객체에 해당하는 태그 지정
		//OPTIONAL: params.el		태그를 지정하지 않고 HTML element를 직접 지정
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트
		//OPTIONAL: params.__TEXT	UPPERCASE가 문자열 DOM 객체를 생성하기 위해 내부적으로 사용하는 파라미터

		let tag = params.tag;
		let el = params.el;
		let id = params.id;
		let cls = params.cls;
		let __TEXT = params.__TEXT;

		// when tag is not undefined
		if (tag !== undefined) {

			if (tag === 'body') {
				el = document.body;
			} else if (tag === '__STRING') {
				el = document.createTextNode(__TEXT);
			} else {
				el = document.createElement(tag);
			}
		}

		// when tag is undefined, el is not undefined
		else if (el !== document.body && el.parentNode !== TO_DELETE) {

			self.setParent(DOM({
				el : el.parentNode
			}));
		}

		let getEl = self.getEl = () => {
			return el;
		};

		let setEl = inner.setEl = (_el) => {
			//REQUIRED: _el

			el = _el;

			inner.setDom(self);
		};

		setEl(el);

		let setAttr = inner.setAttr = (params) => {
			//REQUIRED: params
			//REQUIRED: params.name
			//REQUIRED: params.value

			let name = params.name;
			let value = params.value;

			el.setAttribute(name, value);
		};
		
		if (id !== undefined) {
			setAttr({
				name : 'id',
				value : id
			});
		}
		
		if (cls !== undefined) {
			setAttr({
				name : 'class',
				value : cls
			});
		}
	}
});

/*
 * DOM 트리 구조를 정의하기 위한 NODE 클래스
 */
global.NODE = CLASS({

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let wrapperDom;
		let contentDom;
		
		let wrapperEl;
		let contentEl;
		
		let waitingAfterNodes;
		let waitingBeforeNodes;
		
		let parentNode;
		let childNodes = [];
		
		let originDisplay;
		let data;
		
		let isRemoved = false;

		let setWrapperDom = inner.setWrapperDom = (dom) => {
			//REQUIRED: dom

			wrapperDom = dom;
			wrapperEl = dom.getEl();

			on('show', () => {

				EACH(childNodes, (childNode) => {

					if (childNode.checkIsShowing() === true) {

						EVENT.fireAll({
							node : childNode,
							name : 'show'
						});

						EVENT.removeAll({
							node : childNode,
							name : 'show'
						});
					}
				});
			});
		};

		let setContentDom = inner.setContentDom = (dom) => {
			//REQUIRED: dom

			contentDom = dom;
			contentEl = dom.getEl();
		};

		let setDom = inner.setDom = (dom) => {
			//REQUIRED: dom

			setWrapperDom(dom);
			setContentDom(dom);
		};

		let getWrapperDom = self.getWrapperDom = () => {
			return wrapperDom;
		};

		let getContentDom = self.getContentDom = () => {
			return contentDom;
		};

		let getWrapperEl = self.getWrapperEl = () => {
			return wrapperEl;
		};

		let getContentEl = self.getContentEl = () => {
			return contentEl;
		};

		let attach = (node, index) => {
			//REQUIRED: node
			//OPTIOANL: index

			setParent(node);

			if (index === undefined) {
				parentNode.getChildren().push(self);
			} else {
				parentNode.getChildren().splice(index, 0, self);
			}
			
			fireEvent('attach');

			if (checkIsShowing() === true) {

				fireEvent('show');

				EVENT.removeAll({
					node : self,
					name : 'show'
				});
			}

			// run after wating after nodes.
			if (waitingAfterNodes !== undefined) {
				EACH(waitingAfterNodes, (node) => {
					after(node);
				});
			}

			// run before wating before nodes.
			if (waitingBeforeNodes !== undefined) {
				EACH(waitingBeforeNodes, (node) => {
					before(node);
				});
			}
			
			parentNode.fireEvent('append');
		};

		let append = self.append = (node) => {
			//REQUIRED: node
			
			// append child.
			if (CHECK_IS_DATA(node) === true) {
				node.appendTo(self);
			}

			// append textarea content.
			else if (self.type === TEXTAREA) {

				append(DOM({
					tag : '__STRING',
					__TEXT : String(node === undefined ? '' : node)
				}));
			}

			// append string.
			else {

				let splits = String(node === undefined ? '' : node).split('\n');

				EACH(splits, (text, i) => {

					append(DOM({
						tag : '__STRING',
						__TEXT : text
					}));

					if (i < splits.length - 1) {
						append(BR());
					}
				});
			}
		};

		let appendTo = self.appendTo = (node) => {
			//REQUIRED: node
			
			let parentEl = node.getContentEl();

			if (parentEl !== undefined) {
				
				parentEl.appendChild(wrapperEl);

				attach(node);
			}

			return self;
		};

		let prepend = self.prepend = (node) => {
			//REQUIRED: node

			// prepend child.
			if (CHECK_IS_DATA(node) === true) {
				node.prependTo(self);
			}

			// prepend textarea content.
			else if (self.type === TEXTAREA) {

				prepend(DOM({
					tag : '__STRING',
					__TEXT : String(node === undefined ? '' : node)
				}));
			}

			// prepend string.
			else {

				let splits = String(node === undefined ? '' : node).split('\n');

				REPEAT({
					start : splits.length - 1,
					end : 0
				}, (i) => {

					prepend(DOM({
						tag : '__STRING',
						__TEXT : splits[i]
					}));

					if (i < splits.length - 1) {
						prepend(BR());
					}
				});
			}
		};

		let prependTo = self.prependTo = (node) => {
			//REQUIRED: node

			let parentEl = node.getContentEl();

			if (parentEl !== undefined) {
				
				if (parentEl.childNodes[0] === undefined) {
					parentEl.appendChild(wrapperEl);
				} else {
					parentEl.insertBefore(wrapperEl, parentEl.childNodes[0]);
				}

				attach(node, 0);
			}

			return self;
		};

		let after = self.after = (node) => {
			//REQUIRED: node

			if (wrapperEl !== undefined) {
	
				// wait after node.
				if (wrapperEl.parentNode === TO_DELETE) {
	
					if (waitingAfterNodes === undefined) {
						waitingAfterNodes = [];
					}
	
					waitingAfterNodes.push(node);
				}
	
				// after node.
				else {
	
					// after child.
					if (CHECK_IS_DATA(node) === true) {
						node.insertAfter(self);
					}
	
					// after string.
					else {
	
						let splits = String(node === undefined ? '' : node).split('\n');
	
						REPEAT({
							start : splits.length - 1,
							end : 0
						}, (i) => {
	
							after(DOM({
								tag : '__STRING',
								__TEXT : splits[i]
							}));
	
							if (i < splits.length - 1) {
								after(BR());
							}
						});
					}
				}
			}
		};

		let insertAfter = self.insertAfter = (node) => {
			//REQUIRED: node

			let beforeEl = node.getWrapperEl();
			
			if (beforeEl !== undefined) {
				
				beforeEl.parentNode.insertBefore(wrapperEl, beforeEl.nextSibling);
				
				let nowIndex = FIND({
					array : node.getParent().getChildren(),
					value : self
				});
				
				let toIndex = FIND({
					array : node.getParent().getChildren(),
					value : node
				}) + 1;

				attach(node.getParent(), nowIndex < toIndex ? toIndex - 1 : toIndex);
			}

			return self;
		};

		let before = self.before = (node) => {
			//REQUIRED: node
			
			if (wrapperEl !== undefined) {
	
				// wait before node.
				if (wrapperEl.parentNode === TO_DELETE) {
	
					if (waitingBeforeNodes === undefined) {
						waitingBeforeNodes = [];
					}
	
					waitingBeforeNodes.push(node);
				}
	
				// before node.
				else {
	
					// before child.
					if (CHECK_IS_DATA(node) === true) {
						node.insertBefore(self);
					}
	
					// before string.
					else {
	
						let splits = String(node === undefined ? '' : node).split('\n');
	
						EACH(splits, (text, i) => {
	
							before(DOM({
								tag : '__STRING',
								__TEXT : text
							}));
	
							if (i < splits.length - 1) {
								before(BR());
							}
						});
					}
				}
			}
		};

		let insertBefore = self.insertBefore = (node) => {
			//REQUIRED: node

			let afterEl = node.getWrapperEl();

			if (afterEl !== undefined) {
				
				afterEl.parentNode.insertBefore(wrapperEl, afterEl);

				attach(node.getParent(), FIND({
					array : node.getParent().getChildren(),
					value : node
				}));
			}

			return self;
		};

		let getChildren = self.getChildren = () => {
			return childNodes;
		};

		let setParent = self.setParent = (node) => {
			//OPTIONAL: node
			
			if (parentNode !== undefined) {
				REMOVE({
					array : parentNode.getChildren(),
					value : self
				});
			}

			parentNode = node;
		};
		
		let getParent = self.getParent = () => {
			return parentNode;
		};

		let empty = self.empty = () => {
			EACH(childNodes, (child) => {
				child.remove();
			});
		};

		let remove = self.remove = () => {

			if (wrapperEl !== undefined && wrapperEl.parentNode !== TO_DELETE) {

				fireEvent('beforeRemove');

				// empty children.
				empty();
				
				wrapperDom.empty();

				// remove from parent node.
				wrapperEl.parentNode.removeChild(wrapperEl);

				setParent(undefined);

				fireEvent('remove');
			}
			
			if (wrapperEl !== undefined) {
				wrapperEl.remove();
			}
			if (contentEl !== undefined) {
				contentEl.remove();
			}

			// free memory.
			wrapperEl = undefined;
			contentEl = undefined;

			EVENT.removeAll({
				node : self
			});

			EVENT.removeAll({
				node : wrapperDom
			});
			
			// free memory.
			data = undefined;
			
			isRemoved = true;
		};
		
		let checkIsRemoved = self.checkIsRemoved = () => {
			return isRemoved;
		};

		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler
			
			EVENT({
				node : self,
				name : eventName
			}, eventHandler);
		};

		let off = self.off = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//OPTIONAL: eventHandler

			if (eventHandler !== undefined) {

				EVENT.remove({
					node : self,
					name : eventName
				}, eventHandler);

			} else {

				EVENT.removeAll({
					node : self,
					name : eventName
				});
			}
		};
		
		let fireEvent = self.fireEvent = (nameOrParams) => {
			//REQUIRED: nameOrParams
			//REQUIRED: nameOrParams.name	이벤트 이름
			//OPTIONAL: nameOrParams.e
			
			let name;
			let e;
			
			// init params.
			if (CHECK_IS_DATA(nameOrParams) !== true) {
				name = nameOrParams;
			} else {
				name = nameOrParams.name;
				e = nameOrParams.e;
			}
			
			return EVENT.fireAll({
				node : self,
				name : name,
				e : e
			});
		};

		let addStyle = self.addStyle = (style) => {
			//REQUIRED: style

			ADD_STYLE({
				node : self,
				style : style
			});
		};

		let getStyle = self.getStyle = (name) => {
			//REQUIRED: name
			
			if (wrapperEl !== undefined) {

				let styles = wrapperEl.style;

				if (styles !== undefined) {

					let style = styles[name];

					return style === '' ? undefined : (style.substring(style.length - 2) === 'px' ? REAL(style) : style);
				}
			}
		};

		let getWidth = self.getWidth = () => {
			return wrapperEl === undefined ? 0 : wrapperEl.offsetWidth;
		};

		let getInnerWidth = self.getInnerWidth = () => {
			return wrapperEl === undefined ? 0 : wrapperEl.clientWidth;
		};

		let getHeight = self.getHeight = () => {
			return wrapperEl === undefined ? 0 : wrapperEl.offsetHeight;
		};

		let getInnerHeight = self.getInnerHeight = () => {
			return wrapperEl === undefined ? 0 : wrapperEl.clientHeight;
		};

		let getLeft = self.getLeft = () => {

			let left = 0;
			
			let parentEl = wrapperEl;

			do {
				left += parentEl.offsetLeft - (parentEl === document.body ? 0 : parentEl.scrollLeft);
				parentEl = parentEl.offsetParent;
			} while (parentEl !== TO_DELETE);

			return left;
		};

		let getTop = self.getTop = () => {

			let top = 0;
			
			let parentEl = wrapperEl;

			do {
				top += parentEl.offsetTop - (parentEl === document.body ? 0 : parentEl.scrollTop);
				parentEl = parentEl.offsetParent;
			} while (parentEl !== TO_DELETE);

			return top;
		};

		let hide = self.hide = () => {
			
			originDisplay = getStyle('display');
			
			if (originDisplay === 'none') {
				originDisplay = undefined;
			}

			addStyle({
				display : 'none'
			});
		};

		let show = self.show = () => {

			addStyle({
				display : originDisplay === undefined ? '' : originDisplay
			});

			if (checkIsShowing() === true) {

				EVENT.fireAll({
					node : self,
					name : 'show'
				});

				EVENT.removeAll({
					node : self,
					name : 'show'
				});
			}
		};

		let checkIsHiding = self.checkIsHiding = () => {
			return checkIsShowing() !== true;
		};

		let checkIsShowing = self.checkIsShowing = () => {

			if (wrapperEl === document.body) {
				return true;
			} else {
				return getStyle('display') !== 'none' && getWidth() > 0;
			}
		};
		
		let scrollTo = self.scrollTo = (params) => {
			//REQUIRED: params
			//OPTIONAL: params.left
			//OPTIONAL: params.top
			
			let left = params.left;
			let top = params.top;
			
			if (contentEl !== undefined) {
			
				if (left !== undefined) {
					contentEl.scrollLeft = left;
				}
				
				if (top !== undefined) {
					contentEl.scrollTop = top;
				}
			}
		};
		
		let getScrollLeft = self.getScrollLeft = () => {
			if (contentEl !== undefined) {
				return contentEl.scrollLeft;
			} else {
				return 0;
			}
		};
		
		let getScrollTop = self.getScrollTop = () => {
			if (contentEl !== undefined) {
				return contentEl.scrollTop;
			} else {
				return 0;
			}
		};
		
		let getScrollWidth = self.getScrollWidth = () => {
			if (contentEl !== undefined) {
				return contentEl.scrollWidth;
			} else {
				return 0;
			}
		};
		
		let getScrollHeight = self.getScrollHeight = () => {
			if (contentEl !== undefined) {
				return contentEl.scrollHeight;
			} else {
				return 0;
			}
		};
		
		let setData = self.setData = (_data) => {
			//REQUIRED: _data
			
			data = _data;
		};
		
		let getData = self.getData = () => {
			return data;
		};
	},

	afterInit : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let style;
		let children;
		let on;

		// init params.
		if (params !== undefined) {
			style = params.style;
			children = params.c === undefined || CHECK_IS_ARRAY(params.c) === true ? params.c : [params.c];
			on = params.on;
		}

		if (style !== undefined) {
			self.addStyle(style);
		}

		if (on !== undefined) {
			EACH(on, (handler, name) => {
				if (handler !== undefined) {
					self.on(name, handler);
				}
			});
		}

		if (children !== undefined) {
			EACH(children, (child, i) => {
				self.append(child);
			});
		}
	}
});

/*
 * 이벤트 정보를 제공하는 객체를 생성하는 E 클래스
 */
global.E = CLASS({

	init: (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.e
		//REQUIRED: params.el

		let e = params.e;
		let el = params.el;

		let isBubblingStoped;

		let checkIsDescendant = (parent, child) => {

			let node = child.parentNode;

			while (node !== TO_DELETE) {

				if (node === parent) {
					return true;
				}

				node = node.parentNode;
			}

			return false;
		};

		let stopDefault = self.stopDefault = () => {
			e.preventDefault();
		};

		let stopBubbling = self.stopBubbling = () => {
			e.stopPropagation();
			isBubblingStoped = true;
		};

		let checkIsBubblingStoped = self.checkIsBubblingStoped = () => {
			return isBubblingStoped;
		};

		let stop = self.stop = () => {
			stopDefault();
			stopBubbling();
		};

		let getLeft = self.getLeft = () => {

			if (
				INFO.checkIsTouchDevice() === true &&
				e.changedTouches !== undefined &&
				e.changedTouches[0] !== undefined) {

				let touchPageX;

				EACH(e.changedTouches, (touch) => {
					if (touch.target !== undefined && checkIsDescendant(el, touch.target) === true) {
						touchPageX = touch.pageX;
						return false;
					}
				});

				if (touchPageX === undefined) {
					touchPageX = e.changedTouches[0].pageX;
				}

				if (touchPageX !== undefined) {
					return touchPageX;
				}
			}

			return e.pageX;
		};

		let getTop = self.getTop = () => {

			if (
				INFO.checkIsTouchDevice() === true &&
				e.changedTouches !== undefined &&
				e.changedTouches[0] !== undefined) {

				let touchPageY;

				EACH(e.changedTouches, (touch) => {
					if (touch.target !== undefined && checkIsDescendant(el, touch.target) === true) {
						touchPageY = touch.pageY;
						return false;
					}
				});

				if (touchPageY === undefined) {
					touchPageY = e.changedTouches[0].pageY;
				}

				if (touchPageY !== undefined) {
					return touchPageY;
				}
			}

			return e.pageY;
		};

		let getPositions = self.getPositions = () => {

			if (
				INFO.checkIsTouchDevice() === true &&
				e.changedTouches !== undefined &&
				e.changedTouches[0] !== undefined) {

				let positions = [];

				EACH(e.changedTouches, (touch) => {
					positions.push({
						left: touch.pageX,
						top: touch.pageY
					});
				});

				return positions;
			}

			return [{
				left: e.pageX,
				top: e.pageY
			}];
		};

		let getKey = self.getKey = () => {
			return e.key;
		};

		let getButtonIndex = self.getButtonIndex = () => {
			return e.button;
		};

		let getWheelDelta = self.getWheelDelta = () => {
			return e.deltaY * (INFO.getBrowserName() === 'Firefox' ? 33 : 1);
		};

		let getGamePadData = self.getGamePadData = () => {
			return e.gamepad;
		};

		let getFiles = self.getFiles = () => {
			return e.dataTransfer.files;
		};

		let getClipboardItems = self.getClipboardItems = () => {
			return e.clipboardData === undefined || e.clipboardData.items === undefined ? [] : e.clipboardData.items;
		};
	}
});

/*
 * 빈 이벤트 정보를 제공하는 객체를 생성하는 EMPTY_E 클래스
 */
global.EMPTY_E = CLASS({

	init: (inner, self) => {

		let stopDefault = self.stopDefault = () => {
			// ignore.
		};

		let stopBubbling = self.stopBubbling = () => {
			// ignore.
		};

		let stop = self.stop = () => {
			// ignore.
		};

		let getLeft = self.getLeft = () => {
			return -Infinity;
		};

		let getTop = self.getTop = () => {
			return -Infinity;
		};

		let getPositions = self.getPositions = () => {
			return [];
		};

		let getKey = self.getKey = () => {
			return '';
		};

		let getWheelDelta = self.getWheelDelta = () => {
			return 0;
		};

		let getClipboardItems = self.getClipboardItems = () => {
			return [];
		};
	}
});

/*
 * 노드의 이벤트 처리를 담당하는 EVENT 클래스
 */
global.EVENT = CLASS((cls) => {

	let eventMaps = {};

	let fireAll = cls.fireAll = (nameOrParams) => {
		//REQUIRED: nameOrParams
		//OPTIONAL: nameOrParams.node	이벤트가 등록된 노드
		//REQUIRED: nameOrParams.name	이벤트 이름
		//OPTIONAL: nameOrParams.e

		let node;
		let name;
		let e;

		let nodeId;

		let eventMap;

		let ret;

		// init params.
		if (CHECK_IS_DATA(nameOrParams) !== true) {
			name = nameOrParams;
		} else {
			node = nameOrParams.node;
			name = nameOrParams.name;
			e = nameOrParams.e;
		}

		if (node === undefined) {
			nodeId = 'body';
		} else {
			nodeId = node.id;
		}

		eventMap = eventMaps[nodeId];

		if (eventMap !== undefined) {

			let events = eventMap[name];

			if (events !== undefined) {

				EACH(events, (evt) => {

					if (evt.fire(e) === false) {

						ret = false;
					}
				});
			}
		}

		return ret;
	};

	let removeAll = cls.removeAll = (nameOrParams) => {
		//OPTIONAL: nameOrParams
		//OPTIONAL: nameOrParams.node	이벤트가 등록된 노드
		//OPTIONAL: nameOrParams.name	이벤트 이름

		let node;
		let name;

		let nodeId;

		let eventMap;

		// init params.
		if (CHECK_IS_DATA(nameOrParams) !== true) {
			name = nameOrParams;
		} else {
			node = nameOrParams.node;
			name = nameOrParams.name;
		}

		if (node === undefined) {
			nodeId = 'body';
		} else {
			nodeId = node.id;
		}

		eventMap = eventMaps[nodeId];

		if (eventMap !== undefined) {

			if (name !== undefined) {

				let events = eventMap[name];

				if (events !== undefined) {

					EACH(events, (evt) => {
						evt.remove();
					});
				}

			} else {

				EACH(eventMap, (events) => {
					EACH(events, (evt) => {
						evt.remove();
					});
				});
			}
		}
	};

	let remove = cls.remove = (nameOrParams, eventHandler) => {
		//REQUIRED: nameOrParams
		//OPTIONAL: nameOrParams.node	이벤트가 등록된 노드
		//REQUIRED: nameOrParams.name	이벤트 이름
		//REQUIRED: eventHandler

		let node;
		let name;

		let nodeId;

		let eventMap;

		// init params.
		if (CHECK_IS_DATA(nameOrParams) !== true) {
			name = nameOrParams;
		} else {
			node = nameOrParams.node;
			name = nameOrParams.name;
		}

		if (node === undefined) {
			nodeId = 'body';
		} else {
			nodeId = node.id;
		}

		eventMap = eventMaps[nodeId];

		if (eventMap !== undefined) {

			let events = eventMap[name];

			if (events !== undefined) {

				EACH(events, (evt) => {
					if (evt.getEventHandler() === eventHandler) {
						evt.remove();
					}
				});
			}
		}
	};

	return {

		init: (inner, self, nameOrParams, eventHandler) => {
			//REQUIRED: nameOrParams
			//OPTIONAL: nameOrParams.node		이벤트를 등록 및 적용할 노드
			//OPTIONAL: nameOrParams.lowNode	이벤트 '등록'은 node 파라미터에 지정된 노드에 하지만, 실제 이벤트의 동작을 '적용'할 노드는 다른 경우 해당 노드
			//REQUIRED: nameOrParams.name		이벤트 이름
			//REQUIRED: eventHandler

			let node;
			let lowNode;
			let name;

			let nodeId;

			let eventLows = [];

			let subEvent;

			let lastTapTime;

			// init params.
			if (CHECK_IS_DATA(nameOrParams) !== true) {
				name = nameOrParams;
			} else {
				node = nameOrParams.node;
				lowNode = nameOrParams.lowNode;
				name = nameOrParams.name;

				if (lowNode === undefined) {
					lowNode = node;
				}
			}

			if (node === undefined) {
				nodeId = 'body';
			} else {
				nodeId = node.id;
			}

			// push event to map.

			if (eventMaps[nodeId] === undefined) {
				eventMaps[nodeId] = {};
			}

			if (eventMaps[nodeId][name] === undefined) {
				eventMaps[nodeId][name] = [];
			}

			eventMaps[nodeId][name].push(self);

			let removeFromMap = () => {

				let events = eventMaps[nodeId][name];

				if (events !== undefined) {

					REMOVE({
						array: events,
						value: self
					});

					if (events.length <= 0) {
						delete eventMaps[nodeId][name];
					}
				}

				if (CHECK_IS_EMPTY_DATA(eventMaps[nodeId]) === true) {
					delete eventMaps[nodeId];
				}
			};

			// tap event (simulate click event.)
			if (name === 'tap') {

				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'click'
				}, eventHandler));
			}

			// when is not touch mode, simulate
			else if (name === 'doubletap') {

				if (INFO.checkIsTouchDevice() === true) {

					subEvent = EVENT({
						node: node,
						name: 'tap'
					}, (e) => {

						if (lastTapTime !== undefined && Date.now() - lastTapTime < 600) {

							eventHandler(e, node);

							// clear text selections.
							getSelection().removeAllRanges();

							lastTapTime = undefined;
						}

						else {
							lastTapTime = Date.now();
						}
					});
				}

				else {
					eventLows.push(EVENT_LOW({
						node: node,
						lowNode: lowNode,
						name: 'dblclick'
					}, eventHandler));
				}
			}

			// when is not touch mode, touchmove link to mousedown event
			else if (name === 'touchstart') {

				// by touch
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'touchstart'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() === true) {
						eventHandler(e, node);
					}
				}));

				// by mouse
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'mousedown'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() !== true) {
						eventHandler(e, node);
					}
				}));
			}

			// when is not touch mode, touchmove link to mousemove event
			else if (name === 'touchmove') {

				// by touch
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'touchmove'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() === true) {
						eventHandler(e, node);
					}
				}));

				// by mouse
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'mousemove'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() !== true) {
						eventHandler(e, node);
					}
				}));
			}

			// when is not touch mode, touchend link to mouseup event
			else if (name === 'touchend') {

				// by touch
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'touchend'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() === true) {
						eventHandler(e, node);
					}
				}));

				// by mouse
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'mouseup'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() !== true) {
						eventHandler(e, node);
					}
				}));
			}

			// mouseover event (when is touch mode, link to touchstart event.)
			else if (name === 'mouseover') {

				// by touch
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'touchstart'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() === true) {
						eventHandler(e, node);
					}
				}));

				// by mouse
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'mouseover'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() !== true) {
						eventHandler(e, node);
					}
				}));
			}

			// mouseout event (when is touch mode, link to touchend event.)
			else if (name === 'mouseout') {

				// by touch
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'touchend'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() === true) {
						eventHandler(e, node);
					}
				}));

				// by mouse
				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'mouseout'
				}, (e, node) => {
					if (INFO.checkIsTouchDevice() !== true) {
						eventHandler(e, node);
					}
				}));
			}

			else if (name === 'keydown') {

				let lastKey;

				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'keydown'
				}, (e, node) => {
					if (lastKey !== e.getKey()) {
						eventHandler(e, node);
						lastKey = e.getKey();
					}
				}));

				eventLows.push(EVENT_LOW({
					node: node,
					lowNode: lowNode,
					name: 'keyup'
				}, (e, node) => {
					lastKey = undefined;
				}));
			}

			// other events
			else if (name !== 'attach' && name !== 'show' && name !== 'remove') {
				eventLows.push(EVENT_LOW(nameOrParams, eventHandler));
			}

			let remove = self.remove = () => {

				EACH(eventLows, (eventLow) => {
					eventLow.remove();
				});

				if (subEvent !== undefined) {
					subEvent.remove();
				}

				removeFromMap();
			};

			let fire = self.fire = (e) => {
				//OPTIONAL: e

				// pass empty e object.
				return eventHandler(e !== undefined ? e : EMPTY_E(), node);
			};

			let getEventHandler = self.getEventHandler = () => {
				return eventHandler;
			};
		}
	};
});
/*
 * 내부적으로 이벤트를 처리하기 위해 사용되는 EVENT_LOW 클래스
 */
global.EVENT_LOW = CLASS({

	init: (inner, self, nameOrParams, eventHandler) => {
		//REQUIRED: nameOrParams
		//OPTIONAL: nameOrParams.node		이벤트를 등록 및 적용할 노드
		//OPTIONAL: nameOrParams.lowNode	이벤트 '등록'은 node 파라미터에 지정된 노드에 하지만, 실제 이벤트의 동작을 '적용'할 노드는 다른 경우 해당 노드
		//REQUIRED: nameOrParams.name		이벤트 이름
		//REQUIRED: eventHandler

		let node;
		let lowNode;
		let name;

		let el;

		let innerHandler;

		// init params.
		if (CHECK_IS_DATA(nameOrParams) !== true) {
			name = nameOrParams;
		} else {
			node = nameOrParams.node;
			lowNode = nameOrParams.lowNode;
			name = nameOrParams.name;

			if (lowNode === undefined) {
				lowNode = node;
			}
		}

		if (lowNode !== undefined) {
			el = lowNode.getWrapperEl();
		} else if (
			global['on' + name] === undefined &&
			name !== 'gamepadconnected' &&
			name !== 'gamepaddisconnected'
		) {
			el = document;
		} else {
			el = global;
		}

		el.addEventListener(name, innerHandler = (e) => {

			let result = eventHandler(E({
				e: e,
				el: el
			}), node);

			if (name === 'beforeunload' && result !== undefined) {
				e.returnValue = result;
			}

			return result;

		}, false);

		let remove = self.remove = () => {
			el.removeEventListener(name, innerHandler, false);
		};
	}
});

/*
 * 이벤트가 한번 발생하면 자동으로 제거되는 EVENT_ONCE 클래스
 */
global.EVENT_ONCE = CLASS({

	init: (inner, self, nameOrParams, eventHandler) => {
		//REQUIRED: nameOrParams
		//OPTIONAL: nameOrParams.node		이벤트를 등록 및 적용할 노드
		//OPTIONAL: nameOrParams.lowNode	이벤트 '등록'은 node 파라미터에 지정된 노드에 하지만, 실제 이벤트의 동작을 '적용'할 노드는 다른 경우 해당 노드
		//REQUIRED: nameOrParams.name		이벤트 이름
		//REQUIRED: eventHandler

		let evt = EVENT(nameOrParams, (e, node) => {
			eventHandler(e, node);
			evt.remove();
		});

		let remove = self.remove = () => {
			evt.remove();
		};

		let fire = self.fire = () => {
			evt.fire();
		};
	}
});

/*
 * A class
 */
global.A = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'a'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.href		이동할 경로
		//OPTIONAL: params.target	이동할 타겟
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let style;
		let href;
		let target;

		// init params.
		if (params !== undefined) {
			style = params.style;
			href = params.href;
			target = params.target;
		}

		let setHref = self.setHref = (href) => {
			inner.setAttr({
				name: 'href',
				value: href
			});
		};

		if (href !== undefined) {
			setHref(href);
		}

		if (target !== undefined) {
			inner.setAttr({
				name: 'target',
				value: target
			});
		}

		let tap = self.tap = () => {

			EVENT.fireAll({
				node: self,
				name: 'tap'
			});
		};

		let getHref = self.getHref = () => {
			return href;
		};
	},

	afterInit: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.href		이동할 경로
		//OPTIONAL: params.target	이동할 타겟
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let children;
		let href;

		let isHrefContent = false;

		let append;
		let prepend;

		// init params.
		if (params !== undefined) {
			children = params.c;
			href = params.href;
		}

		// 아무런 내용이 없으면 이동할 경로를 그대로 표시합니다.
		if (children === undefined && href !== undefined) {

			self.append(href);

			isHrefContent = true;

			OVERRIDE(self.append, (origin) => {

				append = self.append = (node) => {
					//REQUIRED: node

					if (isHrefContent === true) {
						self.empty();
						isHrefContent = false;
					}

					origin(node);
				};
			});

			OVERRIDE(self.prepend, (origin) => {

				prepend = self.prepend = (node) => {
					//REQUIRED: node

					if (isHrefContent === true) {
						self.empty();
						isHrefContent = false;
					}

					origin(node);
				};
			});
		}
	}
});

/*
 * HTML audio 태그와 대응되는 클래스
 */
global.AUDIO = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'audio'
		};
	},

	init: (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.ogg		OGG 사운드 파일 경로
		//OPTIONAL: params.mp3		MP3 사운드 파일 경로
		//OPTIONAL: params.isLoop	반복 재생할지 여부
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let mp3 = params.mp3;
		let ogg = params.ogg;
		let isLoop = params.isLoop;

		if (ogg !== undefined && self.getEl().canPlayType('audio/ogg') !== '') {
			self.getEl().src = ogg;
		} else if (mp3 !== undefined) {
			self.getEl().src = mp3;
		}

		inner.setAttr({
			name: 'controls',
			value: 'controls'
		});

		if (isLoop === true) {
			inner.setAttr({
				name: 'loop',
				value: 'loop'
			});
		}

		let play = self.play = () => {
			self.getEl().play();
		};

		let pause = self.pause = () => {
			self.getEl().pause();
		};

		let stop = self.stop = () => {
			pause();
			self.getEl().currentTime = 0;
		};
	}
});

/*
 * HTML body 태그와 대응되는 객체
 */
global.BODY = OBJECT({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'body'
		};
	}
});

/*
 * HTML br 태그와 대응되는 클래스
 */
global.BR = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'br'
		};
	}
});

/*
 * HTML canvas 태그와 대응되는 클래스
 */
global.CANVAS = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'canvas'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.width
		//OPTIONAL: params.height
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let width;
		let height;

		// init params.
		if (params !== undefined) {
			width = params.width;
			height = params.height;
		}

		let getContext = self.getContext = (contextType) => {
			//REQUIRED: contextType

			return self.getEl().getContext(contextType);
		};

		let setSize = self.setSize = (size) => {
			//REQUIRED: size
			//OPTIONAL: size.width
			//OPTIONAL: size.height

			let el = self.getEl();

			if (size.width !== undefined) {
				width = size.width;
			}

			if (size.height !== undefined) {
				height = size.height;
			}

			if (width !== undefined) {
				el.width = width;
			}

			if (height !== undefined) {
				el.height = height;
			}
		};

		setSize({
			width: width,
			height: height
		});

		let getWidth = self.getWidth = () => {
			return width;
		};

		let getHeight = self.getHeight = () => {
			return height;
		};

		let getDataURL = self.getDataURL = () => {
			return self.getEl().toDataURL();
		};
	}
});

/*
 * HTML div 태그와 대응되는 클래스
 */
global.DIV = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'div'
		};
	}
});

/*
 * HTML footer 태그와 대응되는 클래스
 */
global.FOOTER = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'footer'
		};
	}
});

/*
 * Form class
 */
global.FORM = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'form'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.action	폼 정보를 전송할 경로
		//OPTIONAL: params.target	경로가 이동될 타겟. 지정하지 않으면 현재 창에서 이동됩니다.
		//OPTIONAL: params.method	요청 메소드. `GET`, `POST`를 설정할 수 있습니다.
		//OPTIONAL: params.enctype	폼을 전송할때 사용할 인코딩 방법. 업로드 기능 구현에 사용됩니다.
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let action;
		let target;
		let method;
		let enctype;

		let getData;
		let setData;

		// init params.
		if (params !== undefined) {
			action = params.action;
			target = params.target;
			method = params.method;
			enctype = params.enctype;
		}

		if (action !== undefined) {

			inner.setAttr({
				name: 'action',
				value: action
			});

		} else {

			EVENT({
				node: self,
				name: 'submit'
			}, (e) => {
				e.stop();
			});
		}

		if (target !== undefined) {
			inner.setAttr({
				name: 'target',
				value: target
			});
		}

		if (method !== undefined) {
			inner.setAttr({
				name: 'method',
				value: method
			});
		}

		if (enctype !== undefined) {
			inner.setAttr({
				name: 'enctype',
				value: enctype
			});
		}

		OVERRIDE(self.setData, (origin) => {

			getData = self.getData = () => {

				let data = origin();

				let f = (node) => {
					//REQUIRED: node

					EACH(node.getChildren(), (child) => {

						if (child.getValue !== undefined && child.getName !== undefined && child.getName() !== undefined) {

							let f2 = (data, name) => {

								if (name.indexOf('.') !== -1) {

									let subName = name.substring(name.indexOf('.') + 1);
									name = name.substring(0, name.indexOf('.'));

									if (data[name] === undefined) {
										data[name] = {};
									}

									f2(data[name], subName);
								}

								else {
									data[name] = child.getValue();
								}
							};

							f2(data, child.getName());
						}

						f(child);
					});
				};

				if (data === undefined) {
					data = {};
				}

				f(self);

				return data;
			};
		});

		OVERRIDE(self.setData, (origin) => {

			setData = self.setData = (data) => {
				//REQUIRED: data

				let f = (node) => {
					//REQUIRED: node

					EACH(node.getChildren(), (child) => {

						if (child.setValue !== undefined && child.getName !== undefined && child.getName() !== undefined) {

							let f2 = (data, name) => {

								if (name.indexOf('.') !== -1) {

									let subName = name.substring(name.indexOf('.') + 1);
									name = name.substring(0, name.indexOf('.'));

									if (data[name] === undefined) {
										data[name] = {};
									}

									f2(data[name], subName);
								}

								else {
									child.setValue(data[name] === undefined ? '' : data[name]);
								}
							};

							f2(data, child.getName());
						}

						f(child);
					});
				};

				f(self);

				origin(data);
			};
		});

		let submit = self.submit = () => {

			EVENT.fireAll({
				node: self,
				name: 'submit'
			});

			if (action !== undefined) {
				self.getEl().submit();
			}
		};
	}
});

/*
 * HTML h1 태그와 대응되는 클래스
 */
global.H1 = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'h1'
		};
	}
});

/*
 * HTML h2 태그와 대응되는 클래스
 */
global.H2 = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'h2'
		};
	}
});

/*
 * HTML h3 태그와 대응되는 클래스
 */
global.H3 = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'h3'
		};
	}
});

/*
 * HTML h4 태그와 대응되는 클래스
 */
global.H4 = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'h4'
		};
	}
});

/*
 * HTML h5 태그와 대응되는 클래스
 */
global.H5 = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'h5'
		};
	}
});

/*
 * HTML h6 태그와 대응되는 클래스
 */
global.H6 = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'h6'
		};
	}
});

/*
 * HTML header 태그와 대응되는 클래스
 */
global.HEADER = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'header'
		};
	}
});

/*
 * HTML iframe 태그와 대응되는 클래스
 */
global.IFRAME = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {

		return {
			tag: 'iframe',
			style: {
				border: 'none'
			}
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.name
		//OPTIONAL: params.src
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let name;
		let src;

		// init params.
		if (params !== undefined) {
			name = params.name;
			src = params.src;
		}

		if (name !== undefined) {
			inner.setAttr({
				name: 'name',
				value: name
			});
		}

		let setSrc = self.setSrc = (_src) => {
			//REQUIRED: _src

			src = _src;

			inner.setAttr({
				name: 'src',
				value: src
			});
		};

		if (src !== undefined) {
			setSrc(src);
		}

		let getSrc = self.getSrc = () => {
			return src;
		};
	}
});

/*
 * HTML img 태그와 대응되는 클래스
 */
global.IMG = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'img'
		};
	},

	init: (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.width
		//OPTIONAL: params.height
		//REQUIRED: params.src		이미지 경로
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let src = params.src;
		let width = params.width;
		let height = params.height;

		let el = self.getEl();

		// CORS 이슈 해결
		el.crossOrigin = 'anonymous';

		//OVERRIDE: self.getWidth
		let getWidth = self.getWidth = () => {
			return el.width;
		};

		//OVERRIDE: self.getHeight
		let getHeight = self.getHeight = () => {
			return el.height;
		};

		let setSize = self.setSize = (size) => {
			//REQUIRED: size
			//OPTIONAL: size.width
			//OPTIONAL: size.height

			let width = size.width;
			let height = size.height;

			if (width !== undefined) {
				el.width = width;
			}

			if (height !== undefined) {
				el.height = height;
			}
		};

		setSize({
			width: width,
			height: height
		});

		let getSrc = self.getSrc = () => {
			return src;
		};

		let setSrc = self.setSrc = (_src) => {
			//REQUIRED: _src

			src = _src;

			inner.setAttr({
				name: 'src',
				value: src
			});
		};

		if (src !== undefined) {
			setSrc(src);
		}
	}
});

/*
 * HTML input 태그와 대응되는 클래스
 */
global.INPUT = CLASS((cls) => {

	let focusingInputIds = [];

	let getFocusingInputIds = cls.getFocusingInputIds = (id) => {
		return focusingInputIds;
	};

	return {

		preset: () => {
			return DOM;
		},

		params: () => {
			return {
				tag: 'input'
			};
		},

		init: (inner, self, params) => {
			//OPTIONAL: params
			//OPTIONAL: params.id		id 속성
			//OPTIONAL: params.cls		class 속성
			//OPTIONAL: params.style	스타일
			//OPTIONAL: params.name
			//OPTIONAL: params.type
			//OPTIONAL: params.placeholder
			//OPTIONAL: params.value
			//OPTIONAL: params.min
			//OPTIONAL: params.max
			//OPTIONAL: params.step
			//OPTIONAL: params.accept
			//OPTIONAL: params.isMultiple
			//OPTIONAL: params.isOffAutocomplete
			//OPTIONAL: params.isOffAutocapitalize
			//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
			//OPTIONAL: params.on		이벤트

			let name;
			let type;
			let placeholder;
			let min;
			let max;
			let step;
			let accept;
			let isMultiple;
			let isOffAutocomplete;
			let isOffAutocapitalize;

			let getName;
			let getValue;
			let getFiles;
			let setValue;
			let select;
			let focus;
			let blur;
			let setPlaceholder;

			let toggleCheck;
			let checkIsChecked;

			// init params.
			if (params !== undefined) {
				name = params.name;
				type = params.type;
				placeholder = params.placeholder;
				min = params.min;
				max = params.max;
				step = params.step;
				accept = params.accept;
				isMultiple = params.isMultiple;
				isOffAutocomplete = params.isOffAutocomplete;
				isOffAutocapitalize = params.isOffAutocapitalize;
			}

			if (type !== undefined) {
				inner.setAttr({
					name: 'type',
					value: type
				});
			}

			if (type !== 'submit' && type !== 'reset') {

				if (name !== undefined) {
					inner.setAttr({
						name: 'name',
						value: name
					});
				}

				if (placeholder !== undefined) {
					inner.setAttr({
						name: 'placeholder',
						value: placeholder
					});
				}

				if (accept !== undefined) {
					inner.setAttr({
						name: 'accept',
						value: accept
					});
				}

				if (isMultiple === true) {
					inner.setAttr({
						name: 'multiple',
						value: isMultiple
					});
				}

				if (isOffAutocomplete === true) {
					inner.setAttr({
						name: 'autocomplete',
						value: 'off'
					});
				}

				if (isOffAutocapitalize === true) {
					inner.setAttr({
						name: 'autocapitalize',
						value: 'off'
					});
				}

				getName = self.getName = () => {
					return name;
				};

				getValue = self.getValue = () => {
					if (type === 'checkbox' || type === 'radio') {
						return self.getEl().checked;
					}
					return self.getEl().value;
				};

				getFiles = self.getFiles = () => {
					return self.getEl().files;
				};

				select = self.select = () => {
					if (type === 'file') {
						self.getEl().click();
					} else {
						self.getEl().select();
					}
				};

				focus = self.focus = () => {
					self.getEl().focus();
				};

				blur = self.blur = () => {
					self.getEl().blur();
				};

				if (type === 'checkbox' || type === 'radio') {

					toggleCheck = self.toggleCheck = (e) => {

						if (self.getEl().checked === true) {
							self.getEl().checked = false;
						} else {
							self.getEl().checked = true;
						}

						EVENT.fireAll({
							node: self,
							name: 'change'
						});

						return self.getEl().checked;
					};

					checkIsChecked = self.checkIsChecked = () => {
						return self.getEl().checked;
					};

					EVENT({
						node: self,
						name: 'keyup'
					}, (e) => {

						if (e !== undefined && e.getKey() === 'Enter') {

							DELAY(() => {

								EVENT.fireAll({
									node: self,
									name: 'change'
								});
							});
						}
					});
				}

				else {

					setPlaceholder = self.setPlaceholder = (_placeholder) => {
						//REQUIRED: placeholder

						placeholder = _placeholder;

						inner.setAttr({
							name: 'placeholder',
							value: placeholder
						});
					};
				}
			}

			if (type === 'range') {

				if (min !== undefined) {
					inner.setAttr({
						name: 'min',
						value: min
					});
				}

				if (max !== undefined) {
					inner.setAttr({
						name: 'max',
						value: max
					});
				}

				if (step !== undefined) {
					inner.setAttr({
						name: 'step',
						value: step
					});
				}
			}

			self.setValue = setValue = (value) => {
				//REQUIRED: value

				if (type === 'checkbox' || type === 'radio') {

					if (value === true) {

						if (self.getEl().checked !== true) {

							self.getEl().checked = true;

							EVENT.fireAll({
								node: self,
								name: 'change'
							});

						} else {
							self.getEl().checked = true;
						}

					} else {

						if (self.getEl().checked === true) {

							self.getEl().checked = false;

							EVENT.fireAll({
								node: self,
								name: 'change'
							});

						} else {
							self.getEl().checked = false;
						}
					}

				} else {

					if (self.getEl().value !== value) {

						self.getEl().value = value;

						EVENT.fireAll({
							node: self,
							name: 'change'
						});

					} else {
						self.getEl().value = value;
					}
				}
			};

			EVENT({
				node: self,
				name: 'focus'
			}, () => {
				getFocusingInputIds().push(self.id);
			});

			EVENT({
				node: self,
				name: 'blur'
			}, () => {

				REMOVE({
					array: getFocusingInputIds(),
					value: self.id
				});
			});

			self.on('remove', () => {

				REMOVE({
					array: getFocusingInputIds(),
					value: self.id
				});
			});

			// can radio be false
			if (type === 'radio') {

				EVENT({
					node: self,
					name: 'touchstart'
				}, () => {

					if (checkIsChecked() === true) {

						EVENT_ONCE({
							node: self,
							name: 'touchend'
						}, () => {
							DELAY(() => {
								setValue(false);
							});
						});
					}
				});
			}
		},

		afterInit: (inner, self, params) => {
			//OPTIONAL: params
			//OPTIONAL: params.id		id 속성
			//OPTIONAL: params.cls		class 속성
			//OPTIONAL: params.style	스타일
			//OPTIONAL: params.name
			//OPTIONAL: params.type
			//OPTIONAL: params.placeholder
			//OPTIONAL: params.value
			//OPTIONAL: params.accept
			//OPTIONAL: params.isMultiple
			//OPTIONAL: params.isOffAutocomplete
			//OPTIONAL: params.isOffAutocapitalize
			//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
			//OPTIONAL: params.on		이벤트

			let type;
			let value;

			// init params.
			if (params !== undefined) {
				type = params.type;
				value = params.value;
			}

			if (value !== undefined) {

				if (type === 'checkbox' || type === 'radio') {

					if (value === true) {

						if (self.getEl().checked !== true) {
							self.getEl().checked = true;
						} else {
							self.getEl().checked = true;
						}

					} else {

						if (self.getEl().checked === true) {
							self.getEl().checked = false;
						} else {
							self.getEl().checked = false;
						}
					}

				} else {

					if (self.getEl().value !== value) {
						self.getEl().value = value;
					} else {
						self.getEl().value = value;
					}
				}
			}
		}
	};
});

/*
 * HTML li 태그와 대응되는 클래스
 */
global.LI = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'li'
		};
	}
});

/*
 * HTML optgroup 태그와 대응되는 클래스
 */
global.OPTGROUP = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'optgroup'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.label
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let label = params.label;

		inner.setAttr({
			name: 'label',
			value: label
		});
	}
});

/*
 * HTML option 태그와 대응되는 클래스
 */
global.OPTION = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'option'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.value
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let getValue = self.getValue = () => {
			return self.getEl().value;
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			self.getEl().value = value;
		};
	},

	afterInit: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.value
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let value;
		let children;

		// init params.
		if (params !== undefined) {
			value = params.value;
			children = params.c;
		}

		if (value === undefined) {
			self.setValue('');
		} else {
			self.setValue(value);

			if (children === undefined) {
				self.append(value);
			}
		}
	}
});

/*
 * HTML p 태그와 대응되는 클래스
 */
global.P = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'p'
		};
	}
});

/*
 * HTML select 태그와 대응되는 클래스
 */
global.SELECT = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'select'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.name
		//OPTIONAL: params.placeholder
		//OPTIONAL: params.value
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let name;

		let isCtrlDown = false;

		// init params.
		if (params !== undefined) {
			name = params.name;
		}

		if (name !== undefined) {
			inner.setAttr({
				name: 'name',
				value: name
			});
		}

		let getName = self.getName = () => {
			return name;
		};

		let getValue = self.getValue = () => {
			return self.getEl().value;
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			if (self.getEl().value !== value) {

				self.getEl().value = value;

				EVENT.fireAll({
					node: self,
					name: 'change'
				});

			} else {
				self.getEl().value = value;
			}
		};

		let select = self.select = () => {
			self.getEl().select();
		};

		let focus = self.focus = () => {
			self.getEl().focus();
		};

		let blur = self.blur = () => {
			self.getEl().blur();
		};

		EVENT({
			node: self,
			name: 'keydown'
		}, (e) => {

			if (e.getKey() === 'Control') {
				isCtrlDown = true;
			} else if (isCtrlDown !== true) {
				e.stopBubbling();
			}
		});

		EVENT({
			node: self,
			name: 'keyup'
		}, (e) => {

			if (e.getKey() === 'Control') {
				isCtrlDown = false;
			}
		});

		EVENT({
			node: self,
			name: 'focus'
		}, () => {
			INPUT.getFocusingInputIds().push(self.id);
		});

		EVENT({
			node: self,
			name: 'blur'
		}, () => {

			REMOVE({
				array: INPUT.getFocusingInputIds(),
				value: self.id
			});
		});

		self.on('remove', () => {

			REMOVE({
				array: INPUT.getFocusingInputIds(),
				value: self.id
			});
		});
	},

	afterInit: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일을 지정합니다.
		//OPTIONAL: params.name
		//OPTIONAL: params.placeholder
		//OPTIONAL: params.value
		//OPTIONAL: params.c		자식 노드를 지정합니다. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트를 지정합니다.

		let value;

		// init params.
		if (params !== undefined) {
			value = params.value;
		}

		if (value !== undefined) {

			if (self.getEl().value !== value) {
				self.getEl().value = value;
			} else {
				self.getEl().value = value;
			}
		}
	}
});

/*
 * HTML span 태그와 대응되는 클래스
 */
global.SPAN = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'span'
		};
	}
});

/*
 * HTML table 태그와 대응되는 클래스
 */
global.TABLE = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'table'
		};
	}
});

/*
 * HTML td 태그와 대응되는 클래스
 */
global.TD = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'td'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.rowspan
		//OPTIONAL: params.colspan
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let rowspan;
		let colspan;

		// init params.
		if (params !== undefined) {
			rowspan = params.rowspan;
			colspan = params.colspan;
		}

		if (rowspan !== undefined) {
			inner.setAttr({
				name: 'rowspan',
				value: rowspan
			});
		}

		if (colspan !== undefined) {
			inner.setAttr({
				name: 'colspan',
				value: colspan
			});
		}
	}
});

/*
 * Textarea class
 */
global.TEXTAREA = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'textarea'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id			id 속성
		//OPTIONAL: params.cls			class 속성
		//OPTIONAL: params.style		스타일
		//OPTIONAL: params.name
		//OPTIONAL: params.placeholder	값이 없는 경우 표시되는 짧은 설명
		//OPTIONAL: params.value
		//OPTIONAL: params.c			자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on			이벤트

		let name;
		let placeholder;

		let isCtrlDown = false;

		// init params.
		if (params !== undefined) {
			name = params.name;
			placeholder = params.placeholder;
		}

		if (name !== undefined) {
			inner.setAttr({
				name: 'name',
				value: name
			});
		}

		if (placeholder !== undefined) {
			inner.setAttr({
				name: 'placeholder',
				value: placeholder
			});
		}

		let getName = self.getName = () => {
			return name;
		};

		let getValue = self.getValue = () => {
			return self.getEl().value;
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			if (self.getEl().value !== value) {

				self.getEl().value = value;

				EVENT.fireAll({
					node: self,
					name: 'change'
				});

			} else {
				self.getEl().value = value;
			}
		};

		let select = self.select = () => {
			self.getEl().select();
		};

		let focus = self.focus = () => {
			self.getEl().focus();
		};

		let blur = self.blur = () => {
			self.getEl().blur();
		};

		let setPlaceholder = self.setPlaceholder = (_placeholder) => {
			//REQUIRED: placeholder

			placeholder = _placeholder;

			inner.setAttr({
				name: 'placeholder',
				value: placeholder
			});
		};

		EVENT({
			node: self,
			name: 'keydown'
		}, (e) => {

			if (e.getKey() === 'Control') {
				isCtrlDown = true;
			} else if (isCtrlDown !== true) {
				e.stopBubbling();
			}
		});

		EVENT({
			node: self,
			name: 'keyup'
		}, (e) => {

			if (e.getKey() === 'Control') {
				isCtrlDown = false;
			}
		});

		EVENT({
			node: self,
			name: 'focus'
		}, () => {
			INPUT.getFocusingInputIds().push(self.id);
		});

		EVENT({
			node: self,
			name: 'blur'
		}, () => {

			REMOVE({
				array: INPUT.getFocusingInputIds(),
				value: self.id
			});
		});

		self.on('remove', () => {

			REMOVE({
				array: INPUT.getFocusingInputIds(),
				value: self.id
			});
		});
	},

	afterInit: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id			id 속성
		//OPTIONAL: params.cls			class 속성
		//OPTIONAL: params.style		스타일
		//OPTIONAL: params.name
		//OPTIONAL: params.placeholder	값이 없는 경우 표시되는 짧은 설명
		//OPTIONAL: params.value
		//OPTIONAL: params.c			자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on			이벤트

		let value;

		// init params.
		if (params !== undefined) {
			value = params.value;
		}

		if (value !== undefined) {
			self.setValue(value);
		}
	}
});

/*
 * HTML th 태그와 대응되는 클래스
 */
global.TH = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'th'
		};
	},

	init: (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.id		id 속성
		//OPTIONAL: params.cls		class 속성
		//OPTIONAL: params.style	스타일
		//OPTIONAL: params.rowspan
		//OPTIONAL: params.colspan
		//OPTIONAL: params.c		자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on		이벤트

		let rowspan;
		let colspan;

		// init params.
		if (params !== undefined) {
			rowspan = params.rowspan;
			colspan = params.colspan;
		}

		if (rowspan !== undefined) {
			inner.setAttr({
				name: 'rowspan',
				value: rowspan
			});
		}

		if (colspan !== undefined) {
			inner.setAttr({
				name: 'colspan',
				value: colspan
			});
		}
	}
});

/*
 * HTML tr 태그와 대응되는 클래스
 */
global.TR = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'tr'
		};
	}
});

/*
 * HTML ul 태그와 대응되는 클래스
 */
global.UL = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'ul'
		};
	}
});

/*
 * HTML video 태그와 대응되는 클래스
 */
global.VIDEO = CLASS({

	preset: () => {
		return DOM;
	},

	params: () => {
		return {
			tag: 'video'
		};
	},

	init: (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.id			id 속성
		//OPTIONAL: params.cls			class 속성
		//OPTIONAL: params.style		스타일
		//OPTIONAL: params.webm			WebM 동영상 파일 경로
		//OPTIONAL: params.ogg			OGG 동영상 파일 경로
		//OPTIONAL: params.mp4			MP4 동영상 파일 경로
		//OPTIONAL: params.poster		동영상이 로딩 중일 때 표시할 이미지 파일 경로
		//OPTIONAL: params.isNoControls	조작 메뉴를 숨길지 여부
		//OPTIONAL: params.isLoop		반복 재생할지 여부
		//OPTIONAL: params.isMuted		음소거로 재생할지 여부
		//OPTIONAL: params.c			자식 노드. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
		//OPTIONAL: params.on			이벤트

		let webm = params.webm;
		let ogg = params.ogg;
		let mp4 = params.mp4;
		let poster = params.poster;
		let isNoControls = params.isNoControls;
		let isLoop = params.isLoop;
		let isMuted = params.isMuted;

		if (webm !== undefined && self.getEl().canPlayType('video/webm') !== '') {
			self.getEl().src = webm;
		} else if (ogg !== undefined && self.getEl().canPlayType('video/ogg') !== '') {
			self.getEl().src = ogg;
		} else if (mp4 !== undefined) {
			self.getEl().src = mp4;
		}

		if (isNoControls !== true) {
			inner.setAttr({
				name: 'controls',
				value: 'controls'
			});
		}

		if (isLoop === true) {
			inner.setAttr({
				name: 'loop',
				value: 'loop'
			});
		}

		if (isMuted === true) {
			inner.setAttr({
				name: 'muted',
				value: 'muted'
			});
		}

		let play = self.play = () => {
			self.getEl().play();
		};

		let pause = self.pause = () => {
			self.getEl().pause();
		};

		let stop = self.stop = () => {
			self.getEl().pause();
			self.getEl().currentTime = 0;
		};
	}
});

/*
 * 암호화된 HTTP DELETE 요청을 보냅니다.
 */
global.ENCRYPTION_DELETE = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		ENCRYPTION_REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'DELETE'
		}]), responseListenerOrListeners);
	}
});
/*
 * 암호화된 HTTP GET 요청을 보냅니다.
 */
global.ENCRYPTION_GET = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		ENCRYPTION_REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'GET'
		}]), responseListenerOrListeners);
	}
});
/*
 * 암호화된 HTTP POST 요청을 보냅니다.
 */
global.ENCRYPTION_POST = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		ENCRYPTION_REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'POST'
		}]), responseListenerOrListeners);
	}
});
/*
 * 암호화된 HTTP PUT 요청을 보냅니다.
 */
global.ENCRYPTION_PUT = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		ENCRYPTION_REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'PUT'
		}]), responseListenerOrListeners);
	}
});
/*
 * 암호화된 HTTP 요청을 보냅니다.
 */
global.ENCRYPTION_REQUEST = METHOD({

	run: (params, responseListenerOrListeners) => {
		//REQUIRED: params
		//REQUIRED: params.method	요청 메소드. GET, POST, PUT, DELETE를 설정할 수 있습니다.
		//OPTIONAL: params.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: params.host
		//OPTIONAL: params.port
		//OPTIONAL: params.uri
		//OPTIONAL: params.url		요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: params.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: params.params	데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: params.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: params.headers	요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		let method = params.method;
		let isSecure = params.isSecure === undefined ? BROWSER_CONFIG.isSecure : params.isSecure;
		let host = params.host === undefined ? BROWSER_CONFIG.host : params.host;
		let port = params.port === undefined ? (params.host === undefined ? BROWSER_CONFIG.port : (isSecure !== true ? 80 : 443)) : params.port;
		let uri = params.uri;
		let url = params.url;
		let paramStr = params.paramStr;
		let _params = params.params;
		let data = params.data;
		let headers = params.headers;

		let responseListener;
		let errorListener;

		method = method.toUpperCase();

		if (url !== undefined) {

			if (url.indexOf('?') !== -1) {
				paramStr = url.substring(url.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				url = url.substring(0, url.indexOf('?'));
			}

			isSecure = undefined;
			host = undefined;
			port = undefined;

		} else {

			if (uri !== undefined && uri.indexOf('?') !== -1) {
				paramStr = uri.substring(uri.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				uri = uri.substring(0, uri.indexOf('?'));
			}
		}

		if (_params !== undefined) {

			EACH(_params, (value, name) => {

				if (paramStr === undefined) {
					paramStr = '';
				} else {
					paramStr += '&';
				}

				paramStr += encodeURIComponent(name) + '=' + encodeURIComponent(value);
			});
		}

		if (data !== undefined) {
			paramStr = (paramStr === undefined ? '' : paramStr + '&') + '__DATA=' + encodeURIComponent(STRINGIFY(data));
		}

		paramStr = (paramStr === undefined ? '' : paramStr + '&') + Date.now();

		// 시드 값 삽입
		paramStr += '&__SEED=' + UUID();

		// 파라미터 문자열 암호화
		paramStr = '__ENCRYPT=' + encodeURIComponent(ENCRYPT({
			password: paramStr,
			key: CONFIG.requestEncryptionKey
		}));

		if (url === undefined) {
			url = (isSecure === true ? 'https://' : 'http://') + host + ':' + port + '/' + (uri === undefined ? '' : (uri[0] === '/' ? uri.substring(1) : uri));
		}

		if (CHECK_IS_DATA(responseListenerOrListeners) !== true) {
			responseListener = responseListenerOrListeners;
		} else {
			responseListener = responseListenerOrListeners.success;
			errorListener = responseListenerOrListeners.error;
		}

		(
			method === 'GET' || method === 'DELETE' ? fetch(url + '?' + paramStr, {
				method: method,
				credentials: location.protocol !== 'file:' && location.protocol.indexOf('-extension:') === -1 && host === BROWSER_CONFIG.host && port === BROWSER_CONFIG.port ? 'include' : undefined,
				headers: new Headers(headers === undefined ? {} : headers)
			}) : fetch(url, {
				method: method,
				body: paramStr,
				credentials: location.protocol !== 'file:' && location.protocol.indexOf('-extension:') === -1 && host === BROWSER_CONFIG.host && port === BROWSER_CONFIG.port ? 'include' : undefined,
				headers: new Headers(headers === undefined ? {} : headers)
			})
		).then((response) => {

			if (response.status === 200) {
				return response.text();
			} else {
				let errorMsg = 'HTTP RESPONSE STATUS CODE: ' + response.status;

				if (errorListener !== undefined) {
					errorListener(errorMsg);
				} else {
					SHOW_ERROR('ENCRYPTION_REQUEST', errorMsg, params);
				}
			}
		}, (error) => {

			let errorMsg = error.toString();

			if (errorListener !== undefined) {
				errorListener(errorMsg);
			} else {
				SHOW_ERROR('ENCRYPTION_REQUEST', errorMsg, params);
			}

			responseListener = undefined;

		}).then((responseText) => {
			if (responseText !== undefined && responseListener !== undefined) {
				responseListener(responseText);
			}
		});
	}
});
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.bowser=n():t.bowser=n()}(this,(function(){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)e.d(r,i,function(n){return t[n]}.bind(null,i));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=129)}([function(t,n,e){var r=e(1),i=e(7),o=e(14),u=e(11),a=e(19),c=function(t,n,e){var s,f,l,h,d=t&c.F,p=t&c.G,v=t&c.S,g=t&c.P,y=t&c.B,m=p?r:v?r[n]||(r[n]={}):(r[n]||{}).prototype,b=p?i:i[n]||(i[n]={}),S=b.prototype||(b.prototype={});for(s in p&&(e=n),e)l=((f=!d&&m&&void 0!==m[s])?m:e)[s],h=y&&f?a(l,r):g&&"function"==typeof l?a(Function.call,l):l,m&&u(m,s,l,t&c.U),b[s]!=l&&o(b,s,h),g&&S[s]!=l&&(S[s]=l)};r.core=i,c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n,e){var r=e(4);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){var r=e(50)("wks"),i=e(31),o=e(1).Symbol,u="function"==typeof o;(t.exports=function(t){return r[t]||(r[t]=u&&o[t]||(u?o:i)("Symbol."+t))}).store=r},function(t,n,e){var r=e(21),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0}},function(t,n){var e=t.exports={version:"2.6.9"};"number"==typeof __e&&(__e=e)},function(t,n,e){t.exports=!e(2)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,n,e){var r=e(3),i=e(96),o=e(28),u=Object.defineProperty;n.f=e(8)?Object.defineProperty:function(t,n,e){if(r(t),n=o(n,!0),r(e),i)try{return u(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(26);t.exports=function(t){return Object(r(t))}},function(t,n,e){var r=e(1),i=e(14),o=e(13),u=e(31)("src"),a=e(134),c=(""+a).split("toString");e(7).inspectSource=function(t){return a.call(t)},(t.exports=function(t,n,e,a){var s="function"==typeof e;s&&(o(e,"name")||i(e,"name",n)),t[n]!==e&&(s&&(o(e,u)||i(e,u,t[n]?""+t[n]:c.join(String(n)))),t===r?t[n]=e:a?t[n]?t[n]=e:i(t,n,e):(delete t[n],i(t,n,e)))})(Function.prototype,"toString",(function(){return"function"==typeof this&&this[u]||a.call(this)}))},function(t,n,e){var r=e(0),i=e(2),o=e(26),u=/"/g,a=function(t,n,e,r){var i=String(o(t)),a="<"+n;return""!==e&&(a+=" "+e+'="'+String(r).replace(u,"&quot;")+'"'),a+">"+i+"</"+n+">"};t.exports=function(t,n){var e={};e[t]=n(a),r(r.P+r.F*i((function(){var n=""[t]('"');return n!==n.toLowerCase()||n.split('"').length>3})),"String",e)}},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n,e){var r=e(9),i=e(30);t.exports=e(8)?function(t,n,e){return r.f(t,n,i(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n,e){var r=e(46),i=e(26);t.exports=function(t){return r(i(t))}},function(t,n,e){"use strict";var r=e(2);t.exports=function(t,n){return!!t&&r((function(){n?t.call(null,(function(){}),1):t.call(null)}))}},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r=e(18),i=function(){function t(){}return t.getFirstMatch=function(t,n){var e=n.match(t);return e&&e.length>0&&e[1]||""},t.getSecondMatch=function(t,n){var e=n.match(t);return e&&e.length>1&&e[2]||""},t.matchAndReturnConst=function(t,n,e){if(t.test(n))return e},t.getWindowsVersionName=function(t){switch(t){case"NT":return"NT";case"XP":return"XP";case"NT 5.0":return"2000";case"NT 5.1":return"XP";case"NT 5.2":return"2003";case"NT 6.0":return"Vista";case"NT 6.1":return"7";case"NT 6.2":return"8";case"NT 6.3":return"8.1";case"NT 10.0":return"10";default:return}},t.getMacOSVersionName=function(t){var n=t.split(".").splice(0,2).map((function(t){return parseInt(t,10)||0}));if(n.push(0),10===n[0])switch(n[1]){case 5:return"Leopard";case 6:return"Snow Leopard";case 7:return"Lion";case 8:return"Mountain Lion";case 9:return"Mavericks";case 10:return"Yosemite";case 11:return"El Capitan";case 12:return"Sierra";case 13:return"High Sierra";case 14:return"Mojave";case 15:return"Catalina";default:return}},t.getAndroidVersionName=function(t){var n=t.split(".").splice(0,2).map((function(t){return parseInt(t,10)||0}));if(n.push(0),!(1===n[0]&&n[1]<5))return 1===n[0]&&n[1]<6?"Cupcake":1===n[0]&&n[1]>=6?"Donut":2===n[0]&&n[1]<2?"Eclair":2===n[0]&&2===n[1]?"Froyo":2===n[0]&&n[1]>2?"Gingerbread":3===n[0]?"Honeycomb":4===n[0]&&n[1]<1?"Ice Cream Sandwich":4===n[0]&&n[1]<4?"Jelly Bean":4===n[0]&&n[1]>=4?"KitKat":5===n[0]?"Lollipop":6===n[0]?"Marshmallow":7===n[0]?"Nougat":8===n[0]?"Oreo":9===n[0]?"Pie":void 0},t.getVersionPrecision=function(t){return t.split(".").length},t.compareVersions=function(n,e,r){void 0===r&&(r=!1);var i=t.getVersionPrecision(n),o=t.getVersionPrecision(e),u=Math.max(i,o),a=0,c=t.map([n,e],(function(n){var e=u-t.getVersionPrecision(n),r=n+new Array(e+1).join(".0");return t.map(r.split("."),(function(t){return new Array(20-t.length).join("0")+t})).reverse()}));for(r&&(a=u-Math.min(i,o)),u-=1;u>=a;){if(c[0][u]>c[1][u])return 1;if(c[0][u]===c[1][u]){if(u===a)return 0;u-=1}else if(c[0][u]<c[1][u])return-1}},t.map=function(t,n){var e,r=[];if(Array.prototype.map)return Array.prototype.map.call(t,n);for(e=0;e<t.length;e+=1)r.push(n(t[e]));return r},t.find=function(t,n){var e,r;if(Array.prototype.find)return Array.prototype.find.call(t,n);for(e=0,r=t.length;e<r;e+=1){var i=t[e];if(n(i,e))return i}},t.assign=function(t){for(var n,e,r=t,i=arguments.length,o=new Array(i>1?i-1:0),u=1;u<i;u++)o[u-1]=arguments[u];if(Object.assign)return Object.assign.apply(Object,[t].concat(o));var a=function(){var t=o[n];"object"==typeof t&&null!==t&&Object.keys(t).forEach((function(n){r[n]=t[n]}))};for(n=0,e=o.length;n<e;n+=1)a();return t},t.getBrowserAlias=function(t){return r.BROWSER_ALIASES_MAP[t]},t.getBrowserTypeByAlias=function(t){return r.BROWSER_MAP[t]||""},t}();n.default=i,t.exports=n.default},function(t,n,e){"use strict";n.__esModule=!0,n.ENGINE_MAP=n.OS_MAP=n.PLATFORMS_MAP=n.BROWSER_MAP=n.BROWSER_ALIASES_MAP=void 0;n.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"};n.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"};n.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"};n.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"};n.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"}},function(t,n,e){var r=e(20);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,i){return t.call(n,e,r,i)}}return function(){return t.apply(n,arguments)}}},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n,e){var r=e(47),i=e(30),o=e(15),u=e(28),a=e(13),c=e(96),s=Object.getOwnPropertyDescriptor;n.f=e(8)?s:function(t,n){if(t=o(t),n=u(n,!0),c)try{return s(t,n)}catch(t){}if(a(t,n))return i(!r.f.call(t,n),t[n])}},function(t,n,e){var r=e(0),i=e(7),o=e(2);t.exports=function(t,n){var e=(i.Object||{})[t]||Object[t],u={};u[t]=n(e),r(r.S+r.F*o((function(){e(1)})),"Object",u)}},function(t,n,e){var r=e(19),i=e(46),o=e(10),u=e(6),a=e(112);t.exports=function(t,n){var e=1==t,c=2==t,s=3==t,f=4==t,l=6==t,h=5==t||l,d=n||a;return function(n,a,p){for(var v,g,y=o(n),m=i(y),b=r(a,p,3),S=u(m.length),w=0,_=e?d(n,S):c?d(n,0):void 0;S>w;w++)if((h||w in m)&&(g=b(v=m[w],w,y),t))if(e)_[w]=g;else if(g)switch(t){case 3:return!0;case 5:return v;case 6:return w;case 2:_.push(v)}else if(f)return!1;return l?-1:s||f?f:_}}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n){t.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n,e){"use strict";if(e(8)){var r=e(32),i=e(1),o=e(2),u=e(0),a=e(61),c=e(86),s=e(19),f=e(44),l=e(30),h=e(14),d=e(45),p=e(21),v=e(6),g=e(123),y=e(34),m=e(28),b=e(13),S=e(48),w=e(4),_=e(10),M=e(78),x=e(35),P=e(37),O=e(36).f,F=e(80),A=e(31),E=e(5),N=e(24),R=e(51),k=e(49),T=e(82),I=e(42),j=e(54),L=e(43),B=e(81),C=e(114),W=e(9),V=e(22),G=W.f,D=V.f,U=i.RangeError,z=i.TypeError,q=i.Uint8Array,K=Array.prototype,Y=c.ArrayBuffer,Q=c.DataView,H=N(0),J=N(2),X=N(3),Z=N(4),$=N(5),tt=N(6),nt=R(!0),et=R(!1),rt=T.values,it=T.keys,ot=T.entries,ut=K.lastIndexOf,at=K.reduce,ct=K.reduceRight,st=K.join,ft=K.sort,lt=K.slice,ht=K.toString,dt=K.toLocaleString,pt=E("iterator"),vt=E("toStringTag"),gt=A("typed_constructor"),yt=A("def_constructor"),mt=a.CONSTR,bt=a.TYPED,St=a.VIEW,wt=N(1,(function(t,n){return Ot(k(t,t[yt]),n)})),_t=o((function(){return 1===new q(new Uint16Array([1]).buffer)[0]})),Mt=!!q&&!!q.prototype.set&&o((function(){new q(1).set({})})),xt=function(t,n){var e=p(t);if(e<0||e%n)throw U("Wrong offset!");return e},Pt=function(t){if(w(t)&&bt in t)return t;throw z(t+" is not a typed array!")},Ot=function(t,n){if(!(w(t)&&gt in t))throw z("It is not a typed array constructor!");return new t(n)},Ft=function(t,n){return At(k(t,t[yt]),n)},At=function(t,n){for(var e=0,r=n.length,i=Ot(t,r);r>e;)i[e]=n[e++];return i},Et=function(t,n,e){G(t,n,{get:function(){return this._d[e]}})},Nt=function(t){var n,e,r,i,o,u,a=_(t),c=arguments.length,f=c>1?arguments[1]:void 0,l=void 0!==f,h=F(a);if(null!=h&&!M(h)){for(u=h.call(a),r=[],n=0;!(o=u.next()).done;n++)r.push(o.value);a=r}for(l&&c>2&&(f=s(f,arguments[2],2)),n=0,e=v(a.length),i=Ot(this,e);e>n;n++)i[n]=l?f(a[n],n):a[n];return i},Rt=function(){for(var t=0,n=arguments.length,e=Ot(this,n);n>t;)e[t]=arguments[t++];return e},kt=!!q&&o((function(){dt.call(new q(1))})),Tt=function(){return dt.apply(kt?lt.call(Pt(this)):Pt(this),arguments)},It={copyWithin:function(t,n){return C.call(Pt(this),t,n,arguments.length>2?arguments[2]:void 0)},every:function(t){return Z(Pt(this),t,arguments.length>1?arguments[1]:void 0)},fill:function(t){return B.apply(Pt(this),arguments)},filter:function(t){return Ft(this,J(Pt(this),t,arguments.length>1?arguments[1]:void 0))},find:function(t){return $(Pt(this),t,arguments.length>1?arguments[1]:void 0)},findIndex:function(t){return tt(Pt(this),t,arguments.length>1?arguments[1]:void 0)},forEach:function(t){H(Pt(this),t,arguments.length>1?arguments[1]:void 0)},indexOf:function(t){return et(Pt(this),t,arguments.length>1?arguments[1]:void 0)},includes:function(t){return nt(Pt(this),t,arguments.length>1?arguments[1]:void 0)},join:function(t){return st.apply(Pt(this),arguments)},lastIndexOf:function(t){return ut.apply(Pt(this),arguments)},map:function(t){return wt(Pt(this),t,arguments.length>1?arguments[1]:void 0)},reduce:function(t){return at.apply(Pt(this),arguments)},reduceRight:function(t){return ct.apply(Pt(this),arguments)},reverse:function(){for(var t,n=Pt(this).length,e=Math.floor(n/2),r=0;r<e;)t=this[r],this[r++]=this[--n],this[n]=t;return this},some:function(t){return X(Pt(this),t,arguments.length>1?arguments[1]:void 0)},sort:function(t){return ft.call(Pt(this),t)},subarray:function(t,n){var e=Pt(this),r=e.length,i=y(t,r);return new(k(e,e[yt]))(e.buffer,e.byteOffset+i*e.BYTES_PER_ELEMENT,v((void 0===n?r:y(n,r))-i))}},jt=function(t,n){return Ft(this,lt.call(Pt(this),t,n))},Lt=function(t){Pt(this);var n=xt(arguments[1],1),e=this.length,r=_(t),i=v(r.length),o=0;if(i+n>e)throw U("Wrong length!");for(;o<i;)this[n+o]=r[o++]},Bt={entries:function(){return ot.call(Pt(this))},keys:function(){return it.call(Pt(this))},values:function(){return rt.call(Pt(this))}},Ct=function(t,n){return w(t)&&t[bt]&&"symbol"!=typeof n&&n in t&&String(+n)==String(n)},Wt=function(t,n){return Ct(t,n=m(n,!0))?l(2,t[n]):D(t,n)},Vt=function(t,n,e){return!(Ct(t,n=m(n,!0))&&w(e)&&b(e,"value"))||b(e,"get")||b(e,"set")||e.configurable||b(e,"writable")&&!e.writable||b(e,"enumerable")&&!e.enumerable?G(t,n,e):(t[n]=e.value,t)};mt||(V.f=Wt,W.f=Vt),u(u.S+u.F*!mt,"Object",{getOwnPropertyDescriptor:Wt,defineProperty:Vt}),o((function(){ht.call({})}))&&(ht=dt=function(){return st.call(this)});var Gt=d({},It);d(Gt,Bt),h(Gt,pt,Bt.values),d(Gt,{slice:jt,set:Lt,constructor:function(){},toString:ht,toLocaleString:Tt}),Et(Gt,"buffer","b"),Et(Gt,"byteOffset","o"),Et(Gt,"byteLength","l"),Et(Gt,"length","e"),G(Gt,vt,{get:function(){return this[bt]}}),t.exports=function(t,n,e,c){var s=t+((c=!!c)?"Clamped":"")+"Array",l="get"+t,d="set"+t,p=i[s],y=p||{},m=p&&P(p),b=!p||!a.ABV,_={},M=p&&p.prototype,F=function(t,e){G(t,e,{get:function(){return function(t,e){var r=t._d;return r.v[l](e*n+r.o,_t)}(this,e)},set:function(t){return function(t,e,r){var i=t._d;c&&(r=(r=Math.round(r))<0?0:r>255?255:255&r),i.v[d](e*n+i.o,r,_t)}(this,e,t)},enumerable:!0})};b?(p=e((function(t,e,r,i){f(t,p,s,"_d");var o,u,a,c,l=0,d=0;if(w(e)){if(!(e instanceof Y||"ArrayBuffer"==(c=S(e))||"SharedArrayBuffer"==c))return bt in e?At(p,e):Nt.call(p,e);o=e,d=xt(r,n);var y=e.byteLength;if(void 0===i){if(y%n)throw U("Wrong length!");if((u=y-d)<0)throw U("Wrong length!")}else if((u=v(i)*n)+d>y)throw U("Wrong length!");a=u/n}else a=g(e),o=new Y(u=a*n);for(h(t,"_d",{b:o,o:d,l:u,e:a,v:new Q(o)});l<a;)F(t,l++)})),M=p.prototype=x(Gt),h(M,"constructor",p)):o((function(){p(1)}))&&o((function(){new p(-1)}))&&j((function(t){new p,new p(null),new p(1.5),new p(t)}),!0)||(p=e((function(t,e,r,i){var o;return f(t,p,s),w(e)?e instanceof Y||"ArrayBuffer"==(o=S(e))||"SharedArrayBuffer"==o?void 0!==i?new y(e,xt(r,n),i):void 0!==r?new y(e,xt(r,n)):new y(e):bt in e?At(p,e):Nt.call(p,e):new y(g(e))})),H(m!==Function.prototype?O(y).concat(O(m)):O(y),(function(t){t in p||h(p,t,y[t])})),p.prototype=M,r||(M.constructor=p));var A=M[pt],E=!!A&&("values"==A.name||null==A.name),N=Bt.values;h(p,gt,!0),h(M,bt,s),h(M,St,!0),h(M,yt,p),(c?new p(1)[vt]==s:vt in M)||G(M,vt,{get:function(){return s}}),_[s]=p,u(u.G+u.W+u.F*(p!=y),_),u(u.S,s,{BYTES_PER_ELEMENT:n}),u(u.S+u.F*o((function(){y.of.call(p,1)})),s,{from:Nt,of:Rt}),"BYTES_PER_ELEMENT"in M||h(M,"BYTES_PER_ELEMENT",n),u(u.P,s,It),L(s),u(u.P+u.F*Mt,s,{set:Lt}),u(u.P+u.F*!E,s,Bt),r||M.toString==ht||(M.toString=ht),u(u.P+u.F*o((function(){new p(1).slice()})),s,{slice:jt}),u(u.P+u.F*(o((function(){return[1,2].toLocaleString()!=new p([1,2]).toLocaleString()}))||!o((function(){M.toLocaleString.call([1,2])}))),s,{toLocaleString:Tt}),I[s]=E?A:N,r||E||h(M,pt,N)}}else t.exports=function(){}},function(t,n,e){var r=e(4);t.exports=function(t,n){if(!r(t))return t;var e,i;if(n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;if("function"==typeof(e=t.valueOf)&&!r(i=e.call(t)))return i;if(!n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,n,e){var r=e(31)("meta"),i=e(4),o=e(13),u=e(9).f,a=0,c=Object.isExtensible||function(){return!0},s=!e(2)((function(){return c(Object.preventExtensions({}))})),f=function(t){u(t,r,{value:{i:"O"+ ++a,w:{}}})},l=t.exports={KEY:r,NEED:!1,fastKey:function(t,n){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!c(t))return"F";if(!n)return"E";f(t)}return t[r].i},getWeak:function(t,n){if(!o(t,r)){if(!c(t))return!0;if(!n)return!1;f(t)}return t[r].w},onFreeze:function(t){return s&&l.NEED&&c(t)&&!o(t,r)&&f(t),t}}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},function(t,n){t.exports=!1},function(t,n,e){var r=e(98),i=e(65);t.exports=Object.keys||function(t){return r(t,i)}},function(t,n,e){var r=e(21),i=Math.max,o=Math.min;t.exports=function(t,n){return(t=r(t))<0?i(t+n,0):o(t,n)}},function(t,n,e){var r=e(3),i=e(99),o=e(65),u=e(64)("IE_PROTO"),a=function(){},c=function(){var t,n=e(62)("iframe"),r=o.length;for(n.style.display="none",e(66).appendChild(n),n.src="javascript:",(t=n.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),c=t.F;r--;)delete c.prototype[o[r]];return c()};t.exports=Object.create||function(t,n){var e;return null!==t?(a.prototype=r(t),e=new a,a.prototype=null,e[u]=t):e=c(),void 0===n?e:i(e,n)}},function(t,n,e){var r=e(98),i=e(65).concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,i)}},function(t,n,e){var r=e(13),i=e(10),o=e(64)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,n,e){var r=e(5)("unscopables"),i=Array.prototype;null==i[r]&&e(14)(i,r,{}),t.exports=function(t){i[r][t]=!0}},function(t,n,e){var r=e(4);t.exports=function(t,n){if(!r(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},function(t,n,e){var r=e(9).f,i=e(13),o=e(5)("toStringTag");t.exports=function(t,n,e){t&&!i(t=e?t:t.prototype,o)&&r(t,o,{configurable:!0,value:n})}},function(t,n,e){var r=e(0),i=e(26),o=e(2),u=e(68),a="["+u+"]",c=RegExp("^"+a+a+"*"),s=RegExp(a+a+"*$"),f=function(t,n,e){var i={},a=o((function(){return!!u[t]()||"​"!="​"[t]()})),c=i[t]=a?n(l):u[t];e&&(i[e]=c),r(r.P+r.F*a,"String",i)},l=f.trim=function(t,n){return t=String(i(t)),1&n&&(t=t.replace(c,"")),2&n&&(t=t.replace(s,"")),t};t.exports=f},function(t,n){t.exports={}},function(t,n,e){"use strict";var r=e(1),i=e(9),o=e(8),u=e(5)("species");t.exports=function(t){var n=r[t];o&&n&&!n[u]&&i.f(n,u,{configurable:!0,get:function(){return this}})}},function(t,n){t.exports=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t}},function(t,n,e){var r=e(11);t.exports=function(t,n,e){for(var i in n)r(t,i,n[i],e);return t}},function(t,n,e){var r=e(25);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var r=e(25),i=e(5)("toStringTag"),o="Arguments"==r(function(){return arguments}());t.exports=function(t){var n,e,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=function(t,n){try{return t[n]}catch(t){}}(n=Object(t),i))?e:o?r(n):"Object"==(u=r(n))&&"function"==typeof n.callee?"Arguments":u}},function(t,n,e){var r=e(3),i=e(20),o=e(5)("species");t.exports=function(t,n){var e,u=r(t).constructor;return void 0===u||null==(e=r(u)[o])?n:i(e)}},function(t,n,e){var r=e(7),i=e(1),o=i["__core-js_shared__"]||(i["__core-js_shared__"]={});(t.exports=function(t,n){return o[t]||(o[t]=void 0!==n?n:{})})("versions",[]).push({version:r.version,mode:e(32)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,n,e){var r=e(15),i=e(6),o=e(34);t.exports=function(t){return function(n,e,u){var a,c=r(n),s=i(c.length),f=o(u,s);if(t&&e!=e){for(;s>f;)if((a=c[f++])!=a)return!0}else for(;s>f;f++)if((t||f in c)&&c[f]===e)return t||f||0;return!t&&-1}}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){var r=e(25);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,n,e){var r=e(5)("iterator"),i=!1;try{var o=[7][r]();o.return=function(){i=!0},Array.from(o,(function(){throw 2}))}catch(t){}t.exports=function(t,n){if(!n&&!i)return!1;var e=!1;try{var o=[7],u=o[r]();u.next=function(){return{done:e=!0}},o[r]=function(){return u},t(o)}catch(t){}return e}},function(t,n,e){"use strict";var r=e(3);t.exports=function(){var t=r(this),n="";return t.global&&(n+="g"),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),t.unicode&&(n+="u"),t.sticky&&(n+="y"),n}},function(t,n,e){"use strict";var r=e(48),i=RegExp.prototype.exec;t.exports=function(t,n){var e=t.exec;if("function"==typeof e){var o=e.call(t,n);if("object"!=typeof o)throw new TypeError("RegExp exec method returned something other than an Object or null");return o}if("RegExp"!==r(t))throw new TypeError("RegExp#exec called on incompatible receiver");return i.call(t,n)}},function(t,n,e){"use strict";e(116);var r=e(11),i=e(14),o=e(2),u=e(26),a=e(5),c=e(83),s=a("species"),f=!o((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),l=function(){var t=/(?:)/,n=t.exec;t.exec=function(){return n.apply(this,arguments)};var e="ab".split(t);return 2===e.length&&"a"===e[0]&&"b"===e[1]}();t.exports=function(t,n,e){var h=a(t),d=!o((function(){var n={};return n[h]=function(){return 7},7!=""[t](n)})),p=d?!o((function(){var n=!1,e=/a/;return e.exec=function(){return n=!0,null},"split"===t&&(e.constructor={},e.constructor[s]=function(){return e}),e[h](""),!n})):void 0;if(!d||!p||"replace"===t&&!f||"split"===t&&!l){var v=/./[h],g=e(u,h,""[t],(function(t,n,e,r,i){return n.exec===c?d&&!i?{done:!0,value:v.call(n,e,r)}:{done:!0,value:t.call(e,n,r)}:{done:!1}})),y=g[0],m=g[1];r(String.prototype,t,y),i(RegExp.prototype,h,2==n?function(t,n){return m.call(t,this,n)}:function(t){return m.call(t,this)})}}},function(t,n,e){var r=e(19),i=e(111),o=e(78),u=e(3),a=e(6),c=e(80),s={},f={};(n=t.exports=function(t,n,e,l,h){var d,p,v,g,y=h?function(){return t}:c(t),m=r(e,l,n?2:1),b=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(o(y)){for(d=a(t.length);d>b;b++)if((g=n?m(u(p=t[b])[0],p[1]):m(t[b]))===s||g===f)return g}else for(v=y.call(t);!(p=v.next()).done;)if((g=i(v,m,p.value,n))===s||g===f)return g}).BREAK=s,n.RETURN=f},function(t,n,e){var r=e(1).navigator;t.exports=r&&r.userAgent||""},function(t,n,e){"use strict";var r=e(1),i=e(0),o=e(11),u=e(45),a=e(29),c=e(58),s=e(44),f=e(4),l=e(2),h=e(54),d=e(40),p=e(69);t.exports=function(t,n,e,v,g,y){var m=r[t],b=m,S=g?"set":"add",w=b&&b.prototype,_={},M=function(t){var n=w[t];o(w,t,"delete"==t?function(t){return!(y&&!f(t))&&n.call(this,0===t?0:t)}:"has"==t?function(t){return!(y&&!f(t))&&n.call(this,0===t?0:t)}:"get"==t?function(t){return y&&!f(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function(t){return n.call(this,0===t?0:t),this}:function(t,e){return n.call(this,0===t?0:t,e),this})};if("function"==typeof b&&(y||w.forEach&&!l((function(){(new b).entries().next()})))){var x=new b,P=x[S](y?{}:-0,1)!=x,O=l((function(){x.has(1)})),F=h((function(t){new b(t)})),A=!y&&l((function(){for(var t=new b,n=5;n--;)t[S](n,n);return!t.has(-0)}));F||((b=n((function(n,e){s(n,b,t);var r=p(new m,n,b);return null!=e&&c(e,g,r[S],r),r}))).prototype=w,w.constructor=b),(O||A)&&(M("delete"),M("has"),g&&M("get")),(A||P)&&M(S),y&&w.clear&&delete w.clear}else b=v.getConstructor(n,t,g,S),u(b.prototype,e),a.NEED=!0;return d(b,t),_[t]=b,i(i.G+i.W+i.F*(b!=m),_),y||v.setStrong(b,t,g),b}},function(t,n,e){for(var r,i=e(1),o=e(14),u=e(31),a=u("typed_array"),c=u("view"),s=!(!i.ArrayBuffer||!i.DataView),f=s,l=0,h="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");l<9;)(r=i[h[l++]])?(o(r.prototype,a,!0),o(r.prototype,c,!0)):f=!1;t.exports={ABV:s,CONSTR:f,TYPED:a,VIEW:c}},function(t,n,e){var r=e(4),i=e(1).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,n,e){n.f=e(5)},function(t,n,e){var r=e(50)("keys"),i=e(31);t.exports=function(t){return r[t]||(r[t]=i(t))}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n,e){var r=e(1).document;t.exports=r&&r.documentElement},function(t,n,e){var r=e(4),i=e(3),o=function(t,n){if(i(t),!r(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,r){try{(r=e(19)(Function.call,e(22).f(Object.prototype,"__proto__").set,2))(t,[]),n=!(t instanceof Array)}catch(t){n=!0}return function(t,e){return o(t,e),n?t.__proto__=e:r(t,e),t}}({},!1):void 0),check:o}},function(t,n){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},function(t,n,e){var r=e(4),i=e(67).set;t.exports=function(t,n,e){var o,u=n.constructor;return u!==e&&"function"==typeof u&&(o=u.prototype)!==e.prototype&&r(o)&&i&&i(t,o),t}},function(t,n,e){"use strict";var r=e(21),i=e(26);t.exports=function(t){var n=String(i(this)),e="",o=r(t);if(o<0||o==1/0)throw RangeError("Count can't be negative");for(;o>0;(o>>>=1)&&(n+=n))1&o&&(e+=n);return e}},function(t,n){t.exports=Math.sign||function(t){return 0==(t=+t)||t!=t?t:t<0?-1:1}},function(t,n){var e=Math.expm1;t.exports=!e||e(10)>22025.465794806718||e(10)<22025.465794806718||-2e-17!=e(-2e-17)?function(t){return 0==(t=+t)?t:t>-1e-6&&t<1e-6?t+t*t/2:Math.exp(t)-1}:e},function(t,n,e){var r=e(21),i=e(26);t.exports=function(t){return function(n,e){var o,u,a=String(i(n)),c=r(e),s=a.length;return c<0||c>=s?t?"":void 0:(o=a.charCodeAt(c))<55296||o>56319||c+1===s||(u=a.charCodeAt(c+1))<56320||u>57343?t?a.charAt(c):o:t?a.slice(c,c+2):u-56320+(o-55296<<10)+65536}}},function(t,n,e){"use strict";var r=e(32),i=e(0),o=e(11),u=e(14),a=e(42),c=e(110),s=e(40),f=e(37),l=e(5)("iterator"),h=!([].keys&&"next"in[].keys()),d=function(){return this};t.exports=function(t,n,e,p,v,g,y){c(e,n,p);var m,b,S,w=function(t){if(!h&&t in P)return P[t];switch(t){case"keys":case"values":return function(){return new e(this,t)}}return function(){return new e(this,t)}},_=n+" Iterator",M="values"==v,x=!1,P=t.prototype,O=P[l]||P["@@iterator"]||v&&P[v],F=O||w(v),A=v?M?w("entries"):F:void 0,E="Array"==n&&P.entries||O;if(E&&(S=f(E.call(new t)))!==Object.prototype&&S.next&&(s(S,_,!0),r||"function"==typeof S[l]||u(S,l,d)),M&&O&&"values"!==O.name&&(x=!0,F=function(){return O.call(this)}),r&&!y||!h&&!x&&P[l]||u(P,l,F),a[n]=F,a[_]=d,v)if(m={values:M?F:w("values"),keys:g?F:w("keys"),entries:A},y)for(b in m)b in P||o(P,b,m[b]);else i(i.P+i.F*(h||x),n,m);return m}},function(t,n,e){var r=e(76),i=e(26);t.exports=function(t,n,e){if(r(n))throw TypeError("String#"+e+" doesn't accept regex!");return String(i(t))}},function(t,n,e){var r=e(4),i=e(25),o=e(5)("match");t.exports=function(t){var n;return r(t)&&(void 0!==(n=t[o])?!!n:"RegExp"==i(t))}},function(t,n,e){var r=e(5)("match");t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r]=!1,!"/./"[t](n)}catch(t){}}return!0}},function(t,n,e){var r=e(42),i=e(5)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},function(t,n,e){"use strict";var r=e(9),i=e(30);t.exports=function(t,n,e){n in t?r.f(t,n,i(0,e)):t[n]=e}},function(t,n,e){var r=e(48),i=e(5)("iterator"),o=e(42);t.exports=e(7).getIteratorMethod=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,n,e){"use strict";var r=e(10),i=e(34),o=e(6);t.exports=function(t){for(var n=r(this),e=o(n.length),u=arguments.length,a=i(u>1?arguments[1]:void 0,e),c=u>2?arguments[2]:void 0,s=void 0===c?e:i(c,e);s>a;)n[a++]=t;return n}},function(t,n,e){"use strict";var r=e(38),i=e(115),o=e(42),u=e(15);t.exports=e(74)(Array,"Array",(function(t,n){this._t=u(t),this._i=0,this._k=n}),(function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,i(1)):i(0,"keys"==n?e:"values"==n?t[e]:[e,t[e]])}),"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries")},function(t,n,e){"use strict";var r,i,o=e(55),u=RegExp.prototype.exec,a=String.prototype.replace,c=u,s=(r=/a/,i=/b*/g,u.call(r,"a"),u.call(i,"a"),0!==r.lastIndex||0!==i.lastIndex),f=void 0!==/()??/.exec("")[1];(s||f)&&(c=function(t){var n,e,r,i,c=this;return f&&(e=new RegExp("^"+c.source+"$(?!\\s)",o.call(c))),s&&(n=c.lastIndex),r=u.call(c,t),s&&r&&(c.lastIndex=c.global?r.index+r[0].length:n),f&&r&&r.length>1&&a.call(r[0],e,(function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(r[i]=void 0)})),r}),t.exports=c},function(t,n,e){"use strict";var r=e(73)(!0);t.exports=function(t,n,e){return n+(e?r(t,n).length:1)}},function(t,n,e){var r,i,o,u=e(19),a=e(104),c=e(66),s=e(62),f=e(1),l=f.process,h=f.setImmediate,d=f.clearImmediate,p=f.MessageChannel,v=f.Dispatch,g=0,y={},m=function(){var t=+this;if(y.hasOwnProperty(t)){var n=y[t];delete y[t],n()}},b=function(t){m.call(t.data)};h&&d||(h=function(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return y[++g]=function(){a("function"==typeof t?t:Function(t),n)},r(g),g},d=function(t){delete y[t]},"process"==e(25)(l)?r=function(t){l.nextTick(u(m,t,1))}:v&&v.now?r=function(t){v.now(u(m,t,1))}:p?(o=(i=new p).port2,i.port1.onmessage=b,r=u(o.postMessage,o,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",b,!1)):r="onreadystatechange"in s("script")?function(t){c.appendChild(s("script")).onreadystatechange=function(){c.removeChild(this),m.call(t)}}:function(t){setTimeout(u(m,t,1),0)}),t.exports={set:h,clear:d}},function(t,n,e){"use strict";var r=e(1),i=e(8),o=e(32),u=e(61),a=e(14),c=e(45),s=e(2),f=e(44),l=e(21),h=e(6),d=e(123),p=e(36).f,v=e(9).f,g=e(81),y=e(40),m="prototype",b="Wrong index!",S=r.ArrayBuffer,w=r.DataView,_=r.Math,M=r.RangeError,x=r.Infinity,P=S,O=_.abs,F=_.pow,A=_.floor,E=_.log,N=_.LN2,R=i?"_b":"buffer",k=i?"_l":"byteLength",T=i?"_o":"byteOffset";function I(t,n,e){var r,i,o,u=new Array(e),a=8*e-n-1,c=(1<<a)-1,s=c>>1,f=23===n?F(2,-24)-F(2,-77):0,l=0,h=t<0||0===t&&1/t<0?1:0;for((t=O(t))!=t||t===x?(i=t!=t?1:0,r=c):(r=A(E(t)/N),t*(o=F(2,-r))<1&&(r--,o*=2),(t+=r+s>=1?f/o:f*F(2,1-s))*o>=2&&(r++,o/=2),r+s>=c?(i=0,r=c):r+s>=1?(i=(t*o-1)*F(2,n),r+=s):(i=t*F(2,s-1)*F(2,n),r=0));n>=8;u[l++]=255&i,i/=256,n-=8);for(r=r<<n|i,a+=n;a>0;u[l++]=255&r,r/=256,a-=8);return u[--l]|=128*h,u}function j(t,n,e){var r,i=8*e-n-1,o=(1<<i)-1,u=o>>1,a=i-7,c=e-1,s=t[c--],f=127&s;for(s>>=7;a>0;f=256*f+t[c],c--,a-=8);for(r=f&(1<<-a)-1,f>>=-a,a+=n;a>0;r=256*r+t[c],c--,a-=8);if(0===f)f=1-u;else{if(f===o)return r?NaN:s?-x:x;r+=F(2,n),f-=u}return(s?-1:1)*r*F(2,f-n)}function L(t){return t[3]<<24|t[2]<<16|t[1]<<8|t[0]}function B(t){return[255&t]}function C(t){return[255&t,t>>8&255]}function W(t){return[255&t,t>>8&255,t>>16&255,t>>24&255]}function V(t){return I(t,52,8)}function G(t){return I(t,23,4)}function D(t,n,e){v(t[m],n,{get:function(){return this[e]}})}function U(t,n,e,r){var i=d(+e);if(i+n>t[k])throw M(b);var o=t[R]._b,u=i+t[T],a=o.slice(u,u+n);return r?a:a.reverse()}function z(t,n,e,r,i,o){var u=d(+e);if(u+n>t[k])throw M(b);for(var a=t[R]._b,c=u+t[T],s=r(+i),f=0;f<n;f++)a[c+f]=s[o?f:n-f-1]}if(u.ABV){if(!s((function(){S(1)}))||!s((function(){new S(-1)}))||s((function(){return new S,new S(1.5),new S(NaN),"ArrayBuffer"!=S.name}))){for(var q,K=(S=function(t){return f(this,S),new P(d(t))})[m]=P[m],Y=p(P),Q=0;Y.length>Q;)(q=Y[Q++])in S||a(S,q,P[q]);o||(K.constructor=S)}var H=new w(new S(2)),J=w[m].setInt8;H.setInt8(0,2147483648),H.setInt8(1,2147483649),!H.getInt8(0)&&H.getInt8(1)||c(w[m],{setInt8:function(t,n){J.call(this,t,n<<24>>24)},setUint8:function(t,n){J.call(this,t,n<<24>>24)}},!0)}else S=function(t){f(this,S,"ArrayBuffer");var n=d(t);this._b=g.call(new Array(n),0),this[k]=n},w=function(t,n,e){f(this,w,"DataView"),f(t,S,"DataView");var r=t[k],i=l(n);if(i<0||i>r)throw M("Wrong offset!");if(i+(e=void 0===e?r-i:h(e))>r)throw M("Wrong length!");this[R]=t,this[T]=i,this[k]=e},i&&(D(S,"byteLength","_l"),D(w,"buffer","_b"),D(w,"byteLength","_l"),D(w,"byteOffset","_o")),c(w[m],{getInt8:function(t){return U(this,1,t)[0]<<24>>24},getUint8:function(t){return U(this,1,t)[0]},getInt16:function(t){var n=U(this,2,t,arguments[1]);return(n[1]<<8|n[0])<<16>>16},getUint16:function(t){var n=U(this,2,t,arguments[1]);return n[1]<<8|n[0]},getInt32:function(t){return L(U(this,4,t,arguments[1]))},getUint32:function(t){return L(U(this,4,t,arguments[1]))>>>0},getFloat32:function(t){return j(U(this,4,t,arguments[1]),23,4)},getFloat64:function(t){return j(U(this,8,t,arguments[1]),52,8)},setInt8:function(t,n){z(this,1,t,B,n)},setUint8:function(t,n){z(this,1,t,B,n)},setInt16:function(t,n){z(this,2,t,C,n,arguments[2])},setUint16:function(t,n){z(this,2,t,C,n,arguments[2])},setInt32:function(t,n){z(this,4,t,W,n,arguments[2])},setUint32:function(t,n){z(this,4,t,W,n,arguments[2])},setFloat32:function(t,n){z(this,4,t,G,n,arguments[2])},setFloat64:function(t,n){z(this,8,t,V,n,arguments[2])}});y(S,"ArrayBuffer"),y(w,"DataView"),a(w[m],u.VIEW,!0),n.ArrayBuffer=S,n.DataView=w},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){t.exports=!e(128)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r,i=(r=e(91))&&r.__esModule?r:{default:r},o=e(18);function u(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var a=function(){function t(){}var n,e,r;return t.getParser=function(t,n){if(void 0===n&&(n=!1),"string"!=typeof t)throw new Error("UserAgent should be a string");return new i.default(t,n)},t.parse=function(t){return new i.default(t).getResult()},n=t,r=[{key:"BROWSER_MAP",get:function(){return o.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return o.ENGINE_MAP}},{key:"OS_MAP",get:function(){return o.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return o.PLATFORMS_MAP}}],(e=null)&&u(n.prototype,e),r&&u(n,r),t}();n.default=a,t.exports=n.default},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r=c(e(92)),i=c(e(93)),o=c(e(94)),u=c(e(95)),a=c(e(17));function c(t){return t&&t.__esModule?t:{default:t}}var s=function(){function t(t,n){if(void 0===n&&(n=!1),null==t||""===t)throw new Error("UserAgent parameter can't be empty");this._ua=t,this.parsedResult={},!0!==n&&this.parse()}var n=t.prototype;return n.getUA=function(){return this._ua},n.test=function(t){return t.test(this._ua)},n.parseBrowser=function(){var t=this;this.parsedResult.browser={};var n=a.default.find(r.default,(function(n){if("function"==typeof n.test)return n.test(t);if(n.test instanceof Array)return n.test.some((function(n){return t.test(n)}));throw new Error("Browser's test function is not valid")}));return n&&(this.parsedResult.browser=n.describe(this.getUA())),this.parsedResult.browser},n.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},n.getBrowserName=function(t){return t?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},n.getBrowserVersion=function(){return this.getBrowser().version},n.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},n.parseOS=function(){var t=this;this.parsedResult.os={};var n=a.default.find(i.default,(function(n){if("function"==typeof n.test)return n.test(t);if(n.test instanceof Array)return n.test.some((function(n){return t.test(n)}));throw new Error("Browser's test function is not valid")}));return n&&(this.parsedResult.os=n.describe(this.getUA())),this.parsedResult.os},n.getOSName=function(t){var n=this.getOS().name;return t?String(n).toLowerCase()||"":n||""},n.getOSVersion=function(){return this.getOS().version},n.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},n.getPlatformType=function(t){void 0===t&&(t=!1);var n=this.getPlatform().type;return t?String(n).toLowerCase()||"":n||""},n.parsePlatform=function(){var t=this;this.parsedResult.platform={};var n=a.default.find(o.default,(function(n){if("function"==typeof n.test)return n.test(t);if(n.test instanceof Array)return n.test.some((function(n){return t.test(n)}));throw new Error("Browser's test function is not valid")}));return n&&(this.parsedResult.platform=n.describe(this.getUA())),this.parsedResult.platform},n.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},n.getEngineName=function(t){return t?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},n.parseEngine=function(){var t=this;this.parsedResult.engine={};var n=a.default.find(u.default,(function(n){if("function"==typeof n.test)return n.test(t);if(n.test instanceof Array)return n.test.some((function(n){return t.test(n)}));throw new Error("Browser's test function is not valid")}));return n&&(this.parsedResult.engine=n.describe(this.getUA())),this.parsedResult.engine},n.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},n.getResult=function(){return a.default.assign({},this.parsedResult)},n.satisfies=function(t){var n=this,e={},r=0,i={},o=0;if(Object.keys(t).forEach((function(n){var u=t[n];"string"==typeof u?(i[n]=u,o+=1):"object"==typeof u&&(e[n]=u,r+=1)})),r>0){var u=Object.keys(e),c=a.default.find(u,(function(t){return n.isOS(t)}));if(c){var s=this.satisfies(e[c]);if(void 0!==s)return s}var f=a.default.find(u,(function(t){return n.isPlatform(t)}));if(f){var l=this.satisfies(e[f]);if(void 0!==l)return l}}if(o>0){var h=Object.keys(i),d=a.default.find(h,(function(t){return n.isBrowser(t,!0)}));if(void 0!==d)return this.compareVersion(i[d])}},n.isBrowser=function(t,n){void 0===n&&(n=!1);var e=this.getBrowserName().toLowerCase(),r=t.toLowerCase(),i=a.default.getBrowserTypeByAlias(r);return n&&i&&(r=i.toLowerCase()),r===e},n.compareVersion=function(t){var n=[0],e=t,r=!1,i=this.getBrowserVersion();if("string"==typeof i)return">"===t[0]||"<"===t[0]?(e=t.substr(1),"="===t[1]?(r=!0,e=t.substr(2)):n=[],">"===t[0]?n.push(1):n.push(-1)):"="===t[0]?e=t.substr(1):"~"===t[0]&&(r=!0,e=t.substr(1)),n.indexOf(a.default.compareVersions(i,e,r))>-1},n.isOS=function(t){return this.getOSName(!0)===String(t).toLowerCase()},n.isPlatform=function(t){return this.getPlatformType(!0)===String(t).toLowerCase()},n.isEngine=function(t){return this.getEngineName(!0)===String(t).toLowerCase()},n.is=function(t){return this.isBrowser(t)||this.isOS(t)||this.isPlatform(t)},n.some=function(t){var n=this;return void 0===t&&(t=[]),t.some((function(t){return n.is(t)}))},t}();n.default=s,t.exports=n.default},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r,i=(r=e(17))&&r.__esModule?r:{default:r};var o=/version\/(\d+(\.?_?\d+)+)/i,u=[{test:[/googlebot/i],describe:function(t){var n={name:"Googlebot"},e=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/opera/i],describe:function(t){var n={name:"Opera"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/opr\/|opios/i],describe:function(t){var n={name:"Opera"},e=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/SamsungBrowser/i],describe:function(t){var n={name:"Samsung Internet for Android"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/Whale/i],describe:function(t){var n={name:"NAVER Whale Browser"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/MZBrowser/i],describe:function(t){var n={name:"MZ Browser"},e=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/focus/i],describe:function(t){var n={name:"Focus"},e=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/swing/i],describe:function(t){var n={name:"Swing"},e=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/coast/i],describe:function(t){var n={name:"Opera Coast"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/opt\/\d+(?:.?_?\d+)+/i],describe:function(t){var n={name:"Opera Touch"},e=i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/yabrowser/i],describe:function(t){var n={name:"Yandex Browser"},e=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/ucbrowser/i],describe:function(t){var n={name:"UC Browser"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/Maxthon|mxios/i],describe:function(t){var n={name:"Maxthon"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/epiphany/i],describe:function(t){var n={name:"Epiphany"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/puffin/i],describe:function(t){var n={name:"Puffin"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/sleipnir/i],describe:function(t){var n={name:"Sleipnir"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/k-meleon/i],describe:function(t){var n={name:"K-Meleon"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/micromessenger/i],describe:function(t){var n={name:"WeChat"},e=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/qqbrowser/i],describe:function(t){var n={name:/qqbrowserlite/i.test(t)?"QQ Browser Lite":"QQ Browser"},e=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/msie|trident/i],describe:function(t){var n={name:"Internet Explorer"},e=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/\sedg\//i],describe:function(t){var n={name:"Microsoft Edge"},e=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/edg([ea]|ios)/i],describe:function(t){var n={name:"Microsoft Edge"},e=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/vivaldi/i],describe:function(t){var n={name:"Vivaldi"},e=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/seamonkey/i],describe:function(t){var n={name:"SeaMonkey"},e=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/sailfish/i],describe:function(t){var n={name:"Sailfish"},e=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,t);return e&&(n.version=e),n}},{test:[/silk/i],describe:function(t){var n={name:"Amazon Silk"},e=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/phantom/i],describe:function(t){var n={name:"PhantomJS"},e=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/slimerjs/i],describe:function(t){var n={name:"SlimerJS"},e=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(t){var n={name:"BlackBerry"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/(web|hpw)[o0]s/i],describe:function(t){var n={name:"WebOS Browser"},e=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/bada/i],describe:function(t){var n={name:"Bada"},e=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/tizen/i],describe:function(t){var n={name:"Tizen"},e=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/qupzilla/i],describe:function(t){var n={name:"QupZilla"},e=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/firefox|iceweasel|fxios/i],describe:function(t){var n={name:"Firefox"},e=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/electron/i],describe:function(t){var n={name:"Electron"},e=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/chromium/i],describe:function(t){var n={name:"Chromium"},e=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/chrome|crios|crmo/i],describe:function(t){var n={name:"Chrome"},e=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/GSA/i],describe:function(t){var n={name:"Google Search"},e=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:function(t){var n=!t.test(/like android/i),e=t.test(/android/i);return n&&e},describe:function(t){var n={name:"Android Browser"},e=i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/playstation 4/i],describe:function(t){var n={name:"PlayStation 4"},e=i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/safari|applewebkit/i],describe:function(t){var n={name:"Safari"},e=i.default.getFirstMatch(o,t);return e&&(n.version=e),n}},{test:[/.*/i],describe:function(t){var n=-1!==t.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return{name:i.default.getFirstMatch(n,t),version:i.default.getSecondMatch(n,t)}}}];n.default=u,t.exports=n.default},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r,i=(r=e(17))&&r.__esModule?r:{default:r},o=e(18);var u=[{test:[/Roku\/DVP/],describe:function(t){var n=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,t);return{name:o.OS_MAP.Roku,version:n}}},{test:[/windows phone/i],describe:function(t){var n=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.WindowsPhone,version:n}}},{test:[/windows /i],describe:function(t){var n=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,t),e=i.default.getWindowsVersionName(n);return{name:o.OS_MAP.Windows,version:n,versionName:e}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(t){var n={name:o.OS_MAP.iOS},e=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,t);return e&&(n.version=e),n}},{test:[/macintosh/i],describe:function(t){var n=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,t).replace(/[_\s]/g,"."),e=i.default.getMacOSVersionName(n),r={name:o.OS_MAP.MacOS,version:n};return e&&(r.versionName=e),r}},{test:[/(ipod|iphone|ipad)/i],describe:function(t){var n=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,t).replace(/[_\s]/g,".");return{name:o.OS_MAP.iOS,version:n}}},{test:function(t){var n=!t.test(/like android/i),e=t.test(/android/i);return n&&e},describe:function(t){var n=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,t),e=i.default.getAndroidVersionName(n),r={name:o.OS_MAP.Android,version:n};return e&&(r.versionName=e),r}},{test:[/(web|hpw)[o0]s/i],describe:function(t){var n=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,t),e={name:o.OS_MAP.WebOS};return n&&n.length&&(e.version=n),e}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(t){var n=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,t)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,t)||i.default.getFirstMatch(/\bbb(\d+)/i,t);return{name:o.OS_MAP.BlackBerry,version:n}}},{test:[/bada/i],describe:function(t){var n=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.Bada,version:n}}},{test:[/tizen/i],describe:function(t){var n=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.Tizen,version:n}}},{test:[/linux/i],describe:function(){return{name:o.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return{name:o.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(t){var n=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.PlayStation4,version:n}}}];n.default=u,t.exports=n.default},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r,i=(r=e(17))&&r.__esModule?r:{default:r},o=e(18);var u=[{test:[/googlebot/i],describe:function(){return{type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(t){var n=i.default.getFirstMatch(/(can-l01)/i,t)&&"Nova",e={type:o.PLATFORMS_MAP.mobile,vendor:"Huawei"};return n&&(e.model=n),e}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet}}},{test:function(t){var n=t.test(/ipod|iphone/i),e=t.test(/like (ipod|iphone)/i);return n&&!e},describe:function(t){var n=i.default.getFirstMatch(/(ipod|iphone)/i,t);return{type:o.PLATFORMS_MAP.mobile,vendor:"Apple",model:n}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return{type:o.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return{type:o.PLATFORMS_MAP.mobile}}},{test:function(t){return"blackberry"===t.getBrowserName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(t){return"bada"===t.getBrowserName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.mobile}}},{test:function(t){return"windows phone"===t.getBrowserName()},describe:function(){return{type:o.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(t){var n=Number(String(t.getOSVersion()).split(".")[0]);return"android"===t.getOSName(!0)&&n>=3},describe:function(){return{type:o.PLATFORMS_MAP.tablet}}},{test:function(t){return"android"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.mobile}}},{test:function(t){return"macos"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(t){return"windows"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.desktop}}},{test:function(t){return"linux"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.desktop}}},{test:function(t){return"playstation 4"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.tv}}},{test:function(t){return"roku"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.tv}}}];n.default=u,t.exports=n.default},function(t,n,e){"use strict";n.__esModule=!0,n.default=void 0;var r,i=(r=e(17))&&r.__esModule?r:{default:r},o=e(18);var u=[{test:function(t){return"microsoft edge"===t.getBrowserName(!0)},describe:function(t){if(/\sedg\//i.test(t))return{name:o.ENGINE_MAP.Blink};var n=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,t);return{name:o.ENGINE_MAP.EdgeHTML,version:n}}},{test:[/trident/i],describe:function(t){var n={name:o.ENGINE_MAP.Trident},e=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:function(t){return t.test(/presto/i)},describe:function(t){var n={name:o.ENGINE_MAP.Presto},e=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:function(t){var n=t.test(/gecko/i),e=t.test(/like gecko/i);return n&&!e},describe:function(t){var n={name:o.ENGINE_MAP.Gecko},e=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return{name:o.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(t){var n={name:o.ENGINE_MAP.WebKit},e=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,t);return e&&(n.version=e),n}}];n.default=u,t.exports=n.default},function(t,n,e){t.exports=!e(8)&&!e(2)((function(){return 7!=Object.defineProperty(e(62)("div"),"a",{get:function(){return 7}}).a}))},function(t,n,e){var r=e(1),i=e(7),o=e(32),u=e(63),a=e(9).f;t.exports=function(t){var n=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in n||a(n,t,{value:u.f(t)})}},function(t,n,e){var r=e(13),i=e(15),o=e(51)(!1),u=e(64)("IE_PROTO");t.exports=function(t,n){var e,a=i(t),c=0,s=[];for(e in a)e!=u&&r(a,e)&&s.push(e);for(;n.length>c;)r(a,e=n[c++])&&(~o(s,e)||s.push(e));return s}},function(t,n,e){var r=e(9),i=e(3),o=e(33);t.exports=e(8)?Object.defineProperties:function(t,n){i(t);for(var e,u=o(n),a=u.length,c=0;a>c;)r.f(t,e=u[c++],n[e]);return t}},function(t,n,e){var r=e(15),i=e(36).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return u&&"[object Window]"==o.call(t)?function(t){try{return i(t)}catch(t){return u.slice()}}(t):i(r(t))}},function(t,n,e){"use strict";var r=e(8),i=e(33),o=e(52),u=e(47),a=e(10),c=e(46),s=Object.assign;t.exports=!s||e(2)((function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach((function(t){n[t]=t})),7!=s({},t)[e]||Object.keys(s({},n)).join("")!=r}))?function(t,n){for(var e=a(t),s=arguments.length,f=1,l=o.f,h=u.f;s>f;)for(var d,p=c(arguments[f++]),v=l?i(p).concat(l(p)):i(p),g=v.length,y=0;g>y;)d=v[y++],r&&!h.call(p,d)||(e[d]=p[d]);return e}:s},function(t,n){t.exports=Object.is||function(t,n){return t===n?0!==t||1/t==1/n:t!=t&&n!=n}},function(t,n,e){"use strict";var r=e(20),i=e(4),o=e(104),u=[].slice,a={},c=function(t,n,e){if(!(n in a)){for(var r=[],i=0;i<n;i++)r[i]="a["+i+"]";a[n]=Function("F,a","return new F("+r.join(",")+")")}return a[n](t,e)};t.exports=Function.bind||function(t){var n=r(this),e=u.call(arguments,1),a=function(){var r=e.concat(u.call(arguments));return this instanceof a?c(n,r.length,r):o(n,r,t)};return i(n.prototype)&&(a.prototype=n.prototype),a}},function(t,n){t.exports=function(t,n,e){var r=void 0===e;switch(n.length){case 0:return r?t():t.call(e);case 1:return r?t(n[0]):t.call(e,n[0]);case 2:return r?t(n[0],n[1]):t.call(e,n[0],n[1]);case 3:return r?t(n[0],n[1],n[2]):t.call(e,n[0],n[1],n[2]);case 4:return r?t(n[0],n[1],n[2],n[3]):t.call(e,n[0],n[1],n[2],n[3])}return t.apply(e,n)}},function(t,n,e){var r=e(1).parseInt,i=e(41).trim,o=e(68),u=/^[-+]?0[xX]/;t.exports=8!==r(o+"08")||22!==r(o+"0x16")?function(t,n){var e=i(String(t),3);return r(e,n>>>0||(u.test(e)?16:10))}:r},function(t,n,e){var r=e(1).parseFloat,i=e(41).trim;t.exports=1/r(e(68)+"-0")!=-1/0?function(t){var n=i(String(t),3),e=r(n);return 0===e&&"-"==n.charAt(0)?-0:e}:r},function(t,n,e){var r=e(25);t.exports=function(t,n){if("number"!=typeof t&&"Number"!=r(t))throw TypeError(n);return+t}},function(t,n,e){var r=e(4),i=Math.floor;t.exports=function(t){return!r(t)&&isFinite(t)&&i(t)===t}},function(t,n){t.exports=Math.log1p||function(t){return(t=+t)>-1e-8&&t<1e-8?t-t*t/2:Math.log(1+t)}},function(t,n,e){"use strict";var r=e(35),i=e(30),o=e(40),u={};e(14)(u,e(5)("iterator"),(function(){return this})),t.exports=function(t,n,e){t.prototype=r(u,{next:i(1,e)}),o(t,n+" Iterator")}},function(t,n,e){var r=e(3);t.exports=function(t,n,e,i){try{return i?n(r(e)[0],e[1]):n(e)}catch(n){var o=t.return;throw void 0!==o&&r(o.call(t)),n}}},function(t,n,e){var r=e(224);t.exports=function(t,n){return new(r(t))(n)}},function(t,n,e){var r=e(20),i=e(10),o=e(46),u=e(6);t.exports=function(t,n,e,a,c){r(n);var s=i(t),f=o(s),l=u(s.length),h=c?l-1:0,d=c?-1:1;if(e<2)for(;;){if(h in f){a=f[h],h+=d;break}if(h+=d,c?h<0:l<=h)throw TypeError("Reduce of empty array with no initial value")}for(;c?h>=0:l>h;h+=d)h in f&&(a=n(a,f[h],h,s));return a}},function(t,n,e){"use strict";var r=e(10),i=e(34),o=e(6);t.exports=[].copyWithin||function(t,n){var e=r(this),u=o(e.length),a=i(t,u),c=i(n,u),s=arguments.length>2?arguments[2]:void 0,f=Math.min((void 0===s?u:i(s,u))-c,u-a),l=1;for(c<a&&a<c+f&&(l=-1,c+=f-1,a+=f-1);f-- >0;)c in e?e[a]=e[c]:delete e[a],a+=l,c+=l;return e}},function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},function(t,n,e){"use strict";var r=e(83);e(0)({target:"RegExp",proto:!0,forced:r!==/./.exec},{exec:r})},function(t,n,e){e(8)&&"g"!=/./g.flags&&e(9).f(RegExp.prototype,"flags",{configurable:!0,get:e(55)})},function(t,n,e){"use strict";var r,i,o,u,a=e(32),c=e(1),s=e(19),f=e(48),l=e(0),h=e(4),d=e(20),p=e(44),v=e(58),g=e(49),y=e(85).set,m=e(244)(),b=e(119),S=e(245),w=e(59),_=e(120),M=c.TypeError,x=c.process,P=x&&x.versions,O=P&&P.v8||"",F=c.Promise,A="process"==f(x),E=function(){},N=i=b.f,R=!!function(){try{var t=F.resolve(1),n=(t.constructor={})[e(5)("species")]=function(t){t(E,E)};return(A||"function"==typeof PromiseRejectionEvent)&&t.then(E)instanceof n&&0!==O.indexOf("6.6")&&-1===w.indexOf("Chrome/66")}catch(t){}}(),k=function(t){var n;return!(!h(t)||"function"!=typeof(n=t.then))&&n},T=function(t,n){if(!t._n){t._n=!0;var e=t._c;m((function(){for(var r=t._v,i=1==t._s,o=0,u=function(n){var e,o,u,a=i?n.ok:n.fail,c=n.resolve,s=n.reject,f=n.domain;try{a?(i||(2==t._h&&L(t),t._h=1),!0===a?e=r:(f&&f.enter(),e=a(r),f&&(f.exit(),u=!0)),e===n.promise?s(M("Promise-chain cycle")):(o=k(e))?o.call(e,c,s):c(e)):s(r)}catch(t){f&&!u&&f.exit(),s(t)}};e.length>o;)u(e[o++]);t._c=[],t._n=!1,n&&!t._h&&I(t)}))}},I=function(t){y.call(c,(function(){var n,e,r,i=t._v,o=j(t);if(o&&(n=S((function(){A?x.emit("unhandledRejection",i,t):(e=c.onunhandledrejection)?e({promise:t,reason:i}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",i)})),t._h=A||j(t)?2:1),t._a=void 0,o&&n.e)throw n.v}))},j=function(t){return 1!==t._h&&0===(t._a||t._c).length},L=function(t){y.call(c,(function(){var n;A?x.emit("rejectionHandled",t):(n=c.onrejectionhandled)&&n({promise:t,reason:t._v})}))},B=function(t){var n=this;n._d||(n._d=!0,(n=n._w||n)._v=t,n._s=2,n._a||(n._a=n._c.slice()),T(n,!0))},C=function(t){var n,e=this;if(!e._d){e._d=!0,e=e._w||e;try{if(e===t)throw M("Promise can't be resolved itself");(n=k(t))?m((function(){var r={_w:e,_d:!1};try{n.call(t,s(C,r,1),s(B,r,1))}catch(t){B.call(r,t)}})):(e._v=t,e._s=1,T(e,!1))}catch(t){B.call({_w:e,_d:!1},t)}}};R||(F=function(t){p(this,F,"Promise","_h"),d(t),r.call(this);try{t(s(C,this,1),s(B,this,1))}catch(t){B.call(this,t)}},(r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=e(45)(F.prototype,{then:function(t,n){var e=N(g(this,F));return e.ok="function"!=typeof t||t,e.fail="function"==typeof n&&n,e.domain=A?x.domain:void 0,this._c.push(e),this._a&&this._a.push(e),this._s&&T(this,!1),e.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r;this.promise=t,this.resolve=s(C,t,1),this.reject=s(B,t,1)},b.f=N=function(t){return t===F||t===u?new o(t):i(t)}),l(l.G+l.W+l.F*!R,{Promise:F}),e(40)(F,"Promise"),e(43)("Promise"),u=e(7).Promise,l(l.S+l.F*!R,"Promise",{reject:function(t){var n=N(this);return(0,n.reject)(t),n.promise}}),l(l.S+l.F*(a||!R),"Promise",{resolve:function(t){return _(a&&this===u?F:this,t)}}),l(l.S+l.F*!(R&&e(54)((function(t){F.all(t).catch(E)}))),"Promise",{all:function(t){var n=this,e=N(n),r=e.resolve,i=e.reject,o=S((function(){var e=[],o=0,u=1;v(t,!1,(function(t){var a=o++,c=!1;e.push(void 0),u++,n.resolve(t).then((function(t){c||(c=!0,e[a]=t,--u||r(e))}),i)})),--u||r(e)}));return o.e&&i(o.v),e.promise},race:function(t){var n=this,e=N(n),r=e.reject,i=S((function(){v(t,!1,(function(t){n.resolve(t).then(e.resolve,r)}))}));return i.e&&r(i.v),e.promise}})},function(t,n,e){"use strict";var r=e(20);function i(t){var n,e;this.promise=new t((function(t,r){if(void 0!==n||void 0!==e)throw TypeError("Bad Promise constructor");n=t,e=r})),this.resolve=r(n),this.reject=r(e)}t.exports.f=function(t){return new i(t)}},function(t,n,e){var r=e(3),i=e(4),o=e(119);t.exports=function(t,n){if(r(t),i(n)&&n.constructor===t)return n;var e=o.f(t);return(0,e.resolve)(n),e.promise}},function(t,n,e){"use strict";var r=e(9).f,i=e(35),o=e(45),u=e(19),a=e(44),c=e(58),s=e(74),f=e(115),l=e(43),h=e(8),d=e(29).fastKey,p=e(39),v=h?"_s":"size",g=function(t,n){var e,r=d(n);if("F"!==r)return t._i[r];for(e=t._f;e;e=e.n)if(e.k==n)return e};t.exports={getConstructor:function(t,n,e,s){var f=t((function(t,r){a(t,f,n,"_i"),t._t=n,t._i=i(null),t._f=void 0,t._l=void 0,t[v]=0,null!=r&&c(r,e,t[s],t)}));return o(f.prototype,{clear:function(){for(var t=p(this,n),e=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete e[r.i];t._f=t._l=void 0,t[v]=0},delete:function(t){var e=p(this,n),r=g(e,t);if(r){var i=r.n,o=r.p;delete e._i[r.i],r.r=!0,o&&(o.n=i),i&&(i.p=o),e._f==r&&(e._f=i),e._l==r&&(e._l=o),e[v]--}return!!r},forEach:function(t){p(this,n);for(var e,r=u(t,arguments.length>1?arguments[1]:void 0,3);e=e?e.n:this._f;)for(r(e.v,e.k,this);e&&e.r;)e=e.p},has:function(t){return!!g(p(this,n),t)}}),h&&r(f.prototype,"size",{get:function(){return p(this,n)[v]}}),f},def:function(t,n,e){var r,i,o=g(t,n);return o?o.v=e:(t._l=o={i:i=d(n,!0),k:n,v:e,p:r=t._l,n:void 0,r:!1},t._f||(t._f=o),r&&(r.n=o),t[v]++,"F"!==i&&(t._i[i]=o)),t},getEntry:g,setStrong:function(t,n,e){s(t,n,(function(t,e){this._t=p(t,n),this._k=e,this._l=void 0}),(function(){for(var t=this._k,n=this._l;n&&n.r;)n=n.p;return this._t&&(this._l=n=n?n.n:this._t._f)?f(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(this._t=void 0,f(1))}),e?"entries":"values",!e,!0),l(n)}}},function(t,n,e){"use strict";var r=e(45),i=e(29).getWeak,o=e(3),u=e(4),a=e(44),c=e(58),s=e(24),f=e(13),l=e(39),h=s(5),d=s(6),p=0,v=function(t){return t._l||(t._l=new g)},g=function(){this.a=[]},y=function(t,n){return h(t.a,(function(t){return t[0]===n}))};g.prototype={get:function(t){var n=y(this,t);if(n)return n[1]},has:function(t){return!!y(this,t)},set:function(t,n){var e=y(this,t);e?e[1]=n:this.a.push([t,n])},delete:function(t){var n=d(this.a,(function(n){return n[0]===t}));return~n&&this.a.splice(n,1),!!~n}},t.exports={getConstructor:function(t,n,e,o){var s=t((function(t,r){a(t,s,n,"_i"),t._t=n,t._i=p++,t._l=void 0,null!=r&&c(r,e,t[o],t)}));return r(s.prototype,{delete:function(t){if(!u(t))return!1;var e=i(t);return!0===e?v(l(this,n)).delete(t):e&&f(e,this._i)&&delete e[this._i]},has:function(t){if(!u(t))return!1;var e=i(t);return!0===e?v(l(this,n)).has(t):e&&f(e,this._i)}}),s},def:function(t,n,e){var r=i(o(n),!0);return!0===r?v(t).set(n,e):r[t._i]=e,t},ufstore:v}},function(t,n,e){var r=e(21),i=e(6);t.exports=function(t){if(void 0===t)return 0;var n=r(t),e=i(n);if(n!==e)throw RangeError("Wrong length!");return e}},function(t,n,e){var r=e(36),i=e(52),o=e(3),u=e(1).Reflect;t.exports=u&&u.ownKeys||function(t){var n=r.f(o(t)),e=i.f;return e?n.concat(e(t)):n}},function(t,n,e){var r=e(6),i=e(70),o=e(26);t.exports=function(t,n,e,u){var a=String(o(t)),c=a.length,s=void 0===e?" ":String(e),f=r(n);if(f<=c||""==s)return a;var l=f-c,h=i.call(s,Math.ceil(l/s.length));return h.length>l&&(h=h.slice(0,l)),u?h+a:a+h}},function(t,n,e){var r=e(8),i=e(33),o=e(15),u=e(47).f;t.exports=function(t){return function(n){for(var e,a=o(n),c=i(a),s=c.length,f=0,l=[];s>f;)e=c[f++],r&&!u.call(a,e)||l.push(t?[e,a[e]]:a[e]);return l}}},function(t,n){var e=t.exports={version:"2.6.9"};"number"==typeof __e&&(__e=e)},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n,e){e(130),t.exports=e(90)},function(t,n,e){"use strict";e(131);var r,i=(r=e(303))&&r.__esModule?r:{default:r};i.default._babelPolyfill&&"undefined"!=typeof console&&console.warn&&console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended and may have consequences if different versions of the polyfills are applied sequentially. If you do need to load the polyfill more than once, use @babel/polyfill/noConflict instead to bypass the warning."),i.default._babelPolyfill=!0},function(t,n,e){"use strict";e(132),e(275),e(277),e(280),e(282),e(284),e(286),e(288),e(290),e(292),e(294),e(296),e(298),e(302)},function(t,n,e){e(133),e(136),e(137),e(138),e(139),e(140),e(141),e(142),e(143),e(144),e(145),e(146),e(147),e(148),e(149),e(150),e(151),e(152),e(153),e(154),e(155),e(156),e(157),e(158),e(159),e(160),e(161),e(162),e(163),e(164),e(165),e(166),e(167),e(168),e(169),e(170),e(171),e(172),e(173),e(174),e(175),e(176),e(177),e(179),e(180),e(181),e(182),e(183),e(184),e(185),e(186),e(187),e(188),e(189),e(190),e(191),e(192),e(193),e(194),e(195),e(196),e(197),e(198),e(199),e(200),e(201),e(202),e(203),e(204),e(205),e(206),e(207),e(208),e(209),e(210),e(211),e(212),e(214),e(215),e(217),e(218),e(219),e(220),e(221),e(222),e(223),e(225),e(226),e(227),e(228),e(229),e(230),e(231),e(232),e(233),e(234),e(235),e(236),e(237),e(82),e(238),e(116),e(239),e(117),e(240),e(241),e(242),e(243),e(118),e(246),e(247),e(248),e(249),e(250),e(251),e(252),e(253),e(254),e(255),e(256),e(257),e(258),e(259),e(260),e(261),e(262),e(263),e(264),e(265),e(266),e(267),e(268),e(269),e(270),e(271),e(272),e(273),e(274),t.exports=e(7)},function(t,n,e){"use strict";var r=e(1),i=e(13),o=e(8),u=e(0),a=e(11),c=e(29).KEY,s=e(2),f=e(50),l=e(40),h=e(31),d=e(5),p=e(63),v=e(97),g=e(135),y=e(53),m=e(3),b=e(4),S=e(10),w=e(15),_=e(28),M=e(30),x=e(35),P=e(100),O=e(22),F=e(52),A=e(9),E=e(33),N=O.f,R=A.f,k=P.f,T=r.Symbol,I=r.JSON,j=I&&I.stringify,L=d("_hidden"),B=d("toPrimitive"),C={}.propertyIsEnumerable,W=f("symbol-registry"),V=f("symbols"),G=f("op-symbols"),D=Object.prototype,U="function"==typeof T&&!!F.f,z=r.QObject,q=!z||!z.prototype||!z.prototype.findChild,K=o&&s((function(){return 7!=x(R({},"a",{get:function(){return R(this,"a",{value:7}).a}})).a}))?function(t,n,e){var r=N(D,n);r&&delete D[n],R(t,n,e),r&&t!==D&&R(D,n,r)}:R,Y=function(t){var n=V[t]=x(T.prototype);return n._k=t,n},Q=U&&"symbol"==typeof T.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof T},H=function(t,n,e){return t===D&&H(G,n,e),m(t),n=_(n,!0),m(e),i(V,n)?(e.enumerable?(i(t,L)&&t[L][n]&&(t[L][n]=!1),e=x(e,{enumerable:M(0,!1)})):(i(t,L)||R(t,L,M(1,{})),t[L][n]=!0),K(t,n,e)):R(t,n,e)},J=function(t,n){m(t);for(var e,r=g(n=w(n)),i=0,o=r.length;o>i;)H(t,e=r[i++],n[e]);return t},X=function(t){var n=C.call(this,t=_(t,!0));return!(this===D&&i(V,t)&&!i(G,t))&&(!(n||!i(this,t)||!i(V,t)||i(this,L)&&this[L][t])||n)},Z=function(t,n){if(t=w(t),n=_(n,!0),t!==D||!i(V,n)||i(G,n)){var e=N(t,n);return!e||!i(V,n)||i(t,L)&&t[L][n]||(e.enumerable=!0),e}},$=function(t){for(var n,e=k(w(t)),r=[],o=0;e.length>o;)i(V,n=e[o++])||n==L||n==c||r.push(n);return r},tt=function(t){for(var n,e=t===D,r=k(e?G:w(t)),o=[],u=0;r.length>u;)!i(V,n=r[u++])||e&&!i(D,n)||o.push(V[n]);return o};U||(a((T=function(){if(this instanceof T)throw TypeError("Symbol is not a constructor!");var t=h(arguments.length>0?arguments[0]:void 0),n=function(e){this===D&&n.call(G,e),i(this,L)&&i(this[L],t)&&(this[L][t]=!1),K(this,t,M(1,e))};return o&&q&&K(D,t,{configurable:!0,set:n}),Y(t)}).prototype,"toString",(function(){return this._k})),O.f=Z,A.f=H,e(36).f=P.f=$,e(47).f=X,F.f=tt,o&&!e(32)&&a(D,"propertyIsEnumerable",X,!0),p.f=function(t){return Y(d(t))}),u(u.G+u.W+u.F*!U,{Symbol:T});for(var nt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;nt.length>et;)d(nt[et++]);for(var rt=E(d.store),it=0;rt.length>it;)v(rt[it++]);u(u.S+u.F*!U,"Symbol",{for:function(t){return i(W,t+="")?W[t]:W[t]=T(t)},keyFor:function(t){if(!Q(t))throw TypeError(t+" is not a symbol!");for(var n in W)if(W[n]===t)return n},useSetter:function(){q=!0},useSimple:function(){q=!1}}),u(u.S+u.F*!U,"Object",{create:function(t,n){return void 0===n?x(t):J(x(t),n)},defineProperty:H,defineProperties:J,getOwnPropertyDescriptor:Z,getOwnPropertyNames:$,getOwnPropertySymbols:tt});var ot=s((function(){F.f(1)}));u(u.S+u.F*ot,"Object",{getOwnPropertySymbols:function(t){return F.f(S(t))}}),I&&u(u.S+u.F*(!U||s((function(){var t=T();return"[null]"!=j([t])||"{}"!=j({a:t})||"{}"!=j(Object(t))}))),"JSON",{stringify:function(t){for(var n,e,r=[t],i=1;arguments.length>i;)r.push(arguments[i++]);if(e=n=r[1],(b(n)||void 0!==t)&&!Q(t))return y(n)||(n=function(t,n){if("function"==typeof e&&(n=e.call(this,t,n)),!Q(n))return n}),r[1]=n,j.apply(I,r)}}),T.prototype[B]||e(14)(T.prototype,B,T.prototype.valueOf),l(T,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,n,e){t.exports=e(50)("native-function-to-string",Function.toString)},function(t,n,e){var r=e(33),i=e(52),o=e(47);t.exports=function(t){var n=r(t),e=i.f;if(e)for(var u,a=e(t),c=o.f,s=0;a.length>s;)c.call(t,u=a[s++])&&n.push(u);return n}},function(t,n,e){var r=e(0);r(r.S,"Object",{create:e(35)})},function(t,n,e){var r=e(0);r(r.S+r.F*!e(8),"Object",{defineProperty:e(9).f})},function(t,n,e){var r=e(0);r(r.S+r.F*!e(8),"Object",{defineProperties:e(99)})},function(t,n,e){var r=e(15),i=e(22).f;e(23)("getOwnPropertyDescriptor",(function(){return function(t,n){return i(r(t),n)}}))},function(t,n,e){var r=e(10),i=e(37);e(23)("getPrototypeOf",(function(){return function(t){return i(r(t))}}))},function(t,n,e){var r=e(10),i=e(33);e(23)("keys",(function(){return function(t){return i(r(t))}}))},function(t,n,e){e(23)("getOwnPropertyNames",(function(){return e(100).f}))},function(t,n,e){var r=e(4),i=e(29).onFreeze;e(23)("freeze",(function(t){return function(n){return t&&r(n)?t(i(n)):n}}))},function(t,n,e){var r=e(4),i=e(29).onFreeze;e(23)("seal",(function(t){return function(n){return t&&r(n)?t(i(n)):n}}))},function(t,n,e){var r=e(4),i=e(29).onFreeze;e(23)("preventExtensions",(function(t){return function(n){return t&&r(n)?t(i(n)):n}}))},function(t,n,e){var r=e(4);e(23)("isFrozen",(function(t){return function(n){return!r(n)||!!t&&t(n)}}))},function(t,n,e){var r=e(4);e(23)("isSealed",(function(t){return function(n){return!r(n)||!!t&&t(n)}}))},function(t,n,e){var r=e(4);e(23)("isExtensible",(function(t){return function(n){return!!r(n)&&(!t||t(n))}}))},function(t,n,e){var r=e(0);r(r.S+r.F,"Object",{assign:e(101)})},function(t,n,e){var r=e(0);r(r.S,"Object",{is:e(102)})},function(t,n,e){var r=e(0);r(r.S,"Object",{setPrototypeOf:e(67).set})},function(t,n,e){"use strict";var r=e(48),i={};i[e(5)("toStringTag")]="z",i+""!="[object z]"&&e(11)(Object.prototype,"toString",(function(){return"[object "+r(this)+"]"}),!0)},function(t,n,e){var r=e(0);r(r.P,"Function",{bind:e(103)})},function(t,n,e){var r=e(9).f,i=Function.prototype,o=/^\s*function ([^ (]*)/;"name"in i||e(8)&&r(i,"name",{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},function(t,n,e){"use strict";var r=e(4),i=e(37),o=e(5)("hasInstance"),u=Function.prototype;o in u||e(9).f(u,o,{value:function(t){if("function"!=typeof this||!r(t))return!1;if(!r(this.prototype))return t instanceof this;for(;t=i(t);)if(this.prototype===t)return!0;return!1}})},function(t,n,e){var r=e(0),i=e(105);r(r.G+r.F*(parseInt!=i),{parseInt:i})},function(t,n,e){var r=e(0),i=e(106);r(r.G+r.F*(parseFloat!=i),{parseFloat:i})},function(t,n,e){"use strict";var r=e(1),i=e(13),o=e(25),u=e(69),a=e(28),c=e(2),s=e(36).f,f=e(22).f,l=e(9).f,h=e(41).trim,d=r.Number,p=d,v=d.prototype,g="Number"==o(e(35)(v)),y="trim"in String.prototype,m=function(t){var n=a(t,!1);if("string"==typeof n&&n.length>2){var e,r,i,o=(n=y?n.trim():h(n,3)).charCodeAt(0);if(43===o||45===o){if(88===(e=n.charCodeAt(2))||120===e)return NaN}else if(48===o){switch(n.charCodeAt(1)){case 66:case 98:r=2,i=49;break;case 79:case 111:r=8,i=55;break;default:return+n}for(var u,c=n.slice(2),s=0,f=c.length;s<f;s++)if((u=c.charCodeAt(s))<48||u>i)return NaN;return parseInt(c,r)}}return+n};if(!d(" 0o1")||!d("0b1")||d("+0x1")){d=function(t){var n=arguments.length<1?0:t,e=this;return e instanceof d&&(g?c((function(){v.valueOf.call(e)})):"Number"!=o(e))?u(new p(m(n)),e,d):m(n)};for(var b,S=e(8)?s(p):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),w=0;S.length>w;w++)i(p,b=S[w])&&!i(d,b)&&l(d,b,f(p,b));d.prototype=v,v.constructor=d,e(11)(r,"Number",d)}},function(t,n,e){"use strict";var r=e(0),i=e(21),o=e(107),u=e(70),a=1..toFixed,c=Math.floor,s=[0,0,0,0,0,0],f="Number.toFixed: incorrect invocation!",l=function(t,n){for(var e=-1,r=n;++e<6;)r+=t*s[e],s[e]=r%1e7,r=c(r/1e7)},h=function(t){for(var n=6,e=0;--n>=0;)e+=s[n],s[n]=c(e/t),e=e%t*1e7},d=function(){for(var t=6,n="";--t>=0;)if(""!==n||0===t||0!==s[t]){var e=String(s[t]);n=""===n?e:n+u.call("0",7-e.length)+e}return n},p=function(t,n,e){return 0===n?e:n%2==1?p(t,n-1,e*t):p(t*t,n/2,e)};r(r.P+r.F*(!!a&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!e(2)((function(){a.call({})}))),"Number",{toFixed:function(t){var n,e,r,a,c=o(this,f),s=i(t),v="",g="0";if(s<0||s>20)throw RangeError(f);if(c!=c)return"NaN";if(c<=-1e21||c>=1e21)return String(c);if(c<0&&(v="-",c=-c),c>1e-21)if(e=(n=function(t){for(var n=0,e=t;e>=4096;)n+=12,e/=4096;for(;e>=2;)n+=1,e/=2;return n}(c*p(2,69,1))-69)<0?c*p(2,-n,1):c/p(2,n,1),e*=4503599627370496,(n=52-n)>0){for(l(0,e),r=s;r>=7;)l(1e7,0),r-=7;for(l(p(10,r,1),0),r=n-1;r>=23;)h(1<<23),r-=23;h(1<<r),l(1,1),h(2),g=d()}else l(0,e),l(1<<-n,0),g=d()+u.call("0",s);return g=s>0?v+((a=g.length)<=s?"0."+u.call("0",s-a)+g:g.slice(0,a-s)+"."+g.slice(a-s)):v+g}})},function(t,n,e){"use strict";var r=e(0),i=e(2),o=e(107),u=1..toPrecision;r(r.P+r.F*(i((function(){return"1"!==u.call(1,void 0)}))||!i((function(){u.call({})}))),"Number",{toPrecision:function(t){var n=o(this,"Number#toPrecision: incorrect invocation!");return void 0===t?u.call(n):u.call(n,t)}})},function(t,n,e){var r=e(0);r(r.S,"Number",{EPSILON:Math.pow(2,-52)})},function(t,n,e){var r=e(0),i=e(1).isFinite;r(r.S,"Number",{isFinite:function(t){return"number"==typeof t&&i(t)}})},function(t,n,e){var r=e(0);r(r.S,"Number",{isInteger:e(108)})},function(t,n,e){var r=e(0);r(r.S,"Number",{isNaN:function(t){return t!=t}})},function(t,n,e){var r=e(0),i=e(108),o=Math.abs;r(r.S,"Number",{isSafeInteger:function(t){return i(t)&&o(t)<=9007199254740991}})},function(t,n,e){var r=e(0);r(r.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},function(t,n,e){var r=e(0);r(r.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},function(t,n,e){var r=e(0),i=e(106);r(r.S+r.F*(Number.parseFloat!=i),"Number",{parseFloat:i})},function(t,n,e){var r=e(0),i=e(105);r(r.S+r.F*(Number.parseInt!=i),"Number",{parseInt:i})},function(t,n,e){var r=e(0),i=e(109),o=Math.sqrt,u=Math.acosh;r(r.S+r.F*!(u&&710==Math.floor(u(Number.MAX_VALUE))&&u(1/0)==1/0),"Math",{acosh:function(t){return(t=+t)<1?NaN:t>94906265.62425156?Math.log(t)+Math.LN2:i(t-1+o(t-1)*o(t+1))}})},function(t,n,e){var r=e(0),i=Math.asinh;r(r.S+r.F*!(i&&1/i(0)>0),"Math",{asinh:function t(n){return isFinite(n=+n)&&0!=n?n<0?-t(-n):Math.log(n+Math.sqrt(n*n+1)):n}})},function(t,n,e){var r=e(0),i=Math.atanh;r(r.S+r.F*!(i&&1/i(-0)<0),"Math",{atanh:function(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},function(t,n,e){var r=e(0),i=e(71);r(r.S,"Math",{cbrt:function(t){return i(t=+t)*Math.pow(Math.abs(t),1/3)}})},function(t,n,e){var r=e(0);r(r.S,"Math",{clz32:function(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},function(t,n,e){var r=e(0),i=Math.exp;r(r.S,"Math",{cosh:function(t){return(i(t=+t)+i(-t))/2}})},function(t,n,e){var r=e(0),i=e(72);r(r.S+r.F*(i!=Math.expm1),"Math",{expm1:i})},function(t,n,e){var r=e(0);r(r.S,"Math",{fround:e(178)})},function(t,n,e){var r=e(71),i=Math.pow,o=i(2,-52),u=i(2,-23),a=i(2,127)*(2-u),c=i(2,-126);t.exports=Math.fround||function(t){var n,e,i=Math.abs(t),s=r(t);return i<c?s*(i/c/u+1/o-1/o)*c*u:(e=(n=(1+u/o)*i)-(n-i))>a||e!=e?s*(1/0):s*e}},function(t,n,e){var r=e(0),i=Math.abs;r(r.S,"Math",{hypot:function(t,n){for(var e,r,o=0,u=0,a=arguments.length,c=0;u<a;)c<(e=i(arguments[u++]))?(o=o*(r=c/e)*r+1,c=e):o+=e>0?(r=e/c)*r:e;return c===1/0?1/0:c*Math.sqrt(o)}})},function(t,n,e){var r=e(0),i=Math.imul;r(r.S+r.F*e(2)((function(){return-5!=i(4294967295,5)||2!=i.length})),"Math",{imul:function(t,n){var e=+t,r=+n,i=65535&e,o=65535&r;return 0|i*o+((65535&e>>>16)*o+i*(65535&r>>>16)<<16>>>0)}})},function(t,n,e){var r=e(0);r(r.S,"Math",{log10:function(t){return Math.log(t)*Math.LOG10E}})},function(t,n,e){var r=e(0);r(r.S,"Math",{log1p:e(109)})},function(t,n,e){var r=e(0);r(r.S,"Math",{log2:function(t){return Math.log(t)/Math.LN2}})},function(t,n,e){var r=e(0);r(r.S,"Math",{sign:e(71)})},function(t,n,e){var r=e(0),i=e(72),o=Math.exp;r(r.S+r.F*e(2)((function(){return-2e-17!=!Math.sinh(-2e-17)})),"Math",{sinh:function(t){return Math.abs(t=+t)<1?(i(t)-i(-t))/2:(o(t-1)-o(-t-1))*(Math.E/2)}})},function(t,n,e){var r=e(0),i=e(72),o=Math.exp;r(r.S,"Math",{tanh:function(t){var n=i(t=+t),e=i(-t);return n==1/0?1:e==1/0?-1:(n-e)/(o(t)+o(-t))}})},function(t,n,e){var r=e(0);r(r.S,"Math",{trunc:function(t){return(t>0?Math.floor:Math.ceil)(t)}})},function(t,n,e){var r=e(0),i=e(34),o=String.fromCharCode,u=String.fromCodePoint;r(r.S+r.F*(!!u&&1!=u.length),"String",{fromCodePoint:function(t){for(var n,e=[],r=arguments.length,u=0;r>u;){if(n=+arguments[u++],i(n,1114111)!==n)throw RangeError(n+" is not a valid code point");e.push(n<65536?o(n):o(55296+((n-=65536)>>10),n%1024+56320))}return e.join("")}})},function(t,n,e){var r=e(0),i=e(15),o=e(6);r(r.S,"String",{raw:function(t){for(var n=i(t.raw),e=o(n.length),r=arguments.length,u=[],a=0;e>a;)u.push(String(n[a++])),a<r&&u.push(String(arguments[a]));return u.join("")}})},function(t,n,e){"use strict";e(41)("trim",(function(t){return function(){return t(this,3)}}))},function(t,n,e){"use strict";var r=e(73)(!0);e(74)(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})}))},function(t,n,e){"use strict";var r=e(0),i=e(73)(!1);r(r.P,"String",{codePointAt:function(t){return i(this,t)}})},function(t,n,e){"use strict";var r=e(0),i=e(6),o=e(75),u="".endsWith;r(r.P+r.F*e(77)("endsWith"),"String",{endsWith:function(t){var n=o(this,t,"endsWith"),e=arguments.length>1?arguments[1]:void 0,r=i(n.length),a=void 0===e?r:Math.min(i(e),r),c=String(t);return u?u.call(n,c,a):n.slice(a-c.length,a)===c}})},function(t,n,e){"use strict";var r=e(0),i=e(75);r(r.P+r.F*e(77)("includes"),"String",{includes:function(t){return!!~i(this,t,"includes").indexOf(t,arguments.length>1?arguments[1]:void 0)}})},function(t,n,e){var r=e(0);r(r.P,"String",{repeat:e(70)})},function(t,n,e){"use strict";var r=e(0),i=e(6),o=e(75),u="".startsWith;r(r.P+r.F*e(77)("startsWith"),"String",{startsWith:function(t){var n=o(this,t,"startsWith"),e=i(Math.min(arguments.length>1?arguments[1]:void 0,n.length)),r=String(t);return u?u.call(n,r,e):n.slice(e,e+r.length)===r}})},function(t,n,e){"use strict";e(12)("anchor",(function(t){return function(n){return t(this,"a","name",n)}}))},function(t,n,e){"use strict";e(12)("big",(function(t){return function(){return t(this,"big","","")}}))},function(t,n,e){"use strict";e(12)("blink",(function(t){return function(){return t(this,"blink","","")}}))},function(t,n,e){"use strict";e(12)("bold",(function(t){return function(){return t(this,"b","","")}}))},function(t,n,e){"use strict";e(12)("fixed",(function(t){return function(){return t(this,"tt","","")}}))},function(t,n,e){"use strict";e(12)("fontcolor",(function(t){return function(n){return t(this,"font","color",n)}}))},function(t,n,e){"use strict";e(12)("fontsize",(function(t){return function(n){return t(this,"font","size",n)}}))},function(t,n,e){"use strict";e(12)("italics",(function(t){return function(){return t(this,"i","","")}}))},function(t,n,e){"use strict";e(12)("link",(function(t){return function(n){return t(this,"a","href",n)}}))},function(t,n,e){"use strict";e(12)("small",(function(t){return function(){return t(this,"small","","")}}))},function(t,n,e){"use strict";e(12)("strike",(function(t){return function(){return t(this,"strike","","")}}))},function(t,n,e){"use strict";e(12)("sub",(function(t){return function(){return t(this,"sub","","")}}))},function(t,n,e){"use strict";e(12)("sup",(function(t){return function(){return t(this,"sup","","")}}))},function(t,n,e){var r=e(0);r(r.S,"Date",{now:function(){return(new Date).getTime()}})},function(t,n,e){"use strict";var r=e(0),i=e(10),o=e(28);r(r.P+r.F*e(2)((function(){return null!==new Date(NaN).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})})),"Date",{toJSON:function(t){var n=i(this),e=o(n);return"number"!=typeof e||isFinite(e)?n.toISOString():null}})},function(t,n,e){var r=e(0),i=e(213);r(r.P+r.F*(Date.prototype.toISOString!==i),"Date",{toISOString:i})},function(t,n,e){"use strict";var r=e(2),i=Date.prototype.getTime,o=Date.prototype.toISOString,u=function(t){return t>9?t:"0"+t};t.exports=r((function(){return"0385-07-25T07:06:39.999Z"!=o.call(new Date(-5e13-1))}))||!r((function(){o.call(new Date(NaN))}))?function(){if(!isFinite(i.call(this)))throw RangeError("Invalid time value");var t=this,n=t.getUTCFullYear(),e=t.getUTCMilliseconds(),r=n<0?"-":n>9999?"+":"";return r+("00000"+Math.abs(n)).slice(r?-6:-4)+"-"+u(t.getUTCMonth()+1)+"-"+u(t.getUTCDate())+"T"+u(t.getUTCHours())+":"+u(t.getUTCMinutes())+":"+u(t.getUTCSeconds())+"."+(e>99?e:"0"+u(e))+"Z"}:o},function(t,n,e){var r=Date.prototype,i=r.toString,o=r.getTime;new Date(NaN)+""!="Invalid Date"&&e(11)(r,"toString",(function(){var t=o.call(this);return t==t?i.call(this):"Invalid Date"}))},function(t,n,e){var r=e(5)("toPrimitive"),i=Date.prototype;r in i||e(14)(i,r,e(216))},function(t,n,e){"use strict";var r=e(3),i=e(28);t.exports=function(t){if("string"!==t&&"number"!==t&&"default"!==t)throw TypeError("Incorrect hint");return i(r(this),"number"!=t)}},function(t,n,e){var r=e(0);r(r.S,"Array",{isArray:e(53)})},function(t,n,e){"use strict";var r=e(19),i=e(0),o=e(10),u=e(111),a=e(78),c=e(6),s=e(79),f=e(80);i(i.S+i.F*!e(54)((function(t){Array.from(t)})),"Array",{from:function(t){var n,e,i,l,h=o(t),d="function"==typeof this?this:Array,p=arguments.length,v=p>1?arguments[1]:void 0,g=void 0!==v,y=0,m=f(h);if(g&&(v=r(v,p>2?arguments[2]:void 0,2)),null==m||d==Array&&a(m))for(e=new d(n=c(h.length));n>y;y++)s(e,y,g?v(h[y],y):h[y]);else for(l=m.call(h),e=new d;!(i=l.next()).done;y++)s(e,y,g?u(l,v,[i.value,y],!0):i.value);return e.length=y,e}})},function(t,n,e){"use strict";var r=e(0),i=e(79);r(r.S+r.F*e(2)((function(){function t(){}return!(Array.of.call(t)instanceof t)})),"Array",{of:function(){for(var t=0,n=arguments.length,e=new("function"==typeof this?this:Array)(n);n>t;)i(e,t,arguments[t++]);return e.length=n,e}})},function(t,n,e){"use strict";var r=e(0),i=e(15),o=[].join;r(r.P+r.F*(e(46)!=Object||!e(16)(o)),"Array",{join:function(t){return o.call(i(this),void 0===t?",":t)}})},function(t,n,e){"use strict";var r=e(0),i=e(66),o=e(25),u=e(34),a=e(6),c=[].slice;r(r.P+r.F*e(2)((function(){i&&c.call(i)})),"Array",{slice:function(t,n){var e=a(this.length),r=o(this);if(n=void 0===n?e:n,"Array"==r)return c.call(this,t,n);for(var i=u(t,e),s=u(n,e),f=a(s-i),l=new Array(f),h=0;h<f;h++)l[h]="String"==r?this.charAt(i+h):this[i+h];return l}})},function(t,n,e){"use strict";var r=e(0),i=e(20),o=e(10),u=e(2),a=[].sort,c=[1,2,3];r(r.P+r.F*(u((function(){c.sort(void 0)}))||!u((function(){c.sort(null)}))||!e(16)(a)),"Array",{sort:function(t){return void 0===t?a.call(o(this)):a.call(o(this),i(t))}})},function(t,n,e){"use strict";var r=e(0),i=e(24)(0),o=e(16)([].forEach,!0);r(r.P+r.F*!o,"Array",{forEach:function(t){return i(this,t,arguments[1])}})},function(t,n,e){var r=e(4),i=e(53),o=e(5)("species");t.exports=function(t){var n;return i(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!i(n.prototype)||(n=void 0),r(n)&&null===(n=n[o])&&(n=void 0)),void 0===n?Array:n}},function(t,n,e){"use strict";var r=e(0),i=e(24)(1);r(r.P+r.F*!e(16)([].map,!0),"Array",{map:function(t){return i(this,t,arguments[1])}})},function(t,n,e){"use strict";var r=e(0),i=e(24)(2);r(r.P+r.F*!e(16)([].filter,!0),"Array",{filter:function(t){return i(this,t,arguments[1])}})},function(t,n,e){"use strict";var r=e(0),i=e(24)(3);r(r.P+r.F*!e(16)([].some,!0),"Array",{some:function(t){return i(this,t,arguments[1])}})},function(t,n,e){"use strict";var r=e(0),i=e(24)(4);r(r.P+r.F*!e(16)([].every,!0),"Array",{every:function(t){return i(this,t,arguments[1])}})},function(t,n,e){"use strict";var r=e(0),i=e(113);r(r.P+r.F*!e(16)([].reduce,!0),"Array",{reduce:function(t){return i(this,t,arguments.length,arguments[1],!1)}})},function(t,n,e){"use strict";var r=e(0),i=e(113);r(r.P+r.F*!e(16)([].reduceRight,!0),"Array",{reduceRight:function(t){return i(this,t,arguments.length,arguments[1],!0)}})},function(t,n,e){"use strict";var r=e(0),i=e(51)(!1),o=[].indexOf,u=!!o&&1/[1].indexOf(1,-0)<0;r(r.P+r.F*(u||!e(16)(o)),"Array",{indexOf:function(t){return u?o.apply(this,arguments)||0:i(this,t,arguments[1])}})},function(t,n,e){"use strict";var r=e(0),i=e(15),o=e(21),u=e(6),a=[].lastIndexOf,c=!!a&&1/[1].lastIndexOf(1,-0)<0;r(r.P+r.F*(c||!e(16)(a)),"Array",{lastIndexOf:function(t){if(c)return a.apply(this,arguments)||0;var n=i(this),e=u(n.length),r=e-1;for(arguments.length>1&&(r=Math.min(r,o(arguments[1]))),r<0&&(r=e+r);r>=0;r--)if(r in n&&n[r]===t)return r||0;return-1}})},function(t,n,e){var r=e(0);r(r.P,"Array",{copyWithin:e(114)}),e(38)("copyWithin")},function(t,n,e){var r=e(0);r(r.P,"Array",{fill:e(81)}),e(38)("fill")},function(t,n,e){"use strict";var r=e(0),i=e(24)(5),o=!0;"find"in[]&&Array(1).find((function(){o=!1})),r(r.P+r.F*o,"Array",{find:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),e(38)("find")},function(t,n,e){"use strict";var r=e(0),i=e(24)(6),o="findIndex",u=!0;o in[]&&Array(1)[o]((function(){u=!1})),r(r.P+r.F*u,"Array",{findIndex:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),e(38)(o)},function(t,n,e){e(43)("Array")},function(t,n,e){var r=e(1),i=e(69),o=e(9).f,u=e(36).f,a=e(76),c=e(55),s=r.RegExp,f=s,l=s.prototype,h=/a/g,d=/a/g,p=new s(h)!==h;if(e(8)&&(!p||e(2)((function(){return d[e(5)("match")]=!1,s(h)!=h||s(d)==d||"/a/i"!=s(h,"i")})))){s=function(t,n){var e=this instanceof s,r=a(t),o=void 0===n;return!e&&r&&t.constructor===s&&o?t:i(p?new f(r&&!o?t.source:t,n):f((r=t instanceof s)?t.source:t,r&&o?c.call(t):n),e?this:l,s)};for(var v=function(t){t in s||o(s,t,{configurable:!0,get:function(){return f[t]},set:function(n){f[t]=n}})},g=u(f),y=0;g.length>y;)v(g[y++]);l.constructor=s,s.prototype=l,e(11)(r,"RegExp",s)}e(43)("RegExp")},function(t,n,e){"use strict";e(117);var r=e(3),i=e(55),o=e(8),u=/./.toString,a=function(t){e(11)(RegExp.prototype,"toString",t,!0)};e(2)((function(){return"/a/b"!=u.call({source:"a",flags:"b"})}))?a((function(){var t=r(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?i.call(t):void 0)})):"toString"!=u.name&&a((function(){return u.call(this)}))},function(t,n,e){"use strict";var r=e(3),i=e(6),o=e(84),u=e(56);e(57)("match",1,(function(t,n,e,a){return[function(e){var r=t(this),i=null==e?void 0:e[n];return void 0!==i?i.call(e,r):new RegExp(e)[n](String(r))},function(t){var n=a(e,t,this);if(n.done)return n.value;var c=r(t),s=String(this);if(!c.global)return u(c,s);var f=c.unicode;c.lastIndex=0;for(var l,h=[],d=0;null!==(l=u(c,s));){var p=String(l[0]);h[d]=p,""===p&&(c.lastIndex=o(s,i(c.lastIndex),f)),d++}return 0===d?null:h}]}))},function(t,n,e){"use strict";var r=e(3),i=e(10),o=e(6),u=e(21),a=e(84),c=e(56),s=Math.max,f=Math.min,l=Math.floor,h=/\$([$&`']|\d\d?|<[^>]*>)/g,d=/\$([$&`']|\d\d?)/g;e(57)("replace",2,(function(t,n,e,p){return[function(r,i){var o=t(this),u=null==r?void 0:r[n];return void 0!==u?u.call(r,o,i):e.call(String(o),r,i)},function(t,n){var i=p(e,t,this,n);if(i.done)return i.value;var l=r(t),h=String(this),d="function"==typeof n;d||(n=String(n));var g=l.global;if(g){var y=l.unicode;l.lastIndex=0}for(var m=[];;){var b=c(l,h);if(null===b)break;if(m.push(b),!g)break;""===String(b[0])&&(l.lastIndex=a(h,o(l.lastIndex),y))}for(var S,w="",_=0,M=0;M<m.length;M++){b=m[M];for(var x=String(b[0]),P=s(f(u(b.index),h.length),0),O=[],F=1;F<b.length;F++)O.push(void 0===(S=b[F])?S:String(S));var A=b.groups;if(d){var E=[x].concat(O,P,h);void 0!==A&&E.push(A);var N=String(n.apply(void 0,E))}else N=v(x,h,P,O,A,n);P>=_&&(w+=h.slice(_,P)+N,_=P+x.length)}return w+h.slice(_)}];function v(t,n,r,o,u,a){var c=r+t.length,s=o.length,f=d;return void 0!==u&&(u=i(u),f=h),e.call(a,f,(function(e,i){var a;switch(i.charAt(0)){case"$":return"$";case"&":return t;case"`":return n.slice(0,r);case"'":return n.slice(c);case"<":a=u[i.slice(1,-1)];break;default:var f=+i;if(0===f)return e;if(f>s){var h=l(f/10);return 0===h?e:h<=s?void 0===o[h-1]?i.charAt(1):o[h-1]+i.charAt(1):e}a=o[f-1]}return void 0===a?"":a}))}}))},function(t,n,e){"use strict";var r=e(3),i=e(102),o=e(56);e(57)("search",1,(function(t,n,e,u){return[function(e){var r=t(this),i=null==e?void 0:e[n];return void 0!==i?i.call(e,r):new RegExp(e)[n](String(r))},function(t){var n=u(e,t,this);if(n.done)return n.value;var a=r(t),c=String(this),s=a.lastIndex;i(s,0)||(a.lastIndex=0);var f=o(a,c);return i(a.lastIndex,s)||(a.lastIndex=s),null===f?-1:f.index}]}))},function(t,n,e){"use strict";var r=e(76),i=e(3),o=e(49),u=e(84),a=e(6),c=e(56),s=e(83),f=e(2),l=Math.min,h=[].push,d=!f((function(){RegExp(4294967295,"y")}));e(57)("split",2,(function(t,n,e,f){var p;return p="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,n){var i=String(this);if(void 0===t&&0===n)return[];if(!r(t))return e.call(i,t,n);for(var o,u,a,c=[],f=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),l=0,d=void 0===n?4294967295:n>>>0,p=new RegExp(t.source,f+"g");(o=s.call(p,i))&&!((u=p.lastIndex)>l&&(c.push(i.slice(l,o.index)),o.length>1&&o.index<i.length&&h.apply(c,o.slice(1)),a=o[0].length,l=u,c.length>=d));)p.lastIndex===o.index&&p.lastIndex++;return l===i.length?!a&&p.test("")||c.push(""):c.push(i.slice(l)),c.length>d?c.slice(0,d):c}:"0".split(void 0,0).length?function(t,n){return void 0===t&&0===n?[]:e.call(this,t,n)}:e,[function(e,r){var i=t(this),o=null==e?void 0:e[n];return void 0!==o?o.call(e,i,r):p.call(String(i),e,r)},function(t,n){var r=f(p,t,this,n,p!==e);if(r.done)return r.value;var s=i(t),h=String(this),v=o(s,RegExp),g=s.unicode,y=(s.ignoreCase?"i":"")+(s.multiline?"m":"")+(s.unicode?"u":"")+(d?"y":"g"),m=new v(d?s:"^(?:"+s.source+")",y),b=void 0===n?4294967295:n>>>0;if(0===b)return[];if(0===h.length)return null===c(m,h)?[h]:[];for(var S=0,w=0,_=[];w<h.length;){m.lastIndex=d?w:0;var M,x=c(m,d?h:h.slice(w));if(null===x||(M=l(a(m.lastIndex+(d?0:w)),h.length))===S)w=u(h,w,g);else{if(_.push(h.slice(S,w)),_.length===b)return _;for(var P=1;P<=x.length-1;P++)if(_.push(x[P]),_.length===b)return _;w=S=M}}return _.push(h.slice(S)),_}]}))},function(t,n,e){var r=e(1),i=e(85).set,o=r.MutationObserver||r.WebKitMutationObserver,u=r.process,a=r.Promise,c="process"==e(25)(u);t.exports=function(){var t,n,e,s=function(){var r,i;for(c&&(r=u.domain)&&r.exit();t;){i=t.fn,t=t.next;try{i()}catch(r){throw t?e():n=void 0,r}}n=void 0,r&&r.enter()};if(c)e=function(){u.nextTick(s)};else if(!o||r.navigator&&r.navigator.standalone)if(a&&a.resolve){var f=a.resolve(void 0);e=function(){f.then(s)}}else e=function(){i.call(r,s)};else{var l=!0,h=document.createTextNode("");new o(s).observe(h,{characterData:!0}),e=function(){h.data=l=!l}}return function(r){var i={fn:r,next:void 0};n&&(n.next=i),t||(t=i,e()),n=i}}},function(t,n){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,n,e){"use strict";var r=e(121),i=e(39);t.exports=e(60)("Map",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(t){var n=r.getEntry(i(this,"Map"),t);return n&&n.v},set:function(t,n){return r.def(i(this,"Map"),0===t?0:t,n)}},r,!0)},function(t,n,e){"use strict";var r=e(121),i=e(39);t.exports=e(60)("Set",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return r.def(i(this,"Set"),t=0===t?0:t,t)}},r)},function(t,n,e){"use strict";var r,i=e(1),o=e(24)(0),u=e(11),a=e(29),c=e(101),s=e(122),f=e(4),l=e(39),h=e(39),d=!i.ActiveXObject&&"ActiveXObject"in i,p=a.getWeak,v=Object.isExtensible,g=s.ufstore,y=function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},m={get:function(t){if(f(t)){var n=p(t);return!0===n?g(l(this,"WeakMap")).get(t):n?n[this._i]:void 0}},set:function(t,n){return s.def(l(this,"WeakMap"),t,n)}},b=t.exports=e(60)("WeakMap",y,m,s,!0,!0);h&&d&&(c((r=s.getConstructor(y,"WeakMap")).prototype,m),a.NEED=!0,o(["delete","has","get","set"],(function(t){var n=b.prototype,e=n[t];u(n,t,(function(n,i){if(f(n)&&!v(n)){this._f||(this._f=new r);var o=this._f[t](n,i);return"set"==t?this:o}return e.call(this,n,i)}))})))},function(t,n,e){"use strict";var r=e(122),i=e(39);e(60)("WeakSet",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return r.def(i(this,"WeakSet"),t,!0)}},r,!1,!0)},function(t,n,e){"use strict";var r=e(0),i=e(61),o=e(86),u=e(3),a=e(34),c=e(6),s=e(4),f=e(1).ArrayBuffer,l=e(49),h=o.ArrayBuffer,d=o.DataView,p=i.ABV&&f.isView,v=h.prototype.slice,g=i.VIEW;r(r.G+r.W+r.F*(f!==h),{ArrayBuffer:h}),r(r.S+r.F*!i.CONSTR,"ArrayBuffer",{isView:function(t){return p&&p(t)||s(t)&&g in t}}),r(r.P+r.U+r.F*e(2)((function(){return!new h(2).slice(1,void 0).byteLength})),"ArrayBuffer",{slice:function(t,n){if(void 0!==v&&void 0===n)return v.call(u(this),t);for(var e=u(this).byteLength,r=a(t,e),i=a(void 0===n?e:n,e),o=new(l(this,h))(c(i-r)),s=new d(this),f=new d(o),p=0;r<i;)f.setUint8(p++,s.getUint8(r++));return o}}),e(43)("ArrayBuffer")},function(t,n,e){var r=e(0);r(r.G+r.W+r.F*!e(61).ABV,{DataView:e(86).DataView})},function(t,n,e){e(27)("Int8",1,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Uint8",1,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Uint8",1,(function(t){return function(n,e,r){return t(this,n,e,r)}}),!0)},function(t,n,e){e(27)("Int16",2,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Uint16",2,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Int32",4,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Uint32",4,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Float32",4,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){e(27)("Float64",8,(function(t){return function(n,e,r){return t(this,n,e,r)}}))},function(t,n,e){var r=e(0),i=e(20),o=e(3),u=(e(1).Reflect||{}).apply,a=Function.apply;r(r.S+r.F*!e(2)((function(){u((function(){}))})),"Reflect",{apply:function(t,n,e){var r=i(t),c=o(e);return u?u(r,n,c):a.call(r,n,c)}})},function(t,n,e){var r=e(0),i=e(35),o=e(20),u=e(3),a=e(4),c=e(2),s=e(103),f=(e(1).Reflect||{}).construct,l=c((function(){function t(){}return!(f((function(){}),[],t)instanceof t)})),h=!c((function(){f((function(){}))}));r(r.S+r.F*(l||h),"Reflect",{construct:function(t,n){o(t),u(n);var e=arguments.length<3?t:o(arguments[2]);if(h&&!l)return f(t,n,e);if(t==e){switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3])}var r=[null];return r.push.apply(r,n),new(s.apply(t,r))}var c=e.prototype,d=i(a(c)?c:Object.prototype),p=Function.apply.call(t,d,n);return a(p)?p:d}})},function(t,n,e){var r=e(9),i=e(0),o=e(3),u=e(28);i(i.S+i.F*e(2)((function(){Reflect.defineProperty(r.f({},1,{value:1}),1,{value:2})})),"Reflect",{defineProperty:function(t,n,e){o(t),n=u(n,!0),o(e);try{return r.f(t,n,e),!0}catch(t){return!1}}})},function(t,n,e){var r=e(0),i=e(22).f,o=e(3);r(r.S,"Reflect",{deleteProperty:function(t,n){var e=i(o(t),n);return!(e&&!e.configurable)&&delete t[n]}})},function(t,n,e){"use strict";var r=e(0),i=e(3),o=function(t){this._t=i(t),this._i=0;var n,e=this._k=[];for(n in t)e.push(n)};e(110)(o,"Object",(function(){var t,n=this._k;do{if(this._i>=n.length)return{value:void 0,done:!0}}while(!((t=n[this._i++])in this._t));return{value:t,done:!1}})),r(r.S,"Reflect",{enumerate:function(t){return new o(t)}})},function(t,n,e){var r=e(22),i=e(37),o=e(13),u=e(0),a=e(4),c=e(3);u(u.S,"Reflect",{get:function t(n,e){var u,s,f=arguments.length<3?n:arguments[2];return c(n)===f?n[e]:(u=r.f(n,e))?o(u,"value")?u.value:void 0!==u.get?u.get.call(f):void 0:a(s=i(n))?t(s,e,f):void 0}})},function(t,n,e){var r=e(22),i=e(0),o=e(3);i(i.S,"Reflect",{getOwnPropertyDescriptor:function(t,n){return r.f(o(t),n)}})},function(t,n,e){var r=e(0),i=e(37),o=e(3);r(r.S,"Reflect",{getPrototypeOf:function(t){return i(o(t))}})},function(t,n,e){var r=e(0);r(r.S,"Reflect",{has:function(t,n){return n in t}})},function(t,n,e){var r=e(0),i=e(3),o=Object.isExtensible;r(r.S,"Reflect",{isExtensible:function(t){return i(t),!o||o(t)}})},function(t,n,e){var r=e(0);r(r.S,"Reflect",{ownKeys:e(124)})},function(t,n,e){var r=e(0),i=e(3),o=Object.preventExtensions;r(r.S,"Reflect",{preventExtensions:function(t){i(t);try{return o&&o(t),!0}catch(t){return!1}}})},function(t,n,e){var r=e(9),i=e(22),o=e(37),u=e(13),a=e(0),c=e(30),s=e(3),f=e(4);a(a.S,"Reflect",{set:function t(n,e,a){var l,h,d=arguments.length<4?n:arguments[3],p=i.f(s(n),e);if(!p){if(f(h=o(n)))return t(h,e,a,d);p=c(0)}if(u(p,"value")){if(!1===p.writable||!f(d))return!1;if(l=i.f(d,e)){if(l.get||l.set||!1===l.writable)return!1;l.value=a,r.f(d,e,l)}else r.f(d,e,c(0,a));return!0}return void 0!==p.set&&(p.set.call(d,a),!0)}})},function(t,n,e){var r=e(0),i=e(67);i&&r(r.S,"Reflect",{setPrototypeOf:function(t,n){i.check(t,n);try{return i.set(t,n),!0}catch(t){return!1}}})},function(t,n,e){e(276),t.exports=e(7).Array.includes},function(t,n,e){"use strict";var r=e(0),i=e(51)(!0);r(r.P,"Array",{includes:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),e(38)("includes")},function(t,n,e){e(278),t.exports=e(7).Array.flatMap},function(t,n,e){"use strict";var r=e(0),i=e(279),o=e(10),u=e(6),a=e(20),c=e(112);r(r.P,"Array",{flatMap:function(t){var n,e,r=o(this);return a(t),n=u(r.length),e=c(r,0),i(e,r,r,n,0,1,t,arguments[1]),e}}),e(38)("flatMap")},function(t,n,e){"use strict";var r=e(53),i=e(4),o=e(6),u=e(19),a=e(5)("isConcatSpreadable");t.exports=function t(n,e,c,s,f,l,h,d){for(var p,v,g=f,y=0,m=!!h&&u(h,d,3);y<s;){if(y in c){if(p=m?m(c[y],y,e):c[y],v=!1,i(p)&&(v=void 0!==(v=p[a])?!!v:r(p)),v&&l>0)g=t(n,e,p,o(p.length),g,l-1)-1;else{if(g>=9007199254740991)throw TypeError();n[g]=p}g++}y++}return g}},function(t,n,e){e(281),t.exports=e(7).String.padStart},function(t,n,e){"use strict";var r=e(0),i=e(125),o=e(59),u=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(o);r(r.P+r.F*u,"String",{padStart:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!0)}})},function(t,n,e){e(283),t.exports=e(7).String.padEnd},function(t,n,e){"use strict";var r=e(0),i=e(125),o=e(59),u=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(o);r(r.P+r.F*u,"String",{padEnd:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!1)}})},function(t,n,e){e(285),t.exports=e(7).String.trimLeft},function(t,n,e){"use strict";e(41)("trimLeft",(function(t){return function(){return t(this,1)}}),"trimStart")},function(t,n,e){e(287),t.exports=e(7).String.trimRight},function(t,n,e){"use strict";e(41)("trimRight",(function(t){return function(){return t(this,2)}}),"trimEnd")},function(t,n,e){e(289),t.exports=e(63).f("asyncIterator")},function(t,n,e){e(97)("asyncIterator")},function(t,n,e){e(291),t.exports=e(7).Object.getOwnPropertyDescriptors},function(t,n,e){var r=e(0),i=e(124),o=e(15),u=e(22),a=e(79);r(r.S,"Object",{getOwnPropertyDescriptors:function(t){for(var n,e,r=o(t),c=u.f,s=i(r),f={},l=0;s.length>l;)void 0!==(e=c(r,n=s[l++]))&&a(f,n,e);return f}})},function(t,n,e){e(293),t.exports=e(7).Object.values},function(t,n,e){var r=e(0),i=e(126)(!1);r(r.S,"Object",{values:function(t){return i(t)}})},function(t,n,e){e(295),t.exports=e(7).Object.entries},function(t,n,e){var r=e(0),i=e(126)(!0);r(r.S,"Object",{entries:function(t){return i(t)}})},function(t,n,e){"use strict";e(118),e(297),t.exports=e(7).Promise.finally},function(t,n,e){"use strict";var r=e(0),i=e(7),o=e(1),u=e(49),a=e(120);r(r.P+r.R,"Promise",{finally:function(t){var n=u(this,i.Promise||o.Promise),e="function"==typeof t;return this.then(e?function(e){return a(n,t()).then((function(){return e}))}:t,e?function(e){return a(n,t()).then((function(){throw e}))}:t)}})},function(t,n,e){e(299),e(300),e(301),t.exports=e(7)},function(t,n,e){var r=e(1),i=e(0),o=e(59),u=[].slice,a=/MSIE .\./.test(o),c=function(t){return function(n,e){var r=arguments.length>2,i=!!r&&u.call(arguments,2);return t(r?function(){("function"==typeof n?n:Function(n)).apply(this,i)}:n,e)}};i(i.G+i.B+i.F*a,{setTimeout:c(r.setTimeout),setInterval:c(r.setInterval)})},function(t,n,e){var r=e(0),i=e(85);r(r.G+r.B,{setImmediate:i.set,clearImmediate:i.clear})},function(t,n,e){for(var r=e(82),i=e(33),o=e(11),u=e(1),a=e(14),c=e(42),s=e(5),f=s("iterator"),l=s("toStringTag"),h=c.Array,d={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=i(d),v=0;v<p.length;v++){var g,y=p[v],m=d[y],b=u[y],S=b&&b.prototype;if(S&&(S[f]||a(S,f,h),S[l]||a(S,l,y),c[y]=h,m))for(g in r)S[g]||o(S,g,r[g],!0)}},function(t,n,e){var r=function(t){"use strict";var n,e=Object.prototype,r=e.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},o=i.iterator||"@@iterator",u=i.asyncIterator||"@@asyncIterator",a=i.toStringTag||"@@toStringTag";function c(t,n,e,r){var i=n&&n.prototype instanceof v?n:v,o=Object.create(i.prototype),u=new F(r||[]);return o._invoke=function(t,n,e){var r=f;return function(i,o){if(r===h)throw new Error("Generator is already running");if(r===d){if("throw"===i)throw o;return E()}for(e.method=i,e.arg=o;;){var u=e.delegate;if(u){var a=x(u,e);if(a){if(a===p)continue;return a}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(r===f)throw r=d,e.arg;e.dispatchException(e.arg)}else"return"===e.method&&e.abrupt("return",e.arg);r=h;var c=s(t,n,e);if("normal"===c.type){if(r=e.done?d:l,c.arg===p)continue;return{value:c.arg,done:e.done}}"throw"===c.type&&(r=d,e.method="throw",e.arg=c.arg)}}}(t,e,u),o}function s(t,n,e){try{return{type:"normal",arg:t.call(n,e)}}catch(t){return{type:"throw",arg:t}}}t.wrap=c;var f="suspendedStart",l="suspendedYield",h="executing",d="completed",p={};function v(){}function g(){}function y(){}var m={};m[o]=function(){return this};var b=Object.getPrototypeOf,S=b&&b(b(A([])));S&&S!==e&&r.call(S,o)&&(m=S);var w=y.prototype=v.prototype=Object.create(m);function _(t){["next","throw","return"].forEach((function(n){t[n]=function(t){return this._invoke(n,t)}}))}function M(t){var n;this._invoke=function(e,i){function o(){return new Promise((function(n,o){!function n(e,i,o,u){var a=s(t[e],t,i);if("throw"!==a.type){var c=a.arg,f=c.value;return f&&"object"==typeof f&&r.call(f,"__await")?Promise.resolve(f.__await).then((function(t){n("next",t,o,u)}),(function(t){n("throw",t,o,u)})):Promise.resolve(f).then((function(t){c.value=t,o(c)}),(function(t){return n("throw",t,o,u)}))}u(a.arg)}(e,i,n,o)}))}return n=n?n.then(o,o):o()}}function x(t,e){var r=t.iterator[e.method];if(r===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=n,x(t,e),"throw"===e.method))return p;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var i=s(r,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,p;var o=i.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,p):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,p)}function P(t){var n={tryLoc:t[0]};1 in t&&(n.catchLoc=t[1]),2 in t&&(n.finallyLoc=t[2],n.afterLoc=t[3]),this.tryEntries.push(n)}function O(t){var n=t.completion||{};n.type="normal",delete n.arg,t.completion=n}function F(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function A(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var i=-1,u=function e(){for(;++i<t.length;)if(r.call(t,i))return e.value=t[i],e.done=!1,e;return e.value=n,e.done=!0,e};return u.next=u}}return{next:E}}function E(){return{value:n,done:!0}}return g.prototype=w.constructor=y,y.constructor=g,y[a]=g.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var n="function"==typeof t&&t.constructor;return!!n&&(n===g||"GeneratorFunction"===(n.displayName||n.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},_(M.prototype),M.prototype[u]=function(){return this},t.AsyncIterator=M,t.async=function(n,e,r,i){var o=new M(c(n,e,r,i));return t.isGeneratorFunction(e)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},_(w),w[a]="Generator",w[o]=function(){return this},w.toString=function(){return"[object Generator]"},t.keys=function(t){var n=[];for(var e in t)n.push(e);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},t.values=A,F.prototype={constructor:F,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(O),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function i(r,i){return a.type="throw",a.arg=t,e.next=r,i&&(e.method="next",e.arg=n),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var u=this.tryEntries[o],a=u.completion;if("root"===u.tryLoc)return i("end");if(u.tryLoc<=this.prev){var c=r.call(u,"catchLoc"),s=r.call(u,"finallyLoc");if(c&&s){if(this.prev<u.catchLoc)return i(u.catchLoc,!0);if(this.prev<u.finallyLoc)return i(u.finallyLoc)}else if(c){if(this.prev<u.catchLoc)return i(u.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<u.finallyLoc)return i(u.finallyLoc)}}}},abrupt:function(t,n){for(var e=this.tryEntries.length-1;e>=0;--e){var i=this.tryEntries[e];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=n&&n<=o.finallyLoc&&(o=null);var u=o?o.completion:{};return u.type=t,u.arg=n,o?(this.method="next",this.next=o.finallyLoc,p):this.complete(u)},complete:function(t,n){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&n&&(this.next=n),p},finish:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),O(e),p}},catch:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.tryLoc===t){var r=e.completion;if("throw"===r.type){var i=r.arg;O(e)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:A(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),p}},t}(t.exports);try{regeneratorRuntime=r}catch(t){Function("r","regeneratorRuntime = r")(r)}},function(t,n,e){e(304),t.exports=e(127).global},function(t,n,e){var r=e(305);r(r.G,{global:e(87)})},function(t,n,e){var r=e(87),i=e(127),o=e(306),u=e(308),a=e(315),c=function(t,n,e){var s,f,l,h=t&c.F,d=t&c.G,p=t&c.S,v=t&c.P,g=t&c.B,y=t&c.W,m=d?i:i[n]||(i[n]={}),b=m.prototype,S=d?r:p?r[n]:(r[n]||{}).prototype;for(s in d&&(e=n),e)(f=!h&&S&&void 0!==S[s])&&a(m,s)||(l=f?S[s]:e[s],m[s]=d&&"function"!=typeof S[s]?e[s]:g&&f?o(l,r):y&&S[s]==l?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n.prototype=t.prototype,n}(l):v&&"function"==typeof l?o(Function.call,l):l,v&&((m.virtual||(m.virtual={}))[s]=l,t&c.R&&b&&!b[s]&&u(b,s,l)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,n,e){var r=e(307);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,i){return t.call(n,e,r,i)}}return function(){return t.apply(n,arguments)}}},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n,e){var r=e(309),i=e(314);t.exports=e(89)?function(t,n,e){return r.f(t,n,i(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n,e){var r=e(310),i=e(311),o=e(313),u=Object.defineProperty;n.f=e(89)?Object.defineProperty:function(t,n,e){if(r(t),n=o(n,!0),r(e),i)try{return u(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(88);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n,e){t.exports=!e(89)&&!e(128)((function(){return 7!=Object.defineProperty(e(312)("div"),"a",{get:function(){return 7}}).a}))},function(t,n,e){var r=e(88),i=e(87).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,n,e){var r=e(88);t.exports=function(t,n){if(!r(t))return t;var e,i;if(n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;if("function"==typeof(e=t.valueOf)&&!r(i=e.call(t)))return i;if(!n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}}])}));
/*!
audiocontext-polyfill.js v0.1.2
(c) 2013 - 2014 Shinnosuke Watanabe
Licensed under the MIT license
*/
'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

if (window.AudioContext !== undefined) {

	window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

	let Proto = AudioContext.prototype;

	let tmpctx = new AudioContext();

	// Support alternate names
	// start (noteOn), stop (noteOff), createGain (createGainNode), etc.
	let isStillOld = (normative, old) => {
		return normative === undefined && old !== undefined;
	};

	let bufProto = tmpctx.createBufferSource().constructor.prototype;

	if (isStillOld(bufProto.start, bufProto.noteOn) || isStillOld(bufProto.stop, bufProto.noteOff)) {
		
		let nativeCreateBufferSource = Proto.createBufferSource;

		Proto.createBufferSource = function() {
			let returnNode = nativeCreateBufferSource.call(this);
			returnNode.start = returnNode.start || returnNode.noteOn;
			returnNode.stop = returnNode.stop || returnNode.noteOff;

			return returnNode;
		};
	}

	// Firefox 24 doesn't support OscilatorNode
	if (typeof tmpctx.createOscillator === 'function') {
		let oscProto = tmpctx.createOscillator().constructor.prototype;

		if (isStillOld(oscProto.start, oscProto.noteOn) ||
			isStillOld(oscProto.stop, oscProto.noteOff)) {
			let nativeCreateOscillator = Proto.createOscillator;

			Proto.createOscillator = function() {
				let returnNode = nativeCreateOscillator.call(this);
				returnNode.start = returnNode.start || returnNode.noteOn;
				returnNode.stop = returnNode.stop || returnNode.noteOff;

				return returnNode;
			};
		}
	}

	if (Proto.createGain === undefined && Proto.createGainNode !== undefined) {
		Proto.createGain = Proto.createGainNode;
	}

	if (Proto.createDelay === undefined && Proto.createDelayNode !== undefined) {
		Proto.createDelay = Proto.createGainNode;
	}

	if (Proto.createScriptProcessor === undefined &&
		Proto.createJavaScriptNode !== undefined) {
		Proto.createScriptProcessor = Proto.createJavaScriptNode;
	}

	// Black magic for iOS
	if (navigator.userAgent.indexOf('like Mac OS X') !== -1) {
		
		let OriginalAudioContext = AudioContext;
		
		window.AudioContext = function() {
			let iOSCtx = new OriginalAudioContext();

			let body = document.body;
			let tmpBuf = iOSCtx.createBufferSource();
			let tmpProc = iOSCtx.createScriptProcessor(256, 1, 1);
			
			let instantProcess = () => {
				tmpBuf.start(0);
				tmpBuf.connect(tmpProc);
				tmpProc.connect(iOSCtx.destination);
			};

			body.addEventListener('touchstart', instantProcess, false);

			// This function will be called once and for all.
			tmpProc.onaudioprocess = () => {
				tmpBuf.disconnect();
				tmpProc.disconnect();
				body.removeEventListener('touchstart', instantProcess, false);
				tmpProc.onaudioprocess = null;
			};

			return iOSCtx;
		};
	}
}
/*
 * HTTP DELETE 요청을 보냅니다.
 */
global.DELETE = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'DELETE'
		}]), responseListenerOrListeners);
	}
});
/*
 * HTTP GET 요청을 보냅니다.
 */
global.GET = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'GET'
		}]), responseListenerOrListeners);
	}
});
/*
 * HTTP POST 요청을 보냅니다.
 */
global.POST = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'POST'
		}]), responseListenerOrListeners);
	}
});
/*
 * HTTP PUT 요청을 보냅니다.
 */
global.PUT = METHOD({

	run: (urlOrParams, responseListenerOrListeners) => {
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		REQUEST(COMBINE([CHECK_IS_DATA(urlOrParams) === true ? urlOrParams : {
			url: urlOrParams
		}, {
			method: 'PUT'
		}]), responseListenerOrListeners);
	}
});
/*
 * HTTP 요청을 보냅니다.
 */
global.REQUEST = METHOD({

	run: (params, responseListenerOrListeners) => {
		//REQUIRED: params
		//REQUIRED: params.method	요청 메소드. GET, POST, PUT, DELETE를 설정할 수 있습니다.
		//OPTIONAL: params.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: params.host
		//OPTIONAL: params.port
		//OPTIONAL: params.uri
		//OPTIONAL: params.url		요청을 보낼 URL. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: params.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: params.params	데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: params.data		UPPERCASE 웹 서버로 보낼 데이터. 요청을 UPPERCASE기반 웹 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: params.headers	요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success

		let method = params.method;
		let isSecure = params.isSecure === undefined ? BROWSER_CONFIG.isSecure : params.isSecure;
		let host = params.host === undefined ? BROWSER_CONFIG.host : params.host;
		let port = params.port === undefined ? (params.host === undefined ? BROWSER_CONFIG.port : (isSecure !== true ? 80 : 443)) : params.port;
		let uri = params.uri;
		let url = params.url;
		let paramStr = params.paramStr;
		let _params = params.params;
		let data = params.data;
		let headers = params.headers;

		let responseListener;
		let errorListener;

		method = method.toUpperCase();

		if (url !== undefined) {

			if (url.indexOf('?') !== -1) {
				paramStr = url.substring(url.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				url = url.substring(0, url.indexOf('?'));
			}

			isSecure = undefined;
			host = undefined;
			port = undefined;

		} else {

			if (uri !== undefined && uri.indexOf('?') !== -1) {
				paramStr = uri.substring(uri.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				uri = uri.substring(0, uri.indexOf('?'));
			}
		}

		if (_params !== undefined) {

			EACH(_params, (value, name) => {

				if (paramStr === undefined) {
					paramStr = '';
				} else {
					paramStr += '&';
				}

				paramStr += encodeURIComponent(name) + '=' + encodeURIComponent(value);
			});
		}

		if (data !== undefined) {
			paramStr = (paramStr === undefined ? '' : paramStr + '&') + '__DATA=' + encodeURIComponent(STRINGIFY(data));
		}

		paramStr = (paramStr === undefined ? '' : paramStr + '&') + Date.now();

		if (url === undefined) {
			url = (isSecure === true ? 'https://' : 'http://') + host + ':' + port + '/' + (uri === undefined ? '' : (uri[0] === '/' ? uri.substring(1) : uri));
		}

		if (CHECK_IS_DATA(responseListenerOrListeners) !== true) {
			responseListener = responseListenerOrListeners;
		} else {
			responseListener = responseListenerOrListeners.success;
			errorListener = responseListenerOrListeners.error;
		}

		(
			method === 'GET' || method === 'DELETE' ? fetch(url.substring(0, 5) === 'data:' ? url : url + '?' + paramStr, {
				method: method,
				credentials: location.protocol !== 'file:' && location.protocol.indexOf('-extension:') === -1 && host === BROWSER_CONFIG.host && port === BROWSER_CONFIG.port ? 'include' : undefined,
				headers: new Headers(headers === undefined ? {} : headers)
			}) : fetch(url, {
				method: method,
				body: paramStr,
				credentials: location.protocol !== 'file:' && location.protocol.indexOf('-extension:') === -1 && host === BROWSER_CONFIG.host && port === BROWSER_CONFIG.port ? 'include' : undefined,
				headers: new Headers(headers === undefined ? {} : headers)
			})
		).then((response) => {

			if (response.status === 200) {
				return response.text();
			} else {
				let errorMsg = 'HTTP RESPONSE STATUS CODE: ' + response.status;

				if (errorListener !== undefined) {
					errorListener(errorMsg, response.status);
				} else {
					SHOW_ERROR('REQUEST', errorMsg, params);
				}
			}
		}, (error) => {

			let errorMsg = error.toString();

			if (errorListener !== undefined) {
				errorListener(errorMsg);
			} else {
				SHOW_ERROR('REQUEST', errorMsg, params);
			}

			responseListener = undefined;

		}).then((responseText) => {
			if (responseText !== undefined && responseListener !== undefined) {
				responseListener(responseText);
			}
		});
	}
});
/*
 * URI를 변경하여 다른 뷰로 이동합니다.
 */
global.GO = METHOD((m) => {

	let isCTRLKeyDown;

	return {

		run: (uriOrParams) => {
			//REQUIRED: uriOrParams
			//REQUIRED: uriOrParams.uri
			//OPTIONAL: uriOrParams.data

			let uri;
			let data;

			if (CHECK_IS_DATA(uriOrParams) !== true) {
				uri = uriOrParams;
			} else {
				uri = uriOrParams.uri;
				data = uriOrParams.data;
			}

			if (isCTRLKeyDown === undefined) {
				isCTRLKeyDown = false;

				EVENT('keydown', (e) => {
					if (e.getKey() === 'Control') {
						isCTRLKeyDown = true;
					}
				});

				EVENT('keyup', (e) => {
					if (e.getKey() === 'Control') {
						isCTRLKeyDown = false;
					}
				});
			}

			if (isCTRLKeyDown === true) {

				GO_NEW_WIN(uri);

				isCTRLKeyDown = false;
			}

			else {

				MATCH_VIEW.setURIData(data);

				// when protocol is 'file:' or extension, use hashbang.
				if (location.protocol === 'file:' || location.protocol.indexOf('-extension:') !== -1) {
					location.href = HREF(uri);
				} else {
					history.pushState(undefined, undefined, HREF(uri));
				}

				MATCH_VIEW.checkAll();
			}
		}
	};
});

FOR_BOX((box) => {

	box.GO = METHOD({

		run: (uriOrParams) => {
			//REQUIRED: uriOrParams
			//REQUIRED: uriOrParams.uri
			//OPTIONAL: uriOrParams.data

			let uri;
			let data;

			if (CHECK_IS_DATA(uriOrParams) !== true) {
				uri = uriOrParams;
			} else {
				uri = uriOrParams.uri;
				data = uriOrParams.data;
			}

			GO({
				uri: (box.boxName === CONFIG.defaultBoxName ? '' : box.boxName + '/') + uri,
				data: data
			});
		}
	});
});

/*
 * 새 창에서 URI에 해당하는 뷰를 띄웁니다.
 */
global.GO_NEW_WIN = METHOD({

	run: (uri) => {
		//REQUIRED: uri

		global.open(HREF(uri));
	}
});

FOR_BOX((box) => {

	box.GO_NEW_WIN = METHOD({

		run: (uri) => {
			//REQUIRED: uri

			GO_NEW_WIN((box.boxName === CONFIG.defaultBoxName ? '' : box.boxName + '/') + uri);
		}
	});
});

/*
 * URI로부터 주소를 생성하여 반환합니다.
 */
global.HREF = METHOD({

	run: (uri) => {
		//REQUIRED: uri

		// when protocol is 'file:' or extension, use hashbang.
		if (location.protocol === 'file:' || location.protocol.indexOf('-extension:') !== -1) {
			return '#!/' + uri;
		} else {
			return '/' + uri;
		}
	}
});

FOR_BOX((box) => {

	box.HREF = METHOD({

		run: (uri) => {
			//OPTIONAL: uri

			return HREF((box.boxName === CONFIG.defaultBoxName ? '' : box.boxName + '/') + (uri === undefined ? '' : uri));
		}
	});
});

/*
 * 특정 URI와 뷰를 연결합니다.
 */
global.MATCH_VIEW = METHOD((m) => {

	let changeURIHandlers = [];
	let uriData;

	let checkAll = m.checkAll = () => {
		EACH(changeURIHandlers, (changeURIHandler) => {
			changeURIHandler();
		});
	};

	let setURIData = m.setURIData = (_uriData) => {
		uriData = _uriData;
	};

	return {

		run: (params) => {
			//REQUIRED: params
			//REQUIRED: params.uri
			//OPTIONAL: params.excludeURI
			//REQUIRED: params.target

			let uri = params.uri;
			let excludeURI = params.excludeURI;
			let target = params.target;

			let uriMatcher = URI_MATCHER(uri);
			let excludeURIMatcher = excludeURI === undefined ? undefined : URI_MATCHER(excludeURI);

			let view;
			let preParams;

			let changeURIHandler = () => {

				let uri = URI();
				let result;

				// when view founded
				if (
					uri !== REFRESH.getRefreshingURI() &&
					(result = uriMatcher.check(uri)).checkIsMatched() === true &&
					(excludeURI === undefined || excludeURIMatcher.check(uri).checkIsMatched() !== true)) {

					let uriParams = result.getURIParams();

					// when before view not exists, create view.
					if (view === undefined) {

						view = target(uriData);
						view.changeParams(uriParams);
						target.lastView = view;

						preParams = uriParams;
					}

					// when before view exists, change params.
					else if (CHECK_ARE_SAME([preParams, uriParams]) !== true) {

						view.changeParams(uriParams);
						preParams = uriParams;
					}

					view.runURIChangeHandlers(uri);

					DELAY(() => {
						uriData = undefined;
					});
				}

				// when view not founded, close before view
				else if (view !== undefined) {

					view.close();

					view = undefined;
					target.lastView = undefined;
				}
			};

			changeURIHandlers.push(changeURIHandler);

			// when protocol is 'file:' or extension, use hashbang.
			if (location.protocol === 'file:' || location.protocol.indexOf('-extension:') !== -1) {
				EVENT('hashchange', () => {
					changeURIHandler();
				});
			}

			else {
				EVENT('popstate', () => {
					changeURIHandler();
				});
			}

			changeURIHandler();
		}
	};
});

FOR_BOX((box) => {

	box.MATCH_VIEW = METHOD({

		run: (params) => {
			//REQUIRED: params
			//REQUIRED: params.uri
			//OPTIONAL: params.excludeURI
			//REQUIRED: params.target

			let uri = params.uri;
			let excludeURI = params.excludeURI;
			let target = params.target;

			let newURIs = [];
			let newExcludeURIs = [];

			let pushURI = (uri) => {

				if (box.boxName === CONFIG.defaultBoxName) {
					newURIs.push(uri);
				}

				newURIs.push(box.boxName + '/' + uri);
				newURIs.push(box.boxName.toLowerCase() + '/' + uri);
			};

			let pushExcludeURI = (uri) => {

				if (box.boxName === CONFIG.defaultBoxName) {
					newExcludeURIs.push(uri);
				}

				newExcludeURIs.push(box.boxName + '/' + uri);
				newExcludeURIs.push(box.boxName.toLowerCase() + '/' + uri);
			};

			if (CHECK_IS_ARRAY(uri) === true) {
				EACH(uri, pushURI);
			} else {
				pushURI(uri);
			}

			if (excludeURI !== undefined) {
				if (CHECK_IS_ARRAY(excludeURI) === true) {
					EACH(excludeURI, pushExcludeURI);
				} else {
					pushExcludeURI(excludeURI);
				}
			}

			MATCH_VIEW({
				uri: newURIs,
				excludeURI: newExcludeURIs,
				target: target
			});
		}
	});
});

/*
 * 뷰를 새로 불러옵니다.
 */
global.REFRESH = METHOD((m) => {

	const REFRESHING_URI = '__REFRESHING';

	let getRefreshingURI = m.getRefreshingURI = () => {
		return REFRESHING_URI;
	};

	return {

		run: (uri) => {
			//OPTIONAL: uri

			// when protocol is 'file:' or extension, use hashbang.
			if (location.protocol === 'file:' || location.protocol.indexOf('-extension:') !== -1) {

				let savedHash = uri !== undefined ? '#!/' + uri : location.hash;

				EVENT_ONCE({
					name: 'hashchange'
				}, () => {
					location.replace(savedHash === '' ? '#!/' : savedHash);

					if (savedHash !== '#!/' + uri) {
						history.back();
					}
				});

				location.href = '#!/' + getRefreshingURI();
			}

			else {

				let savedURI = uri !== undefined ? uri : location.pathname.substring(1);

				history.pushState(undefined, undefined, '/' + REFRESHING_URI);
				MATCH_VIEW.checkAll();

				history.replaceState(undefined, undefined, '/' + savedURI);
				MATCH_VIEW.checkAll();

				if (savedURI !== uri) {
					history.back();
				}
			}
		}
	};
});

FOR_BOX((box) => {

	box.REFRESH = METHOD({

		run: (uri) => {
			//OPTIONAL: uri

			REFRESH((box.boxName === CONFIG.defaultBoxName ? '' : box.boxName + '/') + (uri === undefined ? '' : uri));
		}
	});
});

/*
 * 현재 브라우저의 URI를 가져옵니다.
 */
global.URI = METHOD({

	run: () => {

		// when protocol is 'file:' or extension, use hashbang.
		if (location.protocol === 'file:' || location.protocol.indexOf('-extension:') !== -1) {
			return location.hash.substring(3);
		} else {
			return decodeURIComponent(location.pathname.substring(1));
		}
	}
});

/*
 * 뷰를 정의하기 위한 VIEW 클래스
 */
global.VIEW = CLASS({

	init: (inner, self) => {

		let isClosed = false;
		let paramsChangeHandlers = [];
		let uriChangeHandlers = [];
		let closeHandlers = [];

		let nowParams;
		let nowURI;

		let on = inner.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler

			// when change params
			if (eventName === 'paramsChange') {
				paramsChangeHandlers.push(eventHandler);
				if (nowParams !== undefined) {
					eventHandler(nowParams);
				}
			}

			// when change uri
			if (eventName === 'uriChange') {
				uriChangeHandlers.push(eventHandler);
				if (nowURI !== undefined) {
					eventHandler(nowURI);
				}
			}

			// when close
			else if (eventName === 'close') {
				closeHandlers.push(eventHandler);
			}
		};

		let changeParams = self.changeParams = (params) => {

			nowParams = params;

			EACH(paramsChangeHandlers, (handler) => {
				handler(params);
			});
		};

		let runURIChangeHandlers = self.runURIChangeHandlers = (uri) => {

			nowURI = uri;

			EACH(uriChangeHandlers, (handler) => {
				handler(uri);
			});
		};

		let close = self.close = () => {

			EACH(closeHandlers, (handler) => {
				handler();
			});

			isClosed = true;
		};

		let checkIsClosed = inner.checkIsClosed = () => {
			return isClosed;
		};

		scrollTo(0, 0);
	}
});

/*
 * 가로 스크롤의 현재 위치를 픽셀 단위로 가져옵니다.
 */
global.SCROLL_LEFT = METHOD({

	run: () => {

		return global.pageXOffset;
	}
});

/*
 * 세로 스크롤의 현재 위치를 픽셀 단위로 가져옵니다.
 */
global.SCROLL_TOP = METHOD({

	run: () => {

		return global.pageYOffset;
	}
});

/*
 * 브라우저 창에 표시되는 문서의 제목을 가져오거나 변경합니다.
 */
global.TITLE = METHOD({

	run: (title) => {
		//OPTIONAL: title

		if (title === undefined) {
			return document.title;
		} else {
			document.title = title;
		}
	}
});

/*
 * 브라우저 창의 세로 길이를 픽셀 단위로 반환합니다.
 */
global.WIN_HEIGHT = METHOD({

	run: () => {

		return window.innerHeight;
	}
});

/*
 * 브라우저 창의 가로 길이를 픽셀 단위로 반환합니다.
 */
global.WIN_WIDTH = METHOD({

	run: () => {

		return document.documentElement.clientWidth;
	}
});

