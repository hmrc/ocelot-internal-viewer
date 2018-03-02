"use strict";

var voiceId = {
	proc: "adv90091",
	path: "/adv/ocelot/process/adv90091.js",
	lobs: arrayToHash(["tax", "chb", "ntc", "nic"]),
	excluded: arrayToHash(["adv90091", "chb90160"]),	// This must include voiceID.proc as well.
	triggers: arrayToHash(["chb10430", "ntc10080", "tax10024", "tax10655", "nic102698"]),
	isVoiceId: function (id) {
		return id.substr(0, 3) in voiceId.lobs && !(id in voiceId.excluded);
	}
};

var howtos = {}, howtoPhrases = {}, bank_holidays = [], glossary = {}, webchatEditor, lobInfo, titles = {};

var uppercaseWords = arrayToHash(["BF", "NHS"]);

if (Features.check("histManager")) {
	window.histManager = (function () {
		var id = 0;
		var inHistory = false;
		var stack = [];
		var lastPopped, stanza, stanzaId, answers;
		
		function _nextId() {
			return id++;
		}
		
		function _popState(e) {
			var stanza, answers;
			var state = e.state;
			var hash;
			
			console.log("Pop: ", state);
			
			// Look for the 'start of history' marker
			if (state === null || state.stanzaId === undefined || state.historyId === 0) {
				history.back();
				return;
			}
			
			inHistory = true;
						
			if (state.hash.length < historyToHash().length) {
				// going backward - use existing code to go back				
				editAnswers(state.stanzaId)();
			} else  {
				customer = state.customer;
				
				hash = state.hash.substring(historyToHash());
				console.log(hash);
				restoreFromHash(hash);	
			}
						
			inHistory = false;			

			lastPopped = state.historyId;
		}

		function _addHistory(id, hash) {
			if (inHistory) {
				return;
			}
			
			var state = {
				stanzaId: id,
				hash: hash,
				historyId: _nextId(),
				customer: customer
			};
			lastPopped = state.historyId;
			console.log("Push: ", state);
			window.history.pushState(state, undefined, "");
		}

		function _init() {
			console.log("History: ", history.state);
			/*
			window.history.replaceState({
				stanzaId: undefined,
				hash: "",
				historyId: _nextId(),
				customer: customer
			}, undefined, window.location);
			*/
			window.addEventListener("popstate", _popState);
		}
	
		function _setInHistory(state) {
			inHistory = state;
		}
	
		return {
			init: _init,
			addHistory: _addHistory,
			setInHistory: _setInHistory
		}
	})();
}

function updateNavMenu() {
	var lob = getCurrentProcess().meta.id.substr(0, 3);
	
	var target = "/" + lob + "/index.htm";
	if (lob === "dmg") {
		if (Features.check("pidList")) {
			target = "/dmg/index_alternative.htm";
		} else {
			target = "/dmg/index_prime.htm";
		}
	}
	
	$.get(target)
		.done(function (html) {
			var menu = buildElement("div", "navbar-nav mr-auto additional");
		
			$("#navbar02").empty();
		
			$(html).find("#buttons .dropdown").each(function (index) {
				var $this;
				
				if (index < 3) {
					$this = $(this);
					$this.addClass("mr-1");
					$this.find(".fa-4x").removeClass("fa-4x");
					$this.find("h5").remove();
					$this.find("br").remove();
					$this.find(".dropdown-menu").addClass("dropdown-menu-right");
					
					$this.find("button").removeClass("btn-lg").removeClass("btn-block").addClass("btn-nav");
					
					$this.find(".ocelot_popup").each(function () {
						var target = this.dataset.which.match(/([a-z]{3}\d{5})_\d\d\.htm/);
						if (target) {
							this.dataset.target = target[1];
							
							delete this.dataset.which;
							delete this.dataset.size;
							this.classList.remove("ocelot_popup");
							this.classList.add("click-target");
							
							$(this).on("click", showHowto("navbar"));
						}
					});
			
					$(menu).append(this);
				}				
			});
			
			$("#navbarColor01").append(menu);
		
		}).fail(function (jqxhr) {
			console.error(jqxhr);
		});	
}

function isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]';
}

function checkProcessName(process) {
	var match;
	
	// This RegEx is complex to get the matching groups right for the
	// return object below.
			
	match = process.match(/^(([a-z]{3})[0-9]{5})(?:(?:\.([0-9]+))(?:(?:\.([0-9]+))?)|(?:_([a-zA-Z0-9_-]+))|(\.autosave))?$/);
	if (!match) {
	    console.warn("Invalid id", process);
	    return {};
	}
	
	return {
		filename: match[0],
		id: match[1], 
		lob: match[2], 
		major: parseInt(match[3], 10), 
		minor: parseInt(match[4], 10),
		demo: match[5] !== undefined && match[5].length > 0,
		autosave: match[6] === ".autosave"
	};
}


function buildPath(id) {

    var lob = checkProcessName(id);
    var target;
    if (lob.autosave) {
		target = "/ocelot/working/" + lob.lob + "/" + lob.id + ".autosave.js";
	} else if (lob.demo) {
		target = "/" + lob.lob + "/ocelot/process/" + lob.filename + ".js";
	} else if (isNaN(lob.major)) {
		// Current (live) version
		target = "/" + lob.lob + "/ocelot/process/" + lob.id + ".js";
	} else	if (isNaN(lob.minor)) {
		// Archive version
		target = "/ocelot/archive/process/" + lob.lob + "/" + lob.id + "/" + lob.filename + ".js";
	} else {
		// working version
		target = "/ocelot/working/" + lob.lob + "/" + lob.filename + ".js";
	}

    return target;
}

function simpleKeyHandler(e) {	
	if (e.ctrlKey && String.fromCharCode(e.which) === 'G') {
		e.preventDefault();
			
		$("body").toggleClass("preview");
		
		if ($("body.preview").length >0) {
		    addPreviewTools();
		} else {
		    removePreviewTools();
		}
		

		return true;
	} 
}

var KeyHandler = (function () {

	function _handler(e) {
		var key, answers, cards, id;
		var handled = false;
		
		key = e.key;
		
		if (e.ctrlKey) {
			switch (key) {
				case "g":		
					$("body").toggleClass("preview");
            		if ($("body.preview").length >0) {
            		    addPreviewTools();
            		} else {
            		    removePreviewTools();
            		}
            							
					
					handled = true;
					break;
				case "k":
					$(".kbdnav").toggle();
					handled = true;	
					break;
			}
		} else if (e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA") {
			return;
		} else {
		
			switch (key) {
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					key = parseInt(key);
					answers = $("#holder .card").first().find(".cmd-answer");
					if (key > 0 && key <= answers.length) {
						answers.eq(key - 1).trigger("click");
					}
					handled = true;
					break;
				case "x":					
					cards = $("#holder .card");
					if (cards.length > 1) {
						id = cards.eq(1).get(0).id;
						
						editAnswers(id)();
					}
					handled = true;
					break;
			}
		}	
		
		if (handled) {
			e.preventDefault();
			return true;
		}
	}
		
	function _buildShortcut(key) {
		return buildElement("span", "badge badge-pill badge-primary kbdnav", key);
	}
	
	function _letterForLink(index) {						
		return String.fromCharCode("a".charCodeAt(0) + index);
	}
	
	function _addTags(card) {
		var $card = $(card);
		// Back
		$card.find(".card-answer .fa-pencil").after(_buildShortcut("x"));

/*	
		// Links
		$(card).find("a").each(function (index) {
			this.appendChild(_buildShortcut(_letterForLink(index)));
		});
	
*/
		// Answers
		var answers = $card.find(".cmd-answer");
		
		var width = countDigits(answers.length + 1);
	
		answers.each(function (index) {
			this.appendChild(_buildShortcut(pad(index + 1, width)));
		});

	}
	
	return {
		handler: _handler,
		addTags: _addTags
	}
})();

function setHash(hash, id) {
	if (Features.check("histManager")) {
		histManager.addHistory(id, hash);
	} else {
		window.history.replaceState(undefined, "", "#" + hash);
	}
}

function showWebchatPanel() {
	if (!$("#webchat-panel").hasClass("webchat-show")) {
		$("#webchat-panel").addClass("webchat-show");
		$("#mainrow").addClass("with-webchat");
	}
}

function hideWebchatPanel() {
	$("#webchat-panel").removeClass("webchat-show");
	$("#mainrow").removeClass("with-webchat");
}

function showRateItHelp() {
	$.get("/system/RateIt_popup.htm")
		.done(function (html) {
			var title = $(html).find(".modal-title").text();
			var body = $(html).find("#modalBody")[0];
			
			message(body, title);				
		});
}

function getProcessId() {
	return getCurrentProcess().meta.id;
}

function buildStatsUrl() {
	var process = getCurrentProcess();
	var id = process.meta.id;
	var version = "version" in process.meta ? process.meta.version : "0";
	
	var type;
	if (window.location.host.indexOf("cc") !== -1) {
		if (window.location.pathname.indexOf("IPDM") !== -1) {
			type = "ocelot-dev";
		} else {
			type = "ocelot-cc";
		}
	} else {
		type = "ocelot";
	}
		
	var url = window.location.host + "/" + [type, id.substr(0,3), id, "v" + version, "p"].join("/");
	
	var hash = historyToHash();
	if (hash !== "") {
		url += "/"  + hash.replace(/-/g, "/");
	}
	
	return url;	
}

function buildStatsHowtoUrl(id, from) {

    var type, url;
	if (window.location.host.indexOf("cc") !== -1) {
		if (window.location.pathname.indexOf("IPDM") !== -1) {
			type = "ocelot-dev";
		} else {
			type = "ocelot-cc";
		}
	} else {
		type = "ocelot";
	}

    return window.location.host + "/" + [type, id.substr(0,3), id, from].join("/");
}

function loadHowtos(list, complete) {
    if (list.length === 0) {
        complete();
        return;
    }

    var i, lob;
    var lobs = {};
    // get list of lobs
    for (i = 0; i < list.length; i += 1) {
        lobs[list[i].substr(0, 3)] = true;    
    }
    
    var requests = [];
    // For each lob
    for (lob in lobs) {
        // Fetch the flow
        requests.push((function(l) {
            return $.getJSON("/" + l + "/ocelot/" + l + "_howto.js")
                .done(function(json) {
                    var id, howto, i;                
                    for (id in json) {
                        // Add the howto to known list
                        howto = json[id];
                        
                        if (!("flow" in howto)) {
                            // skip bogus howtos
                            continue;
                        }
                                                
                        try {
                            // Update the text ids to include the lob
                            for (i = 0; i < howto.flow.length; i += 1) {
                                if (typeof howto.flow[i] === "string") {
                                  howto.flow[i] = l + "-" + howto.flow[i];
                                } else {
                                  howto.flow[i].text = l + "-" + howto.flow[i].text;
                                }
                            }
                            howtos[id] = howto;
                        } catch (e) {
                            console.warn("Problem with howto " + id, e);
                        }
                        
                    }
                })
                .fail(function() {
                    console.log("Problem loading " + l + " flows");
                });
        })(lob));
        // Fetch the phrasebook
        requests.push((function(l) {
            return $.get("/" + lob + "/ocelot/phrasebook.csv")
            .done(function(data) {
                var i;
                var lines = data.split("\n");
                var phrasebook = [], id, text, parts;
              
                if (!(l in howtoPhrases)) {
                    howtoPhrases[l] = {};
                }
                
                // For each line (id, phrase)
                for (i = 0; i < lines.length; i += 1) {
                    id = lines[i].split(",", 1)[0];
                    text = lines[i].substr(id.length + 1);
                    howtoPhrases[l][id] = text;
                }
            })
            .fail(function() {
                console.log("Problem loading " + l + " phrasebook");
            });
        })(lob));       
    }
    
    // Call callback when all the requests are done.
    return $.when.apply($, requests)
        .done(function () {
            if (complete !== undefined) {
                complete();
            }
        });
}

