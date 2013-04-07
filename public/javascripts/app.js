;(function(window, document){
	"use strict";

	// Bing maps hacking stuff go here
	var map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
		credentials: PHD4.mapsKey,
		showDashboard: false,
		enableSearchLogo: false,
		enableClickableLogo: false
	});
	map.setView({ zoom: 10, center: new Microsoft.Maps.Location(37.47,-122.13)});

})(window, document);