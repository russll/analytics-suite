import React from 'react';

import './Money.styl'
import {Tabs, Tab,List, ListItem, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter, Dialog, FlatButton  } from 'material-ui';
import Loading from 'app/components/dumb/Loading.jsx';
import Utils from '../../../lib/Utils.js'
import PieChart from '../Charts/PieChart.jsx';
import './InOtherBanks.styl';

let u = new Utils();



class Securities extends React.Component {

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
			modalSecurData: {}
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

    let el = document.getElementsByClassName('floatHeader')[0];
    let headers = document.getElementsByClassName('fixedHeader');

    if( el.getBoundingClientRect().top <= 64 ){
      for (let i = 0; i < headers.length; i++) {
        headers[i].style.display="block";
      }
    } else {
      for (let i = 0; i < headers.length; i++) {
        headers[i].style.display="none";
      }
    }
  };

	render() {

		let style = {
			nodata: {
				padding: '100px',
				textAlign:'center'
			},
			list:{
        width: '386px',
        display: 'inline-block',
        margin: '80px 60px 0',
        verticalAlign: 'top'
			}
		};

		if(!this.props.modalSecurData.livingMoneySecurities) return( <div style={style.nodata}>No data</div> );
		var Secur = this.props.modalSecurData.livingMoneySecurities;


		let pieOptions = {
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= Math.round(value/1000000) %> млн. ₽",
      showTooltips: true,
      onAnimationComplete: function(){ this.showTooltip(this.segments, true); },
      tooltipEvents: []
		};

    let labels = ["Гос. : "+(Number(Secur.state.percent).toFixed(2)), "Негос. : "+(Number(Secur.nonState.percent).toFixed(2))];
    let chartData = {
      labels: labels,
      colors: [],
      pieData: labels.map((el)=>{
        return { label: el+'%', value: Number( el.split(':')[1] ) }
      })

    };

		return (

      <div>
        <div className="pageDate">{u.dsn(this.props.date)}</div>
        <div style={style.list}>
          <Table
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={false}>
            <TableHeader enableSelectAll={false} style={{display:"none"}}>
              <TableRow>
                <TableHeaderColumn tooltip='The ID'>.</TableHeaderColumn>
                <TableHeaderColumn tooltip='The Name'>.</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableHeaderColumn>Всего</TableHeaderColumn><TableRowColumn >{u.dm(Secur.total.value)}</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>Государственные</TableHeaderColumn><TableRowColumn >{u.dm(Secur.state.value)}</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>Негосударственные</TableHeaderColumn><TableRowColumn >{u.dm(Secur.nonState.value)}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>

				<div style={{width:"400px", display:"inline-block", textAligin:'center'}}>
          <div style={{textAlign:'center', margin:'20px 0'}}>Ценные бумаги (с учетом 12,8% дисконта)</div>
          <PieChart chartUnicName="donut2" width="420" height="250" data={chartData} />
				</div>
				<div>

        <div className="fixedHeader">
          <Table>
            <TableHeader enableSelectAll={false}>
              <TableRow>
                <TableHeaderColumn >Наименование банка</TableHeaderColumn>
                <TableHeaderColumn >Сумма тыс.руб.</TableHeaderColumn>
                <TableHeaderColumn >гос./негос.</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>

					<Table className = "floatHeader"
						fixedHeader={this.state.fixedHeader}
						fixedFooter={this.state.fixedFooter}
						selectable={false}
						onRowSelection={this._onRowSelection}>

						<TableHeader enableSelectAll={false} >

							<TableRow>
								<TableHeaderColumn tooltip='Наименование банка'>Наименование банка</TableHeaderColumn>
								<TableHeaderColumn tooltip='Сумма тыс.руб.'>Сумма тыс.руб.</TableHeaderColumn>
								<TableHeaderColumn tooltip='гос./негос.'>гос./негос.</TableHeaderColumn>
							</TableRow>

						</TableHeader>

						<TableBody
							deselectOnClickaway={this.state.deselectOnClickaway}
							showRowHover={this.state.showRowHover}
							stripedRows={this.state.stripedRows}>

							{Object.keys(Secur.securities).map((value, index) => {
								var SecurIndex = Secur.securities[index]
								return(
									<TableRow>
										<TableRowColumn >{SecurIndex.name}</TableRowColumn>
										<TableRowColumn >{u.dm(SecurIndex.price.value)}</TableRowColumn>
										<TableRowColumn >{SecurIndex.isState?'гос':'негос'}</TableRowColumn>
									</TableRow>
								)})
							}
						</TableBody>
					</Table>
				</div>


			</div>
		);
	}
}

export default Securities