function setCurrentProcess(process) {
		
	function _doRenumber(target) {
		if (target === undefined || target === null) {
			return undefined;
		}
	
		if (target.match(/^([0-9]+|start|end)$/)) {
			return id + "-" + target;
		} else {
			return target;
		}
	}
	
	var i, j, key, stanza, phraseOffset , keys, next, linksOffset;
	var id = process.meta.id;
		
	phraseOffset = phrasebook.length;
	
	if (processStack === undefined) {
	    // First process load, no updates needed
		processStack = {flow:{}};
		processStack.meta = process.meta;
	} else {
		// Find stanzas in the current process that point to the new process
		// And re-write them to point to the correct stanza
	
		keys = Object.keys(processStack.flow);
		for (j = 0; j < keys.length; j += 1) {
			key = keys[j];
			stanza = processStack.flow[key];

			if ("next" in stanza) {		
				for (i = 0; i < stanza.next.length; i += 1) {
					if ("from" in stanza) {
						if (stanza.next[i][stanza.from.length] === process.meta.id) {
							stanza.next[i][stanza.from.length] += "-start";
						}
					} else {
						if (stanza.next[i] === process.meta.id) {
							stanza.next[i] += "-start";
						}
					}
				}
			}					
		}
	}
	
	if (!("links" in processStack)) {
		processStack.links = [];
	}	 
	
	linksOffset = processStack.links.length;
	processStack.links = processStack.links.concat(process.links);

    // Tidy up modules
	keys = Object.keys(process.flow);
	for (j =0 ; j < keys.length; j += 1) {
		key = keys[j];
		stanza = process.flow[key];
				
		processStack.flow[_doRenumber(key)] = stanza;
		
		if ("next" in stanza) {		
			for (i = 0; i < stanza.next.length; i += 1) {
				if ("from" in stanza) {
					stanza.next[i][stanza.from.length] = _doRenumber(stanza.next[i][stanza.from.length]);
				} else {
					stanza.next[i] = _doRenumber(stanza.next[i]);
				}
			}
		}
		
		if ("from" in stanza) {
			for (i = 0; i < stanza.from.length; i += 1) {
				stanza.from[i] = _doRenumber(stanza.from[i]);
			}
		}
		
		if ("text" in stanza) {
			stanza.text += phraseOffset ;
		}
		
		if ("answers" in stanza) {
			for (i = 0; i < stanza.answers.length; i += 1) {
				stanza.answers[i] += phraseOffset ;
			}
		}
		
		if ("link" in stanza) {
			stanza.link += linksOffset;
		}
		
		if ("moreinfo" in stanza) {
			for (i = 0; i < stanza.moreinfo.length; i += 1) {
				stanza.moreinfo[i] += linksOffset;
			}
		}
	}
	
	phrasebook = phrasebook.concat(process.phrases);			
		
	return processStack;
}

function initialLoad(process) {	
	if (voiceId.isVoiceId(process.meta.id)) {	
		$.getJSON(voiceId.path).done(function (json) {
			handleProcessLoad(process);	
			setCurrentProcess(json);
		}).fail(function (jqxhr) {
			console.error(jqxhr);
		});
	} else {
		handleProcessLoad(process);
	}
}

function renumberForVoiceId(process) {

	function _getNextId() {
		var id = 1, val;
		while (id.toString() in process.flow) {
			id += 1;
		}
		return id.toString();
	}
	
	function _hasWrapHowto(id) {
		return "link" in process.flow[id] && process.links[process.flow[id].link].dest in voiceId.triggers;
	}
	
	function _insertProcess(parentId, childId) {
		var stanza = process.flow[parentId];
		var i;		
		var newStanza = {
			type: "ModuleStanza",
			next: [childId],
			process: voiceId.proc,
			id: _getNextId()
		};
		
		process.flow[newStanza.id] = newStanza;
		for (i = 0; i < stanza.next.length; i += 1) {
			if ("from" in stanza) {			
				if (stanza.next[i][stanza.from.length] === childId) {
					stanza.next[i][stanza.from.length] = newStanza.id;
				}
			} else {
				if (stanza.next[i] === childId) {
					stanza.next[i] = newStanza.id;
				}
			}
		}
	
	}
		
	function _walkUp(id) {
		var parentId, stanza
		var parents = process.flow[id].parents;
		
		if (parents === undefined || parents.length > 1) {
			return false;
		} else if (_hasWrapHowto(id)) {
			_insertProcess(parents[0], id);
			return true;		
		} else {
			return _walkUp(parents[0]);
		}	
	}

	
	// phase one - work out everyone's parents
	// This should probably be moved to processEditor
	var id, stanza, children, child;
	for (id in process.flow) {
		stanza = process.flow[id];
		
		if ("next" in stanza) {
			if ("from" in stanza) {
				children = [];				
				for (i = 0; i < stanza.next.length; i += 1) {
					children.push(stanza.next[i][stanza.from.length]);
				}
			} else {
				children = stanza.next;
			}
												
			for (i = 0; i < children.length; i += 1) {
				if (!children[i].match(/^(\d+|start|end)$/)) {
					continue;
				}
			
				child = process.flow[children[i]];
				if (child !== undefined) {
					if (!("parents" in child)) {
						child.parents = [];
					}
					child.parents.push(id);
				}
			}
		}
	}
	
	// Phase two - Find end stanzas and walk up to find trigger howtos.
	stanza = process.flow["end"];
	if (!("parents" in stanza)) {
		console.warn("Shouldn't happen: End has no parents");
		return;
	}
	
	for (i = 0; i < stanza.parents.length; i += 1) {
		if (!_walkUp(stanza.parents[i])) {
			_insertProcess(stanza.parents[i], "end");
		}
	}	
}

function loadNewProcess(id) {
	processStack = undefined;
	phrasebook = [];
	$.getJSON(buildPath(id))
		.done(Features.check("voiceId") ? initialLoad : handleProcessLoad)
		.fail(function () {
			$("#holder").html("<p>Sorry, there was a problem loading your process.</p>");	
			$("body").removeClass("waiting");					
		});
}

function showLoadPasswordDialog(process, state, onRender) {
    var button, input, body, modal;
    input = buildElement("input", "form-control ipt-secure-password");
    input.type = "password";
    input.required = true;

    body = buildElement("div", undefined,
        buildElement("p", undefined, 'This process is protected by a password'),
        buildElement("div", "form-group",
            buildElement("div", "input-group",
                buildElement("span", "input-group-addon", "Password"),
                input
            )
        )
    );
    
    button = buildElement("button", "btn btn-primary cmd-secure-unlock", "Unlock");
    button.dataset.dismiss = "modal";
    
    modal = $(buildModalFramework({
        title: "Unlock process",
        body: body,
        buttons: button
    })).on("hidden.bs.modal", function () { $(this).remove(); })
        .on("click", ".cmd-secure-unlock", function () {
            var password = modal.find(".ipt-secure-password").val();
            
            try {
                decryptProcess(password , process);         
                process.meta.secure = false;
            } catch (ex) {
                message("Invalid password, can't unlock process");            
                return;
            }
            handleProcessLoad(process, state, onRender);
        })
		.modal("show");    
}

function updateTitle(id) {
    var current, title, lob, lobName;
    if (!(id.substr(3, 1) === "9" || id.substr(3, 1) === "8")) {
        // only update the title for processes
        return;
    }
    
    current = titles.current;
    
    titles.current = id;
    
    if (id === current) {
        return;
    }
    
    lob = id.substr(0, 3);
    
    if (lob in lobInfo) {
        lobName = lobInfo[lob].name + ": ";
    } else {
        console.warn("Unknown lob " + lob);
        lobName = "";
    }        
    $(".lobname").text(lobName);

    
    title = titles[id];
    
    if (title === undefined) {
        console.warn("Title for " + id + " not known");
        return;
    }

	$(".process-title").text(title);
	
	// Based on legacy - page title is just current process title
	document.title = title;
}

function handleProcessLoad(raw, state, onRender) {
	var rawId = raw.meta.id;
	
	if (Features.check("budget")) {
	    if ("secure" in raw.meta && raw.meta.secure) {
	        showLoadPasswordDialog(raw, state, onRender);
	        return;	    
	    }	
	}
	
    // Older versions of processes kept some things in 'meta' that
    // are beter stored at the top level. Move them.
	var moved = ["links", "contacts", "howto"];
	for (i = 0; i < moved.length; i += 1) {
		if (moved[i] in raw.meta) {
			raw[moved[i]] = raw.meta[moved[i]];
			delete raw.meta[moved[i]];
		}	
	}		

	if (Features.check("voiceId") && voiceId.isVoiceId(rawId)) {
		renumberForVoiceId(raw);	
	}

    // setCurrentProcess is badly named. It does some setup if this
    // is the parent process, or renumbers everything for modules.
	var process = setCurrentProcess(raw);
	
	// Remember the title of the process
	titles[rawId] = raw.meta.title;
	
	// If we're not the parent process
	if (rawId !== process.meta.id) {
        // Skip everything else and render anyway
		render(rawId + "-start", state, onRender);
		return;
	}
	
	if (Features.check("navbuttons")) {
		updateNavMenu();
	}

    // The next bit of the code is going to load a bunch of stuff asynchronsly.
    // Stash all the promisies here so we can wait for them all to finish
    // before starting to draw the process. (This simplifies a bunch of code
    // if it can safely assume, for example, timescales have loaded);
    var pending = [];
	
	var lob = process.meta.id.substr(0, 3);

    // Update the control buttons in the top left.
	if (lob === "adv") {
	    // ADV is a special case, it doesn't have a gateway
		$(".nav-gateway")
			.text("Back to Line of Business Menu")
			.attr("href", "/");
		$(".nav-navmenu").attr("href", "/adv/navmenus/navmenu_Combined.htm");
	} else {
		$(".nav-gateway")
			.text("Back to Gateway")
			.attr("href", "/" + lob + "/");
		$(".nav-navmenu").attr("href", "/" + lob + "/navmenus/navmenu_CG.htm");
	}
	
	// Load the navbar, if there is one. Ignore any errors.
	$.get('/system/includes/navbars/' + lob + '_navbar_ocelot.inc')
		.done(function (html) {			
			$("#nav-insert").after(html);
		});
		   
    // Show the 'Goto Legacy' button if the process is less than two weeks old.
    // Suprisingly complex code.
    // Also show webchat if we're a webchat lob. Careful when legacy is finally done
    // that you don't delete that too.
    
	pending.push($.getJSON("lobs.js").done(function (json) {
		var converted, id, legacyId, twoWeeksAgo, convertDate, sheet, j, allDate,  lobData;
		
		lobInfo = json;
		
        if (lob in json) {
            lobData = json[lob];
            
			// Hide legacy link if converted more than two weeks ago
		
			twoWeeksAgo = new Date();
			twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
			twoWeeksAgo = twoWeeksAgo.getTime();		
		
			converted = lobData.converted;					
			
			id = process.meta.id;
			legacyId = id.substr(0, 3) + "0" + id.substr(4);
			
			if (legacyId in converted && !(id in converted)) {
			    converted[id] = converted[legacyId];
			}
					
			if (id in converted) {
				if ("all" in converted) {
					convertDate = Math.max(converted.all, converted[id]);
				} else {
					convertDate = converted[id];
				}
			} else {
				convertDate = converted.all;
			}
		
			if (convertDate === undefined || convertDate > twoWeeksAgo) {
			     // Build hanlder for the 'goto legacy' button
            		
            	$(".cmd-legacy-process")
            		.attr("href", buildLegacyLink(legacyId))
                    .show();
			}
			
			// Show webchat if webchat lob
			if (lobData.webchat) {
				sheet = document.getElementById("localStyleSheet").sheet

				for (j = 0; j < sheet.cssRules.length; j += 1) {
					if (sheet.cssRules[j].selectorText === '.webchat') {
						sheet.deleteRule(j);
					}				
				}
			}  
		}
	}) );
	
    // Load tools
    pending.push(Tools.load());
	
	// Load timescales	
	pending.push(Timescales.load());

    // Load rates 
	pending.push(Rates.load());
	
	// Load process updates	
	pending.push(updateUpdates(process));

	// Load contacts	
	if ("contacts" in process && process.contacts.length > 0) {
		Contacts.load(process.contacts);
	}
			
	// Load howtos
	if (!("howto" in process)) {
		process.howto = [];
		
		for (i = 0; i < process.links.length; i += 1) {
			if (process.links[i].dest.match(/^[a-z]{3}1\d{4}$/)) {
				process.howto.push(process.links[i].dest);
			}				
		} 
	}
	
	if (process.howto.length > 0) {
		pending.push(loadHowtos(process.howto));
	} else if (process.links.length === 0) {
		$("#tools-holder").remove();
	}

    // Wait for all the async stuff to be done loading.
    // If something fails to load, carry on anyway but at least try to tell someone
	$.when.apply(this, pending)
	    .done(reset)
	    .fail(function () {
	        // uh-oh
	        console.error("Something failed to load")
	        reset();
	    });
}

