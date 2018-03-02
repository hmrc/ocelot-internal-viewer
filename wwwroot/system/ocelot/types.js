"use strict";

/** 
	Base type for instructions to advisers. Can be used directly or sub-typed
 */
types.InstructionStanza = function (id, stanza) {
	types.Stanza.call(this, id, stanza);
};

$.extend(types.InstructionStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "instruction";
	},
	
	toHTML: function () {
		var text = this.getText();
		
		if (text === undefined) {
			return buildElement("p", "empty");		
		}
	
		text = this.getText().split(" ");
		
		var result = buildElement("span", this.getType(), 
			buildElement("strong", "first", text.shift()),
			" ",
			text.join(" ")
		)
					
		result.dataset.id = this.getIdString();
		
		if (this.data.howto) {
			attachHowto(result, this.data.howto);
		}
		
		return result;
	},
	
	/**
		Instructions 'stack' by default, but can be over-ruled in specific cases.
	 */
	isStacked: function () {
		if ('stack' in this.data) {
			return this.data.stack;
		} else {
			return true;
		}
	},
	getTabs: function () {
		var tabs = [];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		} else {
			tabs.push(this.buildNextTab());
		}
				
		return tabs.concat(this.getDefaultTabs());
	},
			
	buildNextTab: function () {
		var scratch = buildElement("div", "form-inline d-flex",
			buildNextInput(this, 0, this.getNext(0)),
			buildNextButton(this.getNext(0))
		);
		return ["Next stanza", scratch];
	}
});


/**
	Gives advisers a textbox and a 'copy' button, to copy arbitary text onto the clipboard.
	
 */
types.CopyNoteStanza = function (id, stanza) {
	types.InstructionStanza.call(this, id, stanza);
};

$.extend(types.CopyNoteStanza .prototype, Object.create(types.InstructionStanza.prototype), {
	getType: function () {
		return "copy_note";
	},
	
	
	_toText : function (html) {
		var result = "";
		var i, node;
		
		for (i =0 ; i < html.childNodes.length; i +=1 ) {
			node = html.childNodes[i];
			if (node.nodeType === 3) { // text nodes
				result += node.nodeValue;
			} else if (node.nodeType === 1) { // element node
				if (node.nodeName === 'BR') {
					result += "\n";
				} else {
					result += this._toText(node);
				}
			}	
		}
		
		result = result.replace(/ +/, ' ');
		
		return result;
	
	},
	
	toHTML: function () {
		var cols = 60, rows = 0;
		var text = this.getText();
		var i, lines = text.split("\n");
		var scratch = buildElement("span", undefined);
		
		for (i = 0; i < lines.length; i += 1) {
			scratch.appendChild(textNode(lines[i]));
			scratch.appendChild(buildElement("br"));		
		}

		replacePlaceholders(scratch);

		text = this._toText(scratch);
		
		text.split("\n").forEach(function (line) {
			rows += Math.ceil(line.length / cols);
		});

		var outer = buildElement("div", "self-render form-group");
		
		var textarea = buildElement("textarea", "copynote form-control", text);
		textarea.setAttribute("spellcheck", "false");
		textarea.rows = Math.max(rows + 1, 4);
		textarea.cols = cols;
		
		outer.appendChild(textarea);
		
		var button = buildElement("button", "btn btn-primary", "Copy note");
				
		function _onClick() {
			$(button).off("click");
			var buttonText = $(button).text();
			
			// Copy to clipboard stuff
			var copyText = buildElement("textarea", undefined, $(textarea).val());
			this.appendChild(copyText);		
			copyText.select();
			document.execCommand("copy");	
			copyText.parentNode.removeChild(copyText);
			
			var width = $(button).width();
			
			$(button)		
				.on("animationend", function () {
					$(button)
						.removeClass("flash")
						.on("click", _onClick)
						.text(buttonText);
				})
				.text("Copied")
				.width(width)
				.addClass("flash");
		}
		
		$(button).on("click", _onClick);
		
		outer.appendChild(button);
		
		return outer;
	},
	
	isStacked: function () {
		return false;
	},
	
	isSelfRender: function () {
		return true;
	},
});


/** 
	There should be exactly one 'end' type stanza per process.
	The front-end doesn't display it, its just a marker that the author finished a strand on purpose.
 */

types.EndStanza = function (id, stanza) {
	types.InstructionStanza.call(this, id, stanza);
};

$.extend(types.EndStanza.prototype, Object.create(types.InstructionStanza.prototype), {
	getType: function () {
		return "end";
	},
	
	isTerminal: function () {
		return true;
	},
	
	getNext: function () {
		return -1;
	},
	getTabs: function () {
		return [];
	},
	buildText: function () {
		return buildElement("div", "mr-3", "End of this process");
	}
});

/**
	Notes are Instructions with fancy formatting.
 */
types.NoteStanza = function (id, stanza) {
	types.InstructionStanza.call(this, id, stanza);
};
$.extend(types.NoteStanza.prototype, Object.create(types.InstructionStanza.prototype), {
	getType: function () {
		return "note";
	},
	
	_wrapper: function (given, frame) {
		while (given.firstChild) {
			if (given.firstChild.nodeName === "LI") {
				renameNode(given.firstChild, "div");
			}
			frame.appendChild(given.firstChild);
		}
	
		given.appendChild(frame);		
	},


	wrap: function (given) {		
		var holder = buildElement("div");
	
		var frame = buildElement("div", "bs-callout bs-callout-info",
			buildElement("h4", "card-title", "Note:"),
			buildElement("div", "d-flex justify-content-between",
				holder,
				(Features.check("noteIcons") ? buildElement("div", "callout-icon callout-info-icon", buildFA("exclamation-circle fa-4x")) : undefined)
			)
		);
		
		while (given.firstChild) {
			if (given.firstChild.nodeName === "LI") {
				renameNode(given.firstChild, "div");
			}
			holder.appendChild(given.firstChild);
		}

		given.appendChild(frame);
	},
	
	isStacked: function () {
		if ('stack' in this.data) {
			return this.data.stack;
		} else {
			return false;
		}
	}
});

/**
	Importants are Instructions with fancy formatting.
 */
types.ImportantStanza = function (id, stanza) {
	types.NoteStanza.call(this, id, stanza);
};
$.extend(types.ImportantStanza.prototype, Object.create(types.NoteStanza.prototype), {
	getType: function () {
		return "important";
	},

	wrap: function (given) {
		var holder = buildElement("div");
	
		var frame = buildElement("div", "bs-callout bs-callout-danger",
			buildElement("h4", "card-title", "Important:"),
			buildElement("div", "d-flex justify-content-between",
				holder,
				(Features.check("noteIcons") ? buildElement("div", "callout-icon callout-important-icon", buildFA("exclamation-triangle fa-4x")) : undefined)
			)
		);
		
		while (given.firstChild) {
			if (given.firstChild.nodeName === "LI") {
				renameNode(given.firstChild, "div");
			}
			holder.appendChild(given.firstChild);
		}

		given.appendChild(frame);			
	}
});
/**
	PTA Notes are Instructions with fancy formatting.
 */
types.PTAStanza = function (id, stanza) {
	types.NoteStanza.call(this, id, stanza);
};
$.extend(types.PTAStanza.prototype, Object.create(types.NoteStanza.prototype), {
	getType: function () {
		return "PTA";
	},
	
	wrap: function (given) {		
		var frame = buildElement("div", "bs-callout bs-callout-PTA",
			buildElement("h4", "card-title", "Personal Tax Account:")
		);
		
		this._wrapper(given, frame);
	}
});

types.YourCallStanza = function (id, stanza) {
	types.NoteStanza.call(this, id, stanza);
};
$.extend(types.YourCallStanza .prototype, Object.create(types.NoteStanza.prototype), {
	getType: function () {
		return "YourCall";
	},
	
	_buildSvg: function(name) {
		var NS="http://www.w3.org/2000/svg";
		var el = document.createElementNS(NS, name);
		var i;
		
		for (i = 1; i < arguments.length; i += 2) {
			el.setAttribute(arguments[i], arguments[i+1]);
		}
		
		return el;
	},
	
	_drawArrow: function(target) {
		$(target).find("svg").remove();

		var width = $(target).outerWidth();
		var height = $(target).outerHeight();
		
		var offset = height / 4;
		var end = 8;
		
		var path = [
			
			"M 0 0", 
			"H", (width - offset - end),
			"L", (width - end), height / 2, 
			"L", (width - offset - end), height, 
			"L ", 0, height, 
			"z"
		].join(" ");
		
		var svg = this._buildSvg("svg",  "preserveAspectRatio", "none", "viewBox", [0, 0, width, height].join(" "), "width", "100%", "height", "100%");
		svg.appendChild(this._buildSvg("path", "d", path));
		
		target.insertBefore(svg, target.firstElementChild);
	},

	wrap: function (given) {
		
		var thizz = this;
		var frame = buildElement("div", "yourCall mb-2",
			buildElement("h4", "card-title", "Your Decision:")
		);
		
		this._wrapper(given, frame);
		
		$(window).on("resize transitionend", function () {
			thizz._drawArrow(frame);
		});
		
		setTimeout(function () {
			thizz._drawArrow(frame);
		}, 25);		
	}
});

types.QuestionStanza = function (id, stanza) {
	types.Stanza.call(this, id, stanza);
};

$.extend(types.QuestionStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "question";
	},
	
	isQuestion: function () {
		return true;
	},

	getAnswerCount: function() {
		return this.data.answers.length;
	},

	replay: function (ans, onRender) {
		render(this.getNext(ans), {
			answer: UCFirst(getPhrase(this.data.answers[ans])),
			history: ans		
		}, onRender);	
	},

	getAnswer: function (index) {
		var thizz = this;
		var answerText = UCFirst(getPhrase(this.data.answers[index]));

		var answer = buildElement("button", "list-group-item list-group-item-action cmd-answer", 
			buildElement("div", undefined, 
				buildFA("arrow-circle-right"),
				buildElement("span", undefined, answerText)
			)
		);
		
		var next = this.getNext(index);
		
		// This is mostly for humans to see if they're diagnosing problems.
		answer.dataset.next = next;
				
		$(answer).on("click", function () {
			render(next, {
				answer: answerText,
				history: index
			});
			return false;
		});					
		return answer;
	},
	
	getAnswerText: function (index) {
		return getPhrase( this.data.answers[index]);
	},
	
	toHTML: function () {
		var actionWords = arrayToHash(["ask", "check", "select"]);
		var text = this.getText().split(" ");
		
		var result = buildElement("span", this.getType() + (text[0].toLowerCase() in actionWords ? " action" : ""), 
			buildElement("span", "first", text.shift()),
			" ",
			text.join(" ")
		)
		
		if ('link' in this.data) {
			attachLink(this, result);
		} else if ('howto' in this.data) {
			attachHowto(result, this.data.howto);
		}
					
		result.dataset.id = this.getIdString();
		if (this.hasWebchat()) {
			result.dataset.webchat = this.getWebchat();
		}

		return result;
	},
	
	getTabs: function () {
		var tabs = [this.buildAnswerTab(), this.buildLabelTab()];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		}
		
		return tabs.concat(this.getDefaultTabs());
	
	},
	
	buildAnswerTab: function () {	
		var scratch, ul, i, div;
		
		div = buildElement("div");	
		if (this.hasAnswers()) {
			ul = buildElement("ul", "list-group list-group-flush mb-sm-3");
	
			for (i =0 ; i < this.data.answers.length; i += 1) {
				
				ul.appendChild(
					buildAnswerInput(this, i)
				);
				
			}
			div.appendChild(ul);
		}
		
		var button = buildElement("button", "btn btn-primary cmd-add-answer", "Add new answer");
		button.dataset.which = this.data.id;
		
		div.appendChild(buildElement("div", "mb-sm-3", button));
	
		return ["Answers", div];
	}
});

