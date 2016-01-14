import React, { Component } from 'react'
import { Paper, FontIcon, Styles } from 'material-ui';
let { Colors, Typography } = Styles;

import Tile from 'components/temporary/Tile/Tile.jsx'

class CategoryTile extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  render() {
    let theme = this.context.muiTheme.rawTheme;
    let tileData = this.props.category;

    let tileStyle = {
      tileRightBar: {
        height: '100%',
        position: 'absolute',
        bottom: '0',
        right: '20px',
        width: '10px',
        padding: '20px 0',
        boxSizing: 'border-box'
      },

      tileRightWrap: {
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box'
      },

      tileRightBarPercent: {
        position: 'relative',
        right: '2em',
        top: '-0.7em',
        color: '#fff'
      },

      tileRightBarLine: {
        position: 'absolute',
        bottom: 0,
        background: 'white',
        width: '100%',
        height: 0
      },
      tileContent: {
        color: 'white'
      },
      subTitle: {
        padding: '0 10px 2px 0',
        opacity: '0.8',
        fontSize: '0.7em'
      },

      tileHeading: {
        fontSize: '0.9em',
        paddingBottom: '7px',
        opacity: '0.75'
      },

      tileSum: {
        fontSize: '1.3em',
        fontWeight: '500',
        textAlign: 'left',
        marginRight: '42px',
        position: 'relative',
        top: '-3px'
      }
    };

    return (
      <Tile
        title={this.props.category.category}
        route={'/borrowers-report/' + this.props.category.category + '/2015-09-01/all'}
        type='Дашборд'
        icon='forward'
        bg={theme.palette.primaryColor1}>
        <div>
          <div className="tile_content" style={tileStyle.tileContent}>
            <div className="head" style={tileStyle.tileHeading}>Задолженность</div>
            <div className="totals">
              <div className="light_bar">
                <div className="sub_title" style={tileStyle.subTitle}>Текущая:</div>
                <div className="money" style={tileStyle.tileSum}>{this.props.category.debt.value}</div>
              </div>
              {/*


               this.props.category.category,

               this.props.category.debt.currency,
               this.props.category.debt.value,

               this.props.category.delinquency.currency,
               this.props.category.delinquency.percent,
               this.props.category.delinquency.value

               this.props.category.legalLoaners.count,
               this.props.category.legalLoaners.debts.currency,
               this.props.category.legalLoaners.debts.value,

               this.props.category.legalLoaners.reserves.currency,
               this.props.category.legalLoaners.reserves.value

               this.props.category.physLoaners.count,
               this.props.category.physLoaners.debts.currency,
               this.props.category.physLoaners.debts.value

               this.props.category.physLoaners.reserves.currency,
               this.props.category.physLoaners.reserves.value

               this.props.category.reserves.currency,
               this.props.category.reserves.percent,
               this.props.category.reserves.value
              */}
              <div className="light_bar">
                <div className="sub_title" style={tileStyle.subTitle}>{tileData.delay!='-'?'Просроченная':''}</div>
                <div className="money" style={tileStyle.tileSum}>{this.props.category.delinquency.value}</div>
              </div>
            </div>
          </div>
          {/*<div className="bar" style={tileStyle.tileRightBar}>
            <div className="wrap" style={tileStyle.tileRightWrap}>
              <div className='bar_line' style={tileStyle.tileRightBarLine}>
                <div
                  style={tileStyle.tileRightBarPercent}>{('0%'===tileData.bar||0==tileData.bar)?'':tileData.bar}</div>
              </div>
            </div>
          </div>*/}
        </div>
      </Tile>
    );
  }
}

export default CategoryTile