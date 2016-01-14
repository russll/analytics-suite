import React from 'react';
import { RaisedButton } from 'material-ui';
import FileInput from './FileInput.jsx';

export default React.createClass({

  _onSubmit: function(e) {
    e.preventDefault();
    this.props.submit('offbalancedassets', this.refs);
  },

  render: function() {
    return (
      <form onSubmit={this._onSubmit}>
        <FileInput ref="offbalanceassets" label="Off-Balanced Assets"/>
        <RaisedButton type="submit" label="Загрузить" primary={true}/>
      </form>
    );
  },

});