types.ToolStanza = function (id, stanza) {
	if (!("answers" in stanza)) {
		stanza.answers = [];
	}
	
	if (!("next" in stanza)) {
		stanza.next = [];
	}	
	types.QuestionStanza.call(this, id, stanza);
};

$.extend(types.ToolStanza.prototype, Object.create(types.QuestionStanza.prototype), {
	getType: function () {
		return "tool";
	},
	getAnswerCount: function() {
		return 1;
	},
	
	isQuestion: function () {
		var tool = Tools.getTool(this.data.tool);
		
		if (tool !== undefined) {
			return !tool.inline;
		} else {
			return false;
		}
	},
	
	hasAnswers: function () {
		return this.isQuestion();
	},
	
	isSelfRender: function () {
		return true;
	},
	
	getAnswerText: function(index) {
		var tool = Tools.getTool(this.data.tool);
		
		if (tool !== undefined) {	
			return tool.answers[index];
		} else {
			return "";
		}	
	},
	
	getLabels: function () {
		var tool = Tools.getTool(this.data.tool);
		return tool.sets;	
	},
	
	buildFromLive: function (card) {
	    var $card = $(card);
	    var stanza = {};
	    var gotName = false;
	    var tool = $card.find(".cmd-tool-type").val();
			
		if (tool !== undefined && tool.match(/^tool\d{5}$/)) {
			stanza.tool = tool;
			
			stanza.next = [];		
			$card.find(".ipt-answer-next").each(function (index) {
				stanza.next[index] = this.value;		
			});
					
			stanza.sets = [];
			$card.find(".ipt-tool-name-sets").each(function (index) {
			    var value = this.value;
			    if (value !== "") {
			        gotName = true;
			    } else {
			        value = undefined;
			    }
			    stanza.sets.push(value);
			});
			if (!gotName) {
			    delete stanza.sets;
			}
			
			gotName = false;
			stanza.inputs = [];
			$card.find(".ipt-tool-name-inputs").each(function (index) {
			    var value = this.value;
			    if (value !== "") {
			        gotName = true;
			    } else {
			        value = undefined;
			    }
			    stanza.inputs.push(value);
			});
			if (!gotName) {
			    delete stanza.inputs;
			}
			
		} else {
			delete stanza.tool;
			delete stanza.next;
		}
	    return stanza;
	},
	
	_buildLabelRow: function(type, originalName, givenName) {
	    var li = buildElement("li", "list-group-item");
	    
	    var input = buildElement("input", "form-control ipt-tool-name-" + type);
	    if (givenName !== undefined) {
	        input.value = givenName;
	    }
	    
	    input.placeholder = originalName;
	    input.type = "text";
	    
	    li.appendChild(
    	    buildElement("div", "input-group",
    	        buildElement("span", "input-group-addon", originalName),
    	        input
    	    )
	    );
	    return li;
	},
	
	_buildLabelTab: function (name, type) {
	    var ul, i, givenName
        var div = buildElement("div", undefined, 
            buildElement("p", undefined, "Use this tab to change the name of the default ", name.toLowerCase(), " labels for this tool"),
            buildElement("p", undefined, "(For example, because you're using this tool more than once in a process. Most of the time you probably don't need to do this.)")
        );       
        
        var tool = Tools.getTool(this.data.tool);
    	
    	if (tool !== undefined) {			
    		ul = buildElement("ul", "list-group list-group-flush mb-sm-3");
    
            if (type in tool && tool[type].length > 0) {
        		for (i =0 ; i < tool[type].length; i += 1) {
    			    if (type in this.data) {
    			        givenName = this.data[type][i];
    			    } else {
    			        givenName = undefined;
    			    }
        			ul.appendChild(        			    
        				this._buildLabelRow(type, tool[type][i], givenName)
        			);    			
        		}
    		
        		div.appendChild(ul);
        	} else {
        	    div.appendChild(buildElement("p", undefined, "No ", name.toLowerCase() , " labels"));
        	}
    	}
	   return [name, div];
	},

	buildAnswerTab: function () {	
		var scratch, ul, i, div;
	
		var div = buildElement("div");

		var tool = Tools.getTool(this.data.tool);
		
		if (tool !== undefined) {			
			ul = buildElement("ul", "list-group list-group-flush mb-sm-3");
	
			for (i =0 ; i < tool.answers.length; i += 1) {
				
				ul.appendChild(
					buildAnswerInput(this, i)
				);
				
			}
			div.appendChild(ul);
		}
	
		$(div).find(".ipt-answer-text").prop("disabled", true);
	
		return ["Answers", div];
	},

	getTabs: function () {
		return [
		    this.buildAnswerTab(),
		    this._buildLabelTab("Input", "inputs"),
		    this._buildLabelTab("Output", "sets"),
		    this.buildLabelTab()
	    ];
	},

	getText: function () {
		var tool = Tools.getTool(this.data.tool);
		if (tool !== undefined) {
			return tool.name;
		} else {
			return "Tool";
		}	
	},
	
	buildText : function () {
		var thizz = this, tool;
		var id, option, description;
		
		var result = buildElement("div", "form-group mb-3");		
		var select = buildElement("select", "form-control cmd-tool-type");

		description = buildElement("div");
		
		option = buildElement("option", undefined, "Please select tool from list");

		select.appendChild(option);
		$(result).on("change",  select, function () {
			thizz.data.tool = select.value;
			
			thizz.data.next = [];			
			
			if (!thizz.data.tool.match(/^tool\d{5}$/)) {
				delete thizz.data.tool;
				return;
			}
			
			$(description).text(Tools.getTool(thizz.data.tool).description);
			
			thizz.replaceTab(thizz.buildAnswerTab());
			thizz.replaceTab(thizz._buildLabelTab("Input", "inputs"));
			thizz.replaceTab(thizz._buildLabelTab("Output", "sets"));			
		});
	
		for (id in Tools.getTools()) {
			tool = Tools.getTool(id);
			option = buildElement("option", undefined, tool.name);
			option.value = id ;
			
			if (id === this.data.tool) {
				option.selected = true;
				$(description).text(tool.description);				
			}
						
			select.appendChild(option);
		}
	
		result.appendChild(select);
	
		result.appendChild(buildElement("div", "mt-3 mb-3", description));
						
		return result;
	
	},
	
	replay: function (answer, onRender) {
		var tool = Tools.getTool(this.data.tool);
		render(this.getNext(answer), {
			answer: tool.answers[answer],
			history: answer
		}, onRender);
	},
	
	getAnswer: function () {			
		this.answer = buildElement("button", "list-group-item list-group-item-action cmd-answer", 
			buildElement("div", undefined, 
				buildFA("arrow-circle-right"),
				" Continue"
			)
		);
		
		$(this.answer).prop("disabled", true);
			
		return this.answer;
	},
	
	doOffscreen: function (next) {	    	
	    function _continue(success) {
	        clearTimeout(timeout);
	        if (!done) {
	            done = true;
    	        iframe.parentNode.removeChild(iframe);
    		    next(success);
    		}
		}
	
    	var thizz = this;
    	
    	// Only wait a certain amount of time for the iframe to finish loading
    	var timeout = setTimeout(_continue, 10 * 1000);
    	
		var done = false;
		var id = this.data.tool;
	    var iframe = buildElement("iframe", "tool offscreen");
	    iframe.style.display = "none";
	    
	    $("body").append(iframe);
	    
	    Tools.onLoad(function () {
			var tool = Tools.getTool(id);
		
			$(iframe).on("load", function () {
			    var toolCustomer = Object.assign({}, customer);
			    
				if (typeof iframe.contentWindow.init === "function") {				
					// Trigger iframe code.
					try {			
						iframe.contentWindow.init(toolCustomer, function (c2, result) {
							if (result >= 0) {
							    Object.assign(customer, c2);
							    _continue(true);
							}
						});
					} catch (ex) {
						console.log("Problem running tool " + id, ex);
    				    _continue(false);						
					}
				} else {
					console.log("Problem running tool " + id + ": Missing init");
    			    _continue(false);					
				}
			});
			
			// Trigger loading			
			iframe.src = "tools/" + id + ".htm";
		});	    	    	
	},
	
	toHTML: function () {
		var thizz = this;
		
		var id = this.data.tool;
		var iframe = buildElement("iframe", "tool");
		
		Tools.onLoad(function () {
			var tool = Tools.getTool(id);
		
			if (tool.inline) {
				iframe.classList.add("inline");
			}
			
			$(iframe).on("load", function () {			
				var iframeCount;

				// Count the instructions in this iframe, record it, and update the counter.
				iframeCount = $($(iframe).contents()).find(".instruction").length;
				iframe.dataset.count = iframeCount;					
				$(iframe).css("counter-increment", "instructions " + iframeCount);
				
				// Run through every iframe and make sure their internal counters are right				
				$(iframe).closest("ul").find("iframe.tool.inline").each(function (index) {
					var count;
					var instructionCount = $(this).prevAll(".instruction").length;
					
					$(this).prevAll("iframe.tool.inline").each(function (index) {
						count = parseInt(this.dataset.count, 10);
						if (!isNaN(count)) {
							instructionCount += count;
						}					
					});
					
					$($(this).contents()).find(".instruction").first().css("counter-reset", "x " + instructionCount);								
				
					if ((instructionCount + iframeCount) !== 1) {
						$(iframe).closest("ul.solo").removeClass("solo");
					}					
				});
								
				// Tag the iframe as inline
				if (tool.inline) {
					iframe.contentWindow.document.body.classList.add("inline");								
				}
								
				// Fix the height
				$(iframe).height(iframe.contentWindow.document.body.offsetHeight + 4);
						
				if (typeof iframe.contentWindow.init === "function") {				
					// Trigger iframe code.
					try {			
						iframe.contentWindow.init(customer, function (c2, result) {						
							if (result >= 0) {
								Object.assign(customer, c2);
								
								$(thizz.answer)
									.prop("disabled", false)
									.off("click")
									.on("click", function () {
										render(thizz.getNext(result), {
											answer: tool.answers[result],
											history: result
										});
										return false;
									});    							
							} else {
								$(thizz.answer)
									.prop("disabled", true)
									.off("click");
							}
						});
					} catch (ex) {
						console.log("Problem running tool " + id, ex);
					}
				} else {
					console.log("Problem running tool " + id + ": Missing init");
				}
			});
			
			// Trigger loading			
			iframe.src = "tools/" + id + ".htm";
		});
		
		return iframe;
	}
});



