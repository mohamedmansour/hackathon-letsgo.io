var maxCount=20;
var topPhotosIDs = [];

function parsePhotoSearch(response, callback) {
	"use strict";
	
	if (response && response.photos && response.photos.photo) {
		
		var responseMax = response.photos.photo.slice(0,maxCount);
		
		$.each(responseMax, function(i,v) {
			topPhotosIDs.push(v.id);
		});
	}
	
	callback(topPhotosIDs);
}

function getBoundingBoxPhotos(callback, minimumLongitude, minimumLatitude, maximumLongitude, maximumLatitude) {
	"use strict";
	
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page="+ maxCount +"&api_key=6119f02e6572a0626d9f1df373ef2bb4&min_upload_date=1212710400&bbox=" + minimumLongitude + "%2C" + minimumLatitude + "%2C" + maximumLongitude + "%2C" + maximumLatitude + "&has_geo=1&sort=interestingness-desc&extras=geo&format=json&jsoncallback=?", function(response){parsePhotoSearch(response,callback);});
}

