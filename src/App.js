import React, {Component} from 'react';
// import List from './ListRev.js';
import List from './List.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'locations': [
        {
          'name': "Saqer-Aljazirah Aviation Museum",
          'latitude': 24.753760,
          'longitude': 46.740260,
        },
        {
          'name': "King Abdulaziz Historical Center",
          'latitude': 24.648725,
          'longitude': 46.710520,
        },
        {
          'name': "Al Masmak Museum",
          'latitude': 24.632704,
          'longitude': 46.713412,
        },
        {
          'name': "Alhmdan Heritage Museum",
          'latitude': 24.789020,
          'longitude': 46.822194,
        },
        {
          'name': "King Salman Science Oasis",
          'latitude': 24.781251,
          'longitude': 46.710955,
        },
        {
          'name': "Olaya Park",
          'latitude': 24.681383,
          'longitude': 46.682740,
        },
        {
          'name': "King Abdullah Park",
          'latitude': 24.667249,
          'longitude': 46.734664,
        }
      ],
      'map': '',
      'foursquare': '',
      'marker': ''
    };

    this.MapSec = this.MapSec.bind(this);
    this.FourSquare = this.FourSquare.bind(this);
  }

  componentDidMount() {
    window.MapSec = this.MapSec;
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=MapSec')
  }

  MapSec() {
    let self = this;
    let mapview = document.getElementById('map');
    mapview.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapview, {
      center: {lat: 24.690779, lng: 46.702671},
      zoom: 12,
      mapTypeControl: true
    });

    let InfoWindow = new window.google.maps.InfoWindow({});

    this.setState({
      'map': map,
      'foursquare': InfoWindow
    });

    window.google.maps.event.addDomListener(window, 'resize', function () {
      let center = map.getCenter();
      window.google.maps.event.trigger(map, 'resize');
      self.state.map.setCenter(center);
    });

    let locations = [];
    this.state.locations.forEach(function (location) {
      let longname = location.name;
      let marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.latitude, location.longitude),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener('click', function () {
        self.FourSquare(marker);
      });

      location.longname = longname;
      location.marker = marker;
      location.display = true;
      locations.push(location);
    });
    this.setState({
      'locations': locations
    });

  }

  FourSquare(marker) {
    this.state.foursquare.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      'marker': marker
    });
    this.state.foursquare.setContent('Loading ...');
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

  getMarkerInfo(marker) {
    let self = this;
    let clientId = "GSNBXZTXFVTWJ12TOWGGLFEPC0NXKXPPIAUG3EYM25RPRQZF";
    let clientSecret = "3MLCDOXO1V1EDTTSP12O05TYGGJ3QMRU2SHFI5LFFV210AX4";
    let url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url)
    .then(
      function (response) {
        if (response.status !== 200) {
          self.state.foursquare.setContent("Error Occurred");
          return;
        }

        response.json().then(function (data) {
          let location_data = data.response.venues[0];
          let cont1 ='<div class="info">'+
          '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">'+location_data.name+'</a><br />'+
          location_data.categories[0].name;
          let cont2, cont3, cont4 = '';
          if (typeof location_data.location.address==="undefined"){
            cont2 = '';
          }else{
            cont2 = ' | '+location_data.location.address;
          }

          cont3 = '</div><div style="font-style:italic;">Tips: '+location_data.stats.tipCount;

          if (!typeof location_data.verified===false){
            cont4 = ' | Unverified Location</div>';
          }else{
            cont4 = ' | Verified Location</div>';
          }
          let cont = cont1+cont2+cont3+cont4;
          self.state.foursquare.setContent(cont);
        });
      }
    )
    .catch(function (err) {
      self.state.foursquare.setContent("Error Occurred");
    });
  }

  render() {
    return (
      <div>
      <List id="munesec" key="0" locations={this.state.locations} FourSquare={this.FourSquare}/>
      <div className="mapsec" id="map"></div>
      </div>
    );
  }
}

export default App;

function loadMapJS(src) {
  let link = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function () {
    document.write("Error Occurred, Maps can't be loaded, try latter!");
  };
  link.parentNode.insertBefore(script, link);
}
