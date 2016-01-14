import React, { Component } from 'react';
import Relay from 'react-relay';
import ListItemBas from '../components/temporary/BasUi/List/ListItem.jsx'

import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import Utils from '../lib/Utils.js'
import Loading from '../components/dumb/Loading.jsx';

import './NonBalanceAssets.styl'



let utils = new Utils();
let mui = require('material-ui');
let { Card,CardActions,CardText,FlatButton,List,Dialog } = mui;

class NonBalanceAssets extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      modal: false,
      loading: false,
      isGood:false
    };
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    window.onscroll = () => {

      if (!this.state.loading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

        this.setState({loading: true}, () => {
          this.props.relay.setVariables({
            //pageNumber: this.props.relay.variables.pageNumber + 1
            //TODO: need optimization by node interface
            goodPageSize: this.props.relay.variables.goodPageSize + this.props.relay.variables.goodPageSize,
            badPageSize: this.props.relay.variables.badPageSize + this.props.relay.variables.badPageSize
          }, (readyState) => { // this gets called twice https://goo.gl/ZsQ3Dy
            if (readyState.done) {
              this.setState({loading: false});

            }
          });
        });
      }
    }
  }

  _handleCustomDialogTouchTap = (mod_id)=> {
    this.refs[mod_id].show();
  }

  _handleCustomDialogCancel = (mod_id)=> {
    this.refs[mod_id].dismiss();
  }

  _switchColumns = () => {
    this.state.isGood ? this.setState({isGood : false}) : this.setState({isGood : true});
  }

  render() {
    let badBlock = this.props.analytics.assetsDashboard.bad.results;
    let goodBlock = this.props.analytics.assetsDashboard.good.results;
    let Blocks = this.props.analytics.assetsDashboard;
    let summaryBad = parseFloat(this.props.analytics.assetsDashboard.summary.bad.value).toFixed(2);
    let summaryGood = parseFloat(this.props.analytics.assetsDashboard.summary.good.value).toFixed(2);
    let summaryBadCur = this.props.analytics.assetsDashboard.summary.bad.currency;
    let summaryGoodCur = this.props.analytics.assetsDashboard.summary.good.currency;

    for (var key in Object.keys(badBlock)) {

    }

    let standardActions = [
      { text: 'Закрыть' },
    ];

    return (

      <BaseStore appBar={{title: "Забалансовые активы"}}>
        <div className={this.state.isGood ? 'is-good' : ''}>
          <div className="buffer30"></div>

          <div className="non-bal-column non-bal-column-bad">
            <h2>
              Активы низкого качества <div style={{display:"inline-block"}}>{utils.dm(summaryBad)} {utils.ct(summaryBadCur)}</div>
              <i className="icon-right-open-mini non-bal-column_switch" onTouchTap={this._switchColumns}></i>
            </h2>

            {Object.keys(badBlock).map((value, index) =>{

              let dates = [];
              badBlock[index].dates.forEach((el)=>{
                dates.push(utils.dc(el,3)+'  ')
                });

              return(
              <Card initiallyExpanded={true} style={{width:'100%', display:'inline-block', margin:'5px'}}>

                <div className="card__header">
                  {badBlock[index].name}
                  <span className="card__header__small-text">&nbsp;&nbsp;{badBlock[index].status}</span>
                </div>

                <CardText className="card__text" expandable={false} style={{padding:'4px'}}>

                    <ListItemBas value={badBlock[index].type} label="тип"/>
                    <ListItemBas value={utils.dm( parseFloat(badBlock[index].price.value).toFixed(2) )}
                                 units={utils.ct( badBlock[index].price.currency )}
                                 label="стоимость вывода"/>
                    <ListItemBas value={badBlock[index].manager} label="управляющий"/>
                    <ListItemBas value={dates}
                                 label="дата юридического действия"/>



                    <ListItemBas value={badBlock[index].id} label="идентификатор"/>
                    <ListItemBas value={utils.dm( parseFloat(badBlock[index].currentPrice.value).toFixed(2) )}
                                 units={utils.ct(badBlock[index].currentPrice.currency)}
                                 label="текущая оценка"/>

                    <ListItemBas value={badBlock[index].profit} style={{display:"block", width:"100%!important"}} label="выручка "/>

                </CardText>

                <CardActions>
                  <Dialog ref={"bad-mod_"+index} title="Подробнее" actions={standardActions}
                          autoDetectWindowHeight={true} autoScrollBodyContent={true}>

                    <ListItemBas value={badBlock[index].owner} label="юридический владелец"/><br/>
                    <ListItemBas value={badBlock[index].description} label="описание"/>
                    {/*<ListItemBas value="" label="Расходы"/>
                     <ListItemBas value="" label="Прибыль за месяц"/>
                     <ListItemBas value="" label="Налог на имущество"/>
                     <ListItemBas value="" label="Налог на землю"/>
                     <ListItemBas value="" label="Охрана"/>*/}

                  </Dialog>
                  <FlatButton style={{fontSize:'9px'}}
                              label="подробнее" onTouchTap={this._handleCustomDialogTouchTap.bind(this, "bad-mod_"+index)}/>
                </CardActions>

              </Card>)
              })
              }
          </div>


          <div className="non-bal-column non-bal-column-good">
            <h2>
              Вероятные к возврату <div style={{display:"inline-block"}}>{utils.dm(summaryGood)} {utils.ct(summaryGoodCur)}</div>
              <i className="icon-right-open-mini non-bal-column_switch" onTouchTap={this._switchColumns}></i>
            </h2>

            {Object.keys(goodBlock).map((value, index) => {

              let dates = [];

              if (goodBlock[index].dates != null) {
                goodBlock[index].dates.forEach((el)=>{
                  dates.push(utils.dc(el,3)+'  ')
                  })
                }

              let tprice=goodBlock[index].price.value;

              return(
              <Card initiallyExpanded={true} style={{width:'100%', display:'inline-block', margin:'5px'}}>
                <div className="card__header">
                  {goodBlock[index].name}
                  <span className="card__header__small-text">&nbsp;&nbsp;{goodBlock[index].status}</span>
                </div>

                <CardText className="card__text" expandable={false} style={{padding:'4px'}}>

                    <ListItemBas value={goodBlock[index].type} label="тип"/>
                    <ListItemBas value={utils.dm( parseFloat(goodBlock[index].price.value).toFixed(2) )}
                                 units={utils.ct(goodBlock[index].price.currency) + " (" +goodBlock[index].method +")"}
                                 label="стоимость вывода"/>
                    <ListItemBas value={goodBlock[index].manager} label="управляющий"/>
                    <ListItemBas value={dates}
                                 label="дата юридического действия"/>



                    <ListItemBas value={goodBlock[index].id} label="идентификатор"/>
                    <ListItemBas value={utils.dm( parseFloat(goodBlock[index].currentPrice.value).toFixed(2) )}
                                 units={utils.ct(goodBlock[index].currentPrice.currency)} label="текущая оценка"/>
                    <ListItemBas value={goodBlock[index].profit} style={{display:"block", width:"auto!important"}}  label="выручка "/>

                </CardText>

                <CardActions>
                  <Dialog ref={"good-mod_"+index} title="Подробнее" actions={standardActions}
                          autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                    <ListItemBas value={goodBlock[index].owner} label="юридический владелец"/><br/>
                    <ListItemBas value={goodBlock[index].description} label="описание"/>
                  </Dialog>
                  <FlatButton label="подробнее" onTouchTap={this._handleCustomDialogTouchTap.bind(this, "good-mod_"+index)}/>
                </CardActions>

              </Card>)
              })
              }
          </div>
        </div>
        {this.state.loading?<Loading/>:''}
      </BaseStore>
    );
  }
}
;

export default Relay.createContainer(NonBalanceAssets, {
  initialVariables: {
    goodPageSize : 3,
    goodPageNumber : 1,
    badPageSize : 3,
    badPageNumber : 1,
    sdate : '',
    edate : ''
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        assetsDashboard (sdate: $sdate, edate: $edate, goodPageSize: $goodPageSize, goodPageNumber: $goodPageNumber, badPageSize: $badPageSize, badPageNumber: $badPageNumber){
          bad {
            currentPage,
            numPages,
            pageSize,
            results {
              id,
              currentPrice {
                currency
                value
              },
              dates,
              description,
              manager,
              method,
              name,
              owner,
              price {
                currency,
                value
              },
              profit,
              status,
              type
            }
          },
          good {
            currentPage,
            numPages,
            pageSize,
            results {
              id,
              currentPrice {
                currency
                value
              },
              dates,
              description,
              manager,
              method,
              name,
              owner,
              price {
                currency,
                value
              },
              profit,
              status,
              type
            }
          },
          summary{
            bad {
              currency
              value
            },
            good {
              currency
              value
            }
          }
        }
      }
    `,
  },
});