function updateUpdates(process) {
	var id = process.meta.id;
	var prefKey = "processUpdates." + id + ".lastView";
	var lastViewed = userprefs.get(prefKey, 0);

	var param = {
		p: id
	};	
		
	var lob = id.substr(0, 3);			
	
	return $.getJSON("/" + lob + "/ocelot/process/update.js")
		.done(function (json) {
		
			var i, updates, unseen = 0, body, highlight;		
		    updates = [];
		
			if (id in json) {
    			for (i =0 ; i < json[id].length; i += 1) {
    				if (json[id][i].minor !== "true") {
    					updates.push(json[id][i]);
    				}
        		}				
        	}	
				
			if (updates.length > 0) {
    			for (i = 0; i < updates.length; i += 1) {
    				if (updates[i].date > lastViewed) {
    					unseen += 1;
    				}				
    			}
    			
    			updates.sort(function (a, b) {return b.date - a.date});
			
				body = buildElement("table", "table table-striped table-sm p-0",
					buildElement("thead", undefined,
						buildElement("tr", undefined,
							buildElement("th", undefined, "Date"),
							buildElement("th", undefined, "Message")
						)
					)
				);
		
				for (i = 0; i < updates.length; i += 1) {
				
					if (updates[i].date > lastViewed) {
						highlight = "table-success";					
					} else {
						highlight = "";
					}
				
					body.appendChild(
						buildElement("tr", highlight,
							buildElement("td", "text-nowrap text-right", formatDate(new Date(updates[i].date))),
							buildElement("td", undefined, updates[i].message)
						)
					);				
				} 				
			} else {
				body = buildElement("div", undefined, "Nothing has changed since the last time you viewed this process");
			}

			var modal = buildModalFramework({
				title: "Process Updates",
				body: body,
				size: "lg"
			});		
			
			$("#process-updates").off("click").on("click", function () {
				userprefs.put(prefKey, new Date().getTime());
				$(modal).modal("show");
			});
			
			if (unseen > 0) {
				$("#process-updates")
					.find(".updates-badge").remove()
					.end()
					.append('<span class="badge badge-warning updates-badge">' + unseen  + '</span>');
			}
		})
		.fail(function (jqXHR) {
			console.error("Can't get process updates", jqXHR);
		});
}


function getHowtoPhrase(id) {
	var lob = id.split("-");
	return howtoPhrases[lob[0]][lob[1]];
}

function buildInstructionList(instructionArray) {

    function _buildFirstWord(word) {        
        var result = buildElement("span", "first", word);
        if (word in uppercaseWords) {
            result.classList.add("force-uppercase");
        }
        
        return result;    
    }

	function buildInstructionListInner(input) {
		var words = [], i, x = [], stanza, line, type;
	
		function _recurse(el, rows, depth, drawnFirst) {
			var row, col, width, stanza;
			var stack = [], lastWord, lastWordRow = 0;
			var found = false;
			var ul, li;
	
			// Sanity check
			if (depth > 15) {
				throw new Error("Too deep, man");
			}
	
			// If we've only got one row, then we're at a 'terminal' point
			if (rows.length === 1) {
				stanza = rows[0].pop();
				
				el.dataset.id = stanza.getIdString();
						el.dataset.depth = depth;
				el.classList.add(stanza.getType());	
				if (!drawnFirst) {					
					drawnFirst = true;
					el.appendChild(_buildFirstWord( rows[0][0]));
					el.appendChild(textNode(" " + rows[0].slice(1).join(" ")));
				} else {
					el.appendChild(textNode(rows[0].slice(0).join(" ")));
				}
				
				if ('link' in stanza.data) {
					attachLink(stanza, el);
				} else if ('howto' in stanza.data) {
					attachHowto(el, stanza.data.howto);
				}

				if (stanza.hasWebchat()) {
					el.dataset.webchat = stanza.getWebchat();
				}
				
				return;
			} else if (rows.length === 0) {
				return;
			}
					
			// This (internal) function is called when a mis-match is found.		
			function branch() {
				if (!found) {
					if (col > 0) {			
						el.dataset.depth = depth;
						el.classList.add(rows[0][rows[0].length - 1].getType());							
						if (!drawnFirst) {
							drawnFirst = true;
							el.appendChild(_buildFirstWord(rows[0][0]));
							el.appendChild(textNode(" " + rows[0].slice(1, col).join(" ")));							
						} else {
							el.appendChild(textNode(rows[0].slice(0, col).join(" ")));
						}																	
					}
					ul = buildElement("ul");
				}
				li = buildElement("li");	
				
				stack = [];
				for (i = lastWordRow; i < row; i += 1) {
					stack.push(rows[i].slice(col));
				}
	
				_recurse(li, stack, depth + 1, drawnFirst);
				
				// I'm not wild about this bit.
				// After the recursion, we sometimes get a LI with exactly one child, a UL
				// If that happens, then pull up all the li children of the UL.
				
				if (li.childNodes.length === 0) {
					// Cope with zero length children
					// (by ignoring them)
				
				} else if (li.firstChild.nodeName !== "UL") {
					ul.appendChild(li);					
				} else {
					while (li.firstChild.hasChildNodes()) {
						ul.appendChild(li.firstChild.firstChild);
					}
				}
				el.appendChild(ul);	
			}
						
			// Main algorithm.
			// Walk along each word in the first row, looking for matches going
			// down rows. Once the matches stop, split off the matching rows and
			// recurse.
			
			// (Note that the first match is against the first three words, and then
			// single words after that).		
			outer: for (col = 0; col < rows[0].length; col += width) {
				width = col === 0 ? 3 : 1;
	
				lastWord = rows[0].slice(col, col + width).join(" ");
				
				for (row = 1; row < rows.length; row += 1) {
					
					if (rows[row].slice(col, col + width).join(" ").toLowerCase() !== lastWord.toLowerCase()) {
						
						branch();
						
						lastWordRow = row;
						lastWord = rows[row].slice(col, col + width).join(" ");					
						found = true;					
					}
				}
				
				// If there are rows that haven't been drawn yet...
				if (lastWordRow !== 0 && lastWordRow !== rows.length) {
					branch();
				}
				
				if (found) {						
					break outer;
				}
			}
		}
		
		if (input.length === 0) {
			return buildElement("span", "empty");
		}
				
		// Initial work. Split each input row into seperate words
		line = input[0].getText();
		for (i = 0; i < input.length; i += 1) {
			if (i > 0 && line === input[i].getText()) {
				continue;
			}
		
			words.push(input[i].getText().trim().split(" ").concat(input[i]));	
		}
		
		var result = buildElement("li", input[0].getType());	
		
		_recurse(result, words, 0, false);
		
		return result;
	}
	
	function _splitOther(list) {
		var sublist = [], result;
			
		var listType = list[0].data.type;
		
		result = buildElement("li", "not-instruction");
		
		while (list.length > 0) {
			if (sublist.length === 0 || list[0].isStacked()) {
				sublist.push(list.shift());
			} else {
				result.appendChild(buildInstructionListInner(sublist));
				sublist = [list.shift()];
			}		
		}
		
		if (sublist.length > 0) {
			result.appendChild(buildInstructionListInner(sublist));
		}

		// Some stanza types want to 'wrap' themselves (Notes, Important Notes, etc)
		if ("wrap" in types[listType].prototype) {
			types[listType].prototype.wrap(result);
		}
		
		return result;
	}
		
	function _splitInstructions(list) {
		var sublist = [], result, group = [];
			
		var listType = list[0].getType();
		
		while (list.length > 0) {
			if (sublist.length === 0 || list[0].isStacked()) {
				sublist.push(list.shift());			
			} else {				
				group = group.concat(buildInstructionListInner(sublist));								
				sublist = [list.shift()];
			}		
		}
		
		if (sublist.length > 0) {
			result = buildInstructionListInner(sublist);
			if (result.childNodes.length === 1 && result.firstChild.nodeName === "UL") {
				while (result.firstChild.firstChild) {
					group.push(result.firstChild.removeChild(result.firstChild.firstChild));
				}
			} else {		
				group = group.concat(result);		
			}
		}
		
		return group;
	}
	
	function _getLink(el) {
		// If we're an LI.howto, and our first child is an 'A', then return the howto id
		// Else if we're an LI.link and our first child is an 'A', then return the href
	
		if (el.nodeName === "LI" && el.classList.contains("howto") && el.firstChild && el.firstChild.nodeName === "A") {
			return el.firstChild.dataset.target;
		} else if (el.nodeName === "LI" && el.classList.contains("link") && el.firstChild && el.firstChild.nodeName === "A") {
			return el.firstChild.dataset.target;
		} else {
			return undefined;
		}
	}
	
	function _findUL(el) {
		var i;
		for (i =0; i < el.children.length; i += 1) {
			if (el.children[i].nodeName === "UL") {
				return el.children[i];
			}
		}
		return undefined;
	}
			
	function _attachHowto(r, id) {
		// Slightly modified version of attachHowto that 
		// looks for a UL, and inserts the link to the howto before that.
		var scratch = buildElement("a");
		
		scratch.dataset.target = id;
		
		$(scratch).on("click", showHowto("inline"));
		while (r.firstChild && r.firstChild.nodeName !== "UL") {
			scratch.appendChild(r.firstChild);			
		}
		
		scratch.appendChild(buildFA("question-circle"));
		
		r.insertBefore(scratch, r.firstChild);
		r.classList.add("howto");
	}
	
	function _attachLink(r, target) {
		var scratch = buildElement("a");
		
		scratch.href = buildLegacyLink(target);
		scratch.target = "_blank";
		scratch.dataset.target = target;

		while (r.firstChild && r.firstChild.nodeName !== "UL") {
			scratch.appendChild(r.firstChild);			
		}
		
		scratch.appendChild(buildFA(getIconType(target)));
		
		r.insertBefore(scratch, r.firstChild);
		r.classList.add("link");
	
	}
	
	function _promoteLinks(list, level) {
		// If a group of stanzas at the same stack level have the same link (or howto)
		// Then that link should be pulled up to the next highest stack level
		// (Except for matches at the top level, that doesn't have anywhere to pull up to )
		
		var pullup = true, link, childLink, i, li, scratch, ul, a;
		
		if (!list.firstChild) {
			return;
		}
		
		link = _getLink(list.firstChild);
		if (link === undefined) {
			pullup = false;
		}
		
		for (i = 0; i < list.children.length; i += 1) {
			li = list.children[i];
			// check for child list
			ul = _findUL(li);
			if (ul !== undefined) {				
				// Check childlist to see if it needs pulling up 
				childLink = _promoteLinks(ul, level + 1);
					
				if (childLink !== undefined) {
					if (childLink.match(/^[a-z]{3}1\d{4}$/)) {
						_attachHowto(li, childLink);
					} else {
						_attachLink(li, childLink);
					}
					
					if (i === 0) {
						link = childLink;
						pullup = true;
					} else if (link !== childLink) {
						pullup = false;
					}
				}												
			}
						
			if (!pullup) {
				// Don't need to bother checking if we know there's no match
				continue;
			}
			
			scratch = _getLink(li);
			if (scratch === undefined || scratch !== link) {
				// If this line doesn't have a howto, or has a different howto
				// then we shouldn't do the pull up
				pullup = false;
			}				
		}
		
		if (level > 0 && pullup) {
			// Need to tidy up
			for (i = 0; i < list.children.length; i += 1) {
				li = list.children[i];
				
				// Remove the 'howto' and 'link' class from the li
				// If the class attribute is empty, then delete the class attribute
				// (Not strictly needed, but it makes the source look less messy
				//  and this is a 'tidy up' section)
				li.classList.remove("howto");
				li.classList.remove("link");
				if (li.classList.length === 0) {
					li.removeAttribute("class");
				}
				
				// This bit is a bit more complex. I want to remove the existing links
				// We can't just delete them, because they've got content we need to keep
				// so we need to 'unwrap' them.
								
				// 1. Get the a element
				a = li.firstChild;
				
				// 2. While it still has children....
				while (a.firstChild) {
					// 3. If the child is not a font awsome placeholder
					if (a.firstChild.nodeType !== 1 || !a.firstChild.classList.contains("fa")) {
						// 4a. Move the child to the parent and put it just infront of the a
						// 4a. This should keep the child nodes in the right order.
						li.insertBefore(a.firstChild, a);
					} else {
						// 4b. Delete the nodes we don't like
						a.removeChild(a.firstChild);
					}
				}			
			}
			
			return link;
		}		
	}

	function _flatten(result) {
	    var i, child, ul;
	    for (i = 0; i < result.children.length; i += 1) {
	        child = result.children[i];
	        
	        if (child.nodeName == "LI" && child.children.length === 1 && child.firstChild.nodeName === "UL") {
	            // Only child is a list. Promote everything one level
	            ul = child.firstChild;
	            while (ul.firstChild) {
	                result.insertBefore(ul.firstChild, child);
	            }
	            
	            result.removeChild(child);
	        }
	    }
	}
	
	function _firstPass(list) {
		// Split the list of stanzas into groups that have the same type
		// (taking the oportunity to draw any 'self render' stanzas	
	
		var sublist = [], result = buildElement("ul", "stack"), i, group, counter = 0;
	
		while (list.length > 0) {
			if (!list[0].isSelfRender() && (sublist.length === 0 || list[0].getType() === sublist[0].getType())) {
				sublist.push(list.shift());			
			} else if (sublist.length > 0) {
				if (sublist[0].isSelfRender()) {
					result.appendChild(sublist[0].toHTML());
				} else if (sublist[0].getType() === "instruction") {
					counter += 1;
					group = _splitInstructions(sublist);
					for (i =0; i < group.length; i += 1) {
						result.appendChild(group[i]);
					}
				} else {
					result.appendChild(_splitOther(sublist));
				}
				
				sublist = [list.shift()];
			} else if (list[0].isSelfRender()) {
				result.appendChild(list.shift().toHTML());
			}
		}
		
		if (sublist.length > 0) {
			if (sublist[0].isSelfRender()) {
				result.appendChild(sublist[0].toHTML());
			} else if (sublist[0].getType() === "instruction") {
				counter += 1;
				group = _splitInstructions(sublist);
				for (i =0; i < group.length; i += 1) {
					result.appendChild(group[i]);
				}
			} else {
				result.appendChild(_splitOther(sublist));
			}
		}
		
		_flatten(result);
		
		_promoteLinks(result, 0);

		return result;
	}
	
	return _firstPass(instructionArray);
}

