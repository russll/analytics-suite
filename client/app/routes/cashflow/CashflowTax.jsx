import React, { Component } from 'react';
import Relay from 'react-relay';

import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Loading from 'components/dumb/Loading.jsx';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import Utils from '../../lib/Utils.js'
import DataParse from '../../lib/DataParse.js';
import Classnames from 'classnames';
import './CashFlow.styl';
let utils = new Utils();

import { AppBar, Paper, IconMenu, IconButton, TableRow, TableRowColumn, TableHeader, Table, TableHeaderColumn, TableBody, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog } from 'material-ui';
let { Colors, Typography } = Styles;

class CashflowTax extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      openedTaxDetail: null,
      openedTaxDetailDialog: false,
      window: {
        innerWidth: window.innerWidth
      },
      table: {
        height: (window.innerHeight - 128) + 'px',
        hoverable: true,
        fixedHeader: false,
        fixedFooter: true,
        stripedRows: false,
        showRowHover: true,
        selectable: false,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true
      }
    };
  };


  _changePeriod = ()=> {
    this.props.relay.setVariables({
      sdate: this.state.dateStart,
      edate: this.state.dateEnd
    }, (e)=> {
      this.setState({loading: !e.ready});
    });
  };

  _setStartDate = (a, b)=> {
    this.setState({dateStart: utils.dts(b)});
  };

  _setEndDate = (a, b)=> {
    this.setState({dateEnd: utils.dts(b)});
  };

  _openDetailsHandler = (e, t, el) => {
    if (window.innerWidth >= 840) return;
//    if(typeof window.orientation === 'undefined') return;     // if desctop, not mobile
    this.setState({
      openedTaxDetail: el,
      openedTaxDetailDialog: true
    });
//    this.state.openedTaxDetailDialog = true;
    e.stopPropagation();
  };
  _closeDetailsHandler = () => {
    this.setState({openedTaxDetailDialog: false});
  };

  _renderOpenedCashflowDetail() {
    let line = this.state.openedTaxDetail;
    console.log('dialog', line);
    return (
      <div>
        <div className="card-detail__body">
          <div className="card-detail__data">
            <div className="title">Дата операции</div>
            <div className="value">{ utils.dsn(line.date) }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Номер документа</div>
            <div className="value">{ line.documentId }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">БИК</div>
            <div className="value">{ line.bic }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Банк</div>
            <div className="value">{ line.bank }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Счет</div>
            <div className="value">{ line.accountNumber }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Оборот (Д)</div>
            <div
              className="value">{ utils.dm(line.turnoverDebit.value, 0, '.', ' ', utils.ct(line.turnoverDebit.currency)) }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Оборот (К)</div>
            <div
              className="value">{ utils.dm(line.turnoverCredit.value, 0, '.', ' ', utils.ct(line.turnoverCredit.currency)) }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">К.С.</div>
            <div className="value">{ line.sbu }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Наименование корреспондента</div>
            <div className="value">{ line.correspondentName }</div>
          </div>
          <div className="card-detail__data">
            <div className="title">Назначение платежа</div>
            <div className="value">{ line.paymentPurpose }</div>
          </div>
        </div>
      </div>
    );

  };

  render() {

    if (!this.props.analytics.cashflowTaxes) return null;

    let tableHeading, tableBody;
    let values = this.props.analytics.cashflowTaxes.results;
    let style = {
      datePicker: {
        display: 'inline-block',
      },
      table: {width: 'auto'},
      picker: {
        display: 'inline-block',
        verticalAlign: 'top',
        textAlign: 'left'
      },
      filterTitle: {
        color: Typography.textLightBlack,
        fontWeight: Typography.fontWeightNormal
      }
    };

    let captions = ['Дата', 'N док', 'БИК', 'БАНК', 'Счет', 'Оборот (Д)', 'Оборот (К)', 'К.С.', 'Наименование корреспондента', 'Назначение платежа'];
    let capMobile = ['Дата', 'Оборот (Д)'];
    let table;

    tableHeading = captions.map((el)=> {
      if (capMobile.indexOf(el) != -1) {
        return (<th className="mobile">{el}</th>)
      } else {
        return (<th className="regular">{el}</th>)
      }
    });

    tableBody = values.map((line)=> {
      return (
        <tr hoverable="true" onClick={(e,t)=>{this._openDetailsHandler(e,t,line)}}>
          <td className="mobile">{ utils.dsn(line.date) }</td>
          <td className="regular">{ line.documentId }</td>
          <td className="regular">{ line.bic }</td>
          <td className="regular">{ line.bank }</td>
          <td className="regular">{ line.accountNumber }</td>
          <td
            className="mobile right">{ utils.dm(line.turnoverDebit.value, 0, '.', ' ', utils.ct(line.turnoverDebit.currency)) }</td>
          <td
            className="regular">{ utils.dm(line.turnoverCredit.value, 0, '.', ' ', utils.ct(line.turnoverCredit.currency)) }</td>
          <td className="regular">{ line.sbu }</td>
          <td className="regular">{ line.correspondentName }</td>
          <td className="regular">{ line.paymentPurpose }</td>
        </tr>
      );
    });

    if (this.state.loading) {
      table = (<Loading />);
    } else {
      table = (
        <table className="cf__tax-table">
          <thead>
          <tr>
            {tableHeading}
          </tr>
          </thead>
          <tbody>
          {tableBody}
          </tbody>
        </table>
      );
    }

    return (
      <BaseStore appBar={{title: "Детализация налоговых выплат"}}>
        <div className="borrowers_table filters">

          <div className=''>
              <h2 className='filter__title' style={style.filterTitle}>Фильтр</h2>
            <div className="filter_selectors">
              <span>
                <DatePicker
                  style={style.picker}
                  textFieldStyle={{width: '148px'}}
                  maxDate={new Date()}
                  locale="ru_RU"
                  defaultDate={utils.std(this.props.relay.variables.sdate)}
                  formatDate={ (date)=>{return utils.dts(date,'/')} }
                  hintText="дата начала" autoOk={true} showYearSelector={true} onChange={this._setStartDate}
                />
              </span>
              <span>
                <DatePicker
                  style={style.picker}
                  textFieldStyle={{width: '148px'}}
                  maxDate={new Date()}
                  locale="ru_RU"
                  defaultDate={utils.std(this.props.relay.variables.edate)}
                  formatDate={ (date)=>{return utils.dts(date,'/')} }
                  hintText="дата конца" autoOk={true} showYearSelector={true} onChange={this._setEndDate}
                />
              </span>
              <FlatButton secondary={true} label="Применить" onClick={this._changePeriod}/>
            </div>
          </div>
          {table}
          <div ref="CashflowDetails"
               className={Classnames({'dialog-paper': true, 'visible': this.state.openedTaxDetailDialog})}>
            <div className="dialog-paper_header">
              <IconButton className="dialog-paper_close"
                          onClick={this._closeDetailsHandler}><NavigationClose /></IconButton>
              <div className="dialog-paper_title">Детализация</div>
            </div>
            { this.state.openedTaxDetail && this._renderOpenedCashflowDetail() }
          </div>
        </div>
      </BaseStore>
    )

  }
}
//
export default Relay.createContainer(CashflowTax, {
  initialVariables: {
    sdate: localStorage.getItem('cf_sdate') || null,
    edate: localStorage.getItem('cf_edate') || null,
    client: 'all'
  },
  //prepareVariables: prevVariables => {
  //	return {
  //		...prevVariables,
  //		sdate: localStorage.getItem('cf_sdate')||null,
  //		edate: localStorage.getItem('cf_edate')||null
  //	};
  //},
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        cashflowTaxes(client: $client, sdate: $sdate, edate: $edate) {
          results {
            accountNumber,
            bank,
            bic,
            correspondentName,
            date,
            documentId,
            paymentPurpose,
            personalAccountNumber,
            sbu,
            turnoverCredit {
                currency,
                value
            },
            turnoverDebit {
                currency,
                value
            }
          }
        }
      }
    `
  }
});