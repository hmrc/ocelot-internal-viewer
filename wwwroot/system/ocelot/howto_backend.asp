<%@ language = "JavaScript" %><!--#include file="JSON.js" --><!--#include file="serverLibrary.inc" --><%

var HOWTO_RE = /^([a-z]{3})(1[0-9]{4})$/;

function handleGet() {
	
	var i, lobs = {}, match, howtos;
	var list = Request.QueryString("h").item;
	
	if (list === undefined || list.length === 0) {
		Response.Status = "400 Missing list of howtos";
		Response.Write(JSON.stringify({error:"Missing list of howtos"}));
		Response.End;
	}
	
	list = list.split("|");
	
	for (i = 0; i < list.length; i += 1) {
		match = list[i].match(HOWTO_RE)
		if (match) {
			
			lob = match[1];
			if (!(lob in lobs)) {
				lobs[lob] = [];
			}
			
			lobs[lob].push(list[i]);
		}
	}			
	
	var result = [], filename;
	
	for (lob in lobs) {			
		filename = "/" + lob + "/ocelot/" + lob + "_howto.js";
		
		lock(filename, 'r', function () {
			howtos = openJson(filename);			
		});
		
		if (howtos === undefined) {
			Response.Status = "500 Server side issue";
			Response.Write(JSON.stringify({'error':"Can't read howto database"}));
			Response.End;
		}
				
		for (i = 0; i < lobs[lob].length; i += 1) {
			if (lobs[lob][i] in howtos) {
				result.push(howtos[lobs[lob][i]]);
			}	
		}
		
	}
	
	Response.write(JSON.stringify({success:result}));
}

function main() {
	Response.ContentType = "application/json";
	Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	Response.AddHeader("Pragma", "no-cache");
	Response.AddHeader("Expires", "0");

	switch (Request.ServerVariables("REQUEST_METHOD").item) {
		case "GET":
			handleGet();
			break;
		default:
			Response.Status = "405 Method not allowed";
			Response.Write(JSON.stringify({error:"Method not allowed"}));
			Response.End();				
	}
}

main();

%>