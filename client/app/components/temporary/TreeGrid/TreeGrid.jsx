import React, { Component } from 'react';
import Grid from './Grid.jsx';
import './TreeGrid.styl';

import Loading from 'app/components/dumb/Loading.jsx';

class TreeGrid extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tables: [],
      data: []
    };
  }

  render() {
    var data = this.props.data,
      tables = this.state.tables;

    tables = data.map((arr, it) => {
      var showHeading = (0 === it);
      return <Grid showHead={showHeading} showDetails="false" data={arr} use={this.props.use} showDialog={this.props.showDialog}
                   callDate={this.props.callDate} elDate={this.props.elDate} moduleName={this.props.moduleName}/>

    });

    if (!tables.length) {
      return (<Loading text="Пожалуйста, подождите..." />);
    }

    return (
      <div className={"treegrid "+this.props.className}>
        { tables }
      </div>
    );
  }
}

export default TreeGrid