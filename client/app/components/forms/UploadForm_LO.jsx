import React from 'react';
import { RaisedButton, DatePicker } from 'material-ui';
import FileInput from './FileInput.jsx';

export default React.createClass({

  _onSubmit: function(e) {
    e.preventDefault();
    this.props.submit('loaners', this.refs);
  },

  // TODO : Move it.
  _onDateChange: function(e, date) {
    function padDate(date) {
      return date < 10 ? '0' + date : '' + date;
    }

    date =
      date.getFullYear() + '-' +
      padDate(date.getMonth()) + '-' +
      padDate(date.getDay());
    this.refs.reportDate = date;
  },

  render: function() {
    return (
      <form onSubmit={this._onSubmit}>
        <FileInput ref="curation_list" label="Curation List"/>

        <DatePicker hintText="Дата отчёта" onChange={this._onDateChange}/>
        <input type="hidden" ref="report_date"/>

        <RaisedButton type="submit" label="Загрузить" primary={true}/>
      </form>
    );
  },

});
