import React from 'react';

class Places extends React.Component {
  render() {
    return (
      <li role="button" className="place" tabIndex="0" onKeyPress={this.props.FourSquare.bind(this, this.props.data.marker)} onClick={this.props.FourSquare.bind(this, this.props.data.marker)}>{this.props.data.longname}</li>
    );
  }
}

export default Places;