types.DateStanza = function (id, stanza) {
	types.QuestionStanza.call(this, id, stanza);
};

$.extend(types.DateStanza.prototype, Object.create(types.QuestionStanza.prototype), {
	getType: function () {
		return "date";
	},
		
	setDate: function (date) {	
		this.data.date = date;
	},
	
	getDate: function () {
		return this.data.date;
	},
	
	hasValidDate: function () {
		return ("date" in this.data && !isNaN(this.data.date));
	},
	
	hasAnswers: function () {
		return true;
	},
	
	getTimescaleDate: function(timescale) {
		var date = new Date();
		date.setHours(0, 0, 0, 0);
		var match = timescale.match(/^(\d+)\s+(working\s+)?(day|week)s?$/);
		var number;
		if (match) {
			number = parseInt(match[1], 10);
			if (match[2] !== undefined) {
				// Working days
				number *= (match[3] === 'week' ? 7 : 1);
				while (number > 0) {
					date.setDate(date.getDate() - 1);
					if (!Timescales.isBankHoliday(date) && date.getDay() !== 0 && date.getDay() !== 6) {
						number -= 1;
					}
				}
			} else {
				number *= (match[2] === 'week' ? 7 : 1);
				date.setDate(date.getDate() - number);
			}
		} else {
			// Always in working days
			date = Timescales.subtractWorkingDays(date, Math.round(5 * (Timescales.getRaw(timescale) / 7)));
		}
		return date;
	},
	
	replay: function (answer, onRender) {
		var next =  this.data.next[answer];		
		render(next, {
			answer: answer === 0 ? "inside" : "outside",
			history: answer
		}, onRender);		
	},
	
	moveOn: function () {
		var timescale, date = this.getDate(),  next, card, answer, history;
		date.setHours(0, 0, 0, 0);
		timescale = this.getTimescaleDate(this.data.timescale);
		
		if (date < timescale) {
			// Outside timescale
			history = 1;
			next = this.data.next[1];
			answer = 'outside';
		} else {
			// Within timescale
			history = 0;
			next = this.data.next[0];
			answer = 'inside';
		}
		
		render(next, {
			answer: this.getDate(),
			history: history
		});
			
		return false;
	},
	
	getAnswerCount: function() {
		return 1;
	},
	
	getAnswerText: function (index) {
		return (index === 0 ? 'inside' : 'outside') + " " + this.data.timescale;
	},
			
	getAnswer: function (index) {			
		var thizz = this;
		var answer = buildElement("button", "list-group-item list-group-item-action cmd-answer", 
			buildElement("div", undefined, 
				buildFA("arrow-circle-right"),
				" Continue"
			)
		);
		
		$(answer).prop("disabled", !this.hasValidDate());
		
		var next = this.getNext(index);
		
		answer.dataset.next = next;

		$(answer).on("click", this.moveOn.bind(this));

		return answer;
	},

	toHTML: function () {
		var scratch = buildElement("input", "form-control");
		scratch.type = "text";
		scratch.value = this.getDate() === undefined ? "" : formatDate(this.getDate());
		
		var thizz = this;
		var _onEvent = function () {
			$(scratch).datepicker("change", thizz.setDate.bind(thizz));
			$(scratch).datepicker("endDate", new Date());
			$(scratch).datepicker("close", function () {				
				if (thizz.hasValidDate()) {
					$(scratch).closest(".card").find(".cmd-answer").prop("disabled", false);
				} else {
					$(scratch).closest(".card").find(".cmd-answer").prop("disabled", true);
				}
			});
			$(scratch).datepicker("show");
		}.bind(this);
		
		$(scratch).on("focus", _onEvent);
		
		var button = buildElement("button", "btn btn-secondary", buildFA("calendar"));
		button.type = "button";
		$(button).on("click", _onEvent);

		var actionWords = arrayToHash(["ask", "check"]);
		var text = this.getText().split(" ");
		
		var result = buildElement("span", "question date" + (text[0].toLowerCase() in actionWords ? " action" : ""), 
			buildElement("span", "first", text.shift()),
			"\u00a0",
			text.join(" "),
	
			buildElement("span", "form-inline", 
				buildElement("div", "input-group ml-3 mb-3",
					scratch,
					buildElement("span", "input-group-button",
						button
					)
				)
			)
		);
		
		result.normalize();
					
		result.dataset.id = this.getIdString();
		
		if (this.data.howto) {
			attachHowto(result, this.data.howto);
		}
	

		return result;
	},
	
	getTabs: function () {
		var tabs = [this.buildAnswerTab(), this.buildLabelTab()];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		}
		
		return tabs.concat(this.getDefaultTabs());
	
	},
		
	buildAnswerTab: function () {
		if (!("next" in this.data)) {
			this.data.next = [undefined, undefined];
		}
						
		function _buildRow(when, index) {
			var row = buildElement("div", "list-group-item form-inline border-0 pl-0");

			var ipt = buildElement("input", "form-control ipt-answer-next")
			ipt.placeholder = "Destination";
			ipt.dataset.which = this.data.id;
			ipt.dataset.index = index;
			if ("next" in this.data && this.data.next[index] !== undefined) {
				ipt.value = this.data.next[index];	
			}
			
			row.appendChild(
				buildElement("div", "input-group mr-3", 
					buildElement("div", "input-group-addon", when),
					ipt
				)
			);
			
			row.appendChild(buildNextButton(this.data.next[index]));
			
			return row;
		}
		
		var input = buildElement("input", "form-control ipt-timescale");
		if ("timescale" in this.data) {
			input.value = this.data.timescale;
		}
		
		$(input)
			.autocomplete({
				source: Timescales.autocompleteSource,
			})
			.on("change blur", function () {
				var timescale = $(input).val();
				
				if (timescale !== undefined && timescale.length > 0) {
					this.data.timescale = timescale;				
				} else {
					delete this.data.timescale;
				}			
			}.bind(this));
		
		var div = buildElement("div", undefined, 
			buildElement("div", "input-group mr-3 mb-3",
					buildElement("div", "input-group-addon", "Timescale"),
					input
			),
			buildElement("hr", "mb-1 w-75"),
			buildElement("div", "list-group",
				_buildRow.bind(this)("Within timescale", 0),
				_buildRow.bind(this)("Outside timescale", 1)
			)
		);
		
		return ["Answers", div];
	}
});

types.AnnualCodingStanza = function (id, stanza) {
	types.Stanza.call(this, id, stanza);
};

