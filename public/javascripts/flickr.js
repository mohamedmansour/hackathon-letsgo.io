var maxCount=20;
var topPhotosIDs = [];

function parsePhotoSearch(response, callback) {
	"use strict";
	
	var responseMax = response.photos.photo.slice(0,maxCount);
	
	$.each(responseMax, function(i,v) {
		topPhotosIDs.push(v.id);
	});
	
	//console.log(topPhotosIDs);
	
	callback(topPhotosIDs);
	
}

function getBoundingBoxPhotos(callback,lat1,lng1,lat2,lng2) {
	"use strict";
	
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page="+ maxCount +"&api_key=6119f02e6572a0626d9f1df373ef2bb4&min_upload_date=1212710400&bbox=1.00140103605456%2C51.35108866688886%2C1.040175061070918%2C51.3681866301438&has_geo=1&sort=interestingness-desc&extras=geo&format=json&jsoncallback=?", function(response){parsePhotoSearch(response,callback);});
}