window.SEES = (function () {

	var shell, FSO;
	var localBase = 'C:\\users\\' + _getPid() + "\\";
		
	var localPath = localBase + 'SeesLetterOpener.exe';
	var remotePath = '\\\\c\\s\\CAF2\\PT OPS BCT NQM Report\\SEESLetterDriveby\\SeesLetterOpener.exe';
		
	function _getShell() {
		if (shell === undefined) {
			shell = new ActiveXObject("wscript.shell");
		}
		return shell;
	}
	
	function _getFSO() {
		if (FSO === undefined) {
			FSO = new ActiveXObject("scripting.FileSystemObject");
		}
		return FSO;
	}

	function _getPid() {
		var driveParts, driveName;
		
		if (!_hasActiveX()) {
			return 0;
		}			

		try {
			return _getShell().ExpandEnvironmentStrings("%username%");		
		} catch (ex) {
			driveName = _getFSO().GetDrive(_getFSO().GetDriveName("Z:"));
			driveParts = driveName.ShareName.split("\\");
			if (isNan(driveParts[4])) {
				return driveParts[5];
			} else {
				return driveParts[4];
			}		
		}
	}
	
	function _hasActiveX() {
		return "ActiveXObject" in window;	
	}
	
	function _installSees() {		
		if (!_getFSO().FileExists(localPath) || (_getFSO().GetFileVersion(localPath) !== _getFSO().GetFileVersion(remotePath))) {
			_getFSO().getFile(remotePath).Copy(localBase);
		}		
	}
	
	function _addIncompatibleBrowser(target) {
		$(target).on("click", function () {			
			var link = buildElement("a", "extLink", "this process");
			link.href = window.location.href;
			
			message(
				buildElement("div", undefined,
					"Sorry, your browser doesn't support this function. Please try ",
					link,
					buildFA("comments-o"),
					" in Internet Explorer"
				), 
				"Incompatible Browser"
			);
		});
	}
	
	function _attachClickHandler(target, path) {
		$(target).on("click", function () {			
			try {
				_installSees();				
				_getShell().run(localPath + ' "' + path + '"');
			} catch (ex) {
				console.error("Problem opening SEES letter [" + path + "]", ex);
			}
		});	
	}
	
	function _buildSees(args) {
	    var path = args[0];
	    var text = args[1];
	
		var span = buildElement("span", "extLink placeholder sees no-howto", 
			text,
			buildFA("envelope")
			
		);		
		if (_hasActiveX()) {
			_attachClickHandler(span, path);
		} else {				
			_addIncompatibleBrowser(span);
		}
		return span;
	}
	
	function _buildLeftbar(path, title) {
		var link = buildElement("a", "list-group-item list-group-item-action",
			buildElement("div", undefined,
			    buildFA("envelope"),
			 	" ",
			 	title
			)
		);
		if (_hasActiveX()) {
			_attachClickHandler(link, path);
		} else {
			_addIncompatibleBrowser(link);
		}	
		return link;
	}

	return {
		attach: _buildSees,
		attachLeftbar: _buildLeftbar,
		attachGeneric: _attachClickHandler
	};
})();

/** replacePlaceholder is called by the viewer when its time to replace placeholders.

    Placeholders before replacement look like '[label:option1:option2:....]', that is
    a label followed by a list of options, seperated by colons.
     
    Adding new placeholders is just a matter of creating a function, and then adding it to the 'vec' hash.
    
	Placeholder functions are called with the list of options (not including the label). They must
	return a DOM element.
	
	Example:
	
	Given a placeholder "[say:world]", return "<span>world<span>"

		vec = { ...
			say: _buildSay
			...
		};
	
		function _buildSay(word) {
			if (word !== undefined) {
				return buildElement("span", "placeholder say", word);
			} else {
				return buildElement("span", "placeholder say broken", "[unknown]");
			}
		}				
		
	(buildElement is defined in common.js. It creates a DOM element with the name of the
	first argument, CSS classes of the second argument, and contents of any further arguments)
	
	Advice:
	
	_buildLabel is an example of a simple placeholder. It pulls data from the global 'customer'
	object and displays it.
	
	_buildGlossary is a lot more complex. It needs to be asynchronous, because it may have to
	load the glossary definition from the network. Notice how it uses 'closures' to create an
	element and return it, while still keeping hold of a reference to the element so that it
	can update it when the response comes back. This model is also used for timescale and
	contacts placeholders, and should be used for any new placeholders that use the network.

	@param r	DOM element to search for placeholders. Placeholder functions should not refer to this.
*/

