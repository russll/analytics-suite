import React, { Component } from 'react';
import Relay from 'react-relay';
import { basCashflow } from '../../api/analytics/bas-cashflow.js';
import Grid from 'components/temporary/TreeGrid/Grid.jsx';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import './CashflowStatistics.styl'
import Utils from '../../lib/Utils.js'
import DataParse from '../../lib/DataParse.js';
let dp = new DataParse();
let utils = new Utils();

import { AppBar, Paper, IconMenu, IconButton, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog,TableRow, TableRowColumn, TableHeader, Table, TableHeaderColumn, TableBody } from 'material-ui';
let { Colors, Typography } = Styles;
class CashflowStatistics extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
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
      },
    };
  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  }

  _changePeriod = ()=> {
    //
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

  render() {
    console.log(this.props);
    let style = {
      datePicker: {
        display: 'inline-block',
      },
      filterTitle: {
        color: Typography.textLightBlack,
        fontWeight: Typography.fontWeightNormal
      },
      table: {width: 'auto'}
    };

    return (
      <BaseStore appBar={{title: "Денежные потоки", big: false}} breadcrumbsDisable="true">

        <div className='filter'>
          <h2 className='filter__title' style={style.filterTitle}>Фильтр</h2>
          <DatePicker style={style.datePicker}
                      locale="ru_RU"
                      defaultDate={this.props.relay.variables.defaultStartDate}
                      formatDate={ (date)=>{return utils.dts(date,'/')} }
                      hintText="дата начала" autoOk={true} showYearSelector={true} onChange={this._setStartDate}/>
          <DatePicker style={style.datePicker}
                      locale="ru_RU"
                      defaultDate={this.props.relay.variables.defaultEndDate}
                      formatDate={ (date)=>{return utils.dts(date,'/')} }
                      hintText="дата конца" autoOk={true} showYearSelector={true} onChange={this._setEndDate}/>
          <FlatButton secondary={true} label="Применить" onClick={this._changePeriod}/>
        </div>

        <Card className='cashflow-statistics-card'>

          <CardTitle title={'Клиенты'} subtitle="Оборот по счетам и количество уникальных клиентов"/>
          <CardTitle>
            <div className='card-table'>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>Клиенты</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>Дебет, млн. ₽</div>
                <div className='card-table__col_width-5 card-table__col_align-right'>Кредит, млн. ₽</div>
              </div>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>ФЛ x {this.props.analytics.cashflowDashboard.uniqueClients.physical.value}</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.turnover.debit.physical.value/10000)/100}
                </div>
                <div className='card-table__col_width-5 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.turnover.credit.physical.value/10000)/100}
                </div>
              </div>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>ЮЛ x {this.props.analytics.cashflowDashboard.uniqueClients.individualAndLegal.value}</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.turnover.debit.individualAndLegal.value/10000)/100}
                </div>
                <div className='card-table__col_width-5 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.turnover.credit.individualAndLegal.value/10000)/100}
                </div>
              </div>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>Всего x {this.props.analytics.cashflowDashboard.uniqueClients.total.value}</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.turnover.debit.total.value/10000)/100}
                </div>
                <div className='card-table__col_width-5 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.turnover.credit.total.value/10000)/100}
                </div>
              </div>
            </div>
          </CardTitle>
        </Card>

        <Card className='cashflow-statistics-card'>

          <CardTitle title={'Счета'} subtitle="Открытые счета и отток клиентов"/>
          <CardTitle>
            <div className='card-table'>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>Счета</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>Отток клиентов</div>
                <div className='card-table__col_width-5 card-table__col_align-right'>Выдано кассой</div>
              </div>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>ФЛ x {this.props.analytics.cashflowDashboard.accountsOpened.physical.value}</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.clientsFlow.physical.value/10000)/100}
                </div>
                <div className='card-table__col_width-5 card-table__col_align-right'>
                  {}
                </div>
              </div>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>ЮЛ x {this.props.analytics.cashflowDashboard.accountsOpened.individualAndLegal.value}</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.clientsFlow.individualAndLegal.value/10000)/100}
                </div>
                <div className='card-table__col_width-5 card-table__col_align-right'>
                  {}
                </div>
              </div>
              <div className='card-table__row'>
                <div className='card-table__col_width-3'>Всего x {this.props.analytics.cashflowDashboard.accountsOpened.total.value}</div>
                <div className='card-table__col_width-4 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.clientsFlow.total.value/10000)/100}
                </div>
                <div className='card-table__col_width-5 card-table__col_align-right'>
                  {Math.round(this.props.analytics.cashflowDashboard.cashWithdrawal.total.value/10000)/100} млн. ₽
                </div>
              </div>
            </div>
          </CardTitle>
        </Card>

      </BaseStore>
    );
  }

}

export default Relay.createContainer(CashflowStatistics, {
  initialVariables: {
    defaultStartDate: new Date(new Date().getFullYear(), 0, 1),
    defaultEndDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    sdate: utils.dts(new Date(new Date().getFullYear(), 0, 1)),
    edate: utils.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        cashflowDashboard(sdate: $sdate, edate: $edate) {
          accountsOpened {
            physical {
              value,
            },
            individualAndLegal {
              value
            },
            total {
              value
            }
          },
          uniqueClients {
            physical {
              value,
            },
            individualAndLegal {
              value
            },
            total {
              value
            }
          },
          cashWithdrawal {
            physical {
              value,
            },
            individualAndLegal {
              value
            },
            total {
              value
            }
          },
          turnover {
            debit {
              physical {
                value,
              },
              individualAndLegal {
                value
              },
              total {
                value
              }
            },
            credit {
              physical {
                value,
              },
              individualAndLegal {
                value
              },
              total {
                value
              }
            }
          },
          clientsFlow {
            physical {
              value,
            },
            individualAndLegal {
              value
            },
            total {
              value
            }
          }
        }
      }
    `
  }
});