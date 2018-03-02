
window.Stats = (function () {
	"use strict";
	
	/* 
		An interface to the PWick analyitics platform
			
		Public interface is "log(url)". This queues the url to be logged later.
		
		The system waits up to POST_TIMEOUT for new calls to log (so that all the calls when a page loads are batched)
		and then submitts them.
		
		When the subission returns, the queue is cleared of any succesful submissions.
  		
		
		6097546 and 6075844 - 2017-07-28 - Intitial version	
	 */ 
	
	var POST_TIMEOUT = 5000;
	var PIWIK_URL = "http://10.25.232.75:8080/piwik/piwik.php";
	var PIWIK_DEFAULTS = {
		idsite: 3,
		action_name: "Pageview",
		rec: 1,
		send_image: 0
	};
	
	var last, globalQueue = [], timeout;
	var pid = Features.getPid();
			
	function _queue(item) {
		globalQueue.push(item);

		clearTimeout(timeout);
		timeout = setTimeout(_send, POST_TIMEOUT);
	}
		
	function _getResolution() {
		return [screen.width, screen.height].join("x");
	}
	
	function _getLoadTime() {
		var timing = window.performance.timing;
		return timing.loadEventEnd - timing.navigationStart;
	}

	function _log(url, event) {
		var now = new Date();
		var url_ref, logData;
		
		logData = {
			url: url,
			res: _getResolution(),
			h: now.getHours(),
			m: now.getMinutes(),
			s: now.getSeconds(),
			cdt: Math.floor(now.getTime() / 1000)
		};	
								
		if (pid !== undefined ){
			logData.uid = pid;
		}
				
		// If this is our first call, then get the referrer from the environment
		// otherwise, use the one we set below.
		if (last === undefined) {
			url_ref = document.referrer;
			logData.gt_ms = _getLoadTime();		// First load only, report the generation time
		} else {
			url_ref = last;
		}

		// Store this URL to use as the referrer for the next call		
		last = url;		
		
		if (event !== undefined) {
			Object.assign(logData, event);
		} else {
			// Don't log referrers for events
			logData.urlref = url_ref;
		}

		_queue(logData);
	}
	
	function _logAjax(event, jqXHR, options) {
		var target = options.url;
		var now = new Date();
		var url_ref, logData;
			
		if (target === PIWIK_URL) {
			// Don't bother logging calls to submit stats
			return;
		}
		
		if (target.indexOf("http") === -1) {
			target = _makeLinkAbsoulte(target);
		}		
		
		// If this is our first call, then get the referrer from the environment
		// otherwise, use the one we set below.
		if (last === undefined) {
			url_ref = document.referrer;
		} else {
			url_ref = last;
		}
				
		logData = {
			url: target,
			res: _getResolution(),
			h: now.getHours(),
			m: now.getMinutes(),
			s: now.getSeconds(),
			cdt: Math.floor(now.getTime() / 1000),
			urlref: url_ref
		};		
		
		if (pid !== undefined ){
			logData.uid = pid;
		}
		
		_queue(logData);
	}
			
	function _dump() {
		console.log(globalQueue);
	}
	
	function _uriEncodeObject(q) {
		// Turn an object into a set of URL encoded key/value pairs
		// Assumes that the values are all simple.
	
		var key, parts = [];
		for (key in q) {
			parts.push(key + "=" + encodeURIComponent(q[key]));
		}
		
		return parts.join("&");
	}
	
	function _success(response) {
		// Remove results that have been succesfully sent to the server.
		if ("status" in response && response.status === "success") {
			globalQueue.splice(0, response.tracked);
			console.log("Logged " + response.tracked + " request(s) OK");
		}
	}
	
	function _buildPostData() {
		var requests = [], i, item, changed = false;
		var now = Math.floor(new Date().getTime() / 1000);
		for (i =0 ; i < globalQueue.length; i += 1) {
			// Build up the request for each queue item
			// adding in the defaults from PIWIK_DEFAULTS
			
			item = globalQueue[i];

				// Can only log items up to 24 hours old.			
			if ("cdt" in item && ((now - item.cdt) < 24 * 60 * 60)) {
				// Add in defaults.
				item = Object.assign({}, PIWIK_DEFAULTS, item);
				
				// Build request string, and add it to the list
				requests.push("?" + _uriEncodeObject(item));				
			} else {
				// Delete old log items.
				globalQueue.splice(0, i);
				i -= 1;
				changed = true;
			}
		}
		
		return JSON.stringify({requests: requests});
	}
	
	function _send() {
		clearTimeout(timeout);
		timeout = undefined;
		
		// Bail early if the feature is disabled, or there's no data
		if (!Features.check("stats") || globalQueue.length === 0) {
			return;
		}
				
		console.log("Sending " + globalQueue.length + " requests(s)");
		
		var postData = _buildPostData();		
		
		// Actually post the data

		$.post(PIWIK_URL, postData)
			.done(_success)
			.fail(function (jqXHR) {
				console.log("Stats post fail", jqXHR.responseText);
				// queue again
				clearTimeout(timeout);
				timeout = setTimeout(_send, POST_TIMEOUT);
			});
		return undefined;
	}
	
	function _makeLinkAbsoulte(relative) {
		var a = buildElement("a");
		a.href = relative;
		
		return a.href;	
	}
	
	// Setup calls.
	if (Features.check("stats")) {
		if (pid === 0 && ("ActiveXObject" in window)) {
			pid = FindPID();
		}
	
	//	$(document).ajaxSend(_logAjax);
		$(window).on("beforeunload", _send);
	}		

	return {
		log: _log,
		debug: _dump,
		send: _send
	}
})();