window.Placeholders = (function () {

    // Known placeholder types
    var types = {
        add_date: Timescales.attachDateAdd,
		bold: _buildBold,
		contact: Contacts.attach,
		date: _buildDate,
		timescale:Timescales.placeholder,
		date_add: Timescales.attachDateAdd,
		glossary: _buildGlossary,
		label: _buildLabel,
		lable: _buildLabel,		
		link: _buildLink,
		icon: _buildIcon,
		"font-awesome": _buildIcon,
		rate: Rates.getRate,
		sees: SEES.attach		
    }

	// **** Placeholder functions ****
	
	// Add new placeholders here
		
	function _buildBold(args){	    
		if (args[0] !== undefined){
			return buildElement("strong", "placeholder bold", args[0]);
		} else{
			return buildElement("strong", "placeholder bold broken", "[unknown]");
		}
	}
	
	function _buildDate(args) {
	    var date = args[0];
	    var which = args[1];
	    
	    var scratch, i;
	    
	    if (!isDate(date)) {
	        return date;
	    }
	    
	    switch (which) {
	        case "dow":
	            // Sunday is 0
	            return date.getDay();
	        case "dow_name":
	            return dayNames[date.getDay()];
	        case "day":
	            return date.getDate();
	        case "month":
	            return date.getMonth() + 1;	            
	        case "month_name":
	            return monthNames[date.getMonth()];
	        case "year":
	            return date.getFullYear();
	        case "tax_year_start":
	            return Timescales.taxYearStart(date);
	        case "tax_year_end":
	            scratch = Timescales.taxYearStart(date);
	            scratch.setFullYear(scratch.getFullYear() + 1);
	            scratch.setDate(scratch.getDate() - 1);
	            return scratch;
	        default:
	            console.warn("Unknown date arg", which);
	            return date;
	    }
	}
	
	function _buildGlossary(args, options) {
	    var id = args[0];
	    var text = args[1];
	
		function _addFunctionality(target, entry) {
			$(target).html(text === undefined ? entry.title : text);
			
			if (!options.webchat) {
				$(target).popover({
					trigger: "hover",
					title: entry.title,
					content: entry.desc,
					html: true			
				});	
			}
		}
		
		var holder;
				
		if (id === undefined) {
			return buildElement("span", "placeholder glossary broken", text);
		}
		
		holder = buildElement("a", "placeholder glossary no-howto", text);
		holder.setAttribute("tabindex", "0");		
		
		if (id in glossary) {
			_addFunctionality(holder, glossary[id]);
		} else {		
			$.getJSON("glossary.asp", {q: id})
				.done(function (json) {
					if ("success" in json) {
						_addFunctionality(holder, json.success);
						glossary[id] = json.success;
					} else {
						console.error("Glossary error", json);
					}				
				})
				.fail(function (jqxhr) {
					console.error("Glossary error", jqxhr);
				});
		}
		return holder;
	}
	
    function _buildIcon(args) {
	    return buildFA(args[0]);
	}
	
	function _buildInput() {
		var input = buildElement("input", "form-control placeholder");
		input.type = "text";				
		return input;	
	}
	
	function _buildLink(args) {	
	    var text = args.shift();
	    var target = args.join(":");
		var link = buildElement("a", "placeholder link no-howto", text), i, result;
		
		if (arguments.length > 2) {
			for (i = 2; i < arguments.length; i += 1) {
				target += ":" + arguments[i];						
			}
		}
				
		link.target = "_blank";
		
		if (target === undefined) {
			// Do nothing				
		} else if (target.match(RE.legacy)) {
			if (target.match(RE.howto)) {
				// Howtos				
				link.dataset.target = target;
				$(link).on("click", showHowto("inline"));

			} else {
				// Some other type of link
				link.href = buildLegacyLink(target);
			}
		} else if (target.match(/^SEES:\/\//)) {
			SEES.attachGeneric(link, target.substring("SEES://".length));	
		} else {
			link.href = target;
		}	
	
		result = buildElement("span", undefined,
			link,
			buildFA(getIconType(target))
		);

		return result;
	}
	
	function _buildLegacyHowtoLink(args) {
	    var text = args[0];
	    var target = args[1];
		var link = buildElement("a", undefined, text), i;
		
		link.target = "_blank";
		
		if (arguments.length > 2) {
			for (i = 2; i < arguments.length; i += 1) {
				target += ":" + arguments[i];
			}
		}
		
		if (target === undefined) {
			// ignore it
		} else if (target.match(/^[a-z]{3}1[0-9]{4}$/)) {
			// howto		
			link.dataset.type = "howto"
			link.dataset.which = buildLegacyLink(target);
		} else {
			link.classList.add("extLink");
			link.href = buildLegacyLink(target);
		}
	
		return link;
	}
	
	function _buildLabel(args) {
	    var name = args[0];
	    var format = args[1];
	    var value;

        if (name in customer) {
            value = customer[name];
            
            if (format in formats) {
                return formats[format](value);
            } else {
                return value;
            }            
        } else {
            console.warn("Can't find label " + name + " in customer object");
            return "";
        }
	}
	
	function _buildRates(args) {
        return Rates.getRate(args);    
    }	
			
    // *** FORMATS *** 
	var formats = {
	    currency: _formatCurrency,
	    date: _formatDate
	};

	function _formatDate(date) {
	    if (!(isDate(date))) {
	        return date;
	    }
	
		return formatDate(date);
	}

    function _formatCurrency(value) {
        if (typeof value !== "number") {
            console.log("Value " + value + " is a " + typeof value);
            return value;
        }
        
        return value.toLocaleString("en-GB", {style: 'currency', currency: 'GBP'});
    }
    
    // *** INFRASTRUCTURE BELOW ****
    
    function _stripText(node) {
        var result = "";
        var queue = [node];
        var next, i, child;
        
        while (queue.length > 0) {
            next = queue.pop();
            
            for (i =0 ; i < next.childNodes.length; i += 1) {
                child = next.childNodes[i];            
                switch (child.nodeType) {
                    case 1: // element
                        queue.push(child);
                        break;
                    case 3: // text
                        result += child.nodeValue;
                        break;
                 }
            }
        }
        
        return result;
    }
    
    function _replaceString(args, options) {
        var args, type, result;
                
        if (args.length <= 1 || !(args[0].toLowerCase() in types)) {
            return "[" + args.join(":") + "]";
        } else {
            type = args.shift().toLowerCase();
            result = types[type](args, options);
            if (result instanceof Element) {
                console.warn("Trying to use a DOM placeholder when we want a string", args.join(":"));
                return _stripText(result);
            } else {
                return result;
            }
        }
    }
    
    function _parseString(text, options) {
        var placeholders = [], ph;
        var index;
        var start, end, replacement;

        // Note: index is also adjusted inside this loop
        for (index = 0; index < text.length; index += 1) {
            switch (text[index]) {
                case '[':
                    // Start of a new placeholder
                    placeholders.push({start: index, args: [], argStart: index, argCount: 0});
                    break;
                 case ':':
                    // Argument seperator. although may occour naturaly in strings
                    ph = placeholders[placeholders.length - 1];
                    if (ph !== undefined) {
                        // argCount is different to ph.args.length when one of arguments
                        // has been replaced below (because it was a nested placeholder)
                        if (ph.argCount === ph.args.length) {
                            ph.args.push(text.substring(ph.argStart + 1, index));
                        }
                        ph.argStart = index;
                        ph.argCount = ph.args.length;
                    }
                    break;
                 case ']':
                    // End of a placeholder                    
                    ph = placeholders.pop();
                    ph.end = index;
                    
                    // Grab any remaning arguments
                    if (ph.argStart + 1 !== index) {
                        ph.args.push(text.substring(ph.argStart + 1, index));
                    }
                    
                    if (placeholders.length >= 1) {
                        // If we're a nested placeholder, calculate our replacement
                        // and then add it to our parents arguements
                        
                        replacement = _replaceString(ph.args.slice(), options);
                        placeholders[placeholders.length - 1].args.push(replacement );
                    } else {
                        // Otherwise, we're a top level placeholder
                        
                        replacement = _replaceString(ph.args.slice(), options);
                        start = ph.start;
                        end = ph.end;
                        
                        // If we're the whole string, just return the replacement
                        if (start === 0 && end === text.length - 1) {
                            return replacement;
                        }
                        
                        // Otherwise, convert to a string if needed
                        if (typeof replacement === "number") {
                            replacement = replacement.toString();
                        } else if (isDate(replacement)) {
                            replacement = formatDate(replacement);
                        }
                        
                        // Replace the placeholder in the original string
                        text = text.substring(0, start) + replacement + text.substring(index + 1);
                        
                        // Update the index to take into account any change of length
                        index = start + replacement.length - 1;
                    }
                    break;
            }
        }
        return text;    
    }

    function _replaceDom(args, options) {
        var result, text, args, type;
                
        if (args.length <= 1 || !(args[0].toLowerCase() in types)) {
            return "[" + args.join(":") + "]";
        } else {
            type = args.shift().toLowerCase();
            return types[type](args, options);
        }        
    }
    
    function _findDomPlaceholders(textNode, options) {
        var placeholders = [], ph;
        var index;
        var start, end, chunk, replacement, next;
        
        var text = textNode.nodeValue;

        // Note: index is also adjusted inside this loop
        for (index = 0; index < text.length; index += 1) {
            switch (text[index]) {
                case '[':
                    // Start of a new placeholder
                    placeholders.push({start: index, args: [], argStart: index, argCount: 0});
                    break;
                 case ':':
                    // Argument seperator. although may occour naturaly in strings
                    ph = placeholders[placeholders.length - 1];
                    if (ph !== undefined) {
                        // argCount is different to ph.args.length when one of arguments
                        // has been replaced below (because it was a nested placeholder)
                        if (ph.argCount === ph.args.length) {
                            ph.args.push(text.substring(ph.argStart + 1, index));
                        }
                        ph.argStart = index;
                        ph.argCount = ph.args.length;
                    }
                    break;
                 case ']':
                    // End of a placeholder                    
                    ph = placeholders.pop();
                    if (ph === undefined) {
                        // Unbalenced bracket.
                        break;
                    }
                    
                    ph.end = index;
                    
                    // Grab any remaning arguments
                    if (ph.argStart + 1 !== index) {
                        ph.args.push(text.substring(ph.argStart + 1, index));
                    }
                    
                    if (placeholders.length >= 1) {
                        // If we're a nested placeholder, calculate our replacement
                        // and then add it to our parents arguements
                        placeholders[placeholders.length - 1].args.push(_replaceString(ph.args.slice()));
                    } else {
                        // Otherwise, we're a top level placeholder
                        
                        replacement = _replaceDom(ph.args.slice(), options);
                        start = ph.start;
                        end = ph.end;
                        
                        chunk = textNode.splitText(start);
                        next = chunk.splitText(index - start + 1);
                        
                        if (replacement === undefined) {
                            replacement = buildElement("span", "text-warning cmd-RateIt extLink", buildFA("exclamation-triangle"), "Error: The is a problem with a placeholder");
                        }
                        
                        if (replacement instanceof Element) {
                            textNode.parentNode.replaceChild(replacement, chunk);
                        } else {
                            if (typeof replacement === "number") {
                                replacement = replacement.toString();
                            } else if (isDate(replacement)) {
                                replacement = formatDate(replacement);
                            }
                            textNode.parentNode.replaceChild(document.createTextNode(replacement), chunk);
                        }

                        if (next === null || next.nodeValue.length === 0) {
                            return;
                        }
                                                
                        textNode = next;
                        index = 0;
                        text = textNode.nodeValue;
                    }
                    break;
            }
        }
    }
        
    function _parseDom(target, options) {
        var next, i, child;
        var queue = [], textNodes = [];
        
        target.normalize();
        
        queue.push(target);
                
        // Find text nodes
        while (queue.length > 0) {
            next = queue.shift();
            for (i = 0; i < next.childNodes.length; i += 1) {
                child = next.childNodes[i];
                switch (child.nodeType) {
                    case 1:     // Element
                        queue.push(child);
                        break;
                    case 3:     // Text
                        textNodes.push(child);
                        break;                
                }
            }
        }
        
        for (i = 0; i < textNodes.length; i += 1) {
            _findDomPlaceholders(textNodes[i], options);        
        }
                
        target.normalize();
        
        return target;
    }

    return {
        replaceDom: _parseDom,
        replaceText: _parseString
    };
})();



function replacePlaceholders(r, style) {
    var options = {};
    
    if (typeof style === "boolean") {
        options.webchat = style;
    } else {
        options[style] = true;
    }

    Placeholders.replaceDom(r, options);
}

function attachLink(stanza, el) {
	var li = buildElement("li");
	var scratch = buildElement("a");
	var process = getCurrentProcess();
	var link = process.links[stanza.data.link];
			
	if (link.dest.match(/^[a-z]{3}[0-9]{5}$/)) {
		if (link.dest.substr(3, 1) === "1") {
			return attachHowto(el, link.dest);
		} else {
			scratch.href = buildLegacyLink(link.dest);
		}
	} else if (link.dest.match(/^SEES:\/\//)) {
		SEES.attachGeneric(scratch, link.dest.substring("SEES://".length));
	} else {
		scratch.href = link.dest;
	}
	
	scratch.dataset.target = link.dest;
		
	if (link.window) {
		scratch.target = "_blank";
	}
	
	if (link.title) {
		scratch.title = link.title;
	}	
		
	while (el.hasChildNodes()) {
		scratch.appendChild(el.firstChild);						
	}
	
	scratch.appendChild(buildFA(getIconType(link.dest)));
		
	el.appendChild(scratch);
	el.classList.add("link");
	return el;
}

function attachHowto(r, id) {
	var scratch = buildElement("a");
	
	scratch.dataset.target = id;
	
	$(scratch).on("click", showHowto("inline"));
	
	while (r.hasChildNodes()) {
		scratch.appendChild(r.firstChild);			
	}
	
	scratch.appendChild(buildFA("question-circle"));
	
	r.appendChild(scratch);
	r.classList.add("howto");
	return r;	
}

function showHowto(from) {
    return function (e) {
    	if ("classList" in e.target && e.target.classList.contains("no-howto") && $(e.target).closest(".howto").length === 0) {
    		return;
    	}
    
    	var id = this.dataset.target;
    
    	var result, placeholder, modal;
    
    	function _renderHowto(id) {
    		var modal, howto, title, rows, stanza, body;
    	
    		howto = howtos[id];
    		title = howto.meta.title;
    		
    		rows = [];
    		
    		for (var i = 0; i < howto.flow.length; i+= 1) {								
    			if (howto.flow[i] === null) {
    				continue;
    			} else if (typeof howto.flow[i] === "string") {
    				stanza = {};
    				stanza.type = "InstructionStanza";
    				stanza.stack = false;
    				stanza.text = howto.flow[i];
    			} else {
    				stanza = howto.flow[i];
    				if (!('type' in stanza)) {
    					stanza.type = 'InstructionStanza';
    				}
    			}	
    			stanza = buildStanza("howto-" + id + "-" + i, stanza);
    			stanza.getText = function (text) { 
    				return function () {
    					return getHowtoPhrase(text);
    				}
    			}(stanza.data.text);
    			
    			stanza.hasWebchat = function () {
    				return false;
    			}
    			
    			rows.push(stanza);			
    		}
    		
    		body = buildInstructionList(rows);
    		body.classList.add("howto");
    		replacePlaceholders(body);
    		return {title: title, body:body};
    	}
    								
    	if (id in howtos) {
    		result = _renderHowto(id);			
    	} else {
    		placeholder = buildElement("div", "d-flex justify-content-center", buildSpinner());
    		result = {title: "Loading...", body:placeholder};
    
    		loadHowtos([id], function () {
    			var scratch = _renderHowto(id);
    			placeholder.parentNode.replaceChild(scratch.body, placeholder);
    			modal.find(".modal-title").text(scratch.title);
    		});
    	}		
    	
    	if (window.frameElement) {
    		jq = window.frameElement.ownerDocument.defaultView.$;
    
    		modal = jq(buildModalFramework({title: result.title, body: result.body, size: "lg"}))
    			.on("hidden.bs.modal", function () {
    				jq(this).remove();
    			})
    			.modal("show");
    	} else {
    		modal = $(buildModalFramework({title: result.title, body: result.body, size: "lg"}))
    			.modal("show")
    			.on("hidden.bs.modal", function () {
    				$(this).remove();
    			});
    	}
    	if (Features.check("stats")) {
    	    modal.on("shown.bs.modal", function () {
    	        if ("Stats" in window) {
            	    Stats.log(buildStatsHowtoUrl(id, from));
            	}
    	    });
    	}
	}
}

function findDownTreeLinks(root) {
	var i, next, stanza, queue = [root], visited = {}, found = {}, links;
		
	while (queue.length > 0) {		
		next = queue.shift();
		
		if (!stanzaExists(next) || (next in visited)) {
			continue;
		}
		visited[next] = 1;
		
		stanza = getStanza(next);
		
		queue = queue.concat(stanza.getChildren());
			
		if ("howto" in stanza.data) {
			found[stanza.data.howto] = true;
		} else if ("link" in stanza.data) {
			found[stanza.data.link] = true;
		}
				
		if ("moreinfo" in stanza.data) {
			for (i =0 ; i < stanza.data.moreinfo.length; i += 1) {
				found[stanza.data.moreinfo[i]] = true;			
			}		
		}		
	}
	
	return found;
}

function updateLeftbar(id) {
	var links = getCurrentProcess().links || [];
	var downtreeLinks,
		list = $("#tools-list"), 
		result = [],
		scratch = "", 
		id, i, link, path;
	
    downtreeLinks = findDownTreeLinks(id);
    
    // Add links that should always sho
    for (i = 0; i < links.length; i += 1) {
        if ("always" in links[i] && links[i].always) {
            downtreeLinks[i] = true;
        }
    }
    
    downtreeLinks = Object.keys(downtreeLinks);

	for (i =0; i < downtreeLinks.length; i += 1) {
		link = links[downtreeLinks[i]];
		
		// Skip if the link is not found, or doesn't want to be on the leftbar
		if (link === undefined || !link.leftbar) {
		    continue;
		}

	    scratch = buildElement("a", "list-group-item list-group-item-action",
			buildElement("div", undefined,
				buildFA(getIconType(link.dest)),
			 	" ",
			 	link.title
			)
		);
		
        scratch.target = "_blank";		
        		
		if (link.dest.match(RE.howto)) {
		    if (Features.check("hideHowto")) {
		        continue;
		    }
			$(scratch).on("click", showHowto("leftbar"));
		} else if (link.dest.match(RE.legacy)) {
			scratch.href = buildLegacyLink(link.dest);
		} else if (link.dest.match(/^SEES:\/\//)) {
			path = link.dest.substring("SEES://".length);
			scratch = SEES.attachLeftbar(path, link.title);
		} else {
			scratch.href = link.dest;
		}

        if ("order" in link) {
            scratch.datset.order = link.order;
        }

		scratch.dataset.target = link.dest;
        result.push(scratch);		
    }
	
	result.sort(function (a, b) {
		var left = $(a).text().toLowerCase();
		var right = $(b).text().toLowerCase()
	
		if (left < right) {
			return -1;
		} else if (left > right) {
			return 1;
		} else {
			return 0;
		}
	});
	
	if (result.length > 0) {
		list.empty().append(result);
		$("#tools-holder").show();		
	} else {
		$("#tools-holder").hide();
	}	
}

function buildMoreInfoBlock(moreInfo) {
	var block, target, link, i, links = {};
	block = buildElement("div", "list-group");
	
	for (i =0 ; i < moreInfo.length; i += 1) {
		target = getCurrentProcess().links[moreInfo[i]];
		
		if (!(target.dest in links)) {
			link = buildElement("a", "list-group-item border-0 p-0", 
				buildElement("span", undefined, 
					buildFA(getIconType(target.dest)),
					" " + target.title
				)
			);

			link.target = "_blank";
			
			if (target.dest.match(/^[a-z]{3}1\d{4}$/)) {
				// Howto
				link.classList.add("howto");
				link.dataset.target = target.dest;
				$(link).on("click", showHowto("leftbar"));

			} else if (target.dest.match(/^[a-z]{3}[0-9]{5}$/)) {
				link.href = buildLegacyLink(target.dest);
				link.dataset.target = target.dest;
			} else {
				link.href = target.dest;
			}
								
			block.appendChild(link);
			links[target.dest] = true;
		}		
	}
	
	return buildElement("div", "card-block list-group blk-moreinfo",
		buildElement("div", "bs-callout bs-callout-more-info", 
			buildElement("h4", "card-title", "More information"),
			block
		)
	);
}

function updateProgress (id) {
	// Update progress	
	var progress = Math.ceil(getCurrentDepth(id) * 100) + "%";
	
	$("#process-progress-bar").css("width", progress)
	$("#process-progress-text").text("(" + progress + ")");	
}

function addWebchatCopyAll(cardBlock) {

	function _directCopy() {
		$(this).off("click");

		var target = document.getElementById("copy");                
		
	    var webchat = buildElement("div");

        $(cardBlock).find("[data-webchat]").each(function () {
            webchat.appendChild(buildElement("p", undefined, this.dataset.webchat));
        });
			
		replacePlaceholders(webchat, true);
		target.appendChild(webchat );

		setTimeout(function () {
			var selection, range;			
			range = document.createRange();
			range.selectNodeContents(target);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			
			while (target.firstChild) {
			    target.removeChild(target.firstChild);
			}
			
		}, 25);
		
		$(this)
			.tooltip("hide")
			.addClass("flash")
			.on("animationend", function () {
				$(this)
					.removeClass("flash")
					.on("click", _directCopy)
			})
			;
	}	
    var button = buildElement("button", "webchat btn btn-success cmd-webchat-copyAll", 
        buildFA("clipboard"), " all"
    );
    
    $(button).on("click", _directCopy);

    cardBlock.appendChild(buildElement("div", "btn-group btn-group-sm copyAll-holder", button));
}

function addWebchat(index) {

    function _filter(input) {
        var i;
        if (input.hasAttributes()) {        
            while (input.attributes.length > 0) {
                input.removeAttribute(input.attributes[0].nodeName)
            }
        }
        
        for (i = 0; i < input.childNodes.length; i += 1) {
            if (input.childNodes[i].nodeType === 1) { // Elements
                _filter(input.childNodes[i]);
            }
        }        
    }
	
	function _directCopy() {
		$(this).off("click");

		var target = document.getElementById("copy");

        var filtered = $(webchat).clone().get(0);
        
      	_filter(filtered );
		target.appendChild(filtered );

		setTimeout(function () {
			var selection, range;			
			range = document.createRange();
			range.selectNodeContents(target);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			
			target.removeChild(filtered );
			
		}, 25);
		
		$(this)
			.tooltip("hide")
			.addClass("flash")
			.on("animationend", function () {
				$(this)
					.removeClass("flash")
					.on("click", _directCopy)
			})
			;
	}	

	function _addToPanel() {
		var controlButton, menu, button, display;
		showWebchatPanel();
		$(this).tooltip('hide');

		button = buildElement("button", "btn btn-primary", buildFA("trash"));
		button.title = "Delete this line of webchat";
		$(button).on("click", function () {

			var clone = $(webchat).clone().find("i").remove().end().html();
			clone = "<p><span>" + clone + "</span></p>";	
	
			// get data from the editor panel, and replace numeric entities with their charater values
			var editorString = webchatEditor.getData().replace(/&#(\d+);/g, function (x, n) { return String.fromCharCode(parseInt(n, 10)); });
			webchatEditor.setData(editorString.replace(clone, ""));
			$(this).closest(".webchat-item").remove();				
		});

		$("#webchat-text").append(
			buildElement("div", "d-flex justify-content-between align-middle webchat-item", 
				buildElement("div", "webchat-text", $(webchat).clone().get(0)),
				button
			)
		);

		webchatEditor.setData(webchatEditor.getData() + webchat.outerHTML);
	};

	var webchat = this.dataset.webchat;
	var stanzaId = this.dataset.id;
	var result = buildElement("div", "d-inline-flex justify-content-between align-items-middle w-100");

	webchat = buildElement("span", undefined, webchat);
	replacePlaceholders(webchat, true);
	
	var oldContents = buildElement("span");
	
	$(this).contents().each(function () {
		oldContents.appendChild(this);
	});
	
	var group = buildElement("div", "webchat align-items-center btn-group btn-group-sm");
	
	var button = buildElement("button", "btn btn-success cmd-webchat-copy", buildFA("clipboard"));
	button.dataset.toggle="tooltip";
	button.dataset.placement = "left";
	button.title = "Copy '" + webchat.innerText + "' to clipboard";
				
	$(button)
		.on("click", _directCopy)
		.tooltip();
		
	group.appendChild(button);
	
 	button = buildElement("button", "btn btn-success cmd-webchat-add", buildFA("plus"));
	button.dataset.toggle="tooltip";
	button.dataset.placement = "left";
	button.title = "Add '" + webchat.innerText + "' to webchat pannel";
				
	$(button)
		.on("click", _addToPanel)
		.tooltip();
	
	group.appendChild(button);
			
	result.appendChild(oldContents);
	result.appendChild(group);
	
	$(this).append(result);
}

function editAnswers(current) {
	return function () {
		var i, j, labels, id, card, stanza;
		
		// Walk through stanza history until we find 'this' stanza
		// Then walk backwards through the history deleting any
		// cards that we find.
										
		for (i = 0; i < questionHistory.length; i +=1 ) {
			if (questionHistory[i][0] === current) {
				while (questionHistory.length > i) {
					id = questionHistory.pop()[0];
					
					stanza = getStanza(id);
					
					labels = stanza.getLabels();
					for (j = 0; j < labels.length; j += 1) {
						delete customer[labels[j]];
					}
										
					card = $("#" + id);																														
					if (card.length > 0) {
						card.slideUp('fast', (function (y) {
							return function () {
								y.remove() 
							};
						})(card) );
					}
				}
									
				render(current);
				
				$("html, body").animate({
					scrollTop: 0
				}, 400);
				
				break;
			}			
		}
	};	
}

function handleError(state) {
    var errorStanzas = [], i, next, message;
    
    errorStanzas.push({type:"ImportantStanza", text:"Sorry, there is a problem with this process."});
    errorStanzas.push({type:"ImportantStanza", text:"Please use Rate It to tell us about the problem (use 'Hyperlink/Tool not working')."});
    errorStanzas.push({type:"ImportantStanza", text:"Copy the details below into the Rate It, and we'll fix it as soon as we can."});
    errorStanzas.push({type:"ImportantStanza", text:"Thank you."});
            
    if ("error" in state) {
        errorStanzas.push({type:"CopyNoteStanza", text: state.error});
    } else {
        if (state && "stack" in state) {
            message = "Unknown error at stanza " + state.id;
        } else {
            message = "Unknown errror";
        }
        errorStanzas.push({type:"CopyNoteStanza", text: message});
    }
    
    for (i = 0; i < errorStanzas.length; i += 1) {
    
        if (i < errorStanzas.length - 1) {
            next = "error-" + (i + 1);
        } else {
            next = getCurrentProcess().meta.id + "-end";
        }
    
        errorStanzas[i].id = "error-" + i;
        errorStanzas[i].next = [next];
        
        addStanza(errorStanzas[i].id, errorStanzas[i]);
    }

    render("error-0", state);     
}

function prevStanza(state, offset) {
    offset = offset || 1;
    if (state && "stack" in state && state.stack.length >= 2) {
        return state.stack[state.stack.length - offset];
    } else {
        return "Unknown location";
    }
}

function render(id, state, onRender) {
	var stanza, scratch, i, questionDOM, $card, card, cardBody, cardBlock, instructionCount;

	$("html, body").animate({ scrollTop: 0 }, "fast");

	// Hide previous screen (if we've got one)
	if (state !== undefined && "answer" in state) {
		scratch = buildElement("span", "answer", " - ", isDate(state.answer) ? formatDate(state.answer) : state.answer);
		replacePlaceholders(scratch);
		
		$card = $("#holder .card").first();
		$card.find(".card-body").slideUp();
		$card.find(".card-header").slideDown();
		$card.find(".questionHistory").append(scratch);

        if ("history" in state) {
    		questionHistory[questionHistory.length - 1][1] = state.history;
    	}
		
		stanza = getStanza($card.get(0).id);					
		if (stanza.data.label && stanza.getType() !== "sequence") {
			customer[stanza.data.label] = state.answer;
		}
		
		state = undefined;
	}
	
	// ID sanity checks
	if (id === undefined || id === null) {
	    state.error = "Next stanza is missing at " + prevStanza(state);
		id = getProcessId() + "-end";
		handleError(state);
		return;
	} else if (id.match(/^[a-z]{3}[0-9]{5}$/)) {
		// Handle links to other processes
		if (Features.check("modular") && (id.substr(3,1) === "9" || id.substr(3,1) === "7")) {
		    if (stanzaExists(id + "-start")) {
		        // Process has already loaded.
		        id = id + "-start";
		    } else {
    			$.getJSON(buildPath(id))
    				.done(function (process) {
    					console.log("PROCESS LOADED: " + id);
    					handleProcessLoad(process, undefined, onRender);
    				})
    				.fail(function () {
    				    state.error = "Process " + id + " not found at " + prevStanza(state, 2);
					    handleError(state);
					});
				return;
            }
    				
		} else {
			window.location.assign(buildLegacyLink(id));
			// Shoulnd't get called
			return;
		}

	} else if (id.substr(0, 1) === "/") {
		// Handle links to other parts of the platform
		window.location.assign(id);
		return;
	}	

	// Sometimes when we're getting a stack of instructions we
	// have to stop and load a new process. When that happens,
	// we need to keep track of some stuff.
	if (state === undefined) {
		state = {};
		state.start = id;
		state.instructionStack = [];
		state.moreInfo = [];
		state.visited = {};
		state.top = id;
		state.stack = [];
	}
	
	while (true) {
        state.stack.push(id);
	     // Get next stanza
         if (stanzaExists(id)) {
            stanza = getStanza(id);
         } else if (id !== undefined && id.match(RE.ocelot)) {
			if (Features.check("modular")) {
			    if (stanzaExists(id + "-start")) {
			        // Process already loaded
			        stanza = getStanza(id + "-start");
			    } else {
    				// Load the next process. It will call us back later.
    				$.getJSON(buildPath(id))
    					.done(function (process) {
    						console.log("Process " + process.meta.id + " loaded");
    						handleProcessLoad(process, state, onRender);
    					})
    					.fail(function () {
        				    state.error = "Process " + id + " not found at " + prevStanza(state, 2);
    					    handleError(state);
    					});
    				return;
    	        }
			} else {
				console.warn("Link to '" + id + "' in non-modular process at " + stanza.getIdString());
				stanza = getStanza(getProcessId() + "-end");
			}
		} else {
		    state.error = "Next stanza " + id + " not found at " + prevStanza(state, 2);
		    handleError(state);
		    return;
		}			
     
		// Simple loop detection.
		// One of those 'should never happen' things, but maybe an author is testing
		// (Or maybe validation is broken)
		if (stanza.getIdString() in state.visited) {
            state.error = "Loop detected at " + id;
            handleError(state);
            return;
		} else {
			state.visited[stanza.getIdString()] = true;
		}

		// Record this stanza in the history.
		// Histoical note: This used to just be for 'questions'
		questionHistory.push([stanza.getIdString()]);
			
		// Add any more info to the stack
		if ("moreinfo" in stanza.data) {
			state.moreInfo = state.moreInfo.concat(stanza.data.moreinfo);
		}
						
		if (stanza.isQuestion() || stanza.isTerminal()) {
			// Break out of do-while 
			break;
		} else if (Features.check("modular") && stanza.getType() === "module") {
		    // Load the module
			$.getJSON(buildPath(stanza.getModule()))
				.done(function (process) {
					console.log("Module " + process.meta.id + " loaded");
					
					stanza.rewrite(process);
					
					handleProcessLoad(process, state, onRender);
				}).fail(function () {
				    state.error = "Module " + stanza.getModule() + " not found at " + id;
				    handleError(state);
				});				
			return;
		} else if (stanza.getType() === "tool") {
		    if (!Tools.getTool(stanza.data.tool).visible) {
    		    stanza.doOffscreen(function (success) {
    		        if (success) {		    
        		        render(stanza.getNext(0), state, onRender);
        		    } else {
        		        state.error = "Problem running tool " + stanza.data.tool + " at " + id;
        		        handleError(state);  		        		    
        		    }
    		    });
    		    return;
    		}
		}
		
		// Add current stanza to the instruction stack
		if (stanza.hasDisplay()) {
			state.instructionStack.push(stanza);
		}
						
		// get next stanza
		try {
    		id = stanza.getNext(0);
        } catch (x) {
            console.error("Problem getting next stanza", x);
            state.error = "Can't get next stanza at " + id;
            if ("message" in x) {
                state.error += ": " + x.message;
            } else if ("description" in x) {
                state.error += ": " + x.decription;
            }
            handleError(state);
            return;
        }
	}
	
    // Draw the instruction stack
	scratch = buildInstructionList(state.instructionStack);
	
	// If the current stanza wants to be drawn, draw it.
	if (stanza.isQuestion() && stanza.hasDisplay()) {
	    try {
    		questionDOM = stanza.toHTML();
        } catch (x) {
            console.error("Problem drawing stanza", x);
            state.error = "Can't draw stanza at " + id;
            handleError(state);
            return;
        }
        		
		if (questionDOM.classList.contains("action")) {
			scratch.appendChild(buildElement("li", "instruction", questionDOM));
		} else {
			scratch.appendChild(questionDOM);				
		}
	}
	
	// Update counts for tools
	instructionCount = $(scratch).children(".instruction").length;
	$(scratch).find("iframe.tool.inline").each(function () {
		var count = parseInt(this.dataset.count, 10);
		
		if (!isNaN(count)) {
			instructionCount += count;
		}
	});
	
	if (instructionCount === 1) {
		scratch.classList.add("solo");
	}
	
	// Update progress
	if (Features.check("progress")) {
		updateProgress(id);
	}
	
    // Set the title
    updateTitle(state.top.substring(0,state.top.indexOf("-")));
	
	// Start building DOM objects
	// Card is the outermost element (the 'screen')
	card = buildElement("div", "card mb-3 question-block");
	card.id = stanza.getIdString();
	card.dataset.from = state.start;

    // cardBlock holds the drawn stanzas
	cardBlock = buildElement("div", "card-block process", scratch);	

	// Add webchat
	var $webchats = $(cardBlock).find("[data-webchat]");	
	if ($webchats.length > 0) {
    	$webchats.each(addWebchat);
    	if ($webchats.length > 1) {
    	    addWebchatCopyAll(cardBlock);
    	}
    }
    
	// Record this screen in the hash
	if (Features.check("histManager")) {
		setHash(historyToHash(), id);
	} else {
		setHash(historyToHash());
	}
	
	// Log screen hit, if animation is on.
	// If animation is off, assume that we're reloading, and so don't want to log
	// intermediate steps. The restore function takes care of logging.
	if (Features.check("stats") && !$.fx.off) {
		Stats.log(buildStatsUrl());
	}

	if (stanza.hasAnswers()) {		
		// Draw the header that shows once the user has answered the question
	
		scratch = buildElement("div", "questionHistory", stanza.getText());
		scratch.dataset.id = stanza.getIdString();
	
		card.appendChild(
			buildElement("div", "card-header collapse card-answer cmd-edit",
				buildElement("div", "d-flex justify-content-between", 
					scratch,
					buildElement("button", "btn btn-primary", buildFA("pencil")	)
				)
			)
		);


		// The 'edit this answer' button
		$(card).on("click", ".cmd-edit", editAnswers(state.top));

		// Build the list of answers
		scratch= buildElement("div", "list-group list-group-flush");
		scratch.id = 'ans' + id;

		for (i =0 ; i < stanza.getAnswerCount(); i += 1) {
			scratch.appendChild(stanza.getAnswer(i));
		}
		
		// add it to the screen
		cardBlock.appendChild(scratch);

        // Add more info (if we've got any)
		if (state.moreInfo.length > 0) {			
			cardBlock.appendChild(buildMoreInfoBlock(state.moreInfo));
		}

		// A parent for all the bits we want to hide once we're done with this question
		cardBody = buildElement("div", "card-body collapse show");
		cardBody.appendChild(cardBlock);
		card.appendChild(cardBody);
		
		// Replace placeholders
		replacePlaceholders(card);
		
		// Add keyboard navigation
		if (Features.check("keyboardNavigation")) {
			KeyHandler.addTags(card);
		}
								
		if (id !== 'start') {
			// Fancy animation most of the time...
			
			$(card).hide();	
			$("#holder").prepend(card);
			$(card).slideDown('fast');
		} else {
			// Except we want to get the first card up on screen
			// as soon as possible.
			
			$("#holder").prepend(card);
		}
		
		// Set focus on the first input/select found (if there is one)
		// (Once everything has had time to actualy render)
		setTimeout(function () {
			$(card).find("input.focus, select.focus").focus();
		}, 25);
		
		// Update tools/links on the leftbar
		updateLeftbar(state.start);		
	} else if (!stanza.isTerminal()) {
		// Don't have any answers to show, but we've got a next card.
		// Not sure when this is called.
		
        // Add drawn stanzas to screen
		card.appendChild(cardBlock);
		
		// replace placeholders with their values
		replacePlaceholders(card);
		
		// Add keyboard navigation
		if (Features.check("keyboardNavigation")) {
			KeyHandler.addTags(card);
		}
		
		// Add card to the dom
		$(card).hide();
		$("#holder").prepend(card);.0
		$(card).slideDown('fast');
		
		// Update tools/links on the leftbar
		updateLeftbar(state.start);						
		
		// Draw the next stanza
		render(stanza.getNext(0), undefined, onRender);
		return;
	} else {
		// Terminal stanza. End of process.
		
		// Add more info
		if (state.moreInfo.length > 0) {
			cardBlock.appendChild(buildMoreInfoBlock(state.moreInfo));
		}

        // Add drawn stanzas to screen and replace placeholders
		card.appendChild(cardBlock);
		replacePlaceholders(card);
		
		// Add keyboard navigation
		if (Features.check("keyboardNavigation")) {
			KeyHandler.addTags(card);
		}
		
		// Add Thumbs html and button listeners	
		$(card).append(addThumbs());		
		addThumbListeners(card);
		
        // Draw 'End of this process' 	
		$(card).append(buildElement("div", "card-footer",
			buildElement("p", "card-text process-end",
				buildElement("strong", undefined, "End of this process")
			)
		));
	    
	    // Add the card to the dom
		$(card).hide();
		$("#holder").prepend(card);
		$(card).slideDown('fast');
		
		// Update the leftbar
		updateLeftbar(state.start);
	}
	
	// After all that, if we were passed an 'onrender' function, use it.
	if (onRender !== undefined && typeof onRender === "function") {
		onRender();
	}
}


function historyToHash() {
	var i;
	var result = "";
	for (i = 0; i < questionHistory.length; i += 1) {
		if (questionHistory[i].length === 2) {
			if (result.length > 0) {
				result += "-";
			}
			
			result += questionHistory[i][1];
		}	
	}
	return result;
}

function restoreFromHash(hash) {
	var answers, question, answer, current, i;
	
	answers = hash.split("-").map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x)});

	// Rememebr the state of JQuery animations, and then disable them
	var oldFX = $.fx.off;
	$.fx.off = true;

    var last = getStanza(getCurrentProcess().meta.id + "-start");
    var index = 0;
    
    function _nextNEw() {
        if (index < answers.length) {
        
            while (last.data.next.length === 1) {
                last = getStanza(last.data.next[0]);
            }
            
            if (last.data.next.length === 0) {
                // reached an end, shouldn't happen
                index = answers.length;
                _next();
                return;
             }
            
            last.replay(answers[index], function () {
                console.log(last, index);
                last = getStanza(last.getNext(answers[index]));
                index += 1;
                _next();
            });
        } else {
    		if (Features.check("stats")) {
				// Log pageload once the history has been replayed
				Stats.log(buildStatsUrl());
			}
			// Restore animation state
			$.fx.off = oldFX;
        }
    }

	function _next() {
		var id, stanza;
		    	
		if (answers.length > 0) {
			// Check if the stanza has a "replay" function			
			id = $("#holder > .card").first().find(".cmd-answer").closest(".card").get(0).id;
		
			stanza = getStanza(id);
			if ("replay" in stanza) {
				stanza.replay(answers.shift(), _next);
			} else {																		
				// Deep breath....
				// $("#holder > card"):  Find all the .card children of #holder 
				// first(): Take the first one
				// find(".cmd-answer"): Find all the .cmd-answer decendents
				// eq(pairs.shift()): Find the answer with the number at the start of the list.
				// trigger("click"): Fake a button push on the answer
				//
				//  Or, find the answer on the first card which matches the answer from history
				//      and then click it
				// 
				// After that, wait for the animations to finish, and trigger the same thing again
												
				$("#holder > .card").first().find(".cmd-answer").eq(answers.shift()).trigger("click");
				$(":animated").promise().done(function () { setTimeout(_next, 25); });						
			}
		
		} else {
			if (Features.check("stats")) {
				// Log pageload once the history has been replayed
				Stats.log(buildStatsUrl());
			}
			$.fx.off = oldFX;
		}
	}
	
		// Draw the first stanza
	if (!Features.check("histManager")) {
		render(getProcessId() + "-start", undefined, _next);
	} else {
		if (history.state === null || history.state.stanzaId === undefined) {
		render(getProcessId() + "-start", undefined, _next);
		}
	}
	
}

function hardReset() {
	customer = {};
	clear("holder");
	questionHistory = [];
	if (Features.check("histManager")) {
		histManager.setInHistory(true);
		setHash("");
		render(getProcessId() + "-start");		
		histManager.setInHistory(false);
	} else {
		setHash("");
		render(getProcessId() + "-start");
	}

	$("body").removeClass("waiting");
}


function reset() {
	customer = {};
	clear("holder");
	questionHistory = [];

	if (Features.check("histManager")) {
		histManager.setInHistory("true");
	}
			
	if (window.location.hash) {
		restoreFromHash(window.location.hash.substring(1));
	} else {	
		render(getProcessId() + "-start");
	}

	if (Features.check("histManager")) {
		histManager.setInHistory("false");
	}
	
	$("body").removeClass("waiting");	
}

function setupWebchatPanel() {

	CKEDITOR.replace("webchat-edit", {
		removePlugins: "toolbar",
		allowedContent: true,
		keystrokes: []
	});
	
	webchatEditor = CKEDITOR.instances["webchat-edit"];

	function _cmdCopyClick() {
		var range, selection, target;
		$(this).off("click");
		
		var text = "";

		target = document.getElementById("copy");
		text = webchatEditor.getData();
		// Copy to clipboard stuff
		var textarea = buildElement("div", undefined, inflateHTML(text));
		target.appendChild(textarea);

		setTimeout(function () {
			range = document.createRange();
			range.selectNodeContents(target);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			
			textarea.parentNode.removeChild(textarea);
			
		}, 25);
		
		$(this)
			.tooltip("hide")
			.on("animationend", function () {
				$(this)
					.removeClass("flash")
					.on("click", _cmdCopyClick)
			})
			.addClass("flash");
	}


	$(".cmd-webchat-copy").on("click", _cmdCopyClick);

	$(".cmd-webchat-clear").on("click", function () {
		$(this).closest(".card").find(".webchat-item").remove();
		//		$("#webchat-edit").val('');
		webchatEditor.setData("");
	});
	
	$(".cmd-webchat-hide").on("click", hideWebchatPanel);
}

function findMaxDepth(id, depth, parents) {
	var stanza, i, maxDepth = 0, nextDepth, next;
	
	if (id.indexOf("end") !== -1 || id === "" || !stanzaExists(id)) {
		return depth;
	}
	
	if (parents === undefined) {
		parents = [];
	}
	
	stanza = getStanza(id);
	
	if ("next" in stanza.data) {
		for (i = 0; i < stanza.data.next.length; i += 1) {
			next = "from" in stanza.data ? stanza.data.next[i][stanza.data.from.length] : stanza.data.next[i];
			
			if (!(next in arrayToHash(parents))) {
				parents.push(id);
				nextDepth = findMaxDepth(next, stanza.isQuestion() ? depth + 1 : depth, parents);
			}
			
			if (nextDepth > maxDepth) {
				maxDepth = nextDepth;
			}		
		}
	}
	
	return maxDepth;
}

function getCurrentDepth(id) {
	var depth = findMaxDepth(id, 0);
	
	if (depth === 0) {
		return 1;
	} else {
		return 1 -  (findMaxDepth(id, 0) / findMaxDepth(getProcessId() + "-start", 0));
	}
}

function addCssFile(target) {
	var link = buildElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = target;
	
	document.head.appendChild(link);
}

function showColorModal() {
    function _setScheme($target, index) {
        var i, scheme;                                              
        for (i = 0; i < schemes.length; i +=1 ) {
            scheme = schemes[i];
            if (i === index) {
                $target.addClass(scheme.class);
            } else {
                $target.removeClass(scheme.class);
            }
        }
    }
    
    function _getScheme($target) {
        var i, scheme;                                              
        for (i = 0; i < schemes.length; i +=1 ) {
            scheme = schemes[i];
            if ($target.hasClass(scheme.class)) {
                return i;
            }
        }
        return undefined;
    }
        
    var schemes = [
        {name: "Default", class: "scheme-0"},
        {name: "Colour-blind Friendly", class:"scheme-3"},
        {name: "Purple/Orange",         class:"scheme-1"},
        {name: "Blue/Red",              class:"scheme-2"},
        {name: "Yellow/Red",            class:"scheme-4"},
        {name: "Yellow/Red Clean",      class:"scheme-5"}
    ];

    var body, stanzas = [], i, option, s, modal, button, scratch, iframe, schemeWasSet = false;
    
    // Sigh. If we've got a current scheme set on body, turn it off for the moment,
    // otherwise we get into trouble with the demo.
    var current = _getScheme($("body"));
    if (current !== undefined) {
        $("body").removeClass(schemes[current].class);    
    }
    
    body = buildElement("div", undefined,
        buildElement("p", undefined, "You can choose a color scheme for processes. Note that if you clear your cookies this setting will be forgoten.")    
    );
    
    // Build the spinner with the list of options
    var select = buildElement("select", "form-control sel-color-scheme");
    for (i = 0; i < schemes.length; i += 1) {
        s = schemes[i];
        option = buildElement("option", undefined, s.name);
        option.value = i;
        if (current === i) {
            option.selected = true;
        }
        select.appendChild(option);    
    }
    body.appendChild(buildElement("div", "form-group", select));
    
    // This is a bit of a cheat. It builds up a very short process
    // and uses that to demo the colors
    
    stanzas.push(buildStanza("color-1", {type:"NoteStanza",      text:"Example text", id: 'color-1', next:["color-2"] }));
    stanzas.push(buildStanza("color-2", {type:"ImportantStanza", text:"Example text", id: 'color-2', next:["color-3"] }));
    stanzas.push(buildStanza("color-3", {type:"YourCallStanza",  text:"Example text", id: 'color-3', next:["end"]     }));  
    
    var bodyClass = "color-example";
    if (current !== undefined) {
        bodyClass += " " + schemes[current].class;
    }
    
    body.appendChild(
        buildElement("div", bodyClass,
            buildElement("div", "color-example",
                buildElement("h2", undefined, "How things will look"),
                buildInstructionList(stanzas)
            )
        )
    );
    
    // Delete the temp stanzas now that we've used them.
    for (i = 0; i < stanzas.length; i += 1) {
        deleteStanza(stanzas[i]);
    }
    
    button = buildElement("button", "btn btn-primary cmd-color-set", "Set Palette");
    button.dataset.dismiss = 'modal';
            
    modal = $(buildModalFramework({
        title:"Pick Color Palette",
        body: body,
        size: 'lg',
        buttons: button,
    }))
        .on("hidden.bs.modal", function () { $(this).remove(); })
        .on("hide.bs.modal", function () {
            // Restore the current scheme if one was set, and a 
            // new one wasn't chosen
            if (current !== undefined && !schemeWasSet) {
                _setScheme($("body"), current);
            }
        })
        .on("change", ".sel-color-scheme", function () {
            // Update the demo when the spinner changes
            
            var index = parseInt(this.value, 10);
            _setScheme(modal.find(".color-example"), index);                        
        })
        .on("click", ".cmd-color-set", function () {
            // Set the scheme permanantly if selected
        
            var index = parseInt(modal.find(".sel-color-scheme").val(), 10);
            _setScheme($("body"), index);
            
            var scheme = schemes[index];
            userprefs.put("user.color-scheme", scheme.class);            
            schemeWasSet = true;
        })        
        .modal("show");

}

function findLabels() {

    var queue = [getCurrentProcess().meta.id + '-start'], visited = {}, found = {}, next, stanza, i, scratch, label;
    
    function addToFound(l, s) {
        if (!(l in found)) {
            found[l] = {};
        }
        found[l][s] = true;    
    }
    
    while (queue.length > 0) {
        next = queue.shift();
        
        if (next === undefined || !stanzaExists(next) || next in visited) {
            continue;
        }
        
        stanza = getStanza(next);
        visited[next] = true;
        
        if ("label" in stanza.data) {
            label = stanza.data.label;
            
            addToFound(label, next);
        }
        
        // Special cases for some stanza types
        switch (stanza.getType()) {
            case "sequence":
                if ("label" in stanza.data) {
                    label = stanza.data.label + "_seq";
                    addToFound(label, next);
                }
                break;
            case "tool":
                if ("sets" in stanza.data) {
                    for (i = 0; i < stanza.data.sets.length; i += 1) {
                        label = stanza.data.sets[i];
                        addToFound(label, next);
                    }
                }
                break;
        }
       
        if ("next" in stanza.data) {
            for (i = 0; i < stanza.data.next.length; i += 1) {
                if ("from" in stanza.data) {
                    queue.push(stanza.data.next[i][stanza.data.from.length]);
                } else {
                    queue.push(stanza.data.next[i]);
                }
            }
        }
    }

    return found;
}

function buildInputGroup(param) {
    var input, result, addon;

    input = buildElement("input", "form-control");
    
    if (!("id" in param)) {
        param.id = "x" + Date.now();
    }
    
    input.id = param.id;
    
    if ("type" in param) {
        input.type = param.type;
    } else {
        input.type = "text";
    }
    
    if ("required" in param) {
        input.required = true;
    }
    
    if ("pattern" in param) {
        input.pattern = param.pattern;
    }
        
    if ("classes" in param) {
        param.classes
            .split(/\s+/)
            .filter(function (x) { return x.length > 0})
            .map(function (x) { input.classList.add(x) });
    }
    
    result = buildElement("div", "input-group mb-3");
    
    if ("label" in param) {
        addon = buildElement("span", "input-group-addon", param.label);
        addon.id = param.id + "-addon";
        input.setAttribute("aria-describedby", addon.id);
        result.append(addon);
    }
    
    result.append(input);

    return result;
}

function setLabel() {

    var body = buildElement("div", undefined,
        buildElement("p", undefined, "Set an arbitary label"),
        buildInputGroup({classes: "ipt-label-name", label: "Label name", required: true}),
        buildInputGroup({classes: "ipt-label-value", label: "Label value", required: true})
    );
    
    var button = buildElement("button", "cmd-label-set btn btn-primary", "Set");
    button.dataset.dismiss = "modal";
    
    var modal = $(buildModalFramework({
            body: body,
            title: "Set label value",
            buttons: button
        })).on("hidden.bs.modal", function () { $(this).remove(); })
            .on("click", ".cmd-label-set", function () {
                var name = modal.find(".ipt-label-name").val();
                var value = modal.find(".ipt-label-value").val();
                
                if (name.length > 0) {
                    if (value.length > 0) {
                        customer[name] = value;
                    } else {
                        delete customer[name];
                    }
                }
            })
        .modal("show");
}

function viewLabels() {
    var value, i, body, key;
    var fromAuthors = findLabels();

    var keys = Object.keys(Object.assign({}, customer, fromAuthors)).sort();
    
    function _formatValue(value) {                    
		if (isDate(value)) {
			return formatDate(value);
		}
        return value;
    }
    
    function _formatList(stanzas) {
        var result = "", i, list;
        
        list = Object.keys(stanzas).sort(idSort);
        
        for (i =0 ; i < list.length; i += 1) {
            if (i > 0) {
                result += ", ";
            }
            result += list[i];
        }
        
        return result;
    }
        
    if (keys.length > 0) {
        body = buildElement("tbody");
        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];
    	    	    	
            body.appendChild(
                buildElement("tr", undefined,
                    buildElement("td", undefined, key),
                    buildElement("td", undefined, key in customer ? _formatValue(customer[key]) : "-"),
                    buildElement("td", undefined, key in fromAuthors ? _formatList(fromAuthors[key]) : "-")                
                )
            );
        }
        
        body = buildElement("table", "table table-sm table-hover",
            buildElement("thead", undefined,
                buildElement("th", undefined, "Label"),
                buildElement("th", undefined, "Value"),
                buildElement("th", undefined, "Stanzas")
            ),
            body
        );
    } else {
        body = buildElement("p", undefined, "This process doesn't seem to use labels");
    }
    
    var modal = $(buildModalFramework({
            body: body,
            size: "lg",
            title: "Known labels",
        })).on("hidden.bs.modal", function () { $(this).remove(); })    
        .modal("show"); 
}

