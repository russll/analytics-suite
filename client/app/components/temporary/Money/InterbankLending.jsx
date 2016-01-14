import React from 'react';

import './Money.styl'
import {Tabs, Tab, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter, Dialog, FlatButton  } from 'material-ui'
import Loading from 'app/components/dumb/Loading.jsx';
import Utils from '../../../lib/Utils.js'
import PieChart from '../Charts/PieChart.jsx';
import './InterbankLending.styl';

let u = new Utils();

class InterbankLending extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fixedHeader: false,
			fixedFooter: true,
			stripedRows: false,
			showRowHover: false,
			selectable: true,
			multiSelectable: false,
			enableSelectAll: false,
			deselectOnClickaway: true,
			modalIntLendData: {}
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
    let thead = document.getElementsByClassName('tableHeader')[0];
    let tgreed = document.getElementsByClassName('grid')[0];
    let tgreedTop = tgreed.getBoundingClientRect().top;
    let firstTr = document.getElementsByClassName('tableRow')[0];

    if(tgreedTop<64) {
      thead.classList.add("fixHeader");
      firstTr.classList.add("first");
    } else {
      thead.classList.remove("fixHeader");
      firstTr.classList.remove("first");
    }
  };

	render() {
		var intLend = this.props.modalIntLendData.livingMoneyInterbankLending;
    let labels = ['Гос: ' + Number(intLend.state.percent).toFixed(2)+'%', 'Негос: ' + Number(intLend.nonState.percent).toFixed(2)+'%' ];

    let style = {
      tdShort:{width:'80px', padding:'0 10px'},
      tdNorm:{width:'115px', padding:'0 10px'},
      tdLong:{width:'243px',minWidth:'243px', padding:'0 10px'}
    };
    let chartData = {
      labels: labels,
      colors: ["#FF5A5E","#46BFBD"],   //
      pieData:  labels.map((el)=>{
        return { label: el, value: Number( el.split(':')[1].split('%')[0])  };
      })
    };

		return (

			<div>
        <div className="pageDate">{u.dsn(this.props.date)}</div>
				<div style={{ float:"left", margin:"20px 180px 0 0"}}>
          <PieChart chartUnicName="mainChart123" width="340" height="200" data={chartData} />
          {/* <Doughnut data={donut1} width="300" height="200" options={pieOptions}/> */}
				</div>

				<div style={{width:"350px", display:"inline-block", marginTop:"34px"}}>
					<Table height="250px" fixedHeader={this.state.fixedHeader}
						fixedFooter={this.state.fixedFooter}
						selectable={false}>

						<TableHeader enableSelectAll={false} style={{display:"none"}}>

							<TableRow>
								<TableHeaderColumn tooltip='The ID'>.</TableHeaderColumn>
								<TableHeaderColumn tooltip='The Name'>.</TableHeaderColumn>
								<TableHeaderColumn tooltip='The Status'>.</TableHeaderColumn>
							</TableRow>

						</TableHeader>

						<TableBody
							deselectOnClickaway={this.state.deselectOnClickaway}
							showRowHover={this.state.showRowHover}
							stripedRows={this.state.stripedRows}>

							<TableRow>
								<TableHeaderColumn >Суммарный портфель</TableHeaderColumn>
								<TableRowColumn  style={{padding: '0 10px'}}>{ u.dm(intLend.total.value) } тыс. руб.</TableRowColumn>
							</TableRow>

							<TableRow>
								<TableHeaderColumn >Срвзв. ст.</TableHeaderColumn>
								<TableRowColumn style={{padding: '0 10px'}}>{Number(intLend.weightedAverageRate).toFixed(2)} %</TableRowColumn>
							</TableRow>

							<TableRow>
								<TableHeaderColumn >Суммарный доход</TableHeaderColumn>
								<TableRowColumn  style={{padding: '0 10px'}}>{u.dm(intLend.totalIncome.value)} тыс. руб.</TableRowColumn>
							</TableRow>

						</TableBody>
					</Table>
				</div>

				<div>
          <table className="grid">
            <tbody>
            <tr className="tableHeader">
              <th style={style.tdLong}>Контрагент</th>
              <th style={style.tdNorm}>Сумма тыс.руб.</th>
              <th style={style.tdNorm}>Дата размещения</th>
              <th style={style.tdNorm}>Дата возврата</th>
              <th style={style.tdShort}>Кол-во дней</th>
              <th style={style.tdShort}>Ставка в %</th>
              <th style={style.tdNorm}>Доход тыс.руб.</th>
              <th style={style.tdShort}>Гос/Негос</th>
            </tr>
              {Object.keys(intLend.counteragents).map((value, index) => {
                var cAgents = intLend.counteragents[index];
                return(
                <tr className="tableRow">
                  <td className="alignLeft" style={style.tdLong}>{cAgents.bankTitle}</td>
                  <td style={style.tdNorm}>{u.dm(cAgents.sum.value)} </td>
                  <td style={style.tdNorm}>{u.dsn(cAgents.placementDate)}</td>
                  <td style={style.tdNorm}>{u.dsn(cAgents.returnDate)}</td>
                  <td style={style.tdShort}>{cAgents.daysCount}</td>
                  <td style={style.tdShort}>{cAgents.interestRate}</td>
                  <td style={style.tdNorm}>{u.dm(cAgents.income.value)}</td>
                  <td style={style.tdShort}>{cAgents.isState?'гос':'негос'}</td>
                </tr>
                  )})
                }
            </tbody>
          </table>
				</div>

			</div>
		);
	}
}

export default InterbankLending