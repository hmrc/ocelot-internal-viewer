"use strict";

/**
 A bunch of stuff used by both the author and the adviser front ends.
 */

var RE = {
    extended: /^(([a-z]{3})\d{5})(?:(?:\.(\d+))(?:(?:\.(\d+))?)|(?:_([a-zA-Z0-9_-]+))|(\.autosave))?$/,
    ocelot: /^[a-z]{3}[789]\d{4}$/,
    ocelot_endless: /^[a-z]{3}[789]\d{4}/,
    howto: /^[a-z]{3}1\d{4}$/,    
    legacy: /^[a-z]{3}\d{5}$/
};

var types = {}, processStack, phrasebook = [];
var bullet = '<i class=" fa fa-arrow-circle-right" aria-hidden="true"></i>'
var questionHistory = [];
var builtStanzas = {};
var customer = {};

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// IE polyfil for Object.assign
// From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// IE Polyfil for String.endsWith
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
        return this.substring(this_len - search.length, this_len) === search;
	};
}

function countDigits(number) {
	if (number >= 100) {
		return 3;
	} else if (number >= 10) {
		return 2;
	} else {
		return 1;
	}
}

var Tools = (function () {
	
	var tools = {};
	var loaded = false;
	var onLoads = [];
	var source;
	var fromAsp = false;
	
	if (window.location.pathname.indexOf("tools") !== -1) {
		source = "../tools.asp";
		fromAsp = true;
	} else if (window.location.pathname.indexOf("system") !== -1) {
	//    source = "tools.asp";	    
	    source = "tools/index.js";
	} else if (window.location.pathname.indexOf("editors") !== -1) {  	
		source = "../../system/ocelot/tools.asp";
		fromAsp = true;
	} else {
		source = "../../system/ocelot/tools/index.js";
	}

    function _load() {
        return $.getJSON(source)
        	.done(function (json) {
        		if (fromAsp && "success" in json) {
        			tools = json.success;
        		} else if (!fromAsp) {
        		    tools = json;
        		}
        		
        		loaded = true;
        		var i;
        		for (i = 0; i < onLoads.length; i += 1) {
        			onLoads[i]();						
        		}
        	})
        	.fail(function (jqxhr) {
        		throw new Error("Can't get tools database from " + source);
        	});
    }
	
	return {
		onLoad: function (callback) {
			if (!loaded) {
				onLoads.push(callback);
			} else {
				callback();
			}
		},
		hasLoaded: function () {
			return loaded;
		},
		
		getTools: function () {
			return tools;
		},
		
		getTool: function (id) {
			return tools[id];		
		},
		
		toolExists: function (id) {
			return id in tools;
		},
		
		load: _load
	};
})();

function decryptProcess(password, process) {
    var key, secure;
    if ('sjcl' in window) {
        secure = JSON.parse(sjcl.decrypt(password, JSON.stringify(process.secure)));
        
        delete process.secure;
        for (key in secure) {
            process[key] = secure[key];
        }
    } else {
        console.error("Can't decrypt process, sjcl library not loaded. Check your <scripts>");
    }
}

function formatDate(date) {		
	return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
}

