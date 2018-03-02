"use strict";

/*********************************
******   Thumbs Functions   ******
*********************************/

/*
 * Function to add thumbs on to a page/stanza.
 * To use append card with this function, adds as card footer.
 * @return - returns the HTML to be appended to the card.
*/
function addThumbs(which) {
	if (which !== undefined) {
    	which = getContentOwner(which);
    } else {
		which = getContentOwner(getSubWeb(window.location.href));
	}

    function _buildThumb(name) {
        var icons = {Yes: "thumbs-o-up", No: "thumbs-o-down"};
    
        var button = buildElement("button", "btn btn-primary form-control", buildFA(icons[name]), name);
        button.id = "thumbs" + name;
        
        return button;
    }
    
    var thumbs = buildElement("div", "card-footer",
        buildElement("p", "card-text text-primary text-center",
            buildElement("strong", undefined, which, " created this guidance. Was it helpful?")
        ),
        buildElement("div", "row",
            buildElement("div", "offset-sm-4 col-sm-2 ", _buildThumb("Yes")),
            buildElement("div", "col-sm-2", _buildThumb("No"))
        )    
    );
    
    thumbs.id = "thumbsArea";
    
    return thumbs;
}

/*
 * Function to load thumbs response.
 * Creates variable to hold path Adviser used through the process.
 * First tries to save to CAF, if cannot (Chrome etc) will try posting to webservices folder, last resort creates email to IPDM folder.
 * @param - thumbs response from button pressed - can be either 'Up' or 'Down'.
 * @param - takes in type of response, currently defaulted to 'Ocelot', may not be required as anymore as originally use doesn't apply to Ocelot.
*/	
function loadThumbsResponse(thumbs, type)
{
	var isStaff = false;
		
	$.ajax
	({
    	url : '/webservices/Tracker/getUser.asp',
    	type : "get",
    	async: false,
    	success : function(data,status) 
    	{
    		if(Number($(data).find('PID').text()) !== 0)
				isStaff = true;
		}
	});
		
	if(!isStaff)
	{
		var processHistory = getProcessHistory();
		try
		{    
	    	var today = new Date();
	    	var strFile;
	    	strFile = "\\\\c\\s\\CAF2\\PT OPS BCT NQM Report\\thumbsup\\" + getPID();
			strFile += today.getFullYear();
			strFile += (today.getMonth()+1);
			strFile += today.getDate();
			strFile += today.getHours();
			strFile += today.getMinutes();
			strFile += today.getSeconds();
			strFile += "t.xml";
					
			var dom = buildDocument("dataroot", "entry", 
			{
				Who: getPID(), 
				Date: (today.getTime() / (24 * 60 * 60 * 1000)) + 25569,
				Rating: thumbs, 
				Type: type,
				Process: document.location.href,
				Last15: processHistory
			});
						
			dom.save(strFile);
		}
		catch(err)
		{	
			$.post("http://bg.cc.inrev.gov.uk/webservices/Thumbs/createThumbs.asp",
			{
				Rating: thumbs, 
				Type: type,
				Process: document.location.href,
				Last15: processHistory
			},
			function(data,status)
			{
			
			})
			.fail(function()
			{ 
				if(~navigator.userAgent.indexOf("MSIE 9.0"))
				{
					$('body').append('<a id="thumbsClickLink" href="mailto:4979004?subject=Thumbs&body=Thumbs: '+thumbs+'%0D%0A Type: '+type+'%0D%0A URL: '+document.location.href.replace(/&/gi,"&amp;").replace(/>/gi," ").replace(/</gi," ")+'%0D%0A Last15:' + processHistory +'" class="hidden"></a>');
				}
				else
				{
					$('body').append('<a id="thumbsClickLink" href="mailto:4979004?subject=Thumbs&body=Thumbs: '+thumbs+'%0D%0A Type: '+type+'%0D%0A URL: '+document.location.href.replace(/&/gi,"&amp;").replace(/>/gi," ").replace(/</gi," ")+'%0D%0A Last15:' + processHistory +'" class="hidden"></a>');
				}
				thumbsClickLink.click();
				$('#thumbsClickLink').remove();
			});
		}
	}
	else
	{
		console.log('Thumbs not submitted. Guidance Team Staff submission.');
	}	
}

