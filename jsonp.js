function getScript(url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	script.onload = script.onreadystatechange = function() {
		if (!this.readyState ||
			this.readyState === "loaded" ||
			this.readyState === "complete") {
			this.onload = this.onreadystatechange = null;
			document.getElementsByTagName('head')[0].removeChild(this);
			callback();
		}
	};

	document.getElementsByTagName('head')[0].appendChild(script);
}
var jsonp = function(option, callbackName) {
	if (!option.url || !callbackName) {
		return;
	}
	var data = option.data || {};

	data[callbackName] = 'XD' + +new Date();
	window[data[callbackName]] = function(json) {
		option.callback(json);
	};
	var url = option.url + '?callback=' + data[callbackName];

	getScript(url, function() {
		window[data[callbackName]] = undefined;
		try {
			delete window[data[callbackName]];
		} catch (e) {}
	});
};