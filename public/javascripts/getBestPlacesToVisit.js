function getBestPlacesToVisit(topPhotos, callback) {
	"use strict";
	
	var maxLat = -360;
	var maxLng = -360;
	var minLat = 360;
	var minLng = 360;
	
	var photoSortedByDistance;
	
	$.each(topPhotos, function(i,photo) {
		photo.boringness = (i + 1)/topPhotos.length;
		if (typeof photo.longitude !== "number" || typeof photo.latitude !== "number") { 
			console.error("Photo does not have a latitude or longitiude."); 
			return; 
		}
		else {
			maxLat = Math.max(maxLat, photo.latitude);
			maxLng = Math.max(maxLng, photo.longitude);
			minLat = Math.min(minLat, photo.latitude);
			minLng = Math.min(minLng, photo.longitude);	
		}
	});
	
	var startTime = new Date();
	
	$.each(topPhotos, function(i,photo1) {
		var totalDistanceFromOther = 0, distance;
		$.each(topPhotos, function(j,photo2) {
			if (photo1 !== photo2) {
				distance = cityDistanceRealEarth({lat:photo1.latitude,lng:photo1.longitude},{lat:photo2.latitude,lng:photo2.longitude});
				totalDistanceFromOther += distance;
			}
		});
		
		photo1.averageDistanceFromOtherPhotos = totalDistanceFromOther/(topPhotos.length);
		photo1.weight = 1/photo1.averageDistanceFromOtherPhotos * photo1.boringness; // / Math.pow(photo1.averageDistanceFromOtherPhotos + 1,4); // Small weight is better
	});

	photoSortedByDistance = topPhotos.slice(0)
	photoSortedByDistance.sort(function(a,b) { return a.weight - b.weight; });
	
	console.log("Run Time = " + (new Date() - startTime));
	
	callback(photoSortedByDistance);
	
}


function cityDistanceRealEarth(location1,location2) {
	"use strict";

	var location1Lat = Math.PI * location1.lat/180;
	var location1Lng = Math.PI * location1.lng/180;
	var location2Lat = Math.PI * location2.lat/180;
	var location2Lng = Math.PI * location2.lng/180;

	var R = 3959; // mi
	var d = Math.acos(Math.sin(location1Lat)*Math.sin(location2Lat) + 
		Math.cos(location1Lat)*Math.cos(location2Lat) *
		Math.cos(location2Lng-location1Lng)) * R;
		
	return d;
}