$.extend(types.AnnualCodingStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "annual_coding";
	},
	
	isQuestion: function () {
		return false;
	},

	toHTML: function () {
		return buildElement("span", "hidden");
	},
	
	hasDisplay: function () {
		return false;
	},
	
	getNext: function () {
		var inside = this.isInside();
	
		if ($("body.preview").length > 0 && this.data.preview) {
			inside = !inside;
		}
			
		if (inside) {
			return this.data.next[0];
		} else {
			return this.data.next[1];
		}
	},
	
	getDates: function () {
		if ("dates" in this.data) {
			return this.data.dates;
		} else {
			// Historical remnent. This stanza type was originaly just for the Annual Coding Run
			// so if no dates are given, use Feb 1 to April 5.
			// Remmeber, months go from 0 - 11.
			return [1, 1, 3, 5];
		}
	},
	
	isInside: function () {
		var today = new Date();
		var startMonth, startDay, endMonth, endDay, thisMonth, thisDay, dates;
		
		dates = this.getDates();
		
		startMonth = dates[0];
		startDay   = dates[1];
		endMonth   = dates[2];
		endDay     = dates[3];
		
		thisMonth = today.getMonth();
		thisDay   = today.getDate();
		
		if (startMonth < endMonth || (startMonth === endMonth && startDay < endDay)) {
			// Excluding year end
			return ((thisMonth > startMonth || (thisMonth === startMonth && thisDay >= startDay)) && (thisMonth < endMonth || (thisMonth === endMonth && thisDay <= endDay)))
		} else if (startMonth > endMonth || (startMonth === endMonth && startDay > endDay)) {
			// Including year end
			return ((thisMonth > startMonth || (thisMonth === startMonth && thisDay >= startDay)) || (thisMonth < endMonth || (thisMonth === endMonth && thisDay <= endDay)))	
		} else if (startMonth === endMonth && startDay === endDay) {
			// Both start and end are the same date. Only inside on that date.
			return (thisMonth === startMonth && thisDay === startDay);
		}
	},
	
	getTabs: function () {				
		return [this.buildAnswerTab(), this.buildLabelTab()];
	},
	
	buildAnswerTab: function () {	
		if (!("next" in this.data)) {
			this.data.next = [undefined, undefined];
		}
						
		function _buildRow(when, index) {
			var row = buildElement("div", "list-group-item form-inline border-0 pl-0");

			var ipt = buildElement("input", "form-control ipt-answer-next")
			ipt.placeholder = "Destination";
			ipt.dataset.which = this.data.id;
			ipt.dataset.index = index;
			if ("next" in this.data && this.data.next[index] !== undefined) {
				ipt.value = this.data.next[index];	
			}
			
			row.appendChild(
				buildElement("div", "input-group mr-3", 
					buildElement("div", "input-group-addon", when),
					ipt
				)
			);
			
			var scratch = buildElement("div", "btn-group");
			var button, next;		
				
			if ("next" in this.data && !this.hasRouting()) {
				next = this.data.next[index];
				if (stanzaExists(next)) {
					button = buildElement("a", "btn btn-primary cmd-next", buildFA("chevron-right"));
					button.href = "#!q" + next;
				} else if (next !== undefined && next.match(RE.legacy)) {
					button = buildElement("a", "btn btn-primary text-white", buildFA(getIconType(next)));
					button.href = buildLegacyLink(next);
					button.target = "_blank";
					button.dataset.next = next;
					button.title = "External link. Click to open in new window";
				} else {
					button = buildElement("button", "btn btn-danger cmd-new", buildFA("chevron-right"));
					
					if (next !== undefined) {
						button.dataset.next = next;
					}
					
					button.title = "Stanza doesn't exist, click here to create";
				}
				
				scratch.appendChild(button);
			}
	
			row.appendChild(scratch);
			
			return row;
		}
				
		var tab = buildElement("div", "tab-annual-coding", 		
			buildElement("div", "list-group",
				_buildRow.bind(this)("Within ", 0),
				_buildRow.bind(this)("Outside", 1)
			)
		);
		
		return ["Answers", tab];
	},
	
	buildText: function () {
		var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var monthLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];		
		
		var i, option, fromMonthSelect, fromDaySelect, toMonthSelect, toDaySelect, block, dates, inside;
		
		dates = this.getDates();
	
		var input = buildElement("input", "form-check-input chk-override-annual-coding mr-3");
		input.type = "checkbox";
		if (this.data.preview) {
			input.checked = true;
		}
		
		var result = buildElement("div");
		
		// Help
		result.appendChild(buildElement("p", "help", "See help (? in top right of the stanza) for more information about using this stanza"));
		
		
		// From - Month
		block = buildElement("div", "form-inline mb-3",
			buildElement("label", "mr-3", "Start")
		);
		
		fromMonthSelect= buildElement("select", "form-control sel-from-month mr-3");
		
		for (i = 0; i < months.length; i += 1) {
			option = buildElement("option", undefined, months[i]);
			option.value = i;
			
			if (i === dates[0]) {
				option.selected = true;
			}
			
			fromMonthSelect.appendChild(option);
		}
		
		block.appendChild(fromMonthSelect);
		
		
		// From - Day
		fromDaySelect = buildElement("select", "form-control sel-from-day mr-3");
		for (i = 1; i <= 31; i += 1) {
			option = buildElement("option", undefined, i);
			if (i === dates[1]) {
				option.selected = true;
			}
			
			fromDaySelect.appendChild(option);
		}
		
		block.appendChild(fromDaySelect);
		
		result.appendChild(block);
		
		// To - Month		
		block = buildElement("div", "form-inline mb-3",
			buildElement("label", "mr-3", "End")
		);
		
		toMonthSelect= buildElement("select", "form-control sel-to-month mr-3");
		
		for (i = 0; i < months.length; i += 1) {
			option = buildElement("option", undefined, months[i]);
			option.value = i;
			
			if (i === dates[2]) {
				option.selected = true;
			}
			
			toMonthSelect.appendChild(option);
		}
		
		block.appendChild(toMonthSelect);
		
		// To - Day		
		toDaySelect = buildElement("select", "form-control sel-to-day mr-3");
		for (i = 1; i <= 31; i += 1) {
			option = buildElement("option", undefined, i);
			if (i === dates[3]) {
				option.selected = true;
			}
			
			toDaySelect.appendChild(option);
		}
		
		block.appendChild(toDaySelect);
		
		result.appendChild(block);	
		
		// show inside
		inside = buildElement("strong", undefined, this.isInside() ? "inside" : "outside");
		result.appendChild(buildElement("div", "mb-3", "Today is ", inside, " the date range."));
		
		$(result).on("change", "select", function () {
			var fromMonth = parseInt(fromMonthSelect.value, 10);
			var fromDay = parseInt(fromDaySelect.value, 10);
			var toMonth = parseInt(toMonthSelect.value, 10);
			var toDay = parseInt(toDaySelect.value, 10);									
			
			if (!isNaN(fromMonth) && !isNaN(fromDay) && !isNaN(toMonth) && !isNaN(toDay)) {
				this.data.dates = [fromMonth, fromDay, toMonth, toDay];
			}
		
			$(inside).text(this.isInside() ? "inside" : "outside");		
		}.bind(this));

		// Reverse test for preview
		result.appendChild(buildElement("div", "form-check", 
				buildElement("label", "form-check-label",
					input,
					" Reverse the check in preview mode for testing"
				)
			)
		);
		
		return result;
	},	
});

/**
	A third top level stanza type, not an instruction or a question.
	Asks the advsior for information to be added to the customer object. 
	
	Authors need to set:
		type	(text, currency, nino, custom (maybe later))
		help_text
		sets
		label
		placeholder
 */
types.InputStanza = function (id, stanza) {
	if (!("answers" in stanza)) {
		stanza.answers = [];
	}
	
	if (!("next" in stanza)) {
		stanza.next = [];
	}

	types.Stanza.call(this, id, stanza);
};

$.extend(types.InputStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "input";
	},
	hasAnswers: function () {
		return true;
	},
	isQuestion: function () {
		return true;
	},
	
	getAnswerText: function (index) {
		return "Continue";
	},
		
	isSelfRender: function () {
		return true;
	},
	getAnswerCount: function () {
		return 1;
	},
	getText: function () {
		return this.data.name;
	},
	
	isValid: function () {
		return true;
	},
	
	inputTypes: {
		"Text": {
			input: {
				type: "text",
				pattern: ".+"
			}
		},
		"Number": {			
			input: {
				type: "number",
				pattern: "\\d+"
			},
			convert: function (value) {
				return parseFloat(value);
			}
		},
		"NINO":	{
			input: {
				type: "text",
				placeholder: "AA123456A",
				pattern: "[A-Z]{2}\\d{6}[A-D]?"
			},
			help : "National Insurance numbers must be in upper case"
		},
		"Child Benifit Reference": {
			input: {
				type: "text",
				placeholder: "12345678AA",
				pattern: "\\d{8}[A-Z]{2}"
			},
			help : "Child Benifit reference numbers must be in upper case"
		},
		"Date": {
			input: {
				type: "text",
				placeholder: "dd/mm/yyyy",
				pattern: "\\d{2}/\\d{2}/\\d{4}"
			},
			convert: function (value) {
				return new Date(value);			
			}
		},
		"Currency": {
			input: {
				type: "number",
				step: "0.01",
				pattern: "\\d+(\.(\\d{2})?)?"
			},
			convert: function (value) {
				return parseFloat(value);
			}
		},
		"Postcode": {
			input: {
				type: "text",
				placeholder: "AA1 1AA",
				pattern: "[A-Z]{2}\\d{1,2}[A-Z]? \\d[A-Z]{2}"
			},
			help: "Postcodes must be in upper case"
		}	
	},
	
	getAnswer: function () {
		var thizz = this;
		var answerText = "Continue";

		var answer = buildElement("button", "list-group-item list-group-item-action cmd-answer", 
			buildElement("div", undefined, 
				buildFA("arrow-circle-right"),
				buildElement("span", undefined, answerText)
			)
		);
		
		var next = this.getNext(0);
		
		// This is mostly for humans to see if they're diagnosing problems.
		answer.dataset.next = next;
		
		// Handle clicks
		$(answer).on("click", function () {
			render(next, {
				answer: thizz.data.value,
				history: 0
			});
			return false;
		});
		
		$(answer).prop("disabled", !this.isValid());
		
		return answer;
	},
	
	updateValidationDisplay: function () {
		var input = this.data.input;
	
		if (input.checkValidity()) {
			$(input)
				.addClass("form-control-success")
				.removeClass("form-control-danger")
				.closest(".form-group")
				.addClass("has-success")
				.removeClass("has-danger");
		} else {
			$(input)
				.removeClass("form-control-success")
				.addClass("form-control-danger")
				.closest(".form-group")
				.removeClass("has-success")
				.addClass("has-danger");
		}
	},

	_buildNextTab: function () {
		var scratch, ul, i, div;
	
		var div = buildElement("div", undefined, buildAnswerInput(this, 0));

		$(div).find(".ipt-answer-text").prop("disabled", true);
		
		return ["Next", div];
	},
	
	getTabs: function () {
		return [this._buildNextTab(), this.buildLabelTab()];
	},
	
	validate: function (stanza) {
		
		var problems = [];
		if (!("label" in stanza) || stanza.label === "missing-label") {
			problems.push(["warn", "Missing label"]);
		}		
						
		if (!("ipt_type" in stanza)) {
			problems.push(["error", "Missing input type"]);
		}

		if (!("name" in stanza)) {
			problems.push(["error", "Missing name"]);
		}
		
		
		return problems;
	},
		
	buildFromLive: function (card) {
		var placeholder, $card;
		
		$card = $(card);
		
		var stanza = {};
	
		stanza.ipt_type =  $card.find(".sel-input-type").val() || "Text";
		stanza.name = $card.find(".ipt-input-name").val() || "Input";
		stanza.help = $card.find(".ipt-input-help").val();
		if (stanza.help === undefined || stanza.help === "") {
			delete stanza.help;
		}
		
		stanza.label = $card.find(".ipt-stanza-label").val() || "missing-label";
		
		placeholder = $card.find(".ipt-input-placeholder").val();
		if (placeholder !== undefined && placeholder.length > 0) {
			stanza.placeholder = placeholder;
		}
		
		stanza.next = [$card.find(".ipt-answer-next").val()];
	
		return stanza;
	},

	_buildInputGroup: function (input, name, help) {
		return buildElement("div", "form-group", 
				buildElement("div", "input-group mb-2",
					buildElement("span", "input-group-addon", name),
					input
				),
				buildElement("small", "form-text text-muted", help)	
			);
	},

	buildText: function () {
		var input, i, body, option;
	
		var types = Object.keys(this.inputTypes);
	
		var type = ("type" in this.data ? this.data.type : undefined);
	
		body = buildElement("div", "form-group");
		
		input = buildElement("select", "form-control sel-input-type");
		for (i =0; i < types.length; i += 1) {
			option = buildElement("option", undefined, types[i]);
			if ("ipt_type" in this.data && this.data.ipt_type === types[i]) {
				option.selected = true;
			}
			input.appendChild(option);
		}
		
		var thizz = this;
		
		function _typesChange() {
			var type = $(body).find(".sel-input-type").val();
			var key;

			thizz.data.ipt_type = type;

			if ("placeholder" in thizz.inputTypes[type].input) {
				$(body).find(".ipt-input-placeholder")
					.val(thizz.inputTypes[type].input.placeholder)
					.prop("disabled", true);
			} else {
				$(body).find(".ipt-input-placeholder")
					.val("placeholder" in thizz.data ? thizz.data.placeholder : "")
					.prop("disabled", false);
			}
			
			if ("help" in thizz.inputTypes[type]) {
				$(body).find(".ipt-input-help")
					.val(thizz.inputTypes[type].help)
					.prop("disabled", true);
			} else {
				$(body).find(".ipt-input-help")
					.val("help" in thizz.data ? thizz.data.help : "")
					.prop("disabled", false);
			}
				
		}		
		$(input).on("change", _typesChange);	
				
		body.appendChild(this._buildInputGroup(input, "Type", "The type of input. Some types automatically set validation rules"));

		input = buildElement("input", "form-control ipt-input-name validatable");
		
		if ("name" in this.data) {
			input.value = this.data.name;
		}
		
		input.type = "text";
		input.required = true;
		input.pattern = ".+";
		$(input).on("change blur keyup", function () {
			if (this.checkValidity) {
				thizz.data.name = this.value;
			} else {
				delete thizz.data.name;
			}
		});
				
		body.appendChild(this._buildInputGroup(input, "Name", "The text to the left of the input ('Name' in this case)"));

		input = buildElement("input", "form-control ipt-input-help validatable");

		if ("help" in this.data) {
			input.value = this.data.help;
		}
		
		input.type = "text";
		input.required = false;
		input.pattern = ".+";
		$(input).on("change blur keyup", function () {
			if (this.checkValidity) {
				thizz.data.help  = this.value;
			} else {
				delete thizz.data.help  ;
			}
		});

		body.appendChild(this._buildInputGroup(input, "Help text", "This text (small text placed under the input box) (Optional)"));

		input = buildElement("input", "form-control ipt-input-placeholder validatable");
		
		if ("placeholder" in this.data) {
			input.value = this.data.placeholder;
		}
		
		input.type = "text";
		input.required = false;
		input.pattern = ".+";
		$(input).on("change blur keyup", function () {
			if (this.checkValidity) {
				thizz.data.placeholder= this.value;
			} else {
				delete thizz.data.placeholder;
			}
		});
				
		body.appendChild(this._buildInputGroup(input, "Placeholder", "Example text that is shown to the user before they start typing into the input box (Optional)"));
		_typesChange();
		return body;
	},
	
	toHTML: function () {
		var label, input, result, thizz, help, key;

		thizz = this;
		
		help = this.data.help;
		
		label = this.data.label;
		
		input = buildElement("input", "form-control ipt-input validatable focus");
		input.required = true;
		
		if (label in customer) {
			input.value = customer[label];
		}
		
		if ("placeholder" in this.data) {
			input.placeholder = this.data.placeholder;
		}
		
		if (this.data.ipt_type in this.inputTypes) {
			for (key in this.inputTypes[this.data.ipt_type].input) {
				input[key] = this.inputTypes[this.data.ipt_type].input[key];
			}
			
			if ("help" in this.inputTypes[this.data.ipt_type]) {
				help = this.inputTypes[this.data.ipt_type].help;
			}		
		} else {
			input.type = "text";
			input.pattern = ".+";
		}
		
		// special case for dates
		if (this.data.ipt_type === "Date") {
			// Need to do this after everything has finished rendering
			// TODO: Find a better way
			setTimeout(function () {
				$(input).datepicker();
				$(input).datepicker("change", function () {
				    thizz.data.value = $(input).datepicker("getDate");
				});
			}, 25);
		}

		// Store a reference to the input box for later
		this.data.input = input;
		
		$(input).on("click blur keyup", this.updateValidationDisplay.bind(this));
		$(input).on("click blur keyup", function (e) {			
			if (this.checkValidity()) {
					
				if (thizz.data.ipt_type !== "Date") {
					thizz.data.value = this.value;
				}

				if ("convert" in thizz.inputTypes[thizz.data.ipt_type]) {
					thizz.data.value = thizz.inputTypes[thizz.data.ipt_type].convert(thizz.data.value);
				}

				customer[label] = thizz.data.value;

				$(input).closest(".card").find(".cmd-answer").prop("disabled", false);
			} else {
				if ("value" in thizz.data) {
					delete thizz.data.value;
				}
				if (label in customer) {
					delete customer[label];
				}
				
				$(input).closest(".card").find(".cmd-answer").prop("disabled", true);			
			}
			
			if (e.type === "keyup" && e.key === "Enter") {
				if (this.checkValidity()) {
					render(thizz.getNext(0), {
						answer: this.value,
						history: 0
					});				
				}
			}
		});

		result =  buildElement("div", "form-group",
			buildElement("div", "input-group mb-2",
				buildElement("span", "input-group-addon", this.data.name),
				input
			),
			buildElement("small", "form-text text-muted", help)
		);
		
		this.updateValidationDisplay();			
		result.dataset.id = this.getIdString();
		
		return result;
	}
});

