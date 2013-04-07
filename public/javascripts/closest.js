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
	var sessionID = "1_MX4yNTQ4MjgxMn4xMjcuMC4wLjF-U3VuIEFwciAwNyAxMDoyMjoyNSBQRFQgMjAxM34wLjExMTA4NTgzfg"; // Replace with your own session ID.
	                 // See https://dashboard.tokbox.com/projects
	var token = "T1==cGFydG5lcl9pZD0yNTQ4MjgxMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz0yMjhjODY2ZGZiZTBjMTFmOGFmOWIyMDhkMTBkN2EzMmIyZDQ5OWIzOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDR5TlRRNE1qZ3hNbjR4TWpjdU1DNHdMakYtVTNWdUlFRndjaUF3TnlBeE1Eb3lNam95TlNCUVJGUWdNakF4TTM0d0xqRXhNVEE0TlRnemZnJmNyZWF0ZV90aW1lPTEzNjUzNTUzNTgmbm9uY2U9MC40NTkwMjEzNzAyMjg1NzYxNCZleHBpcmVfdGltZT0xMzY3OTQ3MzU3JmNvbm5lY3Rpb25fZGF0YT0=";

	var session = TB.initSession(sessionID);
	session.addEventListener("sessionConnected", sessionConnectHandler);
	session.connect(API_KEY, token);

	function sessionConnectHandler(event) {
		var div = document.createElement('div');
		div.setAttribute('id', 'publisher');

		var publisherContainer = document.getElementById('head');
		 // This example assumes that a publisherContainer div exists
		publisherContainer.appendChild(div);

		var publisherProperties = {width: '100%', height:'100%'};
		var publisher = TB.initPublisher(API_KEY, 'publisher', publisherProperties);
		session.publish(publisher);
	}


})(window, document);