function addPreviewTools() {

    function _buildLink(title, fn) {
        var link = buildElement("a", "dropdown-item", buildFA("angle-right"), title);
        link.href = "#";
        link.onclick = function (e) {
            e.preventDefault();
            fn();
        }
        return link;
    }

    var button, outerMenu, innerMenu;

    button = buildElement("button", "btn btn-secondary btn-nav dropdown-toggle", buildFA("cog"));
    button.type = "button";
    button.id = "previewTools";
    button.title = "Tools for Authors";
    button.dataset.toggle = "dropdown";
    button.setAttribute("aria-haspopup", true);
    button.setAttribute("aria-expanded", false);
        
    innerMenu = buildElement("div", "dropdown-menu");
    innerMenu.setAttribute("aria-labledby", button.id);
        
    innerMenu.appendChild(_buildLink("View labels", viewLabels));
    innerMenu.appendChild(_buildLink("Set a label", setLabel));
    
    outerMenu = buildElement("div", "dropdown mr1",
        button,
        innerMenu
    );

    $("#navbarColor01 > .navbar-nav").append(outerMenu);
}

function removePreviewTools() {
    $("#previewTools").remove();
}

function getPageName() {
    var path = location.pathname;
    
    return path.substring(path.lastIndexOf("/") + 1);
}

