import React from 'react';
import './Money.styl'
import {Tabs, Tab, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter, Dialog, FlatButton  } from 'material-ui'
import Utils from '../../../lib/Utils.js'
import Loading from 'app/components/dumb/Loading.jsx';
import PieChart from '../Charts/PieChart.jsx';
import './InOtherBanks.styl';

let utils = new Utils();


class InOtherBanks extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fixedHeader: true,
			fixedFooter: true,
			stripedRows: false,
			showRowHover: false,
			selectable: true,
			multiSelectable: false,
			enableSelectAll: false,
			deselectOnClickaway: true,
      floatHeaderTab1: { display:'none'},
      floatHeaderTab2: { position:'fixed', display:'none', top:'64px' },
      showTab: 0
//			height: '300px',
		}
	}

	static contextTypes = {
		history: React.PropTypes.object.isRequired,
		location: React.PropTypes.object.isRequired,
		muiTheme: React.PropTypes.object.isRequired
	};

  componentDidMount() {
    window.addEventListener('scroll', this._scrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._scrollHandler);
  }

  _scrollHandler = () =>{
    let el = document.getElementsByClassName('floatHeaderTab1')[0];
    let headers = document.getElementsByClassName('fixedHeader');
    let tabIndex  = this.state.showTab;

    if( el.getBoundingClientRect().top <= 64 ){
      for (let i = 0; i < headers.length; i++) {
        if( tabIndex === i ) headers[i].style.display="block";
      }
    } else {
      for (let i = 0; i < headers.length; i++) {
        headers[i].style.display="none";
      }
    }
  };

  _tabChange=(a,b,c)=>{
    this.setState({showTab:c.props.tabIndex});
  };

	render() {
//    console.log('props', this.props.data.livingMoneyOtherBanks);

		let style={
			chartPlace:{display:'inline-block', width:'400px', verticalAlign:'top', margin:'0 20px 40px'},
			charts:{textAlign:'center'},
			chartTile:{textAlign:'center', margin: '20px 0', minHeight:'48px'},
		};

		if(this.props.data&& this.props.data.livingMoneyOtherBanks) {
      let general = this.props.data.livingMoneyOtherBanks.generalInformation; //
			var foca = this.props.data.livingMoneyOtherBanks.fundsOnCorrespondentAccountInOtherBanks; //Средства на корсчетах в других Банках
//			var qStr = this.props.data.livingMoneyOtherBanks.qualityStructure; //Структура качества
			var mStr = this.props.data.livingMoneyOtherBanks.municipalStructure; //Муниципальная структура

      let pieOptions = {
        showTooltips: true,
				tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> %",
        onAnimationComplete: function(){ this.showTooltip(this.segments, true); },
        tooltipEvents: [],
				multiTooltipTemplate: "<%= value %> %",
			};

			let pieOptionsForDonut1 = {
        tooltipTemplate: "<%= label %> : <%= value %> %",
        showTooltips: true,
        onAnimationComplete: function(){ this.showTooltip(this.segments, true); },
        tooltipEvents: [],
				multiTooltipTemplate: "<%= Math.round(value/1000000) %> млн. ₽",
			};

			//var donut1 = [
			//	{
			//		value: 0,
			//		color: "#F7464A",
			//		highlight: "#FF5A5E",
			//		label: "Red"
			//	},
			//	{
			//		value: 0,
			//		color: "#46BFBD",
			//		highlight: "#5AD3D1",
			//		label: "Green"
			//	},
			//	{
			//		value: 0,
			//		color: "#FDB45C",
			//		highlight: "#FFC870",
			//		label: "Yellow"
			//	},
			//	{
			//		value: 0,
			//		color: "#F0B45C",
			//		highlight: "#F0C870",
			//		label: "Yellow"
			//	},
			//	{
			//		value: 0,
			//		color: "#0DB45C",
			//		highlight: "#0FC870",
			//		label: "Yellow"
			//	}
			//];

      let ChartData = function(labels, colors, pieData) {
        this.labels = labels;
        this.colors = colors||[];
        this.pieData = pieData;
      };

      let others = 0;
      let labels = foca.map((el)=>{
        if(el.sum.percent > 3){
          return el.bankTitle + ': ' + el.sum.percent;
        } else {
          others += +el.sum.percent;
        }
      });
      labels = labels.filter(function(n){ if(n) return n });
      if(others) labels.push("другие: "+(others).toFixed(2) );

      let chartData1 = new ChartData( labels, [],
        labels.map((el)=>{
          return { label: el+'%', value: Number( el.split(':')[1] ) }
        })
      );

      //labels =[
      //  'Высокое' + ': ' + (Number(qStr.high.percent).toFixed(2)),
      //  'Среднее' + ': ' + (Number(qStr.medium.percent).toFixed(2)),
      //  'Низкое' + ': ' + (Number(qStr.low.percent).toFixed(2))
      //];
			//
      //let chartData2 = new ChartData( labels, [],
      //  labels.map((el)=>{
      //    return { label: el+'%', value: Number( el.split(':')[1] ) }
      //  })
      //);

      labels =[
        'Не гос.' + ': ' + (Number(mStr.nonState.percent).toFixed(2)),
        'Гос.' + ': ' + (Number(mStr.state.percent).toFixed(2))
      ];

      let chartData3 = new ChartData( labels, [],
        labels.map((el)=>{
          return { label: el+'%', value: Number( el.split(':')[1] ) }
        })
      );

			var focaArr = [];
			for (var i in foca) {
				if (foca[i].sum.percent > 1) {
					focaArr.push([Math.round(foca[i].sum.percent), foca[i].bankTitle]);
				}
			}
			focaArr.sort(function (a, b) {
				return a[1] - b[1]
			});

			return (
				<div>
          <div className="pageDate">{utils.dsn(this.props.date)}</div>
					<div style={style.charts}>
						<div style={style.chartPlace}>
							<div style={style.chartTile}>Структура средств на корсчетах в других банках</div>
              <PieChart chartUnicName="donut1" width="520" height="250" data={chartData1} />
						</div>
            {/*
						<div style={style.chartPlace}>
							<div style={style.chartTile}>Структура качества</div>
              <PieChart chartUnicName="donut2" width="420" height="250" data={chartData2} />
						</div>
             */}
						<div style={style.chartPlace}>
							<div style={style.chartTile}>Муниципальная структура</div>
              <PieChart chartUnicName="donut3" width="400" height="250" data={chartData3} />
						</div>
					</div>
					<Tabs onChange={this._tabChange}>

            <Tab label="Кор.счета в кред. огранизациях корреспондентах">
              <div className="fixedHeader">
                <Table>
                  <TableHeader enableSelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn >Наименование</TableHeaderColumn>
                      <TableHeaderColumn >Сумма тыс.руб.</TableHeaderColumn>
                      <TableHeaderColumn >гос/негос</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody></TableBody>
                </Table>
              </div>

              <Table className="floatHeaderTab1"
                height={this.state.height}
                fixedHeader={this.state.fixedHeader}
                fixedFooter={this.state.fixedFooter}
                selectable={false}
                onRowSelection={this._onRowSelectio}>
                <TableHeader enableSelectAll={false}>

                  <TableRow>
                    <TableHeaderColumn >Наименование</TableHeaderColumn>
                    <TableHeaderColumn >Сумма тыс.руб.</TableHeaderColumn>
                    <TableHeaderColumn >гос/негос</TableHeaderColumn>
                  </TableRow>

                </TableHeader>

                <TableBody
                  deselectOnClickaway={this.state.deselectOnClickaway}
                  showRowHover={this.state.showRowHover}
                  stripedRows={this.state.stripedRows}>

                  {general.map((el) =>{
                    return(
                    <TableRow selected={false}>
                      <TableRowColumn>{el.bankTitle}</TableRowColumn>
                      <TableRowColumn>{utils.dm(el.sumTotal.value)} </TableRowColumn>
                      <TableRowColumn>{el.isState?'гос.':'негос.'}</TableRowColumn>
                    </TableRow>
                      )})}
                  <TableRow selected={false}>
                    <TableHeaderColumn>Итого:</TableHeaderColumn>
                    <TableHeaderColumn>{
                      utils.dm( general.reduce((a,b)=>{
                        if('object' !== typeof a){
                          return Number(a) + Number(b.sumTotal.value);
                          } else {
                          return Number(b.sumTotal.value);
                          }
                        }) )
                      }
                    </TableHeaderColumn>
                    <TableHeaderColumn></TableHeaderColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </Tab>

						<Tab label="Структура средств на корсчетах в других банках">

              <div className="fixedHeader">
                <Table>
                  <TableHeader enableSelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn >Банк</TableHeaderColumn>
                      <TableHeaderColumn >Сумма тыс.руб.</TableHeaderColumn>
                      <TableHeaderColumn >Доля %</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody></TableBody>
                </Table>
              </div>

							<Table
								height={this.state.height}
								fixedHeader={this.state.fixedHeader}
								fixedFooter={this.state.fixedFooter}
								selectable={false}
								onRowSelection={this._onRowSelectio}>
								<TableHeader enableSelectAll={false}>

									<TableRow>
										<TableHeaderColumn >Банк</TableHeaderColumn>
										<TableHeaderColumn >Сумма тыс.руб.</TableHeaderColumn>
										<TableHeaderColumn >Доля %</TableHeaderColumn>
									</TableRow>

								</TableHeader>

								<TableBody
									deselectOnClickaway={this.state.deselectOnClickaway}
									showRowHover={this.state.showRowHover}
									stripedRows={this.state.stripedRows}>

									{Object.keys(foca).map((value, index) =>{
										return(
											<TableRow selected={false}>
												<TableRowColumn>{foca[index].bankTitle}</TableRowColumn>
												<TableRowColumn>{utils.dm( foca[index].sum.value )} </TableRowColumn>
												<TableRowColumn>{foca[index].sum.percent}</TableRowColumn>
											</TableRow>
										)})}

                  <TableRow selected={false}>
                    <TableHeaderColumn>Итого:</TableHeaderColumn>
                    <TableHeaderColumn>{
                      utils.dm( foca.reduce((a,b)=>{
                        if('object' !== typeof a){
                          return Number(a) + Number(b.sum.value);
                          } else {
                          return Number(b.sum.value);
                          }
                        }) )
                      }
                    </TableHeaderColumn>
                    <TableHeaderColumn>100</TableHeaderColumn>
                  </TableRow>


								</TableBody>
							</Table>
						</Tab>
            {/*
						<Tab label="Структура качества">
							<Table
								height={this.state.height}
								fixedHeader={this.state.fixedHeader}
								fixedFooter={this.state.fixedFooter}
								selectable={false}
								onRowSelection={this._onRowSelectio}>
								<TableHeader enableSelectAll={false}>
									<TableRow>
										<TableHeaderColumn >Качество</TableHeaderColumn>
										<TableHeaderColumn >Сумма</TableHeaderColumn>
										<TableHeaderColumn >Доля</TableHeaderColumn>
									</TableRow>
								</TableHeader>

								<TableBody
									deselectOnClickaway={this.state.deselectOnClickaway}
									showRowHover={this.state.showRowHover}
									stripedRows={this.state.stripedRows}>

									<TableRow selected={false}>
										<TableRowColumn>высокое</TableRowColumn>
										<TableRowColumn>{utils.dm(qStr.high.value,0,'','',utils.ct(qStr.high.currency))} </TableRowColumn>
										<TableRowColumn>{ parseFloat(qStr.high.percent).toFixed(2) } %</TableRowColumn>
									</TableRow>
									<TableRow selected={false}>
										<TableRowColumn>среднее</TableRowColumn>
										<TableRowColumn>{utils.dm(qStr.medium.value,0,'','',utils.ct(qStr.medium.currency))}</TableRowColumn>
										<TableRowColumn>{ parseFloat(qStr.medium.percent).toFixed(2) }%</TableRowColumn>
									</TableRow>
									<TableRow selected={false}>
										<TableRowColumn>низкое</TableRowColumn>
										<TableRowColumn>{utils.dm(qStr.low.value,0,'','',utils.ct(qStr.low.currency))}</TableRowColumn>
										<TableRowColumn>{ parseFloat(qStr.low.percent).toFixed(2) }%</TableRowColumn>
									</TableRow>


								</TableBody>
							</Table>
						</Tab>
             */}

						<Tab
							label="Муниципальная структура"
							route="home"
							onActive={this._handleTabActive}>
							<Table
								height={this.state.height}
								fixedHeader={this.state.fixedHeader}
								fixedFooter={this.state.fixedFooter}
								selectable={false}
								onRowSelection={this._onRowSelectio}>
								<TableHeader enableSelectAll={false}>

									<TableRow>
										<TableHeaderColumn >Качество</TableHeaderColumn>
										<TableHeaderColumn >Сумма тыс.руб.</TableHeaderColumn>
										<TableHeaderColumn >Доля %</TableHeaderColumn>
									</TableRow>

								</TableHeader>

								<TableBody
									deselectOnClickaway={this.state.deselectOnClickaway}
									showRowHover={this.state.showRowHover}
									stripedRows={this.state.stripedRows}>

									<TableRow selected={false}>
										<TableRowColumn>государственные</TableRowColumn>
										<TableRowColumn>{utils.dm(mStr.state.value)} </TableRowColumn>
										<TableRowColumn>{ parseFloat(mStr.state.percent).toFixed(2)}</TableRowColumn>
									</TableRow>
									<TableRow selected={false}>
										<TableRowColumn>негосударственные</TableRowColumn>
										<TableRowColumn>{utils.dm(mStr.nonState.value)}</TableRowColumn>
										<TableRowColumn>{ parseFloat(mStr.nonState.percent).toFixed(2)}</TableRowColumn>
									</TableRow>

								</TableBody>
							</Table>
						</Tab>
					</Tabs>
				</div>
			);
		} else {
			return (<Loading />);
		}
	}
}

export default InOtherBanks