types.ModuleStanza = function (id, stanza) {
	if (!("next" in stanza)) {
		stanza.next = [];
	}
	
	types.Stanza.call(this, id, stanza);
};

$.extend(types.ModuleStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "module";
	},
	hasAnswers: function () {
		return false;
	},	
	hasDisplay: function () {
		return false;
	},
	
	getModule: function () {
		return this.data.process;
	},
	
	rewrite: function (process) {
		var id, stanza, i;
		
		for (id in process.flow) {
			stanza = process.flow[id];
		 	if ("next" in stanza) {
		 		for (i = 0; i < stanza.next.length; i += 1) {
		 			if ("from" in stanza) {
			 			if (stanza.next[i][stanza.from.length] === "end") {
			 				stanza.next[i][stanza.from.length] = this.data.next[0];
			 			}
		 			} else {
			 			if (stanza.next[i] === "end") {
			 				stanza.next[i] = this.data.next[0];
			 			}
		 			}
			 		
			 	}
			 }		
		}	
	},
	
	getNext: function (index) {
		return this.data.next[0];
	},
	
	_validate: function (input) {
		if (input.checkValidity()) {
			$(input)
				.addClass("form-control-success")
				.removeClass("form-control-danger")
				.closest(".input-group")
				.addClass("has-success")
				.removeClass("has-danger");
				return true;
		} else {
			$(input)
				.removeClass("form-control-success")
				.addClass("form-control-danger")
				.closest(".form-group")
				.removeClass("has-success")
				.addClass("has-danger");
				return false;
		}
	},
	
	validate: function (stanza) {
		
		var problems = [];
		if (!("process" in stanza)) {
			problems.push(["error", "Missing process"]);
		} else if (!stanza.process.match(RE.ocelot)) {
			problems.push(["error", "Invalid process reference"]);
		}
				
		return problems;
	},

	buildFromLive: function (card) {
		var $card = $(card);
		var stanza = {};
		
		stanza.process = $card.find(".ipt-module-process").val();		
		stanza.next = [$card.find(".ipt-answer-next").val()];
	
		return stanza;	
	},
	
	buildText : function () {
		var thizz = this;
		var result = buildElement("div");
		
		var input = buildElement("input", "form-control form-control-danger ipt-module-process");
		input.placeholer = "lob90001";
		input.pattern = "[a-z]{3}[79]\\d{4}";
		input.required = true;
		input.type = "text";
		$(input).on("change blur keyup", function () {
			if (thizz._validate(input)) {
				thizz.data.process = input.value;
			} else {
				delete thizz.data.process;
			}
		});
						
		if ("process" in this.data) {
			input.value = this.data.process;
		}
						
		result.appendChild(
			buildElement("div", "input-group has-danger",
				buildElement("span", "input-group-addon", "Process"),
				input
			)
		);
		
		return result;

	},	
	
	buildNextTab: function () {
		var scratch = buildElement("div", "form-inline d-flex",
			buildNextInput(this, 0, this.getNext(0)),
			buildNextButton(this.getNext(0))
		);
		return ["Next stanza", scratch];
	},
	
	getTabs: function () {
		return [this.buildNextTab()];
	}
});

types.ChoiceStanza = function (id, stanza) {
	if (!("next" in stanza) || stanza.next.length === 0) {
		stanza.next = [undefined];
	} 
	
	types.Stanza.call(this, id, stanza);
};