window.BUS = (function () {
	"use strict";
	
	var INITIAL_DELAY = 160;	
	var DATA_KEY = 'pageHitData';
	var TIMESTAMP_KEY = 'pageHitDataLastSave';
	var BASE_FOLDER = "\\\\C\\s\\CAF2\\PT Ops NICEO BDApps\\UserLogs\\IPDM\\";
	var MINUTE = 60 * 1000;
	
	function _addPageToLocalHistory() {
		var pageHitData;
		var today = new Date()

		if (localStorage.getItem(DATA_KEY) !== null) {
			pageHitData = JSON.parse(localStorage.getItem(DATA_KEY));
		} else {
			pageHitData = [];
		}
		
		pageHitData.push({
			UserPid: FindPID(),
			DateTime: today.toISOString(),
			URL : window.location.href,
			UserAgent : navigator.userAgent,
			Referrer: document.referrer,
			SearchTerm: {}
		});
		
		localStorage.setItem(DATA_KEY, JSON.stringify(pageHitData))
		console.log("Page hit logged");
	}
	
	function _isSaveHitDataDue() {
		var lastSave, now, diff;
		if (localStorage.getItem(DATA_KEY) !== null) {
			lastSave = new Date(localStorage.getItem(TIMESTAMP_KEY));			
		} else {
			return true;
		}
		
		now = new Date()
		diff = (now.getTime() - lastSave.getTime()) / MINUTE;

		return (diff >= 60);
	}
	
	function _buildFilename() {
		var today, todayString, folder, file;
		
		today = new Date();
		todayString = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString();
		
		folder = BASE_FOLDER + todayString;
		
		file = folder + "\\" + FindPID() + todayString + today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString() + ".json";
		
		return {folder: folder, filename: file};
	}

	function _savePageHitData() {
		var today, fh, filename, fso, x;
		var pageHitData = localStorage.getItem(DATA_KEY);

		if (pageHitData === null) {
			return;
		}
		
		x = _buildFilename();
		today = new Date();
		try {
			fso  = new ActiveXObject("Scripting.FileSystemObject"); 
			
			if (!fso.FolderExists(x.folder)) {
				fso.createFolder(x.folder);
			}
					
			fh = fso.CreateTextFile(x.filename, true);
			fh.WriteLine(pageHitData);
			fh.Close();
			
			fso = undefined;
			
			localStorage.setItem(TIMESTAMP_KEY, today.toISOString());
			localStorage.removeItem(DATA_KEY);
			
			console.log("Saved BUS data");			
		} catch (ex) {
			console.log("Failed to write BUS data", x.filename, pageHitData, ex);
		}
	}
	
	// Feature check
	if (("ActiveXObject" in window) && ("Storage" in window)) {
		// Wait a little bit after pageload before actually running.
		setTimeout(function () {
		
			_addPageToLocalHistory();
			
			if (_isSaveHitDataDue()) {
				_savePageHitData();
			}

		}, INITIAL_DELAY);
	} else {
		console.log("BUS collection can't work: ActiveX: " + ("ActiveXObject" in window)  + ", localStorage: "  + ("Storage" in window));
	}

})();