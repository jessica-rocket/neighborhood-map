//Storing all locations info
var markerLocations = [{
        name: 'Pluckers Wing Bar',
        lat: 30.286693,
        long: -97.745603,
        id: '4a3fd9eef964a520ffa31fe3'
    },
    {
        name: 'Taco Joint',
        lat: 30.291600,
        long: -97.734877
    },
    {
        name: 'Kerbey Lane',
        lat: 30.291221,
        long: -97.741532
    },
    {
        name: 'The Carillon',
        lat: 30.281970,
        long: -97.740174
    },
    {
        name: 'Austin Daily Press',
        lat: 30.280220,
        long: -97.721101
    }
];
//Google Map Stylin
var styles = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#1d2c4d"
        }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#8ec3b9"
        }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#1a3646"
        }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#4b6878"
        }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#64779e"
        }]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#4b6878"
        }]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#334e87"
        }]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
            "color": "#023e58"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#283d6a"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#6f9ba5"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#1d2c4d"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#023e58"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#3C7680"
        }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#304a7d"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#98a5be"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#1d2c4d"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c6675"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#255763"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#b0d5ce"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#023e58"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#98a5be"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#1d2c4d"
        }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#283d6a"
        }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
            "color": "#3a4762"
        }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#0e1626"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#4e6d70"
        }]
    }
]
//Adding global variables
var map;

var Location = function(data) {
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.street = "";
    this.city = "";
    this.URL = "";
    this.checkins = "";

    this.visible = ko.observable(true);

    var client_ID = "AM1EFB1NIFMWH0HFLCEEMI1T2HPCSZYQ154ITJSAFEX5CODX";
    var client_Secret = "ACRSU2XG0OJZHMDY2DGDZCTI3PFUQN5UXALLWEM4VAYETZIM";
    var foursquare_URL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + client_ID + '&client_secret=' + client_Secret + '&v=20170829' + '&query=' + this.name;

    //Request from foursquare
    $.getJSON(foursquare_URL).done(function(data) {
        var foursquareResults = data.response.venues[0];
        self.URL = foursquareResults.url;
        self.street = foursquareResults.location.formattedAddress[0];
        self.city = foursquareResults.location.formattedAddress[1];
        self.checkins = foursquareResults.stats.checkinsCount;
    }).error(function() {
        alert("There has been an error. Please try back later!");
    });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        animation: google.maps.Animation.DROP,
    });

    //hides other markers based on user's search input
    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    // setting content of the clicked marker
    this.marker.addListener('click', function() {
        self.contentString = '<h2>' + data.name + "</h2>" +
            '<p>' + self.street + ' ' + self.city + '</p>' + "<p><b>" + "Total Foursquare Check-ins: " + "</b>" + self.checkins + "</p>" +
            '<a href="' + self.URL + '">' + self.URL + "</a></p>";

        self.infoWindow.setContent(self.contentString);

    		self.infoWindow.open(map, this);

    		self.marker.setAnimation(google.maps.Animation.BOUNCE);
          	setTimeout(function() {
          		self.marker.setAnimation(null);
         	}, 2100);
    	});

    	this.bounce = function(restaraunts) {
    		google.maps.event.trigger(self.marker, 'click');
    	};
    };

//Knockout View
var AppViewModel = function() {
    var self = this;

    self.restarauntSearch = ko.observable("");

    self.LocationArray = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {
            lat: 30.2849,
            lng: -97.7341
        },
        styles: styles
    });

    markerLocations.forEach(function(locationItem) {
        self.LocationArray.push(new Location(locationItem));
    });

    //getting users input and showing the results
    self.filteredList = ko.computed(function() {
        var filter = self.restarauntSearch().toLowerCase();
        if (!filter) {
            self.LocationArray().forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return self.LocationArray();
        } else {
            return ko.utils.arrayFilter(self.LocationArray(), function(locationItem) {
                var string = locationItem.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, self);

    self.mapElem = document.getElementById('map');
}

//error handling
function mapError() {
    alert("There has been an error. Please try back later!");
}

function startApp() {
    ko.applyBindings(new AppViewModel());
}
