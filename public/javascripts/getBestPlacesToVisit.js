function getBestPlacesToVisit(topPhotos, callback) {
	"use strict";
	
	var photoSortedByDistance;
	
	$.each(topPhotos, function(i,photo) {
		photo.boringness = (i + 1)/topPhotos.length;
		if (typeof photo.longitude !== "number" || typeof photo.latitude !== "number") { 
			console.error("Photo does not have a latitude or longitiude."); 
			return; 
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
		
		photo1.averageDistanceFromOtherPhotos = totalDistanceFromOther/(topPhotos.length-1);
		photo1.weight = photo1.averageDistanceFromOtherPhotos * photo1.boringness * photo1.boringness;
	});

	photoSortedByDistance = topPhotos.slice(0)
	photoSortedByDistance.sort(function(a,b) { return a.weight - b.weight; });
	
	console.log("Run Time = " + (new Date() - startTime));
	
	callback(photoSortedByDistance);
	
}


function cityDistanceRealEarth(location1,location2) {
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