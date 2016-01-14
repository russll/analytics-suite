import React, {Component} from 'react';
import Relay from 'react-relay';
import CategoryCard from 'components/temporary/CategoryCard/CategoryCard.jsx';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx';
import ActionLaunch from 'material-ui/lib/svg-icons/action/launch';
import ActionEvent from 'material-ui/lib/svg-icons/action/event';
import { IconButton, Styles, DatePicker, FlatButton, FontIcon, Card, CardTitle } from 'material-ui';
let { ThemeManager, Typography } = Styles;
import Theme from 'styles/theme';
import Utils from '../../lib/Utils.js';
import DataParse from '../../lib/DataParse.js';
import './Borrowers.styl';
let utils = new Utils();

class Borrowers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      stop: false,
    };
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme),
    };
  };

  _openCategoryReport = ()=> {
    this.context.history.pushState(null, '/borrowers/borrowers-category-report');
  };

  _changePeriod = (a, b)=> {
    this.props.relay.setVariables({
      date: this.state.date,
    }, (e)=> {
      //this.setState({loading: !e.ready});
    });
  };

  _setStartDate = (a, b)=> {
    this.setState({date: utils.dts(b)});
  };

  render() {
    let style = {
      datePicker: {
        display: 'inline-block',
        width: '120px',
      },
      filterTitle: {
        color: Typography.textLightBlack,
        fontWeight: Typography.fontWeightNormal,
      },
      filterIcon: {
        fill: Typography.textLightBlack,
        display: 'inline-block',
      },
      miniCard: {
        overflow: 'visible',
      },
      miniCardPrime: {
        overflow: 'visible',
        position: 'relative',
        zIndex: 'initial',
      },
    };

    return (
      <div>
        <BaseStore appBar={{title: 'Кредитный портфель'}}>
          <div className='borrowers__filter'>
            <Card className='card__mini' style={style.miniCardPrime}>
              <div style={{paddingLeft: '16px', paddingRight: '16px'}}>
                <div style={{paddingLeft: '48px'}}>
                  <div style={{padding: '16px', display:'inline-block', verticalAlign: 'top', top: '-4px', position: 'relative'}}>
                    <ActionEvent style={style.filterIcon}/>
                  </div>
                  <DatePicker
                    maxDate={new Date()}
                    style={style.datePicker}
                    textFieldStyle={{width: '128px'}}
                    hintText='Выберите дату'
                    defaultDate={this.props.relay.variables.defaultDate}
                    formatDate={(date)=>utils.dts(date, '/')}
                    autoOk={true}
                    onChange={this._setStartDate}/>
                </div>
                <FlatButton style={{marginLeft: '16px'}} secondary={true} label='Применить'
                            onClick={this._changePeriod}/>
                <FlatButton style={{marginLeft: '16px'}} secondary={true} label='Графики'
                            onClick={this._openCategoryReport}/>
              </div>
            </Card>
            <Card className='card__mini' style={style.miniCardPrime}>
              <div style={{display: 'inline-block', width: '100px', fontSize: '12px', paddingLeft: '16px', paddingTop: '16px'}}>Общая</div>
              <div style={{paddingLeft: '16px', paddingTop: '16px'}}>
                <div style={{display: 'inline-block', width: '100px', fontSize: '12px'}}>Задолженность</div>
                <div style={{display: 'inline-block', width: '200px', fontSize: '12px', textAlign: 'right'}}>
                  {Math.round(this.props.analytics.borrowersDashboard.generalInformation.debt.value / 10000) / 100} млн. &#8381;
                </div>
              </div>
              <div style={{paddingLeft: '16px'}}>
                <div style={{display: 'inline-block', width: '100px', fontSize: '12px'}}>
                  Просрочка
                </div>
                <div style={{display: 'inline-block', width: '200px', fontSize: '12px', textAlign: 'right'}}>
                  ({this.props.analytics.borrowersDashboard.generalInformation.delinquency.percent}%) = {Math.round(this.props.analytics.borrowersDashboard.generalInformation.delinquency.value / 10000) / 100} млн. &#8381;
                </div>
              </div>
            </Card>
          </div>
          <div className='borrowers__store'>
            {this.props.analytics.borrowersDashboard && this.props.analytics.borrowersDashboard.categories.map((category, i)=>
              <CategoryCard
                key={category.category}
                all={this.props.analytics.borrowersDashboard.generalInformation}
                category={category}
                group={category.category}
                date={this.props.relay.variables.date}
              />)
            }
          </div>
        </BaseStore>
      </div>
    );
  }
}

export default Relay.createContainer(Borrowers, {
  initialVariables: {
    defaultDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    date: utils.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        borrowersDashboard(date: $date) {
          categories {
            category,
            debt{
                currency,
                percent
                value,
            },
            delinquency{
                currency,
                percent,
                value
            },
            legalLoaners {
                count,
                debts {
                    currency,
                    value,
                },
                reserves {
                    currency,
                    value
                }
            },
            physLoaners {
                count,
                debts {
                    currency,
                    value
                },
                reserves {
                    currency,
                    value
                }
            },
            reserves {
                currency,
                percent,
                value
            },
            statistics {
              results {
                date,
                category {
                  category,
                  debt {
                    value,
                    currency,
                    percent
                  },
                  delinquency {
                    value,
                    currency,
                    percent
                  },
                  legalLoaners {
                    count,
                    debts {
                      value,
                      currency,
                      percent
                    },
                    reserves {
                      value,
                      currency,
                      percent
                    }
                  },
                  physLoaners {
                    count,
                    debts {
                      value,
                      currency,
                      percent
                    },
                    reserves {
                      value,
                      currency,
                      percent
                    }
                  },
                  reserves {
                    value,
                    currency,
                    percent
                  }
                }
              }
            }
          }
          generalInformation {
            debt {
              currency,
              value
            }
            delinquency {
              value,
              percent
              currency
            }
          }
        }
      },
    `,
  },
});
