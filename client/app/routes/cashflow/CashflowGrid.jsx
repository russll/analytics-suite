import React, { Component } from 'react';
import Relay from 'react-relay';
import Grid from 'components/temporary/TreeGrid/Grid.jsx';
import Loading from 'components/dumb/Loading.jsx';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import ActionLaunch from 'material-ui/lib/svg-icons/action/launch';
import { AppBar, Paper, IconMenu, DropDownMenu, IconButton, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog } from 'material-ui';
let { Colors, Typography } = Styles;
import Utils from '../../lib/Utils.js'
//import DataParse from '../../lib/DataParse.js';
import Classnames from 'classnames';
import './CashFlowGrid.styl';
import '../borrowers/BorrowersReportTable.styl'

//let dp = new DataParse();
let u = new Utils();

class CashflowGrid extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      openedCashflow: null,
      openedCashflowDialog: false,
      rowState: [],
      sdate: localStorage.getItem('cf_sdate') || u.dts(new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1)),
      edate: localStorage.getItem('cf_edate') || u.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
//      type: this.props.relay.variables.type
    };

  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };
  // th = 282

  _changeCollapse = (idx)=> {
    let rowState = this.state.rowState;// this.props.relay.variables.rowState;
    rowState[idx] = !rowState[idx];
    this.setState({rowState: rowState});
//    this.props.relay.setVariables({rowState: rowState});
  };

  _toggleRow = (e)=> {
    d3.select(e.currentTarget).classed('collapsed', !d3.select(e.currentTarget).classed('collapsed'));
  };

  _openDetailsHandler = (e, t, el) => {
    this.setState({
      openedCashflow: el
    });
    this.state.openedCashflowDialog = true;
    e.stopPropagation();
  };

  _closeDetailsHandler = () => {
    this.setState({openedCashflowDialog: false});
  };

  _renderOpenedCashflowDetail() {
    let el = this.state.openedCashflow;

    function getField(field, fields) {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].fieldName == field) {
          return fields[i];
        }
      }
      return {value: {value: 0}}
    }

    let cash = el.cash.blockContent.fields;
    let client = el.client.blockContent.fields;
    let transit = el.transit.blockContent.fields;
    let tax = el.tax.blockContent.fields;
    let loans = el.loans.blockContent.fields;
    let currency = el.currency.blockContent.fields;

    return (
      <div className="detail-table">
        <div className="block-row">
          <div className="block-row__column">
            <div className="table-cell__header">Клиент</div>
            <div className="table-cell__headername">{el.client.blockTitle}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Номер</div>
                <div className="value">{getField('client_id', client).value.value}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Количество счетов</div>
                <div className="value">{getField('num_accounts', client).value.value}</div>
              </div>
            </div>
          </div>
          <div className="block-row__column">
            <div className="table-cell__header">
              Сумма: {u.dm(getField('turnover_sum', transit).value.value, 0, '.', ' ', u.ct(getField('turnover_sum', transit).value.currency))}&nbsp;
              (<i>1</i><i>2</i>)
            </div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Сумма операций</div>
                <div
                  className="value">{u.dm(getField('turnover_sum', transit).value.value) + u.ct(getField('turnover_sum', transit).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Минимальный остаток</div>
                <div
                  className="value">{u.dm(getField('minimal_the_rest', transit).value.value) + u.ct(getField('minimal_the_rest', transit).value.currency)}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">Выдано в
              кассе: {u.dm(getField('total', cash).value.value, 0, '.', ' ', u.ct(getField('total', cash).value.currency))}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Выдано в кассе</div>
                <div
                  className="value">{u.dm(getField('total', cash).value.value) + u.ct(getField('total', cash).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Зарплата</div>
                <div
                  className="value">{u.dm(getField('salary', cash).value.value) + u.ct(getField('salary', cash).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Хозяйственные нужды</div>
                <div
                  className="value">{u.dm(getField('economic_needs', cash).value.value) + u.ct(getField('economic_needs', cash).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Прочее</div>
                <div
                  className="value">{u.dm(getField('misc', cash).value.value) + u.ct(getField('misc', cash).value.currency)}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Выплаты: {u.dm(getField('tax_demands', tax).value.value, 0, '.', ' ', '₽')} <i>1</i></div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Коэффициент</div>
                <div
                  className="value">{getField('coefficient', tax).value.value + u.ct(getField('coefficient', cash).value.currency) }</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Налоговые выплаты</div>
                <div
                  className="value">{u.dm(getField('tax_demands', tax).value.value) + u.ct(getField('tax_demands', cash).value.currency)}</div>
              </div>
              <FlatButton secondary={true}
                          label="Подробнее"
                          onClick={()=>{this.context.history.pushState(null, u.cPath('/cashflow/tax?', {client: getField('client_id', client).value.value, sdate:this.state.sdate, edate:this.state.edate }));}}/>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Выдано: {u.dm(getField('lend', loans).value.value, 0, '.', ' ', '₽')}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Выдано</div>
                <div className="value">{u.dm(getField('lend', loans).value.value)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Погашено</div>
                <div className="value">{u.dm(getField('repaid', loans).value.value)}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Оборот: {u.dm(getField('turnover', currency).value.value, 0, '.', ' ', u.ct(getField('tax_demands', currency).value.currency))}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Оборот в валюте</div>
                <div
                  className="value">{u.dm(getField('turnover', currency).value.value) + u.ct(getField('tax_demands', currency).value.currency) }</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Вывод в валюте</div>
                <div
                  className="value">{u.dm(getField('withdrawal', currency).value.value) + u.ct(getField('tax_demands', currency).value.currency)}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  };

  render() {
    let table = this.props.data.cashflowClients.results;
    let viewPortHeight = window.innerHeight - 435;
    if (viewPortHeight < 200) viewPortHeight = 330;
    let tableHeight = (viewPortHeight) + 'px';

    let style = {
      tbody: {
        height: Math.floor((window.innerHeight - 74 - 64 - 64 - 48 - 48) / 48) * 48 - 8 - 64,
        width: 5 * (240 + 16) + 320 + 16
      },
      tmain: {
        width: window.innerWidth - 48
      },
      dropdownPager: {
        fontSize: '12px',
        top: '11px'
      },
      dropdown: {
        top: '3px',
        fontSize: '13px',
        height: '36px',
        width: '86px'
      },
      wrapper: {
        height: tableHeight,
        overflowY: 'scroll',
        overflowX: 'hidden',
        width: '1520px'
      },
      table: {
        width: '1500px',
        borderSpacing: '10px',
        borderCollapse: 'separate'
      },
      datePicker: {
        display: 'inline-block'
      },
      filterTitle: {
        color: Typography.textLightBlack,
        fontWeight: Typography.fontWeightNormal
      },
      quadClient: {
        display: 'block',
        width: '300px',
        float: 'left',
        margin: '0 2px',
        clear: 'both',
        fontSize: '12px',
        textAligin: 'center'
      },
      quad: {
        display: 'block',
        width: '220px',
        float: 'left',
        margin: '0 2px',
        clear: 'both',
        fontSize: '14px',
        textAligin: 'left'
      }
    };
    let dataTable;

    function getField(field, fields) {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].fieldName == field) {
          return fields[i];
        }
      }
      return {value: {value: 0}}
    }


    let rows = table.map((el, idx)=> {
      let cash = el.cash.blockContent.fields;
      let client = el.client.blockContent.fields;
      let transit = el.transit.blockContent.fields;
      let tax = el.tax.blockContent.fields;
      let loans = el.loans.blockContent.fields;
      let currency = el.currency.blockContent.fields;
      let transit_indicators = '';
      let tax_indicators = '';
      let currency_indicators = '';

      //console.log('bi',el.transit.blockContent.indicators);

      if (el.transit.blockContent.indicators) {
        transit_indicators = el.transit.blockContent.indicators.map((e)=> {
          return (<span title={e.name} style={{'backgroundColor':e.color}} className={'indi '}></span>);
        });
      }
      if (el.tax.blockContent.indicators) {
        tax_indicators = el.tax.blockContent.indicators.map((e)=> {
          if (e.name)return (
            <span title={e.name} style={{'backgroundColor':e.color}} className={'indi '+e.name}></span>);
        });
      }
      if (el.currency.blockContent.indicators) {
        currency_indicators = el.currency.blockContent.indicators.map((e)=> {
          if (e.name)return (
            <span title={e.name} style={{'backgroundColor':e.color}} className={'indi '+e.name}></span>);
        });
      }

      return (
        <div key={getField('client_id', client).value.value} className="block-row collapsed"
             onClick={(e, t)=>this._toggleRow(e)}>
          <div className="block-row__column_mobile" onClick={(e,t)=>{this._openDetailsHandler(e,t,el)}}>
            <div className="table-cell__header">
              <div className="table-cell__headername">
                {el.client.blockTitle}
              </div>
              <div className="indic">
                {transit_indicators}{tax_indicators}{currency_indicators}
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
            <div className="table-cell__headername" title={el.client.blockTitle}>{el.client.blockTitle}</div>
            </div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Номер</div>
                <div className="value">{getField('client_id', client).value.value}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Количество счетов</div>
                <div className="value">{getField('num_accounts', client).value.value}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Сумма: {u.dm(getField('turnover_sum', transit).value.value, 0, '.', ' ', u.ct(getField('turnover_sum', transit).value.currency))}{transit_indicators}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Сумма операций</div>
                <div
                  className="value">{u.dm(getField('turnover_sum', transit).value.value) + u.ct(getField('turnover_sum', transit).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Минимальный остаток</div>
                <div
                  className="value">{u.dm(getField('minimal_the_rest', transit).value.value) + u.ct(getField('minimal_the_rest', transit).value.currency)}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">Выдано в
              кассе: {u.dm(getField('total', cash).value.value, 0, '.', ' ', u.ct(getField('total', cash).value.currency))}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Выдано в кассе</div>
                <div
                  className="value">{u.dm(getField('total', cash).value.value) + u.ct(getField('total', cash).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Зарплата</div>
                <div
                  className="value">{u.dm(getField('salary', cash).value.value) + u.ct(getField('salary', cash).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Хозяйственные нужды</div>
                <div
                  className="value">{u.dm(getField('economic_needs', cash).value.value) + u.ct(getField('economic_needs', cash).value.currency)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Прочее</div>
                <div
                  className="value">{u.dm(getField('misc', cash).value.value) + u.ct(getField('misc', cash).value.currency)}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Выплаты: {u.dm(getField('tax_demands', tax).value.value, 0, '.', ' ', '₽')} {tax_indicators}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Коэффициент</div>
                <div
                  className="value">{getField('coefficient', tax).value.value + u.ct(getField('coefficient', cash).value.currency) }</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Налоговые выплаты</div>
                <div
                  className="value">{u.dm(getField('tax_demands', tax).value.value) + u.ct(getField('tax_demands', cash).value.currency)}</div>
              </div>
              <FlatButton secondary={true}
                          label="Подробнее"
                          onClick={()=>{ this.context.history.pushState(null, u.cPath('/cashflow/tax?',
                    { client:getField('client_id', client).value.value, sdate:this.state.sdate, edate:this.state.edate }                                                                                 )
                  );
                  }
                }
              />
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Выдано: {u.dm(getField('lend', loans).value.value, 0, '.', ' ', '₽')}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Выдано</div>
                <div className="value">{u.dm(getField('lend', loans).value.value)}</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Погашено</div>
                <div className="value">{u.dm(getField('repaid', loans).value.value)}</div>
              </div>
            </div>
          </div>

          <div className="block-row__column">
            <div className="table-cell__header">
              Оборот: {u.dm(getField('turnover', currency).value.value, 0, '.', ' ', u.ct(getField('tax_demands', currency).value.currency))}{currency_indicators}</div>
            <div className="table-cell__body">
              <div className="table-cell__data">
                <div className="title">Оборот в валюте</div>
                <div
                  className="value">{u.dm(getField('turnover', currency).value.value) + u.ct(getField('tax_demands', currency).value.currency) }</div>
              </div>
              <div className="table-cell__data">
                <div className="title">Вывод в валюте</div>
                <div
                  className="value">{u.dm(getField('withdrawal', currency).value.value) + u.ct(getField('tax_demands', currency).value.currency)}</div>
              </div>
            </div>
          </div>

        </div>
      );
    });


    if (this.state.loading) {
      dataTable = (<Loading />);
    } else {
      dataTable = (
        <div>
          <div className="block-table" style={style.tmain}
               className={Classnames({'block-table': true, 'hidden': this.state.openedCashflowDialog})}>
            <div className="block-header">
              <div className="block-header__item">Наименование</div>
              <div className="block-header__item">Транзит</div>
              <div className="block-header__item">Обналичено</div>
              <div className="block-header__item">Налоги</div>
              <div className="block-header__item">Займы</div>
              <div className="block-header__item">Валюта</div>
            </div>
            <div className="block-body" style={style.tbody}>
              {rows}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {dataTable}
        <div ref="CashflowDetails"
             className={Classnames({'dialog-paper': true, 'visible': this.state.openedCashflowDialog})}>
          <div className="dialog-paper_header">
            <IconButton className="dialog-paper_close"
                        onClick={this._closeDetailsHandler}><NavigationClose /></IconButton>
            <div className="dialog-paper_title">Клиент</div>
          </div>
          {this.state.openedCashflow && this._renderOpenedCashflowDetail()}
        </div>
      </div>
    );
  }
}

export default CashflowGrid;
