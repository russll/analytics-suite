import React, { Component } from 'react';
import Relay from 'react-relay';
import Loading from 'components/dumb/Loading.jsx';
import NavigationChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/lib/svg-icons/navigation/chevron-right';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import { IconButton, Styles, FlatButton, DatePicker, DatePickerDialog } from 'material-ui';
import Utils from '../../lib/Utils.js'
import Classnames from 'classnames';
import './BorrowersReportTable.styl';
let utils = new Utils();

class BorrowersReportTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openedBorrower: null,
      openedBorrowerDialog: false,
      loading: false,
      date: this.props.location.query.date || this.props.relay.variables.date || utils.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      group: this.props.location.query.group || 'all',
      entity: this.props.location.query.entity,
      pagesize: this.props.location.query.pagesize || 20,
      pagenumber: this.props.location.query.pagenumber || 1,
      search: this.props.relay.variables.search || null,
    };
  };

  static propTypes = {
    analytics: React.PropTypes.object.isRequired
  };
  
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    document.getElementsByClassName('block-body')[0].addEventListener('scroll', this._scrollTable);
    document.getElementsByClassName('fixedcolumn')[0].addEventListener('scroll', this._scrollFixed);
  }

  componentWillUnmount() {
    document.getElementsByClassName('block-body')[0].removeEventListener('scroll', this._scrollTable);
    document.getElementsByClassName('fixedcolumn')[0].removeEventListener('scroll', this._scrollFixed);
  }

  _scrollFixed = ()=> {
    let tableBody = document.getElementsByClassName('block-body')[0];
    let fixColumn = document.getElementsByClassName('fixedcolumn')[0];
    tableBody.scrollTop = fixColumn.scrollTop;
  };

  _scrollTable = ()=> {
    let tableBody = document.getElementsByClassName('block-body')[0];
    let fixColumn = document.getElementsByClassName('fixedcolumn')[0];
    fixColumn.scrollTop = tableBody.scrollTop;
  };

  _prevPage = ()=> {
    this.context.history.pushState(null,
      utils.cPath('/borrowers/borrowers-report?',
        {
          date: this.props.relay.variables.date,
          group: this.props.relay.variables.group,
          entity: this.props.relay.variables.entity,
          pagesize: this.props.relay.variables.pagesize,
          pagenumber: this.props.relay.variables.pagenumber > 1 ? this.props.relay.variables.pagenumber - 1 : 1
        })
    );
    this.setState({pagenumber: this.props.relay.variables.pagenumber > 1 ? this.props.relay.variables.pagenumber - 1 : 1});
  }

  _nextPage = ()=> {
    this.context.history.pushState(null,
      utils.cPath('/borrowers/borrowers-report?',
        {
          date: this.props.relay.variables.date,
          group: this.props.relay.variables.group,
          entity: this.props.relay.variables.entity,
          pagesize: this.props.relay.variables.pagesize,
          pagenumber: (this.props.relay.variables.pagenumber < this.props.analytics.borrowersDetails.numPages) ? this.props.relay.variables.pagenumber + 1 : this.props.analytics.borrowersDetails.numPages
        }
      )
    );
    this.setState({pagenumber: (this.props.relay.variables.pagenumber < this.props.analytics.borrowersDetails.numPages) ? this.props.relay.variables.pagenumber + 1 : this.props.analytics.borrowersDetails.numPages});
  };

  _openDetailsHandler = (e, t, el) => {
    this.setState({
      openedBorrower: el
    });
    this.setState({openedBorrowerDialog: true});
    e.stopPropagation();
  };

  _closeDetailsHandler = () => {
    this.setState({openedBorrowerDialog: false});
  };


  // can handle any clicks inside table, but uses only for collapse.
  _tableClick = (e)=> {
    // looks for EL in parents (up to 200), and returns el.HEADERNAME or false if 404.
    function getChildNumber (node) {
      return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
    }

    // Sets same style.height on elements: el1 = left col, el2 = right col due html markup -> !important
    function _setSameHeight (el1, el2) {
      if (el1.clientHeight > el2.clientHeight){
        let height = ( el1.clientHeight - 42 - 8 ) + 'px';                    // TODO: rewrite to calculate parent height.
        let innersElements = el2.getElementsByClassName('table-cell__body');
        for (var i = 0; i < innersElements.length; i++) {
          innersElements[i].style.height = height;
        }
      } else {
        let height = ( el2.clientHeight - 42 - 24) + 'px';                    // TODO: rewrite to calculate parent height.
        el1.getElementsByClassName('table-cell__body')[0].style.height= height;
      }

    }

    var _findElinClassNameTag = (el, headerName)=> {
      let header = false;
      let i = 100;                              // deadloop insurance
      headerName = headerName || 'table-cell__header';
      while (el.tagName != 'BODY' || i == 0) {
        i--;
        if (el.className.split(' ').indexOf(headerName) !== -1) {
          header = el;
          break;
        }
        el = el.parentNode;
      }
      return header
    };
    let header = _findElinClassNameTag(e.target, 'table-cell__header');

    if (header) {
      var neighbor;
      var el = header.parentNode.parentNode;
      el.classList.toggle('collapsed');

      if('fixedcolumn' === el.parentNode.className){
        neighbor = document.getElementsByClassName('block-body')[0].childNodes[getChildNumber(el)];
        setTimeout( ()=>{_setSameHeight(el, neighbor)} );
      } else {
        neighbor = document.getElementsByClassName('fixedcolumn')[0].childNodes[getChildNumber(el)];
        setTimeout( ()=>{_setSameHeight(neighbor, el )} );
      }
      neighbor.classList.toggle('collapsed');
    }

  };

  _renderTable = ()=> {
    let table = this.props.analytics.borrowersDetails.results;

    return table.map((el)=> {
      return (
        <div key={el.client.name} className='block-row collapsed'>
          <div className='block-row__column_mobile first' onClick={(e,t)=>{this._openDetailsHandler(e,t,el)}}>
            <div className='table-cell__header'>
              <div className="table-cell__headername">{el.client.name}</div>
              <div className='indicators'>
                {el.indicators && el.indicators.map((item, i)=> {
                  return (
                    <div key={i} className='indicator indicator_mini' style={{backgroundColor: item.color}}></div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='block-row__column second'>
            <div className='table-cell__header'>
              {el.procutionDetailed.totalSum && utils.dm(el.procutionDetailed.totalSum)} {el.procution.procutionSum.value && utils.ct(el.procution.procutionSum.currency)}
              {/*el.procution.procutionSum.value && utils.dm(el.procution.procutionSum.value)*/}
            </div>
            <div className='table-cell__body'>
              {el.procution.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.procution.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма</div>
                    <div
                      className='value'>{utils.dm(el.procution.procutionSum.value)} {utils.ct(el.procution.procutionSum.currency)}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='value'>{el.procution.procSumCaptions}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              <div className='table-cell__pair_wide'>
                <div>
                  {el.reserves.calcReserveSum.value != 0 ? ('Р: ' + utils.dm(el.reserves.calcReserveSum.value) + ' ' + utils.ct(el.reserves.calcReserveSum.currency)) : false}
                </div>
                <div>
                  {el.reserves.realReserveSum.value != 0 ? ('C:' + utils.dm(el.reserves.realReserveSum.value) + ' ' + utils.ct(el.reserves.realReserveSum.currency)) : false}
                </div>
              </div>
            </div>
            <div className='table-cell__body'>
              {el.reserves.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.reserves.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма расчетного</div>
                    <div
                      className='value'>{utils.dm(el.reserves.calcReserveSum.value)}{utils.ct(el.reserves.calcReserveSum.currency)}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма cозданного</div>
                    <div
                      className='value'>{utils.dm(el.reserves.realReserveSum.value)}{utils.ct(el.reserves.realReserveSum.currency)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              {el.creditAgreements.debtSum.value && (utils.dm(el.creditAgreements.debtSum.value) + ' ' + utils.ct(el.creditAgreements.debtSum.currency))}
            </div>
            <div className='table-cell__body'>
              {el.creditAgreements.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.creditAgreements.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма по договорам</div>
                    <div
                      className='value'>{utils.dm(el.creditAgreements.debtSum.value)}{utils.ct(el.creditAgreements.debtSum.currency)}</div>
                  </div>

                  {el.creditAgreements.kpItems.map((item, i)=> {
                    return (
                      <div key={i} className='table-cell__item'>
                        <div className='table-cell__data'>
                          <div className='value'>{item.credit}</div>
                          <div className='value'>{utils.dm(item.debtSum)} { utils.ct(item.currency)}</div>
                        </div>
                        <div className='table-cell__data'>
                          <div className='value'>{item.rate}%</div>
                          <div className='value'>с {utils.dsn(item.dateStart)} по {utils.dsn(item.dateEnd)}</div>
                        </div>
                      </div>);
                  })}
                </div>
              )}

              <FlatButton secondary={true}
                          label='Подробнее'
                          onClick={()=>{this.context.history.pushState(null,
                                utils.cPath('/borrowers/borrowers-client-loan-portfolio-report?',{loaner:el.client.number, date: this.props.relay.variables.date})
                              );
                            }
                        }
              />


            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              {el.legalChanges.fnsChangeCounter}
            </div>
            <div className='table-cell__body'>
              {el.legalChanges.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.legalChanges.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Число изменений</div>
                    <div className='value'>{el.legalChanges.fnsChangeCounter}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Последние три:</div>

                  </div>
                  {el.legalChanges.lastThree && el.legalChanges.lastThree.map((item, i)=> {
                    return (
                      <div key={i} className='table-cell__item'>
                        <div className='table-cell__data'>
                          <div className='title'>Дата</div>
                          <div className='value'>{item.name}</div>
                        </div>
                        <div className='table-cell__data'>
                          <div className='title'>Тип изменения</div>
                          <div className='value'>{item.change}</div>
                        </div>
                      </div>);
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              <div className='table-cell__pair_wide'>
                <div>
                  {el.arbitration.plainCountTotal && +el.arbitration.plainCountTotal != 0 && ('Истец: ' + el.arbitration.plainCountTotal)}
                </div>
                <div>
                  {el.arbitration.defCountTotal && +el.arbitration.defCountTotal != 0 && ('Ответчик: ' + el.arbitration.defCountTotal)}
                </div>
              </div>
            </div>
            <div className='table-cell__body'>
              {el.arbitration.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.arbitration.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='left'>
                    <div className='table-cell__data'>
                      <div className='title'>Истец</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за год</div>
                      <div className='value'>{el.arbitration.plainCountLastYear}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{utils.dm(el.arbitration.plainSumLastYear)} ₽</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за все время</div>
                      <div className='value'>{el.arbitration.plainCountTotal}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{ utils.dm(el.arbitration.plainSumTotal) } ₽</div>
                    </div>

                  </div>
                  <div className='right'>
                    <div className='table-cell__data'>
                      <div className='title'>Ответчик</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за год</div>
                      <div className='value'>{el.arbitration.defCountLastYear}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{utils.dm(el.arbitration.defSumLastYear)} ₽</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за все время</div>
                      <div className='value'>{el.arbitration.defCountTotal}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{ utils.dm(el.arbitration.defSumTotal) } ₽</div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div
              className='table-cell__header'>{el.cashFlow && el.cashFlow.billsCount != 0 && el.cashFlow.billsCount}</div>
            <div className='table-cell__body'>
              {el.cashFlow.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.cashFlow.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  {el.cashFlow && (
                    <div>=
                      <div className='table-cell__data'>
                        <div className='title'>Открытых счетов</div>
                        <div className='value'>{el.cashFlow.billsCount}</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Период:</div>
                        <div className='value'>{el.cashFlow.dateStart} - {el.cashFlow.dateEnd}</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Среднемесячный остаток:</div>
                        <div className='value'>{utils.dm(el.cashFlow.balanceSum.value)} руб</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Среднемесячный оборот по дебету:</div>
                        <div className='value'>{utils.dm(el.cashFlow.debtSum.value)}</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Среднемесячный оборот по кредиту:</div>
                        <div className='value'>{utils.dm(el.cashFlow.creditSum.value)}</div>
                      </div>
                    </div>)
                  }
                </div>
              )}
              <FlatButton secondary={true}
                          label='Подробнее'
                          onClick={()=>{this.context.history.pushState(null, utils.cPath('/borrowers/borrowers-client-saldo-report?',{loaner:el.client.number , date: this.state.date}) );}}/>
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>{el.owners.ceo}</div>
            <div className='table-cell__body'>
              {el.owners.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.owners.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Руководитель:</div>
                    <div className='value'>{el.owners.ceo}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Дата назначения:</div>
                    <div className='value'>{el.owners.ceoDate}</div>
                  </div>

                  {el.owners.list && el.owners.list.map((item, i)=> {
                    return (
                      <div key={i} className='table-cell__item'>
                        <div className='table-cell__data'>
                          <div className='title'>Бенефециар</div>
                          <div className='value'>{item.name}</div>
                        </div>
                        <div className='table-cell__data'>
                          <div className='title'>Процент владения</div>
                          <div className='value'>{Math.round(item.percent * 100) / 100}%</div>
                        </div>
                      </div>);
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>{el.executive.count}</div>
            <div className='table-cell__body'>
              {el.executive.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.executive.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Количество:</div>
                    <div className='value'>{el.executive.count}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма:</div>
                    <div className='value'>{utils.dm(el.executive.totalSum)} ₽</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })
  };

  _getSelectedPageSize = ()=> {
    let count = this.props.relay.variables.pagesize;
    let pageRows = [
      {payload: '10', text: '10'},
      {payload: '20', text: '20'},
      {payload: '50', text: '50'},
      {payload: '100', text: '100'}
    ];

    for (let i = 0; i < pageRows.length; i++) {
      if (pageRows[i].payload == count) {
        return i;
      }
    }
    return 1
  }

  _renderOpenedBorrowerDetail() {
    let el = this.state.openedBorrower;

    return (
      <div className='detail-table'>
        <div className='block-row'>
          <div className='block-row__column'>
            <div className='table-cell__header'>Заемщик</div>
            <div className='table-cell__body'>
              <div className='table-cell__data'>
                <div className='title'>Номер</div>
                <div className='value'>{el.client.number}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Группы</div>
                <div className='value'>{el.client.groupCodes}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Ответственный</div>
                <div className='value'>{el.client.courator}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Текущая задолженность</div>
                <div
                  className='value'>{ utils.dm(el.client.debtSum.value) }{ utils.ct(el.client.debtSum.currency)}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>ОКВЭД</div>
                <div className='value'>{ el.client.okved.text }{el.client.okved.text}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Деятельность</div>
                <div className='value'>{el.client.legal ? 'ЮЛ' : 'ФЛ'}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Количество договоров</div>
                <div className='value'>{el.client.agreementsCount}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>ИИН</div>
                <div className='value'>{el.client.tin}</div>
              </div>

            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              <div className='indicators'>
                {el.indicators && el.indicators.map((item, i)=> {
                  return (
                    <div key={i} className='indicator' style={{backgroundColor: item.color}}></div>
                  )
                })}
              </div>
            </div>
            <div className='table-cell__body'>
              <div className='table-cell__data'>
                <div className='title'>Индикаторы</div>
                <div className='value'></div>
              </div>
              {el.indicators && el.indicators.map((item, i)=> {
                return (
                  <div key={i} className='table-cell__item'>
                    <div className='table-cell__data'>
                      <div className='value'>
                        <div className='indicator indicator_mini' style={{backgroundColor: item.color}}></div>
                        {item.block}
                      </div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>{item.icon}</div>
                      <div className='value'></div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>{item.name}</div>
                      <div className='value'></div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>{item.title}</div>
                      <div className='value'></div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>{item.help_text}</div>
                      <div className='value'></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              Обеспечение
            </div>
            <div className='table-cell__body'>
              {el.procution.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.procution.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма</div>
                    <div className='value'>{utils.dm(el.procution.procutionSum.value)} {utils.ct(el.procution.procutionSum.currency)}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='value'>{el.procution.procSumCaptions}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              Резервы
            </div>
            <div className='table-cell__body'>
              {el.reserves.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.reserves.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма расчетного</div>
                    <div
                      className='value'>{utils.dm(el.reserves.calcReserveSum.value)}{utils.ct(el.reserves.calcReserveSum.currency)}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма cозданного</div>
                    <div
                      className='value'>{utils.dm(el.reserves.realReserveSum.value)}{utils.ct(el.reserves.realReserveSum.currency)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='block-row__column'>
            <div className='table-cell__header'>
              Кредитные договора
            </div>
            <div className='table-cell__body'>
              {el.creditAgreements.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.creditAgreements.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма по договорам</div>
                    <div
                      className='value'>{utils.dm(el.creditAgreements.debtSum.value)}{utils.ct(el.creditAgreements.debtSum.currency)}</div>
                  </div>

                  {el.creditAgreements.kpItems.map((item, i)=> {
                    return (
                      <div key={i} className='table-cell__item'>
                        <div className='table-cell__data'>
                          <div className='value'>{item.credit}</div>
                          <div className='value'>{utils.dm(item.debtSum)} { utils.ct(item.currency)}</div>
                        </div>
                        <div className='table-cell__data'>
                          <div className='value'>{item.rate}</div>
                          <div className='value'>с {utils.dsn(item.dateStart)} по {utils.dsn(item.dateEnd)}</div>
                        </div>
                      </div>);
                  })}
                </div>
              )}

              <FlatButton secondary={true}
                          label='Подробнее'
                          onClick={()=>{this.context.history.pushState(null, utils.cPath('/borrowers/borrowers-client-loan-portfolio-report?', {loaner: el.client.number, date:this.state.date}));}}/>
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              Изменения в ЮЛ
            </div>
            <div className='table-cell__body'>
              {el.legalChanges.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.legalChanges.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Число изменений</div>
                    <div className='value'>{el.legalChanges.fnsChangeCounter}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Последние три:</div>

                  </div>
                  {el.legalChanges.lastThree && el.legalChanges.lastThree.map((item, i)=> {
                    return (
                      <div key={i} className='table-cell__item'>
                        <div className='table-cell__data'>
                          <div className='title'>Дата</div>
                          <div className='value'>{item.name}</div>
                        </div>
                        <div className='table-cell__data'>
                          <div className='title'>Тип изменения</div>
                          <div className='value'>{item.change}</div>
                        </div>
                      </div>);
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>
              Арбитраж
            </div>
            <div className='table-cell__body'>
              {el.arbitration.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.arbitration.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='left'>
                    <div className='table-cell__data'>
                      <div className='title'>Истец</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за год</div>
                      <div className='value'>{el.arbitration.plainCountLastYear}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{utils.dm(el.arbitration.plainSumLastYear)} ₽</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за все время</div>
                      <div className='value'>{el.arbitration.plainCountTotal}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{ utils.dm(el.arbitration.plainSumTotal) } ₽</div>
                    </div>

                  </div>
                  <div className='right'>
                    <div className='table-cell__data'>
                      <div className='title'>Ответчик</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за год</div>
                      <div className='value'>{el.arbitration.defCountLastYear}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{utils.dm(el.arbitration.defSumLastYear)} ₽</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Споров за все время</div>
                      <div className='value'>{el.arbitration.defCountTotal}</div>
                    </div>
                    <div className='table-cell__data'>
                      <div className='title'>Сумма</div>
                      <div className='value'>{ utils.dm(el.arbitration.defSumTotal) } ₽</div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>Денежный поток</div>
            <div className='table-cell__body'>
              {el.cashFlow.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.cashFlow.statusMessage)}
                  </div>
                </div>
              ) : (

                <div>
                  {el.cashFlow && (
                    <div>=
                      <div className='table-cell__data'>
                        <div className='title'>Открытых счетов</div>
                        <div className='value'>{el.cashFlow.billsCount}</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Период:</div>
                        <div className='value'>{el.cashFlow.dateStart} - {el.cashFlow.dateEnd}</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Среднемесячный остаток:</div>
                        <div className='value'>{utils.dm(el.cashFlow.balanceSum.value)} руб</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Среднемесячный оборот по дебету:</div>
                        <div className='value'>{utils.dm(el.cashFlow.debtSum.value)}</div>
                      </div>
                      <div className='table-cell__data'>
                        <div className='title'>Среднемесячный оборот по кредиту:</div>
                        <div className='value'>{utils.dm(el.cashFlow.creditSum.value)}</div>
                      </div>
                    </div>)
                  }
                </div>
              )}
              <FlatButton secondary={true}
                          label='Подробнее'
                          onClick={()=>{this.context.history.pushState(null, utils.cPath('/borrowers/borrowers-client-saldo-report?',{loaner:el.client.number , date: this.state.date}) );}}/>
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>Владельцы</div>
            <div className='table-cell__body'>
              {el.owners.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.owners.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Руководитель:</div>
                    <div className='value'>{el.owners.ceo}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Дата назначения:</div>
                    <div className='value'>{el.owners.ceoDate}</div>
                  </div>

                  {el.owners.list && el.owners.list.map((item, i)=> {
                    return (
                      <div key={i} className='table-cell__item'>
                        <div className='table-cell__data'>
                          <div className='title'>Бенефециар</div>
                          <div className='value'>{item.name}</div>
                        </div>
                        <div className='table-cell__data'>
                          <div className='title'>Процент владения</div>
                          <div className='value'>{Math.round(item.percent * 100) / 100}%</div>
                        </div>
                      </div>);
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='block-row__column'>
            <div className='table-cell__header'>Исполнительное производство</div>
            <div className='table-cell__body'>
              {el.executive.status == 'error' ? (
                <div className='table-cell__data'>
                  <div className='value'>
                    {utils.decorateStatusMessage(el.executive.statusMessage)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='table-cell__data'>
                    <div className='title'>Количество:</div>
                    <div className='value'>{el.executive.count}</div>
                  </div>
                  <div className='table-cell__data'>
                    <div className='title'>Сумма:</div>
                    <div className='value'>{utils.dm(el.executive.totalSum)} ₽</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let theight = Math.floor((window.innerHeight - 74 - 64 - 64 - 48 - 48) / 48) * 48 - 8 - 60 - 15;
    let twidth = 8 * (240 + 16) + 16;

    let style = {
      fheight:{
        height: theight,
      },
      lWidth:{
        width: twidth,
      },
      firstColumn:{
        position:'absolute',
        height:theight,
        top: '42px'
      },
      tbody: {
        height: theight,
        width: twidth,
      },
      labelStyle: {
        fontSize: '12px',
        color: 'rgba(0,0,0,.54)'
      },
      dropdown: {
        width: '80px'
      }
    };
    let data = this.props.analytics.borrowersDetails;
    let firstcolumn = data.results.map((el)=>{
      return(
        <div className="block-row collapsed">
          <div className='block-row__column first'>
            <div className='table-cell__header'>
              <div className="table-cell__headername">{el.client.name}</div>
              <div className='indicators'>
                {el.indicators && el.indicators.map((item, i)=> {
                  return (
                  <div key={i} className='indicator' style={{backgroundColor: item.color}}></div>
                    )
                  })}
              </div>
            </div>
            <div className='table-cell__body'>
              <div className='table-cell__data'>
                <div className='title'>Номер</div>
                <div className='value'>{el.client.number}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Группы</div>
                <div className='value'>{el.client.groupCodes}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Ответственный</div>
                <div className='value'>{el.client.courator}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Текущая задолженность</div>
                <div className='value'>{ utils.dm(el.client.debtSum.value) }{ utils.ct(el.client.debtSum.currency)}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>ОКВЭД</div>
                <div className='value'>{ el.client.okved.text }{el.client.okved.text}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Деятельность</div>
                <div className='value'>{el.client.legal ? 'ЮЛ' : 'ФЛ'}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>Количество договоров</div>
                <div className='value'>{el.client.agreementsCount}</div>
              </div>
              <div className='table-cell__data'>
                <div className='title'>ИИН</div>
                <div className='value'>{el.client.tin}</div>
              </div>

            </div>
          </div>
        </div>
      );
    });

    return (
      <div style={{position:'relative'}}>
        <div className={Classnames({'block-table': true, 'hidden': this.state.openedBorrowerDialog})}>
          <div className='block-header'>
            <div className='block-header__item first'>Заемщик</div>
            <div className='block-header__item'>Индикаторы</div>
            <div className='block-header__item'>Обеспечение</div>
            <div className='block-header__item'>Резервы</div>
            <div className='block-header__item'>Кредитные договора</div>
            <div className='block-header__item'>Изменения в ЮЛ</div>
            <div className='block-header__item'>Арбитраж</div>
            <div className='block-header__item'>Денежный поток</div>
            <div className='block-header__item'>Владельцы</div>
            <div className='block-header__item'>Исполнительное производство</div>
          </div>
          <div className="table_content">
            <div className='block-body fixedFirstColumn' style={style.tbody} onClick={(e, t)=>this._tableClick(e)}>
              {this._renderTable()}
            </div>
            <div className="scrolldiv" style={style.firstColumn} >
              <div className="fixedcolumn" style={style.fheight}onClick={(e, t)=>this._tableClick(e)}>
                {firstcolumn}
              </div>
            </div>
          </div>
        </div>
        <div className={Classnames({'paginator': true, 'hidden': this.state.openedBorrowerDialog})}>
          <span className='paginator__pages-title'>{data.currentPage} из {data.numPages}</span>
          <IconButton className='paginator__pages-arrow' onClick={this._prevPage}><NavigationChevronLeft /></IconButton>
          <IconButton className='paginator__pages-arrow' onClick={this._nextPage}><NavigationChevronRight /></IconButton>
        </div>

        <div ref='borrowerDetails'
             className={Classnames({'dialog-paper': true, 'visible': this.state.openedBorrowerDialog})}>
          <div className='dialog-paper_header'>
            <IconButton className='dialog-paper_close' onClick={this._closeDetailsHandler}><NavigationClose /></IconButton>
            <div className='dialog-paper_title'>Заемщик</div>
          </div>
          {this.state.openedBorrower && this._renderOpenedBorrowerDetail()}
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(BorrowersReportTable, {
  initialVariables: {
    date: '2015-10-01',
    group: 'all',
    entity: 'all',
    pagenumber: 1,
    pagesize: 20,
    count: 100,
    indicators: '',
    search: '',
  },
  fragments: {
    analytics: (variables) => Relay.QL`
      fragment on Analytics {
        borrowersDetails (date: $date, group: $group, entity: $entity, pageNumber: $pagenumber, pageSize: $pagesize, search: $search, indicators: $indicators) {
          totalItems,
          numPages,
          currentPage,
          pageSize,
          date,
          results {
            activeActions {
              color,
              status,
              statusMessage,
              haveAny,
              procSumCaptions,
              calcReserveSum {
                value,
                currency,
                percent
              },
              realReserveSum {
                value,
                currency,
                percent
              },
              procutionSum {
                value,
                currency,
                percent
              },
            },
            arbitration {
              color,
              status,
              statusMessage,
              defCountLastYear,
              defSumLastYear,
              defCountTotal,
              defSumTotal,
              plainSumTotal,
              plainCountTotal,
              plainSumLastYear,
              plainCountLastYear
            },
            cashFlow {
              color,
              status,
              statusMessage,
              billsCount,
              balanceSum {
                currency,
                value
              },
              debtSum{
                currency,
                value
              },
              creditSum {
                currency,
                value
              },
              dateStart,
              dateEnd
            },
            client{
              color,
              status,
              statusMessage,
              courator,
              debtSum {
                currency,
                value
              },
              groupCodes,
              legal,
              name,
              number,
              okved,
              tin,
              agreementsCount
            },
            creditAgreements {
              color,
              status,
              statusMessage,
              debtSum {
                currency,
                value
              },
              kpItems {
                credit,
                currency,
                dateStart,
                dateEnd,
                debtSum,
                rate,
              }
            },
            executive {
              color,
              status,
              statusMessage,
              procSumCaptions,
              calcReserveSum {
                value,
                currency,
                percent
              },
              realReserveSum {
                value,
                currency,
                percent
              },
              procutionSum{
                value,
                currency,
                percent
              },
            },
            legalChanges{
              color,
              status,
              statusMessage,
              fnsChangeCounter,
              lastThree {
                change,
                date
              }
            },
            owners{
              color,
              status,
              statusMessage,
              ceo,
              ceoDate,
              list {
                name,
                percent
              }
            },
            procution{
              color,
              status,
              statusMessage,
              procSumCaptions,
              procutionSum{
                value,
                currency
              },
            },
            procutionDetailed{
              items{
                caption,
                items{
                 currency,
                  value
                }
              }
              totalSum
            }
            reserves{
              color,
              status,
              statusMessage,
              procSumCaptions,
              calcReserveSum {
                value,
                currency,
                percent
              },
              realReserveSum{
                value,
                currency,
                percent
              },
              procutionSum{
                value,
                currency,
                percent
              },
            },
            indicators {
              color,
              block,
              help_text,
              icon,
              name,
              title
            }
          }
        },
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
      }
    `,
  }
});
