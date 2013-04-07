;(function(window, document){
	"use strict";

	filepicker.setKey("AxzuvJu_dSGiyF0alFV7dz");


	function pickFile() {

		filepicker.pick({
		    mimetypes: ['image/*', 'text/plain'],
		    services:['COMPUTER', 'DROPBOX', 'IMAGE_SEARCH'],
		  },
		  function(FPFile){
		  	var $cloth = $("<img class='clothesDrop' draggable='true' src='" + FPFile.url + "' />");
		  	$cloth.on("dragstart", function(e) {
				 e.originalEvent.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
				 e.originalEvent.dataTransfer.setData('Text', $cloth.attr('src')); // required otherwise doesn't work
		  	});	
		  	$("#dropSection").append($cloth);

		  },
		  function(FPError){
		    console.log(FPError.toString());
		  }
		);
	}

	$("#uploadphotoBtn").click(function() {
		pickFile();
	});
	$("#head").click(function() {
		pickFile();
	});

	$("#upperbody").click(function() {
		pickFile();
	});

	$("#lowerbody").click(function(e) {
		pickFile();
	});


	$(".drop").on("dragover", function(e) {
	  if (e.preventDefault) e.preventDefault(); // allows us to drop
    	$(this).attr("class", 'over');
	    return false;
	});

	$(".drop").on("dragenter", function(e) {
    	$(this).attr("class", 'over');
		return false;
	});

	$(".drop").on("drop", function(e) {
	    if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
	    $(this).empty().append("<img class='clothes' draggable='true' src='" + e.originalEvent.dataTransfer.getData('Text') + "' />");

		return false;
	});


	$(".drop").on("dragleave", function(e) {
    	$(this).attr("class", '');
	});


	var API_KEY = "76edb1c61510990137c63d21d0dec6492e0c196a";
	var sessionID = "1_MX4xMzMzMjM3MX4xMjcuMC4wLjF-U3VuIEFwciAwNyAwMjoxODo1OCBQRFQgMjAxM34wLjAxODUzNTQzNX4"; // Replace with your own session ID.
	                 // See https://dashboard.tokbox.com/projects
	var token = "T1==cGFydG5lcl9pZD0xMzMzMjM3MSZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1lNTVjMjUxNDU5ZjU1Y2M4YjNiYWMxM2FhODA2YzU1ZDYxNzdiZGQ0OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDR4TXpNek1qTTNNWDR4TWpjdU1DNHdMakYtVTNWdUlFRndjaUF3TnlBd01qb3hPRG8xT0NCUVJGUWdNakF4TTM0d0xqQXhPRFV6TlRRek5YNCZjcmVhdGVfdGltZT0xMzY1MzI2NDEzJm5vbmNlPTAuNzgxMjgxNDc2NDQzNzI0OCZleHBpcmVfdGltZT0xMzY1NDEyODEzJmNvbm5lY3Rpb25fZGF0YT0="; // Replace with a generated token that has been assigned the moderator role.
	             // See https://dashboard.tokbox.com/projects

	var session = TB.initSession(sessionID);
	session.addEventListener("sessionConnected", sessionConnectHandler);
	session.connect(API_KEY, token);

	function sessionConnectHandler(event) {
		var div = document.createElement('div');
		div.setAttribute('id', 'publisher');

		var publisherContainer = document.getElementById('head');
		 // This example assumes that a publisherContainer div exists
		publisherContainer.appendChild(div);

		var publisherProperties = {width: 70, height:70, name:"Bob's stream"};
		var publisher = TB.initPublisher(API_KEY, 'publisher', publisherProperties);
		session.publish(publisher);
	}


})(window, document);