$.extend(types.ChoiceStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "choice";
	},

	hasDisplay: function () {
		return false;
	},
	
	_tests: {
        "equals":           function (left, right) { return left == right}, 
        "notEquals":        function (left, right) { return left != right}, 
        "moreThan":         function (left, right) { return left >  right},
        "moreThanOrEquals": function (left, right) { return left >= right},
        "lessThan":         function (left, right) { return left <  right}, 
        "lessThanOrEquals": function (left, right) { return left <= right}, 
        "contains":         function (left, right) { return left.indexOf(right) !== -1 }, 
        "doesNotContain":   function (left, right) { return left.indexOf(right) === -1 },
        "startsWith":       function (left, right) { return left.substring(0, right.length) === right }, 
        "endsWith":         function (left, right) { return left.substr(-right.length) === right },
        "always":           function () { return true; },
        "never":            function () { return false; }
	},
	
	_checkPlaceholders: function (input) {
        var result = getPlaceholderValue(input);
        
        if (result instanceof Date) {
            result = result.getTime();
        }
        return result;	    
	},
		
	getNext: function (index) {
		var i, condition, left, right;
		for (i = 0; i < this.data.tests.length; i += 1) {
			condition = this.data.tests[i];
			
            left = this._checkPlaceholders(("label" in condition ? condition.label : condition.left));
            right = this._checkPlaceholders(("given" in condition ? condition.given : condition.right));
            
            if (left === undefined) {
                console.warn("Choice: " + ("label" in condition ? condition.label : condition.left) + " not found");
                continue;
            }
            
            if (right === undefined) {
                console.warn("Choice: " + ("given" in condition ? condition.given : condition.right) + " not found");
                continue;
            }
			
		    console.log("Choice: Comparing ", left, condition.test, right);
            if (condition.test in this._tests && this._tests[condition.test](left, right)) {
                return this.data.next[i];
            }		
		}
		
		// No conditions have matched, go with the default
		return this.data.next[this.data.tests.length];
	},
	
	getTabs: function () {
		var tabs = [this.buildAnswerTab(), this.buildLabelTab()];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		}
		
		return tabs.concat(this.getDefaultTabs());
	
	},
	
	buildText: function () {
		return buildElement("div", undefined, 
			buildElement("p", undefined, "Add conditions using the button below. The next stanza will be from the first condition that matches, or the default if nothing matches.")
		);
	},
	
	validate: function (stanza) {		
		var problems = [];

		var i, condition;
		if ("tests" in stanza) {
			for (i = 0; i < stanza.tests.length; i += 1) {
				condition = stanza.tests[i];
				
				if (!("left" in condition) || condition.left === undefined || condition.left === "") {
					problems.push(["error", "Missing left hand side in condition " + (i + 1)]);
				}
				
				if (!("test" in condition) || condition.test === undefined || condition.test === "") {
					problems.push(["error", "Missing test in condition " + (i + 1)]);
				}
				
				if (!("right" in condition) || condition.right === undefined || condition.right === "") {
					problems.push(["error", "Missing right hand side in condition " + (i + 1)]);
				}
				
				if (stanza.next[i] === undefined) {
					problems.push(["error", "Missing next for condition " + (i + 1)]);
				}			
			}
			
			if (stanza.next[stanza.tests.length] === undefined) {
				problems.push(["error", "Default not set"]);			
			}
		} else {
			problems.push(["warn", "No condition set"]);
		}
		
		return problems;
	},

	buildFromLive: function (card) {
		var $card = $(card);
		var $rows = $card.find(".row-choice-test");
		
		var stanza = {};
		var defaultNext;
		
		stanza.next = [];
		stanza.tests = [];
		
		$rows.each(function (index) {
			var $row = $(this);
			var condition = {};
			var next = $row.find(".ipt-answer-next").val();
   		
			if (index < ($rows.length - 1)) {			
    			condition.left = $row.find(".ipt-choice-label").val();
    			condition.test  = $row.find(".sel-choice-test" ).val();
    			condition.right = $row.find(".ipt-choice-given").val();
    			    			
    			stanza.tests.push(condition);
    		}
    		
    		stanza.next.push(next === "" ? undefined : next);			
		});
		
		return stanza;	
	},
	
	_buildNextInput: function(next) {
		var input = buildElement("input", "form-control ipt-answer-next");
		input.type = "text";
		input.placeholder = "Destination";
		if (next !== undefined ) {
			input.value = next;
		}
			
		return buildElement("div", "input-group mr-3",
			buildElement("div", "input-group-addon", "Goes to"),
			input
		);	
	},
		
	_buildConditionRow: function(condition, index) {
		var row, input, i, option, next, button, scratch, test;
	
		row = buildElement("li", "list-group-item form-inline border-0 row-choice-test", buildElement("span", "mr-2", index === 0 ? "If" : "Else if"));
		row.style.top = 0;
		
		input = buildElement("input", "form-control ipt-choice-label mr-2");
		input.placeholder = "label";
		input.style.flexGrow = 2;
		input.required = true;
		input.pattern = ".+";
		input.type = "text";
		if ("left" in condition) {
			input.value = condition.left;
		} else if ("label" in condition) {
		    input.value = condition.label;
		}
		
		row.appendChild(input);
		
		input = buildElement("select", "form-control sel-choice-test mr-2");
		for (test in this._tests) {
			option = buildElement("option", undefined, test);
			if ("test" in condition && condition.test === test) {
				option.selected = true;
			}
			input.appendChild(option);
		}
		
		row.appendChild(input);
		
		input = buildElement("input", "form-control ipt-choice-given mr-2");
		input.placeholder = "value";
		input.style.flexGrow = 2;
		input.required = true;
		input.pattern = ".+";
		input.type = "text";
		if ("right" in condition) {
			input.value = condition.right;
		} else if ("value" in condition) {
		    input.value = condition.value;
		}

		row.appendChild(input);
		row.appendChild(buildElement("span", "mr-2", "then"));
		
		if ("next" in this.data) {
			next = this.data.next[index];
		}
		
		row.appendChild(buildNextInput(this, undefined, next));
		
		row.appendChild(
			buildElement("div", "btn-group",
				buildElement("button", "btn btn-primary cmd-choice-test-up", buildFA("arrow-up")),
				buildElement("button", "btn btn-primary cmd-choice-test-down mr-1", buildFA("arrow-down")),
				buildNextButton(next),
				buildElement("button", "btn btn-primary cmd-choice-test-delete ml-1", buildFA("trash"))
			)
		);
	
		return row;
	},
	
	buildAnswerTab: function () {	
		var div, i, condition, list, thizz, testCount, defaultNext, defaultRow;
		thizz = this;
		
		div = buildElement("div");
		list = buildElement("ul", "list-group list-group-flush");
		if ("tests" in this.data) {
			testCount = this.data.tests.length;
			for (i = 0; i < testCount; i += 1) {
				list.appendChild(this._buildConditionRow(this.data.tests[i], i));
			}
		} else {
			testCount = 0;
		}
		
		$(div).on("click", ".cmd-choice-test-up", function () {
			var me = $(this).closest(".row-choice-test");
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
			});
		
		}).on("click", ".cmd-choice-test-down", function () {
			var me = $(this).closest(".row-choice-test");
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
			});
		
		}).on("click", ".cmd-choice-test-delete", function () {
		    var target;
			var $row = $(this).closest(".row-choice-test");			
			var next = $row.find(".ipt-answer-next").val();

            thizz.data.next.splice($row.index(), 1);

			if (stanzaExists(next)) {
                target = getStanza(next);
                updateFootprints(target);
        		markDirty(target.data.id);
			}
			
			$row.remove();
		});

		if ("next" in this.data) {
			defaultNext = this.data.next[testCount];
		}

        defaultRow = buildElement("li", "list-group-item form-inline border-0 row-choice-test",
			buildElement("span", "mr-2", "Else"),
		    buildNextInput(this, undefined, defaultNext),
			buildNextButton(defaultNext)
		)
		
		list.appendChild(defaultRow);

		div.appendChild(list);
		
		var button = buildElement("button", "btn btn-primary cmd-choice-add-condition", "Add new condition");
		button.dataset.which = this.data.id;
		$(button).on("click", function () {
		    var index = thizz.data.next.length - 1;
		    thizz.data.next.splice(-1, 0, undefined);
			list.insertBefore(thizz._buildConditionRow({}, index), defaultRow);
		});
		
		div.appendChild(buildElement("div", "mb-sm-3", button));
		return ["Answers", div];
	},
		
	replay: function(answer, onRender) {
        render(this.data.next[answer],
            {answer: "Choice", history: answer},
            onRender
        );
	}

});

types.SequenceStanza = function (id, stanza) {
	if (!("next" in stanza) || stanza.next.length === 0) {
		stanza.next = [undefined];
	} 
	
	types.Stanza.call(this, id, stanza);
};

