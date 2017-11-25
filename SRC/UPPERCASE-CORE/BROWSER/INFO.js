/*
 * 웹 브라우저 정보를 담고 있는 객체
 */
global.INFO = OBJECT({

	init : (inner, self) => {

		let isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

		let getLang = self.getLang = () => {

			let lang = STORE('__INFO').get('lang');

			if (lang === undefined) {
				lang = navigator.language;
			}

			return lang;
		};

		let setLang = self.setLang = (lang) => {
			//REQUIRED: lang

			STORE('__INFO').save({
				name : 'lang',
				value : lang
			});
		};

		let changeLang = self.changeLang = (lang) => {
			//REQUIRED: lang

			setLang(lang);

			location.reload();
		};

		let checkIsTouchDevice = self.checkIsTouchDevice = () => {
			return isTouchDevice;
		};

		let getOSName = self.getOSName = () => {
			// using bowser. (https://github.com/ded/bowser)
			return bowser.osname;
		};

		let getBrowserName = self.getBrowserName = () => {
			// using bowser. (https://github.com/ded/bowser)
			return bowser.name;
		};

		let getBrowserVersion = self.getBrowserVersion = () => {
			// using bowser. (https://github.com/ded/bowser)
			return REAL(bowser.version);
		};
	}
});