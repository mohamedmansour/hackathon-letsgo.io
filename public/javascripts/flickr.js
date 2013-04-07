

function parsePhotoSearch(response, callback) {
	"use strict";

	if (response && response.photos && response.photos.photo) {
		getBestPlacesToVisit(response.photos.photo.filter(function(photo){return photo.owner !== "33684889@N06";}), callback);
	}
	else callback([]);

}

function getBoundingBoxPhotos(minimumLongitude, minimumLatitude, maximumLongitude, maximumLatitude, callback) {
	"use strict";

	var getty = $("#getty").is(':checked');

	var longs = [minimumLongitude, maximumLongitude].sort(),
		lats = [minimumLatitude, maximumLatitude].sort(),
		maxPhotosToGetFromFlickr = 100;

	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page="+ maxPhotosToGetFromFlickr +"&api_key=6119f02e6572a0626d9f1df373ef2bb4&min_upload_date=1212710400&bbox=" + longs[1] + "%2C" + lats[0] + "%2C" + longs[0] + "%2C" + lats[1] + "&has_geo=1&sort=interestingness-desc&extras=geo,url_l,url_s&format=json&is_getty=" + (getty?'1':'0') + "&jsoncallback=?", function(response){
		parsePhotoSearch(response,callback);
	});
	
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page="+ maxPhotosToGetFromFlickr +"&api_key=6119f02e6572a0626d9f1df373ef2bb4&min_upload_date=1212710400&bbox=" + longs[0] + "%2C" + lats[0] + "%2C" + longs[1] + "%2C" + lats[1] + "&has_geo=1&sort=interestingness-desc&extras=geo,url_l,url_s&format=json&is_getty=" + (getty?'1':'0') + "&jsoncallback=?", function(response){
		parsePhotoSearch(response,callback);
	});
	
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page="+ maxPhotosToGetFromFlickr +"&api_key=6119f02e6572a0626d9f1df373ef2bb4&min_upload_date=1212710400&bbox=" + longs[1] + "%2C" + lats[1] + "%2C" + longs[0] + "%2C" + lats[0] + "&has_geo=1&sort=interestingness-desc&extras=geo,url_l,url_s&format=json&is_getty=" + (getty?'1':'0') + "&jsoncallback=?", function(response){
		parsePhotoSearch(response,callback);
	});
	
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page="+ maxPhotosToGetFromFlickr +"&api_key=6119f02e6572a0626d9f1df373ef2bb4&min_upload_date=1212710400&bbox=" + longs[0] + "%2C" + lats[1] + "%2C" + longs[1] + "%2C" + lats[0] + "&has_geo=1&sort=interestingness-desc&extras=geo,url_l,url_s&format=json&is_getty=" + (getty?'1':'0') + "&jsoncallback=?", function(response){
		parsePhotoSearch(response,callback);
	});
}
