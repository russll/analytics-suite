import React, { Component } from 'react';
import { Tabs, Tab, Card, Snackbar } from 'material-ui';

import UploadForm_LM from '../components/forms/UploadForm_LM.jsx';
import UploadForm_LO from '../components/forms/UploadForm_LO.jsx';
import UploadForm_OB from '../components/forms/UploadForm_OB.jsx';

import user from 'app/services/user.js';

import 'app/styles/media.styl';

import { basLivingMoney } from '../api/analytics/bas-livingmoney.js';
import { basLoaners } from '../api/analytics/bas-loaners.js';
import { basOffbalancedAssets } from '../api/analytics/bas-offbalancedassets.js';

const AUTO_HIDE = 2000;

var APIs = {
  livingmoney: basLivingMoney,
  loaners: basLoaners,
  offbalancedassets: basOffbalancedAssets,
};

export default class extends Component {

  _formSubmit(target, refs) {

    var fd = new FormData();

    for (let key in refs) {
      if (refs.hasOwnProperty(key)) {
        if (refs[key].value) {
          fd.append(key, refs[key].value);
        } else {
          fd.append(key, refs[key]);
        }
      }
    }

    APIs[target].upload({
      data: fd,
      success: () => {
        this.refs.snackSuccess.show();
      },
      error: () => {
        this.refs.snackError.show();
      },
    });

  }

  render() {

    return (
      <div>
        <Tabs className="upload_content">
          <Tab label="Ликвидные средства">
            <Card zDepth={5} className="borr_card">
              <UploadForm_LM submit={this._formSubmit.bind(this)}/>
            </Card>
          </Tab>
          <Tab label="Заёмщики">
            <Card zDepth={5} className="borr_card">
              <UploadForm_LO submit={this._formSubmit.bind(this)}/>
            </Card>
          </Tab>
          <Tab label="Непрофильные активы">
            <Card zDepth={5} className="borr_card">
              <UploadForm_OB submit={this._formSubmit.bind(this)}/>
            </Card>
          </Tab>
        </Tabs>
        <Snackbar ref="snackSuccess" message="Данные загружены!" autoHideDuration={AUTO_HIDE}/>
        <Snackbar ref="snackError" message="Произошла ошибка!" autoHideDuration={AUTO_HIDE}/>
      </div>
    );

  }

}