function escapeHTML(text) {
	if (text === undefined || text.length === 0) {
		return "";
	}
	return text.replace(/[\"&<>]/g, function (c) {
        return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
}

function renameNode(oldNode, name) {
	var newNode = buildElement(name);
	var i;
	
	for (i = 0; i < oldNode.attributes.length; i += 1) {
		newNode.setAttributeNode(oldNode.attributes[i].cloneNode(true));
	}
	
	while (oldNode.firstChild) {
		newNode.appendChild(oldNode.firstChild);
	}
	
	oldNode.parentNode.replaceChild(newNode, oldNode);
}

// From http://stackoverflow.com/a/1395954
function decodeHTML(encodedString) {
	var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}

function inflateHTML(htmlString) {
	var div = buildElement("div");
	div.innerHTML = htmlString;
	return div;
}

function inflateHTMLInto(target, htmlString) {
	var div = buildElement("div");
	div.innerHTML = htmlString;
	while (div.firstChild) {
		target.appendChild(div.firstChild);	
	}
	return target;
}


function textNode(text) {
	return document.createTextNode(text);
}

function getCurrentProcess() {
	return processStack;
}

function isWebchat() {
	return $("body.webchat").length > 0;
}

function buildFA(options) {
    
    // Most buildFA calls are expecting old style 'buildFA(name[, title])'
    // so cope with that
    if (typeof options === "string") {
        options = {name: options};
        if (arguments.length === 2) {
            options.title = arguments[1];
        }
    } else if (typeof options === "undefined") {
        options = {};
    }

    var i =  buildElement("i", "fa fa-fw");
	i.setAttribute("aria-hidden", "true");
	
	if ("name" in options) {
        i.classList.add("fa-" + options.name);	
	}
	
    if ("size" in options) {
        i.classList.add("fa-" + options.size + "x");
    }
    
    if ("title" in options) {
        i.title = options.title;
    }
    
	return i;
}

function getAnswerFromQuestionHistory(qId) {
	var i;
	for (i = 0; i < questionHistory.length; i += 1) {
		if (questionHistory[i][0] === qId) {
			return questionHistory[i][1];
		}
	}
	return undefined;
}	

function getPhrase(phraseId) {
	var webchat;
	if (phraseId === undefined || phraseId === "") {
		return "";
	} else if (phraseId === "-1") {
		return "Missing text";
    } else if (typeof phraseId === "string") {
        return phraseId;
	} else {
		return phrasebook[phraseId];
//		return getCurrentProcess().phrases[phraseId];
	}
}

/**
	Lookup a string in the phrasebook, and return its ID.
	Will add the string to the phrasebook if it can't find it.
 */
function getPhraseId(phrase) {
	var i;
		
	var phraseList = getCurrentProcess().phrases;
	
	for (var i = 0; i < phraseList.length; i += 1) {
		if (typeof phraseList[i] === "string") {
			// Don't fold this up into a single if statement. I tried that,
			// and the else below caught single letter phrases with the first
			// letter the same as an existing phrase.
			if (phraseList[i] === phrase) {
				return i;
			}
		} else if (phraseList[i][0] === phrase) {
			return i;
		}
	}
	getCurrentProcess().phrases.push(phrase);
	return getCurrentProcess().phrases.length - 1;
}

function changePhrase(id, phrase) {
	getCurrentProcess().phrases[id] = phrase;
}

function replaceStanza(id, stanza) {
	getCurrentProcess().flow[id] = stanza;
}

function buildTabId(stanza, name) {
	return "t" + stanza.getIdString() + "-tab-" + name.toLowerCase().replace(/[^a-z]/g,'');
}

/**
	Return the next unused stanza id.
	'Unused' in this context means doesn't appear in a 'id' property, or in a 'next' list.
 */

function getNextId() {
	var id = 1, idString, used;
	
	while (true) {
		idString = id.toString();
		if (!stanzaExists(idString)) {
			used = false;
			forAllStanzas(function (stanza) {
				var i;
				if (!("next" in stanza.data)) {
					return;
				}
				
				var children = stanza.getChildren();
				
				for (i = 0; i < children.length; i += 1) {
					if (children[i] === idString) {
						used = true;
						return;
					}				
				}				
			});
		
			if (!used) {
				return idString;
			}
		}
		id += 1;			
	}	
}

/** 
  This defines the parent Stanza type. Should never be instanced directly.
  
  It's got sensible defaults for most methods.
  
  */

types.Stanza = function Stanza(id, stanza) {
	stanza.id = id;
	this.data = stanza;
};

types.Stanza.prototype = {

	/**
		Return the type of this Stanza, as a string.
		Must be overridden by sub-types
	 */
	getType: function () {
		throw new Error("getType not overriden");
	},

	/**
		Return true if this stanza has answers, false otherwise.
		Not quite the same thing as 'isQuestion'
	 */
	hasAnswers: function () {
		return this.data.answers !== undefined;
	},

	/**
		Are we looking at a leaf node? True only for 'End' types.
	 */
	isTerminal: function () {
		return false;
	},

	/**
	  Is this stanza a question?
	  */
	isQuestion: function () {
		return false;
	},
	
	/* Should this stanza stack?
	 */
	isStacked: function () {
		if ('stack' in this.data) {
			return this.data.stack;
		} else {
			return false;
		}
	},
	
	/**
	  Does this stanza have complex routing?
	  */
	hasRouting: function () {
		return ("from" in this.data);
	},

	/**
	 Does this stanza have any display?
	 */
	hasDisplay: function () {
		return true;
	},
	
	/**
      Does this stanza have a label?
      */
	hasLabel: function () {
	    return "label" in this.data && this.data.label !== undefined && this.data.label.length > 0;	
	},
	
	/** 
		Does this stanza draw itself?
	*/
	isSelfRender: function () {
		return false;
	},
	/** 
		Does this stanza have a webchat version?
	*/
	hasWebchat: function () {
		// Webchat data is stored as an array in phrasebook
		// If the phrase is not a string, then we've got webchat
		return typeof getPhrase(this.data.text) !== "string";
	},

	/**
		Returns a string sutable to be used as a HTML id.
	 */
	getIdString: function () {
		return this.data.id;		
	},
	
	/** Get names of labels set, or empty list */
	getLabels: function () {
		if ("label" in this.data) {
			return [this.data.label];
		} else {
			return [];
		}
	},
	
	/**
		Returns the text of this stanza, as a string
	 */
	getText: function () {
		var phrase;		
		if (typeof this.data.text === "number") {
			phrase = getPhrase(this.data.text);
			if (typeof phrase === "string") {
				return phrase;
			} else {
				return phrase[0];
			}
		} else {
			return this.data.text;
		}
	},
	
	/**
		Return the webchat version of this stanza, as a string.
		If there isn't a webchat version, return the regular version
	*/
	getWebchat: function () {
		var phrase;		
		if (typeof this.data.text === "number") {
			phrase = getPhrase( this.data.text);
			if (typeof phrase === "string") {
				return phrase;
			} else {
				return phrase[1];
			}
		} else {
			return this.data.text;
		}
	},
			
	/**
		Returns the id of the next stanza after this one.
		I think this method tries to do too many things.
	  */
	getNext : function (index) {
		var i, j, match, answers = [];
		if (this.hasRouting()) {
			for (i = 0; i < this.data.from.length; i += 1) {
				if (this.data.from[i] === this.data.id) {
					answers.push(index);
				} else {
					answers.push(getAnswerFromQuestionHistory(this.data.from[i]));
				}
			}

			for (i = 0; i < this.data.next.length; i += 1) {
				match = true;
				for (j = 0; j < this.data.from.length; j += 1) {
					if (this.data.next[i][j] !== -1 && this.data.next[i][j] !== answers[j]) {
						match = false;
					}
				}
				if (match) {
					return this.data.next[i][this.data.from.length ];
				}
			}
			
			return "";
		} else if ("next" in this.data) {
			return this.data.next[index];
		} else {
			return "";
		}
	},

	/**
	 	Returns a list of ids of stanzas that follow this one.
	 	May return an empty list.
	  */
	getChildren : function () {
		var next, result, i;
	
		if (this.isTerminal() || !("next" in this.data)) {
			return [];
		}


		result = {};			
		if (this.hasRouting()) {

			for (i = 0; i < this.data.next.length; i += 1) {
				next = this.data.next[i][this.data.from.length];
				
				if (next !== undefined && next !== "") {
					result[next] = true;
				}
			}
		
		} else {

			for (i = 0; i < this.data.next.length; i += 1) {
				next = this.data.next[i];
				
				if (next !== undefined && next !== "") {
					result[next] = true;
				}
			}
		}
		
		return Object.keys(result).sort(idSort);			
	},
	
	/**
		Returns a list of ids of stanzas that lead directly to this one.
	 */
	getParents: function () {
		var parents = {}, myId;

		myId = this.data.id;
		
		forAllStanzas(function (stanza) {
		    var i, next;
		    if ("next" in stanza.data) {
		        for (i = 0; i < stanza.data.next.length; i += 1) {
		            if (stanza.hasRouting()) {
		                next = stanza.data.next[i][stanza.data.from.length];
		            } else {
		                next = stanza.data.next[i];
		            }		        
    		        if (next === myId) {
    		            parents[stanza.data.id] = true;
    		            return;
    		        }
    		    }
		    }
		});
		
		return Object.keys(parents).sort(idSort);
	},
		
	getDefaultTabs : function () {
		var tabs = [this.buildHowtoTab(), this.buildMoreInfoTab()];
		return tabs;
	},
	
	getTabs : function () {
		return [];	
	},
	
	replaceTab : function (tab) {
        var tabId = buildTabId(this, tab[0]);
		var $old = $("#" + tabId);
		
		tab[1].id = tabId;
		tab[1].classList.add("tab-pane");
		tab[1].setAttribute("role", "tabpanel");
		
		
		if ($old.hasClass("active")) {
		    tab[1].classList.add("active");
		}

		$old.replaceWith(tab[1]);
	},
	
	buildText: function () {
		var text = buildElement("textarea", "form-control ipt-text", this.getText());
		text.setAttribute("spellcheck", "true");
		text.dataset.which = this.data.id;
		
		return buildElement("div", "input-group mr-3", text);
	},	

	buildHowtoTab : function () {
	
		var result = buildElement("div", "tab-howto link-group",
		    buildElement("p", undefined, "Select an existsing link from the list, or ",  Links.buildAddButton()),
		    Links.buildSelect("link" in this.data ? this.data.link : undefined)	   
		);			
		
		return ["Link", result];
	}, 
	
	buildLabelTab : function () {
		var result = buildElement("div", "tab-label link-group"), input;		

		result.appendChild(buildElement("p", "info", "Tag this stanza with a label so its answer can be used in a later stanza"));
		
		input = buildElement("input", "form-control ipt-stanza-label");
		
		var thizz = this;

		$(input).on("change", function () {
			if (this.value !== "") {
				thizz.data.label = this.value;
			} else {
				delete thizz.data.label;
			}
		});		

		if ("label" in this.data) {
			input.value = this.data.label;
		}
		
		result.appendChild(buildElement("div", "input-group",
			buildElement("span", "input-group-addon", "Label"),
			input
		));

		return ["Label", result];
	}, 
	
	buildMoreInfoTab: function () {
		var outer = buildElement("div", "tab-moreinfo"),i;
				
		var list = buildElement("div", "list-group list-group-flush mb-3");
			    
	    if ("moreinfo" in this.data) {
	        for (i = 0; i < this.data.moreinfo.length; i += 1) {	        
	            list.appendChild(Links.buildMoreInfoRow(this.data.moreinfo[i]));
	        }
	    }
	    
	    outer.appendChild(list);
		outer.appendChild(
		    buildElement("div", "d-flex",
        		buildElement("button", "btn btn-primary cmd-moreinfo-add", "Add more info"),
		        Links.buildAddButton()
            )
		);
			    	    
	    return ["More Info", outer];
	
	},

	buildRoutingTab : function () {
		
		var table, i, j, k, froms, row, cell, scratch, link, tbody, button, next;
		
		table = buildElement("table", "table table-hover table-sm data-routing");
		
		froms = [];
		row = buildElement("tr");
		for (i = 0; i < this.data.from.length; i += 1) {
			cell = buildElement("th", "h-100 align-top");
			cell.dataset.from = this.data.from[i];
						
			if (stanzaExists(this.data.from[i])) {
				
				froms.push(getStanza(this.data.from[i]));
				k = getStanza(this.data.from[i]);
												
				scratch = buildElement("div", "btn-group");
				if (i === 0) {
					button = buildElement("button", "btn btn-secondary", buildFA("arrow-left"));
					button.disabled = true;

				} else {
					button = buildElement("button", "btn btn-primary cmd-left-question", buildFA("arrow-left"));
					button.dataset.which = this.data.id;
					button.dataset.index = i;					
				}
				
				scratch.appendChild(button);
				
				button = buildElement("button", "btn btn-primary cmd-delete-question", buildFA("trash"));
				button.dataset.which = this.data.id;
				button.dataset.index = i;
				scratch.appendChild(button);
								
				if (i === this.data.from.length - 1) {
					button = buildElement("button", "btn btn-secondary", buildFA("arrow-right"));
					button.disabled = true;
				} else {
					button = buildElement("button", "btn btn-primary cmd-right-question", buildFA("arrow-right"));
					button.dataset.which = this.data.id;
					button.dataset.index = i;
				}
				
				scratch.appendChild(button);
				
				link = buildElement("a", undefined, k.getText());
				link.href = "#" +  getStanza(this.data.from[i]).getIdString();
				
				cell.appendChild(
					buildElement("div", "d-flex flex-column justify-content-between align-items-center",
						scratch,
						link
					)
				);
				
			} else {
				froms.push(undefined);
				cell.dataset.from = this.data.from[i];
				
				cell.appendChild(buildElement("span", "text-warn", "Missing Question"));
				cell.appendChild(buildElement("br"));
				
				scratch = buildElement("span", "btn-group");
								
				if (i === 0) {
					button = buildElement("button", "btn btn-secondary", buildFA("arrow-left"));
					button.disabled = true;
					scratch.appendChild(button);
				} else {
					scratch.appendChild(buildElement("button", "btn btn-primary cmd-left", buildFA("arrow-left")));
				}
				
				scratch.appendChild(buildElement("button", "btn btn-primary cmd-delete-question", buildFA("trash")));
				
				if (i === this.data.from.length - 1) {
					button = buildElement("button", "btn btn-secondary", buildFA("arrow-right"));
					button.disabled = true;
					scratch.appendChild(button);
				} else {
					scratch.appendChild(buildElement("button", "btn btn-primary cmd-right", buildFA("arrow-left")));
				}							
			}
			row.appendChild(cell);
		}
		
		button = buildElement("button", "btn btn-primary cmd-add-question", buildFA("plus"));
		button.dataset.which = this.data.id;
		
		row.appendChild(buildElement("th", "align-top text-center", button));
		
		table.appendChild(buildElement("thead", undefined, row));	
		
		if (this.data.from.length === 0) {
			//short circit
			return ["Routing", buildElement("div", undefined, table)];
		}
				
		tbody = buildElement("tbody");
		// Build combination of possible answers			
		var rows = [];
		function buildCombinations(stanza, col, indexes) {
		    var i, j, row, match;
		    
		    if (col < froms.length) {
		    	if (froms[col] !== undefined && froms[col].hasAnswers()) {
			        for (i = 0; i < froms[col].data.answers.length; i += 1) {
			            buildCombinations(stanza, col + 1, indexes.concat(i));
			        } 
			    } else {
			    	buildCombinations(stanza, col + 1, indexes.concat(0));
			    }
		    } else {
		        row = [];
		        for (i = 0; i < indexes.length; i += 1) {
		            row.push(indexes[i]);
		        }		       
		        
		        // Check to see if there is already an answer known.
		        // If there is, use that. Otherwise, don't bother.
		        row.push("");
		        
		        for (i = 0; i < stanza.data.next.length; i += 1) {
		        	match = true;
		        	for (j = 0; j < (row.length - 1); j += 1) {
		        		if (stanza.data.next[i][j] !== row[j]) {
		        			match = false;
		        			break;
		        		}
		        	}	
		        	if (match) {
		        		row[row.length - 1] = stanza.data.next[i][stanza.data.from.length];
		        	}
		        }
		        
		        rows.push(row);
		    }
		}
		
		buildCombinations(this, 0, []);
		
		// Now we've got the combinations, write them out in a table
		
		for (i = 0; i < rows.length; i += 1) {
			row = buildElement("tr");
			
			for (j = 0; j < (rows[i].length - 1); j += 1) {

				if (froms[j] !== undefined && froms[j].hasAnswers()) {
					cell = buildElement("td", undefined, escapeHTML(froms[j].getAnswerText(rows[i][j])));
					cell.dataset.answer = rows[i][j];
				} else {
					cell = buildElement("td");
				}
				row.appendChild(cell);
			}
			
			next = rows[i][froms.length];
			
			cell = buildElement("td", "d-flex justify-content-between");
			cell.dataset.next = next;
			
			cell.appendChild(buildNextInput(this, i, next));			
			cell.appendChild(buildNextButton(next));
			
			row.appendChild(cell);
			tbody.appendChild(row);	
		}
		
		table.appendChild(tbody);
				
		return ["Routing", buildElement("div", undefined, table)];
	}
	
};

/**
	returns a DOM element of type 'type', with classes 'classes' and content 'content'.
	
	If classes or content are undefined, they are ignored.
	
	classes should be a space seperated list of CSS classes to add to the element
	
	If content is a String, it is converted to a text node before being appended to the element.
	If content is a function, the return value of the funciton is assumeed to be a DOM node, and that is appended to the element.
	Otherwise, content is assumend to be a DOM node, and that is appended to the element

 */
function buildElement(type, classes) {
	var result = document.createElement(type);
	var i, classList;
	if (classes) {
		classList = classes.split(/\s+/);
		for (i = 0; i < classList.length; i+= 1) {
		    if (!classList[i].match(/^\s*$/)) {
    			result.classList.add(classList[i]);
    		}
		}
	};
	
	var index = 2;
	
	while (index < arguments.length) {
		switch (typeof arguments[index]) {
			case "undefined":
				// do nothing
				break;
			case "string":
			case "number":
				result.appendChild(document.createTextNode(arguments[index]));
				break;
			case "function":
				result.appendChild(arguments[index]());
				break;
			case "boolean":
			    result.appendChild(document.createTextNode(arguments[index] ? "true" : "false"));
			    break;	
			default:
				result.appendChild(arguments[index]);
				break;
		}
		index += 1;
	}
	
	return result;		
}

function buildLegacyLink(product) {
	var types = ["callguides", "howtos", "referrals", "cases", "actionguides", "helpcards", "tools", "webguides"];
	var depths = [1, 1, 0, 1, 1, 0, 0, 1];
	var suffix = ["_01.htm", "_01.htm", ".htm", ".htm", "_main.htm", ".pdf", "_01.htm", "_01.htm"];

	var lob, id, result, type, depth;
	
	var parts = product.match(/^([a-z]{3})(\d)(\d{4})$/);
	if (parts) {
		lob = parts[1];
		type = parseInt(parts[2], 10);
		id = parseInt(parts[3], 10);
		
		if (type === 9 || type === 7) {
			// Ocelot
			
			result = "?p=" + product + "#Yolo";
		
		} else {
		
			result = "/" + lob + "/" + types[type] + "/";
			
			if (depths[type] === 1) {
				depth = Math.floor(id / 100);
				if (id % 100 !== 0) {
					depth += 1;
				}
				depth *= 100;
				result += type + pad(depth, 4) + "/";
			}
			
			result += lob + type + pad(id, 4) + suffix[type];	
		}
	} else if (parts = product.match(/^AD(\d{4,5})$/)) {
	    id = parts[1];
	    if (id.length === 4) { 
	        // case
	        type = ".htm";
	        if (id === "45") {
	            type = ".pdf";
	        }
	        
	        return "/digital/AD/AD_cases/AD" + id + type;
	    } else {
	        // call guide
	        return "/digital/AD/callguides/AD" + id + "_01.htm";
	    }
	} else {
		result = product;
	}
	return result;
}

/**
	Remove the content of the HTML element with id 'id'
 */
function clear(id) {
	$("#" + id).empty();
}

/**
	Returns the stanza object identified by 'id'.
	May use caching.
 */
function getStanza(id) {

	var stanza = getCurrentProcess().flow[id];
	if (stanza === undefined) {
		throw new Error("Can't find stanza with id : " + id);
	} else {
		return buildStanza(id, stanza);
	}
}

/**
  Turns a raw object into a Stanza type
  */
function buildStanza(id, stanzaData) {
	if (stanzaData.type in types) {
		return new types[stanzaData.type](id, stanzaData);
	} else {
		throw new Error("Unknown stanza type: [" + stanzaData.type + "]");
	}
}

/**
	Add a new stanza to the list of known stanzas.
	Does not update the backing store.
 */

function addStanza(id, stanzaData) {
	if (!(id in getCurrentProcess().flow)) {
		getCurrentProcess().flow[id] = stanzaData;
	}
	return buildStanza(id, stanzaData);
}

/**
  Remove a stanza from the list of known stanzas
  */
function deleteStanza(id) {
	delete getCurrentProcess().flow[id];
}

/** 
  Returns true if the stanza exists, false otherwise
 */
function stanzaExists(id) {
	if (id === undefined || id === "") {
		return false;
	}

	return (id in getCurrentProcess().flow);
}

/**
	Loops through all stanzas and calls 'callback' with each stanza as an argument
 */
function forAllStanzas(callback) {
	var i, ids = getStanzaIdList();
	for (i = 0;  i < ids.length; i += 1) {
		if (stanzaExists(ids[i])) {
			callback(getStanza(ids[i]));
		}
	}
}

/**
	Sort function (for Array.sort()) that sorts 'start' before everything else, 'end' last
	and everything else in numeric order
 */

function idSort(a, b) {
	if (a === "start") {
		return -1;
	} else if (b === "start") {
		return 1;
	} else if (a === "end") {
		return 1;
	} else if (b === "end") {
		return -1;
	} else {
		return a - b;
	}
}

/**
	Returns a list of known ids
 */
function getStanzaIdList() {
	var process = getCurrentProcess();
	
	if (process === undefined) {
		return [];
	}

	var result =  Object.keys(getCurrentProcess().flow);
	
	result.sort(idSort);
	
	return result	
}

/**
	Return a list of known stanza types.
 */
function getStanzaTypes() {

	// The keys of the types Object are all of the form 'SoemthingStanza'
	// We want to return a list of 'Something'(s), without the 'Stanza'
	
	// A list of types to ignore
	var ignore = arrayToHash(["Stanza", "EndStanza", "SequenceReturnStanza"]);

	var result = Object
	    .keys(types)
	       .filter(function (x) { 
	            // Skip types in 'ignore'
	            if (!(x in ignore)) return x         	
        	})
        	.map(function (x) { 
        	    // Trim trailing 'Stanza'
        	    return x.substring(0, x.length - 'Stanza'.length) 
        	});
	
	result.sort();
	
	return result;
}

/**
	Return a string with its first character in upper case.
 */
function UCFirst(text) {
	return text.substring(0, 1).toUpperCase() + text.substring(1);
}

/**
	Returns a string with the first letter in upper case and the 
	first word surrounded by '<strong>' tags
 */
function boldAndUpper(text) {
	text = UCFirst(text);
	text = text.split(" ");
	return "<strong>" + text.shift() + "</strong> " + text.join(" ");
}

/**
	Turns a string into a 'strong' DOM element
 */
function boldAndUpperDOM(word) {
	return buildElement("strong", undefined, UCFirst(word));
}

/** 
	Turns an array into a hash (where each element of the array
	is a hash key with the value true;
 */
function arrayToHash(array) {
	var i, hash;
	
	if (array === undefined || array === null || array.length === 0) {
		return {};
	}
	
	hash = {};
	
	for (i = 0; i < array.length; i += 1) {
		hash[array[i]] = true;
	}

	return hash;
}

/** Get an icon type (that can be passed to buildFA) from a link
	(Link in this case includes 'tax10024' type references)
 */

function getIconType(link) {
	var type;
	if (link.match(RE.legacy)) {
		type = link.substr(3, 1);
		switch (type) {
			case "0":
				return "comments-o";
			case "1":
				return "question-circle";
			case "2":
				return "paper-plane-o";						
			case "3":
				return "puzzle-piece";
			case "4":
				return "book";
			case "5":
				return "file";
			case "6":
				return "wrench";
			default:
				return "link";			
		}
    } else if (link.match(/^mailto:/)) {
        return "envelope-o";
	} else if (link.match(/^SEES:\/\//)) {
		return "envelope";
	} else if (link.match(/^\//)) {
		return "link";
	} else {
		return "globe";
	}				
}

function buildSpinner() {
	return buildElement("div", "spinner d-flex flex-row align-items-center", 
		buildElement("i", "fa fa-refresh fa-spin fa-3x fa-fw"),
		"Loading..."
	);
}


function buildModalFramework(options) {

	var i, btnClose, footer
	
	footer = buildElement("div", "modal-footer");
	
	btnClose = buildElement("button", "btn btn-secondary", "Close");
	btnClose.dataset.dismiss = "modal";
	
	if (!("buttonsOverride" in options) || !options.buttonsOverride) {
		footer.appendChild(btnClose);
	}
	
	if ("buttons" in options) {
		if (Array.isArray(options.buttons)) {
			for (i = 0; i < options.buttons.length; i += 1) {
				footer.appendChild(options.buttons[i]);
			}
		} else {
			footer.appendChild(options.buttons);
		}
	}
	
	// Build close button
	var btnClose = buildElement("span", undefined, "\u00D7");
	btnClose.setAttribute("aria-hidden", "true");
	
	btnClose = buildElement("button", "close", btnClose);
	btnClose.dataset.dismiss = "modal";
	btnClose.setAttribute("aria-label", "Close");
	
	var modal = buildElement("div", "modal fade",
		buildElement("div", "modal-dialog modal-" + ("size" in options ? options.size : "md"),
			buildElement("div", "modal-content",
				buildElement("div", "modal-header",
					buildElement("h5", "modal-title", options.title),
					btnClose
				),
				buildElement("div", "modal-body", options.body),
				footer			
			)
		)
	);
	
	modal.setAttribute("role", "dialog");
	
	return modal;
}


function confirm(data) {
	var scratch = "";
	var modal = $("#confirmModal");
	if (modal.length !== 0) {
		modal.remove();
	}
					
	scratch += '<div id="confirmModal" class="modal"><div class="modal-dialog modal-md" role="document"><div class="modal-content">';
	scratch += '<div class="modal-header"><h5 class="modal-title">';
	if ("title" in data) {
		scratch += data.title;
	} else {
		scratch += "Confirm";
	}
	
	scratch += '</h5>';
	scratch += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
	scratch += '<span aria-hidden="true">&times;</span></button></div><div class="modal-body">';
	
	if ("body" in data) {
		scratch += data.body;
	} else {
		scratch += "Are you sure?";
	}
	
	scratch += '</div><div class="modal-footer">'
	scratch += '<button type="button" class="btn btn-primary" data-answer="yes">' + ("yes" in data ? data.yes : "Yes") + '</button>';
	scratch += '<button type="button" class="btn btn-primary" data-answer="no">' + ("no" in data ? data.no : "no") + '</button>';		
	scratch += '</div></div></div></div>';
	modal = $(scratch );	

	modal.on("click", ".btn", function () {
		var answer = this.dataset.answer;
		
		if (answer === 'yes') {
			if ("pass" in data) {
				data.pass(modal);
			}
		} else {
			if ("fail" in data) {
				data.fail(modal);
			}
		}
		
		modal.modal("hide");				
	});

	modal.modal("show");
}

function message(body, title, onClose) {
		
    $(buildModalFramework({
        title: title === undefined ? "Message" : title, 
        body: body
    })).on("hidden.bs.modal", function () { 
        $(this).remove(); 
        if (onClose !== undefined && typeof onClose === "function") {
            onClose();
        }
    })
	    .modal("show");
}

function getPlaceholderValue(input) {
   
    function _labelPlaceholder(parts) {
        var label = parts[0];
        
        if (label in customer) {
            return customer[parts[0]];
        } else {
            console.warn("Can't find label " + label + " in customer");
            return "";
        }
    }
    
    function _timescalePlaceholder(parts) {
        var rawTS, years, tsType, ts, result, match;
        rawTS = parts[0];
        
        if (parts.length >= 2) {
            tsType = parts[1];
        }
        
        result = new Date();
        result.setHours(0,0,0,0);
        if (match = rawTS.match(/^(\d?\d).(\d?\d).(\d{4})$/)) {
            // Static date
            match.shift();
            match = match.map(function (x) {return parseInt(x, 10)});
            result.setFullYear(match[2], match[1] - 1, match[0]);
        } else if (match = rawTS.match(/^CY(?:([-+])(\d+))?$/)) {
            // Tax year
                            
            // If we're between 1/1 and 5/4 then start of the current tax year is last years 6/4.
            // Otherwise it's this years 6/4.
            // Remember that getMonth() starts at 0
            if (result.getMonth() < 2 || (result.getMonth() === 3 && result.getDate() <= 5)) {
                result.setFullYear(result.getFullYear() - 1, 3, 6);
            } else {
                result.setFullYear(result.getFullYear(), 3, 6);
            }
            
            // Add or subtract appropriate number of years
            if (match[1] !== undefined) {
                years = parseInt(match[2], 10);
                switch (match[1]) {
                    case "+":   
                        result.setFullYear(result.getFullYear() + years);
                        break;
                    case "-":
                        result.setFullYear(result.getFullYear() - years);
                        break;
                }
            }
        } else if (match = rawTS.match(/^(-?)(\d+)\s+(working\s+)?(day|week)s?$/)) {
            // Some number of weeks/days
            ts = parseInt(match[2], 10);
            if (match[4] === "week") {
                ts *= 7;
            }
            
            if (tsType === "days") {
                return ts + " days";
            }
            
            if (match[3] !== undefined) {
                if (match[1] === undefined) {
                    result = Timescales.addWorkingDays(result, ts);
                } else {
                    result = Timescales.subtractWorkingDays(result, ts);
                }
            } else {
                if (match[1] !== undefined) {
                    ts *= -1;
                }
    
                result.setDate(result.getDate + ts);
            }
        } else if (Timescales.isKnown(rawTS)) {
            ts = Timescales.getRaw(rawTS);
            if (tsType === "days") { 
                return ts + " days";
            } else {
                result.setDate(result.getDate() + ts);
            }
        } 
    
        return result;
    }
    
    function _ratePlaceholder(parts) {
        var type = parts[0];
        var name = parts[1];
        var year = parts[2];
        
        return Rates.getRate(type, name, year);    
    }
    
    function _handle(chunk) {
        var parts, type, result;
           
        parts = chunk.split(":");
        
        if (parts.length === 1) {
            return chunk;
        }
        
        type = parts.shift();
                
        switch (type) {
            case "label":
                result = _labelPlaceholder(parts);
                break;
            case "rate":
                result = _ratePlaceholder(parts);
                break;
            case "timescale":
                result = _timescalePlaceholder(parts);
                break;
            default:
                result = chunk; 
        }
        
        return result;
    }

    function _parse(raw) {
        var stack = [];
        var index = 0;
        var start, chunk, result;
        
        while (index < raw.length) {
            switch (raw[index]) {
                case '[':
                    stack.push(index)
                    break;
                 case ']':
                    start = stack.pop();
                    
                    // Parse the (potential) placeholder
                    result = _handle(raw.substring(start + 1, index));
                    
                    if (start === 0 && index === raw.length - 1) {
                        
                        return result;
                    } else {                    
                        // Replace the placeholder in the original string
                        raw = raw.substring(0, start) + result + raw.substring(index + 1);
                    }
                    
                    // Update the index to take into account any change of length
                    index = start + result.length - 1;
                    
                    break;
            }
            index += 1;
        }
        return raw;
    }
    
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat    
    var floatRE = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;
    
    // check for numbers
    if (input.match(floatRE)) {
        return parseFloat(input);
    } else {
        return Placeholders.replaceText(input);
    }
}

function buildRowControls(name, label) {
    var group = buildElement("div", "btn-group");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    
    group.appendChild(buildElement("button", "btn btn-primary cmd-" + name + "-up",     buildFA("arrow-up")));
    group.appendChild(buildElement("button", "btn btn-primary cmd-" + name + "-down",   buildFA("arrow-down")));
    group.appendChild(buildElement("button", "btn btn-primary cmd-" + name + "-delete", buildFA("trash")));

    return group;
}

function buildRowControlHanlders(tab, name, subhandlers) {

	$(tab).on("click", ".cmd-" + name + "-up", function () {
		var me = $(this).closest(".row-" + name);
		var prev = me.prev();
		
		if (prev.length === 0) {
			return;
		}
		
		var distance = prev.offset().top - me.offset().top;
		
		$.when(
			me.animate({top : "+=" + distance}, 400),
			prev.animate({top : "-=" + distance}, 400)
		).done(function () {
			me.css("top", "0");
			prev.css("top", "0");
			me.after(prev);
			
			if (subhandlers && "onup" in subhandlers) {
			    subhandlers.onup(tab);   
			}
		});
	
	}).on("click", ".cmd-" + name + "-down", function () {
		var me = $(this).closest(".row-" + name);
		var next = me.next();
		
		if (next.length === 0) {
			return;
		}
		
		var distance =  me.offset().top - next.offset().top;
		
		$.when(
			me.animate({top : "-=" + distance}, 400),
			next.animate({top : "+=" + distance}, 400)
		).done(function () {
			me.css("top", "0");
			next.css("top", "0");
			me.before(next);	

			if (subhandlers && "ondown" in subhandlers) {
			    subhandlers.ondown(tab);   
			}
		});
	
	}).on("click", ".cmd-" + name + "-delete", function () {
	    var target;
		var $row = $(this).closest(".row-" + name);
		$row.remove();
		
    	if (subhandlers && "ondelete" in subhandlers) {
		    subhandlers.ondelete(tab);   
		}
	});
}

window.Rates = (function () {
    var rates = {};    

    function _load() {
        return $.getJSON("../../system/ocelot/data/rates.js")
            .done(function (json) {
                rates = json;
            })
            .fail(function () {
                console.warn("Can't load rates.js");
            });
    }
    
    function _getRate(args) {
        
        var date, match, offset, type, name, year;
        
        type = args[0];
        name = args[1];
        year = args[2];
        
        if (type === "meta") {
            return;
        }
        
        if (type in rates && name in rates[type]) {

            if (year === undefined) {
                year = "CY";
            }
        
            if (year in rates[type][name]) {
                return rates[type][name][year];
            } else if (match = year.match(/^CY(?:([+-])(\d+))?$/)) {
                match.shift();
                
                date = new Date();
                
                if (date.getMonth() < 2 || (date.getMonth() === 3 && date.getDate() <= 5)) {
                    date.setFullYear(date.getFullYear() - 1, 3, 6);
                } else {
                    date.setFullYear(date.getFullYear(), 3, 6);
                }
                
                if (match[1] !== undefined) {
                    offset = parseInt(match[1], 0);
                    
                    if (match[0] === '-') {
                        offset *= -1;
                    }
                    
                    date.setFullYear(date.getFullYear() + offset);               
                }
                                                
                return rates[type][name][date.getFullYear()];                            
            } else {
                console.warn("Unknown year for rate:" + type + ":" + name + ":" + year);
                return
            }        
        }
    }

    function _drawRate(span, args) {        
        var rate = _getRate(args);
                        
        if (rate !== undefined) {
            $(span).empty().append(rate);
        } else {
            $(span).empty().append("[Rate not found]");
        }        
    }

    function _attachPlaceholder() {
        var result = buildElement("span", "placeholder rate", "Loading...");
        
        var args = [], i;
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        
        _drawRate(result, args);
        
        return result;
    }
    
    function _getMeta() {
        return rates.meta;
    }
    
    function _getType(type) {
        return rates[type];    
    }    

    return {
        attach: _attachPlaceholder,
        getRate: _getRate,
        getMeta: _getMeta,
        getType: _getType,
        load: _load
    }

})();



function convertTags(strHTML){

	// check for tag closures - only on cc
	
	var found = false;
	
	if (~window.location.href.indexOf('.cc')){
	
		if (~strHTML.indexOf('&lt;note&gt;')){
		
			if (!~strHTML.indexOf('&lt;/note&gt;')){
	
				found = true;
			
			}
		
		}
		
		if (~strHTML.indexOf('&lt;important&gt;')){
		
			if (!~strHTML.indexOf('&lt;/important&gt;')){
	
				found = true;
			
			}
		
		}
		
		if (~strHTML.indexOf('&lt;more&gt;')){
		
			if (!~strHTML.indexOf('&lt;/more&gt;')){
	
				found = true;
			
			}
		
		}
		
		if (found === true){
		
			strHTML += '&nbsp;<p class="bg-danger text-white"><strong>Warning!</strong> Unclosed tags detected</p>'; 
		
		}
	
	}	
	
	// standard note
	
	strHTML = strHTML.replace('&lt;note&gt;', '<div class="bs-callout bs-callout-note"><div class="noMinMax"><h4>Note:</h4>');
	strHTML = strHTML.replace('&lt;/note&gt;', '</div></div>');		

	// important note
	
	strHTML = strHTML.replace('&lt;important&gt;', '<div class="bs-callout bs-callout-danger"><div class="noMinMax"><h4 class="text-danger">Important:</h4>');
	strHTML = strHTML.replace('&lt;/important&gt;', '</div></div>');				
	
	// more information	
	
	strHTML = strHTML.replace('&lt;more&gt;', '<div class="bs-callout bs-callout-moreinfo"><h4 class="text-moreinfo">More Information:</h4>');
	strHTML = strHTML.replace('&lt;/more&gt;', '</div>');

	// more information customisation
	
	strHTML = $.parseHTML(strHTML);

	$(strHTML).filter('div.bs-callout.bs-callout-moreinfo').find('ul').attr('style', 'list-style-type: none; margin: 0; padding: 0;');
	$(strHTML).filter('div.bs-callout.bs-callout-moreinfo').find('li').each(function(){
	
		var title;
		var li = $(this);
	
		if (~$(this).text().indexOf('(') && ~$(this).text().indexOf(')')){
		
			var title = $(this).text().substring($(this).text().indexOf('(') + 1, $(this).text().indexOf(')'));
			title = title.trim();
		
		}
	
		if ($(this).text().match(RE.legacy)){
		
			$.getJSON('../backend/getProduct.asp', {ref: $(this).text().substring(0, 8)}, function(data){
				
				var fa;
				
				switch (data.type){
				
					case 'call guide':
						fa = '<i class="fa fa-fw fa-comments-o" aria-hidden="true"></i>';
						break;				
					case 'how to':
						fa = '<i class="fa fa-question-circle-o" aria-hidden="true"></i>';
						break;						
					case 'referral':
						fa = '<i class="fa fa-fw fa-paper-plane-o" aria-hidden="true"></i>';
						break;
					case 'case':
						fa = '<i class="fa fa-fw fa-puzzle-piece" aria-hidden="true"></i>';				
						break;
					case 'action guide':
						fa = '<i class="fa fa-fw fa-book" aria-hidden="true"></i>';				
						break;
					case 'helpcard':
					        
						if (data.filetype.legacy === 'pdf' || data.filetype.ocelot === 'pdf'){ 
						
							fa = '<i class="fa fa-fw fa-file-pdf-o" aria-hidden="true"></i>'; // pdf
										
						} else if (data.filetype.legacy === 'doc' || data.filetype.legacy === 'docx' || data.filetype.ocelot === 'doc' || data.filetype.ocelot === 'docx'){
						
							fa = '<i class="fa fa-fw fa-file-word-o" aria-hidden="true"></i>'; // word
									
						} else if (data.filetype.legacy === 'xls' || data.filetype.legacy === 'xlsx' || data.filetype.ocelot === 'xls' || data.filetype.ocelot === 'xlsx'){ 
						
							fa = '<i class="fa fa-fw fa-file-excel-o" aria-hidden="true"></i>'; // excel
										
						} else if (data.filetype.legacy === 'ppt' || data.filetype.legacy === 'pptx' || data.filetype.legacy === 'pps' || data.filetype.legacy === 'ppsx' || data.filetype.ocelot === 'ppt' || data.filetype.ocelot === 'pptx' || data.filetype.ocelot === 'pps' || data.filetype.ocelot === 'ppsx'){ 
						
							fa = '<i class="fa fa-fw fa-file-powerpoint-o" aria-hidden="true"></i>'; // powerpoint	
									
						} else {
						
							fa = '<i class="fa fa-fw fa-file-o" aria-hidden="true"></i>'; // default file		
								
						}		            		

						break;
					case 'tool':
						fa = '<i class="fa fa-fw fa-wrench" aria-hidden="true"></i>';				
						break;
					case 'process':
						fa = '<i class="fa fa-fw fa-comments-o" aria-hidden="true"></i>';				
						break;
					default:
						fa = '<i class="fa fa-fw fa-link" aria-hidden="true"></i>';				
				
				}
				
				if (data.exists.legacy === false || data.exists.ocelot === false){
				
					if (~window.location.href.indexOf('.cc')){
				
						$(li).html('&nbsp;<strong>Warning!</strong> The product reference you have entered has not been found').addClass('bg-warning text-white');				
						
					}
				
				} else {
				
					if (title !== undefined){
					
						if (data.exists.ocelot === true){
						
							$(li).html(fa + '&nbsp;&nbsp;<a href="' + data.path.ocelot + '">' + title + '</a>');
						
						} else if (data.exists.legacy === true){
						
							$(li).html(fa + '&nbsp;&nbsp;<a href="' + data.path.legacy + '">' + title + '</a>');
						
						}
				
					} else {
					
						if (data.exists.ocelot === true){
						
							$(li).html(fa + '&nbsp;&nbsp;<a href="' + data.path.ocelot + '">' + data.title.ocelot + '</a>');
						
						} else if (data.exists.legacy === true){
						
							$(li).html(fa + '&nbsp;&nbsp;<a href="' + data.path.legacy + '">' + data.title.legacy + '</a>');
						
						}
						
					}
				
				}			
			
			});
		
		} else if (~$(this).text().indexOf('_telephone')) {
		
			$.get('../backend/contacts.asp', {id: $(this).text().substring(0, $(this).text().indexOf('_telephone'))}, function(data){
			
				data = JSON.parse(data);
				
				$(li).html('<i class="fa fa-fw fa-phone" aria-hidden="true"></i>&nbsp;&nbsp;' + data[Object.keys(data)[0]].Name);
			
			});			
		
		} else if (~$(this).text().indexOf('_address')) {
		
			$.get('../backend/contacts.asp', {id: $(this).text().substring(0, $(this).text().indexOf('_address'))}, function(data){				
			
				data = JSON.parse(data);
				
				$(li).html('<i class="fa fa-fw fa-envelope" aria-hidden="true"></i>&nbsp;&nbsp;' + data[Object.keys(data)[0]].Name);
			
			});		
			
		} else if (~$(this).text().indexOf('http://www.')){
		
			if (title !== undefined){
			
				$(this).html('<i class="fa fa-fw fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text().substring(0, $(this).text().indexOf('(')) + '">' + title + '</a>');
			
			} else {
			
				$(this).html('<i class="fa fa-fw fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text() + '">' + $(this).text().replace('http://www.', '') + '</a>');
			
			}			

		} else if (~$(this).text().indexOf('https://www.')){
		
			if (title !== undefined){
			
				$(this).html('<i class="fa fa-fw fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text().substring(0, $(this).text().indexOf('(')) + '">' + title + '</a>');
			
			} else {
			
				$(this).html('<i class="fa fa-fw fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text() + '">' + $(this).text().replace('https://www.', '') + '</a>');
			
			}			

		} else if (~$(this).text().indexOf('www.')){
		
			if (title !== undefined){
			
				$(this).html('<i class="fa fa-fw fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;<a href="http://' + $(this).text().substring(0, $(this).text().indexOf('(')) + '">' + title + '</a>');	
			
			} else {
			
				$(this).html('<i class="fa fa-fw fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;<a href="http://' + $(this).text() + '">' + $(this).text().replace('www.', '') + '</a>');	
			
			}
				
		} else if (~$(this).text().indexOf('http://')){
		
			if (title !== undefined){
			
				$(this).html('<i class="fa fa-fw fa-link" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text().substring(0, $(this).text().indexOf('(')) + '">' + title + '</a>');			
			
			} else {
			
				$(this).html('<i class="fa fa-fw fa-link" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text() + '">' + $(this).text().replace('http://', '') + '</a>');			
			
			}
			
		} else if (~$(this).text().indexOf('https://')){
		
			if (title !== undefined){
			
				$(this).html('<i class="fa fa-fw fa-link" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text().substring(0, $(this).text().indexOf('(')) + '">' + title + '</a>');				
			
			} else {
			
				$(this).html('<i class="fa fa-fw fa-link" aria-hidden="true"></i>&nbsp;&nbsp;<a href="' + $(this).text() + '">' + $(this).text().replace('https://', '') + '</a>');				
			
			}			
				
		} else {
		
			if (~window.location.href.indexOf('.cc')){
		
				//$(this).empty();
				$(this).html('&nbsp;<strong>Warning!</strong> Unknown link').addClass('bg-danger text-white');	
			
			}			
		
		}	
	
	});
	
	return strHTML;

}


$("#selectPrimaryTheme").change(function() {
    $("head link#themePrimary").attr("href", "ColourSchemes/Primary/" + $(this).val());
});
$("#selectSecondaryTheme").change(function() {
    $("head link#themeSecondary").attr("href", "ColourSchemes/Secondary/" + $(this).val());
});
$(function () {
	if ("tooltip" in $) {
	  $('[data-toggle="tooltip"]').tooltip()
	 }
})

