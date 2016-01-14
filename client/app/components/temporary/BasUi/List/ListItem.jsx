import React, { Component } from 'react';
import './ListItem.styl';

class BasListItem extends Component {
  static defaultProps = {
    position: 'top',
  };

  render() {
    return (
      <div className='list-item' style={this.props.style}>
        {this.props.position == 'top' ?
        <div className='list-item__label-top'>{this.props.label}</div> : false}

        <div className='list-item__value'>
          {this.props.value}
          <span className='list-item__units'>&nbsp;{this.props.units}</span>
        </div>

        {this.props.position == 'bottom' ?
        <div className='list-item__label-bottom'>{this.props.label}</div> : false}
      </div>
    );
  }

}

export default BasListItem;
