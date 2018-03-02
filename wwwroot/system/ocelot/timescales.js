
window.Timescales = (function (){
	"use strict";
	
	var known_timescales = {
		tax:"PAYE and SA",
		ctx:"Company Tax",
		nic:"National Insurance",
		emp:"Employers",
		sta:"Stamps",		
	};
	
	var timescales = {};
	var bank_holidays = [];
	var loaded = false;
	var queue = [];
	
	function _getMidnight() {
		var date = new Date();
		date.setHours(0, 0, 0, 0);
		
		return date;
	}
	
	function _getKnown() {
		return known_timescales;
	}
	
	function _isBankHoliday(date) {
		var i;
		for (i = 0; i < bank_holidays.length; i += 1) {
			if (date.getFullYear() === bank_holidays[i].getFullYear() && date.getMonth() === bank_holidays[i].getMonth() && date.getDate() === bank_holidays[i].getDate()) {
				return true;
			}
		}
		return false;
	}
	
	function _addWorkingDays(date, days) {
		while (days > 0) {
			date.setDate(date.getDate() + 1);		
			if (!_isBankHoliday(date) && date.getDay() !== 0 && date.getDay() !== 6) {
				days -= 1;
			}
		}
		return date;
	}
	
	function _addWorkingNotBhDays(date, days) {
		while (days > 0) {
			date.setDate(date.getDate() + 1);
			if (date.getDay() !== 0 && date.getDay() !== 6) {
				days -= 1;
			}
		}
		return date;
	}
	
	function _subtractWorkingDays(date, days) {
		while (days > 0) {
			date.setDate(date.getDate() - 1);
			if (!_isBankHoliday(date) && date.getDay() !== 0 && date.getDay() !== 6) {
				days -= 1;
			}
		}
		return date;
	}
					
	function _clearQueue() {
		var next;
		while (queue.length > 0) {
			next = queue.shift();
			
			if (typeof next === "function") {
				next();
			} else {
				if (next.dataset.name in timescales) {
					next.dataset.timescale = timescales[next.dataset.name].ts;
					_updateDisplay(next);
				} else {
					console.log("Still can't find timescale: " + next.dataset.name);
				}
			}
		}										
	}

	function _load(unused, callback) {
		var base = (window.location.href.indexOf("tools") !== -1 ? "../" : "../../system/ocelot/");
		
		var pending = [
			$.getJSON("/cagdata/timescales.js"),
			$.getJSON(base + "data/timescale_names.js"),
			$.getJSON(base + "bank-holidays.js")
		];
						
		return $.when.apply(this, pending)
			.done(function (tsjqXHR, namesXHR, bhjqXHR) {
				var i, ts, bh, names, key;
				
				ts =  tsjqXHR[0];				
				names = namesXHR[0];							
				bh = bhjqXHR[0];
				for (i = 0; i < bh.length; i += 1) {
					bank_holidays.push(new Date(bh[i]));
				}

				for (key in ts) {
					timescales[key] = {ts: ts[key], desc: names[key]};
				}
				_clearQueue();
				
				loaded = true;
				if (callback !== undefined) {
				    console.warn("Timescale callback used");
					callback(timescales);
				}
			});
	}

    function _taxYearStart(date) {
        var tys = new Date(date);
        if (tys.getMonth() < 3 || (tys.getMonth() === 3 && tys.getDate() <= 5)) {
			tys.setFullYear(tys.getFullYear() - 1);
		}
		
		tys.setMonth(3);
		tys.setDate(6);
        return tys;
    }
	
	function _attachTimescale(args) {
	    var result = _doPlaceholder(args);
	    
	    if (result instanceof Date) {
	        return buildElement("span", "placeholder timescale", formatDate(result));
	    } else {	    
            return buildElement("span", "placeholder timescale", result);
        }
    }	
	
	function _getTimescaleFromPlaceholder(name) {
	    var result = {};
	    var parts, offset;
	    
	    if (name instanceof Date) {
	        return result.date = name;
	    } else if (typeof name === "number") {
	        return result.days = name;
	    } else if (parts = name.match(/^CY(?:([+-])(\d+))?$/)) {
	        // Get the start of the current tax year (CY)
            result.date = _taxYearStart(_getMidnight());
            			
			// Adjust based on offset
			if (parts[1] !== undefined) {
			    offset = parseInt(parts[2], 10);
				if (parts[1] === '+') {
					result.date.setFullYear(result.date.getFullYear() + offset);
				} else {
					result.date.setFullYear(result.date.getFullYear() - offset)
				}
			}			
		} else if (name.match(/^today$/)) {
            result.days = 0;
        } else if (parts = name.match(/^(\d?\d).(\d?\d).(\d{4})$/)) {
            parts.shift();
            parts = parts.map(function (x) {return parseInt(x, 10)});
            result.date = _getMidnight();
            result.date.setFullYear(parts[2], parts[1] - 1, parts[0]);                
		} else if (parts = name.match(/^(-)?(\d+)\s*(working\s+)?(day|week)s?$/)) {
			result.days = parseInt(parts[2], 10) * (parts[4] === 'week' ? 7 : 1);
			if (parts[1] !== undefined) {
			    result.days *= -1;
			}
			if (parts[3] !== undefined) {
			    result.days *= 5/7;
			}
		} else if (name in timescales) {
    		result.days = timescales[name].ts;
    		result.type = "dynamic";
		} else {
			console.warn("Unknown timescale", name);
			result.days = 0;
		}	
		return result;
   	}
   	
   	function _doPlaceholder(args) {
   	    var name, display, date, result;
   	    
   	    name = args[0];
   	    display = args[1];
   	
   	    var ts = _getTimescaleFromPlaceholder(name);

        // Set defaults
        var defaults = {date: _getMidnight(), days: 0, type: "fixed"};
        ts = Object.assign(defaults, ts);
       	        
   	    switch (display) {				
			case "date":
			case "working_date":
				if (ts.type === "dynamic") {
					ts.days *= 5/7;
				}
				
				result = _addWorkingDays(ts.date, ts.days);
				break;
			case "calendar_date":
				// Treat the number we're given as an exact number of days.
				ts.date.setDate(ts.date.getDate() + ts.days);
				result = ts.date;
				break;
			case "calendar_date_ago":
				ts.date.setDate(ts.date.getDate() - ts.days);				
   				result = ts.date;
				break;    				
			case "notbh_date":
				if (ts.type === "dynamic") {
					ts.days *= 5/7;
				}    			
				result = _addWorkingNotBhDays(ts.date, ts.days);
				break;
			
			case "date_ago":				
			case "working_date_ago":
				if (ts.type === "dynamic") {
					ts.days *= 5/7;
				}
				result = _subtractWorkingDays(ts.date, ts.days)
				break;   
            case "day":
            case "days":
                result = ts.days;
                break;    				 				
			case "week":
			case "weeks":
				result = Math.floor(ts.days / 7);
				break;
			case "hour":
			case "hours":
				result = Math.floor(ts.days * 24);    				
				break;
            case "long":
            case "full":            
            case "year":
            case "years":
                result = ts.date.getFullYear();
                break;
            case "short":
                result = ts.date.getFullYear().toString().substr(2);
                break;				
			default:
                result = ts.date;
				break;
		}   	    
   	       	    
   	    return result;
   	}   	
	
	function _realAttachDateAdd(span, args) {
		var date, number, i, value, arg, match, ts, isWorking;
		
		date = new Date();
		date.setHours(0, 0, 0, 0);
		
		number = 0;
		for (i = 0; i < args.length; i += 1) {
			arg = args[i];
			if (arg in customer) {
				value = customer[arg];
				if (value instanceof Date) {
					date =new Date(value);

				} else if (match = value.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/)) {
					match.shift(); // Throw away full pattern match
					match = match.map(function (x) { return parseInt(x, 10); });
					date = new Date(match[2], match[1] - 1, match[0]);
				} else {
					console.warn("dateadd: Customer value " + arg + " not a date");
				}
			} else {
			    ts = _getTimescaleFromPlaceholder(arg);
			    if ("days" in ts) {
			        number += ts.days;
			    }
			    if ("date" in ts) {
			        date = ts.date;
			    }			    
            }
		}

        date = _addWorkingDays(date, number);
			
		while (span.firstChild) {
			span.removeChild(span.firstChild);
		}
		
		span.appendChild(textNode(formatDate(date)));	
	}
	

	function _attachDateAdd() {
		var i;
		var args = [];
		for (i =0; i < arguments[0].length; i += 1) {
			args.push(arguments[0][i]);
		}
		
		var span = buildElement("span", "placeholder timescale", "Loading...");
		
		if (loaded) {
			_realAttachDateAdd(span, args);
		} else {
			queue.push(function () {
				_realAttachDateAdd(span, args);
			});
		}
		
		return span;
	}
	
	function _getRaw(timescale) {
		return timescales[timescale].ts;
	}
	
	function _isKnown(timescale) {
		return (timescale in timescales);
	}
	
	function _autocompleteSource(request, response) {
		var term = request.term.toLowerCase().replace(/[^a-z]/g, '');
		
		var result = [];
		
		var id, desc
		for (id in timescales) {
			desc = timescales[id].desc;
			if (desc === undefined) {
				desc = "";
			}
			if (id.toLowerCase().replace(/[^a-z]/g, '').substr(0, term.length) === term || desc.toLowerCase().replace(/[^a-z]/g, '').match(term)) {
				result.push({label: desc, value: id});
			}
		}	
		response(result);
	}
	
	function _getAll() {
		// Probably should return a copy....
		return timescales;
	}
	
	return {
		load: _load,
		placeholder: _doPlaceholder,
		attachTimescale: _attachTimescale,
		attachDateAdd: _attachDateAdd,
		isBankholiday: _isBankHoliday,
		isBankHoliday: _isBankHoliday,		
		getRaw: _getRaw,
		isKnown: _isKnown,
		getKnown: _getKnown,
		autocompleteSource: _autocompleteSource,
		addWorkingDays: _addWorkingDays,
		subtractWorkingDays: _subtractWorkingDays,
		getAll: _getAll,
		taxYearStart: _taxYearStart
	};

})();