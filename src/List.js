import React, {Component} from 'react';
import Places from './Places.js';


class Bar4Mune extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'locations': '',
      'query': '',
      'suggestions': true,
      'text': 'Hide Suggestions',
    };

    this.filterLocations = this.filterLocations.bind(this);
    this.toggleSuggestions = this.toggleSuggestions.bind(this);

  }

  filterLocations(event) {
    // this.props.closeInfoWindow();
    const {value} = event.target;
    var locations = [];
    this.props.locations.forEach(function (location) {
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      'locations': locations,
      'query': value
    });
  }


  componentWillMount() {
    this.setState({
      'locations': this.props.locations
    });
  }

  toggleSuggestions() {
    this.setState({
      'suggestions': !this.state.suggestions,
    });
    if (this.state.suggestions){
      this.setState({'text': 'Show Suggestions'});
    }else {
      this.setState({'text': 'Hide Suggestions'});
    }
  }

  render() {
    let locationlist = this.state.locations.map(function (listItem, index) {
      return (
        <Places key={index} FourSquare={this.props.FourSquare.bind(this)} data={listItem}/>
      );
    }, this);

    return (
      <div id="munesec">
      <ul>
      <li>Top Places to Visit in Riyadh</li>
      <li>
      <input role="search" aria-labelledby="filter"   type="text" placeholder="Search For Suggested Places" value={this.state.query} onChange={this.filterLocations}/>
      </li>
      <li>
      <button className="button" onClick={this.toggleSuggestions}>{this.state.text}</button>
      </li>
      {this.state.suggestions && locationlist}
      </ul>
      </div>

    );
  }
}

export default Bar4Mune;
