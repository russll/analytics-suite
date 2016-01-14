import React from 'react';
import { RaisedButton, DatePicker } from 'material-ui';
import FileInput from './FileInput.jsx';

export default React.createClass({

  _onSubmit: function(e) {
    e.preventDefault();
    this.props.submit('livingmoney', this.refs);
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
        <FileInput ref="form101" label="101 form"/>
        <FileInput ref="interbank_lending" label="Interbank Lending"/>
        <FileInput ref="okvku_collection" label="OKVKU Collection"/>
        <FileInput ref="funds_on_corr_acc_in_other_banks" label="Funds on Correspondent Accounts in other banks"/>
        <FileInput ref="securities" label="Securities"/>

        <DatePicker hintText="Дата отчёта" onChange={this._onDateChange}/>
        <input type="hidden" ref="reportDate"/>

        <RaisedButton type="submit" label="Загрузить" primary={true}/>
      </form>
    );
  },

});
