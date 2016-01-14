import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, FlatButton, Dialog, Snackbar } from 'material-ui';
import BaseStore from '../layouts/BaseStore/BaseStore.jsx';
import AdminPagination from './AdminPagination.jsx';

import { admin } from 'app/api/analytics/admin.js';

import getMenu from 'app/services/non-standard-menus.js';
let menuItems = getMenu('admin');

export default class AdminLogs extends Component {

  constructor () {
    super();
    this.state = {
      logsList: {
        results: []
      }
    };
  }

  componentDidMount () {
    this._getLogs();
  }

  _error (err) {
    this.setState({ snackbarMessage: err.error ? err.error.message : 'Произошла ошибка!' });
    this.refs.snackbar.show();
  }

  _getLogs (page, count) {

    count = count || this.state.logsList.pageSize;

    let data = {};
    if (page && count) {
      data = {
        pageNumber: page,
        pageSize: count
      };
    }

    admin.getLogs({
      data,
      success: (res) => {
        this.setState({
          logsList: res.data || { results: [] }
        });
      },
      error: this._error
    });

  }

  render () {

    function createTitleRow () {
      return (
        <TableRow>
          <TableHeaderColumn>User ID</TableHeaderColumn>
          <TableHeaderColumn>Браузер</TableHeaderColumn>
          <TableHeaderColumn>IP</TableHeaderColumn>
          <TableHeaderColumn>Action</TableHeaderColumn>
          <TableHeaderColumn>Module</TableHeaderColumn>
          <TableHeaderColumn>URI</TableHeaderColumn>
          <TableHeaderColumn>Token</TableHeaderColumn>
          <TableHeaderColumn>Дата и время</TableHeaderColumn>
          <TableHeaderColumn>Дополнительно</TableHeaderColumn>
        </TableRow>
      );
    }

    function createRow (item) {
      return (
        <TableRow>
          <TableRowColumn>{item.userId}</TableRowColumn>
          <TableRowColumn>{item.browser}</TableRowColumn>
          <TableRowColumn>{item.ip}</TableRowColumn>
          <TableRowColumn>{item.action}</TableRowColumn>
          <TableRowColumn>{item.module}</TableRowColumn>
          <TableRowColumn>{item.URI}</TableRowColumn>
          <TableRowColumn>{item.userToken}</TableRowColumn>
          <TableRowColumn>{item.datetime}</TableRowColumn>
          <TableRowColumn>{item.meta}</TableRowColumn>
        </TableRow>
      );
    }

    let titleRow = createTitleRow();
    let logs = this.state.logsList.results.map(createRow);

    return (
      <BaseStore menuItems={menuItems} breadcrumbsDisable={true}>
        <div>
          <h2>Логи</h2>

          <Table>
            <TableHeader>
              {titleRow}
            </TableHeader>
            <TableBody showRowHover={true}>
              {logs}
            </TableBody>
          </Table>

          <AdminPagination currentPage={this.state.logsList.currentPage}
                           pageSize={this.state.logsList.pageSize}
                           totalItems={this.state.logsList.totalItems}
                           numPages={this.state.logsList.numPages}
                           callback={this._getLogs.bind(this)} />

          </div>
      </BaseStore>
    );
  }

}