/*
 * Function to remove thumb's buttons once pressed.
 * Removes reply after 10 seconds.
*/
function cleanUp()
{			
	$('#thumbsYes, #thumbsNo').hide();			
	setTimeout(function()	
	{
		$('#thumbsArea').slideUp();					
	}, 10000);				
}

/*
 * Function to add thumbs listeners for buttons added.
 * @param - card/stanza required to add listeners.
*/
function addThumbListeners(card)
{
	$(card).on("click", "#thumbsYes", function() 
	{		
		loadThumbsResponse('up', 'Ocelot');
		$('#thumbsArea').text('Thank you for your response');		
		cleanUp();
	});

	$(card).on("click", "#thumbsNo", function() 
	{ //add rate it to thumbs area if press no
		loadThumbsResponse('down', 'Ocelot');		
		var PID = FindPID();		
		var scratch = '<p>We\'re sorry to hear that, please tell us below how we can improve this guidance.</p>';
		scratch += '<div style="display:none;" id="thumbsRateItPID"><p>We can\'t trace your PID. Please enter it below.</p><h5>PID<h5><input type="number" class="form-control" id="ipt-thumbsRateItPID"></div>';
		scratch += '<div><h5>Area</h5><select class="form-control" id="sel-thumbsRateIt"><option value="" selected>Please Select</option><option value="Hyperlink / Tool not working">Hyperlink / Tool not working</option>';
		scratch += '<option value="Incorrect / Conflicting">Incorrect / Conflicting</option><option value="Guidance Improvement">Guidance Improvement</option><option value="Incorrect Search Terms">Incorrect Search Terms</option><option>Issue with GOV.UK content</option>';
		scratch += '</select></div><div><h5 class="mt-2">Comment</h5><textarea id="txt-thumbsRateIt" class="form-control" rows="5"></textarea></div>';
		scratch += '<div><button type="button" id="btn-thumbsRateIt" class="mt-3 btn btn-primary form-control">Submit</button></div>';
		$('#thumbsArea').html(scratch);
		
		if (FindPID() === 0)
			$('#thumbsRateItPID').show();
		else		
			$('#ipt-thumbsRateItPID').val(PID);
		
		$('#btn-thumbsRateIt').on('click', function()
		{
			if($('#ipt-thumbsRateItPID').val() === '' || ($('#ipt-thumbsRateItPID').val() !== '' && $('#ipt-thumbsRateItPID').val().length !== 7))
			{
				alert('An invalid or no PID has been entered, please correct this entry in the field provided.');
				$('#ipt-thumbsRateItPID').focus();
			}
			else if($('#sel-thumbsRateIt').val() === '')
			{
				alert('You have not selected the area. Please select something using the dropdown provided.');
				$('#sel-thumbsRateIt').focus();
			}
			else if($('#txt-thumbsRateIt').val() === '')
			{
				alert('You have not entered a comment to let us know what is wrong. Please include a comment in the field provided.');
				$('#txt-thumbsRateIt').focus();
			}
			else
			{
				loadRateIt($('#ipt-thumbsRateItPID').val(), $('#sel-thumbsRateIt').val(), $('#txt-thumbsRateIt').val());
				$('#thumbsArea').slideUp();
			}					
		});
	});
}

/*********************************
******   Rate It Functions   *****
*********************************/

/*
 * Commands required for RateIt
*/
$(document).on("click", ".cmd-RateIt", function() 
{
	
	$.get("/cagdata/RateItDisable.xml")
	    .done(function (xml) {
	        var today = new Date();
            var path = window.location.href;
            var message
	        $(xml).find("RateItDisable").each(function () {
	            var enabledTo, $this;
	            
                $this = $(this);
                if (path.indexOf($this.find("product").text()) !== -1) {
                    enabledTo = new Date($this.find("enable").text());
                    
                    if (enabledTo > today) {                    
                        message = $this.find("message").text();
                    }
                }
            });
            
            if (message === undefined) {
                showRateItModal();
            } else {
                showRateItDisabled(message);
            }
            
	    })
	    .fail(function () {
	    
	    });
	
});

