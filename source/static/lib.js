module.exports = function (window) {
	//DO NOT CHANGE variable names
	require("babel-polyfill");

	if (process && process.title != "browser") {
		window.jQuery = window.$ = require("jquery")(window);
	} else {
		window.jQuery = window.$ = require("jquery");
	}
	/*require("es5-shim/es5-shim.min.js");
	 require("es5-shim/es5-sham.min.js");
	 require("console-polyfill");*/
	window.React = require("react");
	window.ReactDOM = require("react-dom");
	window.ReactRouter = require("react-router");
	window.ReactCanvas = require("react-canvas");
	window.ReactCSSTransitionGroup = require("react-addons-css-transition-group");
	window.History = require("history");
	window.Nuclear = require("nuclear-js");
	window.Immutable = Nuclear.Immutable;
	window.Request = require("superagent-defaults");
	window.cx = require("classnames");
	require("throttle-debounce/dist/throttle-debounce.min.js");
//========================================================
	window.mdx = function Match(deviceName, map) {
		var result = Immutable.fromJS(map).find((val, key)=> deviceName == key);
		return result ? result() : undefined;
	};

//=====================================================
	$.cachedScript = function (url, options) {

		// Allow user to set any option except for dataType, cache, and url
		options = $.extend(options || {}, {
			dataType: "script",
			cache: true,
			url: url
		});

		// Use $.ajax() since it is more flexible than $.getScript
		// Return the jqXHR object so we can chain callbacks
		return $.ajax(options);
	};

//======================================================
//Original Jquery clone method is buggy
	$.cloneNode = function (oElm, bDeep, bEvents) {
		var
				aInputSubElements
				, eNodeCopy
				, aNodeCopySubElements
				, n1, n2
				, allEvents = ["onabort", "onbeforecopy", "onbeforecut", "onbeforepaste", "onblur", "onchange", "onclick",
					"oncontextmenu", "oncopy", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave",
					"ondragover", "ondragstart", "ondrop", "onerror", "onfocus", "oninput", "oninvalid", "onkeydown",
					"onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout",
					"onmouseover", "onmouseup", "onmousewheel", "onpaste", "onreset", "onresize", "onscroll", "onsearch", "onselect", "onselectstart", "onsubmit", "onunload"]


// defaults
		bDeep = bDeep || false;
		bEvents = bEvents || false;

// clone
		eNodeCopy = oElm.cloneNode(bDeep);

// events
		if (bEvents) {
			aInputSubElements = oElm.getElementsByTagName("*");
			aNodeCopySubElements = eNodeCopy.getElementsByTagName("*");

// The node root
			for (n2 = 0; n2 < allEvents.length; n2++) {
				if (oElm[allEvents[n2]]) {
					eNodeCopy[allEvents[n2]] = oElm[allEvents[n2]];
				}
			}

// Node descendants
			for (n1 = 0; n1 < aInputSubElements.length; n1++) {
				for (n2 = 0; n2 < allEvents.length; n2++) {
					if (aInputSubElements[n1][allEvents[n2]]) {
						aNodeCopySubElements[n1][allEvents[n2]] = aInputSubElements[n1][allEvents[n2]];
					}
				}
			}
		}

		return eNodeCopy;
	};

//=======================Add some filters========================================
	$(function () {
		var wrapper = document.createElement("div");
		$(wrapper).html(require("!!html!client/stylus/SVGfilter.svg"));
		$("body").append(wrapper);
	});

//=======================Touch detect========================================
	$.TOUCH_DEVICE = function () {
		var result = (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0));
		return !!result;
	}();

	if ($.TOUCH_DEVICE) {
		$("html").addClass("touch");
	}

};
