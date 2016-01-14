import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';

import './FileInput.styl';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  _onChange(e) {

    this.value = e.target.files[0];
    this.setState({chosenFile: this.value ? this.value.name : null});

    if (this.props.onChange) {
      this.props.onChange(e);
    }

  }

  render() {
    var fileNameBlock;

    if (this.state.chosenFile) {
      fileNameBlock = (
        <span className="file-input-chosen">
          Файл: <span className="filename">{this.state.chosenFile}</span>
        </span>
      );
    }

    return (
      <div className="file-input-container">
        <RaisedButton secondary={true} label={this.props.label}>
          <input type="file" className="file-input" onChange={this._onChange.bind(this)}/>
        </RaisedButton>
        {fileNameBlock}
      </div>
    );
  }

}