function showRateItDisabled(msg) {
    
    var result = "";
    result += '<div class="modal fade show" style="display: block;">'
    result += '<div class="modal-dialog modal-lg" role="document">'
    result += '<div class="modal-content">'
    result += '<div class="modal-header"><h5 class="modal-title">Rate It Disabled</h5><button class="close" aria-label="Close" type="button" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>'
    result += '</div>'
    result += '<div class="modal-body">'
    result += msg;  
    result += '</div>'
    result += '<div class="modal-footer"><button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>'
    result += '</div>'
    result += '</div>'
    result += '</div>'
    result += '</div>'
    
	
	$(result).on("hidden.bs.modal", function () { $(this).remove() })
	    .modal("show");
    
}

function showRateItModal() {

	
	// 6075844 - 15/08/2017 - Trying to fix submit button
	
	var modal = $(drawRateItModal());
	
    modal.data("hash", window.location.hash);
    
    modal
    	.on("shown.bs.modal", function () {
    		window.location.hash = modal.data("hash"); 
    		if (FindPID() === 0) {
    	    	if (localStorage.getItem('PID') !== null) {
    	    		$('#rateItPID').val(localStorage.getItem('PID'));
    	    	} else {
    	    		$('#rateItPID_div').show();
    	    	}    	
    	    } 
    	})
    	.on("hidden.bs.modal", function () {
    		$(this).remove();
    	})
    	.on('click', '#btnRateIt', function() {		
    	
    		if (FindPID() === 0) {
    		
    			if ($('#rateItPID').val().length === 7) {
    			
    				// store pid in local storage
    				
    				localStorage.setItem('PID', $('#rateItPID').val());
    		
    				if (loadRateIt($('#rateItPID').val(), $("#selRateIt").val(), $("#txtRateIt").val())) {
    					$('#rateItGot, #rateItGot2').removeClass('hidden');
    					$('#rateItGet, #rateItGet2').addClass('hidden');
    					$(modal).modal('hide');
    				}
    			} else {
    				alert('We can\'t trace your PID. Please enter it in the box provided.');
    			}
    		} else {
    		
    			localStorage.setItem('PID', $('#rateItPID').val());
    	
    			if (loadRateIt($('#rateItPID').val(), $("#selRateIt").val(), $("#txtRateIt").val())) {
    				$('#rateItGot, #rateItGot2').removeClass('hidden');
    				$('#rateItGet, #rateItGet2').addClass('hidden');
    				modal.modal('hide');
    			}
    		
    		}
    	})
    	.modal('show');

}

function drawRateItModal() 
{
	var result = '<div id="rateIt" class="modal fade"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Rate It</h5>';
	result += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body howto">';
	result += '<p class="lead">How can we improve this guidance?</p>';
	result += '<div style="display:none;" id="rateItPID_div">';
	result += '<p>We can\'t trace your PID. Please enter it below.</p>';
	result += '<h5>PID<h5>';
	result += '<input type="number" class="form-control" id="rateItPID">';
	result += '</div>';
	result += '<h5>Area</h5>';
	result += '<select class="form-control" id="selRateIt"><option value="" selected>Please Select</option><option value="Hyperlink / Tool not working">Hyperlink / Tool not working</option>';
	result += '<option value="Incorrect / Conflicting">Incorrect / Conflicting</option><option value="Guidance Improvement">Guidance Improvement</option>';
	result += '<option value="Incorrect Search Terms">Incorrect Search Terms</option><option value="Compliment">Compliment</option><option>Issue with GOV.UK content</option></select>';
	result += '<h5 class="mt-2">Comment</h5>';
	result += '<textarea id="txtRateIt" class="form-control" rows="5"></textarea><p class="mt-2">Please provide details of the route you have followed to get to this screen.</p>';
	result += '<p>An email may be created if rate it cannot automatically load, if your comments do not go into the email that is generated please add them to the bottom of the mail. If we need more any information we will contact you.</p>';
	result += '<p>Remember once you submit a Rate It you can normally track it the day after using the <a class="extLink" target="_blank" href="/system/PersonalRateIT/index.htm">Personal Rate It tool</a></p>';	
	result += '</div><div class="modal-footer"><button id="btnRateItClose" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button><button type="button" id="btnRateIt" class="btn btn-primary">Submit</button>';
	result += '</div></div></div></div>';	
	return result;
}

/*
 * Function to load Rate It response.
 * Creates variable to hold path Adviser used through the process.
 * First tries to save to CAF, if cannot (Chrome etc) will try posting to webservices folder, last resort creates email to IPDM folder.
 * @return - boolean to tell whether should close modal or not, if false sends out an alert, if true RateIt submitted so ok to close.
*/
function loadRateIt(pid, area, comment)
{	
	var ocelotLink = window.location.href; 
	var processLink = ocelotLink.substring(0, ocelotLink.length - window.location.hash.length);
	
	var screenBased = $("#holder > .card").get(0).dataset.from.split("-")[0];
	var currentBased = getCurrentProcess().meta.id;
	
	if (screenBased !== currentBased) {
        processLink = processLink.replace(currentBased, screenBased);	
	}
					
	if(area == '')
	{
		alert("Please select the relevant area using the drop down provided.");
		return false;
	}
	else
	{	
		try
		{
			var today = new Date();
			var strFile;
			strFile = "\\\\c\\s\\CAF2\\PT OPS BCT NQM Report\\rating\\" + getPID();
			strFile = strFile + today.getFullYear();
			strFile = strFile + (today.getMonth()+1);
			strFile = strFile + today.getDate()	;	
			strFile = strFile + today.getHours();
			strFile = strFile + today.getMinutes();
			strFile = strFile + today.getSeconds();
			strFile = strFile +	"c.xml";
				
			var dom = buildDocument("dataroot", "entry", 
			{
				Who: getPID(), 
				Date: (today.getTime() / (24 * 60 * 60 * 1000)) + 25569,
				Rating: 3, //rating defaulted to three for moment as only used for thumbs
				Area: area,
				Process: processLink,
				Last15: ocelotLink,
				Comment: comment
			});
					
			dom.save(strFile);
		}
		catch(err)
		{
			$.post("http://bg.cc.inrev.gov.uk/webservices/RateIt/createRateIT.asp",
			{
				Rating: $("#RateIt").attr("data-rating"),
				Area: area,
				Process: escapeHTML(processLink),
				Last15: ocelotLink ,
				Comments: escapeHTML(comment)
			},
			function(data,status)
			{
				
			})
			.fail(function()
			{			
							//$('body').append('<a id="rateITClickLink" href="mailto:4979004?subject=Rate It&body=Rating: '+$("#RateIt").attr("data-rating")+'%0D%0A Area: '+$("#Area").val()+'%0D%0A URL: '+document.location.href.replace(/&/gi,"&amp;").replace(/>/gi," ").replace(/</gi," ")+'%0D%0A Last15:' + last15String + '%0D%0A Comment: '+$("#RateItComment").val().replace(/&/gi,"&amp;")+'" class="hidden"></a>');
							$('body').append('<a id="rateITClickLink" href="mailto:4979004?subject=Rate It&body=Please do not amend data between the dollar symbols as this will prevent your Rate It from reaching the Guidance Team. You can however amend your comments below the data.%0D%0A%0D%0A$' + pid + '~3~' + area + '~' + location.href.replace(/&/gi,'&amp;') + '~' + (typeof last15String !== 'undefined' ? last15String : '') + '$%0D%0A%0D%0A' + comment.replace(/&/gi,'&amp;') + '" class="hidden"></a>');
							rateITClickLink.click();
							$('#rateITClickLink').remove();
			});
		}		
	}
	return true;
}

