import React, { Component } from 'react';
import { CircularProgress } from 'material-ui';

import './Loading.styl';

export default class extends Component {
  render() {
    return (
      <div className="loading">
        <div className="loading__title">{this.props.text}</div>
        <div>
          <div className="loading__progress">
            <CircularProgress mode="indeterminate" color={this.props.color}/>
          </div>
        </div>
      </div>
    );
  }
}
