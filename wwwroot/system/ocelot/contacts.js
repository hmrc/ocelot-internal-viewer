
window.Contacts = (function () {
	"use strict";

	var contactIcons = {
		Address : "envelope-o",
		Number : "phone",
		Email: "at",
		Fax: "fax",
		WebAddress: "globe"
	}

	var fields = ["Number", "Textphone", "Email", "Overseas", "Fax", "Open", "WebAddress", "Address"];
	var contacts = {}, queue = [], timeout;
	
	var loaded = false;
	$("#contacts-list").on("click", "li", _showContact);	
	
	function _drawContactModal(contact) {		
		var body, table, title, i, fieldName;
		
		body = buildElement("div");
		
		if ("Description" in contact) {
			inflateHTMLInto(body, contact.Description);
		}
		
		table = buildElement("table", "table table-compact");
		
		for (i =0; i < fields.length; i += 1) {
			fieldName = fields[i];
			if (fieldName in contact) {
				table.appendChild(
					buildElement("tr", undefined,
						buildElement("th", "text-right", fieldName),
						inflateHTMLInto(
							buildElement("td"), 
							contact[fieldName]
						)										
					)
				);
			}
		}
		
		body.appendChild(table);
		
		title = UCFirst(contact.Name);
			
		return buildModalFramework({
			size: "lg",
			title: title,
			body: body
		});
	}
	
	function _showContact() {
		var id, modal;
		
		id = this.dataset.which;
		
		if (id in contacts) {	
			$(_drawContactModal(contacts[id]))
				.modal("show")
				.on("hidden.bs.modal", function () {
					$(this).remove();
				});			
		} else if (loaded) {
		
			// TOOD: Queue
		}				
	}
	
	function _buildSideMenu() {
		var i, modal, contact, id, scratch = "", title, modal, li, pageName;
		
		$("#contacts-list").empty();

		i = 0;
		for (pageName in contacts) {
			i += 1;
			contact = contacts[pageName];

			if ("Name" in contact) {
				li = buildElement("li", "list-group-item list-group-item-action", UCFirst(contact.Name));
				li.dataset.which = pageName;
				$("#contacts-list").append(li);
			}
		}
		
		if (i > 0) {
			$("#contacts-holder").show();
		}
	}

	function _buildReplacement(id, display) {
		var text, link, node;
		
		if (!(id in contacts)) {
			console.warn("Contacts: " + id + ": Not found");
			return undefined;
		}
		
		text = contacts[id][display];
		
		switch (display) {
			case "Address":
				link = inflateHTMLInto(buildElement("div", "placeholder contact"), text);
				break;
			default:
				link = buildElement("span", "placeholder contact",
					buildFA(display in contactIcons ? contactIcons[display] : "address-card"),
					textNode(" "),
					inflateHTMLInto(buildElement("u"), text)
				);
		}
		
		link.dataset.which = id;
		link.addEventListener("click", _showContact);
		
		return link;
	}
	
	function _queueAdd(id, link) {
		queue.push([id, link]);
		
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			var nameList = [], i;
			for (i = 0; i < queue.length; i += 1) {
				nameList.push(queue[i][0]);
			}
			
			_load(nameList);
		}, 500);
	}
	
	function _queueClear() {
		var pair, node, id, replacement;
		while (queue.length> 0) {
			pair = queue.shift();
			
			id = pair[0];
			node = pair[1];
			
			if (node.parentNode !== null) {
				replacement = _buildReplacement(node.dataset.which, node.dataset.display);
				if (replacement !== undefined) {
					node.parentNode.replaceChild(replacement, node);						
				}
			}
						
		}			
	}
	
	function _unique(array) {
		var i, result = {};
		for (i = 0; i < array.length; i += 1) {
			result[array[i]] = true;
		}
		
		return Object.keys(result);	
	}
		
	function _load(nameList, onload) {
		loaded = false;
		
		nameList = _unique(nameList);
				
		if (nameList.length === 0) {
			$("#contacts-holder").hide();
		} else {			
			$.getJSON("/system/ocelot/contacts.asp", {id: nameList.join("|")})
				.done(function (json) {
					if (!("success" in json)) {
						console.log("Problem loading contacts: ", json);
						return;
					}
					
					contacts = Object.assign(contacts, json.success);
					
					_buildSideMenu();
					
					loaded = true;
					_queueClear();
					
					if (onload !== undefined) {
						onload();
					}
				});
		}
	}
		
	function _attach(args) {
		var link, id, display;
		
		id = args[0];
		display = args[1];
		
		if (!(id in contacts && loaded)) {
			link = buildElement("span", "placeholder contact loading no-howto", "Loading...");
			
			link.dataset.which = id;
			link.dataset.display = display;
			
			_queueAdd(id, link);
			return link;
		} else {
			return _buildReplacement(id, display);
		}
	}
	
	function _get(id) {
		return contacts[id];
	}
	
	
	// Init
	$("#contacts-holder").hide();
	
	return {
		load: _load,
		attach: _attach,
		get: _get
	};
})();
