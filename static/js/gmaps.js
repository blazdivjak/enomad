var urlpoints = window.location.href.replace('#','') + "/api/v1/points/";
var infowindow;
var googleMap; 
var JSONdata;
var iTmp = 0;
var geocoder;

class LocationObject {
	constructor(location,title,details) {
		this.location = location;
		this.title = title;
		this.details = details;
	}
}

function initMap() {
    var mapDiv = document.getElementById('gmap');
    googleMap = new google.maps.Map(mapDiv, {
      center: {lat: 46.057520, lng: 14.507378},
      zoom: 12
    });
    infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    // konvertitranje naslovov v koordinate
    $.getJSON(urlpoints, function( data ) {
    	JSONdata = data;
    	geocodeDataLoop();
    	
    });
}
function geocodeDataLoop() {
	setTimeout(function() {
		sendRequestFunction(iTmp);
		iTmp++;
		if (iTmp < JSONdata.length) {
		   geocodeDataLoop();
		}
	}, 500);	

}
function sendRequestFunction(idxpoint) {
	var point = JSONdata[idxpoint];
	var address = point.address + ", Ljubljana";
	geocoder.geocode({'address': address}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      var details = "<strong>"+point.poet + "</strong><br /> " + point.address + "<br />";
	      var marker = new google.maps.Marker({
			        map: googleMap,
			        position: results[0].geometry.location,
			        title: point.poet
			});
			bindInfoWindow(marker, googleMap, infowindow, details, point); 
	    } else {
	      console.log('Geocode was not successful for the following reason: ' + status + " for" + address);
	    }
	});
}
function bindInfoWindow(marker, map, infowindow, strDescription, point) {
	var pointImage = "http://placehold.it/350x350";
	if (point.image !== null) pointImage = point.image;
	strDescription += '<IMG  SRC="' + pointImage +'">';
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(strDescription);
        infowindow.open(map, marker);
    });
}
