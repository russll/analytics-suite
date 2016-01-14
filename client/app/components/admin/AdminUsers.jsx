import React, { Component } from 'react';
import BaseStore from '../layouts/BaseStore/BaseStore.jsx';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, RaisedButton, FlatButton, Dialog, Snackbar } from 'material-ui';
import AdminUserForm from './AdminUserForm.jsx';
import AdminPagination from './AdminPagination.jsx';

import { admin } from 'app/api/analytics/admin.js';

import getMenu from 'app/services/non-standard-menus.js';
let menuItems = getMenu('admin');

export default class AdminUsers extends Component {

  constructor () {
    super();
    this.state = {
      userList: {
        results: []
      },
      editedUser: {}
    };
  }

  componentDidMount () {
    this._getUsers();
  }

  _error (err) {
    this.setState({ snackbarMessage: err.error ? err.error.message : 'Произошла ошибка!' });
    this.refs.snackbar.show();
  }

  _getUsers (page, count) {

    count = count || this.state.userList.pageSize;

    let data = {};
    if (page && count) {
      data = {
        pageNumber: page,
        pageSize: count
      };
    }

    admin.getUsers({
      data,
      success: (res) => {
        this.setState({
          userList: res.data || { results: [] }
        });
      },
      error: this._error.bind(this)
    });

  }

  _deleteUser (id) {
    admin.deleteUser({
      data: { userId: id },
      success: () => {
        this.state.userList.results = this.state.userList.results.filter(function (item) {
          return item.userId != id;
        });
        this.setState({
          userList: this.state.userList,
          snackbarMessage: 'Пользователь удалён!'
        });
        this.refs.snackbar.show();
      },
      error: this._error.bind(this)
    });
  }

  _startEditUser (id) {
    if (id === null) {
      this.setState({
        editedUser: { isEditing: true }
      });
    } else {
      admin.getUser({
        data: { userId: id },
        success: (res) => {
          res.data.isEditing = true;
          this.setState({
            editedUser: res.data
          });
        },
        error: this._error.bind(this)
      });
    }
  }

  _stopEditUser () {
    this.setState({ editedUser: {} });
  }

  _triggerFormSubmit () {
    this.refs.dialogForm._submit();
  }

  _submitEditing (data) {

    let userIdString = data.get('userId');

    // Добавляем, если нет ID.
    if (!userIdString) {

      admin.addUser({
        data,
        success: (res) => {
          this._getUsers();
          this._stopEditUser();
          this.setState({ snackbarMessage: 'Пользователь добавлен!' });
          this.refs.snackbar.show();
        },
        error: this._error.bind(this)
      });

    // Патчим, есть есть.
    } else {

      // ID должен быть числом.
      data.userId = parseInt(userIdString, 10);

      admin.patchUser({
        data,
        success: (res) => {
          this.state.userList.results.forEach(function (item) {
            if (item.userId == data.userId) {
              for (let key in data) {
                item[key] = data[key];
              }
            }
          });
          this.setState({
            userList: this.state.userList,
            snackbarMessage: 'Пользователь изменён!'
          });
          this._stopEditUser();
          this.refs.snackbar.show();
        },
        error: this._error.bind(this)
      });

    }

  }

  render () {

    const self = this;

    function createTitleRow () {
      return (
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>Имя пользователя</TableHeaderColumn>
          <TableHeaderColumn>Логин</TableHeaderColumn>
          <TableHeaderColumn>Номер телефона</TableHeaderColumn>
          <TableHeaderColumn>Активен</TableHeaderColumn>
          <TableHeaderColumn>Superuser</TableHeaderColumn>
          <TableHeaderColumn>Two-factor auth</TableHeaderColumn>
          <TableHeaderColumn></TableHeaderColumn>
          <TableHeaderColumn></TableHeaderColumn>
        </TableRow>
      );
    }

    function createRow (item) {
      return (
        <TableRow key={'admin-user-id-' + item.userId}>
          <TableRowColumn>{item.userId}</TableRowColumn>
          <TableRowColumn>{item.firstName + ' ' + item.lastName}</TableRowColumn>
          <TableRowColumn>{item.login}</TableRowColumn>
          <TableRowColumn>{item.phoneNumber}</TableRowColumn>
          <TableRowColumn>{item.isActive ? 'да' : 'нет'}</TableRowColumn>
          <TableRowColumn>{item.isSuperuser ? 'да' : 'нет'}</TableRowColumn>
          <TableRowColumn>{item.twoFactorEnabled ? 'да' : 'нет'}</TableRowColumn>
          <TableRowColumn>
            <FlatButton label="Изменить" secondary={true} onClick={self._startEditUser.bind(self, item.userId)} />
          </TableRowColumn>
          <TableRowColumn>
            <FlatButton label="Удалить" primary={true} onClick={self._deleteUser.bind(self, item.userId)} />
          </TableRowColumn>
        </TableRow>
      );
    }

    let titleRow = createTitleRow();
    let users = this.state.userList.results.map(createRow);

    let dialogActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: this._triggerFormSubmit.bind(this), ref: 'dialogSubmit' }
    ];

    let dialogTitle;
    if (this.state.editedUser.userId) {
      dialogTitle = this.state.editedUser.firstName + ' ' +
                    this.state.editedUser.lastName + ' ' +
                    '(ID: ' + this.state.editedUser.userId + ')';
    } else {
      dialogTitle = 'Новый пользователь';
    }

    return (
      <BaseStore menuItems={menuItems} breadcrumbsDisable={true}>

        <div>

          <h2>Пользователи</h2>

          <Table>
            <TableHeader>
              {titleRow}
            </TableHeader>
            <TableBody showRowHover={true}>
              {users}
            </TableBody>
          </Table>

          <RaisedButton label="Добавить пользователя" onClick={this._startEditUser.bind(this, null)} />

          <AdminPagination currentPage={this.state.userList.currentPage}
                           pageSize={this.state.userList.pageSize}
                           totalItems={this.state.userList.totalItems}
                           numPages={this.state.userList.numPages}
                           callback={this._getUsers.bind(this)} />

        </div>

        <Dialog
          title={dialogTitle}
          actions={dialogActions}
          actionFocus="submit"
          open={this.state.editedUser.isEditing}
          onRequestClose={this._stopEditUser.bind(this)}
          autoScrollBodyContent={true}>
          <AdminUserForm ref="dialogForm" user={this.state.editedUser} onSubmit={this._submitEditing.bind(this)} />
        </Dialog>

        <Snackbar
          ref="snackbar"
          message={this.state.snackbarMessage}
          autoHideDuration={2500} />

      </BaseStore>
    );

  }

}