function updateNavbar() {

    function _drawNavbarRight() {
    
        var legacyLink = buildElement("a", "btn btn-secondary btn-nav cmd-legacy-process mr-1", "Legacy process");
        legacyLink.style.display = "none";
        
        var dropdownButton = buildElement("button", "btn btn-secondary btn-nav dropdown-toggle", buildFA("cog"));
        dropdownButton.id = "navSettings";
        dropdownButton.type = "button";
        dropdownButton.title = "User Settings";
        dropdownButton.dataset.toggle = "dropdown";
        dropdownButton.setAttribute("aria-haspopup", true);
        dropdownButton.setAttribute("aria-expanded", false);
        
        var dropdownMenu = buildElement("div", "dropdown-menu dropdown-menu-right");
        dropdownMenu.setAttribute("aria-labledby", dropdownButton.id);
        
        var colorMenuItem = buildElement("a", "dropdown-item click-target cmd-colors",
            buildFA("angle-right"),
            "Choose colors"
        );
        colorMenuItem.href = "#";
        
        dropdownMenu.appendChild(colorMenuItem);
        
        var dropdown = buildElement("div", "dropdown mr-1 settings-menu",
            dropdownButton,
            dropdownMenu
        );
        dropdown.style.display = "none";
            
        return buildElement("div", "navbar-right",
            buildElement("div", "collapse navbar-collapse", 
                buildElement("form", "form-inline",
                    legacyLink
                ),    
                dropdown
            )
        );
    }

    $("#navbar-top").append(_drawNavbarRight());
}


$(function () {
	
	function _missingOrInvalidProcess() {
		$("#holder").html("<p>Missing process. Have you tried <a href='?p=nes90006'>our demo process?</a></p>");	
		$("body").removeClass("waiting");
	}
	
	console.log("Hello, and welcome to Ocelot!");
    
    if (getPageName() !== "process.htm") {
	    // This script is also loaded by the howto editor, and I don't want it 
	    // running this onload stuff.
	    return;
	}
	            
    setupWebchatPanel();
    updateNavbar();
		
	if (Features.check("keyboardNavigation")) {
		$(document).on("keydown", KeyHandler.handler);
	} else {
		$(document).on("keydown", simpleKeyHandler);
	}
	
	if (Features.check("noteIcons")) {
		addCssFile("override.css");
	}
	
	if (!Features.check("contactMenu")) {
		$(".contact-menu").hide();
	}
	
	if (Features.check("histManager")) {
		histManager.init();
	}
	
	if (Features.check("colours")) {
	    $(".settings-menu").show();
	    $(".cmd-colors").on("click", showColorModal);
	    var scheme = userprefs.get("user.color-scheme");
	    if (scheme !== undefined) {
	        $("body").addClass(scheme);
	    }
	}
	
    // Add global event listenrs
    $(".cmd-reset").on("click", hardReset);		
	$(".rate-it-help").on("click", showRateItHelp);
	
	// Handle navbar popups
	$('body').on('click', '.ocelot_popup', showPopup);
	
	// Show a spinner
	$("body").addClass("waiting");

	var param = getParam();
	var id, path;

    // Check if we've been passed a process id
	if ("p" in param) {
		id = param.p;
		
		// Check if it looks valid
		if (!id.match(RE.extended)) {
			_missingOrInvalidProcess();
			return;
		}
		
		if (id.indexOf("_") !== -1) {
			// Demo process. Switch into preview mode
			$("body").addClass("preview");
			addPreviewTools();
		}
		
		if (id.substring(0, 3) === "dmg") {
		    // Special case - dmg don't get the contact 
			$("#navMainContact").hide();
		}
	    
	    // Load the process
		loadNewProcess(id);			
	} else if ("preview" in param && window.opener) {
	    // No process id, but we've been opened from the editor
	    
	    // Mark us as in preview mode
		$("body").addClass("preview");
        addPreviewTools();			
		
		if (Features.check("voiceId")) {
			initialLoad(window.opener.buildFromLive());
		} else {
		    // Load the process from the editor
			handleProcessLoad(window.opener.buildFromLive());
		}
		window.focus();
	} else {
		_missingOrInvalidProcess();
	}
});