$.extend(types.SequenceStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "sequence";
	},
			
	isSelfRender: function () {
		return true;
	},
	
	hasAnswers: function () {
		return true;
	},
			
	getAnswerText: function () {
		return "Continue";
	},
	
	isQuestion: function () {
		return true;
	},

	getAnswerCount: function() {
		return 1;
	},
	
	getNext: function (index) {
        // Index is (probably) a power of two
        
        return this.data.next[(this.data.next.length - 2) - Math.log2(index)];
	},
	
	getTabs: function () {
		var tabs = [this.buildAnswerTab(), this.buildLabelTab()];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		}
		
		return tabs.concat(this.getDefaultTabs());
	
	},
	
	buildText: function () {
		var text = buildElement("textarea", "form-control ipt-text", this.getText());
		text.setAttribute("spellcheck", "true");
		text.dataset.which = this.data.id;
		
		return buildElement("div", undefined, 
			buildElement("p", undefined, "The text below will be shown to the adviser as a prompt."),
            buildElement("div", "input-group mr-3", text),
			buildElement("p", undefined, "Add choices to the list below. Advisers can choose some, all, or none to follow.")       
		);		
	},	
	
	validate: function (stanza) {		
		return [];
	},

	buildFromLive: function (card) {
        var $card = $(card);
		var $rows = $card.find(".row-sequence-option");
		
		var stanza = {};
		var defaultNext;
		
		stanza.next = [];
		stanza.options = [];
		
		$rows.each(function (index) {
			var $row = $(this);
			var next = $row.find(".ipt-answer-next").val();
   		
			if (index < ($rows.length - 1)) {
			    stanza.options.push( $row.find(".ipt-option-label").val() );
    		}
    		
    		stanza.next.push(next === "" ? undefined : next);			
		});
		
		return stanza;	
	},

	_buildOptionRow: function(option, next) {
	   var row, input, i, option, button, scratch;
	
		row = buildElement("li", "list-group-item form-inline border-0 row-sequence-option");
		row.style.top = 0;
		
		input = buildElement("input", "form-control ipt-option-label mr-2");
		input.placeholder = "Name (for adviser)";
		input.style.flexGrow = 2;
		input.required = true;
		input.pattern = ".+";
		input.type = "text";
		if (option !== undefined) {
			input.value = option;
		}
		
		row.appendChild(input);
		
		row.appendChild(buildNextInput(this, undefined, next));
		
		row.appendChild(
			buildElement("div", "btn-group",
				buildElement("button", "btn btn-primary cmd-option-up", buildFA("arrow-up")),
				buildElement("button", "btn btn-primary cmd-option-down mr-1", buildFA("arrow-down")),
				buildNextButton(next),
				buildElement("button", "btn btn-primary cmd-option-delete ml-1", buildFA("trash"))
			)
		);
	
		return row;

	},
	
	buildAnswerTab: function () {	
		var thizz, div, list, i, optionCount, defaultRow;
		thizz = this;
		
		if (!("next" in this.data)) {
		    this.data.next = [undefined];
		}
		
		div = buildElement("div");
		list = buildElement("ul", "list-group list-group-flush");
		if ("options" in this.data) {
			optionCount = this.data.options.length;
			for (i = 0; i < optionCount ; i += 1) {
				list.appendChild(this._buildOptionRow(this.data.options[i], this.data.next[i]));
			}
		} else {
			optionCount = 0;
		}
		
		$(list).on("click", ".cmd-option-up", function () {
			var me = $(this).closest(".row-sequence-option");
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
			});
		
		}).on("click", ".cmd-option-down", function () {
			var me = $(this).closest(".row-sequence-option");
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
			});
		
		}).on("click", ".cmd-option-delete", function () {
		    var target;
			var $row = $(this).closest(".row-sequence-option");			
			var next = $row.find(".ipt-answer-next").val();

            thizz.data.next.splice($row.index(), 1);

			if (stanzaExists(next)) {
                target = getStanza(next);
                updateFootprints(target);
        		markDirty(target.data.id);
			}
			
			$row.remove();
		});
        
        defaultRow = buildElement("li", "list-group-item form-inline border-0 row-sequence-option",
			buildElement("span", "mr-2", "And then"),
		    buildNextInput(this, undefined, this.data.next[optionCount]),
			buildNextButton(this.data.next[optionCount])
		)
		
		list.appendChild(defaultRow);

		div.appendChild(list);
		
		var button = buildElement("button", "btn btn-primary cmd-sequence-add-option", "Add new option");
		button.dataset.which = this.data.id;
		$(button).on("click", function () {
		    thizz.data.next.splice(-1, 0, undefined);
			list.insertBefore(thizz._buildOptionRow(), defaultRow);
		});
		
		div.appendChild(buildElement("div", "mb-sm-3", button));
		return ["Answers", div];
	},

	replay: function (ans, onRender) {
	    // History comes as an Int. We need a list of bits
	    // where each true bit is a selection from the sequence
	    // Add padding to make sure we get any missing leading zeros
	    
	    var bits = pad(ans.toString(2), this.data.options.length)
	    var i;
	    
	    for (i = 0; i < bits.length; i +=1 ) {
	        this.data.checkboxes[i].checked = (bits[i] === "1");	    
	    }
	    
	    this._handleAnswerClick(onRender);
	},
	
    _cloneTree: function(node, index, visited) {

		if (node.data.type === "EndStanza") {
			return getProcessId() + "-end";
		}
		
		if (node.data.id in visited) {
			return visited[node.data.id];
		}

		var i, target;
		var clone = JSON.parse(JSON.stringify(node.data));
		

		clone.id = [this.getIdString(), index, node.data.id].join("-");
		
		visited[node.data.id] = clone.id;
		
		clone = addStanza(clone.id, clone);
		
        for (i = 0; i < clone.data.next.length; i += 1) {
            if (clone.hasRouting()) {
                target = clone.data.next[i][clone.data.from.length];
            } else {
                target = clone.data.next[i];
            }
            
      	    // Fix a JSON bug - undefineds get converted to null            
            if (target === null) {
	            if ("from" in clone) {
	                clone.data.next[i][clone.data.from.length] = undefined;
	            } else {
	                clone.data.next[i] = undefined;
	            }
	            target = undefined;
            }
            
            if (target === undefined) {
                continue;
            }           
            
            if (target !== this.id && stanzaExists(target)) {
                if (clone.hasRouting()) {
                    clone.data.next[i][clone.data.from.length] = this._cloneTree(getStanza(target), visited);
                } else {
                    clone.data.next[i] = this._cloneTree(getStanza(target), index, visited);
                }            
            }                           
        }
        
        if (clone.data.id === null) {
            debugger;
        }
		
		return clone.data.id;	
	},
	
	_replaceEnds: function (start, replace) {	    
	    var queue = [start], next, stanza, i, visited = {}, target;
	    
	    while (queue.length > 0) {
	        next = queue.shift();
    	    
    	    if (!stanzaExists(next)) {
    	        continue;
    	    }
    	    
	        visited[next] = true;	        	      
	        
	        stanza = getStanza(next);
	        
	        for (i = 0; i < stanza.data.next.length; i += 1) {
	            if (stanza.hasRouting()) {
	                target = stanza.data.next[i][stanza.data.from.length];
	            } else {
	                target = stanza.data.next[i];
	            }
	            	            
	            if (target === undefined) {
	                continue;	            
	            }
	            
	            if (target.substr(-3) === "end") {
    	            if (stanza.hasRouting()) {
    	                stanza.data.next[i][stanza.data.from.length] = replace;
    	            } else {
    	                stanza.data.next[i] = replace;
    	            }
	            } else if (!(target in visited)) {
	                queue.push(target);
	            }
	        }	        	    	    
	    }	
	},
	
	_replacePlaceholders: function (text) {
	    var dom = buildElement("div", undefined, text);
	    replacePlaceholders(dom);
	    return $(dom).text();	
	},
	
	_handleAnswerClick: function (onRender) {
	    var target, next, box, i, last, seq, tree, returnStanza, label, names, moduleStanza, labelName, label_seqName;

        labelName = "label" in this.data ? this.data.label : "sequence.label";
        label_seqName = labelName + "_seq";
	    
	    if (!("seq" in this.data)) {
	        // First time through, setup all the possible routes out.
	        this.data.seq = [];
	        this.data.seqCounter = 0;
	    
    	    for (i = 0; i < this.data.options.length; i += 1) { 
	            target = this.data.next[i];
	            
                label = this._replacePlaceholders(this.data.options[i]);
                
                // A specilaist hidden stanza that knows how to open the 
                // next in the sequence
                returnStanza = {
        			type: "SequenceReturnStanza",
        			next: [],
        			name: label,
        			labelName: labelName,
        			text: this.data.text,
        			id: this.getIdString() + "-" + this.data.seqCounter++
        		};
                addStanza(returnStanza.id, returnStanza);
                
                if (target === undefined) {
                    // Target hasn't been set.
                    console.warn("Missing next stanza in " + this.data.id);
                    tree = returnStanza.id;
                
                } else if (target.match(RE.ocelot)) {
                    // Delagate loading modules to the module stanza
                    moduleStanza = {
            			type: "ModuleStanza",
            			next: [returnStanza.id],
            			process: target,
            			id: this.getIdString() + "-" + this.data.seqCounter++
            		};
                    addStanza(moduleStanza.id, moduleStanza);
                    tree = moduleStanza.id;
                    target += "-start";
                } else if (target.substr(-4) === "-end") {
                    tree = returnStanza.id;  
                } else {
                    // Internal sequence, copy the existing stanzas
                    // and replace the ends with the returnStanza
                    tree = this._cloneTree(getStanza(target), i, {});
	                this._replaceEnds(tree, returnStanza.id);	                    
                }
                
                this.data.seq.push( { 
                    tree: tree,
                    label: label,
                    id: returnStanza.id
                });                
    	    }   
        }


        var history = 0;

        // For this particular click, find out which options have been selected
	    var seq = [];        
        for (i = 0; i < this.data.checkboxes.length; i += 1) {
            history *= 2;
            box = this.data.checkboxes[i];        
            if (box.checked) {
                history += 1;
                seq.push(this.data.seq[i]);
            } 
       }

        // Update the selected options with the correct next stanza.
	    names = [];
	    for (i = 0; i < seq.length; i += 1) {
	        // If we're not the last in the sequence, pick the top of the next in the sequence
	        // Else, pick our 'next' stanza
	    
	        next = i < (seq.length - 1) ? seq[i + 1].tree : this.data.next[this.data.next.length - 1];
	        returnStanza = getStanza(seq[i].id);
	        
	        names.push(returnStanza.data.name);
	        
	        returnStanza.data.next[0] = next;
	        if (i < seq.length -1) {
    	        returnStanza.data.label = seq[i + 1].label;
    	    } else {
    	       returnStanza.data.label = undefined;
    	    }
	    }
	    
	    customer[label_seqName] = names.join(" ");
	    
	    // Actualy trigger next render.
	    if (seq.length > 0) {
    	    customer[labelName] = seq[0].label;
       	    render(seq[0].tree, {answer: names.join(", "), history: history}, onRender);
       	} else {
       	    render(this.data.next[this.data.next.length - 1], {answer: 'None', history: history}, onRender);
       	}
	},
	
	getAnswer: function () {			
		var answer = buildElement("button", "list-group-item list-group-item-action cmd-answer", 
			buildElement("div", undefined, 
				buildFA("arrow-circle-right"),
				buildElement("span", undefined, "Continue")
			)
		);
				
		$(answer).on("click", this._handleAnswerClick.bind(this));
			
		return answer;
	},
	
	toHTML: function () {
	    var textDiv, outer, list, i, checkbox;
		var text = this.getText();
		
		outer = buildElement("div", "not-instruction sequence");
		outer.dataset.id = this.getIdString();
	
		text = this.getText().split(" ");
		
		textDiv = buildElement("span", this.getType(), 
			buildElement("strong", "first", text.shift()),
			" ",
			text.join(" ")
		)			
		
		if (this.data.howto) {
			attachHowto(textDiv, this.data.howto);
		}
		
		list = buildElement("ul", "list-group list-group-flush");
		
		if (!("checkboxes" in this.data)) {
    		this.data.checkboxes = [];
    	}
		
		for (i = 0; i < this.data.options.length; i += 1) {
		    checkbox = buildElement("input", "form-check-input");
		    
		    checkbox.checked = this.data.checkboxes[i] !== undefined ? this.data.checkboxes[i].checked : true;
		    checkbox.type = "checkbox";
		    checkbox.dataset.next = this.data.next[i];
		    
		    this.data.checkboxes[i] = checkbox;
		    
		    list.appendChild(
		        buildElement("li", "list-group-item list-group-item-action",
		            buildElement("div", " form-check form-check-inline w-100",
    		            buildElement("label", "form-check-label w-100",
    		                checkbox,
    		                this.data.options[i]
    		            )
    		        )
		        )
		    );
		}
				
		outer.appendChild(textDiv);
		outer.appendChild(list);
		
		return outer;
	}

});

types.SequenceReturnStanza = function (id, stanza) {
	types.Stanza.call(this, id, stanza);
};

$.extend(types.SequenceReturnStanza.prototype, Object.create(types.Stanza.prototype), {
	getType: function () {
		return "sequence-return";
	},
			
	hasDisplay: function () {
		return false;
	},
			
	isQuestion: function () {
		return false;
	},
	
	hasAnswers: function () {
		return false;
	},
	
	getAnswerCount: function () {
	    return 0;
	},
	    
	getAnswer: function () {			

		var label = this.data.label;
		var answer = buildElement("button", "list-group-item list-group-item-action cmd-answer", 
			buildElement("div", undefined, 
				buildFA("arrow-circle-right"),
				buildElement("span", undefined, label !== undefined ? "Continue to " + label : "Continue")
			)
		);
		
		var next = this.data.next[0];
		var name = this.data.name;
		var labelName = this.data.labelName;

		$(answer).on("click", function () {
		    if (label !== undefined) {
    		    customer[labelName] = label;
    		} else {
    		    delete customer[labelName];
    		}
		    render(next, { answer: name, history: 0});
		});
			
		return answer;
	},
	
	replay: function(answer, onRender) {
	    render(this.data.next[0],
	        {answer: this.data.name,
	         history: answer},
	         onRender);	
	}
});

types.CalculationStanza = function (id, stanza) {
	types.Stanza.call(this, id, stanza);
};

