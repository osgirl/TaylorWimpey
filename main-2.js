var gmarkers1 = [],
    infowindow;
// Our markers


/**
 * Function to init map
 */

function initMap() {
    infowindow = new google.maps.InfoWindow({
        content: ''
    });
    var center = new google.maps.LatLng(53.514185, -1.845703);
    var mapOptions = {
        zoom: 6,
        center: center,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
	
	var bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    for (i = 0; i < markers1.length; i++) {
        the_marker=addMarker(markers1[i]);
		bounds.extend(the_marker.getPosition());
    }
	map.fitBounds(bounds);
	
}

/**
 * Function to add marker to map
 */

function addMarker(marker) {
    var category = marker[4],
        title = marker[1],
        pos = new google.maps.LatLng(marker[2], marker[3]),
        content = marker[1],
        icon = new google.maps.MarkerImage("img/" + marker[4] + ".png", new google.maps.Size(39, 39)),
        postcode = marker[5];

    marker1 = new google.maps.Marker({
        title: title,
        position: pos,
        category: category,
        map: map,
        icon: icon,
        postcode: postcode
    });

    gmarkers1.push(marker1);

    // Marker click listener
    google.maps.event.addListener(marker1, 'click', (function (marker1, content) {
        return function () {
            infowindow.setContent(content);
            infowindow.open(map, marker1);
            map.panTo(this.getPosition());
            map.setZoom(14);
        }
    })(marker1, content));
	
	return marker1;
}

/**
 * Function to filter markers by category
 */

function filterMarkers() {
    var currentCategories = $('.filtering__checkbox:checked').map(function () {
            return this.value;
        }).get(),
        search = $('#searchMap').val(),
        searchString, regex;
	var bounds = new google.maps.LatLngBounds();
	var need_adjust=false;
    for (i = 0; i < markers1.length; i++) {
        marker = gmarkers1[i];
        if (search) {
            searchString = search.toLowerCase();
            regex = new RegExp(search, "gi");
            if ((marker.title.match(regex) || marker.postcode == searchString) && (currentCategories.indexOf(marker.category) > -1)) {
                marker.setVisible(true);
				bounds.extend(marker.getPosition());
				need_adjust=true;
            } else {
                marker.setVisible(false);
            }
        } else {
            if (currentCategories.indexOf(marker.category) > -1) {
                marker.setVisible(true);
				bounds.extend(marker.getPosition());
				need_adjust=true;
            } else {
                marker.setVisible(false);
            }
        }
    }
	if(need_adjust)map.fitBounds(bounds);
}




$(document).ready(function () {

    $('#searchMap').on('input', function () {
        filterMarkers();
    });

    $(".navbar-toggle").click(function () {
        setTimeout(function () {
            $(".nav .dropdown").addClass("open");
        }, 100);
    });

    $('.filtering__checkbox').on('change', function (e) {
        filterMarkers();
    });

});