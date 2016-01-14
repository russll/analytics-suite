import React, { Component } from 'react';
import Relay from 'react-relay';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx';
import BorrowersCategoryChart from 'components/temporary/BorrowersCategoryChart/BorrowersCategoryChart.jsx';

class BorrowersCategoryReport extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    this._renderChart();
  }

  _renderChart = ()=> {
    new BorrowersCategoryChart(this.refs.borrowersChart, this.props.analytics);

  }

  render() {
    return (
      <BaseStore appBar={{title: 'Кредитный портфель', big: false}}>
        <div>
          <div>Категории задолженности</div>
          <div ref='borrowersChart' className='borrowers-debts-grouped-bar-chart'></div>
        </div>
      </BaseStore>
    );
  }

}

export default Relay.createContainer(BorrowersCategoryReport, {
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        borrowersDashboard {
          categories {
            category,
            debt{
                currency,
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
              currency
            }
          }
        },
        borrowersStats {
          results {
            date,
            generalDebt,
            generalDelay,
            generalDelayPercent
          }
        }
      },
    `
  }
});