$.extend(types.CalculationStanza.prototype, Object.create(types.Stanza.prototype), {
    operators: {
        "add":      function (l, r) { return l + r; },
        "subtract": function (l, r) { return l - r; },
        "multiply": function (l, r) { return l * r; },
        "divide":   function (l, r) { return l / r; },
        "remander": function (l, r) { return l % r; },
        "power":    function (l, r) { return Math.pow(l, r); }
    },

	getType: function () {
		return "calculation";
	},
			
	hasDisplay: function () {
		return false;
	},
	
	hasAnswers: function () {
		return false;
	},

    getNext: function () {
        this._doCalculation();
        return this.data.next[0];    
    },
    
    getTabs: function () {
		var tabs = [this._buildAnswerTab()];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		}
		
		return tabs.concat(this.getDefaultTabs());	
	},
    
    buildText: function () {
        return buildElement("div", undefined,
            buildElement("p", undefined, 
                "Click the button to add a row. Fill in the left and right hand side of the sum, ",
                "and add the name of the label to store the answer."
            ),
            buildElement("p", undefined, "This stanza doesn't change the flow of your process")
        );
    },
    
    buildFromLive: function (card) {
        var $card = $(card);
        var stanza = {}
        var calcs = [];
        
        $card.find(".row-calc").each(function () {
            var $row = $(this);

            var names = ["left", "op", "right", "label"];
            var i, name, calc;
            
            calc = {};
                      
            for (i = 0; i < names.length; i += 1) {
                name = names[i];
                calc[name] = $row.find(".ipt-calc-" + name).val();            
            }
            
            calcs.push(calc);
        });
        
        if (calcs.length > 0) {
            stanza.calcs = calcs;
        }
        
        stanza.next = [$card.find(".ipt-answer-next").val()];
        
        return stanza;
    },
    
    validate: function (stanza) {
        var names = {
            left: "Left hand side",
            right: "Right hand side",
            op: "Operator",
            label: "Destination label"
        }        
        
        var i, problems = [], calc, name;
    
        if ("calcs" in stanza) {
            for (i = 0; i < stanza.calcs.length; i += 1) {
                calc = stanza.calcs[i];                                
                for (name in names) {
                    if (!(name in calc) || calc[name] === undefined || calc[name].length === 0) {
                        problems.push(["error", "Missing " + names[name]]);
                    }                                    
                }
            }
        } else {
            problems.push(["warn", "Calculation stanza with no calculations"]);
        }
        
        return problems;
    },
    

    _buildRow: function (calc) {
        var inputs, row, op;
        inputs = {};
               
        function _buildInput(calc, name, placeholder) {
            var input = buildElement("input", "form-control mr-2 ipt-calc-" + name);
            input.type = "text";
            input.placeholder = placeholder;
            input.required = true;
            input.pattern = ".+";
            if (calc && name in calc) {
                input.value = calc[name];
            }
            return input;
        }
        
        function _buildOps(calc, operators) {
            var select, option
            select = buildElement("select", "form-control mr-2 ipt-calc-op");
            for (op in operators) {
                option = buildElement("option", undefined, op);
                if (calc && "op" in calc && calc.op === op) {
                    option.selected = true;
                }
                select.appendChild(option);
            }
            return select;        
        }
        
        inputs.left  = _buildInput(calc, "left", "Left");
        inputs.left.style.flexGrow = 2;
        inputs.right = _buildInput(calc, "right", "Right");
        inputs.right.style.flexGrow = 2;
        inputs.label = _buildInput(calc, "label", "Label");
        
        inputs.op = _buildOps(calc, this.operators);        
                
        return buildElement("li", "list-group-item form-inline border-0 row-calc",
            inputs.left,
            inputs.op,
            inputs.right,
            buildElement("span", "mr-2", "into"),
            inputs.label,
            buildRowControls("calc", "Calculation stanza controls")
        );                        
    },
    
    _buildAnswerTab: function () {
        var i, rows, button, next, tab, defaultNext, thizz;
        thizz = this;
        
        tab = buildElement("div", "tab-calc");
        
        rows = buildElement("ul", "list-group calc-rows");
        
        if ("calcs" in this.data) {
            for (i = 0; i < this.data.calcs.length; i += 1) {
                rows.appendChild(this._buildRow(this.data.calcs[i]));                
            }
        }
        
        if ("next" in this.data) {
            defaultNext = this.data.next[0];
        }
        
        next = buildElement("li", "list-group-item form-inline border-0",
            buildElement("span", "mr-2", "Next"),
		    buildNextInput(this, undefined, defaultNext),
			buildNextButton(defaultNext)
        );
        
        rows.appendChild(next);
        tab.appendChild(rows);
        
        var button = buildElement("button", "btn btn-primary cmd-choice-add-condition", "Add new calculation");
		button.dataset.which = this.data.id;
		$(button).on("click", function () {
			rows.insertBefore(thizz._buildRow(), next);
		});
		
		buildRowControlHanlders(tab, "calc");
		
		tab.appendChild(buildElement("div", "mb-3", button));                
        
        return ["Calculations", tab];
    },
        
    _getOperator: function (opName) {
        if (opName in this.operators) {
            return this.operators[opName];
        } else {
            throw new Error("Unknown operator " + opName);
        }
    },
    
    intervalRE: /(\d+)\s*(day|week|month|year)s?/,
    
    _dateMaths: function (l, r, op) {

        var match, i, parts, number, date;       
        
        match = r.match(RegExp(this.intervalRE, 'g'))
          
        date = new Date(l);
    	for (i = 0; i < match.length; i += 1) {
    		parts = match[i].match(this.intervalRE);
    		number = parseInt(parts[1], 10);
    		switch (parts[2]) {
    			case "day":
    				date.setDate(op(date.getDate(), number));
    				break;
    	        case "week":
    	        	date.setDate(op(date.getDate(), number * 7));
    	        	break;
    	        case "month":
    	            date.setMonth(op(date.getMonth(), number));
    	            break;
    	        case "year":
    	            date.setFullYear(op(date.getFullYear(), number));
    	            break;        
    		}
    	}
    	return date;
    },
    
    
    _doCalculation: function () {
        var i, calc, left, op, right, result;
        
        if (!("calcs" in this.data)) {
            return;
        }
        
        for (i = 0; i < this.data.calcs.length; i += 1) {
            calc = this.data.calcs[i];
            
            try {
                op = this._getOperator(calc.op);
                left = getPlaceholderValue(calc.left);
                right = getPlaceholderValue(calc.right);
                
                if (left instanceof Date) {
                    if (typeof right === "string" && right.match(this.intervalRE)) {
                        result = this._dateMaths(left, right, op); 
                    } else if (typeof right === "number") {
                        result = new Date(left);
                        if (calc.op === "add") {
                            result.setDate(result.getDate() + right);
                        } else if (calc.op === "subtract") {
                            result.setDate(result.getDate() - right);
                        } else {
                            result = op(left, right);
                        }
                    } else if (right instanceof Date && calc.op === "subtract") {
                        result = (left.getTime() - right.getTime()) / (1000 * 60 * 60 * 24);
                    } else {
                        result = op(left, right);
                    }
                } else {    
                    result = op(left, right);            
                }
                
                customer[calc.label] = result;        

            } catch (e) {
                console.warn("Problem with calculation at stanza " + this.data.id, e);
                continue;
            }
        }
    },    
});

types.ValueStanza = function (id, stanza) {
	types.Stanza.call(this, id, stanza);
};

$.extend(types.ValueStanza.prototype, Object.create(types.Stanza.prototype), {
    
    getType: function () {
		return "value";
	},
			
	hasDisplay: function () {
		return false;
	},
	
	hasAnswers: function () {
		return false;
	},

    getNext: function () {
        this._doUpdate();
        return this.data.next[0];    
    },
    
    getTabs: function () {
		var tabs = [this._buildAnswerTab()];
		
		if (this.hasRouting()) {
			tabs.push(this.buildRoutingTab());
		}
		
		return tabs.concat(this.getDefaultTabs());	
	},
	
	validate: function (stanza) {
	    var problems = [];
	    var i;
	    
	    if ("sets" in stanza) {
	        for (i = 0; i < stanza.sets.length; i += 1) {
    	        if (!("label" in stanza.sets[i]) || stanza.sets[i].label === undefined || stanza.sets[i].label === "") {
    	            problems.push(["error", "Missing label name"]);
    	        }
    	        if (!("value" in stanza.sets[i]) || stanza.sets[i].value === undefined) {
    	            problems.push(["error", "Missing value"]);
    	        }
	        }
	    } else {
	        problems.push(["warn", "Value stanza doesn't set any labels"]);
	    }
	    	    
	    return problems;	
	},
	
	buildFromLive: function (card) {
	    var $card = $(card);
	    var stanza = {};
	    
	    var sets = [];
	    
	    $card.find(".row-value").each(function () {
	        var $this = $(this);
	        
	        var label = $this.find(".ipt-value-label").val();
	        var value = $this.find(".ipt-value-value").val();
	    
	        sets.push({ 
	            label: label,
	            value: value
	        });	    
	    });
	    
	    if (sets.length > 0) {
	        stanza.sets = sets;	    
	    }
	    
        stanza.next = [$card.find(".ipt-answer-next").val()];

        return stanza;
	
	},
	
    buildText: function () {
        return buildElement("div", undefined,
            buildElement("p", undefined, 
                "Click the button to add a row. Fill in the name of the label and the value to set. ",
                "You can use placeholders ([label] and [timescale] so far) in the value but the label must be a simple name."
            ),
            buildElement("p", undefined, "This stanza doesn't change the flow of your process")
        );
    },
	
	_doUpdate: function () {
        var i, label, value;
        
        if (!("sets" in this.data)) {
            return;
        }
        
        for (i = 0; i < this.data.sets.length; i += 1) {
            label = this.data.sets[i].label;
            value = getPlaceholderValue(this.data.sets[i].value);
            
            customer[label] = value;
        }
	},
	
	_buildAnswerTab: function () {
        var i, rows, button, next, tab, defaultNext, thizz;
        thizz = this;
        
        tab = buildElement("div", "tab-calc");
        
        rows = buildElement("ul", "list-group value-rows");
        
        if ("sets" in this.data) {
            for (i = 0; i < this.data.sets.length; i += 1) {
                rows.appendChild(this._buildRow(this.data.sets[i]));                
            }
        }
        
        if ("next" in this.data) {
            defaultNext = this.data.next[0];
        }
        
        next = buildElement("li", "list-group-item form-inline border-0",
            buildElement("span", "mr-2", "Next"),
		    buildNextInput(this, undefined, defaultNext),
			buildNextButton(defaultNext)
        );
        
        rows.appendChild(next);
        tab.appendChild(rows);
        
        var button = buildElement("button", "btn btn-primary cmd-choice-add-condition", "Add another label/value pair");
		button.dataset.which = this.data.id;
		$(button).on("click", function () {
			rows.insertBefore(thizz._buildRow(), next);
		});
		
		buildRowControlHanlders(tab, "value");
		
		tab.appendChild(buildElement("div", "mb-3", button));                
        
        return ["Calculations", tab];		
	},
	
	_buildRow: function (set) {
	    function _buildInput(set, name, placeholder) {
            var input = buildElement("input", "form-control mr-2 ipt-value-" + name);
            input.type = "text";
            input.placeholder = placeholder;
            input.required = true;
            input.pattern = ".+";
            if (set && name in set) {
                input.value = set[name];
            }
            return input;
        }

        var inputs = {};
       
        inputs.label  = _buildInput(set, "label", "Label");
        inputs.label.style.flexGrow = 2;
        inputs.value = _buildInput(set, "value", "Value");
        inputs.value.style.flexGrow = 2;
        
        return buildElement("li", "list-group-item form-inline border-0 row-value",
            buildElement("span", "mr-2", "Set label"),
            inputs.label,
            buildElement("span", "mr-2", "to value"),
            inputs.value,
            buildRowControls("value", "Value stanza controls")
        );
	}

});



