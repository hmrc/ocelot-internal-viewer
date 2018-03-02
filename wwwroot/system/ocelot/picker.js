
(function ( $ ) {
	"use strict";
	var NAMESPACE = "guidanceDP";
	var instanceCount = 0;	
	var CENTER_ROW = 3;
	var UP = -1;
	var DOWN = 1;
			
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	function getMonthNumber(name) {
		var i;
		for (i = 0; i < monthNames.length; i += 1) {
			if (monthNames[i] === name) {
				return i;
			}
		}
		return -1;
	}
	
	function isLeapYear(year) {
    	return (year % 4 === 0) && ( (!(year % 100 === 0)) || (year % 400 === 0));
    }

	function daysInMonth(month, year) {
		if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
			return 31;
		} else if (month === 3 || month === 5 || month === 8 || month === 10) {
			return 30;
		} else {
			if (isLeapYear(year)) {
				return 29;
			} else {
				return 28;
			}											
		}
	}
	
	function formatDate(date) {
		return (date.getDate() < 10 ? "0" : "") + date.getDate() + "/" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "/" + date.getFullYear();
	}
	
	function getChildIndex(parent, child) {
		var i;
		for (i = 0; i < parent.children.length; i += 1) {
			if (parent.children[i] === child) {
				return i;
			}
		}
		return -1;
	}
	
	function parseDate(dateString) {
		// Beacause sometimes, people don't give four digit years.
		// See: functions.js:returnToday()
		// Sigh.
		
		var parts = dateString.split(/[-\/\s]+/);
		if (parts.length < 3) {
			return NaN;
		}

		var day = parseInt(parts[0], 10);
		var month = parseInt(parts[1], 10);
		var year = parseInt(parts[2], 10);

		if (isNaN(day) || isNaN(month) || isNaN(year)) {
			return NaN;			
		}
		
		if (year < 100) {
			year += 2000;
		}
		return new Date(year, month - 1, day);
	}
	
	/**
	 * Build a <div> element with optional classes and inner text.
	 * classText is a space separated list of class names, or null to skip
	 * text is plain text to use as the content of the div, or null to skip
	 */
	function buildDiv(classText, content) {
		var div = document.createElement("div");
		if (classText) {
			var classes = classText.split(/\s+/);
			var i;
			for (i = 0; i < classes.length; i += 1) {
				div.classList.add(classes[i]);
			}
		}
		
		if (typeof content === "string" || typeof content === "number") {
			div.appendChild(document.createTextNode(content));
		} else if (content !== undefined) {
			div.appendChild(content);
		}
		
		return div;
	
	}
	
	function buildArrow(direction) {
		if (direction === "up") {
			return buildDiv(
				"arrow top btn-primary", 
				"\u2227"
			);
		} else {
			return buildDiv(
				"arrow bottom btn-primary", 
				"\u2228"
			);
		}
	}
	
	var Datepicker = function(target, options) { 
	
		this.instanceId = instanceCount++;

		var date = parseDate(target.value);				
		this.currentDate = isNaN(date) ? new Date() : date;
		
		this.handleOptions(options);
		
		this.element = $(target);
		
		target.addEventListener("focus", this.show.bind(this), false);	
		target.addEventListener("change", this.manualChange.bind(this), false);
		this.arrows = [];
	};
	

	
	Datepicker.prototype = {
	
		manualChange: function () {
			var date = parseDate(this.element.val());
			
			if (!isNaN(date)) {
				if (this.endDate !== undefined && date > this.endDate) {
					date = this.endDate;
				}
				if (this.startDate !== undefined && date < this.startDate) {
					date = this.startDate;
				}
				
				this.setDate(date);
			} else {
				this.element.val(formatDate(this.currentDate));
			}
		},
	
		handleOptions: function(opts) {

			// Merge defaults and user options
			this.options = $.extend({}, defaults, opts) ;

			if (this.options.startDate) {
				this.setStartDate(opts.startDate);
			}
			
			if (this.options.endDate) {
				this.setEndDate(opts.endDate);
			}
			
			if (this.options.immediateUpdates) {
				this.immediateUpdates = (this.options.immediateUpdates == true);
			}
			
			if (this.options.setDate) {
				this.currentDate = this.options.setDate;
			}
		},
	
		locate: function () {
			var elOffset = this.element.offset();
			
			elOffset.top += this.element.parent().height();
								
			$(this.base).offset(elOffset);
			
			window.frameElement.parentNode.insertBefore(this.base, window.frameElement.nextSibling);								
		},
	
		build : function () {			
			var i;
			var div;
			
			// Setup base
			this.base = buildDiv("guidanceDP hidden noSelect");
			this.base.addEventListener("click", this.click.bind(this), false);
									
			// Setup day list

			this.days = buildDiv("days col");			
			this.days.addEventListener("mousewheel", this.scrollDate.bind(this) , false);
			this.days.addEventListener("mouseover", this.showArrows.bind(this), true);
			this.days.addEventListener("mouseout", this.hideArrows.bind(this), true);
			
			this.daysScroll = buildDiv("scroll");
			
			// Add list of days			
			for (i = 1; i <= 31; i+= 1) {
				div = buildDiv("day", i);
		
				if (i === 1) {
					div.classList.add("first");
				}
				this.daysScroll.appendChild(div);
			}
			
			this.days.appendChild(this.daysScroll);
			
			// Add arrows
			this.arrows[0] = buildArrow("up");
			this.arrows[1] = buildArrow("down");

			this.days.appendChild(this.arrows[0]);
			this.days.appendChild(this.arrows[1]);
						
			// Add days to base
			this.base.appendChild(this.days);
			
			
			// And again for months
			this.months = buildDiv("months col");
			this.monthsScroll = buildDiv("scroll");

			this.months.addEventListener("mousewheel", this.scrollDate.bind(this) , false);
			this.months.addEventListener("mouseover", this.showArrows.bind(this), true);
			this.months.addEventListener("mouseout", this.hideArrows.bind(this), true);
			for (i = 0; i < 12; i+= 1) {
				div = buildDiv("month", monthNames[i]);
				if (i === 0) {
					div.classList.add("first");
				}
				this.monthsScroll.appendChild(div);
			}
			
			this.months.appendChild(this.monthsScroll);

			this.arrows[2] = buildArrow("up");
			this.arrows[3] = buildArrow("down");

			this.months.appendChild(this.arrows[2]);
			this.months.appendChild(this.arrows[3]);	

			this.base.appendChild(this.months);
	
			// and years
			this.years = buildDiv("years col");
			this.yearsScroll = buildDiv("scroll");

			this.years.addEventListener("mousewheel", this.scrollYear.bind(this), false);
			this.years.addEventListener("mouseover", this.showArrows.bind(this), true);
			this.years.addEventListener("mouseout", this.hideArrows.bind(this), true);
			
			for (i = this.currentDate.getFullYear() - 3; i <= this.currentDate.getFullYear() + 3; i+= 1) {
				div = buildDiv("year", i);
				this.yearsScroll.appendChild(div);
			}
			this.years.appendChild(this.yearsScroll);
			this.base.appendChild(this.years);
			
			this.arrows[4] = buildArrow("up");
			this.arrows[5] = buildArrow("down");

			this.years.appendChild(this.arrows[4]);
			this.years.appendChild(this.arrows[5]);	
			
			// Add event listeners to arrows
			for (i = 0; i < this.arrows.length; i+= 1) {
				this.arrows[i].addEventListener("mousedown", this.arrowMouse.bind(this), false);
				this.arrows[i].addEventListener("mouseup", this.arrowMouse.bind(this), false);				
				this.arrows[i].addEventListener("mouseout", this.arrowMouse.bind(this), false);				
			}
									
			// Setup controls
			this.controls = buildDiv("controls");
			
			this.acceptButton = buildDiv("accept", "\u2714");
			this.acceptButton.addEventListener("click", function () { 
				this.hide(false); 
			}.bind(this));
			this.controls.appendChild(this.acceptButton);
			
			this.todayButton = buildDiv("today", "\u263C");
			this.todayButton.addEventListener("click", function () { this.setDate(new Date()); }.bind(this));
			this.controls.appendChild(this.todayButton);
			
			this.cancelButton = buildDiv("cancel", "\u2716");
			this.cancelButton.addEventListener("click", function (e) {
				e.stopPropagation();
				this.element.val(this.originalDate); 
				this.hide(true); 
				return false;
			}.bind(this));
			
			this.controls.appendChild(this.cancelButton);
			
			this.base.appendChild(this.controls);

			if (window.frameElement) {
				this.locate();			
			} else {
				this.element.after(this.base);			
			}
		},
		
		getNamespace: function() {
			return NAMESPACE + this.instanceId;
		},
		
		hideArrows: function(e) {
			this.setArrowsOpacity(e.target, '0');
		},
		
		showArrows: function(e) {
			this.setArrowsOpacity(e.target, '1');
		},
		
		getSelectedDay : function() {
			return parseInt(this.daysScroll.children[CENTER_ROW].firstChild.nodeValue, 10);
		},
		
		getSelectedMonth : function () {
			return getMonthNumber(this.monthsScroll.children[CENTER_ROW].firstChild.nodeValue);
		},
		
		getSelectedYear : function () {
			return parseInt(this.yearsScroll.children[CENTER_ROW].firstChild.nodeValue, 10);
		},
		
		getLastDay : function () {
			// Return the div that holds the last day of the month.
			// (Not just daysScroll.lastChild, unfortunatly)
		
			var child, highChild, i, max = 0, dayNumber;		
			for (i =0; i < this.daysScroll.children.length; i += 1) {
				child = this.daysScroll.children[i];
				dayNumber = parseInt(child.firstChild.nodeValue, 10);
				if (dayNumber > max) {
					highChild = child;
					max = dayNumber;
				}				
			}
			return highChild;
		},
	
		beforeScroll: function(div, direction) {
			// Only alow scrolling if the new date is on or after startDate, or on or before endDate
		
			// If the user scrolls to a date that shouldn't be allowed, move the selcted date to something
			// legal.
			var year = this.getSelectedYear();
			var month = this.getSelectedMonth();
			var day = this.getSelectedDay();

			if (div === this.yearsScroll) {
				if (this.startDate && (year + direction) === this.startDate.getFullYear()) { 				
					while (this.getSelectedMonth() < this.startDate.getMonth()) {
						this.scrollDown(this.monthsScroll);
					}
					
					if (this.getSelectedMonth() === this.startDate.getMonth()) {
						while (this.getSelectedDay() < this.startDate.getDate()) {
							this.scrollDown(this.daysScroll);
						}
					}
				}
				
				if (this.endDate && (year + direction) === this.endDate.getFullYear()) { 				

					while (this.getSelectedMonth() > this.endDate.getMonth()) {
						this.scrollUp(this.monthsScroll);
					}
					
					if (this.getSelectedMonth() === this.endDate.getMonth()) {
						while (this.getSelectedDay() > this.endDate.getDate()) {
							this.scrollUp(this.daysScroll);
						}
					}
					
				}
			} else if (div === this.monthsScroll) {

				if (this.startDate && year === this.startDate.getFullYear() && (month + direction) === this.startDate.getMonth()) { 
					while (this.getSelectedDay() < this.startDate.getDate()) {
						this.scrollDown(this.daysScroll);
					}						
				}
				
				if (this.endDate && year === this.endDate.getFullYear() && (month + direction) === this.endDate.getMonth()) { 
					while (this.getSelectedDay() > this.endDate.getDate()) {
						this.scrollUp(this.daysScroll);
					}						
				}
			}
			if (div.classList.contains("scroll")) {
				return !div.children[CENTER_ROW + direction].classList.contains("disabled");
			} else {
				return false;
			}
		},


		afterScroll: function() {			
			// When the user scrolls the month or year, the number of days in the month can change. 
			// We may need to add or remove days to get the number right. 
			// If we add/remove days, then we probably need to change the scroll position (since adding/removing 
			// days moves things)
			
			var div, index;
			
			// If we're showing more days than we need to, delete the extras
			while (this.daysScroll.children.length > daysInMonth(this.getSelectedMonth(), this.getSelectedYear())) {
				div = this.getLastDay();	
				if (this.getSelectedDay() > daysInMonth(this.getSelectedMonth(), this.getSelectedYear())) {
					this.scrollUp(this.daysScroll);
					this.daysScroll.removeChild(div);					
				} else {
					if (getChildIndex(this.daysScroll, div) <= CENTER_ROW) {				
						this.scrollUp(this.daysScroll);
					}
					this.daysScroll.removeChild(div);	
				}
			}
			
			// If we're showing less days than we need to, add some more
		
			while (this.daysScroll.children.length < daysInMonth(this.getSelectedMonth(), this.getSelectedYear())) {
				div = this.getLastDay();				

				var before = this.getSelectedDay();
				this.daysScroll.insertBefore(buildDiv("day", this.daysScroll.children.length + 1), div.nextSibling);
				
				if (getChildIndex(this.daysScroll, div) <= CENTER_ROW  && before < 10) {
					this.scrollDown(this.daysScroll);
				}
			}
			
			
			// If the user has set a startDate or an endDate, mark out of date days/months/years as disabled
			var i, y, m, d;
			for	(i = 0; i < this.yearsScroll.children.length; i += 1) {
				y = parseInt(this.yearsScroll.children[i].firstChild.nodeValue, 10);
				if (
					(this.startDate && y < this.startDate.getFullYear()) 
				 ||
					(this.endDate && y > this.endDate.getFullYear()) 
				) {
					this.yearsScroll.children[i].classList.add("disabled");
				} else {
					this.yearsScroll.children[i].classList.remove("disabled");
				}
			}
			
			for	(i = 0; i < this.monthsScroll.children.length; i += 1) {
				y = this.getSelectedYear();
				m = getMonthNumber(this.monthsScroll.children[i].firstChild.nodeValue);
				if (
					(this.startDate && y  === this.startDate.getFullYear() && m < this.startDate.getMonth()) 
				||
					(this.endDate && y === this.endDate.getFullYear() && m > this.endDate.getMonth()) 
				) {
					this.monthsScroll.children[i].classList.add("disabled");
				} else {
					this.monthsScroll.children[i].classList.remove("disabled");
				}
			}
			
			for	(i = 0; i < this.daysScroll.children.length; i += 1) {
				y = this.getSelectedYear();
				m = this.getSelectedMonth();
				d = parseInt(this.daysScroll.children[i].firstChild.nodeValue, 10);
				if (
					(this.startDate && y === this.startDate.getFullYear() && m === this.startDate.getMonth() && d < this.startDate.getDate()) 
				||
					(this.endDate && y === this.endDate.getFullYear() && m === this.endDate.getMonth() && d > this.endDate.getDate()) 
				) {
					this.daysScroll.children[i].classList.add("disabled");
				} else {
					this.daysScroll.children[i].classList.remove("disabled");
				}
			}
			
			// Update current date
			this.currentDate = new Date(this.getSelectedYear(), this.getSelectedMonth(), this.getSelectedDay());
			this.currentDate.setMinutes(this.currentDate.getMinutes() - this.currentDate.getTimezoneOffset())	
			if (this.immediateUpdates) {
				this.element.val(formatDate(this.currentDate));
			}
			
			if ("onChange" in this) {
				this.onChange(this.currentDate);
			}
		},
		
		arrowMouse: function (e) {
			// This one is a bit complicated.
			// When the user clicks an arrow, we scroll one of the colums up or down, depending on the arrow clicked.
			// When the user holds an arrow down, we scroll automaticaly until the user lets go
			// While we're auto-scrolling, we want to scroll faster up to a reasnable limit.
					
					
			// First, setup some variables.
			// div is the column the user picked
			// scroll is the function needed to scroll that div, either up or down (depending on 'top' or 'bottom' arrow picked;
			// limit is the minimum delay (in ms) between scrolls
			// direction is 1/-1 (up/down) based on which arrow is clicked
			
			var div, scroll, limit, direction;
			direction = e.target.classList.contains("top") ? UP : DOWN;
			switch (e.target.parentNode) {
				case this.days:
					div = this.daysScroll;
					scroll =  direction === UP ? this.scrollUp.bind(this) : this.scrollDown.bind(this);
					limit = 100;
					break;
				case this.months:
					div = this.monthsScroll;
					scroll = direction === UP ? this.scrollUp.bind(this) : this.scrollDown.bind(this);
					limit = 100;
					break;
				case this.years:
					div = this.yearsScroll;
					scroll =  direction === UP ? this.scrollYearUp.bind(this) : this.scrollYearDown.bind(this);
					limit = 100;
					break;
			}

			// Build a function using scroll and div from above
			// to update the display
			var update = function () {
				if (this.beforeScroll(div, direction)) {
					scroll(div); 
					this.afterScroll();
				}
			}.bind(this);

			// Build a function that calls itself periodicaly, that calls the function we've just built
			// and also deals with the acceleration
			var timeout = function () {
				update();
				if (this.arrowTimeoutRef !== undefined) {
					this.arrowTimeout *= 0.7;
					if (this.arrowTimeout < limit) {
						this.arrowTimeout = limit;
					}
					this.arrowTimeoutRef = setTimeout(timeout.bind(this), this.arrowTimeout);
				}
			};

			// Check the type of mouse event
			switch (e.type) {
				case "mousedown":
					// Mousedown - so start the timer
					this.arrowTimeout = 500;
					this.arrowTimeoutRef = setTimeout(timeout.bind(this), this.arrowTimeout);
					break;
				case "mouseup":
					// Mouseup - call update, and drop through to the next case
					update();
				case "mouseout":
					// mouseout, and mouse up - cancel the running timeout
					if (this.arrowTimeoutRef !== undefined) {
						clearTimeout(this.arrowTimeoutRef);
						this.arrowTimeoutRef = undefined;
					}					
					break;
			}
		},
		
		click: function (e) {
			var div = e.target;
			var value;
			
			// If the target is disabled, we can bail early.
			if (div.classList.contains("disabled")) {
				return;
			}
			
			if (div.classList.contains("year")) {
				value = parseInt(div.firstChild.nodeValue, 10);
				while (value < this.getSelectedYear()) {
					if (this.beforeScroll(div.parentNode, UP)) {
						this.scrollYearUp();
					} else {
						break;
					}
				}
				while (value > this.getSelectedYear()) {
					if (this.beforeScroll(div.parentNode, DOWN)) {
						this.scrollYearDown();
					} else {
						break;
					}
				}
			} else if (div.classList.contains("month")) {
				value = getMonthNumber(div.firstChild.nodeValue);
				while (value < this.getSelectedMonth()) {
					this.scrollUp(this.monthsScroll);
				}
				while (value > this.getSelectedMonth()) {
					this.scrollDown(this.monthsScroll);
				}			
			} else if (div.classList.contains("day")) {
				value = parseInt(div.firstChild.nodeValue, 10);
				while (value < this.getSelectedDay()) {
					this.scrollUp(this.daysScroll);
				}
				while (value > this.getSelectedDay()) {
					this.scrollDown(this.daysScroll);
				}			
			}
			
			this.afterScroll();
		},
		
		setArrowsOpacity: function(div, opacity) {
			// Find the column holding the div that triggered the event
		
			while (!div.classList.contains("col")) {
				div = div.parentNode;
				if (div === null) {
					console.log("Ooops");
					return;
				}
			}
		
			// Hide/Show the relevent arrows
			switch (div) {
				case this.days:
					this.arrows[0].style.opacity = opacity;
					this.arrows[1].style.opacity = opacity;
					break;
				case this.months:
					this.arrows[2].style.opacity = opacity;
					this.arrows[3].style.opacity = opacity;
					break;
				case this.years:
					this.arrows[4].style.opacity = opacity;
					this.arrows[5].style.opacity = opacity;
					break;
			}
		},
		

		scrollDate: function(e) {
			e.preventDefault();
			var div = e.target.parentNode;		

			if (e.wheelDelta > 0) {
				if (this.beforeScroll(div, UP)) {	
					this.scrollUp(div);
				}
			} else {
				if (this.beforeScroll(div, DOWN)) {
					this.scrollDown(div);
				}
			}
			
			this.afterScroll();
		},
			
		scrollDown: function(div) {
			// Move the first child of div to the end 
			div.appendChild(div.firstChild);
		},
		
		scrollUp: function (div) {
			// Move the last child of div to the start
			div.insertBefore(div.lastChild, div.firstChild);
		},
		
		
		scrollYear: function(e) {
			e.preventDefault();
			// Years are treated differently to days and months
			// because we want to be able to scroll forever.
			
			if (e.wheelDelta > 0) {
				if (this.beforeScroll(this.yearsScroll, UP)) {			
					this.scrollYearUp();
				}
			} else {
				if (this.beforeScroll(this.yearsScroll, DOWN)) {	
					this.scrollYearDown();
				}
			}
			
			this.afterScroll();
		},
						
		scrollYearUp: function() {
			var year = this.yearsScroll.lastChild;
			year.firstChild.nodeValue = parseInt(year.firstChild.nodeValue) - 7;
			this.yearsScroll.insertBefore(year, this.yearsScroll.firstChild);		
		},
		
		scrollYearDown: function() {
			var year = this.yearsScroll.firstChild;
			year.firstChild.nodeValue = parseInt(year.firstChild.nodeValue) + 7;
			this.yearsScroll.appendChild(year);
		},
		
		setStartDate: function(args) {
			var startDate = args[0];
			
			if (startDate === undefined || startDate === null || startDate === "") {
				this.startDate = undefined;
				return;
			}
			
			if (!(startDate instanceof Date)) {
				startDate = new Date(startDate);
				if (isNaN(startDate)) {
					console.log("Warning: setStartDate(" + args[0] + ") given invalid date");
					return;
				}
			}
									
			if (this.endDate && this.endDate.getTime() < startDate.getTime()) {
				this.startDate = this.endDate;
				this.endDate = startDate;
			} else {
				this.startDate = startDate;
			}
			
			if (this.currentDate.getTime() < this.startDate.getTime()) {
				this.setDate(this.startDate);			
			}
		},
		
		setEndDate: function(args) {
			var endDate = args[0];
			
			if (endDate === undefined || endDate === null || endDate === "") {
				this.endDate = undefined;
				return;
			}
			
			if (!(endDate instanceof Date)) {
				endDate = new Date(endDate);
				if (isNaN(endDate)) {
					console.log("Warning: setEndDate(" + args[0] + ") given invalid date");
					return;
				}
			}
			
			if (this.startDate && this.startDate.getTime() > endDate.getTime()) {
				this.endDate = this.startDate;
				this.startDate = endDate;
			} else {
				this.endDate = endDate;
			}
			if (this.currentDate.getTime() > this.endDate.getTime()) {
				this.setDate(this.endDate);			
			}
		},
						
		setDate: function (date) {
			if (Array.isArray(date)) {
				date = date[0];
			}
		
			if (!(date instanceof Date)) {
				// Try parsing it
				var d = parseDate(date);
				if (isNaN(d)) {
					console.log("Warning: " + date + " is not a valid date. Using today");
					date = new Date();
				} else {
					date = d;
				}
			}

			while (this.getSelectedYear() !== date.getFullYear() ) {
				if (this.getSelectedYear() > date.getFullYear()) {
					this.scrollYearUp();
				} else {
					this.scrollYearDown();
				}
			}
	
			this.afterScroll();
			
			while (this.getSelectedMonth() !== date.getMonth() ) {
				if (this.getSelectedMonth() > date.getMonth()) {
					this.scrollUp(this.monthsScroll);
				} else {
					this.scrollDown(this.monthsScroll);
				}
			}
			
			this.afterScroll();
			
			while (this.getSelectedDay() !== date.getDate()) {
				if (this.getSelectedDay() > date.getDate()) {
					this.scrollUp(this.daysScroll);
				} else {
					this.scrollDown(this.daysScroll);
				}
			}
			
			this.afterScroll();

		},
		
		setOnChange: function(onChange) {
			if (onChange !== undefined && onChange.length > 0 && typeof onChange[0] === "function") {
				this.onChange = onChange[0];
			}
		},
		
		setOnClose: function(onClose) {
			if (onClose!== undefined && onClose.length > 0 && typeof onClose[0] === "function") {
				this.onClose= onClose[0];
			}
		},
		
		getDate: function() {
		  	return this.currentDate;
		},
				
		clickToHide: function (e) {
			var $base = $(this.base);
			if (!(
					$base.is(e.target) ||
					$base.find(e.target).length ||
					this.element.is(e.target) ||
					this.element.find(e.target).length
				)) {
				this.hide(false);
				$(document).off("click." + this.getNamespace());
			}		
		},
		
		show: function () {
			// Setup a listner on the document, so that we can hide ourselves		
			$(document).off("click." + this.getNamespace());
			setTimeout(function () {
				$(document).on("click." + this.getNamespace() , this.clickToHide.bind(this));
			}.bind(this), 25);
			
			// Add a 'tabout' listener as well
			
			$(this.element).on("keydown", function (e) {
				if (e.key === "Tab") {
					this.hide(false);
				}
			}.bind(this));
			
			if (this.options.setDate) {
				this.originalDate = this.options.setDate;
			} else {
				// Remember the date from the input element
				this.originalDate = this.element.val();
			}
			
			// Set our date
			this.setDate(this.originalDate);
			
			// Actualy sho ourselves
			this.base.classList.remove("hidden");
			$(this.base).show();			
		},
		
		hide: function (cancel) {			
			this.base.classList.add("hidden");
			$(document).off("click." + this.getNamespace());
			$(this.base).hide();
			
			if ("onClose" in this) {
				this.onClose(cancel);
			}
		}	
	};
	
	function parseData(dataSet) {
		var opts = {}, i, name;
		var dataKeys = Object.keys(dataSet);
		for (i = 0; i < dataKeys.length; i+= 1) {
			if (dataKeys[i].substr(0, 4) === "date") {
				name = dataKeys[i].substr(4);
				name = name.charAt(0).toLowerCase() + name.slice(1);;
				
				opts[name] = dataSet[dataKeys[i]];
			}
		}
		return opts;
	}
	
	// Add ourselves to jQuery
	$.fn.datepicker = function(option) {
		// Turn arguments into a proper array
		var args = Array.apply(null, arguments);
		// Throw away the first argument
		args.shift();
		var value;
		this.each(function () {
			var $this = $(this),
				d = $this.data('datepicker');								
			if (!d) {
				var localoptions = (option !== undefined ? option: {});
			
				if (this.dataset) {
					$.extend(localoptions, parseData(this.dataset));
				}
			
				d = new Datepicker(this, localoptions);
				d.build();
				$this.data('datepicker', d);
			}
			switch (option) {
				case "show":
					d.show();
					break;
				case "hide":
					d.hide(false);
					break;
				case "setDate":
					d.setDate(args);
					break;
				case "getDate":
					value = d.getDate();
					break;
				case "startDate":
					d.setStartDate(args);
					break;
				case "endDate":
					d.setEndDate(args);
					break;
				case "change":
					d.setOnChange(args);
					break;
				case "close":
					d.setOnClose(args);
					break;		
			}
		});
		if (value !== undefined) {
			return value;
		} else {
			return this;
		}
	};
	
	var defaults = $.fn.datepicker.defaults = {
		startDate: undefined,
		endDate: undefined,
		immediateUpdates: true
	};
